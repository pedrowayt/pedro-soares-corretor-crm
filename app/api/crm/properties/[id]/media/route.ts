import type { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { addPropertyMedia, createPropertyAuditLog, findCrmPropertyById } from "@/lib/data/crm-properties";
import { crmCreatePropertyMediaSchema } from "@/lib/validation/schemas";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const current = await findCrmPropertyById(id);
  if (!current) {
    return fail("Imóvel não encontrado.", 404);
  }

  const body = await request.json();
  const parsed = crmCreatePropertyMediaSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Payload inválido para mídia.", 422, parsed.error.flatten());
  }

  const media = await addPropertyMedia(id, {
    kind: parsed.data.kind,
    url: parsed.data.url,
    cloudflareMediaId: parsed.data.cloudflareMediaId,
    position: parsed.data.position,
    metadata: (parsed.data.metadata ?? null) as Prisma.JsonValue | null
  });

  if (!media) {
    return fail("Não foi possível registrar a mídia.", 500);
  }

  await createPropertyAuditLog({
    action: "PROPERTY_MEDIA_ADDED",
    resourceId: id,
    actorId: session?.userId,
    payload: { mediaId: media.id, url: parsed.data.url }
  });

  return ok({ media }, { status: 201 });
}
