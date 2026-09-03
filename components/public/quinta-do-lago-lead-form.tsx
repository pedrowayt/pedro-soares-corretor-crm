"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Send } from "lucide-react";

type Status = { type: "idle" | "success" | "error"; message?: string };

export function QuintaDoLagoLeadForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const interest = String(data.get("interest") ?? "Ainda vou entender as possibilidades");
    const lot = String(data.get("lot") ?? "").trim();

    try {
      const response = await fetch("/api/public/leads/development-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          whatsapp: String(data.get("whatsapp") ?? ""),
          email: String(data.get("email") ?? ""),
          interest,
          message: `Interesse no Condomínio de Chácaras Quinta do Lago. Perfil: ${interest}. ${lot ? `Lote/chácara de interesse: ${lot}. ` : ""}Quero receber a apresentação, áreas de lazer, infraestrutura e condições disponíveis.`,
          landingPageSlug: "quinta-do-lago",
          sourcePage: window.location.pathname,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      setStatus({ type: "success", message: "Obrigado. Vou enviar a apresentação e retornar com as condições disponíveis." });
      form.reset();
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Não foi possível enviar agora." });
    }
  }

  return (
    <form className="qdl-form" onSubmit={onSubmit}>
      <div className="qdl-form-grid">
        <label>Nome<input name="name" placeholder="Seu nome" required minLength={3} /></label>
        <label>WhatsApp<input name="whatsapp" placeholder="(00) 00000-0000" required minLength={10} inputMode="tel" /></label>
        <label>E-mail <span>(opcional)</span><input name="email" type="email" placeholder="voce@email.com" /></label>
        <label>O que você procura?<select name="interest" defaultValue=""><option value="" disabled>Selecione uma opção</option><option value="Chácara para lazer">Chácara para lazer</option><option value="Reunir a família">Reunir a família</option><option value="Investir">Investir</option><option value="Ainda estou avaliando">Ainda estou avaliando</option></select></label>
        <label className="qdl-form-wide">Lote ou chácara de interesse <span>(opcional)</span><input name="lot" placeholder="Ex.: Chácara 24 ou lote próximo ao lago" /></label>
      </div>
      <label className="qdl-consent"><input type="checkbox" name="lgpdConsent" required /><span>Autorizo o contato sobre o Quinta do Lago e concordo com a política de privacidade.</span></label>
      <button className="qdl-button qdl-button--olive" type="submit"><Send size={16} /> Quero receber a curadoria <ArrowRight size={16} /></button>
      {status.type !== "idle" ? <p className={`qdl-form-status qdl-form-status--${status.type}`} role="status" aria-live="polite">{status.type === "success" ? <CheckCircle2 size={18} /> : null}{status.message}</p> : null}
    </form>
  );
}
