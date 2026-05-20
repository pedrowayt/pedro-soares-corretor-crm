import { getDashboardMetrics, getPipelineSummary } from "@/lib/data/dashboard";

export default async function CrmDashboardPage() {
  const [metrics, pipeline] = await Promise.all([getDashboardMetrics(), getPipelineSummary()]);

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Dashboard</h1>
      <p className="section-subtitle">Visão geral da captação, avanço de funil e oportunidades em carteira.</p>

      <div className="metric-grid" style={{ marginTop: 16 }}>
        <article className="metric-card">
          <p className="badge">Leads</p>
          <h3>{metrics.totalLeads}</h3>
        </article>
        <article className="metric-card">
          <p className="badge">Visitas</p>
          <h3>{metrics.visitsCount}</h3>
        </article>
        <article className="metric-card">
          <p className="badge">Propostas</p>
          <h3>{metrics.proposalsCount}</h3>
        </article>
        <article className="metric-card">
          <p className="badge">Fechados</p>
          <h3>{metrics.closedCount}</h3>
        </article>
      </div>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Origem dos leads</h2>
        <div className="grid-3">
          {metrics.leadsBySource.length ? (
            metrics.leadsBySource.map((item) => (
              <article className="card" style={{ padding: 14 }} key={item.source}>
                <p className="badge">{item.source}</p>
                <h3>{item._count._all}</h3>
              </article>
            ))
          ) : (
            <article className="card" style={{ padding: 14, gridColumn: "1 / -1" }}>
              Sem dados de origem de leads.
            </article>
          )}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Resumo do funil</h2>
        <div className="grid-3">
          {pipeline.map((item) => (
            <article key={item.stage} className="card" style={{ padding: 12 }}>
              <p className="badge">{item.stage}</p>
              <h3>{item._count._all}</h3>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
