"use client";

import { useState } from "react";

type Status = { type: "idle" | "success" | "error"; message?: string };

async function postJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const raw = await response.text();
  let data: { success?: boolean; error?: { message?: string } } | null = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.error?.message ?? response.statusText ?? "Erro ao enviar dados.");
  }

  return data;
}

export function QuickLeadForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  return (
    <form
      className="card"
      style={{ padding: 16 }}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
          await postJson("/api/crm/leads", {
            name: formData.get("name"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            source: formData.get("source"),
            intent: formData.get("intent")
          });
          setStatus({ type: "success", message: "Lead cadastrado." });
          event.currentTarget.reset();
        } catch (error) {
          setStatus({ type: "error", message: error instanceof Error ? error.message : "Falha." });
        }
      }}
    >
      <h3 style={{ marginTop: 0 }}>Novo lead</h3>
      <div className="form-grid">
        <div>
          <label>Nome</label>
          <input name="name" required />
        </div>
        <div>
          <label>Telefone</label>
          <input name="phone" required />
        </div>
        <div>
          <label>E-mail</label>
          <input name="email" type="email" />
        </div>
        <div>
          <label>Origem</label>
          <select name="source" defaultValue="SITE">
            <option value="SITE">Site</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="INDICACAO">Indicação</option>
            <option value="TRAFEGO_PAGO">Tráfego pago</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
        <div>
          <label>Interesse</label>
          <select name="intent" defaultValue="COMPRAR">
            <option value="COMPRAR">Comprar</option>
            <option value="VENDER">Vender</option>
            <option value="INVESTIR">Investir</option>
            <option value="ALUGAR">Alugar</option>
          </select>
        </div>
      </div>
      <button className="button button-primary" type="submit" style={{ marginTop: 10 }}>
        Salvar lead
      </button>
      {status.type !== "idle" ? <p style={{ marginTop: 8 }}>{status.message}</p> : null}
    </form>
  );
}

export function QuickTaskForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  return (
    <form
      className="card"
      style={{ padding: 16 }}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
          await postJson("/api/crm/tasks", {
            title: formData.get("title"),
            description: formData.get("description"),
            priority: formData.get("priority") || "MEDIA",
            dueAt: formData.get("dueAt") ? new Date(String(formData.get("dueAt"))).toISOString() : undefined
          });
          setStatus({ type: "success", message: "Tarefa criada." });
          event.currentTarget.reset();
        } catch (error) {
          setStatus({ type: "error", message: error instanceof Error ? error.message : "Falha." });
        }
      }}
    >
      <h3 style={{ marginTop: 0 }}>Nova tarefa</h3>
      <div className="form-grid">
        <div>
          <label>Título</label>
          <input name="title" required />
        </div>
        <div>
          <label>Prioridade</label>
          <select name="priority" defaultValue="MEDIA">
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
            <option value="URGENTE">Urgente</option>
          </select>
        </div>
        <div>
          <label>Vencimento</label>
          <input name="dueAt" type="datetime-local" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Descrição</label>
          <textarea name="description" />
        </div>
      </div>
      <button className="button button-primary" type="submit" style={{ marginTop: 10 }}>
        Criar tarefa
      </button>
      {status.type !== "idle" ? <p style={{ marginTop: 8 }}>{status.message}</p> : null}
    </form>
  );
}

export function QuickVisitForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  return (
    <form
      className="card"
      style={{ padding: 16 }}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
          await postJson("/api/crm/visits", {
            leadId: formData.get("leadId"),
            propertyId: formData.get("propertyId"),
            scheduledAt: new Date(String(formData.get("scheduledAt"))).toISOString(),
            notes: formData.get("notes")
          });
          setStatus({ type: "success", message: "Visita agendada." });
          event.currentTarget.reset();
        } catch (error) {
          setStatus({ type: "error", message: error instanceof Error ? error.message : "Falha." });
        }
      }}
    >
      <h3 style={{ marginTop: 0 }}>Agendar visita</h3>
      <div className="form-grid">
        <div>
          <label>ID do lead</label>
          <input name="leadId" required />
        </div>
        <div>
          <label>ID do imóvel</label>
          <input name="propertyId" required />
        </div>
        <div>
          <label>Data/hora</label>
          <input name="scheduledAt" type="datetime-local" required />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Observação</label>
          <textarea name="notes" />
        </div>
      </div>
      <button className="button button-primary" type="submit" style={{ marginTop: 10 }}>
        Salvar visita
      </button>
      {status.type !== "idle" ? <p style={{ marginTop: 8 }}>{status.message}</p> : null}
    </form>
  );
}

export function QuickProposalForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  return (
    <form
      className="card"
      style={{ padding: 16 }}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        try {
          await postJson("/api/crm/proposals", {
            leadId: formData.get("leadId"),
            propertyId: formData.get("propertyId"),
            offeredValue: Number(formData.get("offeredValue")),
            commissionPct: Number(formData.get("commissionPct") || 0),
            notes: formData.get("notes")
          });
          setStatus({ type: "success", message: "Proposta registrada." });
          event.currentTarget.reset();
        } catch (error) {
          setStatus({ type: "error", message: error instanceof Error ? error.message : "Falha." });
        }
      }}
    >
      <h3 style={{ marginTop: 0 }}>Nova proposta</h3>
      <div className="form-grid">
        <div>
          <label>ID do lead</label>
          <input name="leadId" required />
        </div>
        <div>
          <label>ID do imóvel</label>
          <input name="propertyId" required />
        </div>
        <div>
          <label>Valor ofertado</label>
          <input name="offeredValue" type="number" min={0} required />
        </div>
        <div>
          <label>Comissão (%)</label>
          <input name="commissionPct" type="number" min={0} max={100} step="0.1" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Observações</label>
          <textarea name="notes" />
        </div>
      </div>
      <button className="button button-primary" type="submit" style={{ marginTop: 10 }}>
        Registrar proposta
      </button>
      {status.type !== "idle" ? <p style={{ marginTop: 8 }}>{status.message}</p> : null}
    </form>
  );
}
