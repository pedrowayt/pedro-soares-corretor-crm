import { QuickVisitForm } from "@/components/crm/quick-forms";
import { listVisits } from "@/lib/data/crm";

export default async function CrmVisitasPage() {
  const visits = await listVisits();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Visitas</h1>
      <p className="section-subtitle">Agendamento, confirmação e histórico de visitas por lead e imóvel.</p>

      <div style={{ marginTop: 16, marginBottom: 18 }}>
        <QuickVisitForm />
      </div>

      <div className="grid-3">
        {visits.map((visit) => (
          <article className="card" key={visit.id} style={{ padding: 14 }}>
            <p className="badge">{visit.status}</p>
            <h3 style={{ marginBottom: 8 }}>{visit.lead.name}</h3>
            <p style={{ margin: "4px 0", color: "var(--text-muted)" }}>{visit.property.title}</p>
            <p style={{ margin: "4px 0", color: "var(--text-muted)" }}>
              {new Date(visit.scheduledAt).toLocaleString("pt-BR")}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
