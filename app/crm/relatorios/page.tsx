import { getReportSummary } from "@/lib/data/crm";

export default async function CrmRelatoriosPage() {
  const reports = await getReportSummary();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Relatórios</h1>
      <p className="section-subtitle">Visão de conversão, produtividade operacional e saúde da carteira.</p>

      <div className="grid-3" style={{ marginTop: 16 }}>
        <article className="card" style={{ padding: 14 }}>
          <h3 style={{ marginTop: 0 }}>Leads por etapa</h3>
          <ul>
            {reports.leadsByStage.map((item) => (
              <li key={item.stage}>
                {item.stage}: {item._count._all}
              </li>
            ))}
          </ul>
        </article>

        <article className="card" style={{ padding: 14 }}>
          <h3 style={{ marginTop: 0 }}>Propostas por status</h3>
          <ul>
            {reports.proposalsByStatus.map((item) => (
              <li key={item.status}>
                {item.status}: {item._count._all}
              </li>
            ))}
          </ul>
        </article>

        <article className="card" style={{ padding: 14 }}>
          <h3 style={{ marginTop: 0 }}>Tarefas por status</h3>
          <ul>
            {reports.tasksByStatus.map((item) => (
              <li key={item.status}>
                {item.status}: {item._count._all}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </>
  );
}
