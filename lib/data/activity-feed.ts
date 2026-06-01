import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export type ActivityEntry =
  | {
      id: string;
      kind: "interaction";
      leadId: string;
      leadName: string;
      type: string;
      channel: string;
      message: string | null;
      propertyTitle: string | null;
      developmentTitle: string | null;
      createdAt: Date;
    }
  | {
      id: string;
      kind: "visit";
      leadId: string;
      leadName: string;
      status: string;
      propertyTitle: string | null;
      createdAt: Date;
    }
  | {
      id: string;
      kind: "proposal";
      leadId: string;
      leadName: string;
      status: string;
      propertyTitle: string | null;
      offeredValue: number;
      createdAt: Date;
    }
  | {
      id: string;
      kind: "stage";
      leadId: string;
      leadName: string;
      fromStage: string | null;
      toStage: string;
      createdAt: Date;
    };

export type ActivityFilters = {
  channel?: string;
  type?: string;
  search?: string;
  limit?: number;
};

export async function listActivityFeed(filters: ActivityFilters = {}): Promise<ActivityEntry[]> {
  if (!hasDatabase) return [];

  const limit = filters.limit ?? 60;

  try {
    const interactionWhere: Prisma.LeadInteractionWhereInput = {
      ...(filters.channel
        ? { channel: filters.channel as Prisma.LeadInteractionWhereInput["channel"] }
        : {}),
      ...(filters.type
        ? { type: filters.type as Prisma.LeadInteractionWhereInput["type"] }
        : {}),
      ...(filters.search
        ? {
            OR: [
              { message: { contains: filters.search, mode: "insensitive" } },
              { lead: { name: { contains: filters.search, mode: "insensitive" } } }
            ]
          }
        : {})
    };

    const [interactions, visits, proposals, stages] = await Promise.all([
      prisma.leadInteraction.findMany({
        where: interactionWhere,
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
          lead: { select: { id: true, name: true } },
          property: { select: { title: true } },
          development: { select: { title: true } }
        }
      }),
      filters.type || filters.channel
        ? []
        : prisma.visit.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
              lead: { select: { id: true, name: true } },
              property: { select: { title: true } }
            }
          }),
      filters.type || filters.channel
        ? []
        : prisma.proposal.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
              lead: { select: { id: true, name: true } },
              property: { select: { title: true } }
            }
          }),
      filters.type || filters.channel
        ? []
        : prisma.pipelineStageHistory.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
            include: { lead: { select: { id: true, name: true } } }
          })
    ]);

    const interactionEntries: ActivityEntry[] = interactions.map((row) => ({
      id: `interaction-${row.id}`,
      kind: "interaction",
      leadId: row.leadId,
      leadName: row.lead.name,
      type: row.type,
      channel: row.channel,
      message: row.message,
      propertyTitle: row.property?.title ?? null,
      developmentTitle: row.development?.title ?? null,
      createdAt: row.createdAt
    }));

    const visitEntries: ActivityEntry[] = visits.map((row) => ({
      id: `visit-${row.id}`,
      kind: "visit",
      leadId: row.leadId,
      leadName: row.lead.name,
      status: row.status,
      propertyTitle: row.property?.title ?? null,
      createdAt: row.createdAt
    }));

    const proposalEntries: ActivityEntry[] = proposals.map((row) => ({
      id: `proposal-${row.id}`,
      kind: "proposal",
      leadId: row.leadId,
      leadName: row.lead.name,
      status: row.status,
      propertyTitle: row.property?.title ?? null,
      offeredValue: Number(row.offeredValue),
      createdAt: row.createdAt
    }));

    const stageEntries: ActivityEntry[] = stages.map((row) => ({
      id: `stage-${row.id}`,
      kind: "stage",
      leadId: row.leadId,
      leadName: row.lead.name,
      fromStage: row.fromStage,
      toStage: row.toStage,
      createdAt: row.createdAt
    }));

    return [...interactionEntries, ...visitEntries, ...proposalEntries, ...stageEntries]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  } catch {
    return [];
  }
}
