"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CalendarDays, FileText, MessageCircle, Send } from "lucide-react";
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

type UnitOption = {
  id: string;
  unitTypeId: string | null;
  label: string;
  displayName: string;
};

type Props = {
  developmentId: string;
  developmentSlug: string;
  developmentName: string;
  landingPageSlug?: string;
  whatsappMessage?: string;
  tablePdfUrl?: string | null;
  unitTypes?: UnitTypeOption[];
  units?: UnitOption[];
};

function BrokerSummary() {
  return (
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
  );
}

export function DevelopmentInterestForm({
  developmentId,
  developmentSlug,
  developmentName,
  landingPageSlug,
  whatsappMessage,
  tablePdfUrl,
  unitTypes = [],
  units = []
}: Props) {
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [busyTable, setBusyTable] = useState(false);
  const [selectedUnitTypeId, setSelectedUnitTypeId] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [requestTableChecked, setRequestTableChecked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const selectedUnit = useMemo(
    () => units.find((unit) => unit.id === selectedUnitId) ?? null,
    [selectedUnitId, units]
  );
  const selectedUnitType = useMemo(
    () => unitTypes.find((unit) => unit.id === (selectedUnit?.unitTypeId ?? selectedUnitTypeId)) ?? null,
    [selectedUnit?.unitTypeId, selectedUnitTypeId, unitTypes]
  );

  function getCurrentMessage(context: "development" | "unit_type" | "schedule") {
    if (context === "schedule") {
      return buildDevelopmentScheduleMessage(developmentName);
    }

    if (selectedUnit) {
      return buildDevelopmentUnitMessage(developmentName, selectedUnit.displayName || selectedUnit.label);
    }

    if (selectedUnitType) {
      return buildDevelopmentUnitMessage(developmentName, selectedUnitType.name);
    }

    return whatsappMessage?.trim() || buildDevelopmentMessage(developmentName);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const requestedTable = requestTableChecked || Boolean(formData.get("requestTable"));

    const payload = {
      name: String(formData.get("name") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      developmentSlug,
      developmentId,
      landingPageSlug,
      unitTypeId: selectedUnitType?.id,
      unitId: selectedUnit?.id,
      requestTable: requestedTable,
      sourcePage: window.location.pathname,
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

      setStatus({
        type: "success",
        message: requestedTable
          ? "Solicitação enviada. Vamos retornar com a tabela e condições atualizadas."
          : "Interesse enviado. Vamos retornar com as condições atualizadas."
      });
      event.currentTarget.reset();
      setSelectedUnitTypeId("");
      setSelectedUnitId("");
      setRequestTableChecked(false);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Não foi possível enviar agora."
      });
    }
  }

  async function requestTable() {
    setRequestTableChecked(true);
    if (formRef.current && !formRef.current.reportValidity()) {
      setStatus({ type: "error", message: "Informe nome e WhatsApp para receber a tabela." });
      return;
    }

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
          unitTypeName: selectedUnitType?.name,
          unitId: selectedUnit?.id,
          unitLabel: selectedUnit?.displayName ?? selectedUnit?.label,
          sourcePage: window.location.pathname
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error?.message ?? "Tabela indisponível no momento.");
      }

      window.open(data.data.downloadUrl ?? tablePdfUrl ?? "#", "_blank", "noopener,noreferrer");
      setStatus({ type: "success", message: "Tabela aberta. Seu interesse também ficou registrado." });
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

    try {
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
          unitId: selectedUnit?.id,
          unitLabel: selectedUnit?.displayName ?? selectedUnit?.label,
          leadName: formData.get("name"),
          leadPhone: formData.get("whatsapp"),
          leadEmail: formData.get("email"),
          messageTemplate: message,
          sourcePage: window.location.pathname,
          context
        })
      });
    } finally {
      window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    }
  }

  return (
    <article id="atendimento" className="development-section development-section--feature development-interest-section">
      <span className="development-section-eyebrow">Atendimento</span>
      <h2 className="development-section-title">Solicitar atendimento personalizado</h2>

      <div className="development-interest-section-grid">
        <div className="development-interest-section-aside">
          <BrokerSummary />
          <p className="text-card">
            Receba condições, disponibilidade e orientação para escolher a melhor unidade do {developmentName}.
          </p>
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="development-interest-form">
          <div className="development-interest-form-grid">
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

            {units.length ? (
              <div>
                <label htmlFor="dev-unit">Unidade de interesse</label>
                <select
                  id="dev-unit"
                  name="unitId"
                  value={selectedUnitId}
                  onChange={(event) => {
                    setSelectedUnitId(event.target.value);
                    setSelectedUnitTypeId("");
                  }}
                >
                  <option value="">Selecione uma unidade</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.displayName || unit.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : unitTypes.length ? (
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
          </div>

          <div className="development-interest-message-field">
            <label htmlFor="dev-message">Mensagem</label>
            <textarea id="dev-message" name="message" placeholder="Tenho interesse nas condições e tipologias." />
          </div>

          <label id="request-table" className="development-interest-checkbox">
            <input
              type="checkbox"
              name="requestTable"
              checked={requestTableChecked}
              onChange={(event) => setRequestTableChecked(event.target.checked)}
            />
            <span className="text-card">Quero receber a tabela PDF</span>
          </label>

          <div className="development-interest-form-actions">
            <button className="button button-primary" type="submit">
              <Send size={17} /> Enviar interesse
            </button>
            <button type="button" className="button button-whatsapp" onClick={() => trackWhatsappClick("development")}>
              <MessageCircle size={17} /> Falar no WhatsApp
            </button>
            <button type="button" className="button button-ghost" onClick={() => trackWhatsappClick("schedule")}>
              <CalendarDays size={17} /> Agendar apresentação
            </button>
            {tablePdfUrl ? (
              <button type="button" className="button button-ghost" onClick={requestTable} disabled={busyTable}>
                <FileText size={17} /> {busyTable ? "Solicitando..." : "Abrir tabela PDF"}
              </button>
            ) : null}
          </div>

          {status.type !== "idle" ? (
            <p className={`development-interest-status development-interest-status--${status.type}`}>{status.message}</p>
          ) : null}
        </form>
      </div>
    </article>
  );
}
