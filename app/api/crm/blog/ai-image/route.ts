import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { generateBlogImage } from "@/lib/ai/blog-image";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const input = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const sourceText = typeof input.sourceText === "string" ? input.sourceText : undefined;
  const title = typeof input.title === "string" ? input.title : undefined;
  const excerpt = typeof input.excerpt === "string" ? input.excerpt : undefined;
  const tagLabels = Array.isArray(input.tagLabels)
    ? (input.tagLabels.filter((value) => typeof value === "string") as string[])
    : undefined;

  if (!sourceText && !title && !excerpt) {
    return fail(
      "Para gerar uma imagem, preencha o título ou cole o texto da notícia.",
      400
    );
  }

  try {
    const result = await generateBlogImage({ sourceText, title, excerpt, tagLabels });
    return ok({ image: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao gerar imagem.";
    return fail(message, 500);
  }
}
