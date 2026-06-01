import { LeadStage, ProposalStatus, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

const FUNNEL_STAGES: LeadStage[] = [
  LeadStage.NOVO,
  LeadStage.PRIMEIRO_CONTATO,
  LeadStage.QUALIFICADO,
  LeadStage.OPCOES_ENVIADAS,
  LeadStage.VISITA_AGENDADA,
  LeadStage.PROPOSTA_ENVIADA,
  LeadStage.NEGOCIACAO,
  LeadStage.FECHADO
];

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez"
];

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
  return `${MONTH_LABELS[date.getMonth()]}/${String(date.getFullYear()).slice(2)}`;
}

export type ReportSnapshot = Awaited<ReturnType<typeof getReportSnapshot>>;

export async function getReportSnapshot() {
  if (!hasDatabase) {
    return {
      funnel: FUNNEL_STAGES.map((stage) => ({ stage, count: 0 })),
      bySource: [],
      monthly: [],
      proposalsByStatus: [],
      tasksByStatus: [],
      conversion: { lostRate: 0, winRate: 0, totalCreated: 0, totalWon: 0, totalLost: 0 }
    };
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  try {
    const [stagesGroup, sourcesGroup, leadsByMonth, proposalsByStatus, tasksByStatus, total, won, lost] =
      await Promise.all([
        prisma.lead.groupBy({
          by: ["stage"],
          _count: { _all: true }
        }),
        prisma.lead.groupBy({
          by: ["source"],
          _count: { _all: true }
        }),
        prisma.lead.findMany({
          where: { createdAt: { gte: sixMonthsAgo } },
          select: { createdAt: true, stage: true }
        }),
        prisma.proposal.groupBy({
          by: ["status"],
          _count: { _all: true }
        }),
        prisma.task.groupBy({
          by: ["status"],
          _count: { _all: true }
        }),
        prisma.lead.count(),
        prisma.lead.count({ where: { stage: LeadStage.FECHADO } }),
        prisma.lead.count({ where: { stage: LeadStage.PERDIDO } })
      ]);

    const stageMap = new Map(stagesGroup.map((row) => [row.stage, row._count._all]));
    const funnel = FUNNEL_STAGES.map((stage) => ({ stage, count: stageMap.get(stage) ?? 0 }));

    const monthBuckets = new Map<
      string,
      { label: string; created: number; won: number; lost: number }
    >();
    const today = new Date();
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthBuckets.set(monthKey(d), { label: monthLabel(d), created: 0, won: 0, lost: 0 });
    }
    leadsByMonth.forEach((row) => {
      const key = monthKey(new Date(row.createdAt));
      const bucket = monthBuckets.get(key);
      if (!bucket) return;
      bucket.created += 1;
      if (row.stage === LeadStage.FECHADO) bucket.won += 1;
      if (row.stage === LeadStage.PERDIDO) bucket.lost += 1;
    });

    return {
      funnel,
      bySource: sourcesGroup
        .map((row) => ({
          source: row.source,
          count: row._count?._all ?? 0
        }))
        .sort((a, b) => b.count - a.count),
      monthly: Array.from(monthBuckets.values()),
      proposalsByStatus: Object.values(ProposalStatus).map((status) => ({
        status,
        count: proposalsByStatus.find((row) => row.status === status)?._count._all ?? 0
      })),
      tasksByStatus: Object.values(TaskStatus).map((status) => ({
        status,
        count: tasksByStatus.find((row) => row.status === status)?._count._all ?? 0
      })),
      conversion: {
        totalCreated: total,
        totalWon: won,
        totalLost: lost,
        winRate: total ? Math.round((won / total) * 100) : 0,
        lostRate: total ? Math.round((lost / total) * 100) : 0
      }
    };
  } catch {
    return {
      funnel: FUNNEL_STAGES.map((stage) => ({ stage, count: 0 })),
      bySource: [],
      monthly: [],
      proposalsByStatus: [],
      tasksByStatus: [],
      conversion: { lostRate: 0, winRate: 0, totalCreated: 0, totalWon: 0, totalLost: 0 }
    };
  }
}
