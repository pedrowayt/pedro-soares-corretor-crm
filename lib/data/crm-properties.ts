import { Prisma, type AuctionCase, type InvestorOpportunity, type Owner, type Property } from "@prisma/client";
import { mockProperties } from "@/lib/data/mock";
import { slugify } from "@/lib/crm/slug";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

type NullableNumber = number | null;

export type CrmPropertyPayload = {
  title: string;
  slug: string;
  type: Property["type"];
  purpose: Property["purpose"];
  status: Property["status"];
  price: number;
  city: string;
  district: string;
  address?: string | null;
  postalCode?: string | null;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  areaM2?: number | null;
  bedrooms?: number | null;
  suites?: number | null;
  bathrooms?: number | null;
  parkingSpaces?: number | null;
  description: string;
  features: string[];
  legalNotes?: string | null;
  internalNotes?: string | null;
  commissionPct?: number | null;
};

type MemoryProperty = {
  id: string;
  slug: string;
  title: string;
  type: Property["type"];
  purpose: Property["purpose"];
  status: Property["status"];
  price: number;
  address: string | null;
  city: string;
  district: string;
  postalCode: string | null;
  googleMapsUrl: string | null;
  latitude: NullableNumber;
  longitude: NullableNumber;
  areaM2: NullableNumber;
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  description: string;
  features: string[];
  legalNotes: string | null;
  internalNotes: string | null;
  commissionPct: NullableNumber;
  isInvestorHighlight: boolean;
  isAuctionOpportunity: boolean;
  marketAskingValue: NullableNumber;
  marketEstimatedValue: NullableNumber;
  marketOpportunity: NullableNumber;
  marketComparableLinks: string[];
  marketLiquidityNotes: string | null;
  ownerId: string | null;
  owner: Owner | null;
  investorOpportunity: InvestorOpportunity | null;
  auctionCase: AuctionCase | null;
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  var crmPropertiesMemory: MemoryProperty[] | undefined;
}

function optionalString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

function optionalNumber(input?: number | null) {
  if (input === undefined) return undefined;
  if (input === null || Number.isNaN(input)) return null;
  return Number(input);
}

function normalizeFeatureList(features: string[]) {
  return features.map((item) => item.trim()).filter(Boolean);
}

function buildGoogleMapsSearchUrl(input: { address?: string | null; district?: string | null; city?: string | null }) {
  const parts = [input.address, input.district, input.city, "TO", "Brasil"].filter(Boolean).join(", ");
  if (!parts) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts)}`;
}

function toNumber(value: unknown): NullableNumber {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value === "object" && value !== null && "toString" in value) {
    const parsed = Number((value as { toString: () => string }).toString());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

type DbPropertyWithRelations = Property & {
  owner: Owner | null;
  investorOpportunity: InvestorOpportunity | null;
  auctionCase: AuctionCase | null;
};

function normalizeDbProperty(property: DbPropertyWithRelations) {
  return {
    ...property,
    price: Number(property.price),
    areaM2: toNumber(property.areaM2),
    latitude: toNumber(property.latitude),
    longitude: toNumber(property.longitude),
    commissionPct: toNumber(property.commissionPct),
    marketAskingValue: toNumber(property.marketAskingValue),
    marketEstimatedValue: toNumber(property.marketEstimatedValue),
    marketOpportunity: toNumber(property.marketOpportunity),
    googleMapsUrl:
      property.googleMapsUrl ??
      buildGoogleMapsSearchUrl({
        address: property.address,
        district: property.district,
        city: property.city
      })
  };
}

function fromMockProperty(property: (typeof mockProperties)[number], index: number): MemoryProperty {
  const now = new Date();

  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    type: property.type,
    purpose: property.purpose,
    status: property.status,
    price: property.price,
    address: null,
    city: property.city,
    district: property.district,
    postalCode: null,
    googleMapsUrl: buildGoogleMapsSearchUrl({ district: property.district, city: property.city }),
    latitude: null,
    longitude: null,
    areaM2: property.areaM2,
    bedrooms: property.bedrooms,
    suites: property.suites,
    bathrooms: property.bathrooms,
    parkingSpaces: property.parkingSpaces,
    description: property.description,
    features: [...property.features],
    legalNotes: null,
    internalNotes: null,
    commissionPct: null,
    isInvestorHighlight: property.isInvestorHighlight,
    isAuctionOpportunity: property.isAuctionOpportunity,
    marketAskingValue: null,
    marketEstimatedValue: null,
    marketOpportunity: null,
    marketComparableLinks: [],
    marketLiquidityNotes: null,
    ownerId: null,
    owner: null,
    investorOpportunity: null,
    auctionCase: null,
    createdAt: new Date(now.getTime() - index * 60_000),
    updatedAt: now
  };
}

function getMemoryStore() {
  if (!globalThis.crmPropertiesMemory) {
    globalThis.crmPropertiesMemory = mockProperties.map(fromMockProperty);
  }

  return globalThis.crmPropertiesMemory;
}

function normalizeForCreate(input: CrmPropertyPayload): CrmPropertyPayload {
  return {
    ...input,
    slug: slugify(input.slug),
    title: input.title.trim(),
    city: input.city.trim(),
    district: input.district.trim(),
    description: input.description.trim(),
    address: optionalString(input.address),
    postalCode: optionalString(input.postalCode),
    googleMapsUrl: optionalString(input.googleMapsUrl),
    legalNotes: optionalString(input.legalNotes),
    internalNotes: optionalString(input.internalNotes),
    latitude: optionalNumber(input.latitude),
    longitude: optionalNumber(input.longitude),
    areaM2: optionalNumber(input.areaM2),
    commissionPct: optionalNumber(input.commissionPct),
    bedrooms: input.bedrooms ?? null,
    suites: input.suites ?? null,
    bathrooms: input.bathrooms ?? null,
    parkingSpaces: input.parkingSpaces ?? null,
    features: normalizeFeatureList(input.features)
  };
}

export async function listCrmProperties() {
  if (!hasDatabase) {
    return [...getMemoryStore()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: true,
        investorOpportunity: true,
        auctionCase: true
      }
    });

    return properties.map((property) =>
      normalizeDbProperty(property)
    );
  } catch {
    return [...getMemoryStore()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function createCrmProperty(payload: CrmPropertyPayload) {
  const normalized = normalizeForCreate(payload);

  if (hasDatabase) {
    try {
      const property = await prisma.property.create({
        data: {
          slug: normalized.slug,
          title: normalized.title,
          type: normalized.type,
          purpose: normalized.purpose,
          status: normalized.status,
          price: normalized.price,
          city: normalized.city,
          district: normalized.district,
          address: normalized.address,
          postalCode: normalized.postalCode,
          googleMapsUrl:
            normalized.googleMapsUrl ??
            buildGoogleMapsSearchUrl({
              address: normalized.address,
              district: normalized.district,
              city: normalized.city
            }),
          latitude: normalized.latitude,
          longitude: normalized.longitude,
          areaM2: normalized.areaM2,
          bedrooms: normalized.bedrooms,
          suites: normalized.suites,
          bathrooms: normalized.bathrooms,
          parkingSpaces: normalized.parkingSpaces,
          description: normalized.description,
          features: normalized.features,
          legalNotes: normalized.legalNotes,
          internalNotes: normalized.internalNotes,
          commissionPct: normalized.commissionPct
        },
        include: {
          owner: true,
          investorOpportunity: true,
          auctionCase: true
        }
      });

      return normalizeDbProperty(property);
    } catch {
      // fallback below
    }
  }

  const store = getMemoryStore();
  const now = new Date();
  const created: MemoryProperty = {
    id: `mem-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    slug: normalized.slug,
    title: normalized.title,
    type: normalized.type,
    purpose: normalized.purpose,
    status: normalized.status,
    price: normalized.price,
    address: normalized.address ?? null,
    city: normalized.city,
    district: normalized.district,
    postalCode: normalized.postalCode ?? null,
    googleMapsUrl:
      normalized.googleMapsUrl ??
      buildGoogleMapsSearchUrl({
        address: normalized.address,
        district: normalized.district,
        city: normalized.city
      }),
    latitude: normalized.latitude ?? null,
    longitude: normalized.longitude ?? null,
    areaM2: normalized.areaM2 ?? null,
    bedrooms: normalized.bedrooms ?? null,
    suites: normalized.suites ?? null,
    bathrooms: normalized.bathrooms ?? null,
    parkingSpaces: normalized.parkingSpaces ?? null,
    description: normalized.description,
    features: normalized.features,
    legalNotes: normalized.legalNotes ?? null,
    internalNotes: normalized.internalNotes ?? null,
    commissionPct: normalized.commissionPct ?? null,
    isInvestorHighlight: false,
    isAuctionOpportunity: normalized.purpose === "LEILAO",
    marketAskingValue: null,
    marketEstimatedValue: null,
    marketOpportunity: null,
    marketComparableLinks: [],
    marketLiquidityNotes: null,
    ownerId: null,
    owner: null,
    investorOpportunity: null,
    auctionCase: null,
    createdAt: now,
    updatedAt: now
  };

  store.unshift(created);
  return created;
}

export async function updateCrmProperty(id: string, payload: Partial<CrmPropertyPayload>) {
  const partial = {
    ...payload,
    slug: payload.slug ? slugify(payload.slug) : undefined,
    title: payload.title?.trim(),
    city: payload.city?.trim(),
    district: payload.district?.trim(),
    description: payload.description?.trim(),
    address: optionalString(payload.address),
    postalCode: optionalString(payload.postalCode),
    googleMapsUrl: optionalString(payload.googleMapsUrl),
    legalNotes: optionalString(payload.legalNotes),
    internalNotes: optionalString(payload.internalNotes),
    latitude: optionalNumber(payload.latitude),
    longitude: optionalNumber(payload.longitude),
    areaM2: optionalNumber(payload.areaM2),
    commissionPct: optionalNumber(payload.commissionPct),
    features: payload.features ? normalizeFeatureList(payload.features) : undefined
  };

  if (hasDatabase) {
    try {
      const property = await prisma.property.update({
        where: { id },
        data: {
          ...partial,
          googleMapsUrl:
            partial.googleMapsUrl === undefined
              ? undefined
              : partial.googleMapsUrl ??
                buildGoogleMapsSearchUrl({
                  address: partial.address,
                  district: partial.district,
                  city: partial.city
                })
        },
        include: {
          owner: true,
          investorOpportunity: true,
          auctionCase: true
        }
      });

      return normalizeDbProperty(property);
    } catch {
      // fallback below
    }
  }

  const store = getMemoryStore();
  const index = store.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const current = store[index];
  const next: MemoryProperty = {
    ...current,
    type: partial.type ?? current.type,
    purpose: partial.purpose ?? current.purpose,
    status: partial.status ?? current.status,
    price: partial.price ?? current.price,
    slug: partial.slug ?? current.slug,
    title: partial.title ?? current.title,
    city: partial.city ?? current.city,
    district: partial.district ?? current.district,
    address: partial.address === undefined ? current.address : partial.address,
    postalCode: partial.postalCode === undefined ? current.postalCode : partial.postalCode,
    latitude: partial.latitude === undefined ? current.latitude : partial.latitude,
    longitude: partial.longitude === undefined ? current.longitude : partial.longitude,
    areaM2: partial.areaM2 === undefined ? current.areaM2 : partial.areaM2,
    bedrooms: partial.bedrooms === undefined ? current.bedrooms : partial.bedrooms,
    suites: partial.suites === undefined ? current.suites : partial.suites,
    bathrooms: partial.bathrooms === undefined ? current.bathrooms : partial.bathrooms,
    parkingSpaces: partial.parkingSpaces === undefined ? current.parkingSpaces : partial.parkingSpaces,
    description: partial.description ?? current.description,
    features: partial.features ?? current.features,
    legalNotes: partial.legalNotes === undefined ? current.legalNotes : partial.legalNotes,
    internalNotes: partial.internalNotes === undefined ? current.internalNotes : partial.internalNotes,
    commissionPct: partial.commissionPct === undefined ? current.commissionPct : partial.commissionPct,
    googleMapsUrl:
      partial.googleMapsUrl === undefined
        ? current.googleMapsUrl
        : partial.googleMapsUrl ??
          buildGoogleMapsSearchUrl({
            address: partial.address ?? current.address,
            district: partial.district ?? current.district,
            city: partial.city ?? current.city
          }),
    updatedAt: new Date()
  };

  store[index] = next;
  return next;
}

export async function findCrmPropertyById(id: string) {
  if (!hasDatabase) {
    return getMemoryStore().find((item) => item.id === id) ?? null;
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: true,
        investorOpportunity: true,
        auctionCase: true
      }
    });

    if (!property) return null;
    return normalizeDbProperty(property);
  } catch {
    return getMemoryStore().find((item) => item.id === id) ?? null;
  }
}

export async function createPropertyAuditLog(input: {
  action: string;
  resourceId: string;
  actorId?: string | null;
  payload: unknown;
}) {
  if (!hasDatabase) return;

  try {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        resource: "Property",
        resourceId: input.resourceId,
        actorId: input.actorId ?? undefined,
        metadata: input.payload as Prisma.InputJsonValue
      }
    });
  } catch {
    // silent fallback for local environments without DB schema sync
  }
}
