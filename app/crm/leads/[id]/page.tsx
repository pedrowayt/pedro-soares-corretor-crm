import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Compass,
  FileSignature,
  Mail,
  MessageCircle,
  Phone,
  StickyNote,
  Tag
} from "lucide-react";
import { getLeadDetail } from "@/lib/data/dashboard";
import { formatCurrencyBRL } from "@/lib/utils";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function whatsappLink(phone: string | null | undefined, message: string) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

const INTERACTION_LABEL: Record<string, string> = {
  FORM_SUBMISSION: "Formulário enviado",
  WHATSAPP_CLICK: "Clicou no WhatsApp",
  WHATSAPP_MESSAGE: "Mensagem no WhatsApp",
  TABLE_DOWNLOAD: "Baixou tabela",
  EMAIL: "E-mail",
  PHONE_CALL: "Ligação",
  NOTE: "Nota interna"
};

export default async function CrmLeadDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadDetail(id);

  if (!lead) notFound();

  const wa = whatsappLink(
    lead.phone,
    `Olá ${lead.name.split(" ")[0]}, sou o Pedro Soares, corretor. Posso ajudar?`
  );
  const tel = lead.phone ? `tel:${lead.phone.replace(/\D/g, "")}` : null;
  const email = lead.email ? `mailto:${lead.email}` : null;

  const budgetRange = (() => {
    if (!lead.budgetMin && !lead.budgetMax) return null;
    const min = lead.budgetMin ? formatCurrencyBRL(Number(lead.budgetMin)) : null;
    const max = lead.budgetMax ? formatCurrencyBRL(Number(lead.budgetMax)) : null;
    if (min && max) return `${min} – ${max}`;
    return max ? `até ${max}` : `a partir de ${min}`;
  })();

  return (
    <div className="crm-lead-detail">
      <Link href="/crm/leads" className="crm-lead-detail__back">
        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" /> Voltar para Leads
      </Link>

      <header className="crm-lead-detail__head">
        <div className="crm-lead-detail__identity">
          <div className="crm-lead-detail__avatar" aria-hidden="true">
            {initials(lead.name)}
          </div>
          <div>
            <h1>{lead.name}</h1>
            <p className="crm-lead-detail__sub">
              <span className="badge">{lead.stage}</span>
              <span className="badge">{lead.intent}</span>
              <span className="badge">{lead.source}</span>
            </p>
          </div>
        </div>

        <div className="crm-lead-detail__actions">
          {wa ? (
            <a className="button button-primary" href={wa} target="_blank" rel="noreferrer">
              <MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" /> WhatsApp
            </a>
          ) : null}
          {tel ? (
            <a className="button button-ghost" href={tel}>
              <Phone size={16} strokeWidth={1.75} aria-hidden="true" /> Ligar
            </a>
          ) : null}
          {email ? (
            <a className="button button-ghost" href={email}>
              <Mail size={16} strokeWidth={1.75} aria-hidden="true" /> E-mail
            </a>
          ) : null}
        </div>
      </header>

      <div className="crm-lead-detail__grid">
        <div className="crm-lead-detail__column">
          <section className="crm-panel">
            <header className="crm-panel__head">
              <h2>
                <Compass size={16} strokeWidth={1.75} aria-hidden="true" /> Perfil de interesse
              </h2>
            </header>
            <dl className="crm-lead-detail__facts">
              <div>
                <dt>Quer comprar</dt>
                <dd>{lead.desiredType ?? "Não informado"}</dd>
              </div>
              <div>
                <dt>Finalidade</dt>
                <dd>{lead.desiredPurpose ?? "Não informado"}</dd>
              </div>
              <div>
                <dt>Orçamento</dt>
                <dd>{budgetRange ?? "Não informado"}</dd>
              </div>
              <div>
                <dt>Cidade</dt>
                <dd>{lead.desiredCity ?? "—"}</dd>
              </div>
              <div>
                <dt>Bairro</dt>
                <dd>{lead.desiredDistrict ?? "—"}</dd>
              </div>
              <div>
                <dt>Último contato</dt>
                <dd>{formatDateTime(lead.lastContactAt)}</dd>
              </div>
            </dl>
          </section>

          {lead.linkedProperty || lead.linkedDevelopment || lead.linkedOwner ? (
            <section className="crm-panel">
              <header className="crm-panel__head">
                <h2>
                  <Tag size={16} strokeWidth={1.75} aria-hidden="true" /> Vínculos
                </h2>
              </header>
              <ul className="crm-lead-detail__links">
                {lead.linkedProperty ? (
                  <li>
                    <Building2 size={14} strokeWidth={1.75} aria-hidden="true" />
                    <Link href={`/crm/imoveis/${lead.linkedProperty.id}`}>
                      {lead.linkedProperty.title}
                    </Link>
                    <span>{formatCurrencyBRL(Number(lead.linkedProperty.price))}</span>
                  </li>
                ) : null}
                {lead.linkedDevelopment ? (
                  <li>
                    <Building2 size={14} strokeWidth={1.75} aria-hidden="true" />
                    <Link href={`/crm/empreendimentos`}>{lead.linkedDevelopment.title}</Link>
                    {lead.linkedDevelopmentUnitType ? (
                      <span>{lead.linkedDevelopmentUnitType.name}</span>
                    ) : null}
                  </li>
                ) : null}
                {lead.linkedOwner ? (
                  <li>
                    <Phone size={14} strokeWidth={1.75} aria-hidden="true" />
                    <span>Proprietário: {lead.linkedOwner.name}</span>
                    <span>{lead.linkedOwner.phone}</span>
                  </li>
                ) : null}
              </ul>
            </section>
          ) : null}

          {lead.notes ? (
            <section className="crm-panel">
              <header className="crm-panel__head">
                <h2>
                  <StickyNote size={16} strokeWidth={1.75} aria-hidden="true" /> Notas internas
                </h2>
              </header>
              <p className="crm-lead-detail__notes">{lead.notes}</p>
            </section>
          ) : null}
        </div>

        <div className="crm-lead-detail__column">
          <section className="crm-panel">
            <header className="crm-panel__head">
              <h2>
                <Clock size={16} strokeWidth={1.75} aria-hidden="true" /> Linha do tempo
              </h2>
            </header>
            {lead.interactions.length === 0 &&
            lead.visits.length === 0 &&
            lead.proposals.length === 0 ? (
              <p className="crm-panel__empty">
                Sem atividade registrada. Quando você responder no WhatsApp ou agendar uma
                visita, o histórico aparece aqui.
              </p>
            ) : (
              <ol className="crm-timeline">
                {lead.proposals.map((proposal) => (
                  <li key={`prop-${proposal.id}`} className="crm-timeline__item">
                    <span className="crm-timeline__icon" aria-hidden="true">
                      <FileSignature size={14} strokeWidth={1.75} />
                    </span>
                    <div>
                      <strong>Proposta {proposal.status}</strong>
                      <p>
                        {proposal.property?.title ?? "Sem imóvel"} ·{" "}
                        {formatCurrencyBRL(Number(proposal.offeredValue))}
                      </p>
                      <time>{formatDateTime(proposal.createdAt)}</time>
                    </div>
                  </li>
                ))}
                {lead.visits.map((visit) => (
                  <li key={`visit-${visit.id}`} className="crm-timeline__item">
                    <span className="crm-timeline__icon" aria-hidden="true">
                      <CalendarCheck size={14} strokeWidth={1.75} />
                    </span>
                    <div>
                      <strong>Visita {visit.status}</strong>
                      <p>{visit.property?.title ?? "Imóvel removido"}</p>
                      <time>{formatDateTime(visit.scheduledAt)}</time>
                    </div>
                  </li>
                ))}
                {lead.interactions.map((interaction) => (
                  <li key={`int-${interaction.id}`} className="crm-timeline__item">
                    <span className="crm-timeline__icon" aria-hidden="true">
                      <MessageCircle size={14} strokeWidth={1.75} />
                    </span>
                    <div>
                      <strong>
                        {INTERACTION_LABEL[interaction.type] ?? interaction.type} ·{" "}
                        {interaction.channel}
                      </strong>
                      {interaction.message ? <p>{interaction.message}</p> : null}
                      <time>{formatDateTime(interaction.createdAt)}</time>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {lead.tasks.length ? (
            <section className="crm-panel">
              <header className="crm-panel__head">
                <h2>
                  <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" /> Tarefas
                </h2>
              </header>
              <ul className="crm-lead-detail__tasks">
                {lead.tasks.map((task) => (
                  <li key={task.id}>
                    <strong>{task.title}</strong>
                    <span>{task.status}</span>
                    <time>{task.dueAt ? formatDateTime(task.dueAt) : "Sem prazo"}</time>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
