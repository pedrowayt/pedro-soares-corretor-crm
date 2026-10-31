"use client";

import { useMemo, useState } from "react";
import { Copy, MessageCircle, Send } from "lucide-react";
import { buildWhatsappLink, renderTemplate, type TemplateVariables, type WhatsappTemplate } from "@/lib/crm/whatsapp-templates";

type Props = {
  leadId: string;
  leadFirstName: string;
  phone: string | null;
  brokerName?: string;
  propertyTitle?: string;
  propertyUrl?: string;
  visitDate?: string;
  budgetRange?: string;
  targetValue?: string;
  interest?: string;
  stage?: string;
  isAuctionClient?: boolean;
  templates: WhatsappTemplate[];
};

export function WhatsappTemplatePicker({ leadId, leadFirstName, phone, brokerName = "Pedro Soares", propertyTitle, propertyUrl, visitDate, budgetRange, targetValue, interest, stage, isAuctionClient = false, templates }: Props) {
  const availableTemplates = useMemo(() => templates.filter((entry) => entry.category === (isAuctionClient ? "AUCTION" : "NORMAL")), [isAuctionClient, templates]);
  const vars: TemplateVariables = useMemo(() => ({ leadFirstName, brokerName, propertyTitle, propertyUrl, visitDate, budgetRange, targetValue, interest, stage }), [leadFirstName, brokerName, propertyTitle, propertyUrl, visitDate, budgetRange, targetValue, interest, stage]);
  const [activeId, setActiveId] = useState(availableTemplates[0]?.id ?? "");
  const [message, setMessage] = useState(() => availableTemplates[0] ? renderTemplate(availableTemplates[0].body, vars) : "");
  const [copied, setCopied] = useState(false);
  const [contacting, setContacting] = useState(false);
  const template = availableTemplates.find((entry) => entry.id === activeId) ?? availableTemplates[0];

  const link = buildWhatsappLink(phone, message);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard can be unavailable in some browsers */
    }
  }

  async function registerContact() {
    setContacting(true);
    try {
      await fetch(`/api/crm/leads/${leadId}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ channel: "WHATSAPP", message }) });
    } finally {
      setContacting(false);
    }
  }

  if (!template) {
    return <div className="crm-whatsapp-picker"><header className="crm-whatsapp-picker__head"><MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" /><h3>Templates de WhatsApp</h3></header><p className="crm-panel__empty">Nenhum template configurado para este tipo de lead. Um administrador pode criar um modelo em Mais → Templates WhatsApp.</p></div>;
  }

  return (
    <div className="crm-whatsapp-picker">
      <header className="crm-whatsapp-picker__head"><MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" /><h3>Templates de WhatsApp</h3><span className="badge">{isAuctionClient ? "Leilão" : "Normal"}</span></header>
      <div className="crm-whatsapp-picker__chips" role="tablist" aria-label="Templates">
        {availableTemplates.map((entry) => <button key={entry.id} type="button" className={`crm-whatsapp-picker__chip${entry.id === activeId ? " is-active" : ""}`} onClick={() => { setActiveId(entry.id); setMessage(renderTemplate(entry.body, vars)); }} title={entry.hint ?? undefined} role="tab" aria-selected={entry.id === activeId}>{entry.name}</button>)}
      </div>
      <textarea className="crm-whatsapp-picker__preview" value={message} onChange={(event) => setMessage(event.target.value)} rows={7} aria-label="Mensagem do WhatsApp" />
      <div className="crm-whatsapp-picker__actions"><button type="button" className="button button-ghost" onClick={() => void handleCopy()}><Copy size={14} strokeWidth={1.75} aria-hidden="true" />{copied ? "Copiado!" : "Copiar"}</button>{link ? <a className="button button-primary" href={link} target="_blank" rel="noreferrer" onClick={() => void registerContact()}><Send size={14} strokeWidth={1.75} aria-hidden="true" />{contacting ? "Registrando…" : "Enviar agora"}</a> : <button type="button" className="button button-primary" disabled><Send size={14} strokeWidth={1.75} aria-hidden="true" /> Sem telefone</button>}</div>
    </div>
  );
}
