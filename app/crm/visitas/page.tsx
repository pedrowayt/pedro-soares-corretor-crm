import { QuickVisitForm } from "@/components/crm/quick-forms";
import { listVisits } from "@/lib/data/crm";

export default async function CrmVisitasPage() {
  const visits = await listVisits();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Visitas</h1>
      <p className="section-subtitle">Agendamento, confirmação e histórico de visitas por lead e imóvel.</p>

      <div id="quick-create" className="crm-quick-form-target" style={{ marginTop: 16, marginBottom: 18 }}>
        <QuickVisitForm />
      </div>

      <ul className="crm-summary-grid" aria-label="Visitas">
        {visits.map((visit) => (
          <li className="crm-summary-card" key={visit.id}>
            <header className="crm-summary-card__head">
              <strong className="crm-summary-card__title">{visit.lead.name}</strong>
              <span className="crm-summary-card__pill">{visit.status}</span>
            </header>
            <dl className="crm-summary-card__fields">
              <div className="crm-summary-card__fields-wide">
                <dt>Imóvel</dt>
                <dd>{visit.property.title}</dd>
              </div>
              <div className="crm-summary-card__fields-wide">
                <dt>Quando</dt>
                <dd>{new Date(visit.scheduledAt).toLocaleString("pt-BR")}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
