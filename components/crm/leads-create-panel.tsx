"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { QuickLeadForm } from "@/components/crm/quick-forms";

type Choice = { id: string; title: string };

export function LeadsCreatePanel({ properties, developments }: { properties: Choice[]; developments: Choice[] }) {
  const [open, setOpen] = useState(() => typeof window !== "undefined" && window.location.hash === "#quick-create");

  return (
    <div className="crm-leads-create-panel">
      <button type="button" className="button button-primary crm-leads-new-button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="quick-create">
        {open ? <X size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
        {open ? "Fechar" : "Novo lead"}
      </button>
      {open ? (
        <>
          <button type="button" className="crm-leads-create-backdrop" onClick={() => setOpen(false)} aria-label="Fechar cadastro de Lead" />
          <div id="quick-create" className="crm-quick-form-target crm-leads-create-form">
            <QuickLeadForm properties={properties} developments={developments} />
          </div>
        </>
      ) : null}
    </div>
  );
}
