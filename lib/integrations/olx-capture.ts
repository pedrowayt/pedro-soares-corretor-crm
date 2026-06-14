import { CaptureSourceKind, PropertyPurpose, PropertyType, type Prisma } from "@prisma/client";
import * as cheerio from "cheerio";
import { createCapturedListing, type CaptureListingItem } from "@/lib/data/capture";

export const OLX_CAPTURE_TIMEOUT_MS = 12_000;
const MAX_SCRAPE_HTML_BYTES = 2 * 1024 * 1024;

type JsonRecord = Record<string, unknown>;

type OlxExtractedListing = {
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
  isPrivateSeller: boolean;
  hasFullAddress: boolean;
  rawPayload: Prisma.InputJsonValue;
  notes: string;
};

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

function isOlxHost(hostname: string) {
  const host = hostname.toLowerCase();
  return host === "olx.com.br" || host.endsWith(".olx.com.br");
}

function parseOlxUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("URL da OLX invalida.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Use uma URL iniciando com http:// ou https://.");
  }

  if (isPrivateHost(url.hostname)) {
    throw new Error("Essa URL nao pode ser acessada pelo importador por seguranca.");
  }

  if (!isOlxHost(url.hostname)) {
    throw new Error("Informe uma URL de anuncio da OLX.");
  }

  return url;
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
      throw new Error("A pagina da OLX e grande demais para leitura automatica.");
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

function parsePrice(...values: string[]) {
  for (const value of values) {
    const millionMatch = value.match(/R\$\s*([\d.,]+)\s*(?:milh[aã]o|milh[oõ]es)/i);
    if (millionMatch) {
      const parsed = parseBrazilianDecimal(millionMatch[1]);
      if (parsed) return parsed * 1_000_000;
    }

    const priceMatch = value.match(/R\$\s*([\d.,]+)/i);
    if (priceMatch) {
      const parsed = parseBrazilianDecimal(priceMatch[1]);
      if (parsed) return parsed;
    }
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

function stripOlxTitle(value: string) {
  return normalizeWhitespace(value)
    .replace(/\s*\|\s*OLX.*$/i, "")
    .replace(/\s+OLX\s*$/i, "")
    .replace(/\s+\d{8,}\s*$/i, "")
    .slice(0, 180);
}

function normalizeDescription(value: string) {
  const cleaned = normalizeWhitespace(value)
    .replace(/\s*\|\s*OLX.*$/i, "")
    .replace(/^OLX\s*-\s*/i, "");

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
  const fromUrl = url.match(/-(\d{8,})(?:[/?#]|$)/)?.[1] ?? url.match(/\/(\d{8,})(?:[/?#]|$)/)?.[1];
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
    if (candidate && !/olx|zap|viva real/i.test(candidate)) found = candidate;
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

function buildRawPayload(input: {
  requestedUrl: string;
  finalUrl: string;
  canonicalUrl: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  jsonLdCount: number;
  nextDataDetected: boolean;
  extractedAt: string;
}) {
  return {
    importer: "olx-url",
    requestedUrl: input.requestedUrl,
    finalUrl: input.finalUrl,
    canonicalUrl: input.canonicalUrl,
    extractedAt: input.extractedAt,
    detected: {
      title: input.title,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
      jsonLdCount: input.jsonLdCount,
      nextDataDetected: input.nextDataDetected
    }
  } satisfies Prisma.InputJsonValue;
}

function extractOlxListing(html: string, requestedUrl: string, finalUrl: URL): OlxExtractedListing {
  const $ = cheerio.load(html);
  const canonicalUrl = getCanonicalUrl($, finalUrl);
  const jsonLdRecords = parseJsonLdBlocks($);
  const nextData = parseNextData($);
  const listingRecord = findLikelyListingRecord(jsonLdRecords);
  const jsonAddress = extractAddressFromJson(listingRecord);
  const metaTitle = getMeta($, ["meta[property='og:title']", "meta[name='twitter:title']"]);
  const title = stripOlxTitle(firstNonEmpty(getRecordString(listingRecord, "name"), $("h1").first().text(), metaTitle, $("title").first().text()));
  const metaDescription = getMeta($, ["meta[property='og:description']", "meta[name='description']", "meta[name='twitter:description']"]);
  const description = normalizeDescription(firstNonEmpty(getRecordString(listingRecord, "description"), metaDescription));
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
  const isPrivateSeller = inferPrivateSeller(searchText, advertiserName);
  const rawPayload = buildRawPayload({
    requestedUrl,
    finalUrl: finalUrl.toString(),
    canonicalUrl,
    title,
    metaTitle,
    metaDescription,
    jsonLdCount: jsonLdRecords.length,
    nextDataDetected: Boolean(nextData),
    extractedAt: new Date().toISOString()
  });

  if (!title || title.length < 3) {
    throw new Error("Nao encontrei o titulo do anuncio da OLX.");
  }

  return {
    title,
    description: description || null,
    sourceUrl: canonicalUrl,
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
    isPrivateSeller,
    hasFullAddress: Boolean(address),
    rawPayload,
    notes: [
      "Importado automaticamente da OLX. Validar dados, contato e permissao de abordagem antes de publicar.",
      isPrivateSeller ? "Particular inferido pelo importador." : "Anunciante pode ser profissional; revisar antes da abordagem."
    ].join("\n")
  };
}

export async function scrapeOlxListing(sourceUrlValue: string) {
  const sourceUrl = parseOlxUrl(sourceUrlValue);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OLX_CAPTURE_TIMEOUT_MS);

  try {
    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.7",
        "User-Agent": "PedroSoaresCRM/1.0 (+https://www.pedrosoaresimoveis.com.br)"
      }
    });

    if (!response.ok) {
      throw new Error(`Nao consegui ler o anuncio da OLX. Status ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType && !contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error("A URL da OLX nao retornou uma pagina HTML.");
    }

    const finalUrl = new URL(response.url || sourceUrl.toString());
    if (isPrivateHost(finalUrl.hostname)) {
      throw new Error("A pagina redirecionou para uma URL bloqueada por seguranca.");
    }
    if (!isOlxHost(finalUrl.hostname)) {
      throw new Error("A pagina redirecionou para fora da OLX.");
    }

    const html = await readLimitedText(response, MAX_SCRAPE_HTML_BYTES);
    const listing = extractOlxListing(html, sourceUrl.toString(), finalUrl);

    if (!listing.price) {
      throw new Error("Nao encontrei o preco do anuncio da OLX. Cadastre manualmente ou tente outra URL.");
    }

    return listing;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Tempo esgotado ao ler o anuncio da OLX.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function importOlxCapturedListing(sourceUrl: string, actorId?: string | null): Promise<CaptureListingItem> {
  const listing = await scrapeOlxListing(sourceUrl);
  const price = listing.price;

  if (!price) {
    throw new Error("Nao encontrei o preco do anuncio da OLX. Cadastre manualmente ou tente outra URL.");
  }

  return createCapturedListing(
    {
      sourceName: "OLX",
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
      isPrivateSeller: listing.isPrivateSeller,
      hasFullAddress: listing.hasFullAddress,
      rawPayload: listing.rawPayload,
      notes: listing.notes
    },
    actorId
  );
}
