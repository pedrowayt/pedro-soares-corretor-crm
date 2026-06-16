import { Prisma, PropertyPurpose, PropertyType } from "@prisma/client";
import {
  normalizeCaptureAlert,
  type CaptureAlertRunResult,
  type CaptureListingItem
} from "@/lib/data/capture";
import { importBrowserCapturedListings, isBrowserCapturedPrivateSeller } from "@/lib/integrations/browser-capture";
import { scrapePortalSearchWithBrowser } from "@/lib/integrations/browser-runner";
import type { CapturePortalProviderId } from "@/lib/integrations/olx-capture";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

function plural(value: number, singular: string, pluralLabel: string) {
  return `${value} ${value === 1 ? singular : pluralLabel}`;
}

function buildRunMessage(input: { found: number; imported: number; skippedExisting: number; skippedPrivate: number; failed: number }) {
  if (input.found === 0) return "Nenhum anúncio encontrado na busca.";

  const parts: string[] = [];
  if (input.imported > 0) parts.push(`${plural(input.imported, "importado/atualizado", "importados/atualizados")}`);
  if (input.skippedPrivate > 0) parts.push(`${plural(input.skippedPrivate, "ignorado", "ignorados")} por não parecer particular`);
  if (input.skippedExisting > 0) parts.push(`${plural(input.skippedExisting, "já estava", "já estavam")} na fila`);
  if (input.failed > 0) parts.push(`${plural(input.failed, "falhou", "falharam")}`);

  return parts.length ? `${input.found} encontrados; ${parts.join("; ")}.` : `${input.found} encontrados; nada novo para importar.`;
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

export async function runBrowserCaptureAlert(alertId: string, actorId?: string | null): Promise<CaptureAlertRunResult> {
  if (!hasDatabase) {
    throw new Error("Banco de dados não configurado para captação automática.");
  }

  const alert = await prisma.captureAlert.findUnique({ where: { id: alertId } });
  if (!alert) throw new Error("Monitoramento de captação não encontrado.");
  if (!alert.searchUrl) throw new Error("Informe uma URL de busca para executar o monitoramento.");

  try {
    const search = await scrapePortalSearchWithBrowser(alert.searchUrl, alert.maxResultsPerRun, alert.provider);
    const privateFilteredItems = alert.onlyPrivateSeller
      ? search.items.filter((item) => isBrowserCapturedPrivateSeller(item))
      : search.items;
    const skippedPrivateCount = search.items.length - privateFilteredItems.length;
    const urls = privateFilteredItems.map((item) => item.sourceUrl).filter(Boolean);
    const existing = urls.length
      ? await prisma.capturedListing.findMany({
          where: { sourceUrl: { in: urls } },
          select: { sourceUrl: true }
        })
      : [];
    const existingUrls = new Set(existing.map((item) => item.sourceUrl).filter(Boolean));
    const itemsToImport = privateFilteredItems.filter((item) => !existingUrls.has(item.sourceUrl));
    const imported = await importBrowserCapturedListings(
      {
        provider: alert.provider as CapturePortalProviderId,
        items: itemsToImport,
        city: alert.city,
        district: alert.district,
        purpose: alert.purpose ?? PropertyPurpose.VENDA,
        type: alert.type ?? PropertyType.CASA
      },
      actorId
    );
    const skippedExistingCount = privateFilteredItems.length - itemsToImport.length;
    const skippedCount = skippedPrivateCount + skippedExistingCount;
    const message = buildRunMessage({
      found: search.items.length,
      imported: imported.importedCount,
      skippedExisting: skippedExistingCount,
      skippedPrivate: skippedPrivateCount,
      failed: imported.failedCount
    });
    const status = imported.failedCount > 0 ? "warning" : "success";
    const updatedAlert = await updateAlertRunStatus(alert.id, {
      status,
      message,
      foundCount: search.items.length,
      importedCount: imported.importedCount,
      failedCount: imported.failedCount
    });

    await prisma.auditLog
      .create({
        data: {
          action: "CAPTURE_ALERT_BROWSER_RUN",
          resource: "CaptureAlert",
          resourceId: alert.id,
          actorId: actorId ?? undefined,
          metadata: {
            provider: alert.provider,
            searchUrl: alert.searchUrl,
            finalUrl: search.finalUrl,
            foundCount: search.items.length,
            importedCount: imported.importedCount,
            skippedCount,
            skippedExistingCount,
            skippedPrivateCount,
            onlyPrivateSeller: alert.onlyPrivateSeller,
            failedCount: imported.failedCount,
            mode: "browser"
          } as Prisma.InputJsonValue
        }
      })
      .catch(() => null);

    return {
      alert: updatedAlert,
      listings: imported.listings,
      foundCount: search.items.length,
      importedCount: imported.importedCount,
      skippedCount,
      failedCount: imported.failedCount,
      errors: imported.errors
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao executar monitoramento com navegador.";
    const updatedAlert = await updateAlertRunStatus(alert.id, {
      status: "error",
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

export async function runActiveBrowserCaptureAlerts(options: { maxAlerts?: number; actorId?: string | null } = {}) {
  if (!hasDatabase) return { results: [] as CaptureAlertRunResult[] };

  const requestedMaxAlerts = Number.isFinite(options.maxAlerts) ? options.maxAlerts : 5;
  const maxAlerts = Math.max(1, Math.min(10, Math.round(requestedMaxAlerts ?? 5)));
  const alerts = await prisma.captureAlert.findMany({
    where: { active: true, provider: { in: ["olx", "zap", "imovelweb", "chaves-na-mao", "facebook-marketplace"] }, searchUrl: { not: null } },
    orderBy: [{ lastRunAt: "asc" }, { createdAt: "asc" }],
    take: maxAlerts
  });

  const results: CaptureAlertRunResult[] = [];
  for (const alert of alerts) {
    try {
      results.push(await runBrowserCaptureAlert(alert.id, options.actorId));
    } catch {
      // runBrowserCaptureAlert persists the error status on the alert.
    }
  }

  return { results };
}
