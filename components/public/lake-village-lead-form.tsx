"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

type FormStatus = "idle" | "success" | "error";

export function LakeVillageLeadForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const whatsapp = String(data.get("whatsapp") ?? "").trim();
    const interest = String(data.get("interest") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const leadMessage = `Perfil de interesse: ${interest || "Ainda vou decidir"}. Quero receber a apresentação do Lake Village Residences, plantas, valores e condições disponíveis.`;

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
          message: leadMessage,
          developmentSlug: "lake-village-residences",
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      setStatus("success");
      setMessage("Seu interesse foi registrado. Vou entrar em contato para apresentar o empreendimento.");
      setWhatsappUrl(buildWhatsAppUrl(`Olá, Pedro. Acabei de me cadastrar para conhecer o Lake Village Residences. Meu perfil é: ${interest || "a definir"}.`));
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar agora. Tente novamente.");
    }
  }

  return (
    <div className="lake-lead-form-wrap">
      <form className="lake-lead-form" onSubmit={handleSubmit}>
        <div className="lake-lead-form-grid">
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
              <option value="Morar no empreendimento">Morar no empreendimento</option>
              <option value="Investir">Investir</option>
              <option value="Segunda residência">Segunda residência</option>
              <option value="Ainda estou avaliando">Ainda estou avaliando</option>
            </select>
          </label>
        </div>

        <label className="lake-consent">
          <input type="checkbox" name="lgpdConsent" required />
          <span>Autorizo o contato de Pedro Soares sobre o Lake Village Residences e concordo com a política de privacidade.</span>
        </label>

        <button type="submit" className="lake-button lake-button--gold">
          <Send size={17} /> Quero receber a apresentação <ArrowRight size={17} />
        </button>

        {status !== "idle" ? (
          <p className={`lake-form-feedback lake-form-feedback--${status}`} role="status" aria-live="polite">
            {status === "success" ? <CheckCircle2 size={18} /> : null}
            {message}
          </p>
        ) : null}
      </form>

      {status === "success" && whatsappUrl ? (
        <a className="lake-button lake-button--whatsapp lake-lead-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageCircle size={18} /> Falar comigo agora
        </a>
      ) : null}
    </div>
  );
}
