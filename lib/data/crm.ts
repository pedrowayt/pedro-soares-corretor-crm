import { PIPELINE_ORDER } from "@/lib/crm/pipeline";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export async function listLeads() {
  if (!hasDatabase) return [];
  try {
    return await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        linkedProperty: true,
        linkedDevelopment: true,
        linkedDevelopmentUnitType: true,
        ownerUser: true
      }
    });
  } catch {
    return [];
  }
}

export async function listProperties() {
  if (!hasDatabase) return [];
  try {
    return await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        owner: true,
        investorOpportunity: true,
        auctionCase: true
      }
    });
  } catch {
    return [];
  }
}

export async function listOwners() {
  if (!hasDatabase) return [];
  try {
    return await prisma.owner.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        properties: {
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            purpose: true,
            status: true,
            price: true,
            city: true,
            district: true,
            updatedAt: true
          }
        },
        leads: {
          select: { id: true }
        }
      }
    });
  } catch {
    return [];
  }
}

export async function listVisits() {
  if (!hasDatabase) return [];
  try {
    return await prisma.visit.findMany({
      orderBy: { scheduledAt: "asc" },
      include: {
        lead: true,
        property: true,
        assignedTo: true
      }
    });
  } catch {
    return [];
  }
}

export async function listProposals() {
  if (!hasDatabase) return [];
  try {
    return await prisma.proposal.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        lead: true,
        property: true,
        createdBy: true
      }
    });
  } catch {
    return [];
  }
}

export async function listTasks() {
  if (!hasDatabase) return [];
  try {
    return await prisma.task.findMany({
      orderBy: [{ status: "asc" }, { dueAt: "asc" }],
      include: {
        lead: true,
        property: true,
        assignedTo: true
      }
    });
  } catch {
    return [];
  }
}

export async function listPipelineBoard() {
  if (!hasDatabase) {
    return PIPELINE_ORDER.map((stage) => ({ stage, leads: [] }));
  }

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        linkedProperty: true
      }
    });

    return PIPELINE_ORDER.map((stage) => ({
      stage,
      leads: leads.filter((lead) => lead.stage === stage)
    }));
  } catch {
    return PIPELINE_ORDER.map((stage) => ({ stage, leads: [] }));
  }
}

/**
 * Variant of listPipelineBoard that also includes lightweight activity counts
 * (visits, proposals, interactions) so the Kanban can render the lead score
 * inline without N+1 queries.
 */
export async function listPipelineBoardWithSignals() {
  if (!hasDatabase) {
    return PIPELINE_ORDER.map((stage) => ({ stage, leads: [] as LeadWithSignals[] }));
  }

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        linkedProperty: { select: { title: true, price: true } },
        _count: { select: { visits: true, proposals: true, interactions: true } }
      }
    });

    return PIPELINE_ORDER.map((stage) => ({
      stage,
      leads: leads.filter((lead) => lead.stage === stage)
    }));
  } catch {
    return PIPELINE_ORDER.map((stage) => ({ stage, leads: [] as LeadWithSignals[] }));
  }
}

type LeadWithSignals = Awaited<ReturnType<typeof prisma.lead.findMany>>[number] & {
  linkedProperty?: { title: string; price: unknown } | null;
  _count?: { visits: number; proposals: number; interactions: number };
};

export async function getReportSummary() {
  if (!hasDatabase) {
    return {
      leadsByStage: [],
      proposalsByStatus: [],
      tasksByStatus: []
    };
  }

  try {
    const [leadsByStage, proposalsByStatus, tasksByStatus] = await Promise.all([
      prisma.lead.groupBy({ by: ["stage"], _count: { _all: true } }),
      prisma.proposal.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.task.groupBy({ by: ["status"], _count: { _all: true } })
    ]);

    return {
      leadsByStage,
      proposalsByStatus,
      tasksByStatus
    };
  } catch {
    return {
      leadsByStage: [],
      proposalsByStatus: [],
      tasksByStatus: []
    };
  }
}
