"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { getPublicAttribution } from "@/lib/attribution";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

type FormStatus = "idle" | "success" | "error";
type Props = {
  variant?: "landing" | "capture";
};

export function LakeVillageLeadForm({ variant = "landing" }: Props) {
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
    const lotReference = String(data.get("lotReference") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const residenceCity = String(data.get("residenceCity") ?? "").trim();
    const purchaseTimeline = String(data.get("purchaseTimeline") ?? "").trim();
    const budgetRange = String(data.get("budgetRange") ?? "").trim();
    const contactPreference = String(data.get("contactPreference") ?? "").trim();
    const leadMessage = `Cadastro de interesse no Lake Village Residences. Perfil: ${interest || "Ainda vou decidir"}.${lotReference ? ` Referência de quadra/lote: ${lotReference}.` : ""}`;

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
          interest,
          lotReference,
          residenceCity,
          purchaseTimeline,
          budgetRange,
          contactPreference,
          marketingConsent: data.get("marketingConsent") === "on",
          developmentSlug: "lake-village-residences",
          landingPageSlug: "lake-village",
          sourcePage: window.location.pathname,
          attribution: getPublicAttribution(),
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      const sheetSync = result.data?.sheetSync;
      if (sheetSync && sheetSync !== "synced") {
        setStatus("error");
        setMessage(
          sheetSync === "not_configured"
            ? "Cadastro salvo no CRM, mas a sincronização com a planilha ainda não está configurada."
            : "Cadastro salvo no CRM, mas não foi possível sincronizar a planilha agora."
        );
        return;
      }

      setStatus("success");
      setMessage("Cadastro concluído. Envie a confirmação pelo WhatsApp para eu identificar seu atendimento mais rápido.");
      const whatsappMessage = [
        "Olá, Pedro! Fiz meu cadastro de interesse no Lake Village Residences.",
        `Meu perfil: ${interest || "a definir"}.`,
        lotReference ? `Quadra/lote de interesse: ${lotReference}.` : undefined,
        residenceCity ? `Cidade: ${residenceCity}.` : undefined,
        purchaseTimeline ? `Pretendo comprar: ${purchaseTimeline}.` : undefined,
        "Pode me enviar as informações disponíveis?"
      ]
        .filter(Boolean)
        .join("\n");
      setWhatsappUrl(buildWhatsAppUrl(whatsappMessage));
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
            O que você busca?
            <select name="interest" defaultValue="" required={variant === "capture"}>
              <option value="" disabled>Selecione uma opção</option>
              <option value="Morar no empreendimento">Morar no empreendimento</option>
              <option value="Investir">Investir</option>
              <option value="Segunda residência">Segunda residência</option>
              <option value="Ainda estou avaliando">Ainda estou avaliando</option>
            </select>
          </label>
          <label>
            Quadra ou lote de interesse <span>(opcional)</span>
            <input name="lotReference" placeholder="Ex.: Quadra 08, lote 24" />
          </label>
          {variant === "capture" ? (
            <>
              <label>
                Cidade onde mora
                <input name="residenceCity" placeholder="Ex.: Palmas/TO" required />
              </label>
              <label>
                Quando pretende comprar? <span>(opcional)</span>
                <select name="purchaseTimeline" defaultValue="">
                  <option value="">Ainda não decidi</option>
                  <option value="Agora">Agora</option>
                  <option value="Nos próximos 3 meses">Nos próximos 3 meses</option>
                  <option value="De 3 a 6 meses">De 3 a 6 meses</option>
                  <option value="Mais de 6 meses">Mais de 6 meses</option>
                </select>
              </label>
              <label>
                Faixa de investimento <span>(opcional)</span>
                <select name="budgetRange" defaultValue="">
                  <option value="">Prefiro conversar</option>
                  <option value="Até R$ 300 mil">Até R$ 300 mil</option>
                  <option value="R$ 300 mil a R$ 500 mil">R$ 300 mil a R$ 500 mil</option>
                  <option value="R$ 500 mil a R$ 1 milhão">R$ 500 mil a R$ 1 milhão</option>
                  <option value="Acima de R$ 1 milhão">Acima de R$ 1 milhão</option>
                </select>
              </label>
              <label>
                Como prefere ser contatado? <span>(opcional)</span>
                <select name="contactPreference" defaultValue="WhatsApp">
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Ligação">Ligação</option>
                  <option value="E-mail">E-mail</option>
                </select>
              </label>
            </>
          ) : null}
        </div>

        <label className="lake-consent">
          <input type="checkbox" name="lgpdConsent" required />
          <span>Autorizo o contato de Pedro Soares sobre o Lake Village Residences e concordo com a política de privacidade.</span>
        </label>

        {variant === "capture" ? (
          <label className="lake-consent">
            <input type="checkbox" name="marketingConsent" />
            <span>Quero receber novidades e materiais comerciais do Lake Village.</span>
          </label>
        ) : null}

        <button type="submit" className="lake-button lake-button--gold">
          <Send size={17} /> {variant === "capture" ? "Concluir meu cadastro" : "Quero consultar lotes"} <ArrowRight size={17} />
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
          <MessageCircle size={18} /> Enviar confirmação no WhatsApp
        </a>
      ) : null}
    </div>
  );
}
