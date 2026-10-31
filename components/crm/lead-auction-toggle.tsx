"use client";

import { Gavel } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LeadAuctionToggle({ leadId, initialValue }: { leadId: string; initialValue: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const nextValue = !value;
    setValue(nextValue);
    setSaving(true);
    try {
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAuctionClient: nextValue })
      });
      if (!response.ok) throw new Error("Falha ao atualizar classificação.");
      router.refresh();
    } catch {
      setValue(!nextValue);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button type="button" className={`crm-auction-toggle${value ? " is-active" : ""}`} onClick={() => void toggle()} disabled={saving} aria-pressed={value}>
      <Gavel size={15} strokeWidth={1.8} aria-hidden="true" />
      <span>{value ? "Cliente de leilão" : "Classificar como cliente de leilão"}</span>
    </button>
  );
}
