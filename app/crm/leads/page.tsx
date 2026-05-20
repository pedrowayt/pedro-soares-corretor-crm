import type { CSSProperties } from "react";
import { QuickLeadForm } from "@/components/crm/quick-forms";
import { listLeads } from "@/lib/data/crm";

export default async function CrmLeadsPage() {
  const leads = await listLeads();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Leads</h1>
      <p className="section-subtitle">Cadastro e acompanhamento de origem, interesse e próximo passo.</p>

      <div style={{ marginTop: 18, marginBottom: 20 }}>
        <QuickLeadForm />
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Contato</th>
              <th style={thStyle}>Origem</th>
              <th style={thStyle}>Interesse</th>
              <th style={thStyle}>Etapa</th>
                <th style={thStyle}>Imóvel/Empreendimento</th>
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
                <td style={tdStyle}>{lead.linkedProperty?.title ?? lead.linkedDevelopment?.title ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "12px 14px",
  borderBottom: "1px solid rgba(242,194,122,.2)",
  color: "var(--credibility-200)",
  fontSize: ".85rem"
};

const tdStyle: CSSProperties = {
  padding: "12px 14px",
  borderBottom: "1px solid rgba(242,194,122,.12)",
  fontSize: ".92rem"
};
