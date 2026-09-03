import { LeadIntent, LeadSource, PropertyPurpose, PropertyStatus } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { slugify } from "@/lib/crm/slug";
import { prisma } from "@/lib/prisma";
import { publicSellerCaptureSchema } from "@/lib/validation/schemas";
import { ensureLandingPageTask, recordLandingPageEvent, resolveLandingPage } from "@/lib/data/marketing-landing-pages";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = publicSellerCaptureSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para captação de proprietário.", 422, parsed.error.flatten());
  }

  const { name, whatsapp, propertyType, district, city, askingPrice, statusDescription, photos, sourcePage, landingPageSlug, lgpdConsent } = parsed.data;

  const landingPage = await resolveLandingPage({ slug: landingPageSlug, publicPath: sourcePage });

  const owner = await prisma.owner.create({
    data: {
      name,
      phone: whatsapp,
      city,
      district,
      notes: statusDescription
    }
  });

  const property = await prisma.property.create({
    data: {
      slug: `${slugify(`captacao-${name}-${district}`)}-${Date.now().toString().slice(-5)}`,
      title: `Captação ${propertyType} em ${district}`,
      type: propertyType,
      purpose: PropertyPurpose.VENDA,
      status: PropertyStatus.EM_ANALISE,
      price: askingPrice,
      city,
      district,
      description: statusDescription || "Imóvel recebido via formulário de captação.",
      features: [],
      ownerId: owner.id,
      internalNotes: "Criado automaticamente pela captação pública."
    }
  });

  if (photos?.length) {
    await prisma.propertyMedia.createMany({
      data: photos.map((url, index) => ({
        propertyId: property.id,
        kind: "IMAGE",
        status: "PENDENTE",
        url,
        position: index + 1,
        variant: "capture"
      }))
    });
  }

  const lead = await prisma.lead.create({
    data: {
      name,
      phone: whatsapp,
      source: LeadSource.SITE,
      intent: LeadIntent.VENDER,
      landingPageId: landingPage?.id ?? undefined,
      linkedOwnerId: owner.id,
      linkedPropertyId: property.id,
      sourcePage: sourcePage || undefined,
      desiredCity: city,
      desiredDistrict: district,
      notes: statusDescription,
      lgpdConsentAt: lgpdConsent ? new Date() : undefined
    }
  });

  if (landingPage) {
    await ensureLandingPageTask(lead.id, landingPage.name);
    await recordLandingPageEvent(landingPage.id, "FORM_SUBMISSION");
  }

  return ok({ leadId: lead.id, propertyId: property.id, ownerId: owner.id }, { status: 201 });
}
