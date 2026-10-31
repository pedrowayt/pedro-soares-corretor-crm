"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LeadFlowUpControl } from "@/components/crm/lead-flow-up-control";

type LeadEditValues = {
  name: string;
  phone: string;
  email: string;
  intent: string;
  desiredType: string;
  desiredPurpose: string;
  budgetMin: string;
  budgetMax: string;
  targetValue: string;
  interestDescription: string;
  notes: string;
  isAuctionClient: boolean;
};

type Props = { leadId: string; initialValues: LeadEditValues; flowUpRemovedAt?: Date | string | null; flowUpRemovedReason?: string | null };

export function LeadEditForm({ leadId, initialValues, flowUpRemovedAt = null, flowUpRemovedReason = null }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(name: keyof LeadEditValues, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    const payload = {
      name: values.name,
      phone: values.phone,
      email: values.email || null,
      intent: values.intent,
      desiredType: values.desiredType || null,
      desiredPurpose: values.desiredPurpose || null,
      budgetMin: values.budgetMin ? Number(values.budgetMin) : null,
      budgetMax: values.budgetMax ? Number(values.budgetMax) : null,
      targetValue: values.targetValue ? Number(values.targetValue) : null,
      interestDescription: values.interestDescription || null,
      notes: values.notes || null,
      isAuctionClient: values.isAuctionClient
    };
    try {
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) throw new Error(data?.error?.message ?? "Não foi possível salvar as alterações.");
      setStatus("Alterações salvas.");
      setOpen(false);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="crm-lead-edit">
      <button type="button" className="button button-ghost" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        {open ? "Fechar edição" : "Editar Lead"}
      </button>
      {open ? (
        <form className="crm-panel crm-lead-edit__form" onSubmit={save}>
          <header className="crm-panel__head"><h2>Editar informações</h2><span>Atualize o perfil comercial sem perder o histórico.</span></header>
          <div className="form-grid">
            <div><label>Nome</label><input value={values.name} onChange={(event) => update("name", event.target.value)} required /></div>
            <div><label>Telefone</label><input value={values.phone} onChange={(event) => update("phone", event.target.value)} required /></div>
            <div><label>E-mail</label><input type="email" value={values.email} onChange={(event) => update("email", event.target.value)} /></div>
            <div><label>Interesse</label><select value={values.intent} onChange={(event) => update("intent", event.target.value)}><option value="COMPRAR">Comprar</option><option value="VENDER">Vender</option><option value="INVESTIR">Investir</option><option value="ALUGAR">Alugar</option></select></div>
            <div><label>Tipo de imóvel</label><select value={values.desiredType} onChange={(event) => update("desiredType", event.target.value)}><option value="">Não informado</option>{["CASA", "APARTAMENTO", "LOTE", "COMERCIAL", "RURAL", "FAZENDA", "SALA", "GALPAO"].map((type) => <option key={type} value={type}>{type}</option>)}</select></div>
            <div><label>Finalidade</label><select value={values.desiredPurpose} onChange={(event) => update("desiredPurpose", event.target.value)}><option value="">Não informado</option><option value="VENDA">Venda</option><option value="INVESTIMENTO">Investimento</option><option value="LEILAO">Leilão</option><option value="LANCAMENTO">Lançamento</option><option value="LOCACAO">Locação</option></select></div>
            <div><label>Orçamento mínimo</label><input type="number" min="0" value={values.budgetMin} onChange={(event) => update("budgetMin", event.target.value)} /></div>
            <div><label>Orçamento máximo</label><input type="number" min="0" value={values.budgetMax} onChange={(event) => update("budgetMax", event.target.value)} /></div>
            <div><label>Valor-alvo</label><input type="number" min="0" value={values.targetValue} onChange={(event) => update("targetValue", event.target.value)} /></div>
            <label className="crm-form-checkbox"><input type="checkbox" checked={values.isAuctionClient} onChange={(event) => update("isAuctionClient", event.target.checked)} /><span>Cliente de leilão</span></label>
            <div style={{ gridColumn: "1 / -1" }}><label>O que ele procura</label><textarea value={values.interestDescription} onChange={(event) => update("interestDescription", event.target.value)} rows={4} /></div>
            <div style={{ gridColumn: "1 / -1" }}><label>Notas internas</label><textarea value={values.notes} onChange={(event) => update("notes", event.target.value)} rows={4} /></div>
          </div>
          <footer className="crm-lead-edit__footer"><button type="submit" className="button button-primary" disabled={saving}>{saving ? "Salvando…" : "Salvar alterações"}</button>{status ? <span role="status">{status}</span> : null}</footer>
          <LeadFlowUpControl leadId={leadId} isRemoved={Boolean(flowUpRemovedAt)} removedReason={flowUpRemovedReason} />
        </form>
      ) : null}
    </section>
  );
}
