import { QuickProposalForm } from "@/components/crm/quick-forms";
import { listProposals } from "@/lib/data/crm";
import { formatCurrencyBRL } from "@/lib/utils";

export default async function CrmPropostasPage() {
  const proposals = await listProposals();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Propostas</h1>
      <p className="section-subtitle">Gestão de propostas enviadas, negociação e fechamento.</p>

      <div id="quick-create" className="crm-quick-form-target" style={{ marginTop: 16, marginBottom: 18 }}>
        <QuickProposalForm />
      </div>

      <ul className="crm-summary-grid" aria-label="Propostas">
        {proposals.map((proposal) => (
          <li className="crm-summary-card" key={proposal.id}>
            <header className="crm-summary-card__head">
              <strong className="crm-summary-card__title">{proposal.lead.name}</strong>
              <span className="crm-summary-card__pill">{proposal.status}</span>
            </header>
            <dl className="crm-summary-card__fields">
              <div className="crm-summary-card__fields-wide">
                <dt>Imóvel</dt>
                <dd>{proposal.property.title}</dd>
              </div>
            </dl>
            <p className="crm-summary-card__price">
              {formatCurrencyBRL(Number(proposal.offeredValue))}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
