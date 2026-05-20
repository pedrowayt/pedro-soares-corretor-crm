"use client";

import { useRef, useState } from "react";

type Status = {
  type: "idle" | "success" | "error";
  message?: string;
};

type Props = {
  developmentId: string;
  developmentSlug: string;
  whatsappMessage: string;
  tablePdfUrl?: string | null;
};

export function DevelopmentInterestForm({ developmentId, developmentSlug, whatsappMessage, tablePdfUrl }: Props) {
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [busyTable, setBusyTable] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: String(formData.get("name") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      developmentSlug,
      developmentId,
      requestTable: Boolean(formData.get("requestTable")),
      lgpdConsent: true
    };

    try {
      const response = await fetch("/api/public/leads/development-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error?.message ?? "Erro ao enviar formulário.");
      }

      setStatus({ type: "success", message: "Interesse enviado. Vamos retornar com as condições." });
      event.currentTarget.reset();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Não foi possível enviar agora."
      });
    }
  }

  async function requestTable() {
    setBusyTable(true);
    try {
      const formData = formRef.current ? new FormData(formRef.current) : new FormData();
      const response = await fetch(`/api/public/developments/${developmentSlug}/download-table`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          developmentId,
          name: formData.get("name"),
          whatsapp: formData.get("whatsapp"),
          email: formData.get("email")
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error?.message ?? "Tabela indisponível no momento.");
      }

      window.open(data.data.downloadUrl ?? tablePdfUrl ?? "#", "_blank", "noopener,noreferrer");
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Falha ao solicitar tabela."
      });
    } finally {
      setBusyTable(false);
    }
  }

  async function trackWhatsappClick() {
    const formData = formRef.current ? new FormData(formRef.current) : new FormData();

    await fetch("/api/public/whatsapp-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        developmentId,
        developmentSlug,
        leadName: formData.get("name"),
        leadPhone: formData.get("whatsapp"),
        messageTemplate: whatsappMessage
      })
    });

    window.open(`https://wa.me/5563984845101?text=${encodeURIComponent(whatsappMessage)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <aside className="card" style={{ padding: 18, display: "grid", gap: 10 }}>
      <h3 className="title-luxury" style={{ margin: 0, fontSize: "1.35rem" }}>
        Quero mais informações
      </h3>

      <form ref={formRef} onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <div>
          <label htmlFor="dev-name">Nome</label>
          <input id="dev-name" name="name" required />
        </div>
        <div>
          <label htmlFor="dev-whatsapp">WhatsApp</label>
          <input id="dev-whatsapp" name="whatsapp" required />
        </div>
        <div>
          <label htmlFor="dev-email">E-mail</label>
          <input id="dev-email" type="email" name="email" />
        </div>
        <div>
          <label htmlFor="dev-message">Mensagem</label>
          <textarea id="dev-message" name="message" placeholder="Tenho interesse nas condições e tipologias." />
        </div>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" name="requestTable" style={{ width: 16, height: 16 }} />
          <span className="text-card">Quero receber a tabela PDF</span>
        </label>
        <button className="button button-primary" type="submit">
          Enviar interesse
        </button>
      </form>

      <button type="button" className="button button-whatsapp" onClick={trackWhatsappClick}>
        Falar no WhatsApp
      </button>

      <button type="button" className="button button-ghost" onClick={requestTable} disabled={busyTable}>
        {busyTable ? "Solicitando..." : "Receber tabela PDF"}
      </button>

      {status.type !== "idle" ? (
        <p style={{ margin: 0, color: status.type === "success" ? "#93f3b6" : "#ffb3ad" }}>{status.message}</p>
      ) : null}
    </aside>
  );
}
