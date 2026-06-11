import { z } from "zod";
import { parseJsonSafely } from "@/lib/api/http";

const OPENAI_MODEL =
  process.env.OPENAI_BLOG_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";

const seoOutputSchema = z.object({
  seoTitle: z.string().min(8).max(70),
  seoDescription: z.string().min(50).max(180),
  seoKeyword: z.string().min(3).max(80),
  suggestedSlug: z.string().min(3).max(80)
});

const seoOutputJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seoTitle: { type: "string" },
    seoDescription: { type: "string" },
    seoKeyword: { type: "string" },
    suggestedSlug: { type: "string" }
  },
  required: ["seoTitle", "seoDescription", "seoKeyword", "suggestedSlug"]
} as const;

export type BlogSeoAutofillInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  bodyMarkdown?: string;
  categoryLabel?: string | null;
  tagLabels?: string[];
};

export type BlogSeoAutofillResult = z.infer<typeof seoOutputSchema>;

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

function translateOpenAiError(message: string, status?: number): string {
  const lower = message.toLowerCase();
  if (lower.includes("does not exist") || lower.includes("invalid model")) {
    return `Modelo OpenAI inválido (${OPENAI_MODEL}). Ajuste OPENAI_BLOG_MODEL ou OPENAI_MODEL.`;
  }
  if (status === 401 || lower.includes("invalid api key") || lower.includes("incorrect api key")) {
    return "Chave OpenAI inválida. Verifique OPENAI_API_KEY.";
  }
  if (status === 429 || lower.includes("rate limit") || lower.includes("quota")) {
    return "OpenAI atingiu o limite de uso/quota. Tente novamente em instantes ou cheque o faturamento.";
  }
  return `OpenAI: ${message}`;
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

function buildPrompt(input: BlogSeoAutofillInput) {
  const excerpt = input.excerpt?.trim() || "Sem resumo informado.";
  const body = input.bodyMarkdown?.trim().slice(0, 9000) || "Sem conteúdo informado.";
  const tags = input.tagLabels?.filter(Boolean).join(", ") || "Sem tags.";
  const category = input.categoryLabel?.trim() || "Sem categoria.";

  return `Você é especialista em SEO local para o blog Pedro Soares Imóveis em Palmas TO.

Gere metadados claros, factuais e úteis para Google, Open Graph e leitores brasileiros.
Não prometa valorização, retorno financeiro ou dados que não estejam no conteúdo.

Dados do post:
- Título atual: ${input.title}
- Slug atual: ${input.slug || "não informado"}
- Categoria: ${category}
- Tags: ${tags}
- Resumo: ${excerpt}

Conteúdo markdown:
${body}

Retorne JSON estrito:
- seoTitle: até 70 caracteres, com intenção de busca e local quando fizer sentido.
- seoDescription: 120 a 180 caracteres, sem aspas, com benefício claro.
- seoKeyword: uma palavra-chave principal curta.
- suggestedSlug: kebab-case, só [a-z0-9-], até 80 caracteres.`;
}

export async function generateBlogSeoAutofill(
  input: BlogSeoAutofillInput
): Promise<BlogSeoAutofillResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

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
            "Você produz apenas JSON válido conforme o schema. Não inclua explicações fora do JSON."
        },
        { role: "user", content: buildPrompt(input) }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "blog_seo_autofill",
          schema: seoOutputJsonSchema,
          strict: true
        }
      },
      max_output_tokens: 700
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

  const parsed = seoOutputSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(
      `A IA retornou campos fora do formato esperado: ${JSON.stringify(parsed.error.flatten())}`
    );
  }

  return {
    seoTitle: parsed.data.seoTitle.slice(0, 70),
    seoDescription: parsed.data.seoDescription.slice(0, 180),
    seoKeyword: parsed.data.seoKeyword.slice(0, 80),
    suggestedSlug: slugify(parsed.data.suggestedSlug)
  };
}
