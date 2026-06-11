import { InteractionChannel, InteractionType, LeadStage } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { PIPELINE_ORDER } from "@/lib/crm/pipeline";
import { prisma } from "@/lib/prisma";
import { createVisitSchema } from "@/lib/validation/schemas";

async function readJsonPayload(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function optionalText(value?: string | null) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function shouldMoveToVisitStage(stage: LeadStage) {
  const currentIndex = PIPELINE_ORDER.indexOf(stage);
  const visitIndex = PIPELINE_ORDER.indexOf(LeadStage.VISITA_AGENDADA);
  return currentIndex >= 0 && currentIndex < visitIndex;
}

function formatVisitDate(date: Date) {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await readJsonPayload(request);
  if (!body) {
    return fail("JSON inválido para criação de visita.", 400);
  }

  const parsed = createVisitSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para criação de visita.", 422, parsed.error.flatten());
  }

  const [lead, property] = await Promise.all([
    prisma.lead.findUnique({
      where: { id: parsed.data.leadId },
      select: { id: true, name: true, stage: true, linkedPropertyId: true }
    }),
    prisma.property.findUnique({
      where: { id: parsed.data.propertyId },
      select: { id: true, title: true }
    })
  ]);

  if (!lead) return fail("Lead não encontrado para agendar visita.", 404);
  if (!property) return fail("Imóvel não encontrado para agendar visita.", 404);

  const scheduledAt = new Date(parsed.data.scheduledAt);
  const notes = optionalText(parsed.data.notes);
  const moveToVisitStage = shouldMoveToVisitStage(lead.stage);
  const assignedToId = parsed.data.assignedToId ?? session?.userId ?? undefined;

  try {
    const visit = await prisma.$transaction(async (tx) => {
      const createdVisit = await tx.visit.create({
        data: {
          leadId: lead.id,
          propertyId: property.id,
          scheduledAt,
          notes,
          assignedToId
        },
        include: {
          lead: { select: { id: true, name: true, phone: true } },
          property: { select: { id: true, title: true, city: true, district: true } },
          assignedTo: { select: { id: true, name: true } }
        }
      });

      await tx.lead.update({
        where: { id: lead.id },
        data: {
          linkedPropertyId: property.id,
          lastContactAt: new Date(),
          ...(moveToVisitStage ? { stage: LeadStage.VISITA_AGENDADA } : {})
        }
      });

      if (moveToVisitStage) {
        await tx.pipelineStageHistory.create({
          data: {
            leadId: lead.id,
            fromStage: lead.stage,
            toStage: LeadStage.VISITA_AGENDADA,
            reason: `Visita agendada para ${formatVisitDate(scheduledAt)} no imóvel ${property.title}.`,
            changedById: session?.userId
          }
        });
      }

      await tx.leadInteraction.create({
        data: {
          leadId: lead.id,
          propertyId: property.id,
          type: InteractionType.NOTE,
          channel: InteractionChannel.CRM,
          message: [
            `Visita agendada para ${formatVisitDate(scheduledAt)} no imóvel ${property.title}.`,
            notes ? `Observação: ${notes}` : null
          ]
            .filter(Boolean)
            .join(" "),
          metadata: {
            visitId: createdVisit.id,
            scheduledAt: scheduledAt.toISOString(),
            linkedPropertyChanged: lead.linkedPropertyId !== property.id
          },
          createdById: session?.userId
        }
      });

      await tx.auditLog.create({
        data: {
          action: "VISIT_CREATED",
          resource: "Visit",
          resourceId: createdVisit.id,
          actorId: session?.userId,
          metadata: {
            leadId: lead.id,
            propertyId: property.id,
            scheduledAt: scheduledAt.toISOString()
          }
        }
      });

      return createdVisit;
    });

    return ok({ visit }, { status: 201 });
  } catch {
    return fail("Não foi possível agendar a visita.", 500);
  }
}
