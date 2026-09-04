"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/property-types";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

type FormStatus = {
  type: "idle" | "success" | "error";
  message?: string;
};

const landingPageSlug = "gestao-exclusiva";

async function trackEvent(type: "CTA_CLICK" | "FORM_START" | "WHATSAPP_CLICK") {
  try {
    const storageKey = `landing-page-session:${landingPageSlug}`;
    let sessionId = window.sessionStorage.getItem(storageKey);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      window.sessionStorage.setItem(storageKey, sessionId);
    }

    await fetch("/api/public/landing-page-events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        landingPageSlug,
        sourcePage: window.location.pathname,
        type,
        sessionId
      }),
      keepalive: true
    });
  } catch {
    // Tracking never blocks the CTA or the capture flow.
  }
}

export function ExclusiveManagementWhatsAppButton({
  className,
  children,
  compact = false
}: {
  className?: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  const href = buildWhatsAppUrl("Olá, Pedro. Quero conversar sobre a Gestão Exclusiva para vender meu imóvel.");

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => void trackEvent("WHATSAPP_CLICK")}
      aria-label={compact ? "Falar sobre Gestão Exclusiva pelo WhatsApp" : undefined}
    >
      <MessageCircle size={compact ? 18 : 19} aria-hidden="true" />
      {children}
    </a>
  );
}

export function ExclusiveManagementLeadForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [submitting, setSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  return (
    <form
      className="exclusive-form"
      onFocus={() => void trackEvent("FORM_START")}
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setStatus({ type: "idle" });
        const form = event.currentTarget;
        const formData = new FormData(form);
        const whatsapp = String(formData.get("whatsapp") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();
        const context = [
          `Já anunciado: ${String(formData.get("listed") ?? "Não informado")}`,
          `Documentação: ${String(formData.get("documentation") ?? "Não informado")}`,
          description ? `Sobre o imóvel: ${description}` : ""
        ]
          .filter(Boolean)
          .join("\n");

        try {
          const response = await fetch("/api/public/leads/seller-capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.get("name"),
              whatsapp,
              propertyType: formData.get("propertyType"),
              district: formData.get("district"),
              city: formData.get("city"),
              askingPrice: formData.get("askingPrice"),
              statusDescription: context,
              photos: [],
              sourcePage: window.location.pathname,
              landingPageSlug,
              lgpdConsent: true
            })
          });
          const payload = await response.json();
          if (!response.ok || !payload.success) {
            throw new Error(payload?.error?.message ?? "Não foi possível enviar as informações.");
          }

          setStatus({
            type: "success",
            message: "Recebi as informações. Vou analisar o imóvel e falar com você em breve."
          });
          setWhatsappUrl(buildWhatsAppUrl("Olá, Pedro. Acabei de enviar meu imóvel para avaliar a Gestão Exclusiva."));
          form.reset();
        } catch (error) {
          setStatus({
            type: "error",
            message: error instanceof Error ? error.message : "Não foi possível enviar. Tente novamente."
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="exclusive-form__heading">
        <span className="exclusive-kicker">Primeiro passo</span>
        <h2>Vamos entender o seu imóvel?</h2>
        <p>Envie algumas informações. A conversa inicial serve para avaliar se este modelo faz sentido para a sua venda.</p>
      </div>

      <div className="exclusive-form__grid">
        <label>
          Nome
          <input name="name" required autoComplete="name" placeholder="Como posso chamar você?" />
        </label>
        <label>
          WhatsApp
          <input name="whatsapp" required minLength={10} inputMode="tel" autoComplete="tel" placeholder="(63) 99999-9999" />
        </label>
        <label>
          Cidade
          <input name="city" required defaultValue="Palmas" />
        </label>
        <label>
          Bairro ou localização
          <input name="district" required placeholder="Ex.: Plano Diretor Sul" />
        </label>
        <label>
          Tipo de imóvel
          <select name="propertyType" required defaultValue="CASA">
            {PROPERTY_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          Valor pretendido
          <input name="askingPrice" required type="number" min={1} step="0.01" inputMode="decimal" placeholder="R$" />
        </label>
        <label>
          O imóvel já está anunciado?
          <select name="listed" defaultValue="Não">
            <option>Não</option>
            <option>Sim</option>
          </select>
        </label>
        <label>
          Documentação
          <select name="documentation" defaultValue="Não sei informar">
            <option>Sim, está disponível</option>
            <option>Parcialmente</option>
            <option>Não sei informar</option>
          </select>
        </label>
        <label className="exclusive-form__wide">
          Conte um pouco sobre o imóvel
          <textarea name="description" rows={4} placeholder="Características, prazo para vender, ocupação ou qualquer ponto importante." />
        </label>
      </div>

      <p className="exclusive-form__privacy">Ao enviar, você autoriza o contato sobre este atendimento. Seus dados serão usados para tratar a solicitação, conforme a política de privacidade.</p>
      <button className="exclusive-button exclusive-button--gold" type="submit" disabled={submitting} onClick={() => void trackEvent("CTA_CLICK")}>
        {submitting ? "Enviando..." : "Quero avaliar meu imóvel"}
        <Send size={17} aria-hidden="true" />
      </button>

      {status.type !== "idle" ? <p className={`exclusive-form__status exclusive-form__status--${status.type}`}>{status.message}</p> : null}
      {status.type === "success" && whatsappUrl ? (
        <a className="exclusive-form__success-link" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => void trackEvent("WHATSAPP_CLICK")}>
          <MessageCircle size={17} aria-hidden="true" /> Falar comigo agora pelo WhatsApp
        </a>
      ) : null}
    </form>
  );
}
