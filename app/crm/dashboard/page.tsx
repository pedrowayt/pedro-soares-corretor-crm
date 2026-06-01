import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  Flame,
  Minus,
  TrendingUp,
  Users,
  Wallet
} from "lucide-react";
import { LeadScorePill } from "@/components/crm/lead-score-pill";
import { computeLeadScore } from "@/lib/crm/lead-scoring";
import { getDashboardSnapshot } from "@/lib/data/dashboard";
import { formatCurrencyBRL } from "@/lib/utils";

function formatDelta(delta: number) {
  if (delta === 0) return { Icon: Minus, label: "estável", tone: "neutral" as const };
  if (delta > 0) return { Icon: ArrowUpRight, label: `+${delta} vs ontem`, tone: "up" as const };
  return { Icon: ArrowDownRight, label: `${delta} vs ontem`, tone: "down" as const };
}

function formatRelativeDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  const today = new Date();
  const sameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  if (sameDay) {
    return `Hoje · ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function daysSince(value: Date | string | null | undefined) {
  if (!value) return null;
  const diff = Date.now() - new Date(value).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default async function CrmDashboardPage() {
  const snapshot = await getDashboardSnapshot();
  const { kpis, hotLeads, upcomingAppointments, leadsBySource, pipeline } = snapshot;
  const wonValue =
    "wonValueThisMonth" in kpis ? (kpis as { wonValueThisMonth?: number }).wonValueThisMonth ?? 0 : 0;
  const delta = formatDelta(kpis.newLeadsTodayDelta);
  const DeltaIcon = delta.Icon;

  return (
    <div className="crm-dashboard">
      <header className="crm-dashboard__head">
        <div>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            Bom dia, Pedro
          </h1>
          <p className="section-subtitle" style={{ marginTop: 6 }}>
            Resumo da operação ·{" "}
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long"
            })}
          </p>
        </div>
      </header>

      <section className="crm-kpi-grid" aria-label="Indicadores do dia">
        <article className="crm-kpi-card">
          <span className="crm-kpi-card__label">
            <Users size={16} strokeWidth={1.75} aria-hidden="true" /> Leads novos hoje
          </span>
          <strong className="crm-kpi-card__value">{kpis.newLeadsToday}</strong>
          <span className={`crm-kpi-card__delta is-${delta.tone}`}>
            <DeltaIcon size={14} strokeWidth={1.75} aria-hidden="true" /> {delta.label}
          </span>
        </article>

        <article className="crm-kpi-card">
          <span className="crm-kpi-card__label">
            <CalendarCheck size={16} strokeWidth={1.75} aria-hidden="true" /> Visitas hoje
          </span>
          <strong className="crm-kpi-card__value">{kpis.visitsToday}</strong>
          <span className="crm-kpi-card__delta is-neutral">Próximas 24h</span>
        </article>

        <article className="crm-kpi-card">
          <span className="crm-kpi-card__label">
            <Wallet size={16} strokeWidth={1.75} aria-hidden="true" /> Propostas em aberto
          </span>
          <strong className="crm-kpi-card__value">{kpis.proposalsPending}</strong>
          <span className="crm-kpi-card__delta is-neutral">Aguardando resposta</span>
        </article>

        <article className="crm-kpi-card crm-kpi-card--highlight">
          <span className="crm-kpi-card__label">
            <TrendingUp size={16} strokeWidth={1.75} aria-hidden="true" /> Pipeline ativo
          </span>
          <strong className="crm-kpi-card__value">{formatCurrencyBRL(kpis.pipelineValue)}</strong>
          <span className="crm-kpi-card__delta is-up">
            {kpis.wonThisMonth} {kpis.wonThisMonth === 1 ? "fechado" : "fechados"} no mês
            {wonValue > 0 ? ` · ${formatCurrencyBRL(wonValue)}` : ""}
          </span>
        </article>
      </section>

      <div className="crm-dashboard__grid">
        <section className="crm-panel" aria-labelledby="hot-leads-heading">
          <header className="crm-panel__head">
            <h2 id="hot-leads-heading">
              <Flame size={16} strokeWidth={1.75} aria-hidden="true" /> Hot leads — precisam de follow-up
            </h2>
            <Link href="/crm/leads" className="crm-panel__more">
              Ver todos
            </Link>
          </header>
          {hotLeads.length === 0 ? (
            <p className="crm-panel__empty">
              Nenhum lead esfriando. Você está em dia com o follow-up.
            </p>
          ) : (
            <ul className="crm-hot-leads">
              {hotLeads.map((lead) => {
                const idle = daysSince(lead.lastContactAt ?? lead.createdAt);
                const score = computeLeadScore({
                  stage: lead.stage,
                  createdAt: lead.createdAt,
                  lastContactAt: lead.lastContactAt,
                  hasLinkedProperty: Boolean(lead.linkedProperty),
                  hasLinkedDevelopment: Boolean(lead.linkedDevelopment),
                  visitsCount: 0,
                  proposalsCount: 0,
                  interactionsCount: 0,
                  budgetMin: null,
                  budgetMax: null
                });
                return (
                  <li key={lead.id}>
                    <Link href={`/crm/leads/${lead.id}`} className="crm-hot-lead">
                      <div className="crm-hot-lead__main">
                        <strong>{lead.name}</strong>
                        <span className="crm-hot-lead__meta">
                          {lead.intent} ·{" "}
                          {lead.linkedProperty?.title ??
                            lead.linkedDevelopment?.title ??
                            "Sem imóvel"}
                        </span>
                      </div>
                      <div className="crm-hot-lead__right">
                        <LeadScorePill score={score} compact />
                        <span className="crm-hot-lead__idle">
                          {idle === null ? "Sem contato" : `${idle}d`}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="crm-panel" aria-labelledby="agenda-heading">
          <header className="crm-panel__head">
            <h2 id="agenda-heading">
              <CalendarCheck size={16} strokeWidth={1.75} aria-hidden="true" /> Próximos compromissos
            </h2>
            <Link href="/crm/visitas" className="crm-panel__more">
              Agenda completa
            </Link>
          </header>
          {upcomingAppointments.length === 0 ? (
            <p className="crm-panel__empty">Sem compromissos nos próximos 7 dias.</p>
          ) : (
            <ul className="crm-agenda">
              {upcomingAppointments.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.leadId ? `/crm/leads/${item.leadId}` : "/crm/tarefas"}
                    className="crm-agenda__row"
                  >
                    <span className={`crm-agenda__kind crm-agenda__kind--${item.kind}`}>
                      {item.kind === "visit" ? "Visita" : "Tarefa"}
                    </span>
                    <div className="crm-agenda__copy">
                      <strong>{item.subject}</strong>
                      <span className="crm-agenda__meta">
                        {formatRelativeDate(item.when)}
                        {item.leadName ? ` · ${item.leadName}` : ""}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="crm-panel" aria-labelledby="pipeline-heading">
          <header className="crm-panel__head">
            <h2 id="pipeline-heading">
              <TrendingUp size={16} strokeWidth={1.75} aria-hidden="true" /> Funil
            </h2>
            <Link href="/crm/funil" className="crm-panel__more">
              Ver board
            </Link>
          </header>
          <ul className="crm-pipeline-strip">
            {pipeline.length === 0 ? (
              <li>
                <span className="crm-pipeline-strip__stage">Sem dados</span>
                <strong>0</strong>
              </li>
            ) : (
              pipeline.map((entry) => (
                <li key={entry.stage}>
                  <span className="crm-pipeline-strip__stage">{entry.stage}</span>
                  <strong>{entry._count._all}</strong>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="crm-panel" aria-labelledby="sources-heading">
          <header className="crm-panel__head">
            <h2 id="sources-heading">
              <Users size={16} strokeWidth={1.75} aria-hidden="true" /> Origem dos leads
            </h2>
            <Link href="/crm/relatorios" className="crm-panel__more">
              Relatórios
            </Link>
          </header>
          <ul className="crm-source-strip">
            {leadsBySource.length === 0 ? (
              <li className="crm-panel__empty">Sem dados.</li>
            ) : (
              leadsBySource.map((item) => (
                <li key={item.source}>
                  <span>{item.source}</span>
                  <strong>{item._count._all}</strong>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
