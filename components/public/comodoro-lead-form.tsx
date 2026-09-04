"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

type FormStatus = "idle" | "success" | "error";

const whatsappMessage = "Olá, Pedro. Quero conhecer o Comodoro by Fama e receber a apresentação, plantas e condições.";

export function ComodoroLeadForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/public/leads/development-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? "").trim(),
          whatsapp: String(data.get("whatsapp") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          interest: String(data.get("interest") ?? "").trim(),
          message: `${whatsappMessage} Perfil: ${String(data.get("interest") ?? "Ainda avaliando")}.`,
          developmentSlug: "comodoro-by-fama",
          landingPageSlug: "comodoro-by-fama",
          sourcePage: window.location.pathname,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");

      setStatus("success");
      setMessage("Pronto. Vou retornar com a apresentação, as plantas e as condições disponíveis.");
      setWhatsappUrl(buildWhatsAppUrl(whatsappMessage));
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar agora. Tente novamente.");
    }
  }

  return (
    <div className="comodoro-form-wrap">
      <form className="comodoro-form" onSubmit={handleSubmit}>
        <div className="comodoro-form-heading">
          <span>Atendimento exclusivo</span>
          <h3>O seu lugar de destaque pode começar aqui.</h3>
          <p>Receba a apresentação, as plantas e as condições atualizadas diretamente com um especialista.</p>
        </div>
        <div className="comodoro-form-fields">
          <label>Nome<input name="name" placeholder="Como posso chamar você?" required minLength={3} /></label>
          <label>WhatsApp<input name="whatsapp" placeholder="(63) 99999-9999" required minLength={10} inputMode="tel" /></label>
          <label>E-mail <span>(opcional)</span><input name="email" type="email" placeholder="voce@email.com" /></label>
          <label>O que você busca?<select name="interest" defaultValue=""><option value="" disabled>Selecione uma opção</option><option value="Morar no Comodoro">Morar no Comodoro</option><option value="Investir no projeto">Investir no projeto</option><option value="Conhecer as plantas">Conhecer as plantas</option><option value="Ainda estou avaliando">Ainda estou avaliando</option></select></label>
        </div>
        <label className="comodoro-consent"><input type="checkbox" name="lgpdConsent" required /><span>Autorizo o contato de Pedro Soares sobre o Comodoro by Fama e concordo com a política de privacidade.</span></label>
        <button type="submit" className="comodoro-button comodoro-button--dark"><Send size={16} /> Quero conhecer o Comodoro <ArrowRight size={16} /></button>
        {status !== "idle" ? <p className={`comodoro-form-feedback comodoro-form-feedback--${status}`} role="status" aria-live="polite">{status === "success" ? <CheckCircle2 size={18} /> : null}{message}</p> : null}
      </form>
      {status === "success" && whatsappUrl ? <a className="comodoro-button comodoro-button--whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Falar comigo agora</a> : null}
    </div>
  );
}
