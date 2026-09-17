import Link from "next/link";
import { ClipboardList, ExternalLink, MapPin, MessageCircle, Users } from "lucide-react";
import { LeadActions } from "@/components/crm/lead-actions";
import { listLakeVillagePreRegistrations } from "@/lib/data/crm";
import { buildWhatsappLink } from "@/lib/crm/whatsapp-templates";

const STAGE_LABELS: Record<string, string> = {
  NOVO: "Novo",
  PRIMEIRO_CONTATO: "Primeiro contato",
  QUALIFICADO: "Qualificado",
  OPCOES_ENVIADAS: "Opções enviadas",
  VISITA_AGENDADA: "Visita agendada",
  PROPOSTA_ENVIADA: "Proposta enviada",
  NEGOCIACAO: "Negociação",
  FECHADO: "Fechado",
  PERDIDO: "Perdido"
};

function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    timeZone: "America/Araguaina",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function noteValue(notes: string | null | undefined, label: string) {
  const line = notes?.split("\n").find((item) => item.startsWith(`${label}:`));
  return line ? line.slice(label.length + 1).trim() : "—";
}

function whatsappUrl(phone: string, name: string) {
  const firstName = name.split(" ")[0] ?? name;
  return buildWhatsappLink(phone, `Olá ${firstName}, aqui é o Pedro Soares. Recebi seu pré-cadastro do Lake Village e posso ajudar?`);
}

export default async function CrmPreCadastrosPage() {
  const leads = await listLakeVillagePreRegistrations();
  const newCount = leads.filter((lead) => lead.stage === "NOVO").length;
  const activeCount = leads.filter((lead) => !["FECHADO", "PERDIDO"].includes(lead.stage)).length;
  const qualifiedCount = leads.filter((lead) => ["QUALIFICADO", "OPCOES_ENVIADAS", "VISITA_AGENDADA", "PROPOSTA_ENVIADA", "NEGOCIACAO"].includes(lead.stage)).length;

  return (
    <div className="crm-pre-registration-page">
      <header className="crm-pre-registration-header">
        <div>
          <span className="crm-pre-registration-eyebrow"><ClipboardList size={14} aria-hidden="true" /> Captação qualificada</span>
          <h1 className="section-title">Pré-cadastros</h1>
          <p className="section-subtitle">Interessados no Lake Village reunidos em um fluxo de acompanhamento comercial.</p>
        </div>
        <div className="crm-pre-registration-header__actions">
          <a className="button button-ghost" href="/lake-village/pre-cadastro" target="_blank" rel="noreferrer"><ExternalLink size={15} aria-hidden="true" /> Página de captação</a>
          <Link className="button button-primary" href="/crm/leads?landingPage=lake-village"><Users size={15} aria-hidden="true" /> Ver todos os leads</Link>
        </div>
      </header>

      <section className="crm-pre-registration-kpis" aria-label="Resumo dos pré-cadastros">
        <article><span>Total recebido</span><strong>{leads.length}</strong><small>Lake Village</small></article>
        <article><span>Aguardando contato</span><strong>{newCount}</strong><small>Etapa novo</small></article>
        <article><span>Em atendimento</span><strong>{activeCount}</strong><small>Fluxo ativo</small></article>
        <article><span>Qualificados</span><strong>{qualifiedCount}</strong><small>Prontos para próximo passo</small></article>
      </section>

      {leads.length ? (
        <>
          <div className="crm-pre-registration-table-wrap">
            <table className="crm-pre-registration-table">
              <thead><tr><th>Interessado</th><th>Contato</th><th>Perfil</th><th>Localização</th><th>Cadastro</th><th>Etapa</th><th>Ações</th></tr></thead>
              <tbody>
                {leads.map((lead) => {
                  const wa = whatsappUrl(lead.phone, lead.name);
                  return <tr key={lead.id}>
                    <td><Link href={`/crm/leads/${lead.id}`} className="crm-pre-registration-name">{lead.name}</Link><small>{lead.email || "E-mail não informado"}</small></td>
                    <td>{wa ? <a className="crm-pre-registration-contact" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={14} aria-hidden="true" /> {lead.phone}</a> : <span>{lead.phone}</span>}</td>
                    <td><strong>{noteValue(lead.notes, "Perfil de interesse")}</strong><small>{noteValue(lead.notes, "Momento de compra")}</small></td>
                    <td><span className="crm-pre-registration-location"><MapPin size={14} aria-hidden="true" /> {lead.desiredCity || noteValue(lead.notes, "Cidade de residência")}</span></td>
                    <td><time dateTime={lead.createdAt.toISOString()}>{formatDateTime(lead.createdAt)}</time><small>{lead.sourcePage || "Origem não registrada"}</small></td>
                    <td><span className={`crm-pre-registration-stage is-${lead.stage.toLowerCase()}`}>{STAGE_LABELS[lead.stage] || lead.stage}</span></td>
                    <td><div className="crm-pre-registration-actions"><Link className="button button-ghost" href={`/crm/leads/${lead.id}`}>Abrir</Link><LeadActions leadId={lead.id} leadName={lead.name} whatsappUrl={wa} compact /></div></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>

          <ul className="crm-pre-registration-mobile-list" aria-label="Pré-cadastros">
            {leads.map((lead) => {
              const wa = whatsappUrl(lead.phone, lead.name);
              return <li className="crm-pre-registration-mobile-card" key={`mobile-${lead.id}`}>
                <header><Link href={`/crm/leads/${lead.id}`}>{lead.name}</Link><span className={`crm-pre-registration-stage is-${lead.stage.toLowerCase()}`}>{STAGE_LABELS[lead.stage] || lead.stage}</span></header>
                <dl><div><dt>WhatsApp</dt><dd>{wa ? <a href={wa} target="_blank" rel="noreferrer">{lead.phone}</a> : lead.phone}</dd></div><div><dt>Cadastro</dt><dd>{formatDateTime(lead.createdAt)}</dd></div><div><dt>Perfil</dt><dd>{noteValue(lead.notes, "Perfil de interesse")}</dd></div><div><dt>Cidade</dt><dd>{lead.desiredCity || noteValue(lead.notes, "Cidade de residência")}</dd></div></dl>
                <footer><Link className="button button-ghost" href={`/crm/leads/${lead.id}`}>Abrir detalhes</Link><LeadActions leadId={lead.id} leadName={lead.name} whatsappUrl={wa} compact /></footer>
              </li>;
            })}
          </ul>
        </>
      ) : (
        <section className="crm-pre-registration-empty"><ClipboardList size={24} aria-hidden="true" /><h2>Ainda não há pré-cadastros</h2><p>Compartilhe a página de captação para começar a receber interessados no Lake Village.</p><a className="button button-primary" href="/lake-village/pre-cadastro" target="_blank" rel="noreferrer">Abrir página de captação</a></section>
      )}
    </div>
  );
}
