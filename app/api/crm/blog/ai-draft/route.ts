import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { generateBlogDraftContent } from "@/lib/ai/blog-draft";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST() {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  try {
    const draft = await generateBlogDraftContent();
    return ok({ draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha na geração com IA.";
    return fail(message, 500);
  }
}
