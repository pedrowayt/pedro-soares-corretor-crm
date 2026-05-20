import { listPipelineBoard } from "@/lib/data/crm";

export default async function CrmFunilPage() {
  const board = await listPipelineBoard();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Funil de vendas</h1>
      <p className="section-subtitle">Controle visual por etapa para não perder timing de follow-up.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginTop: 16 }}>
        {board.map((column) => (
          <article className="card" key={column.stage} style={{ padding: 12 }}>
            <p className="badge">{column.stage}</p>
            <h3 style={{ marginTop: 8 }}>{column.leads.length} lead(s)</h3>
            <div style={{ display: "grid", gap: 8 }}>
              {column.leads.slice(0, 4).map((lead) => (
                <div key={lead.id} style={{ border: "1px solid rgba(242,194,122,.2)", borderRadius: 10, padding: 8 }}>
                  <strong>{lead.name}</strong>
                  <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: ".85rem" }}>
                    {lead.linkedProperty?.title ?? "Sem imóvel vinculado"}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
