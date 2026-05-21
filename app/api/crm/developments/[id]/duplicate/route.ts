import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { slugify } from "@/lib/crm/slug";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

function suffixSlug(slug: string) {
  const stamp = Date.now().toString().slice(-6);
  return `${slugify(slug)}-copia-${stamp}`;
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;

  const source = await prisma.development.findUnique({
    where: { id },
    include: {
      unitTypes: true,
      media: true,
      milestones: true,
      faqs: true
    }
  });

  if (!source) {
    return fail("Empreendimento não encontrado para duplicação.", 404);
  }

  const duplicated = await prisma.development.create({
    data: {
      slug: suffixSlug(source.slug),
      title: `${source.title} (Cópia)`,
      tagline: source.tagline,
      summary: source.summary,
      description: source.description,
      district: source.district,
      city: source.city,
      neighborhood: source.neighborhood,
      address: source.address,
      postalCode: source.postalCode,
      latitude: source.latitude,
      longitude: source.longitude,
      propertyType: source.propertyType,
      developerName: source.developerName,
      builderName: source.builderName,
      builderId: source.builderId,
      stage: source.stage,
      deliveryDate: source.deliveryDate,
      constructionProgressPct: source.constructionProgressPct,
      appreciationPotential: source.appreciationPotential,
      buyerProfile: source.buyerProfile,
      opportunityText: source.opportunityText,
      showInvestmentPotentialBlock: source.showInvestmentPotentialBlock,
      startingPrice: source.startingPrice,
      priceMax: source.priceMax,
      areaFromM2: source.areaFromM2,
      areaToM2: source.areaToM2,
      landAreaM2: source.landAreaM2,
      bedroomsFrom: source.bedroomsFrom,
      bedroomsTo: source.bedroomsTo,
      suitesFrom: source.suitesFrom,
      suitesTo: source.suitesTo,
      bathroomsFrom: source.bathroomsFrom,
      bathroomsTo: source.bathroomsTo,
      parkingFrom: source.parkingFrom,
      parkingTo: source.parkingTo,
      towersCount: source.towersCount,
      floorsCount: source.floorsCount,
      elevatorsCount: source.elevatorsCount,
      totalUnits: source.totalUnits,
      availableUnits: source.availableUnits,
      incorporationRegistry: source.incorporationRegistry,
      hasPatrimonyOfAffectation: source.hasPatrimonyOfAffectation,
      amenities: source.amenities,
      differentials: source.differentials,
      projectText: source.projectText,
      apartmentsText: source.apartmentsText,
      locationText: source.locationText,
      locationHighlights: source.locationHighlights,
      referencePoints: source.referencePoints ?? Prisma.JsonNull,
      regionLiquidityNotes: source.regionLiquidityNotes,
      mapEmbedUrl: source.mapEmbedUrl,
      tablePdfUrl: source.tablePdfUrl,
      whatsappMessageTemplate: source.whatsappMessageTemplate,
      ctaPrimaryLabel: source.ctaPrimaryLabel,
      ctaPrimaryUrl: source.ctaPrimaryUrl,
      ctaSecondaryLabel: source.ctaSecondaryLabel,
      ctaSecondaryUrl: source.ctaSecondaryUrl,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      seoOgImageUrl: source.seoOgImageUrl,
      seoKeyword: source.seoKeyword,
      seoNoIndex: source.seoNoIndex,
      isFeatured: false,
      displayOrder: source.displayOrder,
      showPrice: source.showPrice,
      showMap: source.showMap,
      showBuilder: source.showBuilder,
      showFloorplanTable: source.showFloorplanTable,
      showWhatsappButton: source.showWhatsappButton,
      isPublished: false,
      status: "DRAFT",
      publishedAt: null,
      archivedAt: null,
      unitTypes: {
        create: source.unitTypes.map((item) => ({
          name: item.name,
          unitCategory: item.unitCategory,
          bedrooms: item.bedrooms,
          suites: item.suites,
          bathrooms: item.bathrooms,
          parkingSpaces: item.parkingSpaces,
          areaFromM2: item.areaFromM2,
          areaToM2: item.areaToM2,
          areaPrivateM2: item.areaPrivateM2,
          areaTotalM2: item.areaTotalM2,
          priceFrom: item.priceFrom,
          priceTo: item.priceTo,
          initialPrice: item.initialPrice,
          imageUrl: item.imageUrl,
          isAvailable: item.isAvailable,
          availableUnits: item.availableUnits,
          totalUnits: item.totalUnits,
          description: item.description,
          position: item.position
        }))
      },
      media: {
        create: source.media.map((item) => ({
          kind: item.kind,
          category: item.category,
          status: item.status,
          cloudflareMediaId: item.cloudflareMediaId,
          url: item.url,
          title: item.title,
          caption: item.caption,
          isPrimary: item.isPrimary,
          position: item.position,
          metadata: item.metadata ?? Prisma.JsonNull
        }))
      },
      milestones: {
        create: source.milestones.map((item) => ({
          title: item.title,
          description: item.description,
          status: item.status,
          targetDate: item.targetDate,
          actualDate: item.actualDate,
          progressPct: item.progressPct,
          position: item.position
        }))
      },
      faqs: {
        create: source.faqs.map((item) => ({
          question: item.question,
          answer: item.answer,
          position: item.position
        }))
      }
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "DEVELOPMENT_DUPLICATED",
      resource: "Development",
      resourceId: duplicated.id,
      actorId: session?.userId,
      metadata: {
        sourceDevelopmentId: source.id
      }
    }
  });

  return ok({ development: duplicated }, { status: 201 });
}
