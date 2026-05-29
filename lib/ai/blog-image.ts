import { createImageDirectUpload, getCloudflareImageDeliveryUrl } from "@/lib/cloudflare/client";

const OPENAI_IMAGE_MODEL = process.env.OPENAI_BLOG_IMAGE_MODEL || "dall-e-3";
const OPENAI_IMAGE_SIZE =
  process.env.OPENAI_BLOG_IMAGE_SIZE || (OPENAI_IMAGE_MODEL === "dall-e-3" ? "1792x1024" : "1536x1024");

export type BlogImageStrategy = "og" | "ai";

export type BlogImageResult = {
  imageUrl: string;
  strategy: BlogImageStrategy;
  promptUsed?: string;
  sourceUrl?: string;
};

const URL_REGEX = /^https?:\/\/\S+$/i;

export function extractSingleUrl(text: string | undefined | null): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (!trimmed) return null;
  // Single-URL line
  if (URL_REGEX.test(trimmed)) return trimmed;
  // Or text whose first line is a bare URL
  const firstLine = trimmed.split("\n")[0]?.trim() ?? "";
  if (URL_REGEX.test(firstLine)) return firstLine;
  // Or first URL found in text body (last resort)
  const match = trimmed.match(/https?:\/\/[^\s)]+/);
  return match ? match[0] : null;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

function extractMetaContent(html: string, propertyOrName: string): string | null {
  // Order can vary: property/name first or content first
  const variants = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${propertyOrName}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${propertyOrName}["']`,
      "i"
    )
  ];
  for (const re of variants) {
    const m = html.match(re);
    if (m && m[1]) return decodeHtmlEntities(m[1]);
  }
  return null;
}

function resolveImageUrl(rawUrl: string, baseUrl: string): string {
  try {
    return new URL(rawUrl, baseUrl).toString();
  } catch {
    return rawUrl;
  }
}

export async function fetchOgImage(pageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(pageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PedroSoaresBlogBot/1.0)",
        Accept: "text/html,application/xhtml+xml"
      },
      signal: AbortSignal.timeout(8000),
      redirect: "follow"
    });
    if (!response.ok) return null;
    const html = (await response.text()).slice(0, 200000);
    const candidates = [
      extractMetaContent(html, "og:image:secure_url"),
      extractMetaContent(html, "og:image:url"),
      extractMetaContent(html, "og:image"),
      extractMetaContent(html, "twitter:image"),
      extractMetaContent(html, "twitter:image:src")
    ].filter((value): value is string => Boolean(value));

    const found = candidates[0];
    if (!found) return null;
    return resolveImageUrl(found, pageUrl);
  } catch {
    return null;
  }
}

function buildImagePrompt(options: { title?: string; excerpt?: string; tagLabels?: string[] }) {
  const parts: string[] = [];
  parts.push(
    "Fotografia editorial de capa para blog imobiliário em Palmas, Tocantins, Brasil."
  );
  if (options.title) parts.push(`Tema do post: ${options.title}.`);
  if (options.excerpt) parts.push(`Resumo: ${options.excerpt}.`);
  if (options.tagLabels && options.tagLabels.length) {
    parts.push(`Contexto: ${options.tagLabels.join(", ")}.`);
  }
  parts.push(
    "Estilo cinematográfico de revista, golden hour, composição ampla 16:9, alta qualidade.",
    "Sem texto sobreposto, sem logos, sem marcas d'água, sem rostos em primeiro plano.",
    "Inspirado na arquitetura moderna de Palmas TO, vegetação tropical, urbanismo planejado."
  );
  return parts.join(" ");
}

type OpenAiImagePayload = {
  data?: Array<{ b64_json?: string; url?: string }>;
  error?: { message?: string };
};

async function callOpenAiImage(prompt: string): Promise<{ b64?: string; url?: string }> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }
  const body: Record<string, unknown> = {
    model: OPENAI_IMAGE_MODEL,
    prompt,
    n: 1,
    size: OPENAI_IMAGE_SIZE
  };
  if (OPENAI_IMAGE_MODEL === "dall-e-3") {
    body.quality = "standard";
    body.response_format = "b64_json";
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(45000)
  });

  const payload = (await response.json().catch(() => null)) as OpenAiImagePayload | null;
  if (!response.ok || !payload?.data?.[0]) {
    const message = payload?.error?.message ?? `Falha na imagem (HTTP ${response.status}).`;
    if (/does not exist|invalid model/i.test(message)) {
      throw new Error(
        `Modelo de imagem OpenAI inválido (${OPENAI_IMAGE_MODEL}). Use dall-e-3 ou gpt-image-1.`
      );
    }
    if (response.status === 401) {
      throw new Error("Chave OpenAI inválida para geração de imagem.");
    }
    if (response.status === 429) {
      throw new Error("OpenAI atingiu o limite de uso/quota para imagens.");
    }
    throw new Error(message);
  }

  return { b64: payload.data[0].b64_json, url: payload.data[0].url };
}

async function uploadBufferToCloudflareImages(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const direct = await createImageDirectUpload({
    metadata: { module: "blog", source: "ai-generated" }
  });

  const form = new FormData();
  const blob = new Blob([new Uint8Array(buffer)], { type: "image/png" });
  form.append("file", blob, fileName);

  const upload = await fetch(direct.uploadURL, { method: "POST", body: form });
  const json = (await upload.json().catch(() => null)) as {
    success?: boolean;
    result?: { id?: string; variants?: string[] };
    errors?: Array<{ message?: string }>;
  } | null;

  if (!upload.ok || !json?.success) {
    const message = json?.errors?.[0]?.message ?? `Falha no upload Cloudflare (HTTP ${upload.status}).`;
    throw new Error(message);
  }

  const id = json.result?.id ?? direct.id;
  if (id) {
    const deliveryUrl = getCloudflareImageDeliveryUrl(id);
    if (deliveryUrl) return deliveryUrl;
  }
  const variant = json.result?.variants?.[0];
  if (variant) return variant;
  throw new Error("Cloudflare aceitou o upload mas não retornou URL pública.");
}

export type GenerateBlogImageInput = {
  sourceText?: string;
  title?: string;
  excerpt?: string;
  tagLabels?: string[];
};

export async function generateBlogImage(
  input: GenerateBlogImageInput
): Promise<BlogImageResult> {
  // 1) Try og:image when the source text is (or contains) a URL
  const sourceUrl = extractSingleUrl(input.sourceText);
  if (sourceUrl) {
    const og = await fetchOgImage(sourceUrl);
    if (og) {
      return { imageUrl: og, strategy: "og", sourceUrl };
    }
  }

  // 2) Fall back to AI generation
  const prompt = buildImagePrompt({
    title: input.title,
    excerpt: input.excerpt,
    tagLabels: input.tagLabels
  });

  const { b64, url } = await callOpenAiImage(prompt);

  let buffer: Buffer;
  if (b64) {
    buffer = Buffer.from(b64, "base64");
  } else if (url) {
    const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new Error("Falha ao baixar imagem gerada pela OpenAI.");
    buffer = Buffer.from(await r.arrayBuffer());
  } else {
    throw new Error("OpenAI não retornou imagem.");
  }

  const fileName = `blog-${Date.now()}.png`;
  const imageUrl = await uploadBufferToCloudflareImages(buffer, fileName);
  return { imageUrl, strategy: "ai", promptUsed: prompt };
}
