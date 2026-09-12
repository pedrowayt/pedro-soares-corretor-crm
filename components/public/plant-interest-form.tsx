"use client";

import { useState } from "react";
import { getPublicAttribution } from "@/lib/attribution";

type FormStatus = { type: "idle" | "success" | "error"; message?: string };

export function PlantInterestForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const interest = String(data.get("interest") ?? "");
    const message = [
      interest ? `Interesse principal: ${interest}` : "",
      String(data.get("message") ?? "")
    ].filter(Boolean).join("\n");
    try {
      const response = await fetch("/api/public/leads/development-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"), whatsapp: data.get("whatsapp"), email: data.get("email"),
          message, interest,
          developmentSlug: "imoveis-na-planta", landingPageSlug: "imoveis-na-planta",
          sourcePage: window.location.pathname, attribution: getPublicAttribution(), lgpdConsent: true
        })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload?.error?.message ?? "Não foi possível enviar agora.");
      setStatus({ type: "success", message: "Recebemos seu interesse. Vou retornar com opções alinhadas ao seu perfil." });
      form.reset();
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Não foi possível enviar agora." });
    }
  }

  return (
    <form className="card" style={{ padding: 22 }} onSubmit={submit}>
      <h2 style={{ marginTop: 0 }}>Receba uma curadoria de lançamentos</h2>
      <p className="section-subtitle" style={{ marginBottom: 18 }}>Conte o que você procura e eu apresento empreendimentos, plantas e caminhos de compra para o seu momento.</p>
      <div className="form-grid">
        <div><label htmlFor="plant-name">Nome</label><input id="plant-name" name="name" required minLength={3} /></div>
        <div><label htmlFor="plant-whatsapp">WhatsApp</label><input id="plant-whatsapp" name="whatsapp" required minLength={10} inputMode="tel" /></div>
        <div><label htmlFor="plant-email">E-mail</label><input id="plant-email" name="email" type="email" /></div>
        <div><label htmlFor="plant-interest">O que você busca?</label><select id="plant-interest" name="interest" defaultValue="apartamento"><option value="apartamento">Apartamento na planta</option><option value="lancamento">Lançamento imobiliário</option><option value="terreno-condominio">Terreno ou condomínio</option><option value="investimento">Investimento imobiliário</option></select></div>
        <div style={{ gridColumn: "1 / -1" }}><label htmlFor="plant-message">Mensagem</label><textarea id="plant-message" name="message" placeholder="Ex.: procuro 2 ou 3 quartos em Palmas para morar." /></div>
      </div>
      <button className="button button-primary" type="submit" style={{ marginTop: 14, width: "100%" }}>Quero receber opções</button>
      {status.type !== "idle" ? <p style={{ margin: "12px 0 0", color: status.type === "success" ? "#0a7a56" : "#b42318", fontSize: ".8rem" }}>{status.message}</p> : null}
    </form>
  );
}
