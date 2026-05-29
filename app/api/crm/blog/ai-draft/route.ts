import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { generateBlogDraftContent } from "@/lib/ai/blog-draft";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  if (!process.env.OPENAI_API_KEY) {
    return fail(
      "OPENAI_API_KEY não está configurada. Adicione a chave nas variáveis de ambiente para usar a geração com IA.",
      503
    );
  }

  let sourceText: string | undefined;
  try {
    const body = await request.json().catch(() => null);
    if (body && typeof body === "object" && typeof (body as Record<string, unknown>).sourceText === "string") {
      sourceText = ((body as Record<string, unknown>).sourceText as string).trim();
      if (sourceText.length > 0 && sourceText.length < 30) {
        return fail("Cole pelo menos 30 caracteres para a IA trabalhar em cima.", 400);
      }
      if (sourceText.length > 12000) {
        sourceText = sourceText.slice(0, 12000);
      }
    }
  } catch {
    sourceText = undefined;
  }

  try {
    const draft = await generateBlogDraftContent(sourceText ? { sourceText } : {});
    return ok({ draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha na geração com IA.";
    return fail(message, 500);
  }
}
