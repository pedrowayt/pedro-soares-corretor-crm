import {
  AuctionImportStatus,
  MediaKind,
  MediaStatus,
  OpportunityStatus,
  Prisma,
  PropertyPurpose,
  PropertyStatus,
  PropertyType
} from "@prisma/client";
import { slugify } from "@/lib/crm/slug";
import { prisma } from "@/lib/prisma";

type JsonObject = Record<string, unknown>;

export type AuctionImportPayload = {
  source: string;
  externalId: string;
  originalUrl: string;
  property?: JsonObject;
  auction?: JsonObject;
  legal?: JsonObject;
  documents?: JsonObject;
  images?: Array<string | JsonObject>;
  updatedAt?: string;
} & JsonObject;

type NormalizedImage = {
  url: string;
  isMain: boolean;
};

type AuctionImportPropertyForChecklist = {
  title: string;
  description: string;
  city: string;
  district: string;
  price: Prisma.Decimal | number;
  documents?: Prisma.JsonValue | null;
  media?: Array<{ url: string }>;
  auctionCase?: {
    auctionDate?: Date | null;
    firstAuctionDate?: Date | null;
    secondAuctionDate?: Date | null;
    minimumBid?: Prisma.Decimal | number | null;
    editalUrl?: string | null;
    occupancyStatus?: string | null;
  } | null;
  auctionImports?: Array<{
    source: string;
    externalId: string;
    originalUrl: string;
  }>;
};

const PLACEHOLDER_DISTRICTS = new Set(["nao informado", "bairro nao informado"]);
const PLACEHOLDER_DESCRIPTION_PREFIX = "Aguardando revisão";
const VALID_OCCUPANCY = new Set(["OCUPADO", "DESOCUPADO", "NAO_INFORMADO"]);

function asObject(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonObject) : {};
}

function text(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const parsed = text(value);
    if (parsed) return parsed;
  }
  return null;
}

function numberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function firstNumber(...values: unknown[]) {
  for (const value of values) {
    const parsed = numberValue(value);
    if (parsed !== null) return parsed;
  }
  return null;
}

function dateValue(value: unknown): Date | null {
  const raw = text(value);
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function firstDate(...values: unknown[]) {
  for (const value of values) {
    const parsed = dateValue(value);
    if (parsed) return parsed;
  }
  return null;
}

function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizePropertyType(value: unknown): PropertyType {
  const raw = text(value);
  if (!raw) return PropertyType.CASA;
  const normalized = normalizeKey(raw).replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").toUpperCase();
  if ((Object.values(PropertyType) as string[]).includes(normalized)) {
    return normalized as PropertyType;
  }

  const aliases: Record<string, PropertyType> = {
    APARTMENT: PropertyType.APARTAMENTO,
    APTO: PropertyType.APARTAMENTO,
    CASA: PropertyType.CASA,
    HOUSE: PropertyType.CASA,
    HOME: PropertyType.CASA,
    LAND: PropertyType.LOTE,
    TERRENO: PropertyType.LOTE,
    LOTE: PropertyType.LOTE,
    COMMERCIAL: PropertyType.COMERCIAL,
    COMERCIAL: PropertyType.COMERCIAL,
    RURAL: PropertyType.RURAL,
    FARM: PropertyType.FAZENDA,
    FAZENDA: PropertyType.FAZENDA,
    CHACARA: PropertyType.CHACARA,
    SALA: PropertyType.SALA,
    LOJA: PropertyType.LOJA,
    GALPAO: PropertyType.GALPAO,
    PREDIO: PropertyType.PREDIO
  };

  return aliases[normalized] ?? PropertyType.CASA;
}

function normalizeAuctionRisk(value: unknown) {
  const raw = text(value);
  if (!raw) return undefined;
  const normalized = normalizeKey(raw).toUpperCase();
  if (normalized.includes("BAIX")) return "BAIXO" as const;
  if (normalized.includes("ALT")) return "ALTO" as const;
  if (normalized.includes("MED")) return "MEDIO" as const;
  return undefined;
}

function normalizeOccupancy(legal: JsonObject, property: JsonObject, auction: JsonObject) {
  const explicit = firstText(
    legal.occupancyStatus,
    legal.occupancy,
    property.occupancyStatus,
    property.occupied,
    auction.occupancyStatus
  );

  if (typeof legal.occupied === "boolean") {
    return legal.occupied ? "OCUPADO" : "DESOCUPADO";
  }
  if (typeof property.occupied === "boolean") {
    return property.occupied ? "OCUPADO" : "DESOCUPADO";
  }

  if (!explicit) return null;
  const normalized = normalizeKey(explicit);
  if (normalized.includes("desocup")) return "DESOCUPADO";
  if (normalized.includes("ocup")) return "OCUPADO";
  if (normalized.includes("nao") || normalized.includes("inform")) return "NAO_INFORMADO";
  return null;
}

function normalizeImages(images: unknown): NormalizedImage[] {
  if (!Array.isArray(images)) return [];
  const seen = new Set<string>();
  return images
    .flatMap((item) => {
      if (typeof item === "string") {
        return [{ url: item, isMain: false }];
      }
      const object = asObject(item);
      return [
        {
          url: firstText(object.url, object.src, object.href) ?? "",
          isMain: Boolean(object.isMain ?? object.main ?? object.primary)
        }
      ];
    })
    .filter((item) => {
      if (!item.url.startsWith("http")) return false;
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .sort((a, b) => Number(b.isMain) - Number(a.isMain));
}

function documentPayload(originalUrl: string, auction: JsonObject, legal: JsonObject, documents: JsonObject) {
  const noticeUrl = firstText(documents.noticeUrl, documents.editalUrl, auction.noticeUrl, auction.editalUrl);
  const appraisalUrl = firstText(documents.appraisalUrl, documents.laudoUrl, auction.appraisalUrl);
  const registryUrl = firstText(documents.registryUrl, documents.matriculaUrl, legal.registryUrl);
  const caseUrl = firstText(documents.caseUrl, legal.caseUrl, legal.processUrl);
  const attachments = Array.isArray(documents.attachments) ? documents.attachments : [];

  return {
    originalUrl,
    noticeUrl,
    appraisalUrl,
    registryUrl,
    caseUrl,
    attachments
  };
}

function hasDocument(documents: Prisma.JsonValue | null | undefined, editalUrl?: string | null) {
  if (editalUrl) return true;
  if (!documents || typeof documents !== "object" || Array.isArray(documents)) return false;
  const object = documents as JsonObject;
  return Boolean(firstText(object.noticeUrl, object.editalUrl, object.appraisalUrl, object.registryUrl));
}

function toChecklistNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : Number(value);
}

function hasMeaningfulText(value: string | null | undefined) {
  if (!value) return false;
  const normalized = normalizeKey(value);
  return Boolean(normalized) && !PLACEHOLDER_DISTRICTS.has(normalized);
}

export function getAuctionPublicationChecklist(property: AuctionImportPropertyForChecklist) {
  const missing: string[] = [];
  const auctionCase = property.auctionCase;
  const title = property.title.trim();
  const description = property.description.trim();
  const minimumBid = toChecklistNumber(auctionCase?.minimumBid);
  const price = toChecklistNumber(property.price);

  if (!title || title.startsWith("Leilão importado")) missing.push("title");
  if (!description || description.startsWith(PLACEHOLDER_DESCRIPTION_PREFIX)) missing.push("description");
  if (!hasMeaningfulText(property.city)) missing.push("city");
  if (!hasMeaningfulText(property.district)) missing.push("district");
  if (Math.max(price, minimumBid) <= 1) missing.push("minimumBid");
  if (!(property.media ?? []).length) missing.push("image");

  const importInfo = property.auctionImports?.[0];
  if (!importInfo?.source) missing.push("source");
  if (!importInfo?.externalId) missing.push("externalId");
  if (!importInfo?.originalUrl) missing.push("originalUrl");

  if (!auctionCase?.auctionDate && !auctionCase?.firstAuctionDate && !auctionCase?.secondAuctionDate) {
    missing.push("auctionDate");
  }
  if (!hasDocument(property.documents, auctionCase?.editalUrl)) missing.push("noticeUrl");
  if (!auctionCase?.occupancyStatus || !VALID_OCCUPANCY.has(auctionCase.occupancyStatus)) {
    missing.push("occupancyStatus");
  }

  return {
    ready: missing.length === 0,
    missing
  };
}

async function buildUniqueSlug(
  tx: Prisma.TransactionClient,
  base: string,
  excludePropertyId?: string | null
) {
  const root = slugify(base) || `leilao-${Date.now()}`;
  let candidate = root;
  let suffix = 2;

  while (true) {
    const existing = await tx.property.findUnique({
      where: { slug: candidate },
      select: { id: true }
    });
    if (!existing || existing.id === excludePropertyId) return candidate;
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
}

function normalizeInput(payload: AuctionImportPayload) {
  const property = asObject(payload.property);
  const address = asObject(property.address);
  const auction = asObject(payload.auction);
  const legal = asObject(payload.legal);
  const documents = asObject(payload.documents);

  const source = payload.source.trim();
  const externalId = payload.externalId.trim();
  const originalUrl = payload.originalUrl.trim();
  const city = firstText(address.city, property.city, legal.city) ?? "Palmas";
  const district =
    firstText(address.neighborhood, property.neighborhood, property.district, property.bairro, legal.district) ??
    "Bairro não informado";
  const title =
    firstText(property.title, property.titulo, auction.title) ?? `Leilão importado ${source} ${externalId}`;
  const description =
    firstText(property.description, property.descricao, auction.description) ??
    "Aguardando revisão do edital e descrição comercial do imóvel.";
  const minimumBid = firstNumber(auction.minimumBid, auction.lanceMinimo, auction.minBid, property.price);
  const appraisedValue = firstNumber(auction.appraisedValue, auction.valorAvaliacao, auction.marketValue);
  const price = minimumBid ?? firstNumber(property.price, property.preco) ?? 1;
  const docs = documentPayload(originalUrl, auction, legal, documents);
  const firstAuctionDate = firstDate(auction.firstAuctionDate, auction.dataPraca1);
  const secondAuctionDate = firstDate(auction.secondAuctionDate, auction.dataPraca2);
  const auctionDate = firstDate(auction.auctionDate, auction.date, auction.endsAt) ?? firstAuctionDate ?? secondAuctionDate;

  return {
    source,
    externalId,
    originalUrl,
    property,
    auction,
    legal,
    documents: docs,
    images: normalizeImages(payload.images),
    propertyData: {
      title,
      type: normalizePropertyType(firstText(property.type, property.propertyType)),
      purpose: PropertyPurpose.LEILAO,
      status: PropertyStatus.EM_ANALISE,
      price,
      city,
      district,
      address: firstText(address.street, property.address, property.endereco),
      postalCode: firstText(address.zipCode, address.postalCode, property.zipCode, property.cep),
      latitude: firstNumber(address.latitude, property.latitude),
      longitude: firstNumber(address.longitude, property.longitude),
      areaM2: firstNumber(property.areaPrivate, property.areaM2, property.area),
      landAreaM2: firstNumber(property.areaTotal, property.landAreaM2, property.totalArea),
      bedrooms: firstNumber(property.bedrooms, property.quartos),
      suites: firstNumber(property.suites),
      bathrooms: firstNumber(property.bathrooms, property.banheiros),
      parkingSpaces: firstNumber(property.parkingSpaces, property.vagas),
      description,
      features: Array.isArray(property.features) ? property.features.filter((item): item is string => typeof item === "string") : [],
      legalNotes: firstText(legal.risks, legal.riskInfo, legal.legalNotes),
      internalNotes: firstText(property.internalNotes),
      commissionPct: firstNumber(auction.commissionPercentage, auction.commissionPct),
      marketEstimatedValue: appraisedValue,
      isInvestorHighlight: true,
      isAuctionOpportunity: true,
      documents: docs
    },
    auctionCaseData: {
      caseNumber: firstText(legal.caseNumber, legal.processNumber),
      courtName: firstText(legal.court, legal.courtName),
      auctionDate,
      firstAuctionDate,
      secondAuctionDate,
      minimumBid,
      appraisedValue,
      estimatedCosts: firstNumber(auction.estimatedCosts, legal.estimatedCosts),
      documentaryRisk: normalizeAuctionRisk(legal.documentaryRisk),
      legalStatus: firstText(legal.status, legal.legalStatus),
      editalUrl: docs.noticeUrl,
      appraisalUrl: docs.appraisalUrl,
      registryUrl: docs.registryUrl,
      bidUrl: firstText(auction.bidUrl, auction.lanceUrl),
      lotCode: firstText(auction.lotCode, auction.lote, auction.lot),
      auctioneerName: firstText(auction.auctioneer, auction.auctioneerName),
      auctionType: firstText(auction.type, auction.auctionType),
      auctionMode: firstText(auction.mode, auction.modality, auction.auctionMode),
      registryNumber: firstText(legal.registryNumber, legal.matricula),
      registryOffice: firstText(legal.registryOffice, legal.cartorio),
      occupancyStatus: normalizeOccupancy(legal, property, auction),
      debtsInfo: firstText(legal.debtsInfo, legal.debts, auction.debtsInfo),
      documentLinks: docs
    }
  };
}

async function upsertExternalImages(
  tx: Prisma.TransactionClient,
  propertyId: string,
  images: NormalizedImage[],
  canAppend: boolean
) {
  if (!canAppend || !images.length) return;

  const existing = await tx.propertyMedia.findMany({
    where: { propertyId },
    select: { url: true, position: true }
  });
  const existingUrls = new Set(existing.map((item) => item.url));
  const nextImages = images.filter((image) => !existingUrls.has(image.url));
  if (!nextImages.length) return;

  const startPosition = existing.length ? Math.max(...existing.map((item) => item.position)) + 1 : 0;
  await tx.propertyMedia.createMany({
    data: nextImages.map((image, index) => ({
      propertyId,
      kind: MediaKind.IMAGE,
      status: MediaStatus.PRONTO,
      url: image.url,
      position: startPosition + index,
      metadata: { imported: true, external: true } as Prisma.InputJsonValue
    }))
  });
}

async function loadPropertyForChecklist(tx: Prisma.TransactionClient, propertyId: string) {
  return tx.property.findUniqueOrThrow({
    where: { id: propertyId },
    include: {
      media: {
        where: { kind: MediaKind.IMAGE },
        orderBy: { position: "asc" }
      },
      auctionCase: true,
      auctionImports: true
    }
  });
}

export async function importAuctionPayload(payload: AuctionImportPayload) {
  const normalized = normalizeInput(payload);
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const existingImport = await tx.auctionImport.findUnique({
      where: {
        source_externalId: {
          source: normalized.source,
          externalId: normalized.externalId
        }
      },
      include: {
        property: true
      }
    });

    const existingProperty = existingImport?.property ?? null;
    const isAlreadyPublished =
      existingImport?.status === AuctionImportStatus.PUBLISHED || Boolean(existingProperty?.publishedAt);

    let propertyId = existingProperty?.id;
    let created = false;
    let updated = false;

    if (!propertyId) {
      const slug = await buildUniqueSlug(
        tx,
        `leilao-${normalized.source}-${normalized.externalId}`
      );
      const property = await tx.property.create({
        data: {
          slug,
          title: normalized.propertyData.title,
          type: normalized.propertyData.type,
          purpose: normalized.propertyData.purpose,
          status: PropertyStatus.EM_ANALISE,
          price: normalized.propertyData.price,
          city: normalized.propertyData.city,
          district: normalized.propertyData.district,
          address: normalized.propertyData.address,
          postalCode: normalized.propertyData.postalCode,
          latitude: normalized.propertyData.latitude,
          longitude: normalized.propertyData.longitude,
          areaM2: normalized.propertyData.areaM2,
          landAreaM2: normalized.propertyData.landAreaM2,
          bedrooms: normalized.propertyData.bedrooms,
          suites: normalized.propertyData.suites,
          bathrooms: normalized.propertyData.bathrooms,
          parkingSpaces: normalized.propertyData.parkingSpaces,
          description: normalized.propertyData.description,
          features: normalized.propertyData.features,
          legalNotes: normalized.propertyData.legalNotes,
          internalNotes: normalized.propertyData.internalNotes,
          commissionPct: normalized.propertyData.commissionPct,
          documents: normalized.propertyData.documents as Prisma.InputJsonValue,
          marketEstimatedValue: normalized.propertyData.marketEstimatedValue,
          isInvestorHighlight: normalized.propertyData.isInvestorHighlight,
          isAuctionOpportunity: normalized.propertyData.isAuctionOpportunity
        }
      });
      propertyId = property.id;
      created = true;
    } else if (!isAlreadyPublished) {
      const slug = await buildUniqueSlug(
        tx,
        `leilao-${normalized.source}-${normalized.externalId}`,
        propertyId
      );
      await tx.property.update({
        where: { id: propertyId },
        data: {
          slug,
          title: normalized.propertyData.title,
          type: normalized.propertyData.type,
          purpose: PropertyPurpose.LEILAO,
          status: PropertyStatus.EM_ANALISE,
          price: normalized.propertyData.price,
          city: normalized.propertyData.city,
          district: normalized.propertyData.district,
          address: normalized.propertyData.address,
          postalCode: normalized.propertyData.postalCode,
          latitude: normalized.propertyData.latitude,
          longitude: normalized.propertyData.longitude,
          areaM2: normalized.propertyData.areaM2,
          landAreaM2: normalized.propertyData.landAreaM2,
          bedrooms: normalized.propertyData.bedrooms,
          suites: normalized.propertyData.suites,
          bathrooms: normalized.propertyData.bathrooms,
          parkingSpaces: normalized.propertyData.parkingSpaces,
          description: normalized.propertyData.description,
          features: normalized.propertyData.features,
          legalNotes: normalized.propertyData.legalNotes,
          internalNotes: normalized.propertyData.internalNotes,
          commissionPct: normalized.propertyData.commissionPct,
          documents: normalized.propertyData.documents as Prisma.InputJsonValue,
          marketEstimatedValue: normalized.propertyData.marketEstimatedValue,
          isInvestorHighlight: true,
          isAuctionOpportunity: true,
          publishedAt: null
        }
      });
      updated = true;
    }

    await tx.auctionCase.upsert({
      where: { propertyId },
      create: {
        propertyId,
        ...normalized.auctionCaseData,
        documentLinks: normalized.auctionCaseData.documentLinks as Prisma.InputJsonValue
      },
      update: {
        ...normalized.auctionCaseData,
        documentLinks: normalized.auctionCaseData.documentLinks as Prisma.InputJsonValue
      }
    });

    await upsertExternalImages(tx, propertyId, normalized.images, !isAlreadyPublished);

    const propertyForChecklist = await loadPropertyForChecklist(tx, propertyId);
    const checklist = getAuctionPublicationChecklist({
      ...propertyForChecklist,
      auctionImports: [
        {
          source: normalized.source,
          externalId: normalized.externalId,
          originalUrl: normalized.originalUrl
        }
      ]
    });
    const status = isAlreadyPublished
      ? AuctionImportStatus.PUBLISHED
      : checklist.ready
        ? AuctionImportStatus.READY
        : AuctionImportStatus.NEEDS_REVIEW;

    const auctionImport = await tx.auctionImport.upsert({
      where: {
        source_externalId: {
          source: normalized.source,
          externalId: normalized.externalId
        }
      },
      create: {
        source: normalized.source,
        externalId: normalized.externalId,
        originalUrl: normalized.originalUrl,
        rawPayload: payload as Prisma.InputJsonValue,
        missingFields: checklist.missing,
        status,
        propertyId,
        lastImportedAt: now,
        publishedAt: isAlreadyPublished ? existingImport?.publishedAt ?? now : null
      },
      update: {
        originalUrl: normalized.originalUrl,
        rawPayload: payload as Prisma.InputJsonValue,
        missingFields: checklist.missing,
        status,
        propertyId,
        lastImportedAt: now,
        publishedAt: isAlreadyPublished ? existingImport?.publishedAt ?? now : null
      }
    });

    return {
      importId: auctionImport.id,
      propertyId,
      created,
      updated: updated || Boolean(existingImport),
      status: auctionImport.status,
      missingFields: checklist.missing,
      reviewUrl: `/crm/imoveis/${propertyId}`
    };
  });
}

export async function listAuctionImports() {
  return prisma.auctionImport.findMany({
    orderBy: { lastImportedAt: "desc" },
    include: {
      property: {
        include: {
          media: {
            where: { kind: MediaKind.IMAGE },
            orderBy: { position: "asc" },
            take: 1
          },
          auctionCase: true
        }
      }
    }
  });
}

export async function findAuctionImportForProperty(propertyId: string) {
  return prisma.auctionImport.findFirst({
    where: { propertyId },
    orderBy: { lastImportedAt: "desc" }
  });
}

export async function refreshAuctionImportChecklistForProperty(propertyId: string) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      media: {
        where: { kind: MediaKind.IMAGE }
      },
      auctionCase: true,
      auctionImports: true
    }
  });

  if (!property?.auctionImports.length) return null;

  const checklist = getAuctionPublicationChecklist(property);
  const status = property.publishedAt
    ? AuctionImportStatus.PUBLISHED
    : checklist.ready
      ? AuctionImportStatus.READY
      : AuctionImportStatus.NEEDS_REVIEW;

  await prisma.auctionImport.updateMany({
    where: { propertyId },
    data: {
      missingFields: checklist.missing,
      status,
      publishedAt: property.publishedAt
    }
  });

  return checklist;
}

export async function publishAuctionImport(id: string) {
  return prisma.$transaction(async (tx) => {
    const auctionImport = await tx.auctionImport.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            media: {
              where: { kind: MediaKind.IMAGE }
            },
            auctionCase: true,
            auctionImports: true
          }
        }
      }
    });

    if (!auctionImport?.property) {
      return { ok: false as const, reason: "not_found" as const, missingFields: [] as string[] };
    }

    const checklist = getAuctionPublicationChecklist(auctionImport.property);
    if (!checklist.ready) {
      await tx.auctionImport.update({
        where: { id },
        data: {
          missingFields: checklist.missing,
          status: AuctionImportStatus.NEEDS_REVIEW
        }
      });
      return { ok: false as const, reason: "incomplete" as const, missingFields: checklist.missing };
    }

    const now = new Date();
    await tx.property.update({
      where: { id: auctionImport.property.id },
      data: {
        purpose: PropertyPurpose.LEILAO,
        status: PropertyStatus.DISPONIVEL,
        isAuctionOpportunity: true,
        publishedAt: auctionImport.property.publishedAt ?? now
      }
    });
    await tx.auctionCase.update({
      where: { propertyId: auctionImport.property.id },
      data: { status: OpportunityStatus.ATIVA }
    });
    const updatedImport = await tx.auctionImport.update({
      where: { id },
      data: {
        status: AuctionImportStatus.PUBLISHED,
        missingFields: [],
        publishedAt: auctionImport.publishedAt ?? now
      }
    });

    return {
      ok: true as const,
      auctionImport: updatedImport,
      propertyId: auctionImport.property.id,
      missingFields: [] as string[]
    };
  });
}

export async function unpublishAuctionImport(id: string) {
  return prisma.$transaction(async (tx) => {
    const auctionImport = await tx.auctionImport.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            media: {
              where: { kind: MediaKind.IMAGE }
            },
            auctionCase: true,
            auctionImports: true
          }
        }
      }
    });

    if (!auctionImport?.property) {
      return { ok: false as const, reason: "not_found" as const, missingFields: [] as string[] };
    }

    await tx.property.update({
      where: { id: auctionImport.property.id },
      data: {
        status: PropertyStatus.EM_ANALISE,
        publishedAt: null
      }
    });

    const propertyForChecklist = await loadPropertyForChecklist(tx, auctionImport.property.id);
    const checklist = getAuctionPublicationChecklist(propertyForChecklist);
    const updatedImport = await tx.auctionImport.update({
      where: { id },
      data: {
        status: checklist.ready ? AuctionImportStatus.READY : AuctionImportStatus.NEEDS_REVIEW,
        missingFields: checklist.missing,
        publishedAt: null
      }
    });

    return {
      ok: true as const,
      auctionImport: updatedImport,
      propertyId: auctionImport.property.id,
      missingFields: checklist.missing
    };
  });
}
