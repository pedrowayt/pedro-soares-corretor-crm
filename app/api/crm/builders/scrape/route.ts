import type { Prisma } from "@prisma/client";
import * as cheerio from "cheerio";
import { z } from "zod";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { slugify } from "@/lib/crm/slug";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_SCRAPE_HTML_BYTES = 2 * 1024 * 1024;
const SCRAPE_TIMEOUT_MS = 12_000;

const scrapeBuilderSchema = z.object({
  sourceUrl: z.string().min(8)
});

type JsonRecord = Record<string, unknown>;

type BuilderScrapeFields = {
  name: string | null;
  slug: string | null;
  logoUrl: string | null;
  description: string | null;
  city: string | null;
  state: string | null;
  foundedYear: number | null;
  website: string | null;
  instagram: string | null;
  deliveredDevelopmentsCount: number | null;
  deliveredUnitsCount: number | null;
  activeProjectsCount: number | null;
  institutionalText: string | null;
};

type LogoCandidate = {
  url: string;
  label: string;
  source: string;
  score: number;
};

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function stripTagsText(value: string) {
  return normalizeWhitespace(value.replace(/\u00a0/g, " "));
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

function parsePublicHttpUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("URL da construtora invalida.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Use uma URL iniciando com http:// ou https://.");
  }

  if (isPrivateHost(url.hostname)) {
    throw new Error("Essa URL nao pode ser acessada pelo scraper por seguranca.");
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
      throw new Error("A pagina e grande demais para leitura automatica.");
    }

    chunks.push(value);
  }

  return new TextDecoder("utf-8").decode(Buffer.concat(chunks));
}

function firstSrcFromSrcset(value: string) {
  return value
    .split(",")
    .map((item) => item.trim().split(/\s+/)[0])
    .find(Boolean) ?? "";
}

function resolvePageUrl(value: string | undefined, baseUrl: URL) {
  if (!value) return "";
  if (value.startsWith("data:") || value.startsWith("blob:")) return "";

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return "";
  }
}

function getMeta($: cheerio.CheerioAPI, selectors: string[]) {
  for (const selector of selectors) {
    const value = $(selector).first().attr("content");
    if (value?.trim()) return normalizeWhitespace(value);
  }

  return "";
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
    const scriptText = $(element).text().trim();
    if (!scriptText) return;

    try {
      collectJsonLd(JSON.parse(scriptText), records);
    } catch {
      // Ignore invalid structured data blocks. The regular HTML fallback still runs.
    }
  });

  return records;
}

function getTypeNames(record: JsonRecord) {
  const type = record["@type"];
  if (Array.isArray(type)) return type.map((item) => String(item).toLowerCase());
  if (typeof type === "string") return [type.toLowerCase()];
  return [];
}

function isLikelyOrganizationRecord(record: JsonRecord) {
  const typeNames = getTypeNames(record);
  return (
    typeNames.some((type) =>
      ["organization", "corporation", "localbusiness", "realestateagent", "homeandconstructionbusiness"].includes(type)
    ) ||
    Boolean(record.logo && record.name) ||
    Boolean(record.address && record.name)
  );
}

function getRecordString(record: JsonRecord | null, key: string) {
  if (!record) return "";
  const value = record[key];
  if (typeof value === "string") return normalizeWhitespace(value);
  return "";
}

function getNestedUrl(value: unknown) {
  if (typeof value === "string") return normalizeWhitespace(value);
  if (!isRecord(value)) return "";

  for (const key of ["url", "contentUrl", "@id"]) {
    const found = getRecordString(value, key);
    if (found) return found;
  }

  return "";
}

function getJsonLogoUrl(record: JsonRecord | null, baseUrl: URL) {
  if (!record) return "";

  for (const key of ["logo", "image"]) {
    const value = record[key];
    if (Array.isArray(value)) {
      for (const item of value) {
        const url = resolvePageUrl(getNestedUrl(item), baseUrl);
        if (url) return url;
      }
    } else {
      const url = resolvePageUrl(getNestedUrl(value), baseUrl);
      if (url) return url;
    }
  }

  return "";
}

function cleanTitleName(value: string) {
  const cleaned = normalizeWhitespace(value);
  if (!cleaned) return "";

  const parts = cleaned
    .split(/\s(?:\||-|::|»|>)\s/)
    .map((part) => normalizeWhitespace(part))
    .filter(Boolean);

  const candidate = parts.find((part) => !/^(home|inicio|início|sobre|quem somos)$/i.test(part)) ?? parts[0] ?? cleaned;
  return candidate.slice(0, 120);
}

function domainName(hostname: string) {
  return hostname.replace(/^www\./, "").split(".")[0]?.replace(/[-_]+/g, " ") ?? "";
}

function extractAddress(record: JsonRecord | null) {
  const address = record?.address;
  if (!isRecord(address)) return { city: "", state: "" };

  return {
    city: getRecordString(address, "addressLocality"),
    state: getRecordString(address, "addressRegion")
  };
}

function extractLocationFromText(text: string) {
  const stateCodes = "AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO";
  const match = text.match(new RegExp(`\\b([A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-Za-zÀ-ÿ .'-]{2,40})\\s*[-/]\\s*(${stateCodes})\\b`));
  if (!match) return { city: "", state: "" };

  return {
    city: normalizeWhitespace(match[1]),
    state: match[2]
  };
}

function yearFromText(value: string) {
  const match = value.match(/\b(19\d{2}|20\d{2})\b/);
  if (!match) return null;

  const year = Number(match[1]);
  const currentYear = new Date().getFullYear();
  return year >= 1800 && year <= currentYear ? year : null;
}

function extractFoundedYear(record: JsonRecord | null, bodyText: string) {
  const foundingDate = getRecordString(record, "foundingDate") || getRecordString(record, "foundingYear");
  const fromJson = yearFromText(foundingDate);
  if (fromJson) return fromJson;

  const sentences = bodyText.split(/[.;\n]+/).map((item) => normalizeWhitespace(item));
  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    if (!/(fundad|desde|historia|história|nasceu|inicio|início)/.test(lower)) continue;

    const year = yearFromText(sentence);
    if (year) return year;
  }

  return null;
}

function parseBrazilianNumber(value: string) {
  const hasMil = /\bmil\b/i.test(value);
  const normalized = value.replace(/[^\d]/g, "");
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;

  return hasMil && parsed < 1000 ? parsed * 1000 : parsed;
}

function extractNumberNear(text: string, targets: RegExp, qualifiers: RegExp) {
  const sentences = text.split(/[.;\n]+/).map((item) => normalizeWhitespace(item));

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    if (!targets.test(lower) || !qualifiers.test(lower)) continue;

    const numbers = sentence.match(/\b\d[\d.\s]*(?:\s*mil)?\b/gi) ?? [];
    const parsed = numbers
      .map(parseBrazilianNumber)
      .filter((item): item is number => Boolean(item))
      .filter((item) => !(item >= 1800 && item <= 2100));

    if (parsed.length) return Math.max(...parsed);
  }

  return null;
}

function extractParagraphs($: cheerio.CheerioAPI) {
  const seen = new Set<string>();
  const paragraphs: string[] = [];

  $("main p, article p, section p, [class*='sobre'] p, [id*='sobre'] p, [class*='about'] p, [id*='about'] p, p").each(
    (_, element) => {
      const text = stripTagsText($(element).text());
      if (text.length < 45 || text.length > 900) return;

      const lower = text.toLowerCase();
      if (!/(construtor|incorporador|empreendimento|obra|unidade|mercado|anos|história|historia)/.test(lower)) return;
      if (seen.has(text)) return;

      seen.add(text);
      paragraphs.push(text);
    }
  );

  return paragraphs.slice(0, 5);
}

function normalizeInstagramUrl(rawValue: string, baseUrl: URL) {
  const raw = rawValue.trim();
  if (!raw) return "";

  const handleMatch = raw.match(/(?:^|\s)@([a-z0-9._]{2,30})/i);
  if (handleMatch) return `https://www.instagram.com/${handleMatch[1]}`;

  const url = resolvePageUrl(raw, baseUrl);
  if (!url) return "";

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.toLowerCase().includes("instagram.com")) return "";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function findInstagram($: cheerio.CheerioAPI, baseUrl: URL, bodyText: string) {
  let found = "";

  $("a[href*='instagram.com']").each((_, element) => {
    if (found) return;
    found = normalizeInstagramUrl($(element).attr("href") ?? "", baseUrl);
  });

  if (found) return found;
  return normalizeInstagramUrl(bodyText, baseUrl);
}

function parseDimension(value: string | undefined) {
  if (!value) return null;
  const parsed = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function scoreLogoCandidate(input: {
  url: string;
  label: string;
  source: string;
  width: number | null;
  height: number | null;
  builderName: string;
}) {
  const haystack = `${input.url} ${input.label} ${input.source}`.toLowerCase();
  const nameTokens = input.builderName
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length >= 4);
  let score = 0;

  if (/logo|logotipo|marca|brand/.test(haystack)) score += 70;
  if (/construtor|incorporador|empreendimento/.test(haystack)) score += 15;
  if (nameTokens.some((token) => haystack.includes(token))) score += 20;
  if (/\.(svg)(\?|#|$)/i.test(input.url)) score += 12;

  if (input.width && input.height) {
    const ratio = input.width / input.height;
    if (input.width <= 800 && input.height <= 400) score += 10;
    if (ratio >= 1.2 && ratio <= 6) score += 10;
    if (input.width < 24 || input.height < 24) score -= 40;
  }

  if (/favicon|apple-touch-icon|manifest/.test(haystack)) score -= 30;
  return score;
}

function addLogoCandidate(
  candidates: Map<string, LogoCandidate>,
  baseUrl: URL,
  rawUrl: string,
  data: {
    label?: string;
    source: string;
    width?: number | null;
    height?: number | null;
    builderName: string;
    baseScore?: number;
  }
) {
  const url = resolvePageUrl(rawUrl, baseUrl);
  if (!url || candidates.has(url)) return;

  const label = normalizeWhitespace(data.label ?? "");
  const score =
    (data.baseScore ?? 0) +
    scoreLogoCandidate({
      url,
      label,
      source: data.source,
      width: data.width ?? null,
      height: data.height ?? null,
      builderName: data.builderName
    });

  candidates.set(url, {
    url,
    label,
    source: data.source,
    score
  });
}

function collectLogoCandidates($: cheerio.CheerioAPI, baseUrl: URL, jsonLogoUrl: string, builderName: string) {
  const candidates = new Map<string, LogoCandidate>();

  if (jsonLogoUrl) {
    addLogoCandidate(candidates, baseUrl, jsonLogoUrl, {
      label: builderName,
      source: "json-ld",
      builderName,
      baseScore: 100
    });
  }

  const ogImage = getMeta($, ["meta[property='og:image']", "meta[name='twitter:image']"]);
  if (ogImage) {
    addLogoCandidate(candidates, baseUrl, ogImage, {
      label: getMeta($, ["meta[property='og:title']", "meta[name='twitter:title']"]) || builderName,
      source: "meta",
      builderName,
      baseScore: 10
    });
  }

  $("link[rel*='icon']").each((_, element) => {
    addLogoCandidate(candidates, baseUrl, $(element).attr("href") ?? "", {
      label: $(element).attr("rel") ?? "",
      source: "icon",
      builderName,
      baseScore: 5
    });
  });

  $("img").each((_, element) => {
    const node = $(element);
    const rawSrc =
      node.attr("src") ||
      node.attr("data-src") ||
      node.attr("data-lazy-src") ||
      node.attr("data-original") ||
      firstSrcFromSrcset(node.attr("srcset") ?? node.attr("data-srcset") ?? "");
    const label = [node.attr("alt"), node.attr("title"), node.attr("class"), node.attr("id")].filter(Boolean).join(" ");

    addLogoCandidate(candidates, baseUrl, rawSrc ?? "", {
      label,
      source: "img",
      width: parseDimension(node.attr("width")),
      height: parseDimension(node.attr("height")),
      builderName,
      baseScore: 0
    });
  });

  return Array.from(candidates.values()).sort((a, b) => b.score - a.score).slice(0, 8);
}

function publicWebsiteUrl(record: JsonRecord | null, finalUrl: URL) {
  const rawUrl = getRecordString(record, "url") || getRecordString(record, "@id");
  const resolved = resolvePageUrl(rawUrl, finalUrl);

  if (!resolved) return finalUrl.origin;

  try {
    const parsed = new URL(resolved);
    if (isPrivateHost(parsed.hostname)) return finalUrl.origin;
    return parsed.origin;
  } catch {
    return finalUrl.origin;
  }
}

function firstUsefulDescription(...values: string[]) {
  return values.map(normalizeWhitespace).find((value) => value.length >= 35) ?? values.map(normalizeWhitespace).find(Boolean) ?? "";
}

function firstNonEmpty(...values: string[]) {
  return values.map(normalizeWhitespace).find(Boolean) ?? "";
}

function extractBuilderFields(html: string, finalUrl: URL) {
  const $ = cheerio.load(html);
  const jsonLdRecords = parseJsonLdBlocks($);
  const organization = jsonLdRecords.find(isLikelyOrganizationRecord) ?? null;

  const title = cleanTitleName($("title").first().text());
  const h1 = cleanTitleName($("h1").first().text());
  const metaSiteName = getMeta($, ["meta[property='og:site_name']", "meta[name='application-name']"]);
  const jsonName = getRecordString(organization, "name");
  const fallbackName = cleanTitleName(domainName(finalUrl.hostname));
  const name = firstNonEmpty(jsonName, metaSiteName, h1, title, fallbackName);
  const jsonDescription = getRecordString(organization, "description");
  const metaDescription = getMeta($, ["meta[name='description']", "meta[property='og:description']", "meta[name='twitter:description']"]);
  const logoCandidates = collectLogoCandidates($, finalUrl, getJsonLogoUrl(organization, finalUrl), name);
  const rawBodyText = stripTagsText($("body").text());
  const instagram = findInstagram($, finalUrl, rawBodyText);

  $("script, style, noscript, iframe, svg, form, nav").remove();

  const paragraphs = extractParagraphs($);
  const bodyText = stripTagsText($("body").text());
  const address = extractAddress(organization);
  const textLocation = extractLocationFromText(bodyText);
  const bestLogo = logoCandidates.find((candidate) => candidate.score >= 50) ?? null;
  const description = firstUsefulDescription(jsonDescription, metaDescription, paragraphs[0] ?? "");
  const institutionalText = [description, ...paragraphs]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .slice(0, 5)
    .join("\n\n");

  const fields: BuilderScrapeFields = {
    name: name || null,
    slug: name ? slugify(name) : null,
    logoUrl: bestLogo?.url ?? null,
    description: description || null,
    city: address.city || textLocation.city || null,
    state: address.state || textLocation.state || null,
    foundedYear: extractFoundedYear(organization, bodyText),
    website: publicWebsiteUrl(organization, finalUrl),
    instagram: instagram || null,
    deliveredDevelopmentsCount: extractNumberNear(bodyText, /empreendimento|obra|projeto/, /entreg|conclu|realizad/),
    deliveredUnitsCount: extractNumberNear(bodyText, /unidade|apartamento|im[oó]vel|lar/, /entreg|conclu|realizad/),
    activeProjectsCount: extractNumberNear(bodyText, /empreendimento|obra|projeto|lan[cç]amento/, /ativo|andamento|lan[cç]amento/),
    institutionalText: institutionalText || null
  };

  return {
    fields,
    logoCandidates
  };
}

async function scrapeBuilderPage(sourceUrlValue: string) {
  const sourceUrl = parsePublicHttpUrl(sourceUrlValue);
  if (!sourceUrl) {
    throw new Error("Informe uma URL da construtora.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);

  try {
    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "PedroSoaresCRM/1.0 (+https://www.pedrosoaresimoveis.com.br)"
      }
    });

    if (!response.ok) {
      throw new Error(`Nao consegui ler a pagina informada. Status ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType && !contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error("A URL informada nao retornou uma pagina HTML.");
    }

    const finalUrl = new URL(response.url || sourceUrl.toString());
    if (isPrivateHost(finalUrl.hostname)) {
      throw new Error("A pagina redirecionou para uma URL bloqueada por seguranca.");
    }

    const html = await readLimitedText(response, MAX_SCRAPE_HTML_BYTES);
    return {
      finalUrl,
      ...extractBuilderFields(html, finalUrl)
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Tempo esgotado ao ler a pagina da construtora.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const parsed = scrapeBuilderSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Informe a URL da construtora para buscar os dados.", 422, parsed.error.flatten());
  }

  try {
    const scraped = await scrapeBuilderPage(parsed.data.sourceUrl);

    await prisma.auditLog
      .create({
        data: {
          action: "BUILDER_SCRAPE_PREFILL",
          resource: "Builder",
          actorId: session?.userId,
          metadata: {
            sourceUrl: parsed.data.sourceUrl,
            finalUrl: scraped.finalUrl.toString(),
            extractedFields: Object.fromEntries(Object.entries(scraped.fields).filter(([, value]) => value !== null && value !== ""))
          } as Prisma.InputJsonValue
        }
      })
      .catch(() => null);

    return ok({
      builder: scraped.fields,
      source: {
        requestedUrl: parsed.data.sourceUrl,
        finalUrl: scraped.finalUrl.toString()
      },
      logoCandidates: scraped.logoCandidates
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao buscar dados da construtora.", 400);
  }
}
