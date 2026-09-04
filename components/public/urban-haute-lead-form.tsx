"use client";

import { useState } from "react";
import { ArrowRight, Check, MessageCircle, Send } from "lucide-react";
import { buildDevelopmentMessage, buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

type Props = { selectedInterest?: string };

export function UrbanHauteLeadForm({ selectedInterest = "" }: Props) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function openWhatsApp(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const form = event.currentTarget.form;
    const data = form ? new FormData(form) : null;
    const name = String(data?.get("name") ?? "").trim();
    const interest = String(data?.get("interest") ?? selectedInterest).trim();
    const text = `${buildDevelopmentMessage("Urban Haute")}${name ? ` Meu nome é ${name}.` : ""}${interest ? ` Tenho interesse em ${interest}.` : ""}`;
    window.open(buildWhatsAppUrl(text), "_blank", "noopener,noreferrer");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/public/leads/development-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          whatsapp: String(data.get("whatsapp") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
          developmentSlug: "urban-haute",
          landingPageSlug: "urban-haute",
          sourcePage: window.location.pathname,
          requestTable: false,
          lgpdConsent: true
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result?.error?.message);
      setStatus("success");
      setMessage("Recebemos seu interesse. Vou retornar com as plantas e a disponibilidade atualizada.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Não foi possível enviar agora. Você também pode falar comigo pelo WhatsApp.");
    }
  }

  return (
    <form className="urban-haute-lead-form" onSubmit={submit}>
      <div className="urban-haute-form-grid">
        <label>Seu nome<input name="name" placeholder="Como posso chamar você?" required minLength={3} /></label>
        <label>WhatsApp<input name="whatsapp" placeholder="(63) 99999-9999" required minLength={10} inputMode="tel" /></label>
        <label className="urban-haute-form-wide">E-mail <span>(opcional)</span><input name="email" type="email" placeholder="voce@email.com" /></label>
        <label className="urban-haute-form-wide">O que você quer conhecer?
          <select name="interest" defaultValue={selectedInterest}>
            <option value="">Selecione uma opção</option>
            <option value="uma residência de 1 quarto">Residência de 1 quarto</option>
            <option value="uma residência de 2 quartos">Residência de 2 quartos</option>
            <option value="uma residência de 3 quartos">Residência de 3 quartos</option>
            <option value="uma penthouse">Penthouse</option>
            <option value="um office ou laje corporativa">Office ou laje corporativa</option>
            <option value="uma loja no boulevard gastronômico">Loja no boulevard gastronômico</option>
          </select>
        </label>
      </div>
      <label className="urban-haute-form-wide">Mensagem <textarea name="message" placeholder="Escreva uma dúvida ou preferência." rows={3} /></label>
      <label className="urban-haute-consent"><input type="checkbox" required /><span>Autorizo o contato sobre o Urban Haute e concordo com a política de privacidade.</span></label>
      <div className="urban-haute-form-actions">
        <button className="urban-haute-button urban-haute-button--light" type="submit"><Send size={16} /> Enviar interesse <ArrowRight size={16} /></button>
        <button className="urban-haute-button urban-haute-button--whatsapp" type="button" onClick={openWhatsApp}><MessageCircle size={16} /> Falar no WhatsApp</button>
      </div>
      {status === "success" ? <p className="urban-haute-form-status urban-haute-form-status--success"><Check size={16} /> {message}</p> : null}
      {status === "error" ? <p className="urban-haute-form-status urban-haute-form-status--error">{message}</p> : null}
    </form>
  );
}
