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
      towers: {
        orderBy: { position: "asc" }
      },
      unitTypes: {
        orderBy: [{ isAvailable: "desc" }, { position: "asc" }]
      },
      units: {
        orderBy: [{ position: "asc" }, { floor: "asc" }, { unitNumber: "asc" }]
      },
      media: {
        orderBy: [{ isPrimary: "desc" }, { position: "asc" }]
      },
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
      towers: {
        create: source.towers.map((item) => ({
          name: item.name,
          slug: item.slug,
          propertyType: item.propertyType,
          description: item.description,
          floorsCount: item.floorsCount,
          elevatorsCount: item.elevatorsCount,
          totalUnits: item.totalUnits,
          availableUnits: item.availableUnits,
          deliveryDate: item.deliveryDate,
          incorporationRegistry: item.incorporationRegistry,
          position: item.position
        }))
      },
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

  const [duplicatedTowers, duplicatedUnitTypes, duplicatedMedia] = await Promise.all([
    prisma.developmentTower.findMany({
      where: { developmentId: duplicated.id },
      orderBy: { position: "asc" }
    }),
    prisma.developmentUnitType.findMany({
      where: { developmentId: duplicated.id },
      orderBy: [{ isAvailable: "desc" }, { position: "asc" }]
    }),
    prisma.developmentMedia.findMany({
      where: { developmentId: duplicated.id },
      orderBy: [{ isPrimary: "desc" }, { position: "asc" }]
    })
  ]);

  const towerIdMap = new Map(
    source.towers
      .map((tower, index) => [tower.id, duplicatedTowers[index]?.id] as const)
      .filter((entry): entry is readonly [string, string] => Boolean(entry[1]))
  );
  const unitTypeIdMap = new Map(
    source.unitTypes
      .map((unitType, index) => [unitType.id, duplicatedUnitTypes[index]?.id] as const)
      .filter((entry): entry is readonly [string, string] => Boolean(entry[1]))
  );

  await Promise.all(
    source.unitTypes.map((unitType) => {
      const duplicatedUnitTypeId = unitTypeIdMap.get(unitType.id);
      const duplicatedTowerId = unitType.towerId ? towerIdMap.get(unitType.towerId) : null;

      if (!duplicatedUnitTypeId || !duplicatedTowerId) return Promise.resolve(null);

      return prisma.developmentUnitType.update({
        where: { id: duplicatedUnitTypeId },
        data: { towerId: duplicatedTowerId }
      });
    })
  );

  await Promise.all(
    source.media.map((media, index) => {
      const duplicatedMediaId = duplicatedMedia[index]?.id;
      if (!duplicatedMediaId) return Promise.resolve(null);

      return prisma.developmentMedia.update({
        where: { id: duplicatedMediaId },
        data: {
          towerId: media.towerId ? towerIdMap.get(media.towerId) ?? null : null,
          unitTypeId: media.unitTypeId ? unitTypeIdMap.get(media.unitTypeId) ?? null : null
        }
      });
    })
  );

  if (source.units.length) {
    await prisma.developmentUnit.createMany({
      data: source.units.map((unit) => ({
        developmentId: duplicated.id,
        towerId: unit.towerId ? towerIdMap.get(unit.towerId) : null,
        unitTypeId: unit.unitTypeId ? unitTypeIdMap.get(unit.unitTypeId) : null,
        label: unit.label,
        unitNumber: unit.unitNumber,
        floor: unit.floor,
        status: unit.status,
        price: unit.price,
        areaPrivateM2: unit.areaPrivateM2,
        areaTotalM2: unit.areaTotalM2,
        parkingSpaces: unit.parkingSpaces,
        orientation: unit.orientation,
        notes: unit.notes,
        position: unit.position
      }))
    });
  }

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
