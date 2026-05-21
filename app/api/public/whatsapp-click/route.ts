import {
  DevelopmentLeadStatus,
  InteractionChannel,
  InteractionType,
  LeadIntent,
  LeadSource
} from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { publicWhatsappClickSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = publicWhatsappClickSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para tracking de clique WhatsApp.", 422, parsed.error.flatten());
  }

  const {
    propertyId,
    propertySlug,
    developmentId,
    developmentSlug,
    unitTypeId,
    unitTypeName,
    leadPhone,
    leadName,
    leadEmail,
    messageTemplate,
    context
  } = parsed.data;

  const property = propertyId
    ? await prisma.property.findUnique({ where: { id: propertyId } })
    : propertySlug
      ? await prisma.property.findUnique({ where: { slug: propertySlug } })
      : null;

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

  const lead = leadPhone
    ? await prisma.lead.upsert({
        where: { id: `wa-${leadPhone.replace(/\D/g, "")}` },
        update: {
          source: LeadSource.WHATSAPP,
          linkedPropertyId: property?.id,
          linkedDevelopmentId: development?.id,
          linkedDevelopmentUnitTypeId: unitType?.id,
          email: leadEmail || undefined,
          developmentLeadStatus:
            context === "schedule"
              ? DevelopmentLeadStatus.AGENDOU_APRESENTACAO
              : DevelopmentLeadStatus.EM_ATENDIMENTO
        },
        create: {
          id: `wa-${leadPhone.replace(/\D/g, "")}`,
          name: leadName ?? "Lead WhatsApp",
          phone: leadPhone,
          email: leadEmail || undefined,
          source: LeadSource.WHATSAPP,
          intent: LeadIntent.COMPRAR,
          linkedPropertyId: property?.id,
          linkedDevelopmentId: development?.id,
          linkedDevelopmentUnitTypeId: unitType?.id,
          developmentLeadStatus:
            context === "schedule"
              ? DevelopmentLeadStatus.AGENDOU_APRESENTACAO
              : DevelopmentLeadStatus.EM_ATENDIMENTO,
          notes: "Lead gerado por clique de WhatsApp"
        }
      })
    : null;

  if (lead) {
    await prisma.leadInteraction.create({
      data: {
        leadId: lead.id,
        propertyId: property?.id,
        developmentId: development?.id,
        unitTypeId: unitType?.id,
        type: InteractionType.WHATSAPP_CLICK,
        channel: InteractionChannel.WHATSAPP,
        message: "Clique em botão WhatsApp",
        metadata: {
          messageTemplate,
          context,
          propertySlug,
          propertyId,
          developmentSlug,
          developmentId,
          unitTypeId,
          unitTypeName: unitType?.name ?? unitTypeName
        }
      }
    });
  }

  return ok({
    tracked: true,
    leadId: lead?.id ?? null,
    propertyId: property?.id ?? null,
    developmentId: development?.id ?? null,
    unitTypeId: unitType?.id ?? null
  });
}
