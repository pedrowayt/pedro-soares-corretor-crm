import Link from "next/link";
import type { CSSProperties } from "react";
import { getPortalIntegrationDashboard } from "@/lib/data/portal-publications";
import { formatCurrencyBRL } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDENTE: "Aguardando envio",
  PUBLICADO: "Publicado",
  ERRO: "Com erro",
  PAUSADO: "Pausado",
  REMOVIDO: "Removido"
};

function formatDate(value: string | null) {
  if (!value) return "Nunca";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Nunca";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default async function CrmIntegracoesPage() {
  const dashboard = await getPortalIntegrationDashboard();
  const activePublications = dashboard.publications.filter((row) => row.status !== "REMOVIDO");

  return (
    <div className="crm-integrations-page">
      <header className="crm-reports__head">
        <h1 className="section-title" style={{ marginTop: 0 }}>Integrações</h1>
        <p className="section-subtitle">
          Portais imobiliários, feeds XML e status de publicação dos imóveis.
        </p>
      </header>

      <section className="crm-kpi-grid" style={{ marginTop: 18 }}>
        <article className="crm-kpi-card crm-kpi-card--highlight">
          <span className="crm-kpi-card__label">Portais ativos</span>
          <strong className="crm-kpi-card__value">{dashboard.totals.activePortals}</strong>
          <span className="crm-kpi-card__delta is-neutral">OLX + VRSync</span>
        </article>
        <article className="crm-kpi-card">
          <span className="crm-kpi-card__label">Imóveis selecionados</span>
          <strong className="crm-kpi-card__value">{dashboard.totals.selectedProperties}</strong>
          <span className="crm-kpi-card__delta is-neutral">Por portal</span>
        </article>
        <article className="crm-kpi-card">
          <span className="crm-kpi-card__label">Prontos para XML</span>
          <strong className="crm-kpi-card__value">{dashboard.totals.readyProperties}</strong>
          <span className="crm-kpi-card__delta is-up">Checklist aprovado</span>
        </article>
        <article className="crm-kpi-card">
          <span className="crm-kpi-card__label">Leads dos portais</span>
          <strong className="crm-kpi-card__value">{dashboard.totals.portalLeads}</strong>
          <span className="crm-kpi-card__delta is-neutral">Origem PORTAL</span>
        </article>
      </section>

      <section className="crm-dashboard__grid" style={{ marginTop: 18 }}>
        {dashboard.portals.map((portal) => (
          <article key={portal.portalName} className="crm-panel">
            <header className="crm-panel__head">
              <h2>{portal.portalLabel}</h2>
              <span className="badge">{portal.type}</span>
            </header>
            <p className="crm-panel__empty">{portal.description}</p>
            <div className="crm-integrations-metrics">
              <span><strong>{portal.activeCount}</strong> ativos</span>
              <span><strong>{portal.readyCount}</strong> prontos</span>
              <span><strong>{portal.errorCount}</strong> erros</span>
            </div>
            <dl className="crm-summary-card__fields" style={{ margin: 0 }}>
              <div>
                <dt>XML público</dt>
                <dd>
                  <a href={portal.feedUrl} target="_blank" rel="noopener noreferrer">
                    {portal.feedUrl}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Última sincronização</dt>
                <dd>{formatDate(portal.lastSyncAt)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <section className="crm-panel" style={{ marginTop: 18 }}>
        <header className="crm-panel__head">
          <h2>Imóveis publicados</h2>
          <Link href="/crm/imoveis" className="crm-panel__more">Gerenciar imóveis</Link>
        </header>

        <div className="crm-table-host" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Imóvel</th>
                <th style={thStyle}>Portal</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Checklist</th>
                <th style={thStyle}>Local</th>
                <th style={thStyle}>Preço</th>
                <th style={thStyle}>Última sync</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {activePublications.map((row) => (
                <tr key={row.id}>
                  <td style={tdStyle}>
                    <strong>{row.title}</strong>
                    <br />
                    <span style={{ color: "var(--text-muted)" }}>{row.propertyType} • {row.propertyPurpose}</span>
                  </td>
                  <td style={tdStyle}>{row.portalLabel}</td>
                  <td style={tdStyle}>{STATUS_LABELS[row.status] ?? row.status}</td>
                  <td style={tdStyle}>
                    {row.checklist.ready ? "Pronto" : `${row.checklist.percent}%`}
                    {!row.checklist.ready && row.checklist.blockingIssues[0] ? (
                      <span style={{ display: "block", color: "#b91c1c", fontSize: "0.75rem" }}>
                        {row.checklist.blockingIssues[0].label}
                      </span>
                    ) : null}
                  </td>
                  <td style={tdStyle}>{row.city} / {row.district}</td>
                  <td style={tdStyle}>{formatCurrencyBRL(row.price)}</td>
                  <td style={tdStyle}>{formatDate(row.lastSyncAt)}</td>
                  <td style={tdStyle}>
                    <Link href={`/crm/imoveis/${row.propertyId}#portais`} className="button button-ghost">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {activePublications.length === 0 ? (
                <tr>
                  <td style={tdStyle} colSpan={8}>Nenhum imóvel selecionado para portais ainda.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "12px 14px",
  borderBottom: "1px solid rgba(242,194,122,.2)",
  color: "var(--credibility-200)",
  fontSize: "var(--fs-12)"
};

const tdStyle: CSSProperties = {
  padding: "12px 14px",
  borderBottom: "1px solid rgba(242,194,122,.12)",
  fontSize: "var(--fs-14)",
  verticalAlign: "top"
};
