import { LandingPageEventType, LandingPageStatus, LandingPageType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export const LANDING_PAGE_TYPE_LABELS: Record<LandingPageType, string> = {
  DEVELOPMENT: "Lançamento",
  CAMPAIGN: "Campanha",
  REGION: "Região",
  CAPTURE: "Captação"
};

export const LANDING_PAGE_STATUS_LABELS: Record<LandingPageStatus, string> = {
  DRAFT: "Rascunho",
  REVIEW: "Em revisão",
  PUBLISHED: "Publicada",
  PAUSED: "Pausada",
  ARCHIVED: "Arquivada"
};

export type LandingPageCaptureRef = {
  slug?: string | null;
  publicPath?: string | null;
};

export async function listCrmLandingPages() {
  if (!hasDatabase) return [];

  try {
    const pages = await prisma.landingPage.findMany({
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      include: {
        _count: { select: { leads: true } }
      }
    });

    const metricsByPage = new Map<string, Record<string, number>>();
    try {
      const events = await prisma.landingPageEvent.groupBy({
        by: ["landingPageId", "type"],
        _count: { _all: true }
      });
      for (const event of events) {
        const metrics = metricsByPage.get(event.landingPageId) ?? {};
        metrics[event.type] = event._count._all;
        metricsByPage.set(event.landingPageId, metrics);
      }
    } catch {
      // The dashboard remains usable while analytics migration is rolling out.
    }

    const visitsByPage = new Map<string, number>();
    try {
      const visits = await prisma.visit.findMany({
        where: { lead: { landingPageId: { in: pages.map((page) => page.id) } } },
        select: { lead: { select: { landingPageId: true } } }
      });
      for (const visit of visits) {
        const landingPageId = visit.lead.landingPageId;
        if (landingPageId) visitsByPage.set(landingPageId, (visitsByPage.get(landingPageId) ?? 0) + 1);
      }
    } catch {
      // Commercial visits are optional and must not hide the page registry.
    }

    return pages.map((page) => {
      const events = metricsByPage.get(page.id) ?? {};
      const pageViews = events.PAGE_VIEW ?? 0;
      const conversions = events.FORM_SUBMISSION ?? page._count.leads;
      return {
        ...page,
        metrics: {
          visits: pageViews,
          whatsappClicks: events.WHATSAPP_CLICK ?? 0,
          ctaClicks: events.CTA_CLICK ?? 0,
          downloads: events.DOWNLOAD ?? 0,
          conversions,
          commercialVisits: visitsByPage.get(page.id) ?? 0,
          conversionRate: pageViews ? Math.round((conversions / pageViews) * 10000) / 100 : 0
        }
      };
    });
  } catch {
    return [];
  }
}

export async function resolveLandingPage(ref: LandingPageCaptureRef) {
  if (!hasDatabase || (!ref.slug && !ref.publicPath)) return null;

  const where: Prisma.LandingPageWhereInput = {
    OR: [
      ...(ref.slug ? [{ slug: ref.slug }] : []),
      ...(ref.publicPath ? [{ publicPath: ref.publicPath }] : [])
    ]
  };

  try {
    return await prisma.landingPage.findFirst({ where });
  } catch {
    // Attribution is optional during a rollout; the existing sourcePage flow
    // remains available as the human-readable fallback.
    return null;
  }
}

export async function recordLandingPageEvent(
  landingPageId: string | null | undefined,
  type: LandingPageEventType,
  metadata?: Record<string, string>
) {
  if (!hasDatabase || !landingPageId) return;

  try {
    await prisma.landingPageEvent.create({
      data: { landingPageId, type, metadata }
    });
  } catch {
    // Analytics must never block lead capture or WhatsApp attribution.
  }
}

export async function ensureLandingPageTask(leadId: string, landingPageName: string) {
  if (!hasDatabase) return;

  const title = `Fazer primeiro contato — ${landingPageName}`;

  try {
    const existing = await prisma.task.findFirst({
      where: {
        leadId,
        status: "PENDENTE",
        title
      },
      select: { id: true }
    });

    if (existing) return;

    await prisma.task.create({
      data: {
        title,
        description: "Lead captado por landing page. Fazer contato e registrar o próximo passo no CRM.",
        priority: "ALTA",
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        leadId
      }
    });
  } catch {
    // Task creation is an operational enhancement and must not invalidate a
    // lead capture if the task table is temporarily unavailable.
  }
}
