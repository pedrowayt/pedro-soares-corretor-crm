import { listPipelineBoard } from "@/lib/data/crm";

export default async function CrmFunilPage() {
  const board = await listPipelineBoard();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Funil de vendas</h1>
      <p className="section-subtitle">Controle visual por etapa para não perder timing de follow-up.</p>

      <div className="crm-pipeline-board">
        {board.map((column) => (
          <article className="crm-pipeline-column" key={column.stage}>
            <header className="crm-pipeline-column__head">
              <span className="crm-pipeline-column__stage">{column.stage}</span>
              <span className="crm-pipeline-column__count">{column.leads.length}</span>
            </header>
            <div className="crm-pipeline-column__list">
              {column.leads.slice(0, 6).map((lead) => (
                <div key={lead.id} className="crm-pipeline-lead">
                  <strong>{lead.name}</strong>
                  <p>{lead.linkedProperty?.title ?? "Sem imóvel vinculado"}</p>
                </div>
              ))}
              {column.leads.length === 0 ? (
                <p className="crm-pipeline-column__empty">Nenhum lead nesta etapa.</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
