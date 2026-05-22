"use client";

import { useState } from "react";

const options = [
  { value: "NOVO", label: "Novo" },
  { value: "EM_ATENDIMENTO", label: "Em atendimento" },
  { value: "RECEBEU_TABELA", label: "Recebeu tabela" },
  { value: "AGENDOU_APRESENTACAO", label: "Agendou apresentação" },
  { value: "EM_NEGOCIACAO", label: "Em negociação" },
  { value: "COMPROU", label: "Comprou" },
  { value: "PERDIDO", label: "Perdido" }
] as const;

type OptionValue = (typeof options)[number]["value"];

export function LeadDevelopmentStatusControl({
  leadId,
  initialStatus,
  disabled
}: {
  leadId: string;
  initialStatus: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState<OptionValue>((initialStatus as OptionValue) || "NOVO");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");

  async function saveStatus() {
    setSaving(true);
    setFeedback("idle");

    try {
      const response = await fetch(`/api/crm/leads/${leadId}/development-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ developmentLeadStatus: value })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data?.error?.message ?? "Falha ao atualizar status.");
      }

      setFeedback("success");
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  }

  if (disabled) {
    const label = options.find((option) => option.value === value)?.label ?? "-";
    return <span>{label}</span>;
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 220 }}>
      <select value={value} onChange={(event) => setValue(event.target.value as OptionValue)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="button button-ghost"
        style={{ padding: "0.45rem 0.7rem", minWidth: 90 }}
        onClick={saveStatus}
        disabled={saving}
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>
      {feedback === "success" ? <span style={{ color: "#099268", fontSize: "var(--fs-12)" }}>OK</span> : null}
      {feedback === "error" ? <span style={{ color: "#c92a2a", fontSize: "var(--fs-12)" }}>Erro</span> : null}
    </div>
  );
}
