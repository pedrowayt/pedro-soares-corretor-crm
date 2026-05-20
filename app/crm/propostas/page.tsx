import { QuickProposalForm } from "@/components/crm/quick-forms";
import { listProposals } from "@/lib/data/crm";
import { formatCurrencyBRL } from "@/lib/utils";

export default async function CrmPropostasPage() {
  const proposals = await listProposals();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Propostas</h1>
      <p className="section-subtitle">Gestão de propostas enviadas, negociação e fechamento.</p>

      <div style={{ marginTop: 16, marginBottom: 18 }}>
        <QuickProposalForm />
      </div>

      <div className="grid-3">
        {proposals.map((proposal) => (
          <article className="card" key={proposal.id} style={{ padding: 14 }}>
            <p className="badge">{proposal.status}</p>
            <h3 style={{ marginBottom: 8 }}>{proposal.lead.name}</h3>
            <p style={{ margin: "4px 0", color: "var(--text-muted)" }}>{proposal.property.title}</p>
            <p style={{ margin: "4px 0", color: "var(--sophistication-gold-300)", fontWeight: 700 }}>
              {formatCurrencyBRL(Number(proposal.offeredValue))}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
