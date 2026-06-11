"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Home,
  Loader2,
  Search,
  Trash2,
  User,
  XCircle
} from "lucide-react";
import { formatCurrencyBRL } from "@/lib/utils";

type ProposalStatus = "ENVIADA" | "ACEITA" | "RECUSADA" | "CONTRA_PROPOSTA" | "EXPIRADA";
type FilterMode = "open" | "closed" | "all";

type FormStatus = {
  type: "idle" | "success" | "error";
  message?: string;
};

export type ProposalLeadOption = {
  id: string;
  name: string;
  phone: string;
  stage: string;
  linkedPropertyId: string | null;
  linkedPropertyTitle: string | null;
};

export type ProposalPropertyOption = {
  id: string;
  title: string;
  city: string;
  district: string;
  price: number;
  status: string;
  purpose: string;
};

export type ProposalListItem = {
  id: string;
  status: ProposalStatus;
  offeredValue: number;
  commissionPct: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  lead: {
    id: string;
    name: string;
    phone: string;
  };
  property: {
    id: string;
    title: string;
    city: string;
    district: string;
    price: number;
  };
  createdByName: string | null;
};

type RawProposal = {
  id: string;
  status: ProposalStatus;
  offeredValue: number | string;
  commissionPct?: number | string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  lead: {
    id: string;
    name: string;
    phone?: string | null;
  };
  property: {
    id: string;
    title: string;
    city?: string | null;
    district?: string | null;
    price?: number | string | null;
  };
  createdBy?: {
    name?: string | null;
  } | null;
};

const OPEN_STATUSES: ProposalStatus[] = ["ENVIADA", "CONTRA_PROPOSTA"];
const CLOSED_STATUSES: ProposalStatus[] = ["ACEITA", "RECUSADA", "EXPIRADA"];

const STATUS_LABELS: Record<ProposalStatus, string> = {
  ENVIADA: "Enviada",
  ACEITA: "Aceita",
  RECUSADA: "Recusada",
  CONTRA_PROPOSTA: "Contra proposta",
  EXPIRADA: "Expirada"
};

const FILTER_LABELS: Record<FilterMode, string> = {
  open: "Abertas",
  closed: "Encerradas",
  all: "Todas"
};

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeProposal(raw: RawProposal, fallback?: ProposalListItem): ProposalListItem {
  return {
    id: raw.id,
    status: raw.status,
    offeredValue: toNumber(raw.offeredValue),
    commissionPct: raw.commissionPct === null || raw.commissionPct === undefined ? null : toNumber(raw.commissionPct),
    notes: raw.notes ?? null,
    createdAt: raw.createdAt ?? fallback?.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
    lead: {
      id: raw.lead.id,
      name: raw.lead.name,
      phone: raw.lead.phone ?? fallback?.lead.phone ?? ""
    },
    property: {
      id: raw.property.id,
      title: raw.property.title,
      city: raw.property.city ?? fallback?.property.city ?? "",
      district: raw.property.district ?? fallback?.property.district ?? "",
      price: toNumber(raw.property.price ?? fallback?.property.price)
    },
    createdByName: raw.createdBy?.name ?? fallback?.createdByName ?? null
  };
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const text = await response.text();
  let payload: {
    success?: boolean;
    data?: unknown;
    error?: { message?: string };
  } | null = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("Resposta inválida do servidor. A operação não foi concluída.");
  }

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message ?? "Não foi possível concluir a operação.");
  }

  return payload.data as T;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function statusTone(status: ProposalStatus) {
  if (status === "ACEITA") return "success";
  if (status === "RECUSADA" || status === "EXPIRADA") return "danger";
  if (status === "CONTRA_PROPOSTA") return "warn";
  return "info";
}

export function ProposalManager({
  leads,
  properties,
  proposals
}: {
  leads: ProposalLeadOption[];
  properties: ProposalPropertyOption[];
  proposals: ProposalListItem[];
}) {
  const firstLead = leads[0];
  const firstPropertyId = firstLead?.linkedPropertyId ?? properties[0]?.id ?? "";
  const firstProperty = properties.find((property) => property.id === firstPropertyId) ?? properties[0];

  const [items, setItems] = useState<ProposalListItem[]>(proposals);
  const [filter, setFilter] = useState<FilterMode>("open");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [form, setForm] = useState({
    leadId: firstLead?.id ?? "",
    propertyId: firstProperty?.id ?? "",
    offeredValue: firstProperty?.price ? String(firstProperty.price) : "",
    commissionPct: "",
    notes: ""
  });

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === form.leadId) ?? null,
    [form.leadId, leads]
  );
  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === form.propertyId) ?? null,
    [form.propertyId, properties]
  );
  const linkedProperty = useMemo(
    () => properties.find((property) => property.id === selectedLead?.linkedPropertyId) ?? null,
    [properties, selectedLead?.linkedPropertyId]
  );

  const stats = useMemo(() => {
    const openItems = items.filter((item) => OPEN_STATUSES.includes(item.status));
    return {
      open: openItems.length,
      accepted: items.filter((item) => item.status === "ACEITA").length,
      openValue: openItems.reduce((total, item) => total + item.offeredValue, 0)
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "open" && OPEN_STATUSES.includes(item.status)) ||
        (filter === "closed" && CLOSED_STATUSES.includes(item.status));
      if (!matchesFilter) return false;
      if (!search) return true;

      return [
        item.lead.name,
        item.lead.phone,
        item.property.title,
        item.property.city,
        item.property.district,
        STATUS_LABELS[item.status],
        item.notes ?? ""
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [filter, items, query]);

  function selectLead(leadId: string) {
    const lead = leads.find((entry) => entry.id === leadId);
    const nextProperty =
      properties.find((property) => property.id === lead?.linkedPropertyId) ??
      properties.find((property) => property.id === form.propertyId) ??
      properties[0];

    setForm((current) => ({
      ...current,
      leadId,
      propertyId: nextProperty?.id ?? "",
      offeredValue: current.offeredValue || (nextProperty?.price ? String(nextProperty.price) : "")
    }));
  }

  function selectProperty(propertyId: string) {
    const property = properties.find((entry) => entry.id === propertyId);
    setForm((current) => ({
      ...current,
      propertyId,
      offeredValue: current.offeredValue || (property?.price ? String(property.price) : "")
    }));
  }

  async function createProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "idle" });
    setPendingAction("create");

    try {
      const data = await requestJson<{ proposal: RawProposal }>("/api/crm/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: form.leadId,
          propertyId: form.propertyId,
          offeredValue: Number(form.offeredValue),
          commissionPct: form.commissionPct === "" ? undefined : Number(form.commissionPct),
          notes: form.notes || undefined
        })
      });

      setItems((current) => [normalizeProposal(data.proposal), ...current]);
      setForm((current) => ({
        ...current,
        offeredValue: selectedProperty?.price ? String(selectedProperty.price) : "",
        commissionPct: "",
        notes: ""
      }));
      setStatus({ type: "success", message: "Proposta registrada e histórico do lead atualizado." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Não foi possível registrar a proposta."
      });
    } finally {
      setPendingAction(null);
    }
  }

  async function updateStatus(proposal: ProposalListItem, nextStatus: ProposalStatus) {
    setPendingAction(`${proposal.id}:${nextStatus}`);
    setStatus({ type: "idle" });

    try {
      const data = await requestJson<{ proposal: RawProposal }>(`/api/crm/proposals/${proposal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });

      setItems((current) =>
        current.map((item) => (item.id === proposal.id ? normalizeProposal(data.proposal, item) : item))
      );
      setStatus({ type: "success", message: `Proposta marcada como ${STATUS_LABELS[nextStatus].toLowerCase()}.` });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Não foi possível atualizar a proposta."
      });
    } finally {
      setPendingAction(null);
    }
  }

  async function deleteProposal(proposal: ProposalListItem) {
    if (!window.confirm(`Excluir a proposta de ${proposal.lead.name}?`)) return;

    setPendingAction(`${proposal.id}:delete`);
    setStatus({ type: "idle" });

    try {
      await requestJson<{ id: string }>(`/api/crm/proposals/${proposal.id}`, {
        method: "DELETE"
      });

      setItems((current) => current.filter((item) => item.id !== proposal.id));
      setStatus({ type: "success", message: "Proposta excluída e histórico do lead preservado." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Não foi possível excluir a proposta."
      });
    } finally {
      setPendingAction(null);
    }
  }

  const canSubmit = Boolean(form.leadId && form.propertyId && Number(form.offeredValue) > 0);

  return (
    <div className="crm-proposals">
      <form className="crm-proposals-form" onSubmit={createProposal}>
        <header className="crm-proposals-form__head">
          <div>
            <h2>
              <FileText size={18} strokeWidth={1.9} aria-hidden="true" /> Nova proposta
            </h2>
            <p>O imóvel vinculado ao lead é selecionado automaticamente quando existir.</p>
          </div>
        </header>

        <div className="form-grid">
          <div>
            <label htmlFor="proposal-lead">Lead</label>
            <select
              id="proposal-lead"
              value={form.leadId}
              onChange={(event) => selectLead(event.target.value)}
              required
              disabled={leads.length === 0}
            >
              <option value="">Selecione um lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name} · {lead.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="proposal-property">Imóvel</label>
            <select
              id="proposal-property"
              value={form.propertyId}
              onChange={(event) => selectProperty(event.target.value)}
              required
              disabled={properties.length === 0}
            >
              <option value="">Selecione um imóvel</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title} · {formatCurrencyBRL(property.price)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="proposal-value">Valor ofertado</label>
            <input
              id="proposal-value"
              type="number"
              min="1"
              step="0.01"
              value={form.offeredValue}
              onChange={(event) => setForm((current) => ({ ...current, offeredValue: event.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="proposal-commission">Comissão (%)</label>
            <input
              id="proposal-commission"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={form.commissionPct}
              onChange={(event) => setForm((current) => ({ ...current, commissionPct: event.target.value }))}
            />
          </div>

          <div className="crm-proposals-form__link">
            <span>Vínculo atual</span>
            <strong>
              {linkedProperty
                ? linkedProperty.title
                : selectedLead
                  ? "Lead sem imóvel vinculado"
                  : "Selecione um lead"}
            </strong>
            {selectedProperty ? <small>Proposta para {selectedProperty.title}</small> : null}
          </div>

          <div className="crm-proposals-form__notes">
            <label htmlFor="proposal-notes">Observações</label>
            <textarea
              id="proposal-notes"
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Condição de pagamento, contraproposta, prazo de validade..."
            />
          </div>
        </div>

        <footer className="crm-proposals-form__footer">
          <button className="button button-primary" type="submit" disabled={!canSubmit || pendingAction === "create"}>
            {pendingAction === "create" ? <Loader2 size={16} className="crm-spin" aria-hidden="true" /> : null}
            Registrar proposta
          </button>
          {status.type !== "idle" ? (
            <p className={`crm-proposals__status is-${status.type}`}>{status.message}</p>
          ) : null}
        </footer>
      </form>

      <section className="crm-proposals__summary" aria-label="Resumo de propostas">
        <article>
          <span>Abertas</span>
          <strong>{stats.open}</strong>
        </article>
        <article>
          <span>Aceitas</span>
          <strong>{stats.accepted}</strong>
        </article>
        <article>
          <span>Valor em aberto</span>
          <strong>{formatCurrencyBRL(stats.openValue)}</strong>
        </article>
      </section>

      <section className="crm-proposals__toolbar" aria-label="Filtros de propostas">
        <div className="crm-proposals__filters">
          {(["open", "closed", "all"] as FilterMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className={filter === mode ? "is-active" : ""}
              onClick={() => setFilter(mode)}
            >
              {FILTER_LABELS[mode]}
            </button>
          ))}
        </div>
        <label className="crm-proposals__search">
          <Search size={16} strokeWidth={1.9} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por lead, imóvel ou status"
          />
        </label>
      </section>

      {filteredItems.length === 0 ? (
        <p className="crm-panel__empty">Nenhuma proposta encontrada para este filtro.</p>
      ) : (
        <ul className="crm-proposals-list">
          {filteredItems.map((proposal) => {
            const actionKey = `${proposal.id}:`;
            const isBusy = Boolean(pendingAction?.startsWith(actionKey));

            return (
              <li key={proposal.id} className="crm-proposals-card">
                <header className="crm-proposals-card__head">
                  <div>
                    <span className={`crm-proposals-card__status is-${statusTone(proposal.status)}`}>
                      {STATUS_LABELS[proposal.status]}
                    </span>
                    <h3>{proposal.property.title}</h3>
                    <p>
                      {proposal.property.district || proposal.property.city || "Local não informado"} ·{" "}
                      {formatDateTime(proposal.createdAt)}
                    </p>
                  </div>
                  <strong>{formatCurrencyBRL(proposal.offeredValue)}</strong>
                </header>

                <dl className="crm-proposals-card__details">
                  <div>
                    <dt>
                      <User size={14} strokeWidth={2} aria-hidden="true" /> Lead
                    </dt>
                    <dd>{proposal.lead.name}</dd>
                  </div>
                  <div>
                    <dt>
                      <Home size={14} strokeWidth={2} aria-hidden="true" /> Imóvel
                    </dt>
                    <dd>{formatCurrencyBRL(proposal.property.price)}</dd>
                  </div>
                  <div>
                    <dt>
                      <DollarSign size={14} strokeWidth={2} aria-hidden="true" /> Comissão
                    </dt>
                    <dd>{proposal.commissionPct === null ? "Não definida" : `${proposal.commissionPct}%`}</dd>
                  </div>
                </dl>

                {proposal.notes ? <p className="crm-proposals-card__notes">{proposal.notes}</p> : null}

                <footer className="crm-proposals-card__actions">
                  <Link className="button button-ghost" href={`/crm/imoveis/${proposal.property.id}`}>
                    <Home size={15} strokeWidth={2} aria-hidden="true" /> Abrir imóvel
                  </Link>
                  <button
                    type="button"
                    className="crm-proposals-card__action is-success"
                    onClick={() => updateStatus(proposal, "ACEITA")}
                    disabled={isBusy || proposal.status === "ACEITA"}
                  >
                    <CheckCircle2 size={15} strokeWidth={2} aria-hidden="true" /> Aceitar
                  </button>
                  <button
                    type="button"
                    className="crm-proposals-card__action is-warn"
                    onClick={() => updateStatus(proposal, "CONTRA_PROPOSTA")}
                    disabled={isBusy || proposal.status === "CONTRA_PROPOSTA"}
                  >
                    <Clock size={15} strokeWidth={2} aria-hidden="true" /> Contra
                  </button>
                  <button
                    type="button"
                    className="crm-proposals-card__action is-danger"
                    onClick={() => updateStatus(proposal, "RECUSADA")}
                    disabled={isBusy || proposal.status === "RECUSADA"}
                  >
                    <XCircle size={15} strokeWidth={2} aria-hidden="true" /> Recusar
                  </button>
                  <button
                    type="button"
                    className="crm-proposals-card__action is-neutral"
                    onClick={() => updateStatus(proposal, "EXPIRADA")}
                    disabled={isBusy || proposal.status === "EXPIRADA"}
                  >
                    <Clock size={15} strokeWidth={2} aria-hidden="true" /> Expirar
                  </button>
                  <button
                    type="button"
                    className="crm-proposals-card__action is-muted"
                    onClick={() => deleteProposal(proposal)}
                    disabled={isBusy}
                    title="Excluir proposta"
                  >
                    <Trash2 size={15} strokeWidth={2} aria-hidden="true" /> Excluir
                  </button>
                </footer>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
