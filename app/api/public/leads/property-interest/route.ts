import { InteractionChannel, InteractionType, LeadIntent, LeadSource } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { publicPropertyInterestSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = publicPropertyInterestSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para interesse no imóvel.", 422, parsed.error.flatten());
  }

  const { name, whatsapp, email, message, propertySlug, lgpdConsent } = parsed.data;

  const property = propertySlug
    ? await prisma.property.findUnique({
        where: {
          slug: propertySlug
        }
      })
    : null;

  const existingLead = await prisma.lead.findFirst({
    where: { phone: whatsapp },
    orderBy: { createdAt: "desc" }
  });

  const lead = existingLead
    ? await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          name,
          email: email || existingLead.email,
          source: LeadSource.SITE,
          intent: LeadIntent.COMPRAR,
          linkedPropertyId: property?.id ?? existingLead.linkedPropertyId,
          lgpdConsentAt: lgpdConsent ? new Date() : existingLead.lgpdConsentAt,
          notes: message ? `${existingLead.notes ?? ""}\n${message}`.trim() : existingLead.notes
        }
      })
    : await prisma.lead.create({
        data: {
          name,
          phone: whatsapp,
          email: email || undefined,
          source: LeadSource.SITE,
          intent: LeadIntent.COMPRAR,
          linkedPropertyId: property?.id,
          lgpdConsentAt: lgpdConsent ? new Date() : undefined,
          notes: message || undefined
        }
      });

  await prisma.leadInteraction.create({
    data: {
      leadId: lead.id,
      propertyId: property?.id,
      type: InteractionType.FORM_SUBMISSION,
      channel: InteractionChannel.SITE,
      message: message || "Interesse via página do imóvel",
      metadata: {
        propertySlug
      }
    }
  });

  return ok({ leadId: lead.id, propertyId: property?.id ?? null }, { status: 201 });
}
