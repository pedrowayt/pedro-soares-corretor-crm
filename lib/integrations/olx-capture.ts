import { CaptureSourceKind, PropertyPurpose, PropertyType, type Prisma } from "@prisma/client";
import * as cheerio from "cheerio";
import { createCapturedListing, parseCapturePublishedAt, type CaptureListingItem } from "@/lib/data/capture";

export const OLX_CAPTURE_TIMEOUT_MS = 12_000;
const MAX_SCRAPE_HTML_BYTES = 2 * 1024 * 1024;
const DEFAULT_SEARCH_LINK_LIMIT = 12;
const PORTAL_BLOCKED_STATUS_CODES = new Set([401, 403, 429]);
const PORTAL_BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";

type JsonRecord = Record<string, unknown>;
export type CapturePortalProviderId = "olx" | "zap" | "imovelweb" | "chaves-na-mao" | "facebook-marketplace";

type PortalProviderConfig = {
  id: CapturePortalProviderId;
  label: string;
  sourceName: string;
  hosts: string[];
  blockedPathPattern: RegExp;
  adPathPattern: RegExp;
  urlMatchPattern: RegExp;
};

export class PortalAccessBlockedError extends Error {
  statusCode: number;
  providerLabel: string;

  constructor(providerLabel: string, statusCode: number, target: "anúncio" | "busca") {
    super(
      `${providerLabel} bloqueou a leitura automática da ${target} pelo servidor (HTTP ${statusCode}). Não é erro do CRM; o portal pode exigir acesso por navegador real.`
    );
    this.name = "PortalAccessBlockedError";
    this.statusCode = statusCode;
    this.providerLabel = providerLabel;
  }
}

export function isPortalAccessBlockedError(error: unknown) {
  return error instanceof PortalAccessBlockedError;
}

const PORTAL_PROVIDERS: PortalProviderConfig[] = [
  {
    id: "olx",
    label: "OLX",
    sourceName: "OLX",
    hosts: ["olx.com.br"],
    blockedPathPattern: /\/busca|\/favoritos|\/chat|\/minha-conta|\/entrar|\/login/i,
    adPathPattern: /(?:-|\/)\d{8,}(?:\/)?$/i,
    urlMatchPattern: /https?:\/\/[^"'<>\s]+?olx\.com\.br[^"'<>\s]+?\d{8,}/gi
  },
  {
    id: "zap",
    label: "ZAP Imóveis",
    sourceName: "ZAP Imóveis",
    hosts: ["zapimoveis.com.br"],
    blockedPathPattern: /\/login|\/entrar|\/minha-conta|\/favoritos|\/anunciar/i,
    adPathPattern: /\/imovel\/|\/imoveis\/|id-\d{5,}|-\d{7,}(?:\/)?$/i,
    urlMatchPattern: /https?:\/\/[^"'<>\s]+?zapimoveis\.com\.br[^"'<>\s]+?(?:id-\d{5,}|\d{7,})/gi
  },
  {
    id: "imovelweb",
    label: "Imovelweb",
    sourceName: "Imovelweb",
    hosts: ["imovelweb.com.br"],
    blockedPathPattern: /\/login|\/entrar|\/minha-conta|\/favoritos|\/anunciar/i,
    adPathPattern: /\/propriedades\/|\/imovel\/|-\d{7,}(?:\.html|\/)?$/i,
    urlMatchPattern: /https?:\/\/[^"'<>\s]+?imovelweb\.com\.br[^"'<>\s]+?(?:propriedades|imovel|-\d{7,})/gi
  },
  {
    id: "chaves-na-mao",
    label: "Chaves na Mão",
    sourceName: "Chaves na Mão",
    hosts: ["chavesnamao.com.br"],
    blockedPathPattern: /\/login|\/entrar|\/minha-conta|\/favoritos|\/anunciar/i,
    adPathPattern: /\/imovel\/|\/imoveis\/|\/casa-|\/apartamento-|\/terreno-|\/sobrado-|\/chacara-|-\d{5,}(?:\/)?$/i,
    urlMatchPattern: /https?:\/\/[^"'<>\s]+?chavesnamao\.com\.br[^"'<>\s]+?(?:imovel|imoveis|casa-|apartamento-|terreno-|sobrado-|chacara-|-\d{5,})/gi
  },
  {
    id: "facebook-marketplace",
    label: "Facebook Marketplace",
    sourceName: "Facebook Marketplace",
    hosts: ["facebook.com", "m.facebook.com", "web.facebook.com"],
    blockedPathPattern: /\/login|\/checkpoint|\/recover|\/settings/i,
    adPathPattern: /\/marketplace\/item\/\d+/i,
    urlMatchPattern: /https?:\/\/[^"'<>\s]+?facebook\.com\/marketplace\/item\/\d+/gi
  }
];

type PortalExtractedListing = {
  title: string;
  description: string | null;
  sourceUrl: string;
  externalId: string | null;
  purpose: PropertyPurpose;
  type: PropertyType;
  price: number | null;
  address: string | null;
  city: string;
  district: string;
  areaM2: number | null;
  landAreaM2: number | null;
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  advertiserName: string | null;
  advertiserPhone: string | null;
  publishedAt: Date | null;
  adAgeDays: number | null;
  isPrivateSeller: boolean;
  hasFullAddress: boolean;
  imageUrl: string | null;
  rawPayload: Prisma.InputJsonValue;
  notes: string;
};

export function getCapturePortalProviders() {
  return PORTAL_PROVIDERS.map(({ id, label, sourceName }) => ({ id, label, sourceName }));
}

function getProviderConfig(providerId: string) {
  const config = PORTAL_PROVIDERS.find((provider) => provider.id === providerId);
  if (!config) {
    throw new Error("Provedor de captação não suportado.");
  }
  return config;
}

function hostMatches(hostname: string, provider: PortalProviderConfig) {
  const host = hostname.toLowerCase();
  return provider.hosts.some((allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`));
}

function detectProviderFromUrl(url: URL) {
  return PORTAL_PROVIDERS.find((provider) => hostMatches(url.hostname, provider)) ?? null;
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeWhitespace(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function stripHtmlText(value: string) {
  return normalizeWhitespace(value.replace(/\s+/g, " "));
}

function isPrivateHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.startsWith("127.") ||
    host.startsWith("10.") ||
    host.startsWith("192.168.")
  ) {
    return true;
  }

  const parts = host.split(".").map((part) => Number(part));
  return parts.length === 4 && parts.every(Number.isInteger) && parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31;
}

function parsePortalUrl(value: string, providerId?: string | null) {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("URL do portal invalida.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Use uma URL iniciando com http:// ou https://.");
  }

  if (isPrivateHost(url.hostname)) {
    throw new Error("Essa URL nao pode ser acessada pelo importador por seguranca.");
  }

  const provider = providerId ? getProviderConfig(providerId) : detectProviderFromUrl(url);
  if (!provider || !hostMatches(url.hostname, provider)) {
    throw new Error("Informe uma URL de um portal suportado.");
  }

  return { url, provider };
}

function parseOlxUrl(value: string) {
  return parsePortalUrl(value, "olx").url;
}

function buildPortalRequestHeaders(url: URL) {
  return {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Referer: `${url.protocol}//${url.host}/`,
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": PORTAL_BROWSER_USER_AGENT
  };
}

async function readLimitedText(response: Response, maxBytes: number) {
  if (!response.body) return response.text();

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("A pagina do portal e grande demais para leitura automatica.");
    }

    chunks.push(value);
  }

  return new TextDecoder("utf-8").decode(Buffer.concat(chunks));
}

function getMeta($: cheerio.CheerioAPI, selectors: string[]) {
  for (const selector of selectors) {
    const value = $(selector).first().attr("content");
    if (value?.trim()) return normalizeWhitespace(value);
  }
  return "";
}

function getCanonicalUrl($: cheerio.CheerioAPI, finalUrl: URL) {
  const canonical = $("link[rel='canonical']").first().attr("href") || getMeta($, ["meta[property='og:url']"]);
  if (!canonical) return finalUrl.toString();

  try {
    return new URL(canonical, finalUrl).toString();
  } catch {
    return finalUrl.toString();
  }
}

function normalizePortalAdUrl(rawValue: string, baseUrl: URL, provider: PortalProviderConfig) {
  if (!rawValue || rawValue.startsWith("javascript:") || rawValue.startsWith("mailto:")) return null;

  let url: URL;
  try {
    url = new URL(rawValue, baseUrl);
  } catch {
    return null;
  }

  if (!hostMatches(url.hostname, provider)) return null;
  const decodedPath = decodeURIComponent(url.pathname);
  if (!provider.adPathPattern.test(decodedPath)) return null;
  if (provider.blockedPathPattern.test(decodedPath)) return null;

  url.hash = "";
  url.search = "";
  return url.toString();
}

function parseJsonSafe(value: string): unknown | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function collectJsonLd(value: unknown, output: JsonRecord[]) {
  if (Array.isArray(value)) {
    for (const item of value) collectJsonLd(item, output);
    return;
  }

  if (!isRecord(value)) return;
  output.push(value);

  const graph = value["@graph"];
  if (Array.isArray(graph)) {
    for (const item of graph) collectJsonLd(item, output);
  }
}

function parseJsonLdBlocks($: cheerio.CheerioAPI) {
  const records: JsonRecord[] = [];

  $("script[type='application/ld+json']").each((_, element) => {
    const parsed = parseJsonSafe($(element).text().trim());
    collectJsonLd(parsed, records);
  });

  return records;
}

function parseNextData($: cheerio.CheerioAPI) {
  const text = $("#__NEXT_DATA__").first().text().trim();
  if (!text) return null;
  return parseJsonSafe(text);
}

function walkJson(value: unknown, visitor: (record: JsonRecord) => void, depth = 0) {
  if (depth > 12) return;
  if (Array.isArray(value)) {
    for (const item of value.slice(0, 250)) walkJson(item, visitor, depth + 1);
    return;
  }
  if (!isRecord(value)) return;

  visitor(value);
  for (const item of Object.values(value)) {
    if (typeof item === "object" && item !== null) walkJson(item, visitor, depth + 1);
  }
}

function getRecordString(record: JsonRecord | null | undefined, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? normalizeWhitespace(value) : "";
}

function getNestedRecord(value: unknown) {
  if (Array.isArray(value)) return value.find(isRecord) ?? null;
  return isRecord(value) ? value : null;
}

function firstNonEmpty(...values: Array<string | null | undefined>) {
  return values.map((value) => normalizeWhitespace(value ?? "")).find(Boolean) ?? "";
}

function parseBrazilianDecimal(value: string) {
  const cleaned = value.replace(/[^\d,.]/g, "");
  if (!cleaned) return null;

  const hasComma = cleaned.includes(",");
  const normalized = hasComma
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned.replace(/\.(?=\d{3}(?:\D|$))/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parsePriceToken(value: string) {
  const millionMatch = value.match(/R\$\s*([\d.,]+)\s*(?:milh[aã]o|milh[oõ]es)/i);
  if (millionMatch) {
    const parsed = parseBrazilianDecimal(millionMatch[1]);
    if (parsed) return parsed * 1_000_000;
  }

  const thousandMatch = value.match(/R\$\s*([\d.,]+)\s*mil\b/i);
  if (thousandMatch) {
    const parsed = parseBrazilianDecimal(thousandMatch[1]);
    if (parsed) return parsed < 10_000 ? parsed * 1_000 : parsed;
  }

  const priceMatch = value.match(/R\$\s*([\d.,]+)/i);
  if (priceMatch) return parseBrazilianDecimal(priceMatch[1]);
  return null;
}

function collectPriceCandidates(value: string) {
  const lines = value
    .split(/\n+|\s{2,}|\s+\|\s+/)
    .map(normalizeWhitespace)
    .filter(Boolean);
  const candidates: Array<{ value: number; feeLike: boolean }> = [];

  for (const line of lines.length ? lines : [value]) {
    const feeLike = /condom[ií]nio|iptu|taxa|seguro|m[²2]|por\s*m[²2]/i.test(line);
    const matches = line.match(/R\$\s*[\d.,]+(?:\s*(?:mil\b|milh[aã]o|milh[oõ]es))?/gi) ?? [];
    for (const match of matches) {
      const parsed = parsePriceToken(match);
      if (parsed) candidates.push({ value: parsed, feeLike });
    }
  }

  const preferred = candidates.filter((candidate) => !candidate.feeLike);
  const pool = preferred.length ? preferred : candidates;
  return pool.map((candidate) => candidate.value);
}

function parsePrice(...values: string[]) {
  for (const value of values) {
    const candidates = collectPriceCandidates(value);
    if (candidates.length) return Math.max(...candidates);

    const parsed = parsePriceToken(value);
    if (parsed) return parsed;
  }

  return null;
}

function parseFirstNumberNear(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;

    const parsed = parseBrazilianDecimal(match[1]);
    if (parsed) return Math.round(parsed);
  }

  return null;
}

function stripPortalTitle(value: string, provider: PortalProviderConfig) {
  return normalizeWhitespace(value)
    .replace(new RegExp(`\\s*\\|\\s*${provider.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*$`, "i"), "")
    .replace(/\s*\|\s*(OLX|ZAP Imóveis|Imovelweb|Chaves na Mão|Facebook Marketplace).*$/i, "")
    .replace(/\s+\d{8,}\s*$/i, "")
    .slice(0, 180);
}

function normalizeDescription(value: string, provider: PortalProviderConfig) {
  const cleaned = normalizeWhitespace(value)
    .replace(new RegExp(`\\s*\\|\\s*${provider.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*$`, "i"), "")
    .replace(/\s*\|\s*(OLX|ZAP Imóveis|Imovelweb|Chaves na Mão|Facebook Marketplace).*$/i, "")
    .replace(/^(OLX|ZAP Imóveis|Imovelweb|Chaves na Mão|Facebook Marketplace)\s*-\s*/i, "");

  return cleaned.length > 5000 ? `${cleaned.slice(0, 4997)}...` : cleaned;
}

function inferPurpose(text: string): PropertyPurpose {
  const lower = text.toLowerCase();
  if (/\b(aluguel|aluga|alugo|loca[cç][aã]o|locacao|para alugar)\b/.test(lower)) return PropertyPurpose.LOCACAO;
  return PropertyPurpose.VENDA;
}

function inferType(text: string): PropertyType {
  const lower = text.toLowerCase();
  if (/cobertura/.test(lower)) return PropertyType.COBERTURA;
  if (/apartamento|apto\b/.test(lower)) return PropertyType.APARTAMENTO;
  if (/flat|studio/.test(lower)) return PropertyType.FLAT;
  if (/casa\s+em\s+condom[ií]nio|sobrado\s+em\s+condom[ií]nio/.test(lower)) return PropertyType.CASA_EM_CONDOMINIO;
  if (/sobrado/.test(lower)) return PropertyType.SOBRADO;
  if (/ch[aá]cara/.test(lower)) return PropertyType.CHACARA;
  if (/fazenda/.test(lower)) return PropertyType.FAZENDA;
  if (/terreno|lote/.test(lower)) return /condom[ií]nio/.test(lower) ? PropertyType.LOTE_EM_CONDOMINIO : PropertyType.LOTE;
  if (/galp[aã]o|barrac[aã]o/.test(lower)) return PropertyType.GALPAO;
  if (/\bsala\b/.test(lower)) return PropertyType.SALA;
  if (/\bloja\b/.test(lower)) return PropertyType.LOJA;
  if (/comercial|ponto comercial|pr[eé]dio/.test(lower)) return PropertyType.COMERCIAL;
  return PropertyType.CASA;
}

function extractExternalId(url: string, text: string) {
  const fromUrl =
    url.match(/\/marketplace\/item\/(\d+)/i)?.[1] ??
    url.match(/\bid-(\d{5,})/i)?.[1] ??
    url.match(/-(\d{5,})(?:[/?#.]|$)/)?.[1] ??
    url.match(/\/(\d{5,})(?:[/?#]|$)/)?.[1];
  if (fromUrl) return fromUrl;
  return text.match(/\b(\d{8,})\b/)?.[1] ?? null;
}

function extractLocation(text: string) {
  const stateCodes = "AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO";
  const candidates = [
    new RegExp(`[-–]\\s*([^,|]{2,60}),\\s*([^,|\\-]{2,60})\\s*[-/]\\s*(${stateCodes})\\b`, "i"),
    new RegExp(`\\b([^,|]{2,60}),\\s*([^,|\\-]{2,60})\\s*[-/]\\s*(${stateCodes})\\b`, "i")
  ];

  for (const pattern of candidates) {
    const match = text.match(pattern);
    if (!match) continue;
    return {
      district: normalizeWhitespace(match[1]).replace(/^em\s+/i, ""),
      city: normalizeWhitespace(match[2])
    };
  }

  return { district: "A confirmar", city: "Palmas" };
}

function extractAddressFromJson(record: JsonRecord | null | undefined) {
  const address = getNestedRecord(record?.address);
  if (!address) return { address: null, district: "", city: "" };

  const street = getRecordString(address, "streetAddress");
  const district = getRecordString(address, "addressSubLocality") || getRecordString(address, "addressRegion");
  const city = getRecordString(address, "addressLocality");

  return {
    address: street || null,
    district,
    city
  };
}

function getJsonPrice(record: JsonRecord | null | undefined) {
  const offers = getNestedRecord(record?.offers);
  const price = offers?.price ?? record?.price;
  if (typeof price === "number" && Number.isFinite(price) && price > 0) return price;
  if (typeof price === "string") return parseBrazilianDecimal(price);
  return null;
}

function normalizeImageUrl(rawValue: unknown, baseUrl: URL) {
  if (typeof rawValue !== "string" || !rawValue.trim()) return "";
  try {
    const url = new URL(rawValue.trim(), baseUrl);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function getJsonImage(record: JsonRecord | null | undefined, baseUrl: URL) {
  const image = record?.image;
  if (typeof image === "string") return normalizeImageUrl(image, baseUrl);
  if (Array.isArray(image)) {
    for (const item of image) {
      const found = typeof item === "string" ? normalizeImageUrl(item, baseUrl) : isRecord(item) ? normalizeImageUrl(item.url, baseUrl) : "";
      if (found) return found;
    }
  }
  if (isRecord(image)) return normalizeImageUrl(image.url ?? image.contentUrl, baseUrl);
  return "";
}

function findLikelyListingRecord(records: JsonRecord[]) {
  return (
    records.find((record) => {
      const type = record["@type"];
      const typeText = Array.isArray(type) ? type.join(" ") : String(type ?? "");
      return /product|offer|house|apartment|residence|realestate|listing/i.test(typeText);
    }) ?? records.find((record) => Boolean(record.name || record.description || record.offers)) ?? null
  );
}

function findAdvertiserName(records: JsonRecord[], nextData: unknown) {
  const direct = records
    .map((record) => {
      const seller = getNestedRecord(record.seller) || getNestedRecord(record.author) || getNestedRecord(record.provider);
      return firstNonEmpty(getRecordString(seller, "name"), getRecordString(record, "sellerName"), getRecordString(record, "authorName"));
    })
    .find(Boolean);
  if (direct) return direct.slice(0, 120);

  let found = "";
  walkJson(nextData, (record) => {
    if (found) return;
    const keyValues = [
      getRecordString(record, "sellerName"),
      getRecordString(record, "advertiserName"),
      getRecordString(record, "userName"),
      getRecordString(record, "nickname")
    ];
    const candidate = firstNonEmpty(...keyValues);
    if (candidate && !/olx|zap|viva real|imovelweb|chaves na mão|facebook/i.test(candidate)) found = candidate;
  });

  return found ? found.slice(0, 120) : null;
}

function extractPhone(text: string) {
  const match = text.match(/(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?9?\d{4}[-\s]?\d{4}/);
  return match ? normalizeWhitespace(match[0]) : null;
}

function inferPrivateSeller(text: string, advertiserName: string | null) {
  const haystack = `${text} ${advertiserName ?? ""}`.toLowerCase();
  const hasBrokerSignal = /imobili[aá]ria|imoveis|im[oó]veis|corretor|creci|consultor imobili[aá]rio|remax|re\/max/.test(haystack);
  const hasPrivateSignal = /propriet[aá]rio|particular|direto com|direto c\/?|dono/.test(haystack);
  return hasPrivateSignal || !hasBrokerSignal;
}

function compactTextForParsing($: cheerio.CheerioAPI) {
  const clone = $.root().clone();
  clone.find("script, style, noscript, iframe, svg").remove();
  return stripHtmlText(clone.text());
}

function extractPortalAdLinks(html: string, finalUrl: URL, provider: PortalProviderConfig, limit = DEFAULT_SEARCH_LINK_LIMIT) {
  const $ = cheerio.load(html);
  const found = new Map<string, string>();

  function addCandidate(rawValue: string) {
    if (found.size >= limit) return;
    const url = normalizePortalAdUrl(rawValue, finalUrl, provider);
    if (url && !found.has(url)) found.set(url, url);
  }

  $("a[href]").each((_, element) => {
    addCandidate($(element).attr("href") ?? "");
  });

  const nextData = parseNextData($);
  walkJson(nextData, (record) => {
    for (const value of Object.values(record)) {
      if (typeof value === "string") addCandidate(value);
    }
  });

  const rawUrlMatches = html.match(provider.urlMatchPattern) ?? [];
  for (const rawUrl of rawUrlMatches) {
    addCandidate(rawUrl.replace(/\\u002F/g, "/"));
  }

  return Array.from(found.values()).slice(0, limit);
}

function buildRawPayload(input: {
  requestedUrl: string;
  finalUrl: string;
  canonicalUrl: string;
  provider: PortalProviderConfig;
  title: string;
  metaTitle: string;
  metaDescription: string;
  jsonLdCount: number;
  nextDataDetected: boolean;
  imageUrl: string | null;
  extractedAt: string;
}) {
  return {
    importer: "portal-url",
    provider: input.provider.id,
    providerLabel: input.provider.label,
    requestedUrl: input.requestedUrl,
    finalUrl: input.finalUrl,
    canonicalUrl: input.canonicalUrl,
    extractedAt: input.extractedAt,
    detected: {
      title: input.title,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
      imageUrl: input.imageUrl,
      jsonLdCount: input.jsonLdCount,
      nextDataDetected: input.nextDataDetected
    },
    thumbnailUrl: input.imageUrl,
    media: input.imageUrl ? [{ url: input.imageUrl, kind: "thumbnail" }] : []
  } satisfies Prisma.InputJsonValue;
}

function extractPortalListing(html: string, requestedUrl: string, finalUrl: URL, provider: PortalProviderConfig): PortalExtractedListing {
  const $ = cheerio.load(html);
  const canonicalUrl = getCanonicalUrl($, finalUrl);
  const jsonLdRecords = parseJsonLdBlocks($);
  const nextData = parseNextData($);
  const listingRecord = findLikelyListingRecord(jsonLdRecords);
  const jsonAddress = extractAddressFromJson(listingRecord);
  const metaTitle = getMeta($, ["meta[property='og:title']", "meta[name='twitter:title']"]);
  const title = stripPortalTitle(firstNonEmpty(getRecordString(listingRecord, "name"), $("h1").first().text(), metaTitle, $("title").first().text()), provider);
  const metaDescription = getMeta($, ["meta[property='og:description']", "meta[name='description']", "meta[name='twitter:description']"]);
  const description = normalizeDescription(firstNonEmpty(getRecordString(listingRecord, "description"), metaDescription), provider);
  const imageUrl = firstNonEmpty(
    getJsonImage(listingRecord, finalUrl),
    normalizeImageUrl(getMeta($, ["meta[property='og:image']", "meta[name='twitter:image']"]), finalUrl)
  );
  const bodyText = compactTextForParsing($);
  const searchText = normalizeWhitespace([title, description, metaTitle, metaDescription, bodyText].filter(Boolean).join(" "));
  const location = extractLocation(searchText);
  const advertiserName = findAdvertiserName(jsonLdRecords, nextData);
  const price = getJsonPrice(listingRecord) ?? parsePrice(metaTitle, metaDescription, bodyText);
  const areaM2 = parseFirstNumberNear(searchText, [
    /(\d+(?:[.,]\d+)?)\s*m[²2]\s*(?:de\s*)?(?:[aá]rea\s*)?(?:[uú]til|privativa|constru[ií]da)?/i,
    /[aá]rea(?:\s+[uú]til|\s+privativa|\s+constru[ií]da)?\D{0,20}(\d+(?:[.,]\d+)?)/i
  ]);
  const landAreaM2 = parseFirstNumberNear(searchText, [
    /(?:terreno|lote)\D{0,25}(\d+(?:[.,]\d+)?)\s*m[²2]/i,
    /(\d+(?:[.,]\d+)?)\s*m[²2]\s*(?:de\s*)?(?:terreno|lote)/i
  ]);
  const bedrooms = parseFirstNumberNear(searchText, [/(\d+)\s*(?:quartos?|dormit[oó]rios?)/i]);
  const suites = parseFirstNumberNear(searchText, [/(\d+)\s*su[ií]tes?/i]);
  const bathrooms = parseFirstNumberNear(searchText, [/(\d+)\s*(?:banheiros?|wc\b)/i]);
  const parkingSpaces = parseFirstNumberNear(searchText, [/(\d+)\s*(?:vagas?|garagens?)/i]);
  const address = jsonAddress.address;
  const city = firstNonEmpty(jsonAddress.city, location.city, "Palmas");
  const district = firstNonEmpty(jsonAddress.district, location.district, "A confirmar");
  const phone = extractPhone(searchText);
  const publishedAt = parseCapturePublishedAt(
    firstNonEmpty(getRecordString(listingRecord, "datePublished"), getRecordString(listingRecord, "dateCreated"), bodyText)
  );
  const adAgeDays = publishedAt ? Math.max(0, Math.floor((Date.now() - publishedAt.getTime()) / 86400000)) : null;
  const isPrivateSeller = inferPrivateSeller(searchText, advertiserName);
  const rawPayload = buildRawPayload({
    requestedUrl,
    finalUrl: finalUrl.toString(),
    canonicalUrl,
    provider,
    title,
    metaTitle,
    metaDescription,
    imageUrl: imageUrl || null,
    jsonLdCount: jsonLdRecords.length,
    nextDataDetected: Boolean(nextData),
    extractedAt: new Date().toISOString()
  });

  if (!title || title.length < 3) {
    throw new Error(`Nao encontrei o titulo do anuncio de ${provider.label}.`);
  }

  return {
    title,
    description: description || null,
    sourceUrl: normalizePortalAdUrl(canonicalUrl, finalUrl, provider) ?? canonicalUrl,
    externalId: extractExternalId(canonicalUrl, searchText),
    purpose: inferPurpose(searchText),
    type: inferType(searchText),
    price,
    address,
    city,
    district,
    areaM2,
    landAreaM2,
    bedrooms,
    suites,
    bathrooms,
    parkingSpaces,
    advertiserName,
    advertiserPhone: phone,
    publishedAt,
    adAgeDays,
    isPrivateSeller,
    hasFullAddress: Boolean(address),
    imageUrl: imageUrl || null,
    rawPayload,
    notes: [
      `Importado automaticamente de ${provider.label}. Validar dados, contato e permissao de abordagem antes de publicar.`,
      isPrivateSeller ? "Particular inferido pelo importador." : "Anunciante pode ser profissional; revisar antes da abordagem."
    ].join("\n")
  };
}

export async function scrapePortalListing(sourceUrlValue: string, providerId?: string | null) {
  const { url: sourceUrl, provider } = parsePortalUrl(sourceUrlValue, providerId);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OLX_CAPTURE_TIMEOUT_MS);

  try {
    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: buildPortalRequestHeaders(sourceUrl)
    });

    if (!response.ok) {
      if (PORTAL_BLOCKED_STATUS_CODES.has(response.status)) {
        throw new PortalAccessBlockedError(provider.label, response.status, "anúncio");
      }
      throw new Error(`Nao consegui ler o anuncio de ${provider.label}. Status ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType && !contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error(`A URL de ${provider.label} nao retornou uma pagina HTML.`);
    }

    const finalUrl = new URL(response.url || sourceUrl.toString());
    if (isPrivateHost(finalUrl.hostname)) {
      throw new Error("A pagina redirecionou para uma URL bloqueada por seguranca.");
    }
    if (!hostMatches(finalUrl.hostname, provider)) {
      throw new Error(`A pagina redirecionou para fora de ${provider.label}.`);
    }

    const html = await readLimitedText(response, MAX_SCRAPE_HTML_BYTES);
    const listing = extractPortalListing(html, sourceUrl.toString(), finalUrl, provider);

    if (!listing.price) {
      throw new Error(`Nao encontrei o preco do anuncio de ${provider.label}. Cadastre manualmente ou tente outra URL.`);
    }

    return listing;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Tempo esgotado ao ler o anuncio de ${provider.label}.`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function scrapeOlxListing(sourceUrlValue: string) {
  return scrapePortalListing(sourceUrlValue, "olx");
}

export async function scrapePortalSearchLinks(searchUrlValue: string, maxResults = DEFAULT_SEARCH_LINK_LIMIT, providerId?: string | null) {
  const { url: searchUrl, provider } = parsePortalUrl(searchUrlValue, providerId);
  const limit = Math.max(1, Math.min(30, Math.round(maxResults || DEFAULT_SEARCH_LINK_LIMIT)));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OLX_CAPTURE_TIMEOUT_MS);

  try {
    const response = await fetch(searchUrl, {
      signal: controller.signal,
      headers: buildPortalRequestHeaders(searchUrl)
    });

    if (!response.ok) {
      if (PORTAL_BLOCKED_STATUS_CODES.has(response.status)) {
        throw new PortalAccessBlockedError(provider.label, response.status, "busca");
      }
      throw new Error(`Nao consegui ler a busca de ${provider.label}. Status ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType && !contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error(`A URL de busca de ${provider.label} nao retornou uma pagina HTML.`);
    }

    const finalUrl = new URL(response.url || searchUrl.toString());
    if (isPrivateHost(finalUrl.hostname)) {
      throw new Error("A busca redirecionou para uma URL bloqueada por seguranca.");
    }
    if (!hostMatches(finalUrl.hostname, provider)) {
      throw new Error(`A busca redirecionou para fora de ${provider.label}.`);
    }

    const html = await readLimitedText(response, MAX_SCRAPE_HTML_BYTES);
    return {
      requestedUrl: searchUrl.toString(),
      finalUrl: finalUrl.toString(),
      provider: provider.id,
      providerLabel: provider.label,
      links: extractPortalAdLinks(html, finalUrl, provider, limit)
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Tempo esgotado ao ler a busca de ${provider.label}.`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function scrapeOlxSearchLinks(searchUrlValue: string, maxResults = DEFAULT_SEARCH_LINK_LIMIT) {
  return scrapePortalSearchLinks(searchUrlValue, maxResults, "olx");
}

export async function importPortalCapturedListing(
  sourceUrl: string,
  actorId?: string | null,
  providerId?: string | null
): Promise<CaptureListingItem> {
  const listing = await scrapePortalListing(sourceUrl, providerId);
  const price = listing.price;

  if (!price) {
    throw new Error("Nao encontrei o preco do anuncio. Cadastre manualmente ou tente outra URL.");
  }

  const provider = getProviderConfig((listing.rawPayload as { provider?: string }).provider ?? providerId ?? "olx");

  return createCapturedListing(
    {
      sourceName: provider.sourceName,
      sourceKind: CaptureSourceKind.PORTAL,
      externalId: listing.externalId,
      sourceUrl: listing.sourceUrl,
      title: listing.title,
      description: listing.description,
      purpose: listing.purpose,
      type: listing.type,
      price,
      address: listing.address,
      city: listing.city,
      district: listing.district,
      areaM2: listing.areaM2,
      landAreaM2: listing.landAreaM2,
      bedrooms: listing.bedrooms,
      suites: listing.suites,
      bathrooms: listing.bathrooms,
      parkingSpaces: listing.parkingSpaces,
      advertiserName: listing.advertiserName,
      advertiserPhone: listing.advertiserPhone,
      publishedAt: listing.publishedAt,
      adAgeDays: listing.adAgeDays,
      isPrivateSeller: listing.isPrivateSeller,
      hasFullAddress: listing.hasFullAddress,
      rawPayload: listing.rawPayload,
      notes: listing.notes
    },
    actorId
  );
}

export async function importOlxCapturedListing(sourceUrl: string, actorId?: string | null): Promise<CaptureListingItem> {
  return importPortalCapturedListing(sourceUrl, actorId, "olx");
}
