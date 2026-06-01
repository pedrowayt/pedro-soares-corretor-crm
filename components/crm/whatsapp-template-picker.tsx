"use client";

import { useMemo, useState } from "react";
import { Copy, MessageCircle, Send } from "lucide-react";
import {
  WHATSAPP_TEMPLATES,
  buildWhatsappLink,
  renderTemplate,
  type TemplateVariables
} from "@/lib/crm/whatsapp-templates";

type Props = {
  leadFirstName: string;
  phone: string | null;
  brokerName?: string;
  propertyTitle?: string;
  propertyUrl?: string;
  budgetRange?: string;
};

export function WhatsappTemplatePicker({
  leadFirstName,
  phone,
  brokerName = "Pedro Soares",
  propertyTitle,
  propertyUrl,
  budgetRange
}: Props) {
  const [activeId, setActiveId] = useState(WHATSAPP_TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);

  const vars: TemplateVariables = useMemo(
    () => ({ leadFirstName, brokerName, propertyTitle, propertyUrl, budgetRange }),
    [leadFirstName, brokerName, propertyTitle, propertyUrl, budgetRange]
  );

  const template =
    WHATSAPP_TEMPLATES.find((entry) => entry.id === activeId) ?? WHATSAPP_TEMPLATES[0];
  const message = renderTemplate(template, vars);
  const link = buildWhatsappLink(phone, message);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="crm-whatsapp-picker">
      <header className="crm-whatsapp-picker__head">
        <MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" />
        <h3>Templates de WhatsApp</h3>
      </header>

      <div className="crm-whatsapp-picker__chips" role="tablist" aria-label="Templates">
        {WHATSAPP_TEMPLATES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`crm-whatsapp-picker__chip${entry.id === activeId ? " is-active" : ""}`}
            onClick={() => setActiveId(entry.id)}
            title={entry.hint}
            role="tab"
            aria-selected={entry.id === activeId}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <textarea
        className="crm-whatsapp-picker__preview"
        value={message}
        readOnly
        rows={5}
        aria-label="Prévia da mensagem"
      />

      <div className="crm-whatsapp-picker__actions">
        <button type="button" className="button button-ghost" onClick={handleCopy}>
          <Copy size={14} strokeWidth={1.75} aria-hidden="true" />
          {copied ? "Copiado!" : "Copiar"}
        </button>
        {link ? (
          <a
            className="button button-primary"
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            <Send size={14} strokeWidth={1.75} aria-hidden="true" /> Enviar agora
          </a>
        ) : (
          <button type="button" className="button button-primary" disabled>
            <Send size={14} strokeWidth={1.75} aria-hidden="true" /> Sem telefone
          </button>
        )}
      </div>
    </div>
  );
}
