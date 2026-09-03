import Link from "next/link";
import { CalendarCheck, ExternalLink, Eye, GitBranch, LayoutDashboard, MessageCircle, MousePointerClick, Users } from "lucide-react";
import {
  LANDING_PAGE_STATUS_LABELS,
  LANDING_PAGE_TYPE_LABELS,
  listCrmLandingPages
} from "@/lib/data/marketing-landing-pages";
import { getSiteUrl } from "@/lib/site-url";

function dateLabel(value: Date | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", {
    timeZone: "America/Araguaina",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

export default async function CrmLandingPagesPage() {
  const pages = await listCrmLandingPages();
  const siteUrl = getSiteUrl();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Landing pages</h1>
      <p className="section-subtitle">
        Acompanhe as páginas criadas pelo Codex e o resultado comercial de cada campanha.
      </p>

      <section className="crm-panel" style={{ marginTop: 18 }}>
        <header className="crm-panel__head">
          <h2><LayoutDashboard size={16} strokeWidth={1.75} aria-hidden="true" /> Operação</h2>
        </header>
        <p className="crm-panel__empty" style={{ textAlign: "left" }}>
          O Codex cria, atualiza e publica as páginas. Esta área é somente o painel de acompanhamento
          das campanhas e das conversões geradas.
        </p>
      </section>

      <div className="crm-summary-grid" style={{ marginTop: 18 }}>
        {pages.map((page) => {
          const publicUrl = page.deployUrl || `${siteUrl}${page.publicPath}`;
          return (
            <article className="crm-summary-card" key={page.id}>
              <header className="crm-summary-card__head">
                <div>
                  <span className="crm-summary-card__pill">{LANDING_PAGE_STATUS_LABELS[page.status]}</span>
                  <h2 className="crm-summary-card__title" style={{ marginTop: 8 }}>{page.name}</h2>
                </div>
                <span className="badge">{LANDING_PAGE_TYPE_LABELS[page.type]}</span>
              </header>

              <dl className="crm-summary-card__fields">
                <div>
                  <dt>URL pública</dt>
                  <dd><a href={publicUrl} target="_blank" rel="noreferrer">{page.publicPath}</a></dd>
                </div>
                <div>
                  <dt><Eye size={14} aria-hidden="true" /> Visitas na página</dt>
                  <dd>{page.metrics.visits.toLocaleString("pt-BR")}</dd>
                </div>
                <div>
                  <dt><Users size={14} aria-hidden="true" /> Leads</dt>
                  <dd>{page._count.leads.toLocaleString("pt-BR")}</dd>
                </div>
                <div>
                  <dt><MousePointerClick size={14} aria-hidden="true" /> Cliques WhatsApp</dt>
                  <dd>{page.metrics.whatsappClicks.toLocaleString("pt-BR")}</dd>
                </div>
                <div>
                  <dt><MessageCircle size={14} aria-hidden="true" /> Conversões</dt>
                  <dd>{page.metrics.conversions.toLocaleString("pt-BR")}</dd>
                </div>
                <div>
                  <dt><CalendarCheck size={14} aria-hidden="true" /> Visitas agendadas</dt>
                  <dd>{page.metrics.commercialVisits.toLocaleString("pt-BR")}</dd>
                </div>
                <div>
                  <dt>Conversão</dt>
                  <dd>{page.metrics.conversionRate.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</dd>
                </div>
                <div>
                  <dt>Publicada em</dt>
                  <dd>{dateLabel(page.publishedAt)}</dd>
                </div>
              </dl>

              <footer style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                <a className="button button-primary" href={publicUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={15} aria-hidden="true" /> Abrir página
                </a>
                <Link className="button button-ghost" href={`/crm/leads?landingPage=${encodeURIComponent(page.slug)}`}>
                  <Users size={15} aria-hidden="true" /> Ver leads
                </Link>
                {page.deployRef ? (
                  <span className="text-card" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <GitBranch size={14} aria-hidden="true" /> {page.deployRef}
                  </span>
                ) : null}
              </footer>
            </article>
          );
        })}
      </div>

      {pages.length === 0 ? (
        <section className="crm-panel" style={{ marginTop: 18 }}>
          <p className="crm-panel__empty">Nenhuma landing page registrada ainda.</p>
        </section>
      ) : null}
    </>
  );
}
