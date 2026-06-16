import {
  CaptureSourceKind,
  CapturedListingStatus,
  LeadIntent,
  LeadSource,
  Prisma,
  PropertyPurpose,
  PropertyStatus,
  TaskPriority,
  type PropertyType
} from "@prisma/client";
import type { z } from "zod";
import { slugify } from "@/lib/crm/slug";
import { createCrmProperty } from "@/lib/data/crm-properties";
import { prisma } from "@/lib/prisma";
import type { crmCreateCapturedListingSchema, crmCreateCaptureAlertSchema } from "@/lib/validation/schemas";

const hasDatabase = Boolean(process.env.DATABASE_URL);

const captureInclude = {
  source: true,
  assignedTo: { select: { id: true, name: true } },
  linkedOwner: { select: { id: true, name: true, phone: true } },
  linkedProperty: { select: { id: true, title: true, slug: true } },
  linkedLead: { select: { id: true, name: true } }
} satisfies Prisma.CapturedListingInclude;

type DbCapturedListing = Prisma.CapturedListingGetPayload<{ include: typeof captureInclude }>;
type CapturedListingInput = z.infer<typeof crmCreateCapturedListingSchema>;
type CaptureAlertInput = z.infer<typeof crmCreateCaptureAlertSchema>;

type DbCaptureAlert = Prisma.CaptureAlertGetPayload<object>;

export type CaptureListingItem = {
  id: string;
  status: CapturedListingStatus;
  title: string;
  description: string | null;
  sourceName: string | null;
  sourceKind: CaptureSourceKind | null;
  externalId: string | null;
  sourceUrl: string | null;
  purpose: PropertyPurpose;
  type: PropertyType;
  price: number;
  address: string | null;
  city: string;
  district: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  areaM2: number | null;
  landAreaM2: number | null;
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  advertiserName: string | null;
  advertiserPhone: string | null;
  advertiserEmail: string | null;
  isPrivateSeller: boolean;
  hasFullAddress: boolean;
  adAgeDays: number | null;
  firstSeenAt: string;
  lastSeenAt: string;
  marketAvgPrice: number | null;
  marketAvgPriceM2: number | null;
  marketOpportunity: number | null;
  opportunityScore: number;
  notes: string | null;
  capturedAt: string | null;
  discardedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignedToName: string | null;
  linkedOwnerId: string | null;
  linkedOwnerName: string | null;
  linkedPropertyId: string | null;
  linkedPropertyTitle: string | null;
  linkedPropertySlug: string | null;
  linkedLeadId: string | null;
  linkedLeadName: string | null;
  thumbnailUrl: string | null;
};

export type CaptureAlertItem = {
  id: string;
  name: string;
  provider: string;
  searchUrl: string | null;
  city: string;
  district: string | null;
  purpose: PropertyPurpose | null;
  type: PropertyType | null;
  priceMin: number | null;
  priceMax: number | null;
  onlyPrivateSeller: boolean;
  onlyFullAddress: boolean;
  maxResultsPerRun: number;
  active: boolean;
  lastRunAt: string | null;
  lastRunStatus: string | null;
  lastRunMessage: string | null;
  lastRunImportedCount: number;
  lastRunFoundCount: number;
  lastRunFailedCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CaptureAlertRunResult = {
  alert: CaptureAlertItem;
  listings: CaptureListingItem[];
  foundCount: number;
  importedCount: number;
  skippedCount: number;
  failedCount: number;
  errors: string[];
};

declare global {
  var crmCapturedListingsMemory: CaptureListingItem[] | undefined;
  var crmCaptureAlertsMemory: CaptureAlertItem[] | undefined;
}

function optionalString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

function optionalNumber(input?: number | string | null) {
  if (input === undefined) return undefined;
  if (input === null || Number.isNaN(input)) return null;
  if (typeof input === "string" && input.trim() === "") return null;
  return Number(input);
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
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

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function computeOpportunityScore(input: {
  price: number;
  marketAvgPrice?: number | null;
  isPrivateSeller?: boolean;
  hasFullAddress?: boolean;
  advertiserPhone?: string | null;
  sourceUrl?: string | null;
  adAgeDays?: number | null;
}) {
  let score = 30;
  if (input.isPrivateSeller) score += 24;
  if (input.hasFullAddress) score += 14;
  if (optionalString(input.advertiserPhone)) score += 14;
  if (optionalString(input.sourceUrl)) score += 6;
  if (input.adAgeDays !== null && input.adAgeDays !== undefined) {
    if (input.adAgeDays <= 7) score += 8;
    else if (input.adAgeDays <= 30) score += 4;
  }
  if (input.marketAvgPrice && input.marketAvgPrice > input.price) {
    const discountPct = ((input.marketAvgPrice - input.price) / input.marketAvgPrice) * 100;
    score += Math.min(18, discountPct);
  }
  return clampScore(score);
}

function buildMarketOpportunity(input: { price: number; marketAvgPrice?: number | null }) {
  if (!input.marketAvgPrice) return null;
  return input.marketAvgPrice - input.price;
}

function normalizeRawPayload(input: unknown): Prisma.InputJsonValue | undefined {
  if (input === undefined || input === null || input === "") return undefined;

  try {
    return JSON.parse(JSON.stringify(input)) as Prisma.InputJsonValue;
  } catch {
    return { value: String(input).slice(0, 5000) };
  }
}

function isPublicImageUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function extractThumbnailUrl(value: unknown, depth = 0, allowString = false): string | null {
  if (depth > 6 || value === null || value === undefined) return null;
  if (allowString && isPublicImageUrl(value)) return String(value).trim();

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractThumbnailUrl(item, depth + 1, false);
      if (found) return found;
    }
    return null;
  }

  if (typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const preferredKeys = [
    "thumbnailUrl",
    "imageUrl",
    "photoUrl",
    "coverUrl",
    "mainImage",
    "ogImage",
    "src",
    "url"
  ];

  for (const key of preferredKeys) {
    const found = extractThumbnailUrl(record[key], depth + 1, true);
    if (found) return found;
  }

  for (const key of ["media", "images", "photos", "pictures", "gallery", "raw"]) {
    const found = extractThumbnailUrl(record[key], depth + 1, false);
    if (found) return found;
  }

  return null;
}

function formatSourceName(input?: string | null) {
  return optionalString(input) ?? "Manual";
}

function normalizeDbListing(listing: DbCapturedListing): CaptureListingItem {
  return {
    id: listing.id,
    status: listing.status,
    title: listing.title,
    description: listing.description,
    sourceName: listing.sourceName ?? listing.source?.name ?? null,
    sourceKind: listing.source?.kind ?? null,
    externalId: listing.externalId,
    sourceUrl: listing.sourceUrl,
    purpose: listing.purpose,
    type: listing.type,
    price: Number(listing.price),
    address: listing.address,
    city: listing.city,
    district: listing.district,
    postalCode: listing.postalCode,
    latitude: toNumber(listing.latitude),
    longitude: toNumber(listing.longitude),
    areaM2: toNumber(listing.areaM2),
    landAreaM2: toNumber(listing.landAreaM2),
    bedrooms: listing.bedrooms,
    suites: listing.suites,
    bathrooms: listing.bathrooms,
    parkingSpaces: listing.parkingSpaces,
    advertiserName: listing.advertiserName,
    advertiserPhone: listing.advertiserPhone,
    advertiserEmail: listing.advertiserEmail,
    isPrivateSeller: listing.isPrivateSeller,
    hasFullAddress: listing.hasFullAddress,
    adAgeDays: listing.adAgeDays,
    firstSeenAt: listing.firstSeenAt.toISOString(),
    lastSeenAt: listing.lastSeenAt.toISOString(),
    marketAvgPrice: toNumber(listing.marketAvgPrice),
    marketAvgPriceM2: toNumber(listing.marketAvgPriceM2),
    marketOpportunity: toNumber(listing.marketOpportunity),
    opportunityScore: listing.opportunityScore,
    notes: listing.notes,
    capturedAt: listing.capturedAt?.toISOString() ?? null,
    discardedAt: listing.discardedAt?.toISOString() ?? null,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
    assignedToName: listing.assignedTo?.name ?? null,
    linkedOwnerId: listing.linkedOwnerId,
    linkedOwnerName: listing.linkedOwner?.name ?? null,
    linkedPropertyId: listing.linkedPropertyId,
    linkedPropertyTitle: listing.linkedProperty?.title ?? null,
    linkedPropertySlug: listing.linkedProperty?.slug ?? null,
    linkedLeadId: listing.linkedLeadId,
    linkedLeadName: listing.linkedLead?.name ?? null,
    thumbnailUrl: extractThumbnailUrl(listing.rawPayload)
  };
}

export function normalizeCaptureAlert(alert: DbCaptureAlert): CaptureAlertItem {
  return {
    id: alert.id,
    name: alert.name,
    provider: alert.provider,
    searchUrl: alert.searchUrl,
    city: alert.city,
    district: alert.district,
    purpose: alert.purpose,
    type: alert.type,
    priceMin: toNumber(alert.priceMin),
    priceMax: toNumber(alert.priceMax),
    onlyPrivateSeller: alert.onlyPrivateSeller,
    onlyFullAddress: alert.onlyFullAddress,
    maxResultsPerRun: alert.maxResultsPerRun,
    active: alert.active,
    lastRunAt: alert.lastRunAt?.toISOString() ?? null,
    lastRunStatus: alert.lastRunStatus,
    lastRunMessage: alert.lastRunMessage,
    lastRunImportedCount: alert.lastRunImportedCount,
    lastRunFoundCount: alert.lastRunFoundCount,
    lastRunFailedCount: alert.lastRunFailedCount,
    createdAt: alert.createdAt.toISOString(),
    updatedAt: alert.updatedAt.toISOString()
  };
}

function demoListings(): CaptureListingItem[] {
  const now = new Date();
  return [
    {
      id: "demo-capture-1",
      status: CapturedListingStatus.NOVO,
      title: "Casa térrea no Plano Diretor Sul",
      description: "Anúncio externo para abordagem de proprietário. Revisar contato e documentação antes de publicar.",
      sourceName: "Manual",
      sourceKind: CaptureSourceKind.MANUAL,
      externalId: null,
      sourceUrl: null,
      purpose: PropertyPurpose.VENDA,
      type: "CASA",
      price: 520000,
      address: "Endereço a confirmar",
      city: "Palmas",
      district: "Plano Diretor Sul",
      postalCode: null,
      latitude: null,
      longitude: null,
      areaM2: 145,
      landAreaM2: 300,
      bedrooms: 3,
      suites: 1,
      bathrooms: 2,
      parkingSpaces: 2,
      advertiserName: "Proprietário direto",
      advertiserPhone: "",
      advertiserEmail: null,
      isPrivateSeller: true,
      hasFullAddress: false,
      adAgeDays: 4,
      firstSeenAt: now.toISOString(),
      lastSeenAt: now.toISOString(),
      marketAvgPrice: 590000,
      marketAvgPriceM2: 4100,
      marketOpportunity: 70000,
      opportunityScore: 82,
      notes: "Exemplo local. Cadastre uma oportunidade real para persistir no banco.",
      capturedAt: null,
      discardedAt: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      assignedToName: null,
      linkedOwnerId: null,
      linkedOwnerName: null,
      linkedPropertyId: null,
      linkedPropertyTitle: null,
      linkedPropertySlug: null,
      linkedLeadId: null,
      linkedLeadName: null,
      thumbnailUrl: null
    }
  ];
}

function getMemoryStore() {
  if (!globalThis.crmCapturedListingsMemory) {
    globalThis.crmCapturedListingsMemory = demoListings();
  }
  return globalThis.crmCapturedListingsMemory;
}

function getAlertMemoryStore() {
  if (!globalThis.crmCaptureAlertsMemory) {
    globalThis.crmCaptureAlertsMemory = [];
  }
  return globalThis.crmCaptureAlertsMemory;
}

function normalizeInput(payload: CapturedListingInput) {
  const sourceName = formatSourceName(payload.sourceName);
  const price = Number(payload.price);
  const marketAvgPrice = optionalNumber(payload.marketAvgPrice) ?? null;
  const marketOpportunity = buildMarketOpportunity({ price, marketAvgPrice });
  const opportunityScore = computeOpportunityScore({
    price,
    marketAvgPrice,
    isPrivateSeller: payload.isPrivateSeller,
    hasFullAddress: payload.hasFullAddress,
    advertiserPhone: payload.advertiserPhone,
    sourceUrl: payload.sourceUrl,
    adAgeDays: payload.adAgeDays
  });

  return {
    sourceName,
    sourceKind: payload.sourceKind ?? CaptureSourceKind.MANUAL,
    externalId: optionalString(payload.externalId) ?? null,
    sourceUrl: optionalString(payload.sourceUrl) ?? null,
    title: payload.title.trim(),
    description: optionalString(payload.description) ?? null,
    purpose: payload.purpose,
    type: payload.type,
    price,
    address: optionalString(payload.address) ?? null,
    city: payload.city.trim(),
    district: payload.district.trim(),
    postalCode: optionalString(payload.postalCode) ?? null,
    latitude: optionalNumber(payload.latitude) ?? null,
    longitude: optionalNumber(payload.longitude) ?? null,
    areaM2: optionalNumber(payload.areaM2) ?? null,
    landAreaM2: optionalNumber(payload.landAreaM2) ?? null,
    bedrooms: payload.bedrooms ?? null,
    suites: payload.suites ?? null,
    bathrooms: payload.bathrooms ?? null,
    parkingSpaces: payload.parkingSpaces ?? null,
    advertiserName: optionalString(payload.advertiserName) ?? null,
    advertiserPhone: optionalString(payload.advertiserPhone) ?? null,
    advertiserEmail: optionalString(payload.advertiserEmail) ?? null,
    isPrivateSeller: payload.isPrivateSeller ?? false,
    hasFullAddress: payload.hasFullAddress ?? Boolean(optionalString(payload.address)),
    adAgeDays: payload.adAgeDays ?? null,
    marketAvgPrice,
    marketAvgPriceM2: optionalNumber(payload.marketAvgPriceM2) ?? null,
    marketOpportunity,
    opportunityScore,
    rawPayload: normalizeRawPayload(payload.rawPayload),
    notes: optionalString(payload.notes) ?? null
  };
}

function normalizeAlertInput(payload: CaptureAlertInput) {
  return {
    name: payload.name.trim(),
    provider: payload.provider ?? "olx",
    searchUrl: optionalString(payload.searchUrl) ?? null,
    city: payload.city.trim(),
    district: optionalString(payload.district) ?? null,
    purpose: payload.purpose || null,
    type: payload.type || null,
    priceMin: optionalNumber(payload.priceMin) ?? null,
    priceMax: optionalNumber(payload.priceMax) ?? null,
    onlyPrivateSeller: payload.onlyPrivateSeller ?? false,
    onlyFullAddress: payload.onlyFullAddress ?? false,
    maxResultsPerRun: Math.max(1, Math.min(30, payload.maxResultsPerRun ?? 8)),
    active: payload.active ?? true
  };
}

async function createCaptureAuditLog(input: {
  action: string;
  resourceId: string;
  actorId?: string | null;
  payload: unknown;
}) {
  if (!hasDatabase) return;
  await prisma.auditLog
    .create({
      data: {
        action: input.action,
        resource: "CapturedListing",
        resourceId: input.resourceId,
        actorId: input.actorId ?? undefined,
        metadata: input.payload as Prisma.InputJsonValue
      }
    })
    .catch(() => null);
}

export async function listCapturedListings() {
  if (!hasDatabase) {
    return getMemoryStore();
  }

  try {
    const listings = await prisma.capturedListing.findMany({
      orderBy: [{ status: "asc" }, { opportunityScore: "desc" }, { updatedAt: "desc" }],
      include: captureInclude
    });
    return listings.map(normalizeDbListing);
  } catch {
    return getMemoryStore();
  }
}

export async function listCaptureAlerts() {
  if (!hasDatabase) return getAlertMemoryStore();

  try {
    const alerts = await prisma.captureAlert.findMany({
      orderBy: [{ active: "desc" }, { lastRunAt: "asc" }, { createdAt: "desc" }]
    });
    return alerts.map(normalizeCaptureAlert);
  } catch {
    return getAlertMemoryStore();
  }
}

export async function createCaptureAlert(payload: CaptureAlertInput, actorId?: string | null) {
  const normalized = normalizeAlertInput(payload);

  if (!hasDatabase) {
    const now = new Date().toISOString();
    const alert: CaptureAlertItem = {
      id: `mem-alert-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      ...normalized,
      lastRunAt: null,
      lastRunStatus: null,
      lastRunMessage: null,
      lastRunImportedCount: 0,
      lastRunFoundCount: 0,
      lastRunFailedCount: 0,
      createdAt: now,
      updatedAt: now
    };
    getAlertMemoryStore().unshift(alert);
    return alert;
  }

  const alert = await prisma.captureAlert.create({
    data: {
      ...normalized,
      ownerUserId: actorId ?? undefined
    }
  });

  await prisma.auditLog
    .create({
      data: {
        action: "CAPTURE_ALERT_CREATED",
        resource: "CaptureAlert",
        resourceId: alert.id,
        actorId: actorId ?? undefined,
        metadata: normalized as Prisma.InputJsonValue
      }
    })
    .catch(() => null);

  return normalizeCaptureAlert(alert);
}

export async function deleteCaptureAlert(alertId: string, actorId?: string | null) {
  if (!hasDatabase) {
    const store = getAlertMemoryStore();
    const index = store.findIndex((item) => item.id === alertId);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  }

  const current = await prisma.captureAlert.findUnique({ where: { id: alertId } });
  if (!current) return false;

  await prisma.$transaction([
    prisma.auditLog.create({
      data: {
        action: "CAPTURE_ALERT_DELETED",
        resource: "CaptureAlert",
        resourceId: alertId,
        actorId: actorId ?? undefined,
        metadata: {
          name: current.name,
          provider: current.provider,
          searchUrl: current.searchUrl,
          active: current.active
        } as Prisma.InputJsonValue
      }
    }),
    prisma.captureAlert.delete({ where: { id: alertId } })
  ]);

  return true;
}

export async function createCapturedListing(payload: CapturedListingInput, actorId?: string | null) {
  const normalized = normalizeInput(payload);

  if (!hasDatabase) {
    const now = new Date().toISOString();
    const listing: CaptureListingItem = {
      id: `mem-capture-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      status: CapturedListingStatus.NOVO,
      ...normalized,
      sourceKind: normalized.sourceKind,
      firstSeenAt: now,
      lastSeenAt: now,
      capturedAt: null,
      discardedAt: null,
      createdAt: now,
      updatedAt: now,
      assignedToName: null,
      linkedOwnerId: null,
      linkedOwnerName: null,
      linkedPropertyId: null,
      linkedPropertyTitle: null,
      linkedPropertySlug: null,
      linkedLeadId: null,
      linkedLeadName: null,
      thumbnailUrl: extractThumbnailUrl(normalized.rawPayload)
    };
    getMemoryStore().unshift(listing);
    return listing;
  }

  const source = await prisma.captureSource.upsert({
    where: { name: normalized.sourceName },
    update: { kind: normalized.sourceKind, active: true },
    create: { name: normalized.sourceName, kind: normalized.sourceKind }
  });

  const data = {
    sourceId: source.id,
    sourceName: normalized.sourceName,
    externalId: normalized.externalId,
    sourceUrl: normalized.sourceUrl,
    title: normalized.title,
    description: normalized.description,
    purpose: normalized.purpose,
    type: normalized.type,
    price: normalized.price,
    address: normalized.address,
    city: normalized.city,
    district: normalized.district,
    postalCode: normalized.postalCode,
    latitude: normalized.latitude,
    longitude: normalized.longitude,
    areaM2: normalized.areaM2,
    landAreaM2: normalized.landAreaM2,
    bedrooms: normalized.bedrooms,
    suites: normalized.suites,
    bathrooms: normalized.bathrooms,
    parkingSpaces: normalized.parkingSpaces,
    advertiserName: normalized.advertiserName,
    advertiserPhone: normalized.advertiserPhone,
    advertiserEmail: normalized.advertiserEmail,
    isPrivateSeller: normalized.isPrivateSeller,
    hasFullAddress: normalized.hasFullAddress,
    adAgeDays: normalized.adAgeDays,
    marketAvgPrice: normalized.marketAvgPrice,
    marketAvgPriceM2: normalized.marketAvgPriceM2,
    marketOpportunity: normalized.marketOpportunity,
    opportunityScore: normalized.opportunityScore,
    rawPayload: normalized.rawPayload,
    notes: normalized.notes,
    assignedToId: actorId ?? undefined
  };

  const existing = normalized.sourceUrl
    ? await prisma.capturedListing.findUnique({ where: { sourceUrl: normalized.sourceUrl } })
    : null;

  const listing = existing
    ? await prisma.capturedListing.update({
        where: { id: existing.id },
        data: { ...data, status: CapturedListingStatus.NOVO, lastSeenAt: new Date() },
        include: captureInclude
      })
    : await prisma.capturedListing.create({
        data,
        include: captureInclude
      });

  await createCaptureAuditLog({
    action: existing ? "CAPTURE_LISTING_UPDATED" : "CAPTURE_LISTING_CREATED",
    resourceId: listing.id,
    actorId,
    payload: normalized
  });

  return normalizeDbListing(listing);
}

export async function deleteCapturedListing(listingId: string, actorId?: string | null) {
  if (!hasDatabase) {
    const store = getMemoryStore();
    const index = store.findIndex((item) => item.id === listingId);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  }

  const current = await prisma.capturedListing.findUnique({ where: { id: listingId } });
  if (!current) return false;

  await prisma.$transaction([
    prisma.auditLog.create({
      data: {
        action: "CAPTURE_LISTING_DELETED",
        resource: "CapturedListing",
        resourceId: listingId,
        actorId: actorId ?? undefined,
        metadata: {
          title: current.title,
          status: current.status,
          sourceName: current.sourceName,
          sourceUrl: current.sourceUrl,
          linkedPropertyId: current.linkedPropertyId,
          linkedLeadId: current.linkedLeadId,
          linkedOwnerId: current.linkedOwnerId
        } as Prisma.InputJsonValue
      }
    }),
    prisma.capturedListing.delete({ where: { id: listingId } })
  ]);

  return true;
}

export async function captureListing(listingId: string, actorId?: string | null) {
  if (!hasDatabase) {
    const store = getMemoryStore();
    const listing = store.find((item) => item.id === listingId);
    if (!listing) throw new Error("Oportunidade de captação não encontrada.");
    const property = await createCrmProperty({
      title: listing.title,
      slug: `${slugify(listing.title)}-${listing.id.slice(-5)}`,
      type: listing.type,
      purpose: listing.purpose,
      status: PropertyStatus.EM_ANALISE,
      price: listing.price,
      city: listing.city,
      district: listing.district,
      address: listing.address,
      latitude: listing.latitude,
      longitude: listing.longitude,
      areaM2: listing.areaM2,
      landAreaM2: listing.landAreaM2,
      bedrooms: listing.bedrooms,
      suites: listing.suites,
      bathrooms: listing.bathrooms,
      parkingSpaces: listing.parkingSpaces,
      description: listing.description ?? "Imóvel criado a partir de oportunidade de captação.",
      features: [],
      marketAskingValue: listing.price,
      marketEstimatedValue: listing.marketAvgPrice,
      marketOpportunity: listing.marketOpportunity,
      marketComparableLinks: listing.sourceUrl ? [listing.sourceUrl] : [],
      internalNotes: `Origem: ${listing.sourceName ?? "Manual"}. Score: ${listing.opportunityScore}.`
    });
    listing.status = CapturedListingStatus.CAPTADO;
    listing.capturedAt = new Date().toISOString();
    listing.updatedAt = listing.capturedAt;
    listing.linkedPropertyId = property.id;
    listing.linkedPropertyTitle = property.title;
    listing.linkedPropertySlug = property.slug;
    return listing;
  }

  const listing = await prisma.capturedListing.findUnique({ where: { id: listingId } });
  if (!listing) throw new Error("Oportunidade de captação não encontrada.");
  if (listing.status === CapturedListingStatus.CAPTADO && listing.linkedPropertyId) {
    const current = await prisma.capturedListing.findUnique({ where: { id: listingId }, include: captureInclude });
    if (current) return normalizeDbListing(current);
  }

  const slug = `${slugify(listing.title)}-${listing.id.slice(-6)}`;
  const advertiserPhone = optionalString(listing.advertiserPhone);
  const advertiserName = optionalString(listing.advertiserName) ?? "Proprietário do anúncio";
  const sourceLabel = listing.sourceName ?? "Manual";
  const sourceLines = [
    `Origem da captação: ${sourceLabel}`,
    listing.sourceUrl ? `URL do anúncio: ${listing.sourceUrl}` : null,
    `Score de oportunidade: ${listing.opportunityScore}/100`,
    listing.isPrivateSeller ? "Classificado como anúncio particular." : null,
    listing.hasFullAddress ? "Endereço completo informado." : "Endereço incompleto ou a confirmar."
  ].filter(Boolean);

  const updated = await prisma.$transaction(async (tx) => {
    const existingOwner = advertiserPhone
      ? await tx.owner.findFirst({ where: { phone: advertiserPhone } })
      : null;
    const owner = advertiserPhone
      ? existingOwner
        ? await tx.owner.update({
            where: { id: existingOwner.id },
            data: {
              name: advertiserName,
              city: listing.city,
              district: listing.district,
              address: listing.address,
              notes: listing.notes ?? undefined
            }
          })
        : await tx.owner.create({
            data: {
              name: advertiserName,
              phone: advertiserPhone,
              email: optionalString(listing.advertiserEmail),
              city: listing.city,
              district: listing.district,
              address: listing.address,
              notes: listing.notes
            }
          })
      : null;

    const property = await tx.property.create({
      data: {
        slug,
        title: listing.title,
        type: listing.type,
        purpose: listing.purpose,
        status: PropertyStatus.EM_ANALISE,
        price: listing.price,
        address: listing.address,
        city: listing.city,
        district: listing.district,
        postalCode: listing.postalCode,
        latitude: listing.latitude,
        longitude: listing.longitude,
        areaM2: listing.areaM2,
        landAreaM2: listing.landAreaM2,
        bedrooms: listing.bedrooms,
        suites: listing.suites,
        bathrooms: listing.bathrooms,
        parkingSpaces: listing.parkingSpaces,
        description:
          listing.description ??
          "Imóvel criado a partir de oportunidade de captação. Revise as informações antes de publicar.",
        features: [],
        marketAskingValue: listing.price,
        marketEstimatedValue: listing.marketAvgPrice ?? undefined,
        marketOpportunity: listing.marketOpportunity ?? undefined,
        marketComparableLinks: listing.sourceUrl ? [listing.sourceUrl] : [],
        marketLiquidityNotes:
          listing.marketAvgPrice || listing.marketAvgPriceM2
            ? `Média observada: ${listing.marketAvgPrice ?? "n/i"}; média m²: ${listing.marketAvgPriceM2 ?? "n/i"}.`
            : undefined,
        internalNotes: sourceLines.join("\n"),
        ownerId: owner?.id
      }
    });

    const lead = advertiserPhone
      ? await tx.lead.create({
          data: {
            name: advertiserName,
            phone: advertiserPhone,
            email: optionalString(listing.advertiserEmail) ?? undefined,
            source: listing.sourceUrl ? LeadSource.PORTAL : LeadSource.OUTRO,
            intent: LeadIntent.VENDER,
            desiredType: listing.type,
            desiredPurpose: listing.purpose,
            desiredCity: listing.city,
            desiredDistrict: listing.district,
            notes: sourceLines.join("\n"),
            ownerUserId: actorId ?? undefined,
            linkedOwnerId: owner?.id,
            linkedPropertyId: property.id
          }
        })
      : null;

    await tx.task.create({
      data: {
        title: `Abordar proprietário - ${listing.title}`,
        description: advertiserPhone
          ? `Entrar em contato com ${advertiserName} sobre a captação. ${sourceLines.join(" ")}`
          : `Encontrar contato do proprietário e validar dados do anúncio. ${sourceLines.join(" ")}`,
        priority: listing.opportunityScore >= 70 ? TaskPriority.ALTA : TaskPriority.MEDIA,
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        assignedToId: actorId ?? undefined,
        leadId: lead?.id,
        propertyId: property.id
      }
    });

    await tx.auditLog.create({
      data: {
        action: "CAPTURE_LISTING_CAPTURED",
        resource: "CapturedListing",
        resourceId: listing.id,
        actorId: actorId ?? undefined,
        metadata: {
          propertyId: property.id,
          ownerId: owner?.id ?? null,
          leadId: lead?.id ?? null,
          sourceUrl: listing.sourceUrl
        } as Prisma.InputJsonValue
      }
    });

    return tx.capturedListing.update({
      where: { id: listing.id },
      data: {
        status: CapturedListingStatus.CAPTADO,
        capturedAt: new Date(),
        assignedToId: actorId ?? undefined,
        linkedOwnerId: owner?.id,
        linkedPropertyId: property.id,
        linkedLeadId: lead?.id
      },
      include: captureInclude
    });
  });

  return normalizeDbListing(updated);
}

export async function discardCapturedListing(listingId: string, reason?: string | null, actorId?: string | null) {
  const normalizedReason = optionalString(reason);

  if (!hasDatabase) {
    const listing = getMemoryStore().find((item) => item.id === listingId);
    if (!listing) throw new Error("Oportunidade de captação não encontrada.");
    listing.status = CapturedListingStatus.DESCARTADO;
    listing.discardedAt = new Date().toISOString();
    listing.updatedAt = listing.discardedAt;
    listing.notes = [listing.notes, normalizedReason ? `Descartado: ${normalizedReason}` : null].filter(Boolean).join("\n");
    return listing;
  }

  const updated = await prisma.capturedListing.update({
    where: { id: listingId },
    data: {
      status: CapturedListingStatus.DESCARTADO,
      discardedAt: new Date(),
      assignedToId: actorId ?? undefined,
      notes: normalizedReason
        ? {
            set: `Descartado: ${normalizedReason}`
          }
        : undefined
    },
    include: captureInclude
  });

  await createCaptureAuditLog({
    action: "CAPTURE_LISTING_DISCARDED",
    resourceId: listingId,
    actorId,
    payload: { reason: normalizedReason }
  });

  return normalizeDbListing(updated);
}
