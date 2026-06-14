import { Prisma } from "@prisma/client";
import {
  normalizeCaptureAlert,
  type CaptureAlertRunResult,
  type CaptureListingItem
} from "@/lib/data/capture";
import {
  importPortalCapturedListing,
  isPortalAccessBlockedError,
  scrapePortalSearchLinks
} from "@/lib/integrations/olx-capture";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

function buildRunMessage(input: { found: number; imported: number; skipped: number; failed: number }) {
  if (input.found === 0) return "Nenhum anúncio encontrado na busca.";
  if (input.imported === 0 && input.failed === 0) return `${input.found} encontrados; todos já estavam na fila.`;
  if (input.failed > 0) {
    return `${input.found} encontrados; ${input.imported} importados/atualizados; ${input.failed} falharam.`;
  }
  return `${input.found} encontrados; ${input.imported} importados/atualizados.`;
}

async function updateAlertRunStatus(
  alertId: string,
  input: {
    status: string;
    message: string;
    foundCount: number;
    importedCount: number;
    failedCount: number;
  }
) {
  const updated = await prisma.captureAlert.update({
    where: { id: alertId },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: input.status,
      lastRunMessage: input.message,
      lastRunFoundCount: input.foundCount,
      lastRunImportedCount: input.importedCount,
      lastRunFailedCount: input.failedCount
    }
  });

  return normalizeCaptureAlert(updated);
}

export async function runCaptureAlert(alertId: string, actorId?: string | null): Promise<CaptureAlertRunResult> {
  if (!hasDatabase) {
    throw new Error("Banco de dados não configurado para captação automática.");
  }

  const alert = await prisma.captureAlert.findUnique({ where: { id: alertId } });
  if (!alert) throw new Error("Monitoramento de captação não encontrado.");
  if (!alert.searchUrl) throw new Error("Informe uma URL de busca para executar o monitoramento.");

  try {
    const search = await scrapePortalSearchLinks(alert.searchUrl, alert.maxResultsPerRun, alert.provider);
    const existing = search.links.length
      ? await prisma.capturedListing.findMany({
          where: { sourceUrl: { in: search.links } },
          select: { sourceUrl: true }
        })
      : [];
    const existingUrls = new Set(existing.map((item) => item.sourceUrl).filter(Boolean));
    const linksToImport = search.links.filter((link) => !existingUrls.has(link));
    const listings: CaptureListingItem[] = [];
    const errors: string[] = [];

    for (const link of linksToImport) {
      try {
        listings.push(await importPortalCapturedListing(link, actorId, alert.provider));
      } catch (error) {
        errors.push(error instanceof Error ? `${link}: ${error.message}` : `${link}: falha ao importar`);
      }
    }

    const skippedCount = search.links.length - linksToImport.length;
    const message = buildRunMessage({
      found: search.links.length,
      imported: listings.length,
      skipped: skippedCount,
      failed: errors.length
    });
    const status = errors.length ? "warning" : "success";
    const updatedAlert = await updateAlertRunStatus(alert.id, {
      status,
      message,
      foundCount: search.links.length,
      importedCount: listings.length,
      failedCount: errors.length
    });

    await prisma.auditLog
      .create({
        data: {
          action: "CAPTURE_ALERT_RUN",
          resource: "CaptureAlert",
          resourceId: alert.id,
          actorId: actorId ?? undefined,
          metadata: {
            provider: alert.provider,
            searchUrl: alert.searchUrl,
            finalUrl: search.finalUrl,
            foundCount: search.links.length,
            importedCount: listings.length,
            skippedCount,
            failedCount: errors.length
          } as Prisma.InputJsonValue
        }
      })
      .catch(() => null);

    return {
      alert: updatedAlert,
      listings,
      foundCount: search.links.length,
      importedCount: listings.length,
      skippedCount,
      failedCount: errors.length,
      errors
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao executar monitoramento.";
    const blockedByPortal = isPortalAccessBlockedError(error);
    const updatedAlert = await updateAlertRunStatus(alert.id, {
      status: blockedByPortal ? "warning" : "error",
      message,
      foundCount: 0,
      importedCount: 0,
      failedCount: 1
    });

    return {
      alert: updatedAlert,
      listings: [],
      foundCount: 0,
      importedCount: 0,
      skippedCount: 0,
      failedCount: 1,
      errors: [message]
    };
  }
}

export async function runActiveCaptureAlerts(options: { maxAlerts?: number; actorId?: string | null } = {}) {
  if (!hasDatabase) return { results: [] as CaptureAlertRunResult[] };

  const maxAlerts = Math.max(1, Math.min(10, options.maxAlerts ?? 5));
  const alerts = await prisma.captureAlert.findMany({
    where: { active: true, provider: { in: ["olx", "zap", "imovelweb", "chaves-na-mao", "facebook-marketplace"] }, searchUrl: { not: null } },
    orderBy: [{ lastRunAt: "asc" }, { createdAt: "asc" }],
    take: maxAlerts
  });

  const results: CaptureAlertRunResult[] = [];
  for (const alert of alerts) {
    try {
      results.push(await runCaptureAlert(alert.id, options.actorId));
    } catch {
      // runCaptureAlert persists the error status on the alert.
    }
  }

  return { results };
}
