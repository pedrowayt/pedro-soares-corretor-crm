import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import {
  createPropertyAuditLog,
  deletePropertyMedia,
  findCrmPropertyById,
  makePropertyMediaPrimary,
  reorderPropertyMedia
} from "@/lib/data/crm-properties";
import { crmUpdatePropertyMediaSchema } from "@/lib/validation/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id, mediaId } = await params;
  const property = await findCrmPropertyById(id);
  if (!property) return fail("Imóvel não encontrado.", 404);

  const body = await request.json();
  const parsed = crmUpdatePropertyMediaSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Payload inválido para atualização de mídia.", 422, parsed.error.flatten());
  }

  let result;
  if (parsed.data.makePrimary) {
    result = await makePropertyMediaPrimary(id, mediaId);
  } else if (parsed.data.position !== undefined) {
    result = await reorderPropertyMedia(id, mediaId, parsed.data.position);
  } else {
    return fail("Nenhum campo para atualizar.", 422);
  }

  if (!result) return fail("Mídia não encontrada.", 404);

  await createPropertyAuditLog({
    action: "PROPERTY_MEDIA_UPDATED",
    resourceId: id,
    actorId: session?.userId,
    payload: { mediaId, ...parsed.data }
  });

  return ok({ media: result });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id, mediaId } = await params;
  const property = await findCrmPropertyById(id);
  if (!property) return fail("Imóvel não encontrado.", 404);

  const ok_ = await deletePropertyMedia(id, mediaId);
  if (!ok_) return fail("Mídia não encontrada.", 404);

  await createPropertyAuditLog({
    action: "PROPERTY_MEDIA_DELETED",
    resourceId: id,
    actorId: session?.userId,
    payload: { mediaId }
  });

  return ok({ ok: true });
}
