import {
  Prisma,
  type AuctionCase,
  type AuctionRisk,
  type InvestorOpportunity,
  type Owner,
  type Property,
  type PropertyMedia
} from "@prisma/client";
import { mockProperties } from "@/lib/data/mock";
import { slugify } from "@/lib/crm/slug";
import { refreshAuctionImportChecklistForProperty } from "@/lib/data/auction-imports";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

type NullableNumber = number | null;

export type CrmAuctionCasePayload = {
  caseNumber?: string | null;
  courtName?: string | null;
  auctionDate?: string | Date | null;
  firstAuctionDate?: string | Date | null;
  secondAuctionDate?: string | Date | null;
  minimumBid?: number | null;
  appraisedValue?: number | null;
  estimatedCosts?: number | null;
  documentaryRisk?: AuctionRisk | null;
  legalStatus?: string | null;
  editalUrl?: string | null;
  appraisalUrl?: string | null;
  registryUrl?: string | null;
  bidUrl?: string | null;
  lotCode?: string | null;
  auctioneerName?: string | null;
  auctionType?: string | null;
  auctionMode?: string | null;
  registryNumber?: string | null;
  registryOffice?: string | null;
  occupancyStatus?: string | null;
  debtsInfo?: string | null;
  notes?: string | null;
  documentLinks?: unknown;
};

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
  landAreaM2?: number | null;
  frontMeters?: number | null;
  backMeters?: number | null;
  sideLeftMeters?: number | null;
  sideRightMeters?: number | null;
  ceilingHeightM?: number | null;
  bedrooms?: number | null;
  livingRooms?: number | null;
  suites?: number | null;
  bathrooms?: number | null;
  parkingSpaces?: number | null;
  floorNumber?: number | null;
  floorCount?: number | null;
  unitCount?: number | null;
  description: string;
  features: string[];
  legalNotes?: string | null;
  internalNotes?: string | null;
  documents?: unknown;
  commissionPct?: number | null;
  marketAskingValue?: number | null;
  marketEstimatedValue?: number | null;
  marketOpportunity?: number | null;
  marketComparableLinks?: string[];
  marketLiquidityNotes?: string | null;
  isInvestorHighlight?: boolean;
  isAuctionOpportunity?: boolean;
  auctionCase?: CrmAuctionCasePayload | null;
  ownerName?: string | null;
  ownerPhone?: string | null;
};

type MemoryMedia = {
  id: string;
  propertyId: string;
  kind: PropertyMedia["kind"];
  status: PropertyMedia["status"];
  cloudflareMediaId: string | null;
  url: string;
  variant: string | null;
  position: number;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
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
  landAreaM2: NullableNumber;
  frontMeters: NullableNumber;
  backMeters: NullableNumber;
  sideLeftMeters: NullableNumber;
  sideRightMeters: NullableNumber;
  ceilingHeightM: NullableNumber;
  bedrooms: number | null;
  livingRooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  floorNumber: number | null;
  floorCount: number | null;
  unitCount: number | null;
  description: string;
  features: string[];
  legalNotes: string | null;
  internalNotes: string | null;
  documents: Prisma.JsonValue | null;
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
  media: MemoryMedia[];
  publishedAt: Date | null;
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

function optionalDate(input?: string | Date | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const date = input instanceof Date ? input : new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

function optionalJson(input: unknown) {
  if (input === undefined) return undefined;
  if (input === null) return Prisma.JsonNull;
  return input as Prisma.InputJsonValue;
}

function normalizePhone(input?: string | null) {
  const trimmed = optionalString(input);
  return trimmed;
}

function normalizeAuctionCasePayload(input?: CrmAuctionCasePayload | null) {
  if (!input) return null;

  return {
    caseNumber: optionalString(input.caseNumber),
    courtName: optionalString(input.courtName),
    auctionDate: optionalDate(input.auctionDate),
    firstAuctionDate: optionalDate(input.firstAuctionDate),
    secondAuctionDate: optionalDate(input.secondAuctionDate),
    minimumBid: optionalNumber(input.minimumBid),
    appraisedValue: optionalNumber(input.appraisedValue),
    estimatedCosts: optionalNumber(input.estimatedCosts),
    documentaryRisk: input.documentaryRisk ?? null,
    legalStatus: optionalString(input.legalStatus),
    editalUrl: optionalString(input.editalUrl),
    appraisalUrl: optionalString(input.appraisalUrl),
    registryUrl: optionalString(input.registryUrl),
    bidUrl: optionalString(input.bidUrl),
    lotCode: optionalString(input.lotCode),
    auctioneerName: optionalString(input.auctioneerName),
    auctionType: optionalString(input.auctionType),
    auctionMode: optionalString(input.auctionMode),
    registryNumber: optionalString(input.registryNumber),
    registryOffice: optionalString(input.registryOffice),
    occupancyStatus: optionalString(input.occupancyStatus),
    debtsInfo: optionalString(input.debtsInfo),
    notes: optionalString(input.notes),
    documentLinks:
      input.documentLinks === undefined
        ? undefined
        : input.documentLinks === null
          ? Prisma.JsonNull
          : (input.documentLinks as Prisma.InputJsonValue)
  };
}

async function upsertAuctionCase(propertyId: string, payload?: CrmAuctionCasePayload | null) {
  const normalized = normalizeAuctionCasePayload(payload);
  if (!normalized || !hasDatabase) return;

  await prisma.auctionCase.upsert({
    where: { propertyId },
    create: {
      propertyId,
      ...normalized
    },
    update: normalized
  });
}

async function upsertOwnerByPhone(name?: string | null, phone?: string | null) {
  const cleanedName = optionalString(name);
  const cleanedPhone = normalizePhone(phone);
  if (!cleanedName || !cleanedPhone) return null;

  if (!hasDatabase) return null;

  try {
    const existing = await prisma.owner.findFirst({ where: { phone: cleanedPhone } });
    if (existing) {
      if (existing.name !== cleanedName) {
        await prisma.owner.update({ where: { id: existing.id }, data: { name: cleanedName } });
      }
      return existing.id;
    }
    const created = await prisma.owner.create({
      data: { name: cleanedName, phone: cleanedPhone }
    });
    return created.id;
  } catch {
    return null;
  }
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
  media?: PropertyMedia[];
};

function normalizeDbProperty(property: DbPropertyWithRelations) {
  return {
    ...property,
    price: Number(property.price),
    areaM2: toNumber(property.areaM2),
    landAreaM2: toNumber(property.landAreaM2),
    frontMeters: toNumber(property.frontMeters),
    backMeters: toNumber(property.backMeters),
    sideLeftMeters: toNumber(property.sideLeftMeters),
    sideRightMeters: toNumber(property.sideRightMeters),
    ceilingHeightM: toNumber(property.ceilingHeightM),
    latitude: toNumber(property.latitude),
    longitude: toNumber(property.longitude),
    commissionPct: toNumber(property.commissionPct),
    marketAskingValue: toNumber(property.marketAskingValue),
    marketEstimatedValue: toNumber(property.marketEstimatedValue),
    marketOpportunity: toNumber(property.marketOpportunity),
    media: property.media ?? [],
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
    landAreaM2: property.landAreaM2,
    frontMeters: null,
    backMeters: null,
    sideLeftMeters: null,
    sideRightMeters: null,
    ceilingHeightM: null,
    bedrooms: property.bedrooms,
    livingRooms: property.livingRooms,
    suites: property.suites,
    bathrooms: property.bathrooms,
    parkingSpaces: property.parkingSpaces,
    floorNumber: null,
    floorCount: null,
    unitCount: null,
    description: property.description,
    features: [...property.features],
    legalNotes: null,
    internalNotes: null,
    documents: null,
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
    media: [],
    publishedAt: null,
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
    marketLiquidityNotes: optionalString(input.marketLiquidityNotes),
    latitude: optionalNumber(input.latitude),
    longitude: optionalNumber(input.longitude),
    areaM2: optionalNumber(input.areaM2),
    landAreaM2: optionalNumber(input.landAreaM2),
    frontMeters: optionalNumber(input.frontMeters),
    backMeters: optionalNumber(input.backMeters),
    sideLeftMeters: optionalNumber(input.sideLeftMeters),
    sideRightMeters: optionalNumber(input.sideRightMeters),
    ceilingHeightM: optionalNumber(input.ceilingHeightM),
    floorNumber: input.floorNumber ?? null,
    floorCount: input.floorCount ?? null,
    unitCount: input.unitCount ?? null,
    commissionPct: optionalNumber(input.commissionPct),
    marketAskingValue: optionalNumber(input.marketAskingValue),
    marketEstimatedValue: optionalNumber(input.marketEstimatedValue),
    marketOpportunity: optionalNumber(input.marketOpportunity),
    bedrooms: input.bedrooms ?? null,
    livingRooms: input.livingRooms ?? null,
    suites: input.suites ?? null,
    bathrooms: input.bathrooms ?? null,
    parkingSpaces: input.parkingSpaces ?? null,
    features: normalizeFeatureList(input.features),
    marketComparableLinks: input.marketComparableLinks
      ? normalizeFeatureList(input.marketComparableLinks)
      : []
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
        auctionCase: true,
        auctionImports: {
          orderBy: { lastImportedAt: "desc" },
          take: 1
        },
        media: {
          orderBy: { position: "asc" }
        }
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
  const ownerId = await upsertOwnerByPhone(payload.ownerName, payload.ownerPhone);

  if (hasDatabase) {
    try {
      const property = await prisma.property.create({
        data: {
          ...(ownerId ? { ownerId } : {}),
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
          landAreaM2: normalized.landAreaM2,
          frontMeters: normalized.frontMeters,
          backMeters: normalized.backMeters,
          sideLeftMeters: normalized.sideLeftMeters,
          sideRightMeters: normalized.sideRightMeters,
          ceilingHeightM: normalized.ceilingHeightM,
          bedrooms: normalized.bedrooms,
          livingRooms: normalized.livingRooms,
          suites: normalized.suites,
          bathrooms: normalized.bathrooms,
          parkingSpaces: normalized.parkingSpaces,
          floorNumber: normalized.floorNumber,
          floorCount: normalized.floorCount,
          unitCount: normalized.unitCount,
          description: normalized.description,
          features: normalized.features,
          legalNotes: normalized.legalNotes,
          internalNotes: normalized.internalNotes,
          documents: optionalJson(normalized.documents),
          commissionPct: normalized.commissionPct,
          marketAskingValue: normalized.marketAskingValue ?? undefined,
          marketEstimatedValue: normalized.marketEstimatedValue ?? undefined,
          marketOpportunity: normalized.marketOpportunity ?? undefined,
          marketComparableLinks: normalized.marketComparableLinks ?? [],
          marketLiquidityNotes: normalized.marketLiquidityNotes ?? undefined,
          isInvestorHighlight: normalized.isInvestorHighlight ?? false,
          isAuctionOpportunity:
            normalized.isAuctionOpportunity ?? normalized.purpose === "LEILAO"
        },
        include: {
          owner: true,
          investorOpportunity: true,
          auctionCase: true
        }
      });

      await upsertAuctionCase(property.id, normalized.auctionCase);

      if (normalized.auctionCase) {
        const withAuctionCase = await prisma.property.findUnique({
          where: { id: property.id },
          include: {
            owner: true,
            investorOpportunity: true,
            auctionCase: true
          }
        });
        if (withAuctionCase) return normalizeDbProperty(withAuctionCase);
      }

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
    landAreaM2: normalized.landAreaM2 ?? null,
    frontMeters: normalized.frontMeters ?? null,
    backMeters: normalized.backMeters ?? null,
    sideLeftMeters: normalized.sideLeftMeters ?? null,
    sideRightMeters: normalized.sideRightMeters ?? null,
    ceilingHeightM: normalized.ceilingHeightM ?? null,
    bedrooms: normalized.bedrooms ?? null,
    livingRooms: normalized.livingRooms ?? null,
    suites: normalized.suites ?? null,
    bathrooms: normalized.bathrooms ?? null,
    parkingSpaces: normalized.parkingSpaces ?? null,
    floorNumber: normalized.floorNumber ?? null,
    floorCount: normalized.floorCount ?? null,
    unitCount: normalized.unitCount ?? null,
    description: normalized.description,
    features: normalized.features,
    legalNotes: normalized.legalNotes ?? null,
    internalNotes: normalized.internalNotes ?? null,
    documents: (normalized.documents as Prisma.JsonValue | null | undefined) ?? null,
    commissionPct: normalized.commissionPct ?? null,
    isInvestorHighlight: normalized.isInvestorHighlight ?? false,
    isAuctionOpportunity:
      normalized.isAuctionOpportunity ?? normalized.purpose === "LEILAO",
    marketAskingValue: normalized.marketAskingValue ?? null,
    marketEstimatedValue: normalized.marketEstimatedValue ?? null,
    marketOpportunity: normalized.marketOpportunity ?? null,
    marketComparableLinks: normalized.marketComparableLinks ?? [],
    marketLiquidityNotes: normalized.marketLiquidityNotes ?? null,
    ownerId: null,
    owner: null,
    investorOpportunity: null,
    auctionCase: null,
    media: [],
    publishedAt: null,
    createdAt: now,
    updatedAt: now
  };

  store.unshift(created);
  return created;
}

export async function updateCrmProperty(id: string, payload: Partial<CrmPropertyPayload>) {
  const { auctionCase, ownerName, ownerPhone, ...scalarPayload } = payload;
  const ownerId =
    ownerName !== undefined || ownerPhone !== undefined
      ? await upsertOwnerByPhone(ownerName ?? null, ownerPhone ?? null)
      : undefined;

  const partial = {
    ...scalarPayload,
    slug: scalarPayload.slug ? slugify(scalarPayload.slug) : undefined,
    title: scalarPayload.title?.trim(),
    city: scalarPayload.city?.trim(),
    district: scalarPayload.district?.trim(),
    description: scalarPayload.description?.trim(),
    address: optionalString(scalarPayload.address),
    postalCode: optionalString(scalarPayload.postalCode),
    googleMapsUrl: optionalString(scalarPayload.googleMapsUrl),
    legalNotes: optionalString(scalarPayload.legalNotes),
    internalNotes: optionalString(scalarPayload.internalNotes),
    marketLiquidityNotes: optionalString(scalarPayload.marketLiquidityNotes),
    latitude: optionalNumber(scalarPayload.latitude),
    longitude: optionalNumber(scalarPayload.longitude),
    areaM2: optionalNumber(scalarPayload.areaM2),
    landAreaM2: optionalNumber(scalarPayload.landAreaM2),
    frontMeters: optionalNumber(scalarPayload.frontMeters),
    backMeters: optionalNumber(scalarPayload.backMeters),
    sideLeftMeters: optionalNumber(scalarPayload.sideLeftMeters),
    sideRightMeters: optionalNumber(scalarPayload.sideRightMeters),
    ceilingHeightM: optionalNumber(scalarPayload.ceilingHeightM),
    floorNumber: scalarPayload.floorNumber === undefined ? undefined : scalarPayload.floorNumber,
    floorCount: scalarPayload.floorCount === undefined ? undefined : scalarPayload.floorCount,
    unitCount: scalarPayload.unitCount === undefined ? undefined : scalarPayload.unitCount,
    documents:
      scalarPayload.documents === undefined
        ? undefined
        : optionalJson(scalarPayload.documents),
    commissionPct: optionalNumber(scalarPayload.commissionPct),
    marketAskingValue: optionalNumber(scalarPayload.marketAskingValue),
    marketEstimatedValue: optionalNumber(scalarPayload.marketEstimatedValue),
    marketOpportunity: optionalNumber(scalarPayload.marketOpportunity),
    features: scalarPayload.features ? normalizeFeatureList(scalarPayload.features) : undefined,
    marketComparableLinks: scalarPayload.marketComparableLinks
      ? normalizeFeatureList(scalarPayload.marketComparableLinks)
      : undefined
  };

  if (hasDatabase) {
    try {
      const property = await prisma.property.update({
        where: { id },
        data: {
          ...partial,
          ...(ownerId ? { ownerId } : {}),
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

      await upsertAuctionCase(id, auctionCase);
      await refreshAuctionImportChecklistForProperty(id).catch(() => null);

      if (auctionCase) {
        const withAuctionCase = await prisma.property.findUnique({
          where: { id },
          include: {
            owner: true,
            investorOpportunity: true,
            auctionCase: true
          }
        });
        if (withAuctionCase) return normalizeDbProperty(withAuctionCase);
      }

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
    landAreaM2: partial.landAreaM2 === undefined ? current.landAreaM2 : partial.landAreaM2,
    frontMeters: partial.frontMeters === undefined ? current.frontMeters : partial.frontMeters,
    backMeters: partial.backMeters === undefined ? current.backMeters : partial.backMeters,
    sideLeftMeters:
      partial.sideLeftMeters === undefined ? current.sideLeftMeters : partial.sideLeftMeters,
    sideRightMeters:
      partial.sideRightMeters === undefined ? current.sideRightMeters : partial.sideRightMeters,
    ceilingHeightM:
      partial.ceilingHeightM === undefined ? current.ceilingHeightM : partial.ceilingHeightM,
    bedrooms: partial.bedrooms === undefined ? current.bedrooms : partial.bedrooms,
    livingRooms: partial.livingRooms === undefined ? current.livingRooms : partial.livingRooms,
    suites: partial.suites === undefined ? current.suites : partial.suites,
    bathrooms: partial.bathrooms === undefined ? current.bathrooms : partial.bathrooms,
    parkingSpaces: partial.parkingSpaces === undefined ? current.parkingSpaces : partial.parkingSpaces,
    floorNumber: partial.floorNumber === undefined ? current.floorNumber : partial.floorNumber,
    floorCount: partial.floorCount === undefined ? current.floorCount : partial.floorCount,
    unitCount: partial.unitCount === undefined ? current.unitCount : partial.unitCount,
    description: partial.description ?? current.description,
    features: partial.features ?? current.features,
    legalNotes: partial.legalNotes === undefined ? current.legalNotes : partial.legalNotes,
    internalNotes: partial.internalNotes === undefined ? current.internalNotes : partial.internalNotes,
    documents:
      partial.documents === undefined
        ? current.documents
        : (partial.documents as Prisma.JsonValue | null),
    commissionPct: partial.commissionPct === undefined ? current.commissionPct : partial.commissionPct,
    marketAskingValue:
      partial.marketAskingValue === undefined ? current.marketAskingValue : partial.marketAskingValue,
    marketEstimatedValue:
      partial.marketEstimatedValue === undefined
        ? current.marketEstimatedValue
        : partial.marketEstimatedValue,
    marketOpportunity:
      partial.marketOpportunity === undefined ? current.marketOpportunity : partial.marketOpportunity,
    marketComparableLinks: partial.marketComparableLinks ?? current.marketComparableLinks,
    marketLiquidityNotes:
      partial.marketLiquidityNotes === undefined
        ? current.marketLiquidityNotes
        : partial.marketLiquidityNotes,
    isInvestorHighlight:
      partial.isInvestorHighlight === undefined ? current.isInvestorHighlight : partial.isInvestorHighlight,
    isAuctionOpportunity:
      partial.isAuctionOpportunity === undefined ? current.isAuctionOpportunity : partial.isAuctionOpportunity,
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
        auctionCase: true,
        auctionImports: {
          orderBy: { lastImportedAt: "desc" },
          take: 1
        },
        media: {
          orderBy: { position: "asc" }
        }
      }
    });

    if (!property) return null;
    return normalizeDbProperty(property);
  } catch {
    return getMemoryStore().find((item) => item.id === id) ?? null;
  }
}

export type PropertyMediaPayload = {
  kind: PropertyMedia["kind"];
  url: string;
  cloudflareMediaId?: string | null;
  position?: number | null;
  metadata?: Prisma.JsonValue | null;
};

export async function addPropertyMedia(propertyId: string, payload: PropertyMediaPayload) {
  if (hasDatabase) {
    try {
      const existing = await prisma.propertyMedia.findMany({
        where: { propertyId },
        select: { position: true }
      });
      const nextPosition =
        payload.position ?? (existing.length ? Math.max(...existing.map((m) => m.position)) + 1 : 0);

      const media = await prisma.propertyMedia.create({
        data: {
          propertyId,
          kind: payload.kind,
          url: payload.url,
          cloudflareMediaId: payload.cloudflareMediaId ?? undefined,
          position: nextPosition,
          metadata: (payload.metadata ?? undefined) as Prisma.InputJsonValue | undefined
        }
      });
      return media;
    } catch {
      // fallback below
    }
  }

  const store = getMemoryStore();
  const property = store.find((item) => item.id === propertyId);
  if (!property) return null;

  const nextPosition =
    payload.position ?? (property.media.length ? Math.max(...property.media.map((m) => m.position)) + 1 : 0);

  const media: MemoryMedia = {
    id: `mem-media-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    propertyId,
    kind: payload.kind,
    status: "PRONTO",
    cloudflareMediaId: payload.cloudflareMediaId ?? null,
    url: payload.url,
    variant: null,
    position: nextPosition,
    metadata: payload.metadata ?? null,
    createdAt: new Date()
  };

  property.media.push(media);
  property.media.sort((a, b) => a.position - b.position);
  property.updatedAt = new Date();
  return media;
}

export async function reorderPropertyMedia(propertyId: string, mediaId: string, position: number) {
  if (hasDatabase) {
    try {
      const updated = await prisma.propertyMedia.update({
        where: { id: mediaId },
        data: { position }
      });
      return updated;
    } catch {
      // fallback below
    }
  }

  const store = getMemoryStore();
  const property = store.find((item) => item.id === propertyId);
  if (!property) return null;
  const media = property.media.find((item) => item.id === mediaId);
  if (!media) return null;
  media.position = position;
  property.media.sort((a, b) => a.position - b.position);
  property.updatedAt = new Date();
  return media;
}

export async function makePropertyMediaPrimary(propertyId: string, mediaId: string) {
  if (hasDatabase) {
    try {
      const all = await prisma.propertyMedia.findMany({
        where: { propertyId },
        orderBy: { position: "asc" }
      });
      const target = all.find((item) => item.id === mediaId);
      if (!target) return null;

      const reordered = [target, ...all.filter((item) => item.id !== mediaId)];
      await prisma.$transaction(
        reordered.map((item, index) =>
          prisma.propertyMedia.update({
            where: { id: item.id },
            data: { position: index }
          })
        )
      );
      return target;
    } catch {
      // fallback below
    }
  }

  const store = getMemoryStore();
  const property = store.find((item) => item.id === propertyId);
  if (!property) return null;
  const target = property.media.find((item) => item.id === mediaId);
  if (!target) return null;
  property.media = [target, ...property.media.filter((item) => item.id !== mediaId)];
  property.media.forEach((item, index) => {
    item.position = index;
  });
  property.updatedAt = new Date();
  return target;
}

export async function deletePropertyMedia(propertyId: string, mediaId: string) {
  if (hasDatabase) {
    try {
      await prisma.propertyMedia.delete({ where: { id: mediaId } });
      return true;
    } catch {
      // fallback below
    }
  }

  const store = getMemoryStore();
  const property = store.find((item) => item.id === propertyId);
  if (!property) return false;
  const before = property.media.length;
  property.media = property.media.filter((item) => item.id !== mediaId);
  property.media.forEach((item, index) => {
    item.position = index;
  });
  property.updatedAt = new Date();
  return property.media.length < before;
}

export async function deleteCrmProperty(id: string) {
  if (hasDatabase) {
    try {
      await prisma.property.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  const store = getMemoryStore();
  const before = store.length;
  const next = store.filter((item) => item.id !== id);
  if (next.length === before) return false;
  store.length = 0;
  store.push(...next);
  return true;
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
