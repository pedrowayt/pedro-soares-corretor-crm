import { FlowUpBoard } from "@/components/crm/flow-up-board";
import { listFlowUpLeads } from "@/lib/data/crm";

export default async function FlowUpPage() {
  const snapshot = await listFlowUpLeads();
  const serialize = (lead: (typeof snapshot.leads.HOT)[number]) => ({ ...lead, budgetMin: lead.budgetMin ? Number(lead.budgetMin) : null, budgetMax: lead.budgetMax ? Number(lead.budgetMax) : null, targetValue: lead.targetValue ? Number(lead.targetValue) : null, linkedProperty: lead.linkedProperty ? { ...lead.linkedProperty, price: Number(lead.linkedProperty.price) } : null, lastContactAt: lead.lastContactAt?.toISOString() ?? null, createdAt: lead.createdAt.toISOString() });
  const groups = { HOT: snapshot.leads.HOT.map(serialize), WARM: snapshot.leads.WARM.map(serialize), COLD: snapshot.leads.COLD.map(serialize) } as Parameters<typeof FlowUpBoard>[0]["groups"];
  return <><header className="flow-up__page-head"><div><h1 className="section-title" style={{ marginTop: 0 }}>Flow-UP</h1><p className="section-subtitle">Sua carteira de acompanhamento para nenhum cliente ficar esquecido.</p></div><div className="flow-up__summary"><strong>{snapshot.counts.COLD}</strong><span>precisam de contato</span></div></header><FlowUpBoard groups={groups} /></>;
}
