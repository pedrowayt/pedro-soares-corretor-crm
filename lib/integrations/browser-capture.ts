import { CaptureSourceKind, PropertyPurpose, PropertyType, type Prisma } from "@prisma/client";
import type { z } from "zod";
import { createCapturedListing, parseCapturePublishedAt, type CaptureListingItem } from "@/lib/data/capture";
import type { crmImportBrowserCapturedListingsSchema } from "@/lib/validation/schemas";

type BrowserCaptureInput = z.infer<typeof crmImportBrowserCapturedListingsSchema>;
type BrowserCaptureRawItem = NonNullable<BrowserCaptureInput["items"]>[number] & Record<string, unknown>;
type BrowserCapturePrivateCandidate = Record<string, unknown>;

const PROVIDER_LABELS: Record<string, string> = {
  olx: "OLX",
  zap: "ZAP Imóveis",
  imovelweb: "Imovelweb",
  "chaves-na-mao": "Chaves na Mão",
  "facebook-marketplace": "Facebook Marketplace"
};

function normalizeWhitespace(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? normalizeWhitespace(value) : "";
}

function parseBrazilianNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;

  const cleaned = value.replace(/[^\d,.-]/g, "");
  if (!cleaned) return null;
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned.replace(/\.(?=\d{3}(?:\D|$))/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parsePriceToken(value: string) {
  const millionMatch = value.match(/R\$\s*([\d.,]+)\s*(?:milh[aã]o|milh[oõ]es)/i);
  if (millionMatch) {
    const parsed = parseBrazilianNumber(millionMatch[1]);
    if (parsed) return parsed * 1_000_000;
  }

  const thousandMatch = value.match(/R\$\s*([\d.,]+)\s*mil\b/i);
  if (thousandMatch) {
    const parsed = parseBrazilianNumber(thousandMatch[1]);
    if (parsed) return parsed < 10_000 ? parsed * 1_000 : parsed;
  }

  const priceMatch = value.match(/R\$\s*[\d.,]+/i);
  return parseBrazilianNumber(priceMatch?.[0] ?? value);
}

function collectPriceCandidates(value: string) {
  const lines = value
    .split(/\n+|\s{2,}|\s+\|\s+/)
    .map(normalizeWhitespace)
    .filter(Boolean);
  const candidates: number[] = [];

  for (const line of lines.length ? lines : [value]) {
    const feeLike = /condom[ií]nio|iptu|taxa|seguro|m[²2]|por\s*m[²2]/i.test(line);
    const matches = line.match(/R\$\s*[\d.,]+(?:\s*(?:mil\b|milh[aã]o|milh[oõ]es))?/gi) ?? [];
    for (const match of matches) {
      const parsed = parsePriceToken(match);
      if (!parsed) continue;
      candidates.push(feeLike ? parsed * -1 : parsed);
    }
  }

  const preferred = candidates.filter((candidate) => candidate > 0);
  if (preferred.length) return preferred;
  return candidates.map(Math.abs).filter(Boolean);
}

function parsePrice(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
    if (typeof value !== "string") continue;

    const candidates = collectPriceCandidates(value);
    if (candidates.length) return Math.max(...candidates);

    const parsed = parsePriceToken(value);
    if (parsed) return parsed;
  }

  return null;
}

function toInt(value: unknown) {
  const parsed = parseBrazilianNumber(value);
  return parsed ? Math.round(parsed) : null;
}

function normalizeUrl(value: unknown) {
  const raw = optionalString(value);
  if (!raw) return "";

  try {
    const url = new URL(raw);
    url.hash = "";
    url.search = "";
    return url.toString();
  } catch {
    return "";
  }
}

function normalizeImageUrl(value: unknown) {
  const raw = optionalString(value);
  if (!raw) return "";

  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    return url.toString();
  } catch {
    return "";
  }
}

function providerFromUrl(urlValue: string, fallback?: string | null) {
  try {
    const hostname = new URL(urlValue).hostname.toLowerCase();
    if (hostname.includes("olx.com.br")) return "olx";
    if (hostname.includes("zapimoveis.com.br")) return "zap";
    if (hostname.includes("imovelweb.com.br")) return "imovelweb";
    if (hostname.includes("chavesnamao.com.br")) return "chaves-na-mao";
    if (hostname.includes("facebook.com")) return "facebook-marketplace";
  } catch {
    // Keep fallback below.
  }
  return fallback ?? "olx";
}

function inferPrivateSeller(text: string, advertiserName: string | null) {
  const haystack = `${text} ${advertiserName ?? ""}`.toLowerCase();
  if (!haystack.trim()) return false;

  const hasBrokerSignal =
    /imobili[aá]ria|im[oó]veis|corretor(?:a)?|creci|consultor(?:a)? imobili[aá]ri[oa]|remax|re\/max|lopes|ltda|neg[oó]cios imobili[aá]rios|anunciante profissional/.test(
      haystack
    );
  const hasPrivateSignal = /propriet[aá]ri[oa]|particular|direto com|direto c\/?|dono|venda direta/.test(haystack);

  return hasPrivateSignal || !hasBrokerSignal;
}

export function isBrowserCapturedPrivateSeller(item: BrowserCapturePrivateCandidate) {
  if (typeof item.isPrivateSeller === "boolean") return item.isPrivateSeller;

  const advertiserName =
    optionalString(item.advertiserName) ||
    optionalString(item.sellerName) ||
    optionalString(item.advertiser) ||
    optionalString(item.seller) ||
    null;
  const text = [
    item.title,
    item.name,
    item.description,
    item.rawText,
    item.text,
    item.location,
    advertiserName
  ]
    .map(optionalString)
    .filter(Boolean)
    .join(" ");

  return inferPrivateSeller(text, advertiserName);
}

function inferType(text: string, fallback: PropertyType) {
  const lower = text.toLowerCase();
  if (/apartamento|apto\b/.test(lower)) return PropertyType.APARTAMENTO;
  if (/terreno|lote/.test(lower)) return /condom[ií]nio/.test(lower) ? PropertyType.LOTE_EM_CONDOMINIO : PropertyType.LOTE;
  if (/sobrado/.test(lower)) return PropertyType.SOBRADO;
  if (/ch[aá]cara/.test(lower)) return PropertyType.CHACARA;
  if (/fazenda/.test(lower)) return PropertyType.FAZENDA;
  if (/sala|loja|comercial|galp[aã]o/.test(lower)) return PropertyType.COMERCIAL;
  return fallback;
}

function extractExternalId(url: string) {
  return (
    url.match(/\/marketplace\/item\/(\d+)/i)?.[1] ??
    url.match(/\bid-(\d{5,})/i)?.[1] ??
    url.match(/-(\d{5,})(?:[/?#.]|$)/)?.[1] ??
    url.match(/\/(\d{5,})(?:[/?#]|$)/)?.[1] ??
    null
  );
}

function parseLocation(value: unknown, fallbackCity: string, fallbackDistrict?: string | null) {
  const raw = optionalString(value);
  if (!raw) return { city: fallbackCity, district: optionalString(fallbackDistrict) || "A confirmar" };

  const normalized = raw.replace(/\s*[-/]\s*(TO|GO|SP|RJ|DF|MG|PA|MA|BA|PR|SC|RS)\b/gi, "");
  const parts = normalized.split(",").map(normalizeWhitespace).filter(Boolean);
  if (parts.length >= 2) {
    return {
      district: parts[0],
      city: parts[1]
    };
  }

  if (/palmas/i.test(normalized)) {
    return { city: "Palmas", district: optionalString(fallbackDistrict) || "A confirmar" };
  }

  return { city: fallbackCity, district: normalized || optionalString(fallbackDistrict) || "A confirmar" };
}

function parseJsonItems(rawText: string): BrowserCaptureRawItem[] {
  const trimmed = rawText.trim();
  if (!trimmed || (!trimmed.startsWith("[") && !trimmed.startsWith("{"))) return [];

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) return parsed.filter((item): item is BrowserCaptureRawItem => Boolean(item) && typeof item === "object" && !Array.isArray(item));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const record = parsed as Record<string, unknown>;
      const items = record.items ?? record.listings ?? record.results;
      if (Array.isArray(items)) return items.filter((item): item is BrowserCaptureRawItem => Boolean(item) && typeof item === "object" && !Array.isArray(item));
    }
  } catch {
    return [];
  }

  return [];
}

function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function parseLineItems(rawText: string): BrowserCaptureRawItem[] {
  return rawText
    .split(/\n+/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean)
    .map((line) => {
      const url = line.match(/https?:\/\/\S+/i)?.[0]?.replace(/[),.;]+$/, "") ?? "";
      const price = line.match(/R\$\s*[\d.,]+(?:\s*(?:milh[aã]o|milh[oõ]es))?/i)?.[0] ?? "";
      const parts = line.split(/\t|\s+\|\s+|\s+-\s+/).map(normalizeWhitespace).filter(Boolean);
      const title = parts.find((part) => part !== url && part !== price && !/^R\$/i.test(part)) ?? "";
      return { sourceUrl: url, title, price, rawText: line };
    })
    .filter((item) => optionalString(item.sourceUrl));
}

function collectRawItems(input: BrowserCaptureInput) {
  const items = [...(input.items ?? [])] as BrowserCaptureRawItem[];
  const rawText = optionalString(input.rawText);
  if (!rawText) return items;

  const parsedJson = parseJsonItems(rawText);
  if (parsedJson.length) return [...items, ...parsedJson];
  return [...items, ...parseLineItems(rawText)];
}

function itemToPayload(item: BrowserCaptureRawItem, input: BrowserCaptureInput) {
  const sourceUrl = normalizeUrl(item.sourceUrl ?? item.url ?? item.href);
  if (!sourceUrl) throw new Error("Item sem URL válida.");

  const rawText = optionalString(item.rawText) || optionalString(item.text);
  const fallbackTitle = rawText
    .split(/[\n|]/)
    .map(normalizeWhitespace)
    .find((line) => line && !/^R\$/i.test(line) && !/condom[ií]nio|iptu|favorito|patrocinado|online/i.test(line));
  const title = optionalString(item.title) || optionalString(item.name) || fallbackTitle || "Anúncio capturado do navegador";
  const description = optionalString(item.description) || rawText || null;
  const price = parsePrice(item.price, rawText, title);
  if (!price) throw new Error(`${sourceUrl}: preço não identificado.`);

  const fallbackCity = input.city || "Palmas";
  const location = parseLocation(item.location, fallbackCity, input.district);
  const district = optionalString(item.district) || optionalString(item.neighborhood) || location.district;
  const city = optionalString(item.city) || location.city;
  const provider = providerFromUrl(sourceUrl, input.provider);
  const sourceName = PROVIDER_LABELS[provider] ?? "Portal";
  const advertiserName =
    optionalString(item.advertiserName) ||
    optionalString(item.sellerName) ||
    optionalString(item.advertiser) ||
    optionalString(item.seller) ||
    null;
  const searchText = `${title} ${description ?? ""}`;
  const thumbnailUrl = normalizeImageUrl(item.thumbnailUrl ?? item.imageUrl ?? item.photoUrl);
  const publishedAt = parseCapturePublishedAt(item.publishedAt ?? item.publicationDate ?? item.publishedAtText ?? rawText);
  const isPrivateSeller =
    typeof item.isPrivateSeller === "boolean"
      ? item.isPrivateSeller
      : inferPrivateSeller(`${searchText} ${rawText}`, advertiserName);

  return {
    sourceName,
    sourceKind: CaptureSourceKind.PORTAL,
    externalId: extractExternalId(sourceUrl),
    sourceUrl,
    title: title.slice(0, 180),
    description,
    purpose: input.purpose ?? PropertyPurpose.VENDA,
    type: inferType(searchText, input.type ?? PropertyType.CASA),
    price,
    address: optionalString(item.address) || null,
    city,
    district: district || "A confirmar",
    areaM2: toInt(item.areaM2),
    bedrooms: toInt(item.bedrooms),
    bathrooms: toInt(item.bathrooms),
    parkingSpaces: toInt(item.parkingSpaces),
    advertiserName,
    publishedAt,
    adAgeDays: publishedAt ? Math.max(0, Math.floor((Date.now() - publishedAt.getTime()) / 86400000)) : null,
    isPrivateSeller,
    hasFullAddress: Boolean(optionalString(item.address)),
    rawPayload: {
      importer: "browser-capture",
      provider,
      capturedAt: new Date().toISOString(),
      thumbnailUrl: thumbnailUrl || null,
      media: thumbnailUrl ? [{ url: thumbnailUrl, kind: "thumbnail" }] : [],
      raw: toJsonValue(item)
    } satisfies Prisma.InputJsonValue,
    notes: `Capturado via navegador em ${sourceName}. Validar dados e contato antes da abordagem.`
  };
}

export async function importBrowserCapturedListings(input: BrowserCaptureInput, actorId?: string | null) {
  const rawItems = collectRawItems(input).slice(0, 60);
  const listings: CaptureListingItem[] = [];
  const errors: string[] = [];

  for (const item of rawItems) {
    try {
      listings.push(await createCapturedListing(itemToPayload(item, input), actorId));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Falha ao importar item capturado.");
    }
  }

  return {
    listings,
    importedCount: listings.length,
    failedCount: errors.length,
    errors
  };
}
