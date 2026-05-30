import { PropertyPurpose, PropertyStatus, PropertyType } from "@prisma/client";
import { listCrmProperties } from "@/lib/data/crm-properties";
import { prisma } from "@/lib/prisma";
import { mockProperties } from "@/lib/data/mock";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export type PublicPropertyFilters = {
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: PropertyType;
  purpose?: PropertyPurpose;
  bedrooms?: number;
  minAreaM2?: number;
  /** When false (default), VENDIDO and ALUGADO are excluded from results. */
  includeInactive?: boolean;
};

const ACTIVE_PUBLIC_STATUSES = [
  PropertyStatus.DISPONIVEL,
  PropertyStatus.RESERVADO
];

const ALL_PUBLIC_STATUSES = [
  PropertyStatus.DISPONIVEL,
  PropertyStatus.RESERVADO,
  PropertyStatus.VENDIDO,
  PropertyStatus.ALUGADO
];

function normalizeForMatch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function matchPublicFilters(
  property: {
    city: string;
    district: string;
    type: PropertyType;
    purpose: PropertyPurpose;
    price: number;
    bedrooms: number | null;
    areaM2: number | null;
  },
  filters: PublicPropertyFilters
) {
  if (filters.city) {
    const needle = normalizeForMatch(filters.city);
    if (!normalizeForMatch(property.city).includes(needle)) return false;
  }
  if (filters.district) {
    const needle = normalizeForMatch(filters.district);
    if (!normalizeForMatch(property.district).includes(needle)) return false;
  }
  if (filters.type && property.type !== filters.type) return false;
  if (filters.purpose && property.purpose !== filters.purpose) return false;
  if (filters.minPrice && property.price < filters.minPrice) return false;
  if (filters.maxPrice && property.price > filters.maxPrice) return false;
  if (filters.bedrooms !== undefined && (property.bedrooms ?? 0) < filters.bedrooms) return false;
  if (filters.minAreaM2 && (!property.areaM2 || property.areaM2 < filters.minAreaM2)) return false;
  return true;
}

async function fallbackPublicProperties(filters: PublicPropertyFilters = {}) {
  const crmProperties = await listCrmProperties();
  const allowedStatuses = filters.includeInactive ? ALL_PUBLIC_STATUSES : ACTIVE_PUBLIC_STATUSES;

  const fromCrm = crmProperties
    .filter((property) =>
      (allowedStatuses as PropertyStatus[]).includes(property.status as PropertyStatus)
    )
    .map((property) => ({
      ...property,
      priceValue: Number(property.price),
      areaM2Value: property.areaM2 ? Number(property.areaM2) : null,
      landAreaM2Value: property.landAreaM2 ? Number(property.landAreaM2) : null,
      media: [],
      investorOpportunity: property.investorOpportunity ?? null,
      auctionCase: property.auctionCase ?? null
    }));

  if (fromCrm.length) {
    return fromCrm.filter((property) =>
      matchPublicFilters(
        {
          city: property.city,
          district: property.district,
          type: property.type,
          purpose: property.purpose,
          price: property.priceValue,
          bedrooms: property.bedrooms ?? null,
          areaM2: property.areaM2Value
        },
        filters
      )
    );
  }

  return mockProperties
    .map((property) => ({
      ...property,
      priceValue: property.price,
      areaM2Value: property.areaM2,
      landAreaM2Value: property.landAreaM2,
      media: property.media,
      investorOpportunity: null,
      auctionCase: null
    }))
    .filter((property) =>
      matchPublicFilters(
        {
          city: property.city,
          district: property.district,
          type: property.type,
          purpose: property.purpose,
          price: property.priceValue,
          bedrooms: property.bedrooms ?? null,
          areaM2: property.areaM2Value
        },
        filters
      )
    );
}

export async function listPublicProperties(filters: PublicPropertyFilters = {}) {
  if (!hasDatabase) {
    return fallbackPublicProperties(filters);
  }

  try {
    const properties = await prisma.property.findMany({
      where: {
        status: {
          in: filters.includeInactive ? ALL_PUBLIC_STATUSES : ACTIVE_PUBLIC_STATUSES
        },
        ...(filters.city
          ? { city: { contains: filters.city, mode: "insensitive" } }
          : {}),
        ...(filters.district
          ? { district: { contains: filters.district, mode: "insensitive" } }
          : {}),
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.purpose ? { purpose: filters.purpose } : {}),
        ...(typeof filters.minPrice === "number" || typeof filters.maxPrice === "number"
          ? {
              price: {
                ...(typeof filters.minPrice === "number" ? { gte: filters.minPrice } : {}),
                ...(typeof filters.maxPrice === "number" ? { lte: filters.maxPrice } : {})
              }
            }
          : {}),
        ...(typeof filters.bedrooms === "number"
          ? { bedrooms: { gte: filters.bedrooms } }
          : {}),
        ...(typeof filters.minAreaM2 === "number"
          ? { areaM2: { gte: filters.minAreaM2 } }
          : {})
      },
      include: {
        media: {
          where: {
            kind: "IMAGE"
          },
          orderBy: {
            position: "asc"
          },
          take: 3
        },
        investorOpportunity: true,
        auctionCase: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return properties.map((property) => ({
      ...property,
      priceValue: Number(property.price),
      areaM2Value: property.areaM2 ? Number(property.areaM2) : null,
      landAreaM2Value: property.landAreaM2 ? Number(property.landAreaM2) : null
    }));
  } catch {
    return fallbackPublicProperties(filters);
  }
}

export async function getPropertyBySlug(slug: string) {
  if (!hasDatabase) {
    const properties = await fallbackPublicProperties();
    const property = properties.find((item) => item.slug === slug);
    if (!property) return null;
    return {
      ...property,
      priceValue: property.priceValue,
      areaM2Value: property.areaM2Value,
      landAreaM2Value: property.landAreaM2Value,
      marketAskingValueNumber: null,
      marketEstimatedValueNumber: null,
      marketOpportunityNumber: null,
      owner: null,
      investorOpportunity: null,
      auctionCase: null
    };
  }

  try {
    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        media: {
          orderBy: {
            position: "asc"
          }
        },
        owner: true,
        investorOpportunity: true,
        auctionCase: true
      }
    });

    if (!property) return null;

    return {
      ...property,
      priceValue: Number(property.price),
      areaM2Value: property.areaM2 ? Number(property.areaM2) : null,
      landAreaM2Value: property.landAreaM2 ? Number(property.landAreaM2) : null,
      marketAskingValueNumber: property.marketAskingValue ? Number(property.marketAskingValue) : null,
      marketEstimatedValueNumber: property.marketEstimatedValue
        ? Number(property.marketEstimatedValue)
        : null,
      marketOpportunityNumber: property.marketOpportunity ? Number(property.marketOpportunity) : null
    };
  } catch {
    const properties = await fallbackPublicProperties();
    const property = properties.find((item) => item.slug === slug);
    if (!property) return null;
    return {
      ...property,
      priceValue: property.priceValue,
      areaM2Value: property.areaM2Value,
      landAreaM2Value: property.landAreaM2Value,
      marketAskingValueNumber: null,
      marketEstimatedValueNumber: null,
      marketOpportunityNumber: null,
      owner: null,
      investorOpportunity: null,
      auctionCase: null
    };
  }
}
