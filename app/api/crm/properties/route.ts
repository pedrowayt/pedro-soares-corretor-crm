import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { createCrmProperty, createPropertyAuditLog } from "@/lib/data/crm-properties";
import { crmCreatePropertySchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = crmCreatePropertySchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para criação de imóvel.", 422, parsed.error.flatten());
  }

  const property = await createCrmProperty(parsed.data);

  await createPropertyAuditLog({
    action: "PROPERTY_CREATED",
    resourceId: property.id,
    actorId: session?.userId,
    payload: parsed.data
  });

  return ok({ property }, { status: 201 });
}
