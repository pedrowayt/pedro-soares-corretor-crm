import { InteractionChannel, InteractionType, LeadStage } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { PIPELINE_ORDER } from "@/lib/crm/pipeline";
import { prisma } from "@/lib/prisma";
import { createProposalSchema } from "@/lib/validation/schemas";
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

function shouldMoveToProposalStage(stage: LeadStage) {
  const currentIndex = PIPELINE_ORDER.indexOf(stage);
  const proposalIndex = PIPELINE_ORDER.indexOf(LeadStage.PROPOSTA_ENVIADA);
  return currentIndex >= 0 && currentIndex < proposalIndex;
}

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await readJsonPayload(request);
  if (!body) {
    return fail("JSON inválido para criação de proposta.", 400);
  }

  const parsed = createProposalSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para criação de proposta.", 422, parsed.error.flatten());
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

  if (!lead) return fail("Lead não encontrado para registrar proposta.", 404);
  if (!property) return fail("Imóvel não encontrado para registrar proposta.", 404);

  const notes = optionalText(parsed.data.notes);
  const moveToProposalStage = shouldMoveToProposalStage(lead.stage);

  try {
    const proposal = await prisma.$transaction(async (tx) => {
      const createdProposal = await tx.proposal.create({
        data: {
          leadId: lead.id,
          propertyId: property.id,
          offeredValue: parsed.data.offeredValue,
          commissionPct: parsed.data.commissionPct,
          notes,
          createdById: session?.userId ?? undefined
        },
        include: {
          lead: { select: { id: true, name: true, phone: true } },
          property: { select: { id: true, title: true, city: true, district: true, price: true } },
          createdBy: { select: { id: true, name: true } }
        }
      });

      await tx.lead.update({
        where: { id: lead.id },
        data: {
          linkedPropertyId: property.id,
          lastContactAt: new Date(),
          ...(moveToProposalStage ? { stage: LeadStage.PROPOSTA_ENVIADA } : {})
        }
      });

      if (moveToProposalStage) {
        await tx.pipelineStageHistory.create({
          data: {
            leadId: lead.id,
            fromStage: lead.stage,
            toStage: LeadStage.PROPOSTA_ENVIADA,
            reason: `Proposta enviada para ${property.title}: ${formatCurrencyBRL(parsed.data.offeredValue)}.`,
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
            `Proposta registrada para ${property.title}: ${formatCurrencyBRL(parsed.data.offeredValue)}.`,
            notes ? `Observação: ${notes}` : null
          ]
            .filter(Boolean)
            .join(" "),
          metadata: {
            proposalId: createdProposal.id,
            offeredValue: parsed.data.offeredValue,
            commissionPct: parsed.data.commissionPct ?? null,
            linkedPropertyChanged: lead.linkedPropertyId !== property.id
          },
          createdById: session?.userId
        }
      });

      await tx.auditLog.create({
        data: {
          action: "PROPOSAL_CREATED",
          resource: "Proposal",
          resourceId: createdProposal.id,
          actorId: session?.userId,
          metadata: {
            leadId: lead.id,
            propertyId: property.id,
            offeredValue: parsed.data.offeredValue
          }
        }
      });

      return createdProposal;
    });

    return ok({ proposal }, { status: 201 });
  } catch {
    return fail("Não foi possível registrar a proposta.", 500);
  }
}
