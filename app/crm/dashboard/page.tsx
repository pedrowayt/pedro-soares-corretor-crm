/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  Bell,
  CalendarCheck,
  CheckCircle2,
  FileText,
  Flame,
  Home,
  Plus,
  Receipt,
  Sparkles,
  TrendingUp,
  Users,
  Wallet
} from "lucide-react";
import { LeadScorePill } from "@/components/crm/lead-score-pill";
import { computeLeadScore } from "@/lib/crm/lead-scoring";
import { getSession } from "@/lib/auth/session";
import { getSaasDashboardSnapshot, type SaasDashboardSnapshot } from "@/lib/data/dashboard";
import { formatCurrencyBRL } from "@/lib/utils";

type ProgressCard = SaasDashboardSnapshot["progressCards"][number];
type MonthlyPoint = SaasDashboardSnapshot["charts"]["monthly"][number];
type BarPoint = { label: string; count: number; percent: number };

const DASHBOARD_TIME_ZONE = "America/Araguaina";

const CARD_ICONS: Record<string, typeof Home> = {
  properties: Home,
  leads: Users,
  pipeline: TrendingUp,
  revenue: Receipt
};

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

function getDashboardHour(date = new Date()) {
  const hour = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    hourCycle: "h23",
    timeZone: DASHBOARD_TIME_ZONE
  })
    .formatToParts(date)
    .find((part) => part.type === "hour")?.value;

  return hour ? Number(hour) : date.getHours();
}

function getGreeting() {
  const hour = getDashboardHour();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function formatDashboardDate(date = new Date()) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: DASHBOARD_TIME_ZONE
  });
}

function formatStage(stage: string) {
  return stage
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function formatCardValue(card: ProgressCard) {
  if (card.id === "pipeline" || card.id === "revenue") return formatCurrencyBRL(Number(card.value));
  return new Intl.NumberFormat("pt-BR").format(Number(card.value));
}

function formatArea(value: number | null) {
  if (!value) return null;
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value)} m²`;
}

function ProgressRing({ value }: { value: number }) {
  return (
    <span
      className="crm-saas-progress-ring"
      style={{ "--progress": `${Math.max(0, Math.min(100, value)) * 3.6}deg` } as CSSProperties}
      aria-hidden="true"
    >
      <span>{value}%</span>
    </span>
  );
}

function ProgressCardTile({ card }: { card: ProgressCard }) {
  const Icon = CARD_ICONS[card.id] ?? TrendingUp;
  return (
    <article className={`crm-saas-kpi-card is-${card.tone}`}>
      <div className="crm-saas-kpi-card__copy">
        <span className="crm-saas-kpi-card__label">
          <Icon size={15} strokeWidth={1.8} aria-hidden="true" /> {card.label}
        </span>
        <strong>{formatCardValue(card)}</strong>
        <small>{card.detail}</small>
      </div>
      <ProgressRing value={card.progress} />
    </article>
  );
}

function MonthlyPerformanceChart({ data }: { data: MonthlyPoint[] }) {
  if (data.length === 0) return <p className="crm-panel__empty">Sem dados nos últimos 6 meses.</p>;

  const width = 720;
  const height = 236;
  const chartHeight = 158;
  const max = Math.max(...data.flatMap((item) => [item.created, item.won, item.lost]), 1);
  const slot = width / data.length;
  const barWidth = Math.min(26, slot * 0.18);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="crm-saas-monthly-chart"
      role="img"
      aria-label="Leads criados, ganhos e perdidos nos últimos 6 meses"
    >
      {[0, 1, 2, 3].map((line) => {
        const y = 24 + (chartHeight / 3) * line;
        return <line key={line} x1="0" x2={width} y1={y} y2={y} className="grid-line" />;
      })}

      {data.map((item, index) => {
        const baseX = index * slot + slot / 2;
        const createdH = (item.created / max) * chartHeight;
        const wonH = (item.won / max) * chartHeight;
        const lostH = (item.lost / max) * chartHeight;
        const yBase = 24 + chartHeight;
        return (
          <g key={item.label}>
            <rect x={baseX - barWidth * 1.7} y={yBase - createdH} width={barWidth} height={createdH} rx="5" className="bar-created">
              <title>{`${item.label}: ${item.created} criados`}</title>
            </rect>
            <rect x={baseX - barWidth / 2} y={yBase - wonH} width={barWidth} height={wonH} rx="5" className="bar-won">
              <title>{`${item.label}: ${item.won} ganhos`}</title>
            </rect>
            <rect x={baseX + barWidth * 0.7} y={yBase - lostH} width={barWidth} height={lostH} rx="5" className="bar-lost">
              <title>{`${item.label}: ${item.lost} perdidos`}</title>
            </rect>
            <text x={baseX} y={height - 18} textAnchor="middle">
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function BarList({ data, emptyLabel }: { data: BarPoint[]; emptyLabel: string }) {
  if (data.length === 0) return <p className="crm-panel__empty">{emptyLabel}</p>;
  return (
    <ul className="crm-saas-bar-list">
      {data.map((item) => (
        <li key={item.label}>
          <span>{item.label}</span>
          <div className="crm-saas-bar-list__track">
            <i style={{ width: `${Math.max(item.percent, 4)}%` }} aria-hidden="true" />
          </div>
          <strong>{item.count}</strong>
        </li>
      ))}
    </ul>
  );
}

function FunnelChart({ data }: { data: SaasDashboardSnapshot["charts"]["funnel"] }) {
  const max = Math.max(...data.map((item) => item.count), 1);
  return (
    <ol className="crm-saas-funnel">
      {data.map((item) => (
        <li key={item.stage}>
          <span>{formatStage(item.stage)}</span>
          <div>
            <i style={{ width: `${Math.max((item.count / max) * 100, 4)}%` }} aria-hidden="true" />
            <strong>{item.count}</strong>
          </div>
        </li>
      ))}
    </ol>
  );
}

function PropertyBreakdown({ snapshot }: { snapshot: SaasDashboardSnapshot }) {
  return (
    <div className="crm-saas-breakdown">
      <div>
        <h3>Tipos de imóvel</h3>
        <BarList data={snapshot.charts.propertyTypes} emptyLabel="Sem imóveis cadastrados." />
      </div>
      <div className="crm-saas-breakdown__chips">
        <h3>Finalidade</h3>
        <ul>
          {snapshot.charts.propertyPurposes.map((item) => (
            <li key={item.key}>
              <span>{item.label}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
          {snapshot.charts.propertyPurposes.length === 0 ? <li>Sem dados.</li> : null}
        </ul>
      </div>
      <div className="crm-saas-breakdown__chips">
        <h3>Status</h3>
        <ul>
          {snapshot.charts.propertyStatuses.map((item) => (
            <li key={item.key}>
              <span>{item.label}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
          {snapshot.charts.propertyStatuses.length === 0 ? <li>Sem dados.</li> : null}
        </ul>
      </div>
    </div>
  );
}

function PopularProperties({ properties }: { properties: SaasDashboardSnapshot["popularProperties"] }) {
  if (properties.length === 0) {
    return <p className="crm-panel__empty">Sem imóveis disponíveis para destacar.</p>;
  }

  return (
    <ul className="crm-saas-property-list">
      {properties.map((property) => {
        const area = formatArea(property.areaM2 ?? property.landAreaM2);
        return (
          <li key={property.id}>
            <Link href={property.href} className="crm-saas-property-card">
              <div
                className={`crm-saas-property-card__media${property.imageUrl ? "" : " is-empty"}`}
                style={{
                  backgroundImage: property.imageUrl ? `url(${property.imageUrl})` : undefined
                }}
              >
                <span>{property.purpose}</span>
                {property.isInvestorHighlight ? <strong>Investidor</strong> : null}
              </div>
              <div className="crm-saas-property-card__body">
                <span className="crm-saas-property-card__price">{formatCurrencyBRL(property.price)}</span>
                <h3>{property.title}</h3>
                <p>{property.location || property.type}</p>
                <div className="crm-saas-property-card__specs">
                  {property.suites ? <span>{property.suites} suítes</span> : null}
                  {property.bedrooms ? <span>{property.bedrooms} quartos</span> : null}
                  {property.parkingSpaces ? <span>{property.parkingSpaces} vagas</span> : null}
                  {area ? <span>{area}</span> : null}
                </div>
                <footer>
                  <span>{property.leadsCount} leads</span>
                  <span>{property.visitsCount} visitas</span>
                  <span>{property.proposalsCount} propostas</span>
                </footer>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function VisitInsightCard({ snapshot }: { snapshot: SaasDashboardSnapshot }) {
  const insights = snapshot.visitInsights;

  return (
    <section className="crm-saas-side-card crm-saas-visit-response">
      <header className="crm-saas-side-card__head">
        <h2>
          <CalendarCheck size={17} strokeWidth={1.8} aria-hidden="true" /> Visitas
        </h2>
        <Link href="/crm/visitas">Gerenciar</Link>
      </header>

      <div className="crm-saas-visit-response__metrics">
        <span>
          Hoje <strong>{insights.today}</strong>
        </span>
        <span>
          Próximas <strong>{insights.pendingUpcoming}</strong>
        </span>
        <span>
          Mês <strong>{insights.completedThisMonth}/{insights.thisMonth}</strong>
        </span>
      </div>

      <div className="crm-saas-visit-response__progress">
        <span>Realização mensal</span>
        <strong>{insights.completionRate}%</strong>
        <i style={{ width: `${Math.max(insights.completionRate, insights.thisMonth ? 4 : 0)}%` }} aria-hidden="true" />
      </div>

      {insights.nextVisit ? (
        <Link href={`/crm/leads/${insights.nextVisit.leadId}`} className="crm-saas-visit-response__next">
          <strong>{insights.nextVisit.propertyTitle}</strong>
          <small>
            {formatRelativeDate(insights.nextVisit.scheduledAt)} · {insights.nextVisit.leadName}
          </small>
        </Link>
      ) : (
        <p className="crm-panel__empty">Sem visitas futuras.</p>
      )}
    </section>
  );
}

function ProposalInsightCard({ snapshot }: { snapshot: SaasDashboardSnapshot }) {
  const insights = snapshot.proposalInsights;

  return (
    <section className="crm-saas-side-card crm-saas-proposal-response">
      <header className="crm-saas-side-card__head">
        <h2>
          <FileText size={17} strokeWidth={1.8} aria-hidden="true" /> Propostas
        </h2>
        <Link href="/crm/propostas">Gerenciar</Link>
      </header>

      <div className="crm-saas-proposal-response__metrics">
        <span>
          Abertas <strong>{insights.open}</strong>
        </span>
        <span>
          Aceitas <strong>{insights.acceptedThisMonth}</strong>
        </span>
        <span>
          Mês <strong>{insights.thisMonth}</strong>
        </span>
      </div>

      <div className="crm-saas-proposal-response__value">
        <span>Valor em aberto</span>
        <strong>{formatCurrencyBRL(insights.openValue)}</strong>
      </div>

      <div className="crm-saas-proposal-response__progress">
        <span>Taxa de aceite mensal</span>
        <strong>{insights.acceptanceRate}%</strong>
        <i style={{ width: `${Math.max(insights.acceptanceRate, insights.thisMonth ? 4 : 0)}%` }} aria-hidden="true" />
      </div>
    </section>
  );
}

export default async function CrmDashboardPage() {
  const session = await getSession();
  const snapshot = await getSaasDashboardSnapshot({
    name: session?.name,
    role: session?.role,
    profilePhotoUrl: session?.profilePhotoUrl,
    creci: session?.creci,
    jobTitle: session?.jobTitle
  });

  return (
    <div className="crm-dashboard crm-saas-dashboard">
      <header className="crm-saas-hero">
        <div className="crm-saas-hero__copy">
          <span className="crm-saas-hero__eyebrow">
            {formatDashboardDate()}
          </span>
          <h1>
            {getGreeting()}, <span>{snapshot.profile.name.split(" ")[0]}</span>
          </h1>
          <p>
            Visão executiva do estoque, funil, receita e rotina comercial em um único painel.
          </p>
        </div>
        <div className="crm-saas-hero__actions">
          <Link href="/crm/leads#quick-create" className="button button-primary">
            <Plus size={16} strokeWidth={2} aria-hidden="true" /> Novo lead
          </Link>
          <Link href="/crm/imoveis" className="button button-ghost">
            <Sparkles size={16} strokeWidth={2} aria-hidden="true" /> Cadastrar imóvel
          </Link>
        </div>
      </header>

      <section className="crm-saas-kpi-grid" aria-label="Indicadores principais">
        {snapshot.progressCards.map((card) => (
          <ProgressCardTile key={card.id} card={card} />
        ))}
      </section>

      <div className="crm-saas-layout">
        <main className="crm-saas-main">
          <section className="crm-saas-panel crm-saas-panel--wide">
            <header className="crm-saas-panel__head">
              <div>
                <h2>
                  <TrendingUp size={17} strokeWidth={1.8} aria-hidden="true" /> Performance comercial
                </h2>
                <p>Leads criados, ganhos e perdidos nos últimos 6 meses.</p>
              </div>
              <div className="crm-saas-chart-legend">
                <span><i className="is-created" /> Criados</span>
                <span><i className="is-won" /> Ganhos</span>
                <span><i className="is-lost" /> Perdidos</span>
              </div>
            </header>
            <MonthlyPerformanceChart data={snapshot.charts.monthly} />
          </section>

          <section className="crm-saas-panel">
            <header className="crm-saas-panel__head">
              <div>
                <h2>
                  <Wallet size={17} strokeWidth={1.8} aria-hidden="true" /> Funil de conversão
                </h2>
                <p>Volume por etapa do pipeline.</p>
              </div>
            </header>
            <FunnelChart data={snapshot.charts.funnel} />
          </section>

          <section className="crm-saas-panel">
            <header className="crm-saas-panel__head">
              <div>
                <h2>
                  <Users size={17} strokeWidth={1.8} aria-hidden="true" /> Origem dos leads
                </h2>
                <p>Canais que mais alimentam a carteira.</p>
              </div>
            </header>
            <BarList data={snapshot.charts.sources} emptyLabel="Sem leads cadastrados." />
          </section>

          <section className="crm-saas-panel crm-saas-panel--wide">
            <header className="crm-saas-panel__head">
              <div>
                <h2>
                  <Home size={17} strokeWidth={1.8} aria-hidden="true" /> Breakdown do estoque
                </h2>
                <p>Distribuição por tipo, finalidade e status.</p>
              </div>
            </header>
            <PropertyBreakdown snapshot={snapshot} />
          </section>

          <section className="crm-saas-panel">
            <header className="crm-saas-panel__head">
              <div>
                <h2>
                  <Flame size={17} strokeWidth={1.8} aria-hidden="true" /> Hot leads
                </h2>
                <p>Leads ativos sem contato recente.</p>
              </div>
              <Link href="/crm/leads">Ver todos</Link>
            </header>
            {snapshot.hotLeads.length === 0 ? (
              <p className="crm-panel__empty">Nenhum lead esfriando. Você está em dia com o follow-up.</p>
            ) : (
              <ul className="crm-saas-hot-list">
                {snapshot.hotLeads.map((lead) => {
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
                      <Link href={`/crm/leads/${lead.id}`}>
                        <div>
                          <strong>{lead.name}</strong>
                          <span>
                            {lead.intent} · {lead.linkedProperty?.title ?? lead.linkedDevelopment?.title ?? "Sem imóvel"}
                          </span>
                        </div>
                        <LeadScorePill score={score} compact />
                        <small>{idle === null ? "Sem contato" : `${idle}d`}</small>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="crm-saas-panel">
            <header className="crm-saas-panel__head">
              <div>
                <h2>
                  <CalendarCheck size={17} strokeWidth={1.8} aria-hidden="true" /> Agenda
                </h2>
                <p>Visitas e tarefas dos próximos dias.</p>
              </div>
              <Link href="/crm/visitas">Abrir agenda</Link>
            </header>
            {snapshot.agenda.length === 0 ? (
              <p className="crm-panel__empty">Sem compromissos programados.</p>
            ) : (
              <ul className="crm-saas-agenda-list">
                {snapshot.agenda.slice(0, 6).map((item) => (
                  <li key={item.id}>
                    <Link href={item.leadId ? `/crm/leads/${item.leadId}` : "/crm/tarefas"}>
                      <span className={`crm-saas-agenda-list__kind is-${item.kind}`}>
                        {item.kind === "visit" ? "V" : "T"}
                      </span>
                      <div>
                        <strong>{item.subject}</strong>
                        <small>
                          {formatRelativeDate(item.when)}
                          {item.leadName ? ` · ${item.leadName}` : ""}
                        </small>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        <aside className="crm-saas-side">
          <section className="crm-saas-side-card crm-saas-profile-card">
            <div className="crm-saas-profile-card__avatar">
              {snapshot.profile.photoUrl ? (
                <img src={snapshot.profile.photoUrl} alt={`Foto de ${snapshot.profile.name}`} />
              ) : (
                snapshot.profile.initials
              )}
            </div>
            <div>
              <strong>{snapshot.profile.name}</strong>
              <span>
                {snapshot.profile.jobTitle || snapshot.profile.roleLabel}
                {snapshot.profile.creci ? ` · ${snapshot.profile.creci}` : ""}
              </span>
            </div>
            <small>{snapshot.totals.newLeadsToday + snapshot.totals.visitsToday} atendimentos hoje</small>
          </section>

          <VisitInsightCard snapshot={snapshot} />
          <ProposalInsightCard snapshot={snapshot} />

          <section className="crm-saas-side-card">
            <header className="crm-saas-side-card__head">
              <h2>
                <Bell size={17} strokeWidth={1.8} aria-hidden="true" /> Notificações
              </h2>
            </header>
            {snapshot.notifications.length === 0 ? (
              <p className="crm-panel__empty">Sem alertas no momento.</p>
            ) : (
              <ul className="crm-saas-notification-list">
                {snapshot.notifications.map((item) => (
                  <li key={item.id} className={`is-${item.tone}`}>
                    <span>{item.label}</span>
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="crm-saas-side-card">
            <header className="crm-saas-side-card__head">
              <h2>
                <CheckCircle2 size={17} strokeWidth={1.8} aria-hidden="true" /> Imóveis em destaque
              </h2>
              <Link href="/crm/imoveis">Ver todos</Link>
            </header>
            <PopularProperties properties={snapshot.popularProperties} />
          </section>
        </aside>
      </div>
    </div>
  );
}
