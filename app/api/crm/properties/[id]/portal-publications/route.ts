import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { createPropertyAuditLog, findCrmPropertyById } from "@/lib/data/crm-properties";
import {
  getPropertyPortalPublicationState,
  updatePropertyPortalPublications
} from "@/lib/data/portal-publications";
import { crmUpdatePortalPublicationsSchema } from "@/lib/validation/schemas";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const property = await findCrmPropertyById(id);
  if (!property) {
    return fail("Imóvel não encontrado.", 404);
  }

  const publications = await getPropertyPortalPublicationState(id);
  return ok({ publications, userId: session?.userId ?? null });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const property = await findCrmPropertyById(id);
  if (!property) {
    return fail("Imóvel não encontrado.", 404);
  }

  const body = await request.json();
  const parsed = crmUpdatePortalPublicationsSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Payload inválido para publicação em portais.", 422, parsed.error.flatten());
  }

  const publications = await updatePropertyPortalPublications(id, parsed.data.publications);
  if (!publications) {
    return fail("Não foi possível atualizar os portais do imóvel.", 500);
  }

  await createPropertyAuditLog({
    action: "PROPERTY_PORTAL_PUBLICATIONS_UPDATED",
    resourceId: id,
    actorId: session?.userId,
    payload: parsed.data
  });

  return ok({ publications });
}
