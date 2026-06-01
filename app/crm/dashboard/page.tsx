import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Flame,
  Minus,
  Plus,
  Receipt,
  Sparkles,
  TrendingUp,
  Users,
  Wallet
} from "lucide-react";
import { LeadScorePill } from "@/components/crm/lead-score-pill";
import { computeLeadScore } from "@/lib/crm/lead-scoring";
import { getDashboardFeaturedProperties, getDashboardSnapshot } from "@/lib/data/dashboard";
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
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate();
  if (sameDay)
    return `Hoje · ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  if (isTomorrow)
    return `Amanhã · ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

const TYPE_LABEL_SHORT: Record<string, string> = {
  CASA: "Casa",
  CASA_EM_CONDOMINIO: "Casa cond.",
  APARTAMENTO: "Apto",
  COBERTURA: "Cobertura",
  LOTE: "Lote",
  LOTE_EM_CONDOMINIO: "Lote cond.",
  SOBRADO: "Sobrado",
  COMERCIAL: "Comercial",
  RURAL: "Rural",
  FAZENDA: "Fazenda",
  CHACARA: "Chácara",
  GALPAO: "Galpão"
};

const PURPOSE_LABEL_SHORT: Record<string, string> = {
  VENDA: "Venda",
  LOCACAO: "Locação",
  INVESTIMENTO: "Investimento",
  LEILAO: "Leilão",
  LANCAMENTO: "Lançamento"
};

export default async function CrmDashboardPage() {
  const [snapshot, featuredProperties] = await Promise.all([
    getDashboardSnapshot(),
    getDashboardFeaturedProperties()
  ]);

  const { kpis, hotLeads, upcomingAppointments, leadsBySource, pipeline } = snapshot;
  const wonValue =
    "wonValueThisMonth" in kpis ? (kpis as { wonValueThisMonth?: number }).wonValueThisMonth ?? 0 : 0;
  const delta = formatDelta(kpis.newLeadsTodayDelta);
  const DeltaIcon = delta.Icon;
  const totalLeadsThisStage = pipeline.reduce((sum, p) => sum + p._count._all, 0);
  const maxSource = Math.max(...leadsBySource.map((s) => s._count._all), 1);

  return (
    <div className="crm-dashboard">
      {/* Hero header */}
      <header className="crm-dash-hero">
        <div className="crm-dash-hero__copy">
          <p className="crm-dash-hero__eyebrow">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long"
            })}
          </p>
          <h1>
            {getGreeting()}, <span>Pedro</span>
          </h1>
          <p className="crm-dash-hero__sub">
            {kpis.newLeadsToday > 0
              ? `Você tem ${kpis.newLeadsToday} ${kpis.newLeadsToday === 1 ? "lead novo" : "leads novos"} para atender.`
              : "Nenhum lead novo hoje — bom momento para reaquecer carteira."}
          </p>
        </div>
        <div className="crm-dash-hero__actions">
          <Link href="/crm/leads#quick-create" className="button button-primary">
            <Plus size={16} strokeWidth={2} aria-hidden="true" /> Novo lead
          </Link>
          <Link href="/crm/imoveis" className="button button-ghost">
            <Sparkles size={16} strokeWidth={2} aria-hidden="true" /> Cadastrar imóvel
          </Link>
        </div>
      </header>

      {/* 6 KPIs */}
      <section className="crm-kpi-strip" aria-label="Indicadores do dia">
        <article className="crm-kpi-tile">
          <span className="crm-kpi-tile__label">
            <Users size={14} strokeWidth={1.75} aria-hidden="true" /> Leads novos
          </span>
          <strong>{kpis.newLeadsToday}</strong>
          <span className={`crm-kpi-tile__delta is-${delta.tone}`}>
            <DeltaIcon size={12} strokeWidth={2} aria-hidden="true" /> {delta.label}
          </span>
        </article>
        <article className="crm-kpi-tile">
          <span className="crm-kpi-tile__label">
            <CalendarCheck size={14} strokeWidth={1.75} aria-hidden="true" /> Visitas hoje
          </span>
          <strong>{kpis.visitsToday}</strong>
          <span className="crm-kpi-tile__delta is-neutral">Próximas 24h</span>
        </article>
        <article className="crm-kpi-tile">
          <span className="crm-kpi-tile__label">
            <Wallet size={14} strokeWidth={1.75} aria-hidden="true" /> Propostas
          </span>
          <strong>{kpis.proposalsPending}</strong>
          <span className="crm-kpi-tile__delta is-neutral">Em aberto</span>
        </article>
        <article className="crm-kpi-tile crm-kpi-tile--highlight">
          <span className="crm-kpi-tile__label">
            <TrendingUp size={14} strokeWidth={1.75} aria-hidden="true" /> Pipeline
          </span>
          <strong>{formatCurrencyBRL(kpis.pipelineValue)}</strong>
          <span className="crm-kpi-tile__delta is-up">{totalLeadsThisStage} leads ativos</span>
        </article>
        <article className="crm-kpi-tile">
          <span className="crm-kpi-tile__label">
            <CheckCircle2 size={14} strokeWidth={1.75} aria-hidden="true" /> Fechados (mês)
          </span>
          <strong>{kpis.wonThisMonth}</strong>
          <span className="crm-kpi-tile__delta is-up">Encerrados</span>
        </article>
        <article className="crm-kpi-tile">
          <span className="crm-kpi-tile__label">
            <Receipt size={14} strokeWidth={1.75} aria-hidden="true" /> Receita (mês)
          </span>
          <strong>{wonValue > 0 ? formatCurrencyBRL(wonValue) : "—"}</strong>
          <span className="crm-kpi-tile__delta is-up">GMV fechado</span>
        </article>
      </section>

      {/* Main grid 8/4 */}
      <div className="crm-dash-grid">
        {/* Left column (8/12) */}
        <div className="crm-dash-grid__main">
          <section className="crm-panel" aria-labelledby="hot-leads-heading">
            <header className="crm-panel__head">
              <h2 id="hot-leads-heading">
                <Flame size={16} strokeWidth={1.75} aria-hidden="true" /> Hot leads · precisam follow-up
              </h2>
              <Link href="/crm/leads" className="crm-panel__more">
                Ver todos →
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

          <section className="crm-panel" aria-labelledby="pipeline-heading">
            <header className="crm-panel__head">
              <h2 id="pipeline-heading">
                <TrendingUp size={16} strokeWidth={1.75} aria-hidden="true" /> Funil
              </h2>
              <Link href="/crm/funil" className="crm-panel__more">
                Ver board →
              </Link>
            </header>
            {pipeline.length === 0 ? (
              <p className="crm-panel__empty">Sem dados de funil.</p>
            ) : (
              <ol className="crm-dash-funnel">
                {pipeline
                  .filter((p) => p.stage !== "PERDIDO")
                  .map((entry) => {
                    const max = Math.max(...pipeline.map((p) => p._count._all), 1);
                    const widthPct = (entry._count._all / max) * 100;
                    return (
                      <li key={entry.stage}>
                        <span className="crm-dash-funnel__stage">{entry.stage}</span>
                        <div className="crm-dash-funnel__bar-wrap">
                          <div
                            className="crm-dash-funnel__bar"
                            style={{ width: `${Math.max(widthPct, 6)}%` }}
                            aria-hidden="true"
                          />
                          <strong>{entry._count._all}</strong>
                        </div>
                      </li>
                    );
                  })}
              </ol>
            )}
          </section>

          <section className="crm-panel" aria-labelledby="sources-heading">
            <header className="crm-panel__head">
              <h2 id="sources-heading">
                <Users size={16} strokeWidth={1.75} aria-hidden="true" /> Origem dos leads
              </h2>
              <Link href="/crm/relatorios" className="crm-panel__more">
                Relatórios →
              </Link>
            </header>
            {leadsBySource.length === 0 ? (
              <p className="crm-panel__empty">Sem dados.</p>
            ) : (
              <ul className="crm-dash-sources">
                {leadsBySource.map((item) => {
                  const widthPct = (item._count._all / maxSource) * 100;
                  return (
                    <li key={item.source}>
                      <span className="crm-dash-sources__name">{item.source}</span>
                      <div className="crm-dash-sources__bar-wrap">
                        <div
                          className="crm-dash-sources__bar"
                          style={{ width: `${Math.max(widthPct, 4)}%` }}
                          aria-hidden="true"
                        />
                      </div>
                      <strong>{item._count._all}</strong>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Right column (4/12) */}
        <aside className="crm-dash-grid__side">
          <section className="crm-panel crm-dash-agenda" aria-labelledby="agenda-heading">
            <header className="crm-panel__head">
              <h2 id="agenda-heading">
                <CalendarCheck size={16} strokeWidth={1.75} aria-hidden="true" /> Agenda
              </h2>
              <Link href="/crm/visitas" className="crm-panel__more">
                Completa →
              </Link>
            </header>
            {upcomingAppointments.length === 0 ? (
              <p className="crm-panel__empty">Sem compromissos.</p>
            ) : (
              <ul className="crm-dash-agenda__list">
                {upcomingAppointments.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.leadId ? `/crm/leads/${item.leadId}` : "/crm/tarefas"}
                      className="crm-dash-agenda__row"
                    >
                      <span className={`crm-dash-agenda__kind crm-dash-agenda__kind--${item.kind}`}>
                        {item.kind === "visit" ? "V" : "T"}
                      </span>
                      <div>
                        <strong>{item.subject}</strong>
                        <span>
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

          <section className="crm-panel crm-dash-featured" aria-labelledby="featured-heading">
            <header className="crm-panel__head">
              <h2 id="featured-heading">
                <Sparkles size={16} strokeWidth={1.75} aria-hidden="true" /> Estoque em destaque
              </h2>
              <Link href="/crm/imoveis" className="crm-panel__more">
                Ver todos →
              </Link>
            </header>
            {featuredProperties.length === 0 ? (
              <p className="crm-panel__empty">Sem imóveis cadastrados.</p>
            ) : (
              <ul className="crm-dash-featured__grid">
                {featuredProperties.slice(0, 4).map((property) => (
                  <li key={property.id}>
                    <Link href={`/crm/imoveis/${property.id}`} className="crm-dash-featured__card">
                      <div
                        className="crm-dash-featured__media"
                        style={{
                          backgroundImage: property.media[0]?.url
                            ? `url(${property.media[0].url})`
                            : undefined
                        }}
                      >
                        <span className="crm-dash-featured__badge">
                          {PURPOSE_LABEL_SHORT[String(property.purpose)] ?? property.purpose}
                        </span>
                      </div>
                      <div className="crm-dash-featured__body">
                        <strong>{property.title}</strong>
                        <span className="crm-dash-featured__meta">
                          {TYPE_LABEL_SHORT[String(property.type)] ?? property.type} ·{" "}
                          {property.district}
                        </span>
                        <span className="crm-dash-featured__price">
                          {formatCurrencyBRL(Number(property.price))}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="crm-panel crm-dash-broker" aria-labelledby="broker-heading">
            <h2 id="broker-heading" className="visually-hidden">
              Perfil do corretor
            </h2>
            <div className="crm-dash-broker__avatar" aria-hidden="true">
              PS
            </div>
            <div className="crm-dash-broker__copy">
              <strong>Pedro Soares</strong>
              <span>Corretor · CRECI 5861-TO</span>
              <span className="crm-dash-broker__stat">
                {kpis.newLeadsToday + kpis.visitsToday} atendimentos hoje
              </span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
