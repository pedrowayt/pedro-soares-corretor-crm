import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmUpdateFlowUpSchema } from "@/lib/validation/schemas";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const parsed = crmUpdateFlowUpSchema.safeParse(await request.json());
  if (!parsed.success) return fail("Informe uma ação válida para o Flow-UP.", 422, parsed.error.flatten());

  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!lead) return fail("Lead não encontrado.", 404);

  const isRemoving = parsed.data.action === "REMOVE";
  await prisma.$transaction([
    prisma.lead.update({
      where: { id },
      data: {
        flowUpRemovedAt: isRemoving ? new Date() : null,
        flowUpRemovedReason: isRemoving ? parsed.data.reason : null
      }
    }),
    prisma.leadInteraction.create({
      data: {
        leadId: id,
        type: "NOTE",
        channel: "CRM",
        message: isRemoving
          ? `Lead retirado do Flow-UP. Motivo: ${parsed.data.reason}`
          : "Lead voltou a ser acompanhado pelo Flow-UP.",
        createdById: session?.userId
      }
    })
  ]);

  return ok({ id, action: parsed.data.action, name: lead.name });
}
