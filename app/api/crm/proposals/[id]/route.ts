import { InteractionChannel, InteractionType, LeadStage, ProposalStatus } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { PIPELINE_ORDER } from "@/lib/crm/pipeline";
import { prisma } from "@/lib/prisma";
import { updateProposalSchema } from "@/lib/validation/schemas";
import { formatCurrencyBRL } from "@/lib/utils";

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

function targetStageForStatus(status?: ProposalStatus) {
  if (status === ProposalStatus.ACEITA) return LeadStage.FECHADO;
  if (status === ProposalStatus.CONTRA_PROPOSTA) return LeadStage.NEGOCIACAO;
  if (status === ProposalStatus.ENVIADA) return LeadStage.PROPOSTA_ENVIADA;
  return null;
}

function shouldMoveLeadStage(currentStage: LeadStage, targetStage: LeadStage | null) {
  if (!targetStage || currentStage === targetStage) return false;
  if (targetStage === LeadStage.FECHADO) return currentStage !== LeadStage.PERDIDO;
  const currentIndex = PIPELINE_ORDER.indexOf(currentStage);
  const targetIndex = PIPELINE_ORDER.indexOf(targetStage);
  return currentIndex >= 0 && targetIndex >= 0 && currentIndex < targetIndex;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await readJsonPayload(request);
  if (!body) return fail("JSON inválido para atualização de proposta.", 400);

  const parsed = updateProposalSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Payload inválido para atualização de proposta.", 422, parsed.error.flatten());
  }

  const current = await prisma.proposal.findUnique({
    where: { id },
    include: {
      lead: { select: { id: true, name: true, stage: true } },
      property: { select: { id: true, title: true } }
    }
  });

  if (!current) return fail("Proposta não encontrada.", 404);

  const notes = "notes" in parsed.data ? optionalText(parsed.data.notes) : undefined;
  const updateData: {
    status?: ProposalStatus;
    offeredValue?: number;
    commissionPct?: number | null;
    notes?: string | null;
  } = {};

  if (parsed.data.status) updateData.status = parsed.data.status;
  if (parsed.data.offeredValue !== undefined) updateData.offeredValue = parsed.data.offeredValue;
  if ("commissionPct" in parsed.data) updateData.commissionPct = parsed.data.commissionPct ?? null;
  if ("notes" in parsed.data) updateData.notes = notes;

  const targetStage = targetStageForStatus(parsed.data.status);
  const moveLeadStage = shouldMoveLeadStage(current.lead.stage, targetStage);
  const valueForHistory = parsed.data.offeredValue ?? Number(current.offeredValue);
  const historyParts = [
    parsed.data.status ? `Status da proposta alterado para ${parsed.data.status}.` : null,
    parsed.data.offeredValue !== undefined ? `Valor atualizado para ${formatCurrencyBRL(parsed.data.offeredValue)}.` : null,
    "commissionPct" in parsed.data
      ? `Comissão atualizada para ${parsed.data.commissionPct ?? 0}%.`
      : null,
    notes !== undefined ? `Observação: ${notes ?? "sem observação"}.` : null
  ].filter(Boolean);

  try {
    const proposal = await prisma.$transaction(async (tx) => {
      const updatedProposal = await tx.proposal.update({
        where: { id },
        data: updateData,
        include: {
          lead: { select: { id: true, name: true, phone: true } },
          property: { select: { id: true, title: true, city: true, district: true, price: true } },
          createdBy: { select: { id: true, name: true } }
        }
      });

      if (moveLeadStage && targetStage) {
        await tx.lead.update({
          where: { id: current.leadId },
          data: {
            stage: targetStage,
            lastContactAt: new Date()
          }
        });

        await tx.pipelineStageHistory.create({
          data: {
            leadId: current.leadId,
            fromStage: current.lead.stage,
            toStage: targetStage,
            reason: `Proposta ${parsed.data.status} para ${current.property.title}.`,
            changedById: session?.userId
          }
        });
      } else {
        await tx.lead.update({
          where: { id: current.leadId },
          data: { lastContactAt: new Date() }
        });
      }

      await tx.leadInteraction.create({
        data: {
          leadId: current.leadId,
          propertyId: current.propertyId,
          type: InteractionType.NOTE,
          channel: InteractionChannel.CRM,
          message:
            historyParts.join(" ") ||
            `Proposta de ${formatCurrencyBRL(valueForHistory)} atualizada no imóvel ${current.property.title}.`,
          metadata: {
            proposalId: id,
            previousStatus: current.status,
            nextStatus: parsed.data.status ?? current.status,
            previousValue: Number(current.offeredValue),
            nextValue: valueForHistory
          },
          createdById: session?.userId
        }
      });

      await tx.auditLog.create({
        data: {
          action: "PROPOSAL_UPDATED",
          resource: "Proposal",
          resourceId: id,
          actorId: session?.userId,
          metadata: {
            leadId: current.leadId,
            propertyId: current.propertyId,
            status: parsed.data.status ?? null,
            offeredValue: parsed.data.offeredValue ?? null
          }
        }
      });

      return updatedProposal;
    });

    return ok({ proposal });
  } catch {
    return fail("Não foi possível atualizar a proposta.", 500);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const current = await prisma.proposal.findUnique({
    where: { id },
    include: {
      lead: { select: { id: true, name: true } },
      property: { select: { id: true, title: true } }
    }
  });

  if (!current) return fail("Proposta não encontrada.", 404);

  try {
    await prisma.$transaction([
      prisma.proposal.delete({ where: { id } }),
      prisma.leadInteraction.create({
        data: {
          leadId: current.leadId,
          propertyId: current.propertyId,
          type: InteractionType.NOTE,
          channel: InteractionChannel.CRM,
          message: `Proposta excluída: ${current.property.title}, ${formatCurrencyBRL(Number(current.offeredValue))}.`,
          metadata: {
            proposalId: id,
            deletedStatus: current.status,
            offeredValue: Number(current.offeredValue)
          },
          createdById: session?.userId
        }
      }),
      prisma.auditLog.create({
        data: {
          action: "PROPOSAL_DELETED",
          resource: "Proposal",
          resourceId: id,
          actorId: session?.userId,
          metadata: {
            leadId: current.leadId,
            propertyId: current.propertyId,
            status: current.status,
            offeredValue: Number(current.offeredValue)
          }
        }
      })
    ]);

    return ok({ id });
  } catch {
    return fail("Não foi possível excluir a proposta.", 500);
  }
}
