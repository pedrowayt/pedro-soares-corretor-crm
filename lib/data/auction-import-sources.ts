import { createHash, randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AuctionImportSourcePayload = {
  name: string;
  sourceKey: string;
  active?: boolean;
  allowedDomains?: string[];
  notes?: string | null;
};

export type AuctionImportSourceUpdatePayload = Partial<Omit<AuctionImportSourcePayload, "sourceKey">> & {
  sourceKey?: string;
};

export type AuctionImportSourceListItem = {
  id: string;
  name: string;
  sourceKey: string;
  tokenPreview: string | null;
  active: boolean;
  allowedDomains: string[];
  notes: string | null;
  lastImportAt: Date | null;
  lastError: string | null;
  createdAt: Date;
  updatedAt: Date;
  counts: {
    total: number;
    needsReview: number;
    ready: number;
    published: number;
    error: number;
  };
};

function normalizeSourceKey(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeDomain(input: string) {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;
  try {
    return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`).hostname.replace(/^www\./, "");
  } catch {
    return trimmed.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] || null;
  }
}

function normalizeDomains(input?: string[]) {
  if (!input) return undefined;
  return Array.from(
    new Set(
      input
        .map(normalizeDomain)
        .filter((domain): domain is string => Boolean(domain))
    )
  );
}

export function generateAuctionImportToken() {
  return `auc_${randomBytes(32).toString("base64url")}`;
}

export function hashAuctionImportToken(token: string) {
  return createHash("sha256").update(`auction-import:${token}`).digest("hex");
}

function previewToken(token: string) {
  return `${token.slice(0, 10)}...${token.slice(-6)}`;
}

function normalizeCreatePayload(input: AuctionImportSourcePayload) {
  return {
    name: input.name.trim(),
    sourceKey: normalizeSourceKey(input.sourceKey),
    active: input.active ?? true,
    allowedDomains: normalizeDomains(input.allowedDomains) ?? [],
    notes: normalizeString(input.notes)
  };
}

function normalizeUpdatePayload(input: AuctionImportSourceUpdatePayload) {
  return {
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    ...(input.sourceKey !== undefined ? { sourceKey: normalizeSourceKey(input.sourceKey) } : {}),
    ...(input.active !== undefined ? { active: input.active } : {}),
    ...(input.allowedDomains !== undefined ? { allowedDomains: normalizeDomains(input.allowedDomains) ?? [] } : {}),
    ...(input.notes !== undefined ? { notes: normalizeString(input.notes) } : {})
  };
}

async function getCountsBySource() {
  const grouped = await prisma.auctionImport.groupBy({
    by: ["source", "status"],
    _count: {
      _all: true
    }
  });

  const counts = new Map<string, AuctionImportSourceListItem["counts"]>();
  for (const row of grouped) {
    const current =
      counts.get(row.source) ??
      {
        total: 0,
        needsReview: 0,
        ready: 0,
        published: 0,
        error: 0
      };
    current.total += row._count._all;
    if (row.status === "NEEDS_REVIEW") current.needsReview += row._count._all;
    if (row.status === "READY") current.ready += row._count._all;
    if (row.status === "PUBLISHED") current.published += row._count._all;
    if (row.status === "ERROR") current.error += row._count._all;
    counts.set(row.source, current);
  }

  return counts;
}

export async function listAuctionImportSources(): Promise<AuctionImportSourceListItem[]> {
  const [sources, countsBySource] = await Promise.all([
    prisma.auctionImportSource.findMany({
      orderBy: [{ active: "desc" }, { updatedAt: "desc" }]
    }),
    getCountsBySource()
  ]);

  return sources.map((source) => ({
    id: source.id,
    name: source.name,
    sourceKey: source.sourceKey,
    tokenPreview: source.tokenPreview,
    active: source.active,
    allowedDomains: source.allowedDomains,
    notes: source.notes,
    lastImportAt: source.lastImportAt,
    lastError: source.lastError,
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
    counts:
      countsBySource.get(source.sourceKey) ??
      {
        total: 0,
        needsReview: 0,
        ready: 0,
        published: 0,
        error: 0
      }
  }));
}

export async function createAuctionImportSource(input: AuctionImportSourcePayload) {
  const normalized = normalizeCreatePayload(input);
  if (!normalized.sourceKey) {
    throw new Error("Source key inválido.");
  }

  const token = generateAuctionImportToken();
  const source = await prisma.auctionImportSource.create({
    data: {
      ...normalized,
      tokenHash: hashAuctionImportToken(token),
      tokenPreview: previewToken(token)
    }
  });

  return {
    source,
    token
  };
}

export async function updateAuctionImportSource(id: string, input: AuctionImportSourceUpdatePayload) {
  const normalized = normalizeUpdatePayload(input);
  if ("sourceKey" in normalized && !normalized.sourceKey) {
    throw new Error("Source key inválido.");
  }

  return prisma.auctionImportSource.update({
    where: { id },
    data: normalized
  });
}

export async function rotateAuctionImportSourceToken(id: string) {
  const token = generateAuctionImportToken();
  const source = await prisma.auctionImportSource.update({
    where: { id },
    data: {
      tokenHash: hashAuctionImportToken(token),
      tokenPreview: previewToken(token),
      active: true,
      lastError: null
    }
  });

  return {
    source,
    token
  };
}

export async function revokeAuctionImportSourceToken(id: string) {
  return prisma.auctionImportSource.update({
    where: { id },
    data: {
      tokenHash: null,
      tokenPreview: null,
      active: false
    }
  });
}

export async function findAuctionImportSourceByToken(token: string) {
  return prisma.auctionImportSource.findUnique({
    where: {
      tokenHash: hashAuctionImportToken(token)
    }
  });
}

export function isOriginalUrlAllowedForSource(source: { allowedDomains: string[] }, originalUrl: string) {
  if (!source.allowedDomains.length) return true;
  let hostname = "";
  try {
    hostname = new URL(originalUrl).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return false;
  }

  return source.allowedDomains.some((domain) => {
    const normalizedDomain = normalizeDomain(domain);
    if (!normalizedDomain) return false;
    return hostname === normalizedDomain || hostname.endsWith(`.${normalizedDomain}`);
  });
}

export async function recordAuctionImportSourceSuccess(id: string) {
  await prisma.auctionImportSource
    .update({
      where: { id },
      data: {
        lastImportAt: new Date(),
        lastError: null
      }
    })
    .catch(() => null);
}

export async function recordAuctionImportSourceError(id: string, error: string) {
  await prisma.auctionImportSource
    .update({
      where: { id },
      data: {
        lastError: error.slice(0, 500)
      }
    })
    .catch(() => null);
}

export function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
