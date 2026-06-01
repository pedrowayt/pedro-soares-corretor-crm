import Link from "next/link";
import {
  CalendarCheck,
  CornerUpRight,
  FileSignature,
  MessageCircle,
  Workflow
} from "lucide-react";
import { listActivityFeed } from "@/lib/data/activity-feed";
import { formatCurrencyBRL } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  FORM_SUBMISSION: "Formulário enviado",
  WHATSAPP_CLICK: "Clique no WhatsApp",
  WHATSAPP_MESSAGE: "Mensagem no WhatsApp",
  TABLE_DOWNLOAD: "Baixou tabela",
  EMAIL: "E-mail",
  PHONE_CALL: "Ligação",
  NOTE: "Nota interna"
};

const CHANNEL_FILTERS = [
  { id: "", label: "Todos" },
  { id: "WHATSAPP", label: "WhatsApp" },
  { id: "SITE", label: "Site" },
  { id: "EMAIL", label: "E-mail" },
  { id: "PHONE", label: "Telefone" },
  { id: "INSTAGRAM", label: "Instagram" },
  { id: "CRM", label: "Notas CRM" }
];

function formatRelative(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days}d`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default async function CrmInboxPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const channel = typeof params.channel === "string" ? params.channel : undefined;
  const search = typeof params.q === "string" ? params.q : undefined;
  const entries = await listActivityFeed({ channel, search });

  return (
    <div className="crm-inbox">
      <header className="crm-inbox__head">
        <div>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            Inbox
          </h1>
          <p className="section-subtitle">Atividade recente dos seus leads em uma timeline única.</p>
        </div>
      </header>

      <form method="GET" className="crm-inbox__filters">
        <input
          type="search"
          name="q"
          defaultValue={search ?? ""}
          placeholder="Buscar por nome ou conteúdo da mensagem"
          aria-label="Buscar"
        />
        <div className="crm-inbox__chips" role="tablist" aria-label="Canal">
          {CHANNEL_FILTERS.map((entry) => {
            const isActive = (channel ?? "") === entry.id;
            return (
              <Link
                key={entry.id || "all"}
                href={
                  entry.id
                    ? `/crm/inbox?channel=${entry.id}${search ? `&q=${encodeURIComponent(search)}` : ""}`
                    : search
                      ? `/crm/inbox?q=${encodeURIComponent(search)}`
                      : "/crm/inbox"
                }
                className={`crm-inbox__chip${isActive ? " is-active" : ""}`}
                role="tab"
                aria-selected={isActive}
              >
                {entry.label}
              </Link>
            );
          })}
        </div>
        <button type="submit" className="visually-hidden">
          Buscar
        </button>
      </form>

      {entries.length === 0 ? (
        <p className="crm-panel__empty" style={{ padding: 20 }}>
          Nenhuma atividade encontrada. Ajuste o filtro ou aguarde novas interações.
        </p>
      ) : (
        <ol className="crm-inbox__feed">
          {entries.map((entry) => {
            let Icon = MessageCircle;
            let badge = "Mensagem";
            let body = "";
            if (entry.kind === "visit") {
              Icon = CalendarCheck;
              badge = `Visita · ${entry.status}`;
              body = entry.propertyTitle ?? "Sem imóvel";
            } else if (entry.kind === "proposal") {
              Icon = FileSignature;
              badge = `Proposta · ${entry.status}`;
              body = `${entry.propertyTitle ?? "Sem imóvel"} — ${formatCurrencyBRL(entry.offeredValue)}`;
            } else if (entry.kind === "stage") {
              Icon = Workflow;
              badge = "Movimentação no funil";
              body = `${entry.fromStage ?? "Início"} → ${entry.toStage}`;
            } else {
              Icon = MessageCircle;
              badge = `${TYPE_LABEL[entry.type] ?? entry.type} · ${entry.channel}`;
              body =
                entry.message ??
                entry.propertyTitle ??
                entry.developmentTitle ??
                "Sem detalhe registrado";
            }

            return (
              <li key={entry.id} className="crm-inbox__row">
                <span className="crm-inbox__icon" aria-hidden="true">
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <div className="crm-inbox__main">
                  <div className="crm-inbox__line">
                    <Link href={`/crm/leads/${entry.leadId}`} className="crm-inbox__lead">
                      {entry.leadName}
                    </Link>
                    <span className="crm-inbox__badge">{badge}</span>
                  </div>
                  <p className="crm-inbox__body">{body}</p>
                  <time className="crm-inbox__time">{formatRelative(entry.createdAt)}</time>
                </div>
                <Link href={`/crm/leads/${entry.leadId}`} className="crm-inbox__open" aria-label="Abrir lead">
                  <CornerUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
