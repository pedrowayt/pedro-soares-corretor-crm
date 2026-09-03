"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

type FormStatus = "idle" | "success" | "error";

export function AcordesLeadForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
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
    setMessage("");

    try {
      const response = await fetch("/api/public/leads/development-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          email,
          interest,
          message: `Interesse no Acordes Tower by Tewal. Perfil: ${interest || "Ainda avaliando"}.`,
          developmentSlug: "acordes-tower-by-tewal",
          landingPageSlug: "acordes",
          sourcePage: window.location.pathname,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      setStatus("success");
      setMessage("Interesse registrado. Vou retornar para apresentar o Acordes e as condições disponíveis.");
      setWhatsappUrl(buildWhatsAppUrl("Olá, Pedro. Acabei de me cadastrar para conhecer o Acordes Tower by Tewal."));
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar agora. Tente novamente.");
    }
  }

  return (
    <div className="acordes-lead-form-wrap">
      <form className="acordes-lead-form" onSubmit={handleSubmit}>
        <div className="acordes-lead-form-grid">
          <label>
            Nome
            <input name="name" placeholder="Como posso chamar você?" required minLength={3} />
          </label>
          <label>
            WhatsApp
            <input name="whatsapp" placeholder="(63) 99999-9999" required minLength={10} inputMode="tel" />
          </label>
          <label>
            E-mail <span>(opcional)</span>
            <input name="email" type="email" placeholder="voce@email.com" />
          </label>
          <label>
            O que você busca?
            <select name="interest" defaultValue="">
              <option value="" disabled>Selecione uma opção</option>
              <option value="Morar no Acordes">Morar no Acordes</option>
              <option value="Investir em locação">Investir em locação</option>
              <option value="Studio">Conhecer os studios</option>
              <option value="Apartamento de 2 suítes">Conhecer 2 suítes</option>
              <option value="Ainda estou avaliando">Ainda estou avaliando</option>
            </select>
          </label>
        </div>

        <label className="acordes-consent">
          <input type="checkbox" name="lgpdConsent" required />
          <span>Autorizo o contato de Pedro Soares sobre o Acordes Tower by Tewal e concordo com a política de privacidade.</span>
        </label>

        <button type="submit" className="acordes-button acordes-button--gold">
          <Send size={17} /> Quero conhecer o Acordes <ArrowRight size={17} />
        </button>

        {status !== "idle" ? (
          <p className={`acordes-form-feedback acordes-form-feedback--${status}`} role="status" aria-live="polite">
            {status === "success" ? <CheckCircle2 size={18} /> : null}
            {message}
          </p>
        ) : null}
      </form>

      {status === "success" && whatsappUrl ? (
        <a className="acordes-button acordes-button--whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={18} /> Falar comigo agora
        </a>
      ) : null}
    </div>
  );
}
