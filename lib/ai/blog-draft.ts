import { z } from "zod";
import { createBlogPost, listCrmBlogPosts } from "@/lib/data/blog";
import { listHighlightedDevelopments } from "@/lib/data/developments";
import { listPublicProperties } from "@/lib/data/properties";
import { parseJsonSafely } from "@/lib/api/http";

const OPENAI_MODEL =
  process.env.OPENAI_BLOG_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";

const NEWS_FEED_URL =
  process.env.BLOG_NEWS_FEED_URL ||
  "https://news.google.com/rss/search?q=im%C3%B3veis+Palmas+Tocantins&hl=pt-BR&gl=BR&ceid=BR:pt-419";

type NewsHeadline = { title: string; pubDate: string };

async function fetchLatestNews(): Promise<NewsHeadline[]> {
  try {
    const response = await fetch(NEWS_FEED_URL, {
      headers: { "user-agent": "PedroSoaresBlogBot/1.0" },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return [];
    const xml = await response.text();
    const items = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
    return items
      .slice(0, 6)
      .map((block) => {
        const titleMatch =
          block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ??
          block.match(/<title>([\s\S]*?)<\/title>/);
        const pubMatch = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        const title = (titleMatch?.[1] ?? "").trim();
        const pubDate = (pubMatch?.[1] ?? "").trim();
        return { title, pubDate };
      })
      .filter((item) => item.title.length > 0);
  } catch {
    return [];
  }
}

function translateOpenAiError(message: string, status?: number): string {
  const lower = message.toLowerCase();
  if (lower.includes("does not exist") || lower.includes("invalid model")) {
    return `Modelo OpenAI inválido (${OPENAI_MODEL}). Ajuste OPENAI_BLOG_MODEL ou OPENAI_MODEL para um modelo existente (ex: gpt-4o-mini, gpt-4o).`;
  }
  if (status === 401 || lower.includes("invalid api key") || lower.includes("incorrect api key")) {
    return "Chave OpenAI inválida. Verifique OPENAI_API_KEY.";
  }
  if (status === 429 || lower.includes("rate limit") || lower.includes("quota")) {
    return "OpenAI atingiu o limite de uso/quota. Tente novamente em instantes ou cheque o faturamento.";
  }
  if (status === 400 && lower.includes("max_output_tokens")) {
    return "Resposta da IA excedeu o limite de tokens. Reduza o prompt ou aumente max_output_tokens.";
  }
  return `OpenAI: ${message}`;
}

export type BlogDraftTopic =
  | "LANCAMENTO_NOVO"
  | "BAIRRO_EM_DESTAQUE"
  | "DICA_COMPRADOR"
  | "ANALISE_MERCADO";

const TOPIC_ROTATION: BlogDraftTopic[] = [
  "LANCAMENTO_NOVO",
  "BAIRRO_EM_DESTAQUE",
  "DICA_COMPRADOR",
  "ANALISE_MERCADO"
];

const aiDraftOutputSchema = z.object({
  title: z.string().min(8),
  slug: z.string().min(3),
  excerpt: z.string().min(20).max(280),
  bodyMarkdown: z.string().min(200),
  tagSlugs: z.array(z.string()).default([])
});

const aiOutputJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    slug: { type: "string" },
    excerpt: { type: "string" },
    bodyMarkdown: { type: "string" },
    tagSlugs: { type: "array", items: { type: "string" } }
  },
  required: ["title", "slug", "excerpt", "bodyMarkdown", "tagSlugs"]
} as const;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

async function pickNextTopic(): Promise<BlogDraftTopic> {
  const recent = await listCrmBlogPosts();
  const lastFromAi = recent.find((post) => post.source === "AI_GENERATED");
  if (!lastFromAi) return TOPIC_ROTATION[0];

  // best effort: rotate based on tag of the previous draft if a topic tag was applied
  const lastTags = new Set(lastFromAi.tags.map((tag) => tag.slug));
  const found = TOPIC_ROTATION.find((topic) => lastTags.has(slugify(topic)));
  if (!found) return TOPIC_ROTATION[0];
  const idx = TOPIC_ROTATION.indexOf(found);
  return TOPIC_ROTATION[(idx + 1) % TOPIC_ROTATION.length];
}

type BlogContext = {
  topic: BlogDraftTopic;
  developmentsBlock: string;
  propertiesBlock: string;
  areasBlock: string;
  newsBlock: string;
};

async function buildContext(topic: BlogDraftTopic): Promise<BlogContext> {
  const [developments, properties, news] = await Promise.all([
    listHighlightedDevelopments(4),
    listPublicProperties(),
    fetchLatestNews()
  ]);

  const newsBlock = news
    .slice(0, 5)
    .map((item) => `- ${item.title}${item.pubDate ? ` (${item.pubDate})` : ""}`)
    .join("\n");

  const developmentsBlock = developments
    .slice(0, 4)
    .map((dev) => {
      const price = dev.startingPriceNumber
        ? `R$ ${dev.startingPriceNumber.toLocaleString("pt-BR")}`
        : "Sob consulta";
      const beds = `${dev.bedroomsFrom ?? "-"} a ${dev.bedroomsTo ?? "-"} quartos`;
      const area = `${dev.areaFromM2Number ?? "-"} a ${dev.areaToM2Number ?? "-"} m²`;
      return `- ${dev.title} (${dev.city} - ${dev.district}). Estágio: ${dev.stage}. A partir de ${price}. ${beds}. ${area}. URL: /lancamentos/${dev.slug}`;
    })
    .join("\n");

  const propertiesBlock = properties
    .slice(0, 8)
    .map((p) => {
      const price = `R$ ${p.priceValue.toLocaleString("pt-BR")}`;
      return `- ${p.title} (${p.city} - ${p.district}). ${p.type}. ${p.bedrooms ?? "-"} quartos. ${p.areaM2Value ?? "-"} m². ${price}. URL: /imoveis/${p.slug}`;
    })
    .join("\n");

  const areaMap = new Map<string, { city: string; district: string; count: number }>();
  for (const p of properties) {
    const key = `${p.city}|${p.district}`;
    const existing = areaMap.get(key);
    if (existing) existing.count += 1;
    else areaMap.set(key, { city: p.city, district: p.district, count: 1 });
  }
  const areasBlock = [...areaMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((a) => `- ${a.district} (${a.city}): ${a.count} imóvel(is) ativo(s).`)
    .join("\n");

  return { topic, developmentsBlock, propertiesBlock, areasBlock, newsBlock };
}

const topicInstruction: Record<BlogDraftTopic, string> = {
  LANCAMENTO_NOVO:
    "Escreva um post sobre UM dos lançamentos listados em <lancamentos>. Escolha o mais relevante e gere conteúdo aprofundado, com link interno para a URL fornecida.",
  BAIRRO_EM_DESTAQUE:
    "Escreva uma análise do bairro com mais oferta em <bairros>. Discuta perfil, preço médio aproximado dos imóveis listados e oportunidades. Sem inventar dados além dos fornecidos.",
  DICA_COMPRADOR:
    "Escreva uma dica prática para quem vai comprar imóvel em Palmas. Use os tipos de imóvel/bairros em <imoveis> e <bairros> como exemplos reais. Tom consultivo.",
  ANALISE_MERCADO:
    "Faça uma leitura curta do mercado de Palmas usando os dados em <imoveis> e <lancamentos>. Destaque tipologias e bairros aparentes. Sem projeções não fundamentadas."
};

function buildPrompt(ctx: BlogContext) {
  return `Você é redator do blog Pedro Soares Imóveis em Palmas TO. Tom consultivo, segunda pessoa do plural ("vocês"), dados factuais, sem superlativos vazios.

Tópico desta rodada: ${ctx.topic}.
${topicInstruction[ctx.topic]}

Use apenas os fatos fornecidos abaixo. Se faltar algo (preço, área, prazo), NÃO invente — descreva qualitativamente.

<lancamentos>
${ctx.developmentsBlock || "Nenhum lançamento publicado no momento."}
</lancamentos>

<imoveis>
${ctx.propertiesBlock || "Sem imóveis listados."}
</imoveis>

<bairros>
${ctx.areasBlock || "Sem bairros com listagens."}
</bairros>

<noticias_recentes>
${ctx.newsBlock || "Sem notícias relevantes capturadas no momento."}
</noticias_recentes>

Se houver notícias úteis em <noticias_recentes>, comente brevemente, sem reproduzir manchetes na íntegra e sem inventar conteúdo além do título.

Estrutura obrigatória do bodyMarkdown:
1. Parágrafo introdutório (sem H1 — o título já é renderizado fora).
2. 2 a 4 seções com H2 ## e bullets ou parágrafos curtos.
3. Encerramento com chamada para conversar pelo WhatsApp ou ver imóveis no /imoveis/prontos.

Saída JSON estrita:
- title: até 70 caracteres
- slug: kebab-case, só [a-z0-9-], até 70 caracteres
- excerpt: 80-280 caracteres, sem aspas
- bodyMarkdown: markdown puro, mínimo 600 caracteres
- tagSlugs: 2 a 5 slugs em kebab-case (use "${slugify(ctx.topic)}" como uma das tags)`;
}

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const direct = (payload as { output_text?: unknown }).output_text;
  if (typeof direct === "string") return direct;

  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return "";

  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const c of content) {
      if (!c || typeof c !== "object") continue;
      const text = (c as { text?: unknown }).text;
      if (typeof text === "string" && text.trim()) return text;
    }
  }
  return "";
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  const normalized = slugify(baseSlug);
  if (!normalized) return `post-${Date.now()}`;
  const existing = await listCrmBlogPosts();
  const taken = new Set(existing.map((post) => post.slug));
  if (!taken.has(normalized)) return normalized;
  return `${normalized}-${Date.now()}`;
}

export type BlogDraftResult = {
  topic: BlogDraftTopic;
  postId: string;
  title: string;
  slug: string;
};

export type BlogDraftContent = {
  topic: BlogDraftTopic;
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  tagSlugs: string[];
};

export async function generateBlogDraftContent(): Promise<BlogDraftContent> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

  const topic = await pickNextTopic();
  const context = await buildContext(topic);
  const prompt = buildPrompt(context);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content:
            "Você é redator do blog Pedro Soares Imóveis. Produza apenas conteúdo factual e respeite o JSON schema."
        },
        { role: "user", content: prompt }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "blog_post_draft",
          schema: aiOutputJsonSchema,
          strict: true
        }
      },
      max_output_tokens: 4000
    })
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const rawMessage =
      typeof payload?.error?.message === "string"
        ? payload.error.message
        : "Falha desconhecida na chamada do OpenAI.";
    throw new Error(translateOpenAiError(rawMessage, response.status));
  }

  const text = extractResponseText(payload);
  const json = parseJsonSafely<unknown>(text);
  if (!json) throw new Error("A IA não retornou JSON válido.");

  const parsed = aiDraftOutputSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(
      `A IA retornou campos fora do formato esperado: ${JSON.stringify(parsed.error.flatten())}`
    );
  }

  const slug = await ensureUniqueSlug(parsed.data.slug);

  return {
    topic,
    title: parsed.data.title.slice(0, 70),
    slug,
    excerpt: parsed.data.excerpt.slice(0, 280),
    bodyMarkdown: parsed.data.bodyMarkdown,
    tagSlugs: parsed.data.tagSlugs
  };
}

export async function generateBlogDraft(): Promise<BlogDraftResult> {
  const draft = await generateBlogDraftContent();

  const post = await createBlogPost({
    title: draft.title,
    slug: draft.slug,
    excerpt: draft.excerpt,
    bodyMarkdown: draft.bodyMarkdown,
    status: "DRAFT",
    source: "AI_GENERATED",
    tagSlugs: draft.tagSlugs
  });

  return { topic: draft.topic, postId: post.id, title: post.title, slug: post.slug };
}
