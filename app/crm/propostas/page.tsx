import {
  ProposalManager,
  type ProposalLeadOption,
  type ProposalListItem,
  type ProposalPropertyOption
} from "@/components/crm/proposal-manager";
import { listLeads, listProperties, listProposals } from "@/lib/data/crm";

export default async function CrmPropostasPage() {
  const [leads, properties, proposals] = await Promise.all([
    listLeads(),
    listProperties(),
    listProposals()
  ]);

  const leadOptions: ProposalLeadOption[] = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    stage: lead.stage,
    linkedPropertyId: lead.linkedPropertyId ?? null,
    linkedPropertyTitle: lead.linkedProperty?.title ?? null
  }));

  const propertyOptions: ProposalPropertyOption[] = properties.map((property) => ({
    id: property.id,
    title: property.title,
    city: property.city,
    district: property.district,
    price: Number(property.price),
    status: property.status,
    purpose: property.purpose
  }));

  const proposalItems: ProposalListItem[] = proposals.map((proposal) => ({
    id: proposal.id,
    status: proposal.status,
    offeredValue: Number(proposal.offeredValue),
    commissionPct: proposal.commissionPct === null ? null : Number(proposal.commissionPct),
    notes: proposal.notes,
    createdAt: proposal.createdAt.toISOString(),
    updatedAt: proposal.updatedAt.toISOString(),
    lead: {
      id: proposal.lead.id,
      name: proposal.lead.name,
      phone: proposal.lead.phone
    },
    property: {
      id: proposal.property.id,
      title: proposal.property.title,
      city: proposal.property.city,
      district: proposal.property.district,
      price: Number(proposal.property.price)
    },
    createdByName: proposal.createdBy?.name ?? null
  }));

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Propostas</h1>
      <p className="section-subtitle">
        Registre propostas vinculadas ao imóvel cadastrado, acompanhe negociação e mantenha o histórico do lead.
      </p>

      <ProposalManager leads={leadOptions} properties={propertyOptions} proposals={proposalItems} />
    </>
  );
}
