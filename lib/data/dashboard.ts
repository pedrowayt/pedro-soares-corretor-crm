import { LeadStage } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export async function getDashboardMetrics() {
  if (!hasDatabase) {
    return {
      totalLeads: 0,
      visitsCount: 0,
      proposalsCount: 0,
      closedCount: 0,
      activeProperties: 0,
      leadsBySource: []
    };
  }

  try {
    const [totalLeads, leadsBySource, visitsCount, proposalsCount, closedCount, activeProperties] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({
        by: ["source"],
        _count: {
          _all: true
        }
      }),
      prisma.visit.count(),
      prisma.proposal.count(),
      prisma.lead.count({ where: { stage: LeadStage.FECHADO } }),
      prisma.property.count({ where: { status: "DISPONIVEL" } })
    ]);

    return {
      totalLeads,
      visitsCount,
      proposalsCount,
      closedCount,
      activeProperties,
      leadsBySource
    };
  } catch {
    return {
      totalLeads: 0,
      visitsCount: 0,
      proposalsCount: 0,
      closedCount: 0,
      activeProperties: 0,
      leadsBySource: []
    };
  }
}

export async function getPipelineSummary() {
  if (!hasDatabase) {
    return [];
  }

  try {
    return await prisma.lead.groupBy({
      by: ["stage"],
      _count: {
        _all: true
      }
    });
  } catch {
    return [];
  }
}
