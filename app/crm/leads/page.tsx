import type { CSSProperties } from "react";
import { LeadDevelopmentStatusControl } from "@/components/crm/lead-development-status-control";
import { QuickLeadForm } from "@/components/crm/quick-forms";
import { listLeads } from "@/lib/data/crm";

function buildContext(lead: Awaited<ReturnType<typeof listLeads>>[number]) {
  if (lead.linkedProperty?.title) return lead.linkedProperty.title;
  if (lead.linkedDevelopment) {
    const dev = lead.linkedDevelopment.title;
    const unit = lead.linkedDevelopmentUnitType?.name;
    return unit ? `${dev} • ${unit}` : dev;
  }
  return "—";
}

export default async function CrmLeadsPage() {
  const leads = await listLeads();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Leads</h1>
      <p className="section-subtitle">Cadastro e acompanhamento de origem, interesse e próximo passo.</p>

      <div style={{ marginTop: 18, marginBottom: 20 }}>
        <QuickLeadForm />
      </div>

      {/* Desktop table */}
      <div className="card crm-table-host" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Contato</th>
              <th style={thStyle}>Origem</th>
              <th style={thStyle}>Interesse</th>
              <th style={thStyle}>Etapa</th>
              <th style={thStyle}>Contexto</th>
              <th style={thStyle}>Status lançamento</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td style={tdStyle}>{lead.name}</td>
                <td style={tdStyle}>{lead.phone}</td>
                <td style={tdStyle}>{lead.source}</td>
                <td style={tdStyle}>{lead.intent}</td>
                <td style={tdStyle}>{lead.stage}</td>
                <td style={tdStyle}>{buildContext(lead)}</td>
                <td style={tdStyle}>
                  <LeadDevelopmentStatusControl
                    leadId={lead.id}
                    initialStatus={lead.developmentLeadStatus}
                    disabled={!lead.linkedDevelopmentId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <ul className="crm-record-cards" aria-label="Leads">
        {leads.map((lead) => (
          <li className="crm-record-card" key={`m-${lead.id}`}>
            <header className="crm-record-card__head">
              <strong className="crm-record-card__title">{lead.name}</strong>
              <span className="crm-record-card__pill">{lead.stage}</span>
            </header>
            <dl className="crm-record-card__fields">
              <div>
                <dt>Contato</dt>
                <dd>{lead.phone}</dd>
              </div>
              <div>
                <dt>Origem</dt>
                <dd>{lead.source}</dd>
              </div>
              <div>
                <dt>Interesse</dt>
                <dd>{lead.intent}</dd>
              </div>
              <div className="crm-record-card__fields-wide">
                <dt>Contexto</dt>
                <dd>{buildContext(lead)}</dd>
              </div>
            </dl>
            <footer className="crm-record-card__footer">
              <LeadDevelopmentStatusControl
                leadId={lead.id}
                initialStatus={lead.developmentLeadStatus}
                disabled={!lead.linkedDevelopmentId}
              />
            </footer>
          </li>
        ))}
      </ul>
    </>
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
  fontSize: "var(--fs-14)"
};
