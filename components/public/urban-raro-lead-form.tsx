"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircle, Send } from "lucide-react";
import { TrackedWhatsAppLink } from "@/components/public/tracked-whatsapp-link";
import { getPublicAttribution } from "@/lib/attribution";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import styles from "@/app/urban-raro/raro.module.css";

const messageTemplate = "Olá, Pedro. Quero conhecer o Urban Raro e receber a apresentação, plantas e condições.";

export function UrbanRaroLeadForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

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
          interest: String(data.get("interest") ?? ""),
          developmentSlug: "urban-raro",
          landingPageSlug: "urban-raro",
          sourcePage: window.location.pathname,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      setStatus("success");
      setMessage("Recebemos seu interesse. Vou retornar com a apresentação e a disponibilidade atualizada.");
      setWhatsappUrl(buildWhatsAppUrl(messageTemplate));
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar agora. Tente novamente.");
    }
  }

  function openWhatsApp() {
    void fetch("/api/public/whatsapp-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ landingPageSlug: "urban-raro", messageTemplate, sourcePage: window.location.pathname, attribution: getPublicAttribution() })
    }).catch(() => undefined);
    window.open(buildWhatsAppUrl(messageTemplate), "_blank", "noopener,noreferrer");
  }

  return (
    <div className={styles["raro-form-wrap"]}>
      <form className={styles["raro-form"]} onSubmit={submit}>
        <div className={styles["raro-form-heading"]}><span>Atendimento reservado</span><h3>Receba o Urban Raro em detalhes.</h3><p>Apresentação, plantas e disponibilidade atualizada direto com Pedro Soares.</p></div>
        <div className={styles["raro-form-grid"]}>
          <label>Nome<input name="name" placeholder="Como posso chamar você?" required minLength={3} /></label>
          <label>WhatsApp<input name="whatsapp" placeholder="(63) 99999-9999" required minLength={10} inputMode="tel" /></label>
          <label>E-mail <span>(opcional)</span><input name="email" type="email" placeholder="voce@email.com" /></label>
          <label>O que você busca?<select name="interest" defaultValue=""><option value="">Selecione uma opção</option><option value="Morar no Urban Raro">Morar no Urban Raro</option><option value="Conhecer as plantas">Conhecer as plantas</option><option value="Entender o projeto">Entender o projeto</option><option value="Ainda estou avaliando">Ainda estou avaliando</option></select></label>
        </div>
        <label className={styles["raro-form-wide"]}>Mensagem<textarea name="message" rows={3} placeholder="Escreva uma dúvida ou preferência." /></label>
        <label className={styles["raro-consent"]}><input type="checkbox" name="lgpdConsent" required /><span>Autorizo o contato sobre o Urban Raro e concordo com a política de privacidade.</span></label>
        <div className={styles["raro-form-actions"]}><button type="submit"><Send size={16} /> Quero conhecer <ArrowRight size={16} /></button><button type="button" className={styles["raro-whatsapp"]} onClick={openWhatsApp}><MessageCircle size={16} /> Falar no WhatsApp</button></div>
        {status !== "idle" ? <p className={`${styles["raro-status"]} ${styles[`raro-status--${status}`]}`} role="status" aria-live="polite">{status === "success" ? <CheckCircle2 size={17} /> : null}{message}</p> : null}
      </form>
      {status === "success" && whatsappUrl ? <TrackedWhatsAppLink className={styles["raro-success-whatsapp"]} landingPageSlug="urban-raro" messageTemplate={messageTemplate} href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Falar comigo agora</TrackedWhatsAppLink> : null}
    </div>
  );
}
