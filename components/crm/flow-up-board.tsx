"use client";

import Link from "next/link";
import { Flame, MessageCircle, Snowflake, SunMedium, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Tier = "HOT" | "WARM" | "COLD";
type Lead = { id: string; name: string; phone: string; stage: string; budgetMin: number | null; budgetMax: number | null; targetValue: number | null; interestDescription: string | null; lastContactAt: string | null; createdAt: string; linkedProperty: { title: string; price: number } | null; linkedDevelopment: { title: string } | null; linkedDevelopmentUnitType: { name: string } | null };
type Props = { groups: Record<Tier, Lead[]> };
const META: Record<Tier, { label: string; description: string; Icon: typeof Flame }> = { HOT: { label: "Quente", description: "Contato nos últimos 7 dias", Icon: Flame }, WARM: { label: "Morno", description: "De 8 a 14 dias sem contato", Icon: SunMedium }, COLD: { label: "Frio", description: "Mais de 14 dias ou sem contato", Icon: Snowflake } };
function money(value: number | null) { return value ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) : null; }
function context(lead: Lead) { if (lead.linkedProperty) return lead.linkedProperty.title; if (lead.linkedDevelopment) return lead.linkedDevelopment.title; return lead.interestDescription || "Interesse ainda não detalhado"; }
function wa(lead: Lead) { return `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${lead.name.split(/\s+/)[0]}, aqui é o Pedro. Como posso ajudar no seu atendimento?`)}`; }

export function FlowUpBoard({ groups }: Props) {
  const router = useRouter(); const [activeTier, setActiveTier] = useState<Tier>("COLD"); const [contactingId, setContactingId] = useState<string | null>(null);
  async function registerContact(lead: Lead) { setContactingId(lead.id); try { await fetch(`/api/crm/leads/${lead.id}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel: "WHATSAPP" }) }); router.refresh(); } finally { setContactingId(null); } }
  async function discardLead(lead: Lead) { const reason = window.prompt(`Por que você está descartando o Lead ${lead.name}?`); if (!reason?.trim()) return; const response = await fetch(`/api/crm/leads/${lead.id}/stage`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ toStage: "PERDIDO", reason: reason.trim() }) }); if (!response.ok) { window.alert("Não foi possível descartar este Lead."); return; } router.refresh(); }
  return <div className="flow-up">
    <div className="flow-up__tabs" role="tablist" aria-label="Temperatura dos Leads">{(Object.keys(META) as Tier[]).map((tier) => { const item = META[tier]; const Icon = item.Icon; return <button key={tier} type="button" role="tab" aria-selected={activeTier === tier} className={`flow-up__tab flow-up__tab--${tier.toLowerCase()}${activeTier === tier ? " is-active" : ""}`} onClick={() => setActiveTier(tier)}><Icon size={18} aria-hidden="true" /><strong>{item.label}</strong><span>{groups[tier].length}</span></button>; })}</div>
    <p className="flow-up__hint">{META[activeTier].description}. Clique no WhatsApp para registrar o contato e manter o cliente em dia.</p>
    <div className="flow-up__grid">{groups[activeTier].length === 0 ? <div className="crm-panel flow-up__empty">Nenhum cliente nesta categoria.</div> : groups[activeTier].map((lead) => { const range = lead.budgetMax ? `${lead.budgetMin ? `${money(lead.budgetMin)} – ` : "Até "}${money(lead.budgetMax)}` : money(lead.targetValue); return <article className="flow-up__card" key={lead.id}><header className="flow-up__card-head"><div><Link href={`/crm/leads/${lead.id}`} className="flow-up__name">{lead.name}</Link><span className="flow-up__stage">{lead.stage.replaceAll("_", " ")}</span></div><span className={`flow-up__dot flow-up__dot--${activeTier.toLowerCase()}`} /></header><p className="flow-up__context">{context(lead)}</p><dl className="flow-up__facts"><div><dt>Último contato</dt><dd>{lead.lastContactAt ? new Date(lead.lastContactAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "Ainda não contatado"}</dd></div>{range ? <div><dt>Investimento</dt><dd>{range}</dd></div> : null}</dl><footer className="flow-up__actions"><a className="button button-primary flow-up__whatsapp" href={wa(lead)} target="_blank" rel="noreferrer" onClick={() => void registerContact(lead)}><MessageCircle size={17} aria-hidden="true" />{contactingId === lead.id ? "Registrando…" : "Falar no WhatsApp"}</a><Link href={`/crm/leads/${lead.id}`} className="button button-ghost">Ver ficha</Link><button type="button" className="button button-ghost flow-up__discard" onClick={() => void discardLead(lead)} title="Descartar Lead"><Trash2 size={15} aria-hidden="true" /><span className="sr-only">Descartar</span></button></footer></article>; })}</div>
  </div>;
}
