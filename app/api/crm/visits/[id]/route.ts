import { InteractionChannel, InteractionType, VisitStatus } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { updateVisitSchema } from "@/lib/validation/schemas";

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

function formatVisitDate(date: Date) {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await readJsonPayload(request);
  if (!body) {
    return fail("JSON inválido para atualização de visita.", 400);
  }

  const parsed = updateVisitSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Payload inválido para atualização de visita.", 422, parsed.error.flatten());
  }

  const current = await prisma.visit.findUnique({
    where: { id },
    include: {
      lead: { select: { id: true, name: true } },
      property: { select: { id: true, title: true } }
    }
  });

  if (!current) return fail("Visita não encontrada.", 404);

  const scheduledAt = parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : undefined;
  const notes = "notes" in parsed.data ? optionalText(parsed.data.notes) : undefined;
  const nextStatus = parsed.data.status ?? (scheduledAt ? VisitStatus.REAGENDADA : undefined);
  const updateData: {
    status?: VisitStatus;
    scheduledAt?: Date;
    notes?: string | null;
    assignedToId?: string | null;
  } = {};

  if (nextStatus) updateData.status = nextStatus;
  if (scheduledAt) updateData.scheduledAt = scheduledAt;
  if ("notes" in parsed.data) updateData.notes = notes;
  if ("assignedToId" in parsed.data) updateData.assignedToId = parsed.data.assignedToId ?? null;

  const historyParts = [
    scheduledAt ? `Visita reagendada para ${formatVisitDate(scheduledAt)}.` : null,
    nextStatus ? `Status da visita alterado para ${nextStatus}.` : null,
    notes !== undefined ? `Observação: ${notes ?? "sem observação"}.` : null
  ].filter(Boolean);

  try {
    const visit = await prisma.$transaction(async (tx) => {
      const updatedVisit = await tx.visit.update({
        where: { id },
        data: updateData,
        include: {
          lead: { select: { id: true, name: true, phone: true } },
          property: { select: { id: true, title: true, city: true, district: true } },
          assignedTo: { select: { id: true, name: true } }
        }
      });

      await tx.leadInteraction.create({
        data: {
          leadId: current.leadId,
          propertyId: current.propertyId,
          type: InteractionType.NOTE,
          channel: InteractionChannel.CRM,
          message:
            historyParts.join(" ") ||
            `Visita do imóvel ${current.property.title} atualizada no CRM.`,
          metadata: {
            visitId: id,
            previousStatus: current.status,
            nextStatus: nextStatus ?? current.status,
            previousScheduledAt: current.scheduledAt.toISOString(),
            nextScheduledAt: (scheduledAt ?? current.scheduledAt).toISOString()
          },
          createdById: session?.userId
        }
      });

      if (nextStatus === VisitStatus.REALIZADA) {
        await tx.lead.update({
          where: { id: current.leadId },
          data: { lastContactAt: new Date() }
        });
      }

      await tx.auditLog.create({
        data: {
          action: "VISIT_UPDATED",
          resource: "Visit",
          resourceId: id,
          actorId: session?.userId,
          metadata: {
            leadId: current.leadId,
            propertyId: current.propertyId,
            status: nextStatus,
            scheduledAt: scheduledAt?.toISOString()
          }
        }
      });

      return updatedVisit;
    });

    return ok({ visit });
  } catch {
    return fail("Não foi possível atualizar a visita.", 500);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const current = await prisma.visit.findUnique({
    where: { id },
    include: {
      lead: { select: { id: true, name: true } },
      property: { select: { id: true, title: true } }
    }
  });

  if (!current) return fail("Visita não encontrada.", 404);

  try {
    await prisma.$transaction([
      prisma.visit.delete({ where: { id } }),
      prisma.leadInteraction.create({
        data: {
          leadId: current.leadId,
          propertyId: current.propertyId,
          type: InteractionType.NOTE,
          channel: InteractionChannel.CRM,
          message: `Visita excluída: ${current.property.title}, agendada para ${formatVisitDate(current.scheduledAt)}.`,
          metadata: {
            visitId: id,
            deletedStatus: current.status,
            scheduledAt: current.scheduledAt.toISOString()
          },
          createdById: session?.userId
        }
      }),
      prisma.auditLog.create({
        data: {
          action: "VISIT_DELETED",
          resource: "Visit",
          resourceId: id,
          actorId: session?.userId,
          metadata: {
            leadId: current.leadId,
            propertyId: current.propertyId,
            status: current.status,
            scheduledAt: current.scheduledAt.toISOString()
          }
        }
      })
    ]);

    return ok({ id });
  } catch {
    return fail("Não foi possível excluir a visita.", 500);
  }
}
