import { LeadStage } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { createVisitSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = createVisitSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para criação de visita.", 422, parsed.error.flatten());
  }

  const visit = await prisma.visit.create({
    data: {
      ...parsed.data,
      scheduledAt: new Date(parsed.data.scheduledAt),
      assignedToId: parsed.data.assignedToId ?? session?.userId ?? undefined
    }
  });

  await prisma.lead.update({
    where: { id: parsed.data.leadId },
    data: {
      stage: LeadStage.VISITA_AGENDADA
    }
  });

  return ok({ visit }, { status: 201 });
}
