import { VisitManager, type VisitLeadOption, type VisitListItem, type VisitPropertyOption } from "@/components/crm/visit-manager";
import { listLeads, listProperties, listVisits } from "@/lib/data/crm";

export default async function CrmVisitasPage() {
  const [leads, properties, visits] = await Promise.all([listLeads(), listProperties(), listVisits()]);

  const leadOptions: VisitLeadOption[] = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    stage: String(lead.stage),
    linkedPropertyId: lead.linkedPropertyId ?? null,
    linkedPropertyTitle: lead.linkedProperty?.title ?? null
  }));

  const propertyOptions: VisitPropertyOption[] = properties.map((property) => ({
    id: property.id,
    title: property.title,
    city: property.city,
    district: property.district,
    price: Number(property.price),
    status: String(property.status),
    purpose: String(property.purpose)
  }));

  const visitItems: VisitListItem[] = visits.map((visit) => ({
    id: visit.id,
    status: String(visit.status),
    scheduledAt: visit.scheduledAt.toISOString(),
    notes: visit.notes ?? null,
    lead: {
      id: visit.lead.id,
      name: visit.lead.name,
      phone: visit.lead.phone
    },
    property: {
      id: visit.property.id,
      title: visit.property.title,
      city: visit.property.city,
      district: visit.property.district
    },
    assignedToName: visit.assignedTo?.name ?? null
  }));

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Visitas</h1>
      <p className="section-subtitle">Agendamento, confirmação e histórico de visitas por lead e imóvel.</p>

      <VisitManager leads={leadOptions} properties={propertyOptions} visits={visitItems} />
    </>
  );
}
