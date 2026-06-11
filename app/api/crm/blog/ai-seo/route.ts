import { fail, ok } from "@/lib/api/http";
import { generateBlogSeoAutofill } from "@/lib/ai/blog-seo";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { crmBlogSeoAutofillSchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  if (!process.env.OPENAI_API_KEY) {
    return fail(
      "OPENAI_API_KEY não está configurada. Adicione a chave nas variáveis de ambiente para usar SEO com IA.",
      503
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = crmBlogSeoAutofillSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Payload inválido para geração de SEO.", 422, parsed.error.flatten());
  }

  try {
    const seo = await generateBlogSeoAutofill(parsed.data);
    return ok({ seo });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha na geração de SEO com IA.";
    return fail(message, 500);
  }
}
