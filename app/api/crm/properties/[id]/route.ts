import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { createPropertyAuditLog, findCrmPropertyById, updateCrmProperty } from "@/lib/data/crm-properties";
import { crmUpdatePropertySchema } from "@/lib/validation/schemas";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const current = await findCrmPropertyById(id);

  if (!current) {
    return fail("Imóvel não encontrado.", 404);
  }

  const body = await request.json();
  const parsed = crmUpdatePropertySchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para atualização de imóvel.", 422, parsed.error.flatten());
  }

  const property = await updateCrmProperty(id, parsed.data);

  if (!property) {
    return fail("Imóvel não encontrado para atualização.", 404);
  }

  await createPropertyAuditLog({
    action: "PROPERTY_UPDATED",
    resourceId: property.id,
    actorId: session?.userId,
    payload: parsed.data
  });

  return ok({ property });
}
