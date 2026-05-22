import {
  DevelopmentLeadStatus,
  InteractionChannel,
  InteractionType,
  LeadIntent,
  LeadSource,
  PropertyPurpose
} from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { publicDevelopmentInterestSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = publicDevelopmentInterestSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para interesse em empreendimento.", 422, parsed.error.flatten());
  }

  const {
    name,
    whatsapp,
    email,
    message,
    developmentSlug,
    developmentId,
    unitTypeId,
    unitId,
    requestTable,
    lgpdConsent
  } = parsed.data;

  const development = developmentId
    ? await prisma.development.findUnique({ where: { id: developmentId } })
    : developmentSlug
      ? await prisma.development.findUnique({ where: { slug: developmentSlug } })
      : null;

  const unitType =
    development && unitTypeId
      ? await prisma.developmentUnitType.findFirst({
          where: {
            id: unitTypeId,
            developmentId: development.id
          }
      })
      : null;
  const unit =
    development && unitId
      ? await prisma.developmentUnit.findFirst({
          where: {
            id: unitId,
            developmentId: development.id
          }
        })
      : null;

  const existingLead = await prisma.lead.findFirst({
    where: { phone: whatsapp },
    orderBy: { createdAt: "desc" }
  });

  const note = [
    existingLead?.notes,
    message,
    requestTable ? "Solicitou tabela do empreendimento." : undefined
  ]
    .filter(Boolean)
    .join("\n");

  const lead = existingLead
    ? await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          name,
          email: email || existingLead.email,
          source: LeadSource.SITE,
          intent: LeadIntent.COMPRAR,
          desiredPurpose: PropertyPurpose.LANCAMENTO,
          linkedDevelopmentId: development?.id ?? existingLead.linkedDevelopmentId,
          linkedDevelopmentUnitTypeId: unitType?.id ?? existingLead.linkedDevelopmentUnitTypeId,
          linkedDevelopmentUnitId: unit?.id ?? existingLead.linkedDevelopmentUnitId,
          developmentLeadStatus: requestTable
            ? DevelopmentLeadStatus.RECEBEU_TABELA
            : existingLead.developmentLeadStatus,
          lgpdConsentAt: lgpdConsent ? new Date() : existingLead.lgpdConsentAt,
          notes: note || existingLead.notes
        }
      })
    : await prisma.lead.create({
        data: {
          name,
          phone: whatsapp,
          email: email || undefined,
          source: LeadSource.SITE,
          intent: LeadIntent.COMPRAR,
          desiredPurpose: PropertyPurpose.LANCAMENTO,
          linkedDevelopmentId: development?.id,
          linkedDevelopmentUnitTypeId: unitType?.id ?? undefined,
          linkedDevelopmentUnitId: unit?.id ?? undefined,
          developmentLeadStatus: requestTable
            ? DevelopmentLeadStatus.RECEBEU_TABELA
            : DevelopmentLeadStatus.NOVO,
          lgpdConsentAt: lgpdConsent ? new Date() : undefined,
          notes: note || undefined
        }
      });

  await prisma.leadInteraction.create({
    data: {
      leadId: lead.id,
      developmentId: development?.id,
      unitTypeId: unitType?.id,
      unitId: unit?.id,
      type: InteractionType.FORM_SUBMISSION,
      channel: InteractionChannel.SITE,
      message: message || "Interesse via página de empreendimento",
      metadata: {
        developmentSlug,
        developmentId,
        unitTypeId,
        unitTypeName: unitType?.name,
        unitId,
        unitLabel: unit?.label,
        requestTable
      }
    }
  });

  return ok({ leadId: lead.id, developmentId: development?.id ?? null, unitId: unit?.id ?? null }, { status: 201 });
}
