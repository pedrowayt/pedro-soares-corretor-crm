import {
  LeadStage,
  ProposalStatus,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
  Role,
  TaskStatus,
  VisitStatus
} from "@prisma/client";
import { PIPELINE_ORDER } from "@/lib/crm/pipeline";
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

const ADVANCED_LEAD_STAGES: LeadStage[] = [
  LeadStage.VISITA_AGENDADA,
  LeadStage.PROPOSTA_ENVIADA,
  LeadStage.NEGOCIACAO
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

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  CASA: "Casa",
  APARTAMENTO: "Apartamento",
  LOTE: "Lote",
  COMERCIAL: "Comercial",
  RURAL: "Rural",
  AREA_PRIVATIVA: "Área privativa",
  CASA_EM_CONDOMINIO: "Casa cond.",
  CASA_GEMINADA: "Casa geminada",
  CHACARA: "Chácara",
  CHACARA_EM_CONDOMINIO: "Chácara cond.",
  COBERTURA: "Cobertura",
  FAZENDA: "Fazenda",
  FLAT: "Flat",
  GALPAO: "Galpão",
  LOJA: "Loja",
  LOTE_EM_CONDOMINIO: "Lote cond.",
  PREDIO: "Prédio",
  SALA: "Sala",
  SOBRADO: "Sobrado"
};

const PROPERTY_PURPOSE_LABELS: Record<PropertyPurpose, string> = {
  VENDA: "Venda",
  LOCACAO: "Locação",
  INVESTIMENTO: "Investimento",
  LEILAO: "Leilão",
  LANCAMENTO: "Lançamento"
};

const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  DISPONIVEL: "Disponível",
  RESERVADO: "Reservado",
  VENDIDO: "Vendido",
  ALUGADO: "Alugado",
  EM_ANALISE: "Em análise"
};

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  CORRETOR: "Corretor",
  PARCEIRO: "Parceiro"
};

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

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
  return `${MONTH_LABELS[date.getMonth()]}/${String(date.getFullYear()).slice(2)}`;
}

function progress(value: number, total: number) {
  if (!total) return 0;
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

function asMoney(value: unknown) {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function makeDistribution<T extends string>(
  values: readonly T[],
  counts: Array<{ key: T; count: number }>,
  labels: Record<T, string>
) {
  const max = Math.max(...counts.map((item) => item.count), 1);
  return values
    .map((value) => {
      const count = counts.find((item) => item.key === value)?.count ?? 0;
      return {
        key: value,
        label: labels[value],
        count,
        percent: progress(count, max)
      };
    })
    .filter((item) => item.count > 0);
}

function profileInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PS";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export type DashboardSnapshot = Awaited<ReturnType<typeof getDashboardSnapshot>>;

export type SaasDashboardSnapshot = Awaited<ReturnType<typeof getSaasDashboardSnapshot>>;

export async function getSaasDashboardSnapshot(profile?: {
  name?: string | null;
  role?: Role | null;
  profilePhotoUrl?: string | null;
  creci?: string | null;
  jobTitle?: string | null;
}) {
  const today = new Date();
  const dayStart = startOfDay(today);
  const dayEnd = endOfDay(today);
  const yesterdayStart = startOfDay(daysAgo(1));
  const yesterdayEnd = endOfDay(daysAgo(1));
  const monthStart = startOfDay(new Date(today.getFullYear(), today.getMonth(), 1));
  const sevenDaysAhead = new Date(today);
  sevenDaysAhead.setDate(sevenDaysAhead.getDate() + 7);
  const hotThreshold = daysAgo(3);
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

  const profileName = profile?.name ?? "Pedro Soares";
  const profileRole = profile?.role ?? Role.CORRETOR;
  const emptyProfile = {
    name: profileName,
    role: profileRole,
    roleLabel: ROLE_LABELS[profileRole],
    photoUrl: profile?.profilePhotoUrl ?? null,
    creci: profile?.creci ?? null,
    jobTitle: profile?.jobTitle ?? null,
    initials: profileInitials(profileName)
  };

  if (!hasDatabase) {
    return {
      profile: emptyProfile,
      progressCards: [
        { id: "properties", label: "Imóveis ativos", value: 0, detail: "0 de 0 no estoque", progress: 0, tone: "gold" as const },
        { id: "leads", label: "Leads", value: 0, detail: "0 novos hoje", progress: 0, tone: "blue" as const },
        { id: "pipeline", label: "Pipeline", value: 0, detail: "0 leads avançados", progress: 0, tone: "green" as const },
        { id: "revenue", label: "Receita do mês", value: 0, detail: "0 fechados", progress: 0, tone: "gold" as const }
      ],
      charts: {
        monthly: [],
        funnel: PIPELINE_ORDER.filter((stage) => stage !== LeadStage.PERDIDO).map((stage) => ({ stage, count: 0 })),
        sources: [],
        propertyTypes: [],
        propertyPurposes: [],
        propertyStatuses: []
      },
      popularProperties: [],
      visitInsights: {
        today: 0,
        pendingUpcoming: 0,
        thisMonth: 0,
        completedThisMonth: 0,
        canceledThisMonth: 0,
        completionRate: 0,
        nextVisit: null
      },
      notifications: [],
      agenda: [],
      hotLeads: [],
      totals: {
        newLeadsToday: 0,
        visitsToday: 0,
        proposalsPending: 0,
        tasksPending: 0,
        activeLeads: 0
      },
      visitInsights: {
        today: 0,
        pendingUpcoming: 0,
        completedThisMonth: 0,
        thisMonth: 0,
        completionRate: 0,
        nextVisit: null,
      }
    };
  }

  try {
    const [
      totalProperties,
      activeProperties,
      totalLeads,
      activeLeads,
      newLeadsToday,
      newLeadsYesterday,
      visitsToday,
      proposalsPending,
      tasksPending,
      advancedLeads,
      pipelineLeads,
      monthWins,
      monthLosses,
      visitsThisMonth,
      visitsCompletedThisMonth,
      visitsCanceledThisMonth,
      pendingUpcomingVisits,
      hotLeads,
      upcomingVisits,
      upcomingTasks,
      leadsBySource,
      pipelineSummary,
      monthlyLeads,
      propertiesByType,
      propertiesByPurpose,
      propertiesByStatus,
      featuredProperties,
      totalVisitsThisMonth,
      completedVisitsThisMonth
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: PropertyStatus.DISPONIVEL } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { stage: { in: ACTIVE_LEAD_STAGES } } }),
      prisma.lead.count({ where: { createdAt: { gte: dayStart, lte: dayEnd } } }),
      prisma.lead.count({ where: { createdAt: { gte: yesterdayStart, lte: yesterdayEnd } } }),
      prisma.visit.count({
        where: {
          scheduledAt: { gte: dayStart, lte: dayEnd },
          status: { not: VisitStatus.CANCELADA }
        }
      }),
      prisma.proposal.count({
        where: { status: { in: [ProposalStatus.ENVIADA, ProposalStatus.CONTRA_PROPOSTA] } }
      }),
      prisma.task.count({ where: { status: TaskStatus.PENDENTE } }),
      prisma.lead.count({ where: { stage: { in: ADVANCED_LEAD_STAGES } } }),
      prisma.lead.findMany({
        where: { stage: { in: ACTIVE_LEAD_STAGES } },
        select: { budgetMax: true, linkedProperty: { select: { price: true } } }
      }),
      prisma.lead.findMany({
        where: {
          stage: LeadStage.FECHADO,
          updatedAt: { gte: monthStart }
        },
        select: { linkedProperty: { select: { price: true } } }
      }),
      prisma.lead.count({
        where: {
          stage: LeadStage.PERDIDO,
          updatedAt: { gte: monthStart }
        }
      }),
      prisma.visit.count({
        where: {
          scheduledAt: { gte: monthStart },
          status: { not: VisitStatus.CANCELADA }
        }
      }),
      prisma.visit.count({
        where: {
          scheduledAt: { gte: monthStart },
          status: VisitStatus.REALIZADA
        }
      }),
      prisma.visit.count({
        where: {
          scheduledAt: { gte: monthStart },
          status: VisitStatus.CANCELADA
        }
      }),
      prisma.visit.count({
        where: {
          scheduledAt: { gte: dayStart },
          status: { in: [VisitStatus.AGENDADA, VisitStatus.REAGENDADA] }
        }
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
          linkedProperty: { select: { id: true, slug: true, title: true, price: true } },
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
      prisma.lead.groupBy({ by: ["stage"], _count: { _all: true } }),
      prisma.lead.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true, stage: true }
      }),
      prisma.property.groupBy({ by: ["type"], _count: { _all: true } }),
      prisma.property.groupBy({ by: ["purpose"], _count: { _all: true } }),
      prisma.property.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.property.findMany({
        where: { status: PropertyStatus.DISPONIVEL },
        orderBy: [{ isInvestorHighlight: "desc" }, { updatedAt: "desc" }],
        take: 12,
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
          suites: true,
          bathrooms: true,
          parkingSpaces: true,
          areaM2: true,
          landAreaM2: true,
          isInvestorHighlight: true,
          updatedAt: true,
          media: {
            where: { kind: "IMAGE" },
            orderBy: { position: "asc" },
            take: 1,
            select: { url: true }
          },
          _count: {
            select: {
              leads: true,
              visits: true,
              proposals: true
            }
          }
        }
      }),
      prisma.visit.count({ where: { scheduledAt: { gte: monthStart } } }),
      prisma.visit.count({ where: { scheduledAt: { gte: monthStart }, status: VisitStatus.REALIZADA } })
    ]);

    const pipelineValue = pipelineLeads.reduce((total, lead) => {
      const price = lead.linkedProperty?.price ? asMoney(lead.linkedProperty.price) : asMoney(lead.budgetMax);
      return total + price;
    }, 0);

    const wonValueThisMonth = monthWins.reduce((total, lead) => {
      return total + asMoney(lead.linkedProperty?.price);
    }, 0);

    const sourceMax = Math.max(...leadsBySource.map((row) => row._count._all), 1);
    const stageMap = new Map(pipelineSummary.map((row) => [row.stage, row._count._all]));
    const monthBuckets = new Map<
      string,
      { label: string; created: number; won: number; lost: number }
    >();

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthBuckets.set(monthKey(date), { label: monthLabel(date), created: 0, won: 0, lost: 0 });
    }

    monthlyLeads.forEach((lead) => {
      const bucket = monthBuckets.get(monthKey(new Date(lead.createdAt)));
      if (!bucket) return;
      bucket.created += 1;
      if (lead.stage === LeadStage.FECHADO) bucket.won += 1;
      if (lead.stage === LeadStage.PERDIDO) bucket.lost += 1;
    });

    const popularProperties = featuredProperties
      .map((property) => ({
        id: property.id,
        href: `/crm/imoveis/${property.id}`,
        title: property.title,
        price: asMoney(property.price),
        location: [property.district, property.city].filter(Boolean).join(", "),
        type: PROPERTY_TYPE_LABELS[property.type],
        purpose: PROPERTY_PURPOSE_LABELS[property.purpose],
        bedrooms: property.bedrooms,
        suites: property.suites,
        bathrooms: property.bathrooms,
        parkingSpaces: property.parkingSpaces,
        areaM2: property.areaM2 ? Number(property.areaM2) : null,
        landAreaM2: property.landAreaM2 ? Number(property.landAreaM2) : null,
        imageUrl: property.media[0]?.url ?? null,
        isInvestorHighlight: property.isInvestorHighlight,
        leadsCount: property._count.leads,
        visitsCount: property._count.visits,
        proposalsCount: property._count.proposals,
        score:
          Number(property.isInvestorHighlight) * 20 +
          property._count.leads * 3 +
          property._count.visits * 2 +
          property._count.proposals * 5
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    const nextVisit = upcomingVisits[0]
      ? {
          id: upcomingVisits[0].id,
          leadId: upcomingVisits[0].lead.id,
          leadName: upcomingVisits[0].lead.name,
          propertyTitle: upcomingVisits[0].property.title,
          scheduledAt: upcomingVisits[0].scheduledAt,
          status: upcomingVisits[0].status
        }
      : null;

    return {
      profile: emptyProfile,
      progressCards: [
        {
          id: "properties",
          label: "Imóveis ativos",
          value: activeProperties,
          detail: `${activeProperties} de ${totalProperties} no estoque`,
          progress: progress(activeProperties, totalProperties),
          tone: "gold" as const
        },
        {
          id: "leads",
          label: "Leads",
          value: activeLeads,
          detail: `${newLeadsToday} novos hoje · ${newLeadsToday - newLeadsYesterday >= 0 ? "+" : ""}${newLeadsToday - newLeadsYesterday} vs ontem`,
          progress: progress(activeLeads, totalLeads),
          tone: "blue" as const
        },
        {
          id: "pipeline",
          label: "Pipeline",
          value: pipelineValue,
          detail: `${advancedLeads} leads em fases avançadas`,
          progress: progress(advancedLeads, activeLeads),
          tone: "green" as const
        },
        {
          id: "revenue",
          label: "Receita do mês",
          value: wonValueThisMonth,
          detail: `${monthWins.length} fechados · taxa de ganho mensal`,
          progress: progress(monthWins.length, monthWins.length + monthLosses),
          tone: "gold" as const
        }
      ],
      charts: {
        monthly: Array.from(monthBuckets.values()),
        funnel: PIPELINE_ORDER.filter((stage) => stage !== LeadStage.PERDIDO).map((stage) => ({
          stage,
          count: stageMap.get(stage) ?? 0
        })),
        sources: leadsBySource
          .map((row) => ({
            label: row.source,
            count: row._count._all,
            percent: progress(row._count._all, sourceMax)
          }))
          .sort((a, b) => b.count - a.count),
        propertyTypes: makeDistribution(
          Object.values(PropertyType),
          propertiesByType.map((row) => ({ key: row.type, count: row._count._all })),
          PROPERTY_TYPE_LABELS
        ),
        propertyPurposes: makeDistribution(
          Object.values(PropertyPurpose),
          propertiesByPurpose.map((row) => ({ key: row.purpose, count: row._count._all })),
          PROPERTY_PURPOSE_LABELS
        ),
        propertyStatuses: makeDistribution(
          Object.values(PropertyStatus),
          propertiesByStatus.map((row) => ({ key: row.status, count: row._count._all })),
          PROPERTY_STATUS_LABELS
        )
      },
      popularProperties,
      visitInsights: {
        today: visitsToday,
        pendingUpcoming: pendingUpcomingVisits,
        thisMonth: visitsThisMonth,
        completedThisMonth: visitsCompletedThisMonth,
        canceledThisMonth: visitsCanceledThisMonth,
        completionRate: progress(visitsCompletedThisMonth, visitsThisMonth),
        nextVisit
      },
      notifications: [
        {
          id: "hot-leads",
          label: "Follow-up",
          title: `${hotLeads.length} leads precisam de contato`,
          detail: hotLeads.length > 0 ? "Sem contato há 3+ dias" : "Carteira em dia",
          tone: hotLeads.length > 0 ? "warn" : "success"
        },
        {
          id: "proposals",
          label: "Propostas",
          title: `${proposalsPending} em aberto`,
          detail: "Enviadas ou em contraproposta",
          tone: proposalsPending > 0 ? "gold" : "neutral"
        },
        {
          id: "visits",
          label: "Agenda",
          title: `${visitsToday} visitas hoje`,
          detail: `${pendingUpcomingVisits} próximas · ${visitsCompletedThisMonth}/${visitsThisMonth} realizadas no mês`,
          tone: visitsToday > 0 ? "blue" : "neutral"
        },
        {
          id: "tasks",
          label: "Tarefas",
          title: `${tasksPending} pendentes`,
          detail: "Follow-ups e rotina comercial",
          tone: tasksPending > 0 ? "warn" : "success"
        }
      ],
      agenda: [
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
      hotLeads,
      totals: {
        newLeadsToday,
        visitsToday,
        proposalsPending,
        tasksPending,
        activeLeads
      },
      visitInsights: {
        today: visitsToday,
        pendingUpcoming: upcomingVisits.length,
        completedThisMonth: completedVisitsThisMonth,
        thisMonth: totalVisitsThisMonth,
        completionRate: totalVisitsThisMonth > 0 ? Math.round((completedVisitsThisMonth / totalVisitsThisMonth) * 100) : 0,
        nextVisit: upcomingVisits[0]
          ? {
              leadId: upcomingVisits[0].lead.id,
              propertyTitle: upcomingVisits[0].property.title,
              scheduledAt: upcomingVisits[0].scheduledAt,
              leadName: upcomingVisits[0].lead.name,
            }
          : null,
      }
    };
  } catch {
    return {
      profile: emptyProfile,
      progressCards: [
        { id: "properties", label: "Imóveis ativos", value: 0, detail: "0 de 0 no estoque", progress: 0, tone: "gold" as const },
        { id: "leads", label: "Leads", value: 0, detail: "0 novos hoje", progress: 0, tone: "blue" as const },
        { id: "pipeline", label: "Pipeline", value: 0, detail: "0 leads avançados", progress: 0, tone: "green" as const },
        { id: "revenue", label: "Receita do mês", value: 0, detail: "0 fechados", progress: 0, tone: "gold" as const }
      ],
      charts: {
        monthly: [],
        funnel: PIPELINE_ORDER.filter((stage) => stage !== LeadStage.PERDIDO).map((stage) => ({ stage, count: 0 })),
        sources: [],
        propertyTypes: [],
        propertyPurposes: [],
        propertyStatuses: []
      },
      popularProperties: [],
      visitInsights: {
        today: 0,
        pendingUpcoming: 0,
        thisMonth: 0,
        completedThisMonth: 0,
        canceledThisMonth: 0,
        completionRate: 0,
        nextVisit: null
      },
      notifications: [],
      agenda: [],
      hotLeads: [],
      totals: {
        newLeadsToday: 0,
        visitsToday: 0,
        proposalsPending: 0,
        tasksPending: 0,
        activeLeads: 0
      },
      visitInsights: {
        today: 0,
        pendingUpcoming: 0,
        completedThisMonth: 0,
        thisMonth: 0,
        completionRate: 0,
        nextVisit: null,
      }
    };
  }
}

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
