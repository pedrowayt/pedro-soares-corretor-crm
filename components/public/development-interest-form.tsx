"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  buildDevelopmentMessage,
  buildDevelopmentScheduleMessage,
  buildDevelopmentUnitMessage,
  buildWhatsAppUrl
} from "@/lib/integrations/whatsapp-links";

type Status = {
  type: "idle" | "success" | "error";
  message?: string;
};

type UnitTypeOption = {
  id: string;
  name: string;
};

type Props = {
  developmentId: string;
  developmentSlug: string;
  developmentName: string;
  whatsappMessage?: string;
  tablePdfUrl?: string | null;
  unitTypes?: UnitTypeOption[];
};

export function DevelopmentInterestForm({
  developmentId,
  developmentSlug,
  developmentName,
  whatsappMessage,
  tablePdfUrl,
  unitTypes = []
}: Props) {
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [busyTable, setBusyTable] = useState(false);
  const [selectedUnitTypeId, setSelectedUnitTypeId] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const selectedUnitType = useMemo(
    () => unitTypes.find((unit) => unit.id === selectedUnitTypeId) ?? null,
    [selectedUnitTypeId, unitTypes]
  );

  function getCurrentMessage(context: "development" | "unit_type" | "schedule") {
    if (context === "schedule") {
      return buildDevelopmentScheduleMessage(developmentName);
    }

    if (selectedUnitType) {
      return buildDevelopmentUnitMessage(developmentName, selectedUnitType.name);
    }

    return whatsappMessage?.trim() || buildDevelopmentMessage(developmentName);
  }

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
      unitTypeId: selectedUnitType?.id,
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

      setStatus({ type: "success", message: "Interesse enviado. Vamos retornar com as condições atualizadas." });
      event.currentTarget.reset();
      setSelectedUnitTypeId("");
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
          email: formData.get("email"),
          unitTypeId: selectedUnitType?.id,
          unitTypeName: selectedUnitType?.name
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

  async function trackWhatsappClick(context: "development" | "unit_type" | "schedule") {
    const formData = formRef.current ? new FormData(formRef.current) : new FormData();
    const message = getCurrentMessage(context);

    await fetch("/api/public/whatsapp-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        developmentId,
        developmentSlug,
        unitTypeId: selectedUnitType?.id,
        unitTypeName: selectedUnitType?.name,
        leadName: formData.get("name"),
        leadPhone: formData.get("whatsapp"),
        leadEmail: formData.get("email"),
        messageTemplate: message,
        context
      })
    });

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <aside className="card" style={{ padding: 18, display: "grid", gap: 10 }}>
        <h3 className="title-luxury" style={{ margin: 0, fontSize: "var(--fs-20)" }}>
          Quero mais informações
        </h3>

        <div className="development-broker-summary">
          <Image
            src="/brand/pedro-portrait-5.png"
            alt="Pedro Soares"
            width={64}
            height={64}
            className="development-broker-avatar"
          />
          <div className="development-broker-meta">
            <strong className="development-broker-name">Pedro Soares</strong>
            <span className="development-broker-creci">CRECI 5861-TO</span>
          </div>
        </div>

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

          {unitTypes.length ? (
            <div>
              <label htmlFor="dev-unit-type">Planta de interesse</label>
              <select
                id="dev-unit-type"
                name="unitTypeId"
                value={selectedUnitTypeId}
                onChange={(event) => setSelectedUnitTypeId(event.target.value)}
              >
                <option value="">Selecione uma planta</option>
                {unitTypes.map((unitType) => (
                  <option key={unitType.id} value={unitType.id}>
                    {unitType.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

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

        <div style={{ display: "grid", gap: 8 }}>
          <button type="button" className="button button-whatsapp" onClick={() => trackWhatsappClick("development")}>
            Falar no WhatsApp
          </button>
          <button type="button" className="button button-ghost" onClick={() => trackWhatsappClick("schedule")}>
            Agendar apresentação
          </button>
          <button type="button" className="button button-ghost" onClick={requestTable} disabled={busyTable}>
            {busyTable ? "Solicitando..." : "Receber tabela PDF"}
          </button>
        </div>

        {status.type !== "idle" ? (
          <p style={{ margin: 0, color: status.type === "success" ? "#0a7a56" : "#c92a2a" }}>{status.message}</p>
        ) : null}
      </aside>

      <div className="development-mobile-cta">
        <button type="button" className="button button-whatsapp development-mobile-cta-button" onClick={() => trackWhatsappClick("development")}>
          WhatsApp • Falar agora
        </button>
      </div>
    </>
  );
}
