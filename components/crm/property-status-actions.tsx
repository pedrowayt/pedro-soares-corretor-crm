"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const STATUS_LABELS: Record<string, string> = {
  DISPONIVEL: "Disponível",
  RESERVADO: "Reservado",
  VENDIDO: "Vendido",
  ALUGADO: "Alugado",
  EM_ANALISE: "Em análise"
};

const STATUS_TONE: Record<string, string> = {
  DISPONIVEL: "tone-available",
  RESERVADO: "tone-reserved",
  VENDIDO: "tone-sold",
  ALUGADO: "tone-rented",
  EM_ANALISE: "tone-pending"
};

type Props = {
  propertyId: string;
  currentStatus: string;
  compact?: boolean;
};

export function PropertyStatusActions({ propertyId, currentStatus, compact = false }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function updateStatus(next: string) {
    if (next === status || isPending) return;
    setError(null);
    const previous = status;
    setStatus(next);

    try {
      const response = await fetch(`/api/crm/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.error?.message ?? "Falha ao atualizar status.");
      }

      startTransition(() => router.refresh());
    } catch (caught) {
      setStatus(previous);
      setError(caught instanceof Error ? caught.message : "Falha ao atualizar status.");
    }
  }

  const options = ["DISPONIVEL", "RESERVADO", "VENDIDO"] as const;

  return (
    <div className={`property-status-actions ${compact ? "property-status-actions--compact" : ""}`}>
      <span className={`badge badge-${STATUS_TONE[status] ?? "tone-pending"}`}>
        {STATUS_LABELS[status] ?? status}
      </span>
      <div className="property-status-actions__buttons">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`property-status-chip ${status === option ? "is-active" : ""}`}
            onClick={() => updateStatus(option)}
            disabled={isPending || status === option}
            aria-pressed={status === option}
          >
            {STATUS_LABELS[option]}
          </button>
        ))}
      </div>
      {error ? <p className="property-status-actions__error">{error}</p> : null}
    </div>
  );
}
