import { fail, ok } from "@/lib/api/http";
import { requireCrmAdminAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmUpdateWhatsappTemplateSchema } from "@/lib/validation/schemas";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmAdminAccess();
  if (denied) return denied;
  const parsed = crmUpdateWhatsappTemplateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Não foi possível atualizar o template.", 422, parsed.error.flatten());
  const { id } = await params;
  const template = await prisma.whatsappTemplate.update({ where: { id }, data: parsed.data });
  return ok({ template });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmAdminAccess();
  if (denied) return denied;
  const { id } = await params;
  await prisma.whatsappTemplate.delete({ where: { id } });
  return ok({ id });
}
