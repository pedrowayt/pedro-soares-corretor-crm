import {
  DevelopmentPublicationStatus,
  DevelopmentStage,
  Prisma,
  type Development,
  type DevelopmentFaq,
  type DevelopmentMedia,
  type DevelopmentMilestone,
  type DevelopmentUnitType
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mockDevelopments } from "@/lib/data/mock";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export type PublicDevelopmentFilters = {
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  stage?: DevelopmentStage;
  bedrooms?: number;
};

type DevelopmentWithRelations = Development & {
  media: DevelopmentMedia[];
  unitTypes: DevelopmentUnitType[];
  milestones: DevelopmentMilestone[];
  faqs: DevelopmentFaq[];
};

function toNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value === null || value === undefined) return null;
  return typeof value === "number" ? value : Number(value);
}

function normalizeDevelopment(development: DevelopmentWithRelations) {
  return {
    ...development,
    startingPriceNumber: toNumber(development.startingPrice),
    areaFromM2Number: toNumber(development.areaFromM2),
    areaToM2Number: toNumber(development.areaToM2),
    unitTypes: development.unitTypes.map((unit) => ({
      ...unit,
      areaFromM2Number: toNumber(unit.areaFromM2),
      areaToM2Number: toNumber(unit.areaToM2),
      priceFromNumber: toNumber(unit.priceFrom),
      priceToNumber: toNumber(unit.priceTo)
    }))
  };
}

function normalizeMockDevelopment(development: (typeof mockDevelopments)[number]) {
  return {
    ...development,
    startingPriceNumber: development.startingPrice ?? null,
    areaFromM2Number: development.areaFromM2 ?? null,
    areaToM2Number: development.areaToM2 ?? null,
    unitTypes: development.unitTypes.map((unit) => ({
      ...unit,
      areaFromM2Number: unit.areaFromM2 ?? null,
      areaToM2Number: unit.areaToM2 ?? null,
      priceFromNumber: unit.priceFrom ?? null,
      priceToNumber: unit.priceTo ?? null
    }))
  };
}

export async function listPublicDevelopments(filters: PublicDevelopmentFilters = {}) {
  if (!hasDatabase) {
    return mockDevelopments
      .map(normalizeMockDevelopment)
      .filter((development) => {
        if (filters.district && development.district !== filters.district) return false;
        if (filters.stage && development.stage !== filters.stage) return false;
        if (filters.minPrice && (!development.startingPriceNumber || development.startingPriceNumber < filters.minPrice))
          return false;
        if (filters.maxPrice && (!development.startingPriceNumber || development.startingPriceNumber > filters.maxPrice))
          return false;
        if (
          filters.bedrooms &&
          !development.unitTypes.some((unitType) => unitType.bedrooms === filters.bedrooms)
        )
          return false;
        return true;
      });
  }

  try {
    const data = await prisma.development.findMany({
      where: {
        status: DevelopmentPublicationStatus.PUBLISHED,
        district: filters.district,
        stage: filters.stage,
        startingPrice: {
          gte: filters.minPrice,
          lte: filters.maxPrice
        },
        unitTypes: filters.bedrooms
          ? {
              some: {
                bedrooms: filters.bedrooms
              }
            }
          : undefined
      },
      include: {
        media: {
          orderBy: { position: "asc" }
        },
        unitTypes: {
          orderBy: { position: "asc" }
        },
        milestones: {
          orderBy: { position: "asc" }
        },
        faqs: {
          orderBy: { position: "asc" }
        }
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
    });

    return data.map(normalizeDevelopment);
  } catch {
    return mockDevelopments
      .map(normalizeMockDevelopment)
      .filter((development) => {
        if (filters.district && development.district !== filters.district) return false;
        if (filters.stage && development.stage !== filters.stage) return false;
        if (filters.minPrice && (!development.startingPriceNumber || development.startingPriceNumber < filters.minPrice))
          return false;
        if (filters.maxPrice && (!development.startingPriceNumber || development.startingPriceNumber > filters.maxPrice))
          return false;
        if (
          filters.bedrooms &&
          !development.unitTypes.some((unitType) => unitType.bedrooms === filters.bedrooms)
        )
          return false;
        return true;
      });
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
        status: DevelopmentPublicationStatus.PUBLISHED
      },
      include: {
        media: {
          orderBy: { position: "asc" }
        },
        unitTypes: {
          orderBy: { position: "asc" }
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

export async function listCrmDevelopments() {
  if (!hasDatabase) {
    return mockDevelopments.map(normalizeMockDevelopment);
  }

  try {
    const developments = await prisma.development.findMany({
      include: {
        media: {
          orderBy: { position: "asc" }
        },
        unitTypes: {
          orderBy: { position: "asc" }
        },
        milestones: {
          orderBy: { position: "asc" }
        },
        faqs: {
          orderBy: { position: "asc" }
        }
      },
      orderBy: [{ updatedAt: "desc" }]
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
        media: {
          orderBy: { position: "asc" }
        },
        unitTypes: {
          orderBy: { position: "asc" }
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

export function getDevelopmentPublicationChecklist(input: {
  title?: string | null;
  description?: string | null;
  district?: string | null;
  city?: string | null;
  mediaCount?: number;
  unitTypesCount?: number;
  ctaPrimaryUrl?: string | null;
}) {
  const missing: string[] = [];

  if (!input.title) missing.push("Título");
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
