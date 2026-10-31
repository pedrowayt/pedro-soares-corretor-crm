import { LeadsBoard, type LeadListItem } from "@/components/crm/leads-board";
import { QuickLeadForm } from "@/components/crm/quick-forms";
import { listLeads } from "@/lib/data/crm";
import { listCrmDevelopments } from "@/lib/data/developments";
import { listCrmProperties } from "@/lib/data/crm-properties";

function serializeLead(lead: Awaited<ReturnType<typeof listLeads>>[number]): LeadListItem {
  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    source: lead.source,
    sourcePage: lead.sourcePage,
    intent: lead.intent,
    stage: lead.stage,
    createdAt: lead.createdAt.toISOString(),
    lastContactAt: lead.lastContactAt?.toISOString() ?? null,
    targetValue: lead.targetValue ? Number(lead.targetValue) : null,
    budgetMax: lead.budgetMax ? Number(lead.budgetMax) : null,
    isAuctionClient: lead.isAuctionClient,
    flowUpRemovedAt: lead.flowUpRemovedAt?.toISOString() ?? null,
    interestDescription: lead.interestDescription,
    developmentLeadStatus: lead.developmentLeadStatus,
    linkedProperty: lead.linkedProperty ? { id: lead.linkedProperty.id, title: lead.linkedProperty.title, price: Number(lead.linkedProperty.price) } : null,
    linkedDevelopment: lead.linkedDevelopment ? { id: lead.linkedDevelopment.id, title: lead.linkedDevelopment.title } : null,
    linkedDevelopmentUnitType: lead.linkedDevelopmentUnitType ? { id: lead.linkedDevelopmentUnitType.id, name: lead.linkedDevelopmentUnitType.name } : null,
    landingPage: lead.landingPage ? { name: lead.landingPage.name } : null
  };
}

export default async function CrmLeadsPage({ searchParams }: { searchParams?: Promise<{ landingPage?: string }> }) {
  const params = await searchParams;
  const landingPageSlug = params?.landingPage?.trim() || undefined;
  const [leads, properties, developments] = await Promise.all([listLeads({ landingPageSlug }), listCrmProperties(), listCrmDevelopments()]);

  return (
    <>
      <header className="crm-leads-page-head"><div><p className="crm-eyebrow">Relacionamento comercial</p><h1 className="section-title" style={{ marginTop: 0 }}>Leads</h1><p className="section-subtitle">Tenha clareza sobre quem chegou, o que procura e qual deve ser o próximo passo.</p></div><span className="crm-leads-page-head__hint">Acompanhe, vincule e avance.</span></header>
      {landingPageSlug ? <p className="badge" style={{ display: "inline-flex", marginTop: 10 }}>Filtro: landing page <strong style={{ marginLeft: 5 }}>{landingPageSlug}</strong></p> : null}
      <div id="quick-create" className="crm-quick-form-target" style={{ marginTop: 18, marginBottom: 20 }}><QuickLeadForm properties={properties.map((property) => ({ id: property.id, title: property.title }))} developments={developments.map((development) => ({ id: development.id, title: development.title }))} /></div>
      <LeadsBoard leads={leads.map(serializeLead)} />
    </>
  );
}
