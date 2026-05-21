import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmUpdateDevelopmentLeadStatusSchema } from "@/lib/validation/schemas";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmUpdateDevelopmentLeadStatusSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para status de lead de lançamento.", 422, parsed.error.flatten());
  }

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    return fail("Lead não encontrado.", 404);
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: {
      developmentLeadStatus: parsed.data.developmentLeadStatus,
      lastContactAt: new Date()
    }
  });

  return ok({ lead: updated });
}
