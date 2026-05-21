import {
  DevelopmentPropertyType,
  DevelopmentPublicationStatus,
  DevelopmentStage,
  Prisma,
  type Builder,
  type Development,
  type DevelopmentFaq,
  type DevelopmentMedia,
  type DevelopmentMilestone,
  type DevelopmentUnitType
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  developmentStageCompatibilityMap,
  developmentStageLabels,
  getDevelopmentStageLabel,
  isPublicDevelopmentStage,
  normalizeDevelopmentStage,
  publicDevelopmentStageOrder,
  type PublicDevelopmentStage
} from "@/lib/development-investment";
import { mockDevelopments } from "@/lib/data/mock";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export type { PublicDevelopmentStage };

export const developmentPublicStageLabels = Object.fromEntries(
  publicDevelopmentStageOrder.map((stage) => [stage, developmentStageLabels[stage]])
) as Record<PublicDevelopmentStage, string>;

export type PublicDevelopmentFilters = {
  q?: string;
  city?: string;
  district?: string;
  builder?: string;
  publicStage?: PublicDevelopmentStage;
  stage?: DevelopmentStage;
  propertyType?: DevelopmentPropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  minArea?: number;
  feature?: string;
};

type DevelopmentWithRelations = Development & {
  builder: Builder | null;
  media: DevelopmentMedia[];
  unitTypes: DevelopmentUnitType[];
  milestones: DevelopmentMilestone[];
  faqs: DevelopmentFaq[];
};

function toNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value === null || value === undefined) return null;
  return typeof value === "number" ? value : Number(value);
}

function normalizeText(value: string | null | undefined) {
  if (!value) return "";
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function includesText(haystack: string | null | undefined, needle: string | null | undefined) {
  if (!needle) return true;
  return normalizeText(haystack).includes(normalizeText(needle));
}

function mapStageToPublicStage(stage: DevelopmentStage): PublicDevelopmentStage {
  return normalizeDevelopmentStage(stage);
}

function normalizeBuilder(builder: Builder | null, development: { builderName?: string | null; developerName?: string | null }) {
  if (builder) {
    return {
      id: builder.id,
      name: builder.name,
      slug: builder.slug,
      logoUrl: builder.logoUrl,
      description: builder.description,
      city: builder.city,
      state: builder.state,
      foundedYear: builder.foundedYear,
      website: builder.website,
      instagram: builder.instagram,
      deliveredDevelopmentsCount: builder.deliveredDevelopmentsCount,
      deliveredUnitsCount: builder.deliveredUnitsCount,
      activeProjectsCount: builder.activeProjectsCount,
      institutionalText: builder.institutionalText
    };
  }

  const fallbackName = development.builderName || development.developerName || null;
  if (!fallbackName) return null;

  return {
    id: null,
    name: fallbackName,
    slug: null,
    logoUrl: null,
    description: null,
    city: null,
    state: null,
    foundedYear: null,
    website: null,
    instagram: null,
    deliveredDevelopmentsCount: null,
    deliveredUnitsCount: null,
    activeProjectsCount: null,
    institutionalText: null
  };
}

function normalizeDevelopment(development: DevelopmentWithRelations) {
  const normalizedBuilder = normalizeBuilder(development.builder, development);

  return {
    ...development,
    amenities: [...development.amenities],
    differentials: [...development.differentials],
    stageLabel: getDevelopmentStageLabel(development.stage),
    publicStage: mapStageToPublicStage(development.stage),
    startingPriceNumber: toNumber(development.startingPrice),
    priceMaxNumber: toNumber(development.priceMax),
    areaFromM2Number: toNumber(development.areaFromM2),
    areaToM2Number: toNumber(development.areaToM2),
    landAreaM2Number: toNumber(development.landAreaM2),
    latitudeNumber: toNumber(development.latitude),
    longitudeNumber: toNumber(development.longitude),
    builder: normalizedBuilder,
    displayBuilderName: normalizedBuilder?.name ?? null,
    unitTypes: development.unitTypes.map((unit) => ({
      ...unit,
      areaFromM2Number: toNumber(unit.areaFromM2),
      areaToM2Number: toNumber(unit.areaToM2),
      areaPrivateM2Number: toNumber(unit.areaPrivateM2),
      areaTotalM2Number: toNumber(unit.areaTotalM2),
      priceFromNumber: toNumber(unit.priceFrom),
      priceToNumber: toNumber(unit.priceTo),
      initialPriceNumber: toNumber(unit.initialPrice)
    }))
  };
}

function normalizeMockDevelopment(development: (typeof mockDevelopments)[number]) {
  const suites = development.unitTypes
    .map((unit) => ("suites" in unit ? unit.suites : null))
    .filter((value) => typeof value === "number") as number[];
  const bathrooms = development.unitTypes
    .map((unit) => ("bathrooms" in unit ? unit.bathrooms : null))
    .filter((value) => typeof value === "number") as number[];
  const parkingSpaces = development.unitTypes
    .map((unit) => ("parkingSpaces" in unit ? unit.parkingSpaces : null))
    .filter((value) => typeof value === "number") as number[];

  return {
    ...development,
    stageLabel: getDevelopmentStageLabel(development.stage),
    publicStage: mapStageToPublicStage(development.stage),
    propertyType: ("propertyType" in development ? (development.propertyType as string | null | undefined) : null) ?? null,
    builderId: ("builderId" in development ? (development.builderId as string | null | undefined) : null) ?? null,
    priceMax: ("priceMax" in development ? (development.priceMax as number | null | undefined) : null) ?? null,
    suitesFrom:
      ("suitesFrom" in development ? (development.suitesFrom as number | null | undefined) : null) ??
      (suites.length ? Math.min(...suites) : null),
    suitesTo:
      ("suitesTo" in development ? (development.suitesTo as number | null | undefined) : null) ??
      (suites.length ? Math.max(...suites) : null),
    bathroomsFrom:
      ("bathroomsFrom" in development ? (development.bathroomsFrom as number | null | undefined) : null) ??
      (bathrooms.length ? Math.min(...bathrooms) : null),
    bathroomsTo:
      ("bathroomsTo" in development ? (development.bathroomsTo as number | null | undefined) : null) ??
      (bathrooms.length ? Math.max(...bathrooms) : null),
    parkingFrom:
      ("parkingFrom" in development ? (development.parkingFrom as number | null | undefined) : null) ??
      (parkingSpaces.length ? Math.min(...parkingSpaces) : null),
    parkingTo:
      ("parkingTo" in development ? (development.parkingTo as number | null | undefined) : null) ??
      (parkingSpaces.length ? Math.max(...parkingSpaces) : null),
    towersCount: ("towersCount" in development ? (development.towersCount as number | null | undefined) : null) ?? null,
    floorsCount: ("floorsCount" in development ? (development.floorsCount as number | null | undefined) : null) ?? null,
    elevatorsCount:
      ("elevatorsCount" in development ? (development.elevatorsCount as number | null | undefined) : null) ?? null,
    incorporationRegistry:
      ("incorporationRegistry" in development
        ? (development.incorporationRegistry as string | null | undefined)
        : null) ?? null,
    hasPatrimonyOfAffectation:
      ("hasPatrimonyOfAffectation" in development
        ? (development.hasPatrimonyOfAffectation as boolean | null | undefined)
        : null) ?? null,
    projectText: ("projectText" in development ? (development.projectText as string | null | undefined) : null) ?? null,
    apartmentsText:
      ("apartmentsText" in development ? (development.apartmentsText as string | null | undefined) : null) ?? null,
    locationText:
      ("locationText" in development ? (development.locationText as string | null | undefined) : null) ?? null,
    locationHighlights:
      ("locationHighlights" in development ? (development.locationHighlights as string | null | undefined) : null) ?? null,
    regionLiquidityNotes:
      ("regionLiquidityNotes" in development ? (development.regionLiquidityNotes as string | null | undefined) : null) ??
      null,
    constructionProgressPct:
      ("constructionProgressPct" in development
        ? (development.constructionProgressPct as number | null | undefined)
        : null) ?? null,
    appreciationPotential:
      ("appreciationPotential" in development ? (development.appreciationPotential as string | null | undefined) : null) ??
      null,
    buyerProfile:
      ("buyerProfile" in development ? (development.buyerProfile as string | null | undefined) : null) ?? null,
    opportunityText:
      ("opportunityText" in development ? (development.opportunityText as string | null | undefined) : null) ?? null,
    showInvestmentPotentialBlock:
      ("showInvestmentPotentialBlock" in development
        ? Boolean(development.showInvestmentPotentialBlock)
        : true),
    seoKeyword: ("seoKeyword" in development ? (development.seoKeyword as string | null | undefined) : null) ?? null,
    referencePoints:
      ("referencePoints" in development ? (development.referencePoints as unknown[] | null | undefined) : null) ?? [],
    isFeatured: ("isFeatured" in development ? Boolean(development.isFeatured) : false),
    displayOrder:
      ("displayOrder" in development ? (development.displayOrder as number | null | undefined) : null) ?? 0,
    showPrice: ("showPrice" in development ? Boolean(development.showPrice) : true),
    showMap: ("showMap" in development ? Boolean(development.showMap) : true),
    showBuilder: ("showBuilder" in development ? Boolean(development.showBuilder) : true),
    showFloorplanTable: ("showFloorplanTable" in development ? Boolean(development.showFloorplanTable) : true),
    showWhatsappButton:
      ("showWhatsappButton" in development ? Boolean(development.showWhatsappButton) : true),
    seoNoIndex: ("seoNoIndex" in development ? Boolean(development.seoNoIndex) : false),
    isPublished:
      ("isPublished" in development
        ? Boolean(development.isPublished)
        : development.status === DevelopmentPublicationStatus.PUBLISHED),
    publishedAt:
      ("publishedAt" in development ? (development.publishedAt as Date | null | undefined) : null) ?? null,
    archivedAt:
      ("archivedAt" in development ? (development.archivedAt as Date | null | undefined) : null) ?? null,
    startingPriceNumber: development.startingPrice ?? null,
    priceMaxNumber: ("priceMax" in development ? (development.priceMax as number | null | undefined) : null) ?? null,
    areaFromM2Number: development.areaFromM2 ?? null,
    areaToM2Number: development.areaToM2 ?? null,
    landAreaM2Number: ("landAreaM2" in development ? (development.landAreaM2 as number | null | undefined) : null) ?? null,
    latitudeNumber: null,
    longitudeNumber: null,
    displayBuilderName: development.builderName ?? development.developerName ?? null,
    builder: development.builderName
      ? {
          id: null,
          name: development.builderName,
          slug: null,
          logoUrl: null,
          description: null,
          city: null,
          state: null,
          foundedYear: null,
          website: null,
          instagram: null,
          deliveredDevelopmentsCount: null,
          deliveredUnitsCount: null,
          activeProjectsCount: null,
          institutionalText: null
        }
      : null,
    unitTypes: development.unitTypes.map((unit) => ({
      ...unit,
      unitCategory: ("unitCategory" in unit ? (unit.unitCategory as string | null | undefined) : null) ?? null,
      areaFromM2Number: unit.areaFromM2 ?? null,
      areaToM2Number: unit.areaToM2 ?? null,
      areaPrivateM2Number: ("areaPrivateM2" in unit ? (unit.areaPrivateM2 as number | null | undefined) : null) ?? null,
      areaTotalM2Number: ("areaTotalM2" in unit ? (unit.areaTotalM2 as number | null | undefined) : null) ?? null,
      priceFromNumber: unit.priceFrom ?? null,
      priceToNumber: unit.priceTo ?? null,
      initialPriceNumber: ("initialPrice" in unit ? (unit.initialPrice as number | null | undefined) : null) ?? null,
      imageUrl: ("imageUrl" in unit ? (unit.imageUrl as string | null | undefined) : null) ?? null,
      isAvailable: ("isAvailable" in unit ? Boolean(unit.isAvailable) : true)
    })),
    media: development.media.map((media, index) => ({
      ...media,
      category: ("category" in media ? (media.category as string | null | undefined) : null) ?? null,
      caption: ("caption" in media ? (media.caption as string | null | undefined) : null) ?? null,
      position: ("position" in media ? (media.position as number | null | undefined) : null) ?? index,
      isPrimary:
        ("isPrimary" in media ? Boolean(media.isPrimary) : false) ||
        (!("isPrimary" in media) && media.kind === "HERO" && index === 0)
    }))
  };
}

function matchDevelopmentFilters(
  development: ReturnType<typeof normalizeDevelopment> | ReturnType<typeof normalizeMockDevelopment>,
  filters: PublicDevelopmentFilters
) {
  if (filters.q) {
    const matched =
      includesText(development.title, filters.q) ||
      includesText(development.district, filters.q) ||
      includesText(development.city, filters.q) ||
      includesText(development.displayBuilderName, filters.q);

    if (!matched) return false;
  }

  if (filters.city && !includesText(development.city, filters.city)) return false;
  if (filters.district && !includesText(development.district, filters.district)) return false;

  if (filters.builder && !includesText(development.displayBuilderName, filters.builder)) {
    return false;
  }

  if (filters.propertyType && development.propertyType !== filters.propertyType) return false;

  if (filters.stage && development.stage !== filters.stage) return false;

  if (
    filters.publicStage &&
    isPublicDevelopmentStage(filters.publicStage) &&
    !developmentStageCompatibilityMap[filters.publicStage].includes(development.stage)
  ) {
    return false;
  }

  if (typeof filters.minPrice === "number") {
    if (!development.startingPriceNumber || development.startingPriceNumber < filters.minPrice) return false;
  }

  if (typeof filters.maxPrice === "number") {
    if (!development.startingPriceNumber || development.startingPriceNumber > filters.maxPrice) return false;
  }

  if (typeof filters.bedrooms === "number") {
    const matchesBedrooms = development.unitTypes.some((unit) =>
      typeof unit.bedrooms === "number" ? unit.bedrooms === filters.bedrooms : false
    );

    if (!matchesBedrooms) return false;
  }

  if (typeof filters.minArea === "number") {
    const maxArea = development.areaToM2Number ?? development.areaFromM2Number;
    if (!maxArea || maxArea < filters.minArea) return false;
  }

  if (filters.feature) {
    const feature = normalizeText(filters.feature);
    const inAmenities = development.amenities.some((item) => normalizeText(item).includes(feature));
    const inDifferentials = development.differentials.some((item) => normalizeText(item).includes(feature));
    if (!inAmenities && !inDifferentials) return false;
  }

  return true;
}

async function listMockDevelopments(filters: PublicDevelopmentFilters = {}) {
  return mockDevelopments.map(normalizeMockDevelopment).filter((development) => matchDevelopmentFilters(development, filters));
}

export async function listPublicDevelopments(filters: PublicDevelopmentFilters = {}) {
  if (!hasDatabase) {
    return listMockDevelopments(filters);
  }

  try {
    const where: Prisma.DevelopmentWhereInput = {
      status: DevelopmentPublicationStatus.PUBLISHED,
      archivedAt: null,
      ...(filters.city ? { city: { contains: filters.city, mode: "insensitive" } } : {}),
      ...(filters.district ? { district: { contains: filters.district, mode: "insensitive" } } : {}),
      ...(filters.propertyType ? { propertyType: filters.propertyType } : {}),
      ...(filters.stage ? { stage: filters.stage } : {}),
      ...(filters.publicStage && isPublicDevelopmentStage(filters.publicStage)
        ? { stage: { in: developmentStageCompatibilityMap[filters.publicStage] as DevelopmentStage[] } }
        : {}),
      ...(typeof filters.minPrice === "number" || typeof filters.maxPrice === "number"
        ? {
            startingPrice: {
              ...(typeof filters.minPrice === "number" ? { gte: filters.minPrice } : {}),
              ...(typeof filters.maxPrice === "number" ? { lte: filters.maxPrice } : {})
            }
          }
        : {}),
      ...(typeof filters.bedrooms === "number"
        ? {
            unitTypes: {
              some: {
                bedrooms: filters.bedrooms
              }
            }
          }
        : {}),
      ...(filters.builder
        ? {
            OR: [
              { builderName: { contains: filters.builder, mode: "insensitive" } },
              {
                builder: {
                  is: {
                    OR: [
                      { name: { contains: filters.builder, mode: "insensitive" } },
                      { slug: { contains: filters.builder, mode: "insensitive" } }
                    ]
                  }
                }
              }
            ]
          }
        : {}),
      ...(filters.q
        ? {
            OR: [
              { title: { contains: filters.q, mode: "insensitive" } },
              { district: { contains: filters.q, mode: "insensitive" } },
              { city: { contains: filters.q, mode: "insensitive" } },
              { neighborhood: { contains: filters.q, mode: "insensitive" } },
              { builderName: { contains: filters.q, mode: "insensitive" } },
              {
                builder: {
                  is: {
                    name: { contains: filters.q, mode: "insensitive" }
                  }
                }
              }
            ]
          }
        : {})
    };

    const data = await prisma.development.findMany({
      where,
      include: {
        builder: true,
        media: { orderBy: [{ isPrimary: "desc" }, { position: "asc" }] },
        unitTypes: { orderBy: [{ isAvailable: "desc" }, { position: "asc" }] },
        milestones: { orderBy: { position: "asc" } },
        faqs: { orderBy: { position: "asc" } }
      },
      orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { updatedAt: "desc" }]
    });

    return data.map(normalizeDevelopment).filter((item) => matchDevelopmentFilters(item, filters));
  } catch {
    return listMockDevelopments(filters);
  }
}

export async function listHighlightedDevelopments(limit = 3) {
  const developments = await listPublicDevelopments();
  return developments.slice(0, limit);
}

export async function getPublicDevelopmentBySlug(slug: string) {
  if (!hasDatabase) {
    const development = mockDevelopments.find((item) => item.slug === slug);
    return development ? normalizeMockDevelopment(development) : null;
  }

  try {
    const development = await prisma.development.findFirst({
      where: {
        slug,
        status: DevelopmentPublicationStatus.PUBLISHED,
        archivedAt: null
      },
      include: {
        builder: true,
        media: {
          orderBy: [{ isPrimary: "desc" }, { position: "asc" }]
        },
        unitTypes: {
          orderBy: [{ isAvailable: "desc" }, { position: "asc" }]
        },
        milestones: {
          orderBy: { position: "asc" }
        },
        faqs: {
          orderBy: { position: "asc" }
        }
      }
    });

    if (!development) return null;
    return normalizeDevelopment(development);
  } catch {
    const development = mockDevelopments.find((item) => item.slug === slug);
    return development ? normalizeMockDevelopment(development) : null;
  }
}

export async function listCrmDevelopments(options?: { includeArchived?: boolean }) {
  if (!hasDatabase) {
    return mockDevelopments.map(normalizeMockDevelopment);
  }

  try {
    const developments = await prisma.development.findMany({
      where: options?.includeArchived ? undefined : { archivedAt: null },
      include: {
        builder: true,
        media: {
          orderBy: [{ isPrimary: "desc" }, { position: "asc" }]
        },
        unitTypes: {
          orderBy: [{ isAvailable: "desc" }, { position: "asc" }]
        },
        milestones: {
          orderBy: { position: "asc" }
        },
        faqs: {
          orderBy: { position: "asc" }
        }
      },
      orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { updatedAt: "desc" }]
    });

    return developments.map(normalizeDevelopment);
  } catch {
    return mockDevelopments.map(normalizeMockDevelopment);
  }
}

export async function getCrmDevelopmentById(id: string) {
  if (!hasDatabase) {
    const development = mockDevelopments.find((item) => item.id === id);
    return development ? normalizeMockDevelopment(development) : null;
  }

  try {
    const development = await prisma.development.findUnique({
      where: { id },
      include: {
        builder: true,
        media: {
          orderBy: [{ isPrimary: "desc" }, { position: "asc" }]
        },
        unitTypes: {
          orderBy: [{ isAvailable: "desc" }, { position: "asc" }]
        },
        milestones: {
          orderBy: { position: "asc" }
        },
        faqs: {
          orderBy: { position: "asc" }
        }
      }
    });

    if (!development) return null;
    return normalizeDevelopment(development);
  } catch {
    const development = mockDevelopments.find((item) => item.id === id);
    return development ? normalizeMockDevelopment(development) : null;
  }
}

export async function listCrmBuilders(options?: { includeArchived?: boolean }) {
  if (!hasDatabase) return [] as Builder[];

  try {
    return await prisma.builder.findMany({
      where: options?.includeArchived ? undefined : { archivedAt: null },
      orderBy: [{ name: "asc" }]
    });
  } catch {
    return [] as Builder[];
  }
}

export async function getCrmBuilderById(id: string) {
  if (!hasDatabase) return null;

  try {
    return await prisma.builder.findUnique({
      where: { id },
      include: {
        developments: {
          where: { archivedAt: null },
          orderBy: [{ status: "asc" }, { updatedAt: "desc" }]
        }
      }
    });
  } catch {
    return null;
  }
}

export async function getPublicBuilderBySlug(slug: string) {
  if (!hasDatabase) return null;

  try {
    const builder = await prisma.builder.findFirst({
      where: { slug, archivedAt: null },
      include: {
        developments: {
          where: {
            status: DevelopmentPublicationStatus.PUBLISHED,
            archivedAt: null
          },
          include: {
            builder: true,
            media: { orderBy: [{ isPrimary: "desc" }, { position: "asc" }] },
            unitTypes: { orderBy: [{ isAvailable: "desc" }, { position: "asc" }] },
            milestones: { orderBy: { position: "asc" } },
            faqs: { orderBy: { position: "asc" } }
          },
          orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { updatedAt: "desc" }]
        }
      }
    });

    if (!builder) return null;

    return {
      ...builder,
      developments: builder.developments.map(normalizeDevelopment)
    };
  } catch {
    return null;
  }
}

export function getDevelopmentPublicationChecklist(input: {
  title?: string | null;
  description?: string | null;
  district?: string | null;
  city?: string | null;
  mediaCount?: number;
  unitTypesCount?: number;
  ctaPrimaryUrl?: string | null;
  summary?: string | null;
}) {
  const missing: string[] = [];

  if (!input.title) missing.push("Título");
  if (!input.summary) missing.push("Frase curta / resumo");
  if (!input.description) missing.push("Descrição");
  if (!input.district || !input.city) missing.push("Cidade/Bairro");
  if (!input.mediaCount) missing.push("Mídia (hero)");
  if (!input.unitTypesCount) missing.push("Tipologias");
  if (!input.ctaPrimaryUrl) missing.push("CTA principal");

  return {
    ready: missing.length === 0,
    missing
  };
}

export function mapPublicStageToInternalStages(publicStage?: PublicDevelopmentStage) {
  if (!publicStage || !isPublicDevelopmentStage(publicStage)) return undefined;
  return developmentStageCompatibilityMap[publicStage] as DevelopmentStage[];
}
