"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  Check,
  Clipboard,
  ExternalLink,
  GitBranch,
  LayoutDashboard,
  MoreHorizontal,
  MousePointerClick,
  Search,
  Users,
  X
} from "lucide-react";
import { useMemo, useState } from "react";

type LandingPage = {
  id: string;
  name: string;
  slug: string;
  publicPath: string;
  type: "DEVELOPMENT" | "CAMPAIGN" | "REGION" | "CAPTURE";
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "PAUSED" | "ARCHIVED";
  deployUrl: string | null;
  deployRef: string | null;
  linkedDevelopment: { title: string; slug: string } | null;
  publishedAt: string | null;
  updatedAt: string;
  leads: number;
  metrics: {
    visits: number;
    whatsappClicks: number;
    ctaClicks: number;
    downloads: number;
    conversions: number;
    commercialVisits: number;
    conversionRate: number;
  };
};

type Props = { pages: LandingPage[]; siteUrl: string };
type StatusFilter = "ALL" | LandingPage["status"];

const STATUS_LABELS: Record<LandingPage["status"], string> = {
  DRAFT: "Rascunho",
  REVIEW: "Em revisão",
  PUBLISHED: "Publicada",
  PAUSED: "Pausada",
  ARCHIVED: "Arquivada"
};

const TYPE_LABELS: Record<LandingPage["type"], string> = {
  DEVELOPMENT: "Lançamento",
  CAMPAIGN: "Campanha",
  REGION: "Região",
  CAPTURE: "Captação"
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

function numberLabel(value: number) {
  return numberFormatter.format(value);
}

function dateLabel(value: string | null, withTime = false) {
  if (!value) return "—";
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Araguaina",
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {})
  };
  return new Date(value).toLocaleString("pt-BR", options);
}

function statusClass(status: LandingPage["status"]) {
  return `crm-landing-status is-${status.toLowerCase()}`;
}

function publicUrl(page: LandingPage, siteUrl: string) {
  return page.deployUrl || `${siteUrl}${page.publicPath}`;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="crm-landing-metric">
      <span className="crm-landing-metric__icon"><Icon size={15} strokeWidth={1.8} aria-hidden="true" /></span>
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </div>
  );
}

export function LandingPagesList({ pages, siteUrl }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [development, setDevelopment] = useState("ALL");
  const [requestOpen, setRequestOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const developmentOptions = useMemo(
    () => Array.from(new Map(pages.flatMap((page) => page.linkedDevelopment ? [[page.linkedDevelopment.slug, page.linkedDevelopment.title]] : [])).entries()).sort((a, b) => a[1].localeCompare(b[1], "pt-BR")),
    [pages]
  );

  const filteredPages = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return pages.filter((page) => {
      const matchesStatus = status === "ALL" || page.status === status;
      const matchesDevelopment = development === "ALL" || page.linkedDevelopment?.slug === development;
      const haystack = [page.name, page.slug, page.publicPath, page.linkedDevelopment?.title].filter(Boolean).join(" ").toLocaleLowerCase("pt-BR");
      return matchesStatus && matchesDevelopment && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [development, pages, query, status]);

  const summary = useMemo(() => pages.reduce((result, page) => ({
    pages: result.pages + 1,
    published: result.published + (page.status === "PUBLISHED" ? 1 : 0),
    leads: result.leads + page.leads,
    visits: result.visits + page.metrics.visits,
    conversions: result.conversions + page.metrics.conversions
  }), { pages: 0, published: 0, leads: 0, visits: 0, conversions: 0 }), [pages]);

  const copyLink = async (page: LandingPage) => {
    try {
      await navigator.clipboard.writeText(publicUrl(page, siteUrl));
      setCopiedId(page.id);
      window.setTimeout(() => setCopiedId((current) => current === page.id ? null : current), 1800);
    } catch {
      setCopiedId(null);
    }
  };

  const clearFilters = () => {
    setQuery("");
    setStatus("ALL");
    setDevelopment("ALL");
  };

  const hasFilters = Boolean(query || status !== "ALL" || development !== "ALL");

  return (
    <div className="crm-landing-page">
      <header className="crm-landing-header">
        <div>
          <span className="crm-landing-eyebrow"><LayoutDashboard size={14} aria-hidden="true" /> Marketing no CRM</span>
          <h1 className="section-title">Landing pages</h1>
          <p className="section-subtitle">Acompanhe o alcance e os leads gerados pelas suas páginas de campanha.</p>
        </div>
        <button type="button" className="button button-primary crm-landing-new-button" onClick={() => setRequestOpen((open) => !open)} aria-expanded={requestOpen} aria-controls="new-landing-page">
          <ArrowUpRight size={16} aria-hidden="true" /> Nova landing page
        </button>
      </header>

      {requestOpen ? (
        <section className="crm-landing-request" id="new-landing-page" aria-labelledby="new-landing-page-title">
          <div>
            <span className="crm-landing-eyebrow">Criação assistida</span>
            <h2 id="new-landing-page-title">Uma nova campanha começa aqui.</h2>
            <p>O layout e a publicação são mantidos no código pelo Codex. Para iniciar, defina o nome da campanha, o empreendimento e o objetivo da captação.</p>
          </div>
          <button type="button" className="button button-ghost crm-landing-request-close" onClick={() => setRequestOpen(false)} aria-label="Fechar instruções">
            <X size={16} aria-hidden="true" /> Fechar
          </button>
        </section>
      ) : null}

      <section className="crm-landing-kpis" aria-label="Resumo das landing pages">
        <article><span>Total de páginas</span><strong>{numberLabel(summary.pages)}</strong><small>Campanhas registradas</small></article>
        <article><span>Publicadas</span><strong>{numberLabel(summary.published)}</strong><small>Prontas para receber tráfego</small></article>
        <article><span>Leads captados</span><strong>{numberLabel(summary.leads)}</strong><small>Conversões registradas</small></article>
        <article><span>Visualizações</span><strong>{numberLabel(summary.visits)}</strong><small>{summary.visits ? `${((summary.conversions / summary.visits) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% de conversão` : "Sem dados de conversão"}</small></article>
      </section>

      <section className="crm-landing-toolbar" aria-label="Busca e filtros">
        <label className="crm-landing-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Buscar landing pages</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, empreendimento ou URL" />
        </label>
        <label className="crm-landing-filter">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} aria-label="Filtrar por status">
            <option value="ALL">Todos os status</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
        <label className="crm-landing-filter">
          <span>Empreendimento</span>
          <select value={development} onChange={(event) => setDevelopment(event.target.value)} aria-label="Filtrar por empreendimento">
            <option value="ALL">Todos os empreendimentos</option>
            {developmentOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
        {hasFilters ? <button type="button" className="crm-landing-clear" onClick={clearFilters}><X size={15} aria-hidden="true" /> Limpar</button> : null}
      </section>

      <div className="crm-landing-results-head">
        <div>
          <h2>Suas páginas</h2>
          <p>{filteredPages.length === pages.length ? `${numberLabel(pages.length)} páginas registradas` : `${numberLabel(filteredPages.length)} de ${numberLabel(pages.length)} páginas`}</p>
        </div>
        <span className="crm-landing-results-hint"><BarChart3 size={15} aria-hidden="true" /> Métricas baseadas nos eventos registrados</span>
      </div>

      {filteredPages.length ? (
        <>
          <div className="crm-landing-table-wrap">
            <table className="crm-landing-table">
              <thead><tr><th>Página</th><th>Status</th><th>Leads</th><th>Alcance</th><th>Conversão</th><th>Atualizada</th><th><span className="sr-only">Ações</span></th></tr></thead>
              <tbody>
                {filteredPages.map((page) => {
                  const url = publicUrl(page, siteUrl);
                  return <tr key={page.id}>
                    <td>
                      <div className="crm-landing-table-name"><strong>{page.name}</strong><span>{page.linkedDevelopment?.title || "Sem empreendimento vinculado"}</span><a href={url} target="_blank" rel="noreferrer">{page.publicPath} <ExternalLink size={12} aria-hidden="true" /></a></div>
                    </td>
                    <td><span className={statusClass(page.status)}><span aria-hidden="true" />{STATUS_LABELS[page.status]}</span><small className="crm-landing-type">{TYPE_LABELS[page.type]}</small></td>
                    <td><strong className="crm-landing-number">{numberLabel(page.leads)}</strong></td>
                    <td><span className="crm-landing-table-metric"><b>{numberLabel(page.metrics.visits)}</b><small>visualizações</small></span><span className="crm-landing-table-metric"><b>{numberLabel(page.metrics.whatsappClicks)}</b><small>WhatsApp</small></span></td>
                    <td><strong className="crm-landing-number">{page.metrics.conversionRate.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</strong><small className="crm-landing-table-muted">{numberLabel(page.metrics.conversions)} conversões</small></td>
                    <td><span className="crm-landing-table-date">{dateLabel(page.updatedAt, true)}</span></td>
                    <td><div className="crm-landing-actions"><a className="button button-ghost" href={url} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" /> Ver página</a><Link className="button button-primary" href={`/crm/leads?landingPage=${encodeURIComponent(page.slug)}`}><Users size={14} aria-hidden="true" /> Leads</Link><button type="button" className="button button-ghost" onClick={() => copyLink(page)}>{copiedId === page.id ? <Check size={14} aria-hidden="true" /> : <Clipboard size={14} aria-hidden="true" />} {copiedId === page.id ? "Copiado" : "Copiar link"}</button><details className="crm-landing-more"><summary aria-label={`Mais ações para ${page.name}`}><MoreHorizontal size={17} aria-hidden="true" /></summary><div><span className="is-disabled" title="A edição visual é mantida no código"><GitBranch size={14} aria-hidden="true" /> Editar no código</span><span className="is-disabled" title="Duplicação ainda não disponível no CRM"><Clipboard size={14} aria-hidden="true" /> Duplicar</span><span className="is-disabled is-danger" title="Exclusão ainda não disponível no CRM"><X size={14} aria-hidden="true" /> Excluir</span></div></details></div></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>

          <div className="crm-landing-mobile-list">
            {filteredPages.map((page) => {
              const url = publicUrl(page, siteUrl);
              return <article className="crm-landing-mobile-card" key={page.id}>
                <header><div><span className={statusClass(page.status)}><span aria-hidden="true" />{STATUS_LABELS[page.status]}</span><h3>{page.name}</h3><p>{page.linkedDevelopment?.title || "Sem empreendimento vinculado"}</p></div><span className="crm-landing-type">{TYPE_LABELS[page.type]}</span></header>
                <a className="crm-landing-mobile-url" href={url} target="_blank" rel="noreferrer">{page.publicPath} <ExternalLink size={12} aria-hidden="true" /></a>
                <div className="crm-landing-mobile-metrics"><Metric icon={Users} label="Leads" value={numberLabel(page.leads)} /><Metric icon={MousePointerClick} label="Visualizações" value={numberLabel(page.metrics.visits)} /><Metric icon={BarChart3} label="Conversão" value={`${page.metrics.conversionRate.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`} /></div>
                <footer><span>Atualizada em {dateLabel(page.updatedAt, true)}</span><div className="crm-landing-actions"><a className="button button-ghost" href={url} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" /> Ver página</a><Link className="button button-primary" href={`/crm/leads?landingPage=${encodeURIComponent(page.slug)}`}><Users size={14} aria-hidden="true" /> Leads</Link><button type="button" className="button button-ghost" onClick={() => copyLink(page)}>{copiedId === page.id ? <Check size={14} aria-hidden="true" /> : <Clipboard size={14} aria-hidden="true" />} {copiedId === page.id ? "Copiado" : "Copiar link"}</button></div></footer>
              </article>;
            })}
          </div>
        </>
      ) : (
        <section className="crm-landing-empty" aria-live="polite">
          <span className="crm-landing-empty__icon"><Search size={20} aria-hidden="true" /></span>
          <h2>{pages.length ? "Nenhuma página encontrada" : "Nenhuma landing page registrada"}</h2>
          <p>{pages.length ? "Tente ajustar a busca ou remover os filtros para ver outras campanhas." : "Quando uma nova página for criada e registrada, ela aparecerá aqui com seus indicadores."}</p>
          {pages.length && hasFilters ? <button type="button" className="button button-ghost" onClick={clearFilters}>Limpar filtros</button> : null}
        </section>
      )}

      <p className="crm-landing-footnote"><Building2 size={14} aria-hidden="true" /> Acompanhe a campanha aqui; a criação e a publicação do layout continuam sob responsabilidade do Codex.</p>
    </div>
  );
}
