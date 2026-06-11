"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Home,
  Search,
  Trash2,
  User,
  X
} from "lucide-react";

type Status = { type: "idle" | "success" | "error"; message?: string };

export type VisitLeadOption = {
  id: string;
  name: string;
  phone: string;
  stage: string;
  linkedPropertyId: string | null;
  linkedPropertyTitle: string | null;
};

export type VisitPropertyOption = {
  id: string;
  title: string;
  city: string;
  district: string;
  price: number;
  status: string;
  purpose: string;
};

export type VisitListItem = {
  id: string;
  status: string;
  scheduledAt: string;
  notes: string | null;
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
  };
  assignedToName: string | null;
};

type VisitManagerProps = {
  leads: VisitLeadOption[];
  properties: VisitPropertyOption[];
  visits: VisitListItem[];
};

const STATUS_LABELS: Record<string, string> = {
  AGENDADA: "Agendada",
  REALIZADA: "Realizada",
  CANCELADA: "Cancelada",
  REAGENDADA: "Reagendada"
};

const FILTERS = [
  { id: "upcoming", label: "Próximas" },
  { id: "history", label: "Histórico" },
  { id: "all", label: "Todas" }
] as const;

type VisitFilter = (typeof FILTERS)[number]["id"];

async function requestJson(url: string, init: RequestInit) {
  const response = await fetch(url, init);
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
    throw new Error(data?.error?.message ?? response.statusText ?? "Falha na operação.");
  }

  return data;
}

function toDatetimeLocal(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function defaultScheduledAt() {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  next.setHours(9, 0, 0, 0);
  return toDatetimeLocal(next);
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isFutureVisit(visit: VisitListItem) {
  const activeStatus = visit.status === "AGENDADA" || visit.status === "REAGENDADA";
  return activeStatus && new Date(visit.scheduledAt).getTime() >= Date.now();
}

export function VisitManager({ leads, properties, visits }: VisitManagerProps) {
  const router = useRouter();
  const [leadId, setLeadId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [scheduledAt, setScheduledAt] = useState(defaultScheduledAt);
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<VisitFilter>("upcoming");
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const selectedLead = leads.find((lead) => lead.id === leadId) ?? null;

  const stats = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999);

    return {
      upcoming: visits.filter(isFutureVisit).length,
      today: visits.filter((visit) => {
        const date = new Date(visit.scheduledAt);
        return date >= todayStart && date <= todayEnd && visit.status !== "CANCELADA";
      }).length,
      completed: visits.filter((visit) => visit.status === "REALIZADA").length
    };
  }, [visits]);

  const visibleVisits = useMemo(() => {
    const term = normalizeSearch(search);

    return visits.filter((visit) => {
      if (filter === "upcoming" && !isFutureVisit(visit)) return false;
      if (filter === "history" && isFutureVisit(visit)) return false;

      if (!term) return true;
      const searchable = normalizeSearch(
        [
          visit.lead.name,
          visit.lead.phone,
          visit.property.title,
          visit.property.city,
          visit.property.district,
          STATUS_LABELS[visit.status] ?? visit.status,
          visit.notes
        ]
          .filter(Boolean)
          .join(" ")
      );
      return searchable.includes(term);
    });
  }, [filter, search, visits]);

  async function createVisit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "idle" });
    setPendingAction("create");

    try {
      await requestJson("/api/crm/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          propertyId,
          scheduledAt: new Date(scheduledAt).toISOString(),
          notes
        })
      });
      setStatus({ type: "success", message: "Visita agendada e histórico criado." });
      setNotes("");
      setScheduledAt(defaultScheduledAt());
      router.refresh();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Falha ao agendar visita."
      });
    } finally {
      setPendingAction(null);
    }
  }

  async function updateVisit(visitId: string, payload: Record<string, unknown>, successMessage: string) {
    setStatus({ type: "idle" });
    setPendingAction(visitId);

    try {
      await requestJson(`/api/crm/visits/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setStatus({ type: "success", message: successMessage });
      router.refresh();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Falha ao atualizar visita."
      });
    } finally {
      setPendingAction(null);
    }
  }

  async function deleteVisit(visitId: string) {
    if (!window.confirm("Excluir esta visita do CRM?")) return;
    setStatus({ type: "idle" });
    setPendingAction(visitId);

    try {
      await requestJson(`/api/crm/visits/${visitId}`, { method: "DELETE" });
      setStatus({ type: "success", message: "Visita excluída e histórico registrado." });
      router.refresh();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Falha ao excluir visita."
      });
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="crm-visits">
      <section className="crm-visits__planner crm-panel" id="quick-create">
        <header className="crm-panel__head">
          <h2>
            <CalendarPlus size={16} strokeWidth={1.8} aria-hidden="true" /> Agendar visita
          </h2>
        </header>

        <form onSubmit={createVisit} className="crm-visits-form">
          <div className="form-grid">
            <div>
              <label>Lead</label>
              <select
                value={leadId}
                onChange={(event) => {
                  const nextLeadId = event.target.value;
                  const nextLead = leads.find((lead) => lead.id === nextLeadId);
                  setLeadId(nextLeadId);
                  setPropertyId(nextLead?.linkedPropertyId ?? "");
                }}
                required
              >
                <option value="">Selecione o lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} · {lead.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Imóvel</label>
              <select
                value={propertyId}
                onChange={(event) => setPropertyId(event.target.value)}
                required
              >
                <option value="">Selecione o imóvel</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title} · {property.district}, {property.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Data/hora</label>
              <input
                name="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
                required
              />
            </div>

            <div>
              <label>Vínculo atual</label>
              <input
                value={selectedLead?.linkedPropertyTitle ?? "Sem imóvel vinculado"}
                readOnly
                aria-label="Vínculo atual do lead"
              />
            </div>

            <div className="crm-visits-form__notes">
              <label>Observação</label>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
            </div>
          </div>

          <footer className="crm-visits-form__footer">
            <button className="button button-primary" type="submit" disabled={pendingAction === "create"}>
              <CalendarPlus size={16} strokeWidth={1.8} aria-hidden="true" />
              {pendingAction === "create" ? "Salvando..." : "Salvar visita"}
            </button>
            {status.type !== "idle" ? (
              <p className={`crm-visits__status is-${status.type}`}>{status.message}</p>
            ) : null}
          </footer>
        </form>
      </section>

      <section className="crm-visits__summary" aria-label="Resumo de visitas">
        <article>
          <Clock size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>Próximas</span>
          <strong>{stats.upcoming}</strong>
        </article>
        <article>
          <CalendarCheck size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>Hoje</span>
          <strong>{stats.today}</strong>
        </article>
        <article>
          <CheckCircle2 size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>Realizadas</span>
          <strong>{stats.completed}</strong>
        </article>
      </section>

      <section className="crm-visits__list crm-panel">
        <header className="crm-visits__toolbar">
          <div className="crm-visits__filters" role="tablist" aria-label="Filtro de visitas">
            {FILTERS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={filter === entry.id ? "is-active" : ""}
                onClick={() => setFilter(entry.id)}
                role="tab"
                aria-selected={filter === entry.id}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <label className="crm-visits__search">
            <Search size={15} strokeWidth={1.8} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar"
            />
          </label>
        </header>

        {visibleVisits.length === 0 ? (
          <p className="crm-panel__empty">Nenhuma visita encontrada.</p>
        ) : (
          <ul className="crm-visits-list">
            {visibleVisits.map((visit) => {
              const isPending = pendingAction === visit.id;
              return (
                <li key={visit.id} className="crm-visits-card">
                  <div className="crm-visits-card__main">
                    <header>
                      <span className={`crm-visits-card__status is-${visit.status.toLowerCase()}`}>
                        {STATUS_LABELS[visit.status] ?? visit.status}
                      </span>
                      <time>{formatDateTime(visit.scheduledAt)}</time>
                    </header>
                    <h3>{visit.property.title}</h3>
                    <p>
                      <Home size={14} strokeWidth={1.8} aria-hidden="true" />
                      {visit.property.district}, {visit.property.city}
                    </p>
                    <p>
                      <User size={14} strokeWidth={1.8} aria-hidden="true" />
                      <Link href={`/crm/leads/${visit.lead.id}`}>{visit.lead.name}</Link>
                      <span>{visit.lead.phone}</span>
                    </p>
                    {visit.notes ? <small>{visit.notes}</small> : null}
                  </div>

                  <div className="crm-visits-card__actions">
                    <Link className="button button-ghost" href={`/crm/imoveis/${visit.property.id}`}>
                      <Home size={15} strokeWidth={1.8} aria-hidden="true" /> Imóvel
                    </Link>
                    {visit.status !== "REALIZADA" ? (
                      <button
                        type="button"
                        className="button button-ghost"
                        disabled={isPending}
                        onClick={() =>
                          updateVisit(visit.id, { status: "REALIZADA" }, "Visita marcada como realizada.")
                        }
                      >
                        <CheckCircle2 size={15} strokeWidth={1.8} aria-hidden="true" /> Realizada
                      </button>
                    ) : null}
                    {visit.status !== "CANCELADA" ? (
                      <button
                        type="button"
                        className="button button-ghost"
                        disabled={isPending}
                        onClick={() =>
                          updateVisit(visit.id, { status: "CANCELADA" }, "Visita cancelada.")
                        }
                      >
                        <X size={15} strokeWidth={1.8} aria-hidden="true" /> Cancelar
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="button button-ghost crm-visits-card__delete"
                      disabled={isPending}
                      onClick={() => deleteVisit(visit.id)}
                    >
                      <Trash2 size={15} strokeWidth={1.8} aria-hidden="true" /> Excluir
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
