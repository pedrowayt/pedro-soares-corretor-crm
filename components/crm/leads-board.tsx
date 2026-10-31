"use client";

import Link from "next/link";
import { Building2, Filter, Pencil, Search, Users, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { LeadActions } from "@/components/crm/lead-actions";
import { LeadDevelopmentStatusControl } from "@/components/crm/lead-development-status-control";
import { buildWhatsappLink } from "@/lib/crm/whatsapp-templates";

export type LeadListItem = {
  id: string;
  name: string;
  phone: string;
  source: string;
  sourcePage: string | null;
  intent: string;
  stage: string;
  createdAt: string;
  lastContactAt: string | null;
  targetValue: number | null;
  budgetMax: number | null;
  isAuctionClient: boolean;
  flowUpRemovedAt: string | null;
  interestDescription: string | null;
  developmentLeadStatus: string;
  linkedProperty: { id: string; title: string; price: number } | null;
  linkedDevelopment: { id: string; title: string } | null;
  linkedDevelopmentUnitType: { id: string; name: string } | null;
  landingPage: { name: string } | null;
};

function money(value: number | null) {
  return value ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) : "Não informado";
}

function context(lead: LeadListItem) {
  if (lead.linkedProperty) return lead.linkedProperty.title;
  if (lead.linkedDevelopment) return `${lead.linkedDevelopment.title}${lead.linkedDevelopmentUnitType ? ` · ${lead.linkedDevelopmentUnitType.name}` : ""}`;
  return "Sem vínculo definido";
}

function origin(lead: LeadListItem) {
  return lead.landingPage?.name || lead.sourcePage || lead.source;
}

function dateTime(value: string | null) {
  if (!value) return "Ainda não";
  return new Date(value).toLocaleString("pt-BR", { timeZone: "America/Araguaina", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function whatsappUrl(lead: LeadListItem) {
  return buildWhatsappLink(lead.phone, `Olá ${lead.name.split(/\s+/)[0]}, aqui é o Pedro Soares, corretor de imóveis. Recebi seu contato e posso ajudar?`);
}

function interestValue(lead: LeadListItem) {
  return lead.targetValue ? money(lead.targetValue) : lead.budgetMax ? `Até ${money(lead.budgetMax)}` : "Não informado";
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function temperature(lead: LeadListItem) {
  if (!lead.lastContactAt) return "Frio";
  const days = Math.max(0, Math.floor((Date.now() - new Date(lead.lastContactAt).getTime()) / 86400000));
  return days <= 7 ? "Quente" : days <= 14 ? "Morno" : "Frio";
}

export function LeadsBoard({ leads }: { leads: LeadListItem[] }) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("ALL");
  const [source, setSource] = useState("ALL");
  const [profile, setProfile] = useState("ALL");
  const [link, setLink] = useState("ALL");
  const stages = useMemo(() => Array.from(new Set(leads.map((lead) => lead.stage))).sort(), [leads]);
  const sources = useMemo(() => Array.from(new Set(leads.map((lead) => lead.source))).sort(), [leads]);
  const metrics = useMemo(() => ({ total: leads.length, noContact: leads.filter((lead) => !lead.lastContactAt).length, flowUp: leads.filter((lead) => !lead.flowUpRemovedAt && !["FECHADO", "PERDIDO"].includes(lead.stage)).length, auction: leads.filter((lead) => lead.isAuctionClient).length }), [leads]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return leads.filter((lead) => {
      const haystack = `${lead.name} ${lead.phone} ${context(lead)} ${origin(lead)} ${lead.interestDescription ?? ""}`.toLocaleLowerCase();
      if (needle && !haystack.includes(needle)) return false;
      if (stage !== "ALL" && lead.stage !== stage) return false;
      if (source !== "ALL" && lead.source !== source) return false;
      if (profile === "AUCTION" && !lead.isAuctionClient) return false;
      if (profile === "NORMAL" && lead.isAuctionClient) return false;
      if (link === "LINKED" && !lead.linkedProperty && !lead.linkedDevelopment) return false;
      if (link === "UNLINKED" && (lead.linkedProperty || lead.linkedDevelopment)) return false;
      return true;
    });
  }, [leads, link, profile, query, source, stage]);

  return (
    <section className="crm-leads-board">
      <div className="crm-leads-summary">
        <article><Users size={19} aria-hidden="true" /><div><strong>{metrics.total}</strong><span>Total de Leads</span></div></article>
        <article className="is-warning"><WalletCards size={19} aria-hidden="true" /><div><strong>{metrics.noContact}</strong><span>Sem contato</span></div></article>
        <article className="is-accent"><Building2 size={19} aria-hidden="true" /><div><strong>{metrics.flowUp}</strong><span>Em Flow-UP</span></div></article>
        <article className="is-auction"><span aria-hidden="true">⚖</span><div><strong>{metrics.auction}</strong><span>Clientes de leilão</span></div></article>
      </div>
      <div className="crm-leads-filters"><label className="crm-leads-search"><Search size={17} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nome, telefone, imóvel ou origem" aria-label="Buscar Leads" /></label><label><span>Etapa</span><select value={stage} onChange={(event) => setStage(event.target.value)}><option value="ALL">Todas as etapas</option>{stages.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></label><label><span>Origem</span><select value={source} onChange={(event) => setSource(event.target.value)}><option value="ALL">Todas as origens</option>{sources.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label><span>Perfil</span><select value={profile} onChange={(event) => setProfile(event.target.value)}><option value="ALL">Todos</option><option value="NORMAL">Normal</option><option value="AUCTION">Leilão</option></select></label><label><span>Vínculo</span><select value={link} onChange={(event) => setLink(event.target.value)}><option value="ALL">Todos</option><option value="LINKED">Com vínculo</option><option value="UNLINKED">Sem vínculo</option></select></label></div>
      <div className="crm-leads-result-head"><div><h2>Leads cadastrados</h2><p><Filter size={14} aria-hidden="true" /> {filtered.length} de {leads.length} exibidos</p></div></div>

      <div className="card crm-table-host crm-leads-table-wrap"><table className="crm-leads-table"><thead><tr><th>Lead</th><th>Interesse</th><th>Vínculo</th><th>Origem</th><th>Cadastro</th><th>Ações</th></tr></thead><tbody>{filtered.map((lead) => <tr key={lead.id}><td><Link href={`/crm/leads/${lead.id}`} className="crm-lead-link">{lead.name}</Link><small>{lead.phone} · {lead.stage.replaceAll("_", " ")}</small>{lead.isAuctionClient ? <span className="badge crm-badge-auction">Leilão</span> : null}</td><td><strong>{interestValue(lead)}</strong><small>{lead.intent}</small></td><td>{context(lead)}</td><td>{origin(lead)}</td><td>{dateTime(lead.createdAt)}</td><td><div className="crm-leads-actions"><Link href={`/crm/leads/${lead.id}`} className="button button-ghost"><Pencil size={14} aria-hidden="true" /> Editar</Link><LeadActions leadId={lead.id} leadName={lead.name} whatsappUrl={whatsappUrl(lead)} compact /></div></td></tr>)}</tbody></table>{filtered.length === 0 ? <p className="crm-panel__empty">Nenhum Lead encontrado com esses filtros.</p> : null}</div>

      <ul className="crm-record-cards crm-leads-cards" aria-label="Leads filtrados">{filtered.map((lead) => { const tier = temperature(lead); return <li className="crm-record-card crm-leads-card" key={lead.id}><header className="crm-record-card__head"><div className="crm-leads-card__identity"><span className={`crm-leads-avatar crm-leads-avatar--${tier.toLowerCase()}`} aria-hidden="true">{initials(lead.name)}</span><div><Link href={`/crm/leads/${lead.id}`} className="crm-record-card__title">{lead.name}</Link><small>{lead.phone} · {lead.stage.replaceAll("_", " ")}</small></div></div><span className={`crm-leads-temperature crm-leads-temperature--${tier.toLowerCase()}`}>{tier}</span></header><dl className="crm-record-card__fields"><div><dt>Valor de interesse</dt><dd className="crm-lead-value">{interestValue(lead)}</dd></div><div><dt>Origem</dt><dd>{origin(lead)}</dd></div><div className="crm-record-card__fields-wide"><dt>Vínculo</dt><dd>{context(lead)}</dd></div><div className="crm-record-card__fields-wide"><dt>Último contato</dt><dd>{dateTime(lead.lastContactAt)}</dd></div></dl><LeadDevelopmentStatusControl leadId={lead.id} initialStatus={lead.developmentLeadStatus} disabled={!lead.linkedDevelopment} /><footer className="crm-record-card__footer"><div className="crm-leads-actions"><Link href={`/crm/leads/${lead.id}`} className="button button-ghost"><Pencil size={14} aria-hidden="true" /> Editar</Link><LeadActions leadId={lead.id} leadName={lead.name} whatsappUrl={whatsappUrl(lead)} compact /></div></footer></li>; })}</ul>
    </section>
  );
}
