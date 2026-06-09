"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/utils";

export type AuctionReviewData = {
  propertyId: string;
  propertyStatus: string;
  publishedAt: string | null;
  mediaCount: number;
  documentsJson: string | null;
  checklist: {
    ready: boolean;
    missing: string[];
  };
  auctionImport: {
    id: string;
    source: string;
    externalId: string;
    originalUrl: string;
    status: string;
    lastImportedAt: string;
    rawPayloadJson: string;
  } | null;
  auctionCase: {
    caseNumber: string | null;
    courtName: string | null;
    auctionDate: string | null;
    firstAuctionDate: string | null;
    secondAuctionDate: string | null;
    minimumBid: number | null;
    appraisedValue: number | null;
    estimatedCosts: number | null;
    documentaryRisk: string | null;
    legalStatus: string | null;
    editalUrl: string | null;
    appraisalUrl: string | null;
    registryUrl: string | null;
    bidUrl: string | null;
    lotCode: string | null;
    auctioneerName: string | null;
    auctionType: string | null;
    auctionMode: string | null;
    registryNumber: string | null;
    registryOffice: string | null;
    occupancyStatus: string | null;
    debtsInfo: string | null;
    notes: string | null;
  } | null;
};

const MISSING_LABELS: Record<string, string> = {
  title: "Título revisado",
  description: "Descrição revisada",
  city: "Cidade",
  district: "Bairro",
  minimumBid: "Lance mínimo",
  image: "Pelo menos uma foto",
  source: "Fonte",
  externalId: "ID externo",
  originalUrl: "URL original",
  auctionDate: "Data do leilão",
  noticeUrl: "Edital ou documento",
  occupancyStatus: "Situação de ocupação"
};

type FormState = NonNullable<AuctionReviewData["auctionCase"]>;

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function numberOrNull(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function makeInitialState(data: AuctionReviewData): FormState {
  const item = data.auctionCase;
  return {
    caseNumber: item?.caseNumber ?? null,
    courtName: item?.courtName ?? null,
    auctionDate: item?.auctionDate ? toDatetimeLocal(item.auctionDate) : null,
    firstAuctionDate: item?.firstAuctionDate ? toDatetimeLocal(item.firstAuctionDate) : null,
    secondAuctionDate: item?.secondAuctionDate ? toDatetimeLocal(item.secondAuctionDate) : null,
    minimumBid: item?.minimumBid ?? null,
    appraisedValue: item?.appraisedValue ?? null,
    estimatedCosts: item?.estimatedCosts ?? null,
    documentaryRisk: item?.documentaryRisk ?? null,
    legalStatus: item?.legalStatus ?? null,
    editalUrl: item?.editalUrl ?? null,
    appraisalUrl: item?.appraisalUrl ?? null,
    registryUrl: item?.registryUrl ?? null,
    bidUrl: item?.bidUrl ?? null,
    lotCode: item?.lotCode ?? null,
    auctioneerName: item?.auctioneerName ?? null,
    auctionType: item?.auctionType ?? null,
    auctionMode: item?.auctionMode ?? null,
    registryNumber: item?.registryNumber ?? null,
    registryOffice: item?.registryOffice ?? null,
    occupancyStatus: item?.occupancyStatus ?? null,
    debtsInfo: item?.debtsInfo ?? null,
    notes: item?.notes ?? null
  };
}

async function fetchJson(url: string, method: string, body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    const missing = payload?.error?.details?.missingFields;
    const suffix = Array.isArray(missing) && missing.length ? ` Pendências: ${missing.join(", ")}.` : "";
    throw new Error(`${payload?.error?.message ?? "Falha na operação."}${suffix}`);
  }
  return payload;
}

function formatDate(value: string | null) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function AuctionReviewPanel({ data }: { data: AuctionReviewData }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [state, setState] = useState<FormState>(() => makeInitialState(data));
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const missingLabels = useMemo(
    () => data.checklist.missing.map((field) => MISSING_LABELS[field] ?? field),
    [data.checklist.missing]
  );
  const isPublished = data.auctionImport?.status === "PUBLISHED" || Boolean(data.publishedAt);

  function patch(partial: Partial<FormState>) {
    setStatusMessage(null);
    setState((current) => ({ ...current, ...partial }));
  }

  async function saveAuctionCase() {
    setBusy(true);
    setStatusMessage(null);
    try {
      await fetchJson(`/api/crm/properties/${data.propertyId}`, "PATCH", {
        auctionCase: {
          ...state,
          auctionDate: fromDatetimeLocal(String(state.auctionDate ?? "")),
          firstAuctionDate: fromDatetimeLocal(String(state.firstAuctionDate ?? "")),
          secondAuctionDate: fromDatetimeLocal(String(state.secondAuctionDate ?? "")),
          minimumBid: state.minimumBid,
          appraisedValue: state.appraisedValue,
          estimatedCosts: state.estimatedCosts
        }
      });
      setStatusMessage({ type: "success", text: "Dados de leilão salvos." });
      startTransition(() => router.refresh());
    } catch (caught) {
      setStatusMessage({ type: "error", text: caught instanceof Error ? caught.message : "Erro ao salvar." });
    } finally {
      setBusy(false);
    }
  }

  async function runPublication(action: "publish" | "unpublish") {
    if (!data.auctionImport) return;
    setBusy(true);
    setStatusMessage(null);
    try {
      await fetchJson(`/api/crm/auction-imports/${data.auctionImport.id}/${action}`, "POST");
      setStatusMessage({
        type: "success",
        text: action === "publish" ? "Leilão publicado." : "Leilão ocultado do site."
      });
      startTransition(() => router.refresh());
    } catch (caught) {
      setStatusMessage({ type: "error", text: caught instanceof Error ? caught.message : "Erro na publicação." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="card" style={{ padding: 18, marginTop: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p className="badge" style={{ marginTop: 0 }}>
            Revisão de leilão
          </p>
          <h2 className="title-luxury" style={{ margin: "8px 0 0" }}>
            Dados para publicação
          </h2>
          <p className="section-subtitle" style={{ marginTop: 6 }}>
            Checklist, origem da importação, documentos e informações jurídicas.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
          {data.auctionImport?.originalUrl ? (
            <a className="button button-ghost" href={data.auctionImport.originalUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
              Origem
            </a>
          ) : null}
          {isPublished ? (
            <button
              type="button"
              className="button button-ghost"
              onClick={() => runPublication("unpublish")}
              disabled={busy || !data.auctionImport}
            >
              Despublicar
            </button>
          ) : (
            <button
              type="button"
              className="button button-primary"
              onClick={() => runPublication("publish")}
              disabled={busy || !data.auctionImport}
            >
              Publicar leilão
            </button>
          )}
        </div>
      </div>

      <div className="form-grid" style={{ marginTop: 14 }}>
        <div>
          <label>Fonte</label>
          <input value={data.auctionImport?.source ?? "Manual"} readOnly />
        </div>
        <div>
          <label>ID externo</label>
          <input value={data.auctionImport?.externalId ?? ""} readOnly />
        </div>
        <div>
          <label>Status da importação</label>
          <input value={data.auctionImport?.status ?? "Sem importação"} readOnly />
        </div>
        <div>
          <label>Última importação</label>
          <input value={data.auctionImport ? formatDate(data.auctionImport.lastImportedAt) : "Manual"} readOnly />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3 className="title-luxury" style={{ margin: "0 0 8px" }}>Checklist</h3>
        {missingLabels.length ? (
          <div className="wiz-chips wiz-chips--multi">
            {missingLabels.map((label) => (
              <span key={label} className="wiz-chip">
                {label}
              </span>
            ))}
          </div>
        ) : (
          <p className="wiz-alert wiz-alert--success">Checklist completo. O leilão pode ser publicado.</p>
        )}
      </div>

      <div className="form-grid" style={{ marginTop: 16 }}>
        <div>
          <label>Código do lote</label>
          <input value={state.lotCode ?? ""} onChange={(event) => patch({ lotCode: emptyToNull(event.target.value) })} />
        </div>
        <div>
          <label>Leiloeiro</label>
          <input value={state.auctioneerName ?? ""} onChange={(event) => patch({ auctioneerName: emptyToNull(event.target.value) })} />
        </div>
        <div>
          <label>Tipo de leilão</label>
          <input value={state.auctionType ?? ""} onChange={(event) => patch({ auctionType: emptyToNull(event.target.value) })} />
        </div>
        <div>
          <label>Modalidade</label>
          <input value={state.auctionMode ?? ""} onChange={(event) => patch({ auctionMode: emptyToNull(event.target.value) })} />
        </div>
        <div>
          <label>Data principal</label>
          <input
            type="datetime-local"
            value={state.auctionDate ?? ""}
            onChange={(event) => patch({ auctionDate: event.target.value || null })}
          />
        </div>
        <div>
          <label>1ª praça</label>
          <input
            type="datetime-local"
            value={state.firstAuctionDate ?? ""}
            onChange={(event) => patch({ firstAuctionDate: event.target.value || null })}
          />
        </div>
        <div>
          <label>2ª praça</label>
          <input
            type="datetime-local"
            value={state.secondAuctionDate ?? ""}
            onChange={(event) => patch({ secondAuctionDate: event.target.value || null })}
          />
        </div>
        <div>
          <label>Lance mínimo</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={state.minimumBid ?? ""}
            onChange={(event) => patch({ minimumBid: numberOrNull(event.target.value) })}
          />
        </div>
        <div>
          <label>Valor de avaliação</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={state.appraisedValue ?? ""}
            onChange={(event) => patch({ appraisedValue: numberOrNull(event.target.value) })}
          />
        </div>
        <div>
          <label>Custos estimados</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={state.estimatedCosts ?? ""}
            onChange={(event) => patch({ estimatedCosts: numberOrNull(event.target.value) })}
          />
        </div>
        <div>
          <label>Ocupação</label>
          <select
            value={state.occupancyStatus ?? ""}
            onChange={(event) => patch({ occupancyStatus: emptyToNull(event.target.value) })}
          >
            <option value="">Não preenchido</option>
            <option value="OCUPADO">Ocupado</option>
            <option value="DESOCUPADO">Desocupado</option>
            <option value="NAO_INFORMADO">Não informado no edital</option>
          </select>
        </div>
        <div>
          <label>Risco documental</label>
          <select
            value={state.documentaryRisk ?? ""}
            onChange={(event) => patch({ documentaryRisk: emptyToNull(event.target.value) })}
          >
            <option value="">Sem classificação</option>
            <option value="BAIXO">Baixo</option>
            <option value="MEDIO">Médio</option>
            <option value="ALTO">Alto</option>
          </select>
        </div>
        <div>
          <label>Processo</label>
          <input value={state.caseNumber ?? ""} onChange={(event) => patch({ caseNumber: emptyToNull(event.target.value) })} />
        </div>
        <div>
          <label>Tribunal / vara</label>
          <input value={state.courtName ?? ""} onChange={(event) => patch({ courtName: emptyToNull(event.target.value) })} />
        </div>
        <div>
          <label>Matrícula</label>
          <input value={state.registryNumber ?? ""} onChange={(event) => patch({ registryNumber: emptyToNull(event.target.value) })} />
        </div>
        <div>
          <label>Cartório</label>
          <input value={state.registryOffice ?? ""} onChange={(event) => patch({ registryOffice: emptyToNull(event.target.value) })} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Link para dar lance</label>
          <input value={state.bidUrl ?? ""} onChange={(event) => patch({ bidUrl: emptyToNull(event.target.value) })} />
        </div>
        <div>
          <label>Edital</label>
          <input value={state.editalUrl ?? ""} onChange={(event) => patch({ editalUrl: emptyToNull(event.target.value) })} />
        </div>
        <div>
          <label>Laudo</label>
          <input value={state.appraisalUrl ?? ""} onChange={(event) => patch({ appraisalUrl: emptyToNull(event.target.value) })} />
        </div>
        <div>
          <label>Matrícula PDF</label>
          <input value={state.registryUrl ?? ""} onChange={(event) => patch({ registryUrl: emptyToNull(event.target.value) })} />
        </div>
        <div>
          <label>Status jurídico</label>
          <input value={state.legalStatus ?? ""} onChange={(event) => patch({ legalStatus: emptyToNull(event.target.value) })} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Débitos e observações jurídicas</label>
          <textarea rows={3} value={state.debtsInfo ?? ""} onChange={(event) => patch({ debtsInfo: emptyToNull(event.target.value) })} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label>Notas internas do leilão</label>
          <textarea rows={3} value={state.notes ?? ""} onChange={(event) => patch({ notes: emptyToNull(event.target.value) })} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
        <button type="button" className="button button-primary" onClick={saveAuctionCase} disabled={busy}>
          {busy ? "Salvando..." : "Salvar dados do leilão"}
        </button>
        <span className="crm-property-meta">
          Lance: {formatCurrencyBRL(state.minimumBid ?? 0)} · Fotos: {data.mediaCount}
        </span>
        {statusMessage ? (
          <span style={{ color: statusMessage.type === "success" ? "#15803d" : "#b91c1c" }}>
            {statusMessage.text}
          </span>
        ) : null}
      </div>

      {data.documentsJson || data.auctionImport ? (
        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
          {data.documentsJson ? (
            <details className="card" style={{ padding: 12 }}>
              <summary>Documentos salvos em Property.documents</summary>
              <pre style={{ whiteSpace: "pre-wrap", overflow: "auto" }}>{data.documentsJson}</pre>
            </details>
          ) : null}
          {data.auctionImport ? (
            <details className="card" style={{ padding: 12 }}>
              <summary>Payload bruto recebido</summary>
              <pre style={{ whiteSpace: "pre-wrap", overflow: "auto" }}>{data.auctionImport.rawPayloadJson}</pre>
            </details>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
