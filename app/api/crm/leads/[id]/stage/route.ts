import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { getDefaultTaskByStage, isValidStageTransition } from "@/lib/crm/pipeline";
import { prisma } from "@/lib/prisma";
import { crmUpdateStageSchema } from "@/lib/validation/schemas";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmUpdateStageSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para atualização de etapa.", 422, parsed.error.flatten());
  }

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return fail("Lead não encontrado.", 404);

  const { toStage, reason } = parsed.data;

  if (!isValidStageTransition(lead.stage, toStage)) {
    return fail(`Transição inválida: ${lead.stage} -> ${toStage}.`, 409);
  }

  const updatedLead = await prisma.lead.update({
    where: { id },
    data: {
      stage: toStage,
      lastContactAt: new Date()
    }
  });

  await prisma.pipelineStageHistory.create({
    data: {
      leadId: id,
      fromStage: lead.stage,
      toStage,
      reason,
      changedById: session?.userId
    }
  });

  const defaultTask = getDefaultTaskByStage(toStage);

  if (defaultTask) {
    await prisma.task.create({
      data: {
        title: defaultTask.title,
        priority: defaultTask.priority,
        leadId: id,
        assignedToId: session?.userId,
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
  }

  return ok({ lead: updatedLead });
}
