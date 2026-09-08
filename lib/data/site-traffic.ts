import { LeadSource } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);
const PERIOD_DAYS = 28;

export type SiteTrafficSnapshot = {
  periodDays: number;
  totals: {
    todayPageViews: number;
    periodPageViews: number;
    periodSessions: number;
    periodLeads: number;
    conversionRate: number;
  };
  daily: Array<{ label: string; pageViews: number; sessions: number }>;
  topPages: Array<{ label: string; count: number; percent: number }>;
  sources: Array<{ label: string; count: number; percent: number }>;
};

export function emptySiteTrafficSnapshot(): SiteTrafficSnapshot {
  return {
    periodDays: PERIOD_DAYS,
    totals: {
      todayPageViews: 0,
      periodPageViews: 0,
      periodSessions: 0,
      periodLeads: 0,
      conversionRate: 0
    },
    daily: [],
    topPages: [],
    sources: []
  };
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function labelForDate(date: Date) {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function percent(count: number, total: number) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

export async function getSiteTrafficSnapshot(): Promise<SiteTrafficSnapshot> {
  if (!hasDatabase) return emptySiteTrafficSnapshot();

  const today = new Date();
  const todayStart = startOfDay(today);
  const periodStart = new Date(todayStart);
  periodStart.setDate(periodStart.getDate() - (PERIOD_DAYS - 1));

  try {
    const [visits, periodLeads] = await Promise.all([
      prisma.siteVisit.findMany({
        where: { createdAt: { gte: periodStart } },
        select: { createdAt: true, sessionId: true, path: true, source: true, referrer: true }
      }),
      prisma.lead.count({
        where: {
          createdAt: { gte: periodStart },
          source: { in: [LeadSource.SITE, LeadSource.WHATSAPP] }
        }
      })
    ]);

    const dailyBuckets = new Map<string, { label: string; pageViews: number; sessions: Set<string> }>();
    for (let index = 0; index < PERIOD_DAYS; index += 1) {
      const date = new Date(periodStart);
      date.setDate(periodStart.getDate() + index);
      dailyBuckets.set(dateKey(date), { label: labelForDate(date), pageViews: 0, sessions: new Set() });
    }

    const pageCounts = new Map<string, number>();
    const sourceCounts = new Map<string, number>();
    const sessions = new Set<string>();

    visits.forEach((visit) => {
      const createdAt = new Date(visit.createdAt);
      const bucket = dailyBuckets.get(dateKey(createdAt));
      if (bucket) {
        bucket.pageViews += 1;
        bucket.sessions.add(visit.sessionId);
      }

      sessions.add(visit.sessionId);
      pageCounts.set(visit.path, (pageCounts.get(visit.path) ?? 0) + 1);
      const source = visit.source || (visit.referrer ? "Referência" : "Direto");
      sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
    });

    const pageTotal = visits.length;
    const topPages = [...pageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, count]) => ({ label, count, percent: percent(count, Math.max(...pageCounts.values(), 1)) }));
    const sources = [...sourceCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, count]) => ({ label, count, percent: percent(count, Math.max(...sourceCounts.values(), 1)) }));

    return {
      periodDays: PERIOD_DAYS,
      totals: {
        todayPageViews: visits.filter((visit) => new Date(visit.createdAt) >= todayStart).length,
        periodPageViews: pageTotal,
        periodSessions: sessions.size,
        periodLeads,
        conversionRate: percent(periodLeads, sessions.size)
      },
      daily: [...dailyBuckets.values()].map((bucket) => ({
        label: bucket.label,
        pageViews: bucket.pageViews,
        sessions: bucket.sessions.size
      })),
      topPages,
      sources
    };
  } catch {
    return emptySiteTrafficSnapshot();
  }
}
