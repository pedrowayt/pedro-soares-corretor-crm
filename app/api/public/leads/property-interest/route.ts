import { InteractionChannel, InteractionType, LeadIntent, LeadSource } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { publicPropertyInterestSchema } from "@/lib/validation/schemas";
import { ensureLandingPageTask, recordLandingPageEvent, resolveLandingPage } from "@/lib/data/marketing-landing-pages";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = publicPropertyInterestSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para interesse no imóvel.", 422, parsed.error.flatten());
  }

  const { name, whatsapp, email, message, propertySlug, sourcePage, landingPageSlug, lgpdConsent } = parsed.data;

  const landingPage = await resolveLandingPage({ slug: landingPageSlug, publicPath: sourcePage });

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
          landingPageId: landingPage?.id ?? existingLead.landingPageId,
          sourcePage: sourcePage || existingLead.sourcePage,
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
          landingPageId: landingPage?.id ?? undefined,
          sourcePage: sourcePage || undefined,
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

  if (landingPage) {
    await ensureLandingPageTask(lead.id, landingPage.name);
    await recordLandingPageEvent(landingPage.id, "FORM_SUBMISSION");
  }

  return ok({ leadId: lead.id, propertyId: property?.id ?? null }, { status: 201 });
}
