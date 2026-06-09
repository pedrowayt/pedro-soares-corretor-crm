"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/utils";

export type AuctionImportListItem = {
  id: string;
  source: string;
  externalId: string;
  originalUrl: string;
  status: string;
  missingFields: string[];
  lastImportedAt: string;
  publishedAt: string | null;
  property: {
    id: string;
    title: string;
    slug: string;
    city: string;
    district: string;
    price: number;
    status: string;
    thumbnailUrl: string | null;
    auctionCase: {
      minimumBid: number | null;
      auctionDate: string | null;
      firstAuctionDate: string | null;
      secondAuctionDate: string | null;
    } | null;
  } | null;
};

const STATUS_LABELS: Record<string, string> = {
  NEEDS_REVIEW: "Pendente",
  READY: "Pronto",
  PUBLISHED: "Publicado",
  ERROR: "Erro"
};

const STATUS_TONES: Record<string, string> = {
  NEEDS_REVIEW: "tone-pending",
  READY: "tone-reserved",
  PUBLISHED: "tone-available",
  ERROR: "tone-sold"
};

const MISSING_LABELS: Record<string, string> = {
  title: "título",
  description: "descrição",
  city: "cidade",
  district: "bairro",
  minimumBid: "lance mínimo",
  image: "foto",
  source: "fonte",
  externalId: "ID externo",
  originalUrl: "URL original",
  auctionDate: "data do leilão",
  noticeUrl: "edital/documento",
  occupancyStatus: "ocupação"
};

function formatDate(value: string | null | undefined) {
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

function auctionDateFor(item: AuctionImportListItem) {
  return (
    item.property?.auctionCase?.auctionDate ??
    item.property?.auctionCase?.firstAuctionDate ??
    item.property?.auctionCase?.secondAuctionDate ??
    null
  );
}

async function postAction(url: string) {
  const response = await fetch(url, { method: "POST" });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    const missing = data?.error?.details?.missingFields;
    const suffix = Array.isArray(missing) && missing.length ? ` Pendências: ${missing.join(", ")}.` : "";
    throw new Error(`${data?.error?.message ?? "Falha na operação."}${suffix}`);
  }
}

export function AuctionImportList({ imports }: { imports: AuctionImportListItem[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function runAction(item: AuctionImportListItem, action: "publish" | "unpublish") {
    setError(null);
    setPendingId(item.id);
    try {
      await postAction(`/api/crm/auction-imports/${item.id}/${action}`);
      startTransition(() => router.refresh());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Falha na operação.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="crm-property-list" aria-label="Importações de leilões">
      <div className="crm-property-list__toolbar">
        <strong>
          {imports.length} {imports.length === 1 ? "leilão importado" : "leilões importados"}
        </strong>
        <span>Revise dados jurídicos, fotos e publicação manual</span>
      </div>

      {error ? <p className="crm-property-list__error" role="alert">{error}</p> : null}

      {imports.length ? (
        <div className="crm-property-table-wrap crm-table-host">
          <table className="crm-property-table">
            <thead>
              <tr>
                <th>Imóvel</th>
                <th>Leilão</th>
                <th>Fonte</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {imports.map((item) => {
                const property = item.property;
                const missingLabels = item.missingFields.map((field) => MISSING_LABELS[field] ?? field);
                const isPublished = item.status === "PUBLISHED";
                const canPublish = Boolean(property) && !isPublished;

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="crm-property-row-main">
                        <div
                          className={`crm-property-thumb ${property?.thumbnailUrl ? "" : "is-empty"}`}
                          style={{
                            backgroundImage: property?.thumbnailUrl
                              ? `url(${property.thumbnailUrl})`
                              : undefined
                          }}
                          aria-hidden="true"
                        />
                        <div className="crm-property-row-copy">
                          {property ? (
                            <Link href={`/crm/imoveis/${property.id}`} className="crm-property-title">
                              {property.title}
                            </Link>
                          ) : (
                            <strong className="crm-property-title">Imóvel não vinculado</strong>
                          )}
                          <span className="crm-property-meta">
                            {property ? `${property.district}, ${property.city}` : "Importação sem imóvel"}
                          </span>
                          <span className="crm-property-meta">
                            Importado em {formatDate(item.lastImportedAt)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong className="crm-property-price">
                        {formatCurrencyBRL(property?.auctionCase?.minimumBid ?? property?.price ?? 0)}
                      </strong>
                      <span className="crm-property-meta">{formatDate(auctionDateFor(item))}</span>
                    </td>
                    <td>
                      <span className="crm-property-location">{item.source}</span>
                      <span className="crm-property-meta">ID: {item.externalId}</span>
                      <a
                        className="crm-property-owner-whatsapp"
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
                        Abrir origem
                      </a>
                    </td>
                    <td>
                      <span className={`badge badge-${STATUS_TONES[item.status] ?? "tone-pending"}`}>
                        {STATUS_LABELS[item.status] ?? item.status}
                      </span>
                      <span className="crm-property-meta">
                        {missingLabels.length
                          ? `${missingLabels.length} pendência(s): ${missingLabels.slice(0, 3).join(", ")}${missingLabels.length > 3 ? "..." : ""}`
                          : "Checklist completo"}
                      </span>
                    </td>
                    <td>
                      <div className="crm-property-actions">
                        {property ? (
                          <Link className="button button-primary" href={`/crm/imoveis/${property.id}`}>
                            Revisar
                          </Link>
                        ) : null}
                        {isPublished && property ? (
                          <Link className="button button-ghost" href={`/imoveis/${property.slug}`} target="_blank">
                            Ver site
                          </Link>
                        ) : null}
                        {canPublish ? (
                          <button
                            type="button"
                            className="button button-ghost"
                            onClick={() => runAction(item, "publish")}
                            disabled={pendingId === item.id}
                          >
                            {pendingId === item.id ? "Publicando..." : "Publicar"}
                          </button>
                        ) : null}
                        {isPublished ? (
                          <button
                            type="button"
                            className="button button-ghost"
                            onClick={() => runAction(item, "unpublish")}
                            disabled={pendingId === item.id}
                          >
                            {pendingId === item.id ? "Ocultando..." : "Despublicar"}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="crm-property-empty">
          <p>Nenhum leilão importado ainda.</p>
        </div>
      )}
    </section>
  );
}
