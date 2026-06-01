import { BarChart3, CheckCircle2, FileSignature, Workflow } from "lucide-react";
import { getReportSnapshot } from "@/lib/data/reports";

function FunnelChart({ data }: { data: Array<{ stage: string; count: number }> }) {
  const maxCount = Math.max(...data.map((entry) => entry.count), 1);
  return (
    <ol className="crm-funnel-chart">
      {data.map((entry, index) => {
        const widthPct = (entry.count / maxCount) * 100;
        const next = data[index + 1];
        const dropPct = next && entry.count ? Math.round((next.count / entry.count) * 100) : null;
        return (
          <li key={entry.stage} className="crm-funnel-chart__row">
            <span className="crm-funnel-chart__label">{entry.stage}</span>
            <div className="crm-funnel-chart__bar-wrap">
              <div
                className="crm-funnel-chart__bar"
                style={{ width: `${Math.max(widthPct, 4)}%` }}
                aria-hidden="true"
              >
                <span>{entry.count}</span>
              </div>
              {dropPct !== null ? (
                <span className="crm-funnel-chart__drop">→ {dropPct}%</span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function BarChart({ data, maxLabel }: { data: Array<{ label: string; value: number }>; maxLabel?: string }) {
  const max = Math.max(...data.map((entry) => entry.value), 1);
  return (
    <ul className="crm-bar-chart">
      {data.map((entry) => (
        <li key={entry.label}>
          <span className="crm-bar-chart__label">{entry.label}</span>
          <div className="crm-bar-chart__bar-wrap">
            <div
              className="crm-bar-chart__bar"
              style={{ width: `${(entry.value / max) * 100}%` }}
              aria-hidden="true"
            />
            <strong>{entry.value}</strong>
          </div>
        </li>
      ))}
      {data.length === 0 ? <li className="crm-panel__empty">{maxLabel ?? "Sem dados"}</li> : null}
    </ul>
  );
}

function MonthlyChart({
  data
}: {
  data: Array<{ label: string; created: number; won: number; lost: number }>;
}) {
  if (data.length === 0) return <p className="crm-panel__empty">Sem dados nos últimos 6 meses.</p>;
  const max = Math.max(...data.flatMap((entry) => [entry.created, entry.won, entry.lost]), 1);
  const width = 480;
  const height = 180;
  const barWidth = width / data.length;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="crm-monthly-chart"
      role="img"
      aria-label="Leads criados, ganhos e perdidos por mês"
    >
      {data.map((entry, index) => {
        const x = index * barWidth;
        const createdH = (entry.created / max) * (height - 40);
        const wonH = (entry.won / max) * (height - 40);
        const lostH = (entry.lost / max) * (height - 40);
        const barGap = barWidth * 0.12;
        const slot = (barWidth - barGap * 2) / 3;
        return (
          <g key={entry.label}>
            <rect
              x={x + barGap}
              y={height - 30 - createdH}
              width={slot}
              height={createdH}
              fill="#d89a3b"
              opacity="0.65"
              rx="3"
            >
              <title>{`${entry.label}: ${entry.created} criados`}</title>
            </rect>
            <rect
              x={x + barGap + slot}
              y={height - 30 - wonH}
              width={slot}
              height={wonH}
              fill="#16a34a"
              opacity="0.78"
              rx="3"
            >
              <title>{`${entry.label}: ${entry.won} ganhos`}</title>
            </rect>
            <rect
              x={x + barGap + slot * 2}
              y={height - 30 - lostH}
              width={slot}
              height={lostH}
              fill="#dc2626"
              opacity="0.6"
              rx="3"
            >
              <title>{`${entry.label}: ${entry.lost} perdidos`}</title>
            </rect>
            <text
              x={x + barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              fontSize="11"
              fill="currentColor"
              opacity="0.7"
            >
              {entry.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default async function CrmRelatoriosPage() {
  const snapshot = await getReportSnapshot();

  return (
    <div className="crm-reports">
      <header className="crm-reports__head">
        <h1 className="section-title" style={{ marginTop: 0 }}>
          Relatórios
        </h1>
        <p className="section-subtitle">
          Conversão por etapa, distribuição por origem e performance dos últimos 6 meses.
        </p>
      </header>

      <section className="crm-kpi-grid">
        <article className="crm-kpi-card">
          <span className="crm-kpi-card__label">Leads cadastrados</span>
          <strong className="crm-kpi-card__value">{snapshot.conversion.totalCreated}</strong>
          <span className="crm-kpi-card__delta is-neutral">Acumulado</span>
        </article>
        <article className="crm-kpi-card">
          <span className="crm-kpi-card__label">Taxa de fechamento</span>
          <strong className="crm-kpi-card__value">{snapshot.conversion.winRate}%</strong>
          <span className="crm-kpi-card__delta is-up">
            {snapshot.conversion.totalWon} fechados
          </span>
        </article>
        <article className="crm-kpi-card">
          <span className="crm-kpi-card__label">Taxa de perda</span>
          <strong className="crm-kpi-card__value">{snapshot.conversion.lostRate}%</strong>
          <span className="crm-kpi-card__delta is-down">
            {snapshot.conversion.totalLost} perdidos
          </span>
        </article>
      </section>

      <div className="crm-dashboard__grid">
        <section className="crm-panel">
          <header className="crm-panel__head">
            <h2>
              <Workflow size={16} strokeWidth={1.75} aria-hidden="true" /> Funil de conversão
            </h2>
          </header>
          <FunnelChart data={snapshot.funnel} />
        </section>

        <section className="crm-panel">
          <header className="crm-panel__head">
            <h2>
              <BarChart3 size={16} strokeWidth={1.75} aria-hidden="true" /> Origem dos leads
            </h2>
          </header>
          <BarChart
            data={snapshot.bySource.map((entry) => ({ label: entry.source, value: entry.count }))}
            maxLabel="Sem leads cadastrados ainda."
          />
        </section>

        <section className="crm-panel" style={{ gridColumn: "1 / -1" }}>
          <header className="crm-panel__head">
            <h2>
              <BarChart3 size={16} strokeWidth={1.75} aria-hidden="true" /> Últimos 6 meses
            </h2>
            <div className="crm-chart-legend">
              <span><i style={{ background: "#d89a3b" }} /> Criados</span>
              <span><i style={{ background: "#16a34a" }} /> Ganhos</span>
              <span><i style={{ background: "#dc2626" }} /> Perdidos</span>
            </div>
          </header>
          <MonthlyChart data={snapshot.monthly} />
        </section>

        <section className="crm-panel">
          <header className="crm-panel__head">
            <h2>
              <FileSignature size={16} strokeWidth={1.75} aria-hidden="true" /> Propostas
            </h2>
          </header>
          <BarChart
            data={snapshot.proposalsByStatus.map((entry) => ({
              label: entry.status,
              value: entry.count
            }))}
          />
        </section>

        <section className="crm-panel">
          <header className="crm-panel__head">
            <h2>
              <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" /> Tarefas
            </h2>
          </header>
          <BarChart
            data={snapshot.tasksByStatus.map((entry) => ({
              label: entry.status,
              value: entry.count
            }))}
          />
        </section>
      </div>
    </div>
  );
}
