"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

type Status = "idle" | "success" | "error";

export function LakeCondominiumsGuideForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("idle");
    setFeedback("");

    try {
      const response = await fetch("/api/public/leads/lake-condominiums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          whatsapp: data.get("whatsapp"),
          email: data.get("email"),
          profile: data.get("profile"),
          objective: data.get("objective"),
          assetType: data.get("assetType"),
          message: data.get("message"),
          landingPageSlug: "condominios-beira-lago-palmas",
          sourcePage: window.location.pathname,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      form.reset();
      setStatus("success");
      setFeedback("Recebemos seu perfil. Vou retornar com uma seleção atualizada para você.");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Não foi possível enviar agora. Tente novamente.");
    }
  }

  return (
    <form className="lake-guide-form" onSubmit={onSubmit}>
      <div className="lake-guide-form-grid">
        <label>
          Nome completo
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
          O que você procura?
          <select name="assetType" defaultValue="" required>
            <option value="" disabled>Selecione uma opção</option>
            <option>Terreno para construir</option>
            <option>Casa pronta</option>
            <option>Apartamento de alto padrão</option>
            <option>Quero comparar opções</option>
          </select>
        </label>
        <label>
          Faixa de investimento
          <select name="profile" defaultValue="" required>
            <option value="" disabled>Selecione uma faixa</option>
            <option>Até R$ 500 mil</option>
            <option>De R$ 500 mil a R$ 1 milhão</option>
            <option>De R$ 1 milhão a R$ 2 milhões</option>
            <option>Acima de R$ 2 milhões</option>
            <option>Ainda estou avaliando</option>
          </select>
        </label>
        <label>
          Prazo
          <select name="objective" defaultValue="" required>
            <option value="" disabled>Quando pretende comprar?</option>
            <option>Agora</option>
            <option>Nos próximos 6 meses</option>
            <option>Estou pesquisando</option>
          </select>
        </label>
      </div>

      <label>
        Observações <span>(opcional)</span>
        <textarea name="message" rows={4} placeholder="Condomínio de preferência, necessidade de marina, vista, piscina ou prazo para construir..." />
      </label>

      <label className="lake-guide-consent">
        <input type="checkbox" name="lgpdConsent" required />
        <span>Autorizo o contato de Pedro Soares sobre oportunidades imobiliárias e concordo com a política de privacidade.</span>
      </label>

      <button className="button button-primary lake-guide-submit" type="submit">
        Quero receber uma seleção atualizada <ArrowRight size={17} />
      </button>

      {status !== "idle" ? (
        <p className={`lake-guide-form-status lake-guide-form-status--${status}`} role="status" aria-live="polite">
          {status === "success" ? <Check size={17} /> : null}
          {feedback}
        </p>
      ) : null}

      <p className="lake-guide-privacy"><ShieldCheck size={17} /> Atendimento individual, sem promessa de valorização ou rentabilidade.</p>
    </form>
  );
}
