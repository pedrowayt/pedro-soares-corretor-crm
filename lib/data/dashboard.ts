import { LeadStage, ProposalStatus, TaskStatus, VisitStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

const ACTIVE_LEAD_STAGES: LeadStage[] = [
  LeadStage.NOVO,
  LeadStage.PRIMEIRO_CONTATO,
  LeadStage.QUALIFICADO,
  LeadStage.OPCOES_ENVIADAS,
  LeadStage.VISITA_AGENDADA,
  LeadStage.PROPOSTA_ENVIADA,
  LeadStage.NEGOCIACAO
];

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function daysAgo(days: number) {
  const next = new Date();
  next.setDate(next.getDate() - days);
  return next;
}

export type DashboardSnapshot = Awaited<ReturnType<typeof getDashboardSnapshot>>;

export async function getDashboardFeaturedProperties() {
  if (!hasDatabase) return [];
  try {
    return await prisma.property.findMany({
      where: { status: "DISPONIVEL" },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        id: true,
        slug: true,
        title: true,
        price: true,
        city: true,
        district: true,
        type: true,
        purpose: true,
        bedrooms: true,
        areaM2: true,
        media: {
          where: { kind: "IMAGE" },
          orderBy: { position: "asc" },
          take: 1,
          select: { url: true }
        }
      }
    });
  } catch {
    return [];
  }
}

export async function getDashboardSnapshot() {
  const today = new Date();
  const dayStart = startOfDay(today);
  const dayEnd = endOfDay(today);
  const sevenDaysAhead = new Date(today);
  sevenDaysAhead.setDate(sevenDaysAhead.getDate() + 7);
  const yesterdayStart = startOfDay(daysAgo(1));
  const yesterdayEnd = endOfDay(daysAgo(1));
  const hotThreshold = daysAgo(3);

  if (!hasDatabase) {
    return {
      kpis: {
        newLeadsToday: 0,
        newLeadsTodayDelta: 0,
        visitsToday: 0,
        proposalsPending: 0,
        pipelineValue: 0,
        wonThisMonth: 0
      },
      pipeline: [],
      hotLeads: [],
      upcomingAppointments: [],
      leadsBySource: []
    };
  }

  try {
    const [
      newLeadsToday,
      newLeadsYesterday,
      visitsToday,
      proposalsPending,
      pipelineLeads,
      monthWinsCount,
      monthWinsValue,
      hotLeads,
      upcomingVisits,
      upcomingTasks,
      leadsBySource,
      pipelineSummary
    ] = await Promise.all([
      prisma.lead.count({ where: { createdAt: { gte: dayStart, lte: dayEnd } } }),
      prisma.lead.count({ where: { createdAt: { gte: yesterdayStart, lte: yesterdayEnd } } }),
      prisma.visit.count({
        where: { scheduledAt: { gte: dayStart, lte: dayEnd } }
      }),
      prisma.proposal.count({
        where: { status: { in: [ProposalStatus.ENVIADA, ProposalStatus.CONTRA_PROPOSTA] } }
      }),
      prisma.lead.findMany({
        where: { stage: { in: ACTIVE_LEAD_STAGES } },
        select: { budgetMax: true, linkedProperty: { select: { price: true } } }
      }),
      prisma.lead.count({
        where: {
          stage: LeadStage.FECHADO,
          updatedAt: {
            gte: startOfDay(new Date(today.getFullYear(), today.getMonth(), 1))
          }
        }
      }),
      prisma.lead.findMany({
        where: {
          stage: LeadStage.FECHADO,
          updatedAt: {
            gte: startOfDay(new Date(today.getFullYear(), today.getMonth(), 1))
          }
        },
        select: { linkedProperty: { select: { price: true } } }
      }),
      prisma.lead.findMany({
        where: {
          stage: { in: ACTIVE_LEAD_STAGES },
          OR: [{ lastContactAt: { lte: hotThreshold } }, { lastContactAt: null }],
          createdAt: { lte: hotThreshold }
        },
        orderBy: [{ lastContactAt: "asc" }, { createdAt: "asc" }],
        take: 6,
        include: {
          linkedProperty: { select: { id: true, slug: true, title: true } },
          linkedDevelopment: { select: { id: true, slug: true, title: true } }
        }
      }),
      prisma.visit.findMany({
        where: {
          scheduledAt: { gte: dayStart, lte: sevenDaysAhead },
          status: { in: [VisitStatus.AGENDADA, VisitStatus.REAGENDADA] }
        },
        orderBy: { scheduledAt: "asc" },
        take: 8,
        include: {
          lead: { select: { id: true, name: true } },
          property: { select: { id: true, title: true } }
        }
      }),
      prisma.task.findMany({
        where: {
          status: TaskStatus.PENDENTE,
          dueAt: { gte: dayStart, lte: sevenDaysAhead }
        },
        orderBy: { dueAt: "asc" },
        take: 8,
        include: {
          lead: { select: { id: true, name: true } },
          property: { select: { id: true, title: true } }
        }
      }),
      prisma.lead.groupBy({ by: ["source"], _count: { _all: true } }),
      prisma.lead.groupBy({ by: ["stage"], _count: { _all: true } })
    ]);

    const pipelineValue = pipelineLeads.reduce((total, lead) => {
      const price = lead.linkedProperty?.price
        ? Number(lead.linkedProperty.price)
        : lead.budgetMax
          ? Number(lead.budgetMax)
          : 0;
      return total + price;
    }, 0);

    const wonValue = monthWinsValue.reduce((total, lead) => {
      const price = lead.linkedProperty?.price ? Number(lead.linkedProperty.price) : 0;
      return total + price;
    }, 0);

    return {
      kpis: {
        newLeadsToday,
        newLeadsTodayDelta: newLeadsToday - newLeadsYesterday,
        visitsToday,
        proposalsPending,
        pipelineValue,
        wonThisMonth: monthWinsCount,
        wonValueThisMonth: wonValue
      },
      pipeline: pipelineSummary,
      hotLeads,
      upcomingAppointments: [
        ...upcomingVisits.map((visit) => ({
          id: `visit-${visit.id}`,
          kind: "visit" as const,
          when: visit.scheduledAt,
          leadId: visit.lead.id,
          leadName: visit.lead.name,
          subject: visit.property.title,
          status: visit.status
        })),
        ...upcomingTasks.map((task) => ({
          id: `task-${task.id}`,
          kind: "task" as const,
          when: task.dueAt ?? new Date(),
          leadId: task.lead?.id ?? null,
          leadName: task.lead?.name ?? null,
          subject: task.title,
          status: task.status
        }))
      ]
        .filter((item) => item.when)
        .sort((a, b) => new Date(a.when).getTime() - new Date(b.when).getTime())
        .slice(0, 8),
      leadsBySource
    };
  } catch {
    return {
      kpis: {
        newLeadsToday: 0,
        newLeadsTodayDelta: 0,
        visitsToday: 0,
        proposalsPending: 0,
        pipelineValue: 0,
        wonThisMonth: 0
      },
      pipeline: [],
      hotLeads: [],
      upcomingAppointments: [],
      leadsBySource: []
    };
  }
}

export type LeadDetail = NonNullable<Awaited<ReturnType<typeof getLeadDetail>>>;

export async function getLeadDetail(id: string) {
  if (!hasDatabase) return null;
  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        ownerUser: { select: { id: true, name: true, email: true } },
        linkedProperty: { select: { id: true, slug: true, title: true, price: true, city: true, district: true } },
        linkedDevelopment: { select: { id: true, slug: true, title: true } },
        linkedDevelopmentUnitType: { select: { id: true, name: true } },
        linkedOwner: { select: { id: true, name: true, phone: true } },
        visits: {
          orderBy: { scheduledAt: "desc" },
          include: { property: { select: { id: true, title: true } } }
        },
        proposals: {
          orderBy: { createdAt: "desc" },
          include: { property: { select: { id: true, title: true } } }
        },
        tasks: {
          orderBy: { dueAt: "asc" }
        },
        interactions: {
          orderBy: { createdAt: "desc" },
          take: 50
        },
        stageHistory: {
          orderBy: { createdAt: "desc" },
          take: 20
        }
      }
    });
    return lead;
  } catch {
    return null;
  }
}

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
