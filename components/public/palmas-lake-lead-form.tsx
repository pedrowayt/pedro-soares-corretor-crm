"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

type Status = {
  type: "idle" | "success" | "error";
  message?: string;
};

export function PalmasLakeLeadForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const whatsapp = String(data.get("whatsapp") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const interest = String(data.get("interest") ?? "Ainda estou avaliando").trim();

    setStatus({ type: "idle" });

    try {
      const response = await fetch("/api/public/leads/development-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          email,
          interest,
          developmentSlug: "palmas-lake",
          landingPageSlug: "palmas-lake",
          sourcePage: window.location.pathname,
          message: `Interesse no Palmas Lake. Perfil: ${interest}. Quero receber a apresentação, as tipologias, áreas comuns e condições disponíveis.`,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      setStatus({ type: "success", message: "Seu interesse foi registrado. Vou entrar em contato para apresentar o Palmas Lake." });
      form.reset();
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Não foi possível enviar agora. Tente novamente." });
    }
  }

  return (
    <section className="palmas-lake-lead" id="cadastro" aria-labelledby="palmas-lake-lead-title">
      <div className="palmas-lake-container palmas-lake-lead-grid">
        <div className="palmas-lake-lead-copy">
          <p className="palmas-lake-kicker">Atendimento oficial</p>
          <h2 id="palmas-lake-lead-title">Vamos encontrar o seu lugar no Palmas Lake.</h2>
          <p>Deixe seus dados e receba uma apresentação personalizada das experiências, tipologias, áreas comuns e condições disponíveis.</p>
          <div className="palmas-lake-lead-profile">
            <span className="palmas-lake-lead-avatar"><Image src="/brand/pedro-whatsapp-avatar.png" alt="Pedro Soares" fill sizes="58px" /></span>
            <span><strong>Pedro Soares</strong><small>Corretor oficial · CRECI 5861-TO</small></span>
          </div>
        </div>

        <form className="palmas-lake-lead-form" onSubmit={onSubmit}>
          <div className="palmas-lake-lead-form-grid">
            <label>Nome<input name="name" placeholder="Como posso chamar você?" required minLength={3} /></label>
            <label>WhatsApp<input name="whatsapp" placeholder="(63) 99999-9999" required minLength={10} inputMode="tel" /></label>
            <label>E-mail <span>(opcional)</span><input name="email" type="email" placeholder="voce@email.com" /></label>
            <label>O que você busca?<select name="interest" defaultValue="Ainda estou avaliando"><option value="Morar no Palmas Lake">Morar no Palmas Lake</option><option value="Investir no Palmas Lake">Investir no Palmas Lake</option><option value="Conhecer as áreas comuns">Conhecer as áreas comuns</option><option value="Conhecer o Lake Loft">Conhecer o Lake Loft</option><option value="Conhecer o Lake Office">Conhecer o Lake Office</option><option value="Conhecer o Lake Mall">Conhecer o Lake Mall</option><option value="Ainda estou avaliando">Ainda estou avaliando</option></select></label>
          </div>
          <label className="palmas-lake-lead-consent"><input type="checkbox" name="lgpdConsent" required /><span>Autorizo o contato de Pedro Soares sobre o Palmas Lake e concordo com a política de privacidade.</span></label>
          <button className="palmas-lake-button palmas-lake-button--gold" type="submit"><Send size={17} /> Quero receber a apresentação <ArrowRight size={17} /></button>
          {status.type !== "idle" ? <p className={`palmas-lake-lead-status palmas-lake-lead-status--${status.type}`} role="status" aria-live="polite">{status.type === "success" ? <CheckCircle2 size={18} /> : null}{status.message}</p> : null}
          {status.type === "success" ? <a className="palmas-lake-lead-whatsapp" href={buildWhatsAppUrl("Olá, Pedro. Acabei de me cadastrar para conhecer o Palmas Lake.")} target="_blank" rel="noreferrer">Falar comigo pelo WhatsApp</a> : null}
        </form>
      </div>
    </section>
  );
}
