import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { createStreamDirectUpload } from "@/lib/cloudflare/client";
import { cloudflareStreamDirectUploadSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = cloudflareStreamDirectUploadSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para upload de vídeo.", 422, parsed.error.flatten());
  }

  try {
    const result = await createStreamDirectUpload({
      maxDurationSeconds: parsed.data.maxDurationSeconds,
      requireSignedURLs: parsed.data.requireSignedURLs,
      allowedOrigins: parsed.data.allowedOrigins,
      creator: parsed.data.creator,
      meta: parsed.data.metadata
    });

    return ok({ directUpload: result }, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao gerar upload de vídeo.", 500);
  }
}
