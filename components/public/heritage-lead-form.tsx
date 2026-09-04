"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

type FormStatus = "idle" | "success" | "error";

const heritageMessage = "Olá, Pedro. Quero conhecer o Heritage Fama e receber a apresentação, plantas e condições.";

export function HeritageLeadForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const whatsapp = String(data.get("whatsapp") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const interest = String(data.get("interest") ?? "").trim();

    setStatus("idle");
    setFeedback("");

    try {
      const response = await fetch("/api/public/leads/development-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          email,
          interest,
          message: `${heritageMessage} Perfil: ${interest || "Ainda avaliando"}.`,
          developmentSlug: "heritage-fama",
          landingPageSlug: "heritage-fama",
          sourcePage: window.location.pathname,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      setStatus("success");
      setFeedback("Pronto. Vou retornar com a apresentação e as condições atualizadas do Heritage.");
      setWhatsappUrl(buildWhatsAppUrl(heritageMessage));
      form.reset();
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Não foi possível enviar agora. Tente novamente.");
    }
  }

  return (
    <div className="heritage-form-card">
      <div className="heritage-form-heading">
        <span>Lista de interesse</span>
        <h3>O seu próximo legado começa aqui.</h3>
        <p>Receba a apresentação do Heritage diretamente com quem conhece Palmas e o projeto.</p>
      </div>
      <form className="heritage-form" onSubmit={handleSubmit}>
        <div className="heritage-form-grid">
          <label>Nome<input name="name" placeholder="Como posso chamar você?" required minLength={3} /></label>
          <label>WhatsApp<input name="whatsapp" placeholder="(63) 99999-9999" required minLength={10} inputMode="tel" /></label>
          <label>E-mail <span>(opcional)</span><input name="email" type="email" placeholder="voce@email.com" /></label>
          <label>Seu objetivo<select name="interest" defaultValue=""><option value="" disabled>Selecione uma opção</option><option value="Morar no Heritage">Morar no Heritage</option><option value="Investir no projeto">Investir no projeto</option><option value="Conhecer as plantas">Conhecer as plantas</option><option value="Ainda estou avaliando">Ainda estou avaliando</option></select></label>
        </div>
        <label className="heritage-consent"><input type="checkbox" name="lgpdConsent" required /><span>Autorizo o contato de Pedro Soares sobre o Heritage Fama e concordo com a política de privacidade.</span></label>
        <button type="submit" className="heritage-button heritage-button--dark"><Send size={16} /> Quero conhecer o Heritage <ArrowRight size={16} /></button>
        {status !== "idle" ? <p className={`heritage-feedback heritage-feedback--${status}`} role="status" aria-live="polite">{status === "success" ? <CheckCircle2 size={18} /> : null}{feedback}</p> : null}
      </form>
      {status === "success" && whatsappUrl ? <a className="heritage-button heritage-button--whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Falar comigo agora</a> : null}
    </div>
  );
}
