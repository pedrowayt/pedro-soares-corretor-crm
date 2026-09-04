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
import { ensureLandingPageTask, recordLandingPageEvent, resolveLandingPage } from "@/lib/data/marketing-landing-pages";

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
    unitId,
    unitLabel,
    leadPhone,
    leadName,
    leadEmail,
    messageTemplate,
    sourcePage,
    landingPageSlug,
    context
  } = parsed.data;

  const landingPage = await resolveLandingPage({ slug: landingPageSlug, publicPath: sourcePage });
  const whatsappLeadId = leadPhone ? `wa-${leadPhone.replace(/\D/g, "")}` : null;
  const existingWhatsappLead = whatsappLeadId
    ? await prisma.lead.findUnique({
        where: { id: whatsappLeadId },
        select: { landingPageId: true, sourcePage: true }
      })
    : null;

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
  const unit =
    development && unitId
      ? await prisma.developmentUnit.findFirst({
          where: {
            id: unitId,
            developmentId: development.id
          }
        })
      : null;

  const lead = leadPhone
    ? await prisma.lead.upsert({
        where: { id: whatsappLeadId! },
        update: {
          source: LeadSource.WHATSAPP,
          linkedPropertyId: property?.id,
          linkedDevelopmentId: development?.id,
          linkedDevelopmentUnitTypeId: unitType?.id,
          linkedDevelopmentUnitId: unit?.id,
          landingPageId: existingWhatsappLead?.landingPageId ?? landingPage?.id,
          sourcePage: existingWhatsappLead?.sourcePage ?? sourcePage,
          email: leadEmail || undefined,
          developmentLeadStatus:
            context === "schedule"
              ? DevelopmentLeadStatus.AGENDOU_APRESENTACAO
              : DevelopmentLeadStatus.EM_ATENDIMENTO
        },
        create: {
          id: whatsappLeadId!,
          name: leadName ?? "Lead WhatsApp",
          phone: leadPhone,
          email: leadEmail || undefined,
          source: LeadSource.WHATSAPP,
          intent: LeadIntent.COMPRAR,
          linkedPropertyId: property?.id,
          linkedDevelopmentId: development?.id,
          linkedDevelopmentUnitTypeId: unitType?.id,
          linkedDevelopmentUnitId: unit?.id,
          landingPageId: landingPage?.id,
          sourcePage: sourcePage || undefined,
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
        unitId: unit?.id,
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
          unitTypeName: unitType?.name ?? unitTypeName,
          unitId,
          unitLabel: unit?.label ?? unitLabel
        }
      }
    });

    if (landingPage) {
      await ensureLandingPageTask(lead.id, landingPage.name);
      await recordLandingPageEvent(landingPage.id, "WHATSAPP_CLICK", { context: context ?? "default" });
    }
  }

  return ok({
    tracked: true,
    leadId: lead?.id ?? null,
    propertyId: property?.id ?? null,
    developmentId: development?.id ?? null,
    unitTypeId: unitType?.id ?? null,
    unitId: unit?.id ?? null
  });
}
