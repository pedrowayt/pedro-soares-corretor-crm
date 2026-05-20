import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { createImageDirectUpload } from "@/lib/cloudflare/client";
import { cloudflareImageDirectUploadSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = cloudflareImageDirectUploadSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para upload de imagem.", 422, parsed.error.flatten());
  }

  try {
    const result = await createImageDirectUpload(parsed.data);
    return ok({ directUpload: result }, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao gerar upload de imagem.", 500);
  }
}
