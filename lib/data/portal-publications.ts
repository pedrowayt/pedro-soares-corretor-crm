import {
  LeadSource,
  PortalPublicationStatus,
  Prisma,
  PropertyStatus
} from "@prisma/client";
import {
  MARKETPLACE_PORTALS,
  getMarketplaceFeedUrl,
  getMarketplacePortalLabel,
  isMarketplacePortalId,
  type MarketplacePortalId
} from "@/lib/integrations/marketplace-portals";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

const hasDatabase = Boolean(process.env.DATABASE_URL);

const EXPORTABLE_PUBLICATION_STATUSES = [
  PortalPublicationStatus.PENDENTE,
  PortalPublicationStatus.PUBLICADO
] as const;

type MaybeDecimal = number | string | Prisma.Decimal | null | undefined;

type ChecklistProperty = {
  title?: string | null;
  type?: string | null;
  purpose?: string | null;
  status?: string | null;
  price?: MaybeDecimal;
  city?: string | null;
  district?: string | null;
  description?: string | null;
  media?: ReadonlyArray<{ url: string | null }>;
};

export type PortalPublicationInput = {
  portalName: MarketplacePortalId;
  enabled: boolean;
  status?: PortalPublicationStatus;
  customTitle?: string | null;
  customDescription?: string | null;
  customPrice?: number | null;
  showFullAddress?: boolean;
  showPrice?: boolean;
  highlightEnabled?: boolean;
  highlightType?: string | null;
};

export type PublicationChecklistItem = {
  key: string;
  label: string;
  ok: boolean;
  blocking: boolean;
};

export type PublicationChecklist = {
  ready: boolean;
  percent: number;
  items: PublicationChecklistItem[];
  blockingIssues: PublicationChecklistItem[];
  warnings: PublicationChecklistItem[];
};

export type PortalPublicationUiState = {
  portalName: MarketplacePortalId;
  portalLabel: string;
  type: string;
  description: string;
  feedUrl: string;
  enabled: boolean;
  status: PortalPublicationStatus;
  externalId: string | null;
  customTitle: string | null;
  customDescription: string | null;
  customPrice: number | null;
  showFullAddress: boolean;
  showPrice: boolean;
  highlightEnabled: boolean;
  highlightType: string | null;
  publishedAt: string | null;
  lastSyncAt: string | null;
  removedAt: string | null;
  errorMessage: string | null;
};

export type PortalFeedProperty = {
  publicationId: string;
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  purpose: string;
  price: number;
  city: string;
  district: string;
  address: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  areaM2: number | null;
  landAreaM2: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  suites: number | null;
  parkingSpaces: number | null;
  features: string[];
  media: Array<{ url: string }>;
  updatedAt: Date;
  showFullAddress: boolean;
  showPrice: boolean;
  highlightEnabled: boolean;
  highlightType: string | null;
};

function optionalString(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toNumber(value: MaybeDecimal) {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function statusForEnabled(input?: PortalPublicationStatus) {
  if (!input || input === PortalPublicationStatus.REMOVIDO) return PortalPublicationStatus.PENDENTE;
  return input;
}

export function getPublicationChecklist(property: ChecklistProperty): PublicationChecklist {
  const price = toNumber(property.price) ?? 0;
  const mediaCount = property.media?.filter((item) => Boolean(item.url)).length ?? 0;
  const items: PublicationChecklistItem[] = [
    {
      key: "status",
      label: "Imóvel disponível",
      ok: property.status === PropertyStatus.DISPONIVEL,
      blocking: true
    },
    {
      key: "title",
      label: "Título preenchido",
      ok: Boolean(property.title?.trim()),
      blocking: true
    },
    {
      key: "type",
      label: "Tipo do imóvel",
      ok: Boolean(property.type),
      blocking: true
    },
    {
      key: "purpose",
      label: "Finalidade informada",
      ok: Boolean(property.purpose),
      blocking: true
    },
    {
      key: "price",
      label: "Preço informado",
      ok: price > 0,
      blocking: true
    },
    {
      key: "city",
      label: "Cidade informada",
      ok: Boolean(property.city?.trim()),
      blocking: true
    },
    {
      key: "district",
      label: "Bairro informado",
      ok: Boolean(property.district?.trim()),
      blocking: true
    },
    {
      key: "description",
      label: "Descrição com pelo menos 12 caracteres",
      ok: (property.description?.trim().length ?? 0) >= 12,
      blocking: true
    },
    {
      key: "photos",
      label: "Pelo menos uma foto pública",
      ok: mediaCount > 0,
      blocking: true
    },
    {
      key: "photo-volume",
      label: "Cinco ou mais fotos recomendadas",
      ok: mediaCount >= 5,
      blocking: false
    }
  ];

  const blockingIssues = items.filter((item) => item.blocking && !item.ok);
  const warnings = items.filter((item) => !item.blocking && !item.ok);
  const completed = items.filter((item) => item.ok).length;

  return {
    ready: blockingIssues.length === 0,
    percent: Math.round((completed / items.length) * 100),
    items,
    blockingIssues,
    warnings
  };
}

function defaultPortalState(portal: (typeof MARKETPLACE_PORTALS)[number], siteUrl: string): PortalPublicationUiState {
  return {
    portalName: portal.id,
    portalLabel: portal.label,
    type: portal.type,
    description: portal.description,
    feedUrl: getMarketplaceFeedUrl(siteUrl, portal.id),
    enabled: false,
    status: PortalPublicationStatus.PENDENTE,
    externalId: null,
    customTitle: null,
    customDescription: null,
    customPrice: null,
    showFullAddress: false,
    showPrice: true,
    highlightEnabled: false,
    highlightType: null,
    publishedAt: null,
    lastSyncAt: null,
    removedAt: null,
    errorMessage: null
  };
}

function mapPublicationState(
  portal: (typeof MARKETPLACE_PORTALS)[number],
  publication:
    | {
        portalName: string;
        externalId: string | null;
        status: PortalPublicationStatus;
        customTitle: string | null;
        customDescription: string | null;
        customPrice: MaybeDecimal;
        showFullAddress: boolean;
        showPrice: boolean;
        highlightEnabled: boolean;
        highlightType: string | null;
        publishedAt: Date | null;
        lastSyncAt: Date | null;
        removedAt: Date | null;
        errorMessage: string | null;
      }
    | undefined,
  siteUrl: string
): PortalPublicationUiState {
  const fallback = defaultPortalState(portal, siteUrl);
  if (!publication) return fallback;

  return {
    ...fallback,
    enabled: publication.status !== PortalPublicationStatus.REMOVIDO,
    status: publication.status,
    externalId: publication.externalId,
    customTitle: publication.customTitle,
    customDescription: publication.customDescription,
    customPrice: toNumber(publication.customPrice),
    showFullAddress: publication.showFullAddress,
    showPrice: publication.showPrice,
    highlightEnabled: publication.highlightEnabled,
    highlightType: publication.highlightType,
    publishedAt: publication.publishedAt?.toISOString() ?? null,
    lastSyncAt: publication.lastSyncAt?.toISOString() ?? null,
    removedAt: publication.removedAt?.toISOString() ?? null,
    errorMessage: publication.errorMessage
  };
}

export async function getPropertyPortalPublicationState(propertyId: string) {
  const siteUrl = getSiteUrl();
  if (!hasDatabase) {
    return MARKETPLACE_PORTALS.map((portal) => defaultPortalState(portal, siteUrl));
  }

  try {
    const publications = await prisma.portalPublication.findMany({
      where: {
        propertyId,
        portalName: {
          in: MARKETPLACE_PORTALS.map((portal) => portal.id)
        }
      }
    });
    const byPortal = new Map(publications.map((publication) => [publication.portalName, publication]));

    return MARKETPLACE_PORTALS.map((portal) => mapPublicationState(portal, byPortal.get(portal.id), siteUrl));
  } catch {
    return MARKETPLACE_PORTALS.map((portal) => defaultPortalState(portal, siteUrl));
  }
}

export async function updatePropertyPortalPublications(
  propertyId: string,
  publications: PortalPublicationInput[]
) {
  if (!hasDatabase) return getPropertyPortalPublicationState(propertyId);

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true }
  });
  if (!property) return null;

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    for (const input of publications) {
      if (!isMarketplacePortalId(input.portalName)) continue;

      if (!input.enabled) {
        await tx.portalPublication.updateMany({
          where: { propertyId, portalName: input.portalName },
          data: {
            status: PortalPublicationStatus.REMOVIDO,
            removedAt: now,
            errorMessage: null
          }
        });
        continue;
      }

      await tx.portalPublication.upsert({
        where: {
          propertyId_portalName: {
            propertyId,
            portalName: input.portalName
          }
        },
        create: {
          propertyId,
          portalName: input.portalName,
          status: statusForEnabled(input.status),
          customTitle: optionalString(input.customTitle),
          customDescription: optionalString(input.customDescription),
          customPrice: input.customPrice ?? null,
          showFullAddress: input.showFullAddress ?? false,
          showPrice: input.showPrice ?? true,
          highlightEnabled: input.highlightEnabled ?? false,
          highlightType: optionalString(input.highlightType),
          removedAt: null
        },
        update: {
          status: statusForEnabled(input.status),
          customTitle: optionalString(input.customTitle),
          customDescription: optionalString(input.customDescription),
          customPrice: input.customPrice ?? null,
          showFullAddress: input.showFullAddress ?? false,
          showPrice: input.showPrice ?? true,
          highlightEnabled: input.highlightEnabled ?? false,
          highlightType: optionalString(input.highlightType),
          removedAt: null,
          errorMessage: null
        }
      });
    }
  });

  return getPropertyPortalPublicationState(propertyId);
}

export async function listFeedPropertiesForPortal(portalName: MarketplacePortalId): Promise<PortalFeedProperty[]> {
  if (!hasDatabase) return [];

  try {
    const publications = await prisma.portalPublication.findMany({
      where: {
        portalName,
        status: {
          in: [...EXPORTABLE_PUBLICATION_STATUSES]
        },
        property: {
          status: PropertyStatus.DISPONIVEL
        }
      },
      include: {
        property: {
          include: {
            media: {
              where: { kind: "IMAGE" },
              orderBy: { position: "asc" },
              take: 20
            }
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return publications.flatMap((publication) => {
      const checklist = getPublicationChecklist(publication.property);
      if (!checklist.ready) return [];

      const price = toNumber(publication.customPrice) ?? toNumber(publication.property.price) ?? 0;

      return [
        {
          publicationId: publication.id,
          id: publication.property.id,
          slug: publication.property.slug,
          title: publication.customTitle || publication.property.title,
          description: publication.customDescription || publication.property.description,
          type: publication.property.type,
          purpose: publication.property.purpose,
          price,
          city: publication.property.city,
          district: publication.property.district,
          address: publication.property.address,
          postalCode: publication.property.postalCode,
          latitude: toNumber(publication.property.latitude),
          longitude: toNumber(publication.property.longitude),
          areaM2: toNumber(publication.property.areaM2),
          landAreaM2: toNumber(publication.property.landAreaM2),
          bedrooms: publication.property.bedrooms,
          bathrooms: publication.property.bathrooms,
          suites: publication.property.suites,
          parkingSpaces: publication.property.parkingSpaces,
          features: publication.property.features,
          media: publication.property.media.map((media) => ({ url: media.url })),
          updatedAt: publication.property.updatedAt,
          showFullAddress: publication.showFullAddress,
          showPrice: publication.showPrice,
          highlightEnabled: publication.highlightEnabled,
          highlightType: publication.highlightType
        }
      ];
    });
  } catch {
    return [];
  }
}

export async function markPortalPublicationsSynced(publicationIds: string[]) {
  if (!hasDatabase || publicationIds.length === 0) return;
  const now = new Date();
  await prisma.$transaction([
    prisma.portalPublication.updateMany({
      where: { id: { in: publicationIds } },
      data: { lastSyncAt: now }
    }),
    prisma.portalPublication.updateMany({
      where: {
        id: { in: publicationIds },
        status: PortalPublicationStatus.PENDENTE
      },
      data: {
        status: PortalPublicationStatus.PUBLICADO,
        publishedAt: now
      }
    })
  ]);
}

export async function getPortalIntegrationDashboard() {
  const siteUrl = getSiteUrl();
  const emptyDashboard = {
    portals: MARKETPLACE_PORTALS.map((portal) => ({
      ...defaultPortalState(portal, siteUrl),
      activeCount: 0,
      publishedCount: 0,
      errorCount: 0,
      pausedCount: 0,
      readyCount: 0,
      lastSyncAt: null
    })),
    publications: [],
    totals: {
      activePortals: 0,
      selectedProperties: 0,
      publishedProperties: 0,
      errorProperties: 0,
      readyProperties: 0,
      portalLeads: 0
    }
  };

  if (!hasDatabase) return emptyDashboard;

  try {
    const [publications, portalLeadCount] = await Promise.all([
      prisma.portalPublication.findMany({
        where: {
          portalName: {
            in: MARKETPLACE_PORTALS.map((portal) => portal.id)
          }
        },
        include: {
          property: {
            include: {
              media: {
                where: { kind: "IMAGE" },
                orderBy: { position: "asc" },
                take: 6
              }
            }
          }
        },
        orderBy: [{ portalName: "asc" }, { updatedAt: "desc" }]
      }),
      prisma.lead.count({ where: { source: LeadSource.PORTAL } })
    ]);

    const publicationRows = publications.map((publication) => {
      const checklist = getPublicationChecklist(publication.property);
      return {
        id: publication.id,
        propertyId: publication.propertyId,
        portalName: publication.portalName,
        portalLabel: getMarketplacePortalLabel(publication.portalName),
        status: publication.status,
        title: publication.customTitle || publication.property.title,
        propertyTitle: publication.property.title,
        propertySlug: publication.property.slug,
        propertyType: publication.property.type,
        propertyPurpose: publication.property.purpose,
        propertyStatus: publication.property.status,
        city: publication.property.city,
        district: publication.property.district,
        price: toNumber(publication.customPrice) ?? toNumber(publication.property.price) ?? 0,
        photoUrl: publication.property.media[0]?.url ?? null,
        lastSyncAt: publication.lastSyncAt?.toISOString() ?? null,
        updatedAt: publication.updatedAt.toISOString(),
        errorMessage: publication.errorMessage,
        checklist
      };
    });

    const portals = MARKETPLACE_PORTALS.map((portal) => {
      const rows = publicationRows.filter((row) => row.portalName === portal.id);
      const activeRows = rows.filter((row) => row.status !== PortalPublicationStatus.REMOVIDO);
      const lastSync = activeRows
        .map((row) => row.lastSyncAt)
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;

      return {
        ...defaultPortalState(portal, siteUrl),
        activeCount: activeRows.length,
        publishedCount: activeRows.filter((row) => row.status === PortalPublicationStatus.PUBLICADO).length,
        errorCount: activeRows.filter((row) => row.status === PortalPublicationStatus.ERRO).length,
        pausedCount: activeRows.filter((row) => row.status === PortalPublicationStatus.PAUSADO).length,
        readyCount: activeRows.filter((row) => row.checklist.ready).length,
        lastSyncAt: lastSync
      };
    });

    const activeRows = publicationRows.filter((row) => row.status !== PortalPublicationStatus.REMOVIDO);

    return {
      portals,
      publications: publicationRows,
      totals: {
        activePortals: portals.filter((portal) => portal.activeCount > 0).length,
        selectedProperties: activeRows.length,
        publishedProperties: activeRows.filter((row) => row.status === PortalPublicationStatus.PUBLICADO).length,
        errorProperties: activeRows.filter((row) => row.status === PortalPublicationStatus.ERRO).length,
        readyProperties: activeRows.filter((row) => row.checklist.ready).length,
        portalLeads: portalLeadCount
      }
    };
  } catch {
    return emptyDashboard;
  }
}
