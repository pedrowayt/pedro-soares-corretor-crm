"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Trash2 } from "lucide-react";

type Props = {
  leadId: string;
  leadName: string;
  whatsappUrl?: string | null;
  compact?: boolean;
};

export function LeadActions({ leadId, leadName, whatsappUrl, compact = false }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function deleteLead() {
    if (!window.confirm(`Excluir o lead "${leadName}"? Essa ação não pode ser desfeita.`)) return;

    setDeleting(true);
    setError(null);
    try {
      const response = await fetch(`/api/crm/leads/${leadId}`, { method: "DELETE" });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) throw new Error(data?.error?.message ?? "Não foi possível excluir o lead.");
      router.push("/crm/leads");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível excluir o lead.");
      setDeleting(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      {whatsappUrl ? (
        <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label={`Abrir WhatsApp de ${leadName}`}>
          <MessageCircle size={compact ? 14 : 16} strokeWidth={1.75} aria-hidden="true" />
          WhatsApp
        </a>
      ) : null}
      <button type="button" className="button button-ghost" onClick={() => void deleteLead()} disabled={deleting}>
        <Trash2 size={compact ? 14 : 16} strokeWidth={1.75} aria-hidden="true" />
        {deleting ? "Excluindo..." : "Excluir lead"}
      </button>
      {error ? <span role="alert" style={{ color: "var(--danger, #c65d5d)", fontSize: 12 }}>{error}</span> : null}
    </div>
  );
}
