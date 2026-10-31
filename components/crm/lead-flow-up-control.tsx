"use client";

import { ArrowDownToLine, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  leadId: string;
  isRemoved: boolean;
  removedReason?: string | null;
  allowRemove?: boolean;
};

export function LeadFlowUpControl({ leadId, isRemoved, removedReason, allowRemove = false }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(removedReason ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function updateFlowUp(action: "REMOVE" | "RESTORE") {
    if (action === "REMOVE" && !reason.trim()) {
      setStatus("Informe o motivo para retirar do Flow-UP.");
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch(`/api/crm/leads/${leadId}/flow-up`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: reason.trim() || undefined })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) throw new Error(data?.error?.message ?? "Não foi possível atualizar o Flow-UP.");
      setOpen(false);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível atualizar o Flow-UP.");
    } finally {
      setSaving(false);
    }
  }

  if (isRemoved) {
    return (
      <div className="crm-flow-up-control is-removed">
        <div><strong>Fora do Flow-UP</strong><span>{removedReason || "Retirada manual"}</span></div>
        <button type="button" className="button button-ghost" onClick={() => void updateFlowUp("RESTORE")} disabled={saving}>
          <RotateCcw size={15} aria-hidden="true" /> {saving ? "Voltando…" : "Voltar para Flow-UP"}
        </button>
        {status ? <span className="crm-flow-up-control__status" role="alert">{status}</span> : null}
      </div>
    );
  }

  if (!allowRemove) return null;

  return (
    <div className="crm-flow-up-control">
      {!open ? (
        <button type="button" className="button button-ghost" onClick={() => setOpen(true)}>
          <ArrowDownToLine size={15} aria-hidden="true" /> Retirar do Flow-UP
        </button>
      ) : (
        <div className="crm-flow-up-control__form">
          <label htmlFor={`flow-up-reason-${leadId}`}>Por que retirar este cliente?</label>
          <textarea id={`flow-up-reason-${leadId}`} value={reason} onChange={(event) => setReason(event.target.value)} rows={3} placeholder="Ex.: pediu para pausar o atendimento por enquanto." autoFocus />
          <div className="crm-flow-up-control__actions">
            <button type="button" className="button button-ghost" onClick={() => setOpen(false)} disabled={saving}>Cancelar</button>
            <button type="button" className="button button-primary" onClick={() => void updateFlowUp("REMOVE")} disabled={saving}>{saving ? "Retirando…" : "Confirmar retirada"}</button>
          </div>
          {status ? <span className="crm-flow-up-control__status" role="alert">{status}</span> : null}
        </div>
      )}
    </div>
  );
}
