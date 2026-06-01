import { PipelineKanban } from "@/components/crm/pipeline-kanban";
import { listPipelineBoardWithSignals } from "@/lib/data/crm";

export default async function CrmFunilPage() {
  const board = await listPipelineBoardWithSignals();

  const initialColumns = board.map((column) => ({
    stage: column.stage,
    leads: column.leads.map((lead) => {
      const counts = (lead as { _count?: { visits: number; proposals: number; interactions: number } })._count;
      const linkedProperty = (lead as { linkedProperty?: { title?: string; price?: unknown } | null })
        .linkedProperty;
      return {
        id: lead.id,
        name: lead.name,
        stage: lead.stage,
        source: lead.source,
        intent: lead.intent,
        createdAt: lead.createdAt.toISOString(),
        lastContactAt: lead.lastContactAt ? lead.lastContactAt.toISOString() : null,
        linkedPropertyTitle: linkedProperty?.title ?? null,
        linkedPropertyPrice: linkedProperty?.price ? Number(linkedProperty.price) : null,
        budgetMax: lead.budgetMax ? Number(lead.budgetMax) : null,
        visitsCount: counts?.visits ?? 0,
        proposalsCount: counts?.proposals ?? 0,
        interactionsCount: counts?.interactions ?? 0
      };
    })
  }));

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>
        Funil de vendas
      </h1>
      <p className="section-subtitle">
        Arraste e solte os cards para mover entre etapas. As transições inválidas ficam bloqueadas.
      </p>

      <PipelineKanban initialColumns={initialColumns} />
    </>
  );
}
