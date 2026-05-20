import { InteractionChannel, InteractionType, LeadIntent, LeadSource, PropertyPurpose } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { publicDevelopmentInterestSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = publicDevelopmentInterestSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para interesse em empreendimento.", 422, parsed.error.flatten());
  }

  const { name, whatsapp, email, message, developmentSlug, developmentId, requestTable, lgpdConsent } = parsed.data;

  const development = developmentId
    ? await prisma.development.findUnique({ where: { id: developmentId } })
    : developmentSlug
      ? await prisma.development.findUnique({ where: { slug: developmentSlug } })
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
          lgpdConsentAt: lgpdConsent ? new Date() : undefined,
          notes: note || undefined
        }
      });

  await prisma.leadInteraction.create({
    data: {
      leadId: lead.id,
      developmentId: development?.id,
      type: InteractionType.FORM_SUBMISSION,
      channel: InteractionChannel.SITE,
      message: message || "Interesse via página de empreendimento",
      metadata: {
        developmentSlug,
        developmentId,
        requestTable
      }
    }
  });

  return ok({ leadId: lead.id, developmentId: development?.id ?? null }, { status: 201 });
}
