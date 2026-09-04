"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

type FormStatus = "idle" | "success" | "error";

const whatsappMessage = "Olá, Pedro. Quero conhecer o Maestria Urban Design e receber a apresentação, plantas e condições.";

export function MaestriaLeadForm() {
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
          message: `${whatsappMessage} Perfil: ${interest || "Ainda avaliando"}.`,
          developmentSlug: "maestria-urban-design",
          landingPageSlug: "maestria-urban-design",
          sourcePage: window.location.pathname,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

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
    <div className="maestria-lead-form-wrap">
      <form className="maestria-lead-form" onSubmit={handleSubmit}>
        <div className="maestria-form-heading">
          <span>Lista de interesse</span>
          <h3>Receba o Maestria em detalhes.</h3>
          <p>Apresentação, plantas e condições atualizadas direto com quem conhece o projeto.</p>
        </div>
        <div className="maestria-form-fields">
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
              <option value="Morar no Maestria">Morar no Maestria</option>
              <option value="Investir no projeto">Investir no projeto</option>
              <option value="Conhecer as plantas">Conhecer as plantas</option>
              <option value="Ainda estou avaliando">Ainda estou avaliando</option>
            </select>
          </label>
        </div>
        <label className="maestria-consent">
          <input type="checkbox" name="lgpdConsent" required />
          <span>Autorizo o contato de Pedro Soares sobre o Maestria Urban Design e concordo com a política de privacidade.</span>
        </label>
        <button type="submit" className="maestria-button maestria-button--gold">
          <Send size={16} /> Quero conhecer o Maestria <ArrowRight size={16} />
        </button>
        {status !== "idle" ? (
          <p className={`maestria-form-feedback maestria-form-feedback--${status}`} role="status" aria-live="polite">
            {status === "success" ? <CheckCircle2 size={18} /> : null}
            {message}
          </p>
        ) : null}
      </form>
      {status === "success" && whatsappUrl ? (
        <a className="maestria-button maestria-button--whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={17} /> Falar comigo agora
        </a>
      ) : null}
    </div>
  );
}
