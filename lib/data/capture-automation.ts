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

const PROVIDER_LABELS: Record<string, string> = {
  olx: "OLX",
  zap: "ZAP Imóveis",
  imovelweb: "Imovelweb",
  "chaves-na-mao": "Chaves na Mão",
  "facebook-marketplace": "Facebook Marketplace"
};

function plural(value: number, singular: string, pluralLabel: string) {
  return `${value} ${value === 1 ? singular : pluralLabel}`;
}

function buildRunMessage(input: {
  found: number;
  imported: number;
  skippedExisting: number;
  skippedPrivate: number;
  skippedFullAddress: number;
  skippedPrice: number;
  failed: number;
  provider: string;
  diagnostics?: {
    blockedMarker: string | null;
    candidateLinkCount: number;
    hasResultSignal: boolean;
  };
}) {
  if (input.found === 0) {
    const providerLabel = PROVIDER_LABELS[input.provider] ?? input.provider;
    if (input.diagnostics?.blockedMarker) {
      return `${providerLabel} bloqueou a leitura automática (${input.diagnostics.blockedMarker}). Use "Captura do navegador" para importar os anúncios.`;
    }
    if (input.diagnostics?.hasResultSignal || input.diagnostics?.candidateLinkCount === 0) {
      return `A busca da ${providerLabel} foi aberta, mas nenhum anúncio foi lido automaticamente. O portal pode ter alterado ou bloqueado a página; use "Captura do navegador" para importar.`;
    }
    return `Nenhum anúncio encontrado na busca da ${providerLabel}.`;
  }

  const parts: string[] = [];
  if (input.imported > 0) parts.push(`${plural(input.imported, "importado/atualizado", "importados/atualizados")}`);
  if (input.skippedPrivate > 0) parts.push(`${plural(input.skippedPrivate, "ignorado", "ignorados")} por não parecer particular`);
  if (input.skippedFullAddress > 0) parts.push(`${plural(input.skippedFullAddress, "ignorado", "ignorados")} sem endereço completo`);
  if (input.skippedPrice > 0) parts.push(`${plural(input.skippedPrice, "ignorado", "ignorados")} fora da faixa de preço`);
  if (input.skippedExisting > 0) parts.push(`${plural(input.skippedExisting, "já estava", "já estavam")} na fila`);
  if (input.failed > 0) parts.push(`${plural(input.failed, "falhou", "falharam")}`);

  return parts.length ? `${input.found} encontrados; ${parts.join("; ")}.` : `${input.found} encontrados; nada novo para importar.`;
}

function parseBrowserPrice(value: string | null | undefined) {
  const text = value?.trim() ?? "";
  const match = text.match(/R\$\s*([\d.,]+)\s*(milh[aã]o|milh[oõ]es|mil)?/i);
  if (!match) return null;

  const normalized = match[1].includes(",")
    ? match[1].replace(/\./g, "").replace(",", ".")
    : match[1].replace(/\.(?=\d{3}(?:\D|$))/g, "");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  if (/milh/i.test(match[2] ?? "")) return parsed * 1_000_000;
  if (/mil/i.test(match[2] ?? "")) return parsed * 1_000;
  return parsed;
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
    const addressFilteredItems = alert.onlyFullAddress
      ? privateFilteredItems.filter((item) => Boolean(item.address?.trim()))
      : privateFilteredItems;
    const skippedFullAddressCount = privateFilteredItems.length - addressFilteredItems.length;
    const priceFilteredItems = addressFilteredItems.filter((item) => {
      if (alert.priceMin === null && alert.priceMax === null) return true;
      const price = parseBrowserPrice(item.price);
      if (price === null) return false;
      if (alert.priceMin !== null && price < Number(alert.priceMin)) return false;
      if (alert.priceMax !== null && price > Number(alert.priceMax)) return false;
      return true;
    });
    const skippedPriceCount = addressFilteredItems.length - priceFilteredItems.length;
    const urls = priceFilteredItems.map((item) => item.sourceUrl).filter(Boolean);
    const existing = urls.length
      ? await prisma.capturedListing.findMany({
          where: { sourceUrl: { in: urls } },
          select: { sourceUrl: true }
        })
      : [];
    const existingUrls = new Set(existing.map((item) => item.sourceUrl).filter(Boolean));
    const itemsToImport = priceFilteredItems.filter((item) => !existingUrls.has(item.sourceUrl));
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
    const skippedExistingCount = priceFilteredItems.length - itemsToImport.length;
    const skippedCount = skippedPrivateCount + skippedFullAddressCount + skippedPriceCount + skippedExistingCount;
    const message = buildRunMessage({
      found: search.items.length,
      imported: imported.importedCount,
      skippedExisting: skippedExistingCount,
      skippedPrivate: skippedPrivateCount,
      skippedFullAddress: skippedFullAddressCount,
      skippedPrice: skippedPriceCount,
      failed: imported.failedCount,
      provider: alert.provider,
      diagnostics: search.diagnostics
    });
    const status = imported.failedCount > 0 || search.items.length === 0 ? "warning" : "success";
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
            skippedFullAddressCount,
            skippedPriceCount,
            onlyPrivateSeller: alert.onlyPrivateSeller,
            onlyFullAddress: alert.onlyFullAddress,
            priceMin: alert.priceMin,
            priceMax: alert.priceMax,
            failedCount: imported.failedCount,
            diagnostics: search.diagnostics,
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
