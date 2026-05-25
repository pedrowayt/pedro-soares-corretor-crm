"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const TYPE_OPTIONS = [
  { value: "CASA", label: "Casa" },
  { value: "APARTAMENTO", label: "Apartamento" },
  { value: "LOTE", label: "Lote" },
  { value: "COMERCIAL", label: "Comercial" },
  { value: "RURAL", label: "Rural" }
] as const;

const PURPOSE_OPTIONS = [
  { value: "VENDA", label: "Venda" },
  { value: "LOCACAO", label: "Locação" },
  { value: "INVESTIMENTO", label: "Investimento" },
  { value: "LEILAO", label: "Leilão" },
  { value: "LANCAMENTO", label: "Lançamento" }
] as const;

const STATUS_OPTIONS = [
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "RESERVADO", label: "Reservado" },
  { value: "VENDIDO", label: "Vendido" },
  { value: "ALUGADO", label: "Alugado" },
  { value: "EM_ANALISE", label: "Em análise" }
] as const;

export type EditorMedia = {
  id: string;
  url: string;
  position: number;
  kind: string;
};

export type EditorProperty = {
  id: string;
  title: string;
  slug: string;
  type: string;
  purpose: string;
  status: string;
  price: number;
  city: string;
  district: string;
  address: string | null;
  postalCode: string | null;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  areaM2: number | null;
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  description: string;
  features: string[];
  legalNotes: string | null;
  internalNotes: string | null;
  commissionPct: number | null;
  marketAskingValue: number | null;
  marketEstimatedValue: number | null;
  marketOpportunity: number | null;
  marketComparableLinks: string[];
  marketLiquidityNotes: string | null;
  isInvestorHighlight: boolean;
  isAuctionOpportunity: boolean;
  media: EditorMedia[];
};

type Status = { type: "idle" | "success" | "error"; message?: string };

function toOptionalNumber(input: FormDataEntryValue | null) {
  if (input === null) return undefined;
  const raw = String(input).trim();
  if (!raw.length) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function fetchJson(url: string, method: string, body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new Error(data?.error?.message ?? "Falha na operação.");
  }
  return data;
}

export function PropertyEditor({ property }: { property: EditorProperty }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [media, setMedia] = useState<EditorMedia[]>(property.media);
  const [uploading, setUploading] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [, startTransition] = useTransition();

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const features = String(formData.get("features") || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const marketComparableLinks = String(formData.get("marketComparableLinks") || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await fetchJson(`/api/crm/properties/${property.id}`, "PATCH", {
        title: formData.get("title"),
        slug: formData.get("slug"),
        type: formData.get("type"),
        purpose: formData.get("purpose"),
        status: formData.get("status"),
        price: Number(formData.get("price") || 0),
        city: formData.get("city"),
        district: formData.get("district"),
        address: formData.get("address"),
        postalCode: formData.get("postalCode"),
        googleMapsUrl: formData.get("googleMapsUrl"),
        latitude: toOptionalNumber(formData.get("latitude")),
        longitude: toOptionalNumber(formData.get("longitude")),
        areaM2: toOptionalNumber(formData.get("areaM2")),
        bedrooms: toOptionalNumber(formData.get("bedrooms")),
        suites: toOptionalNumber(formData.get("suites")),
        bathrooms: toOptionalNumber(formData.get("bathrooms")),
        parkingSpaces: toOptionalNumber(formData.get("parkingSpaces")),
        description: formData.get("description"),
        features,
        legalNotes: formData.get("legalNotes"),
        internalNotes: formData.get("internalNotes"),
        commissionPct: toOptionalNumber(formData.get("commissionPct")),
        marketAskingValue: toOptionalNumber(formData.get("marketAskingValue")),
        marketEstimatedValue: toOptionalNumber(formData.get("marketEstimatedValue")),
        marketOpportunity: toOptionalNumber(formData.get("marketOpportunity")),
        marketComparableLinks,
        marketLiquidityNotes: formData.get("marketLiquidityNotes"),
        isInvestorHighlight: formData.get("isInvestorHighlight") === "on",
        isAuctionOpportunity: formData.get("isAuctionOpportunity") === "on"
      });
      setStatus({ type: "success", message: "Imóvel atualizado." });
      refresh();
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro ao salvar." });
    }
  }

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setMediaError("Selecione um arquivo de imagem.");
      return;
    }
    setMediaError(null);
    setUploading(true);
    try {
      const directUpload = await fetchJson("/api/media/images/direct-upload", "POST", {
        metadata: { module: "property", propertyId: property.id }
      });

      const uploadUrl = directUpload.data.directUpload.uploadURL as string;
      const imageDeliveryUrl = directUpload.data.imageDeliveryUrl as string | null | undefined;

      const body = new FormData();
      body.append("file", file);
      const cfResponse = await fetch(uploadUrl, { method: "POST", body });
      const cfPayload = await cfResponse.json().catch(() => null);
      if (!cfResponse.ok || !cfPayload?.success) {
        throw new Error(cfPayload?.errors?.[0]?.message ?? `Falha no upload (HTTP ${cfResponse.status}).`);
      }

      const variants = cfPayload?.result?.variants as string[] | undefined;
      const finalUrl = imageDeliveryUrl ?? variants?.[0] ?? "";
      if (!finalUrl) {
        throw new Error("Upload concluído, mas a URL pública não foi retornada.");
      }

      const cloudflareMediaId = cfPayload?.result?.id as string | undefined;

      const created = await fetchJson(`/api/crm/properties/${property.id}/media`, "POST", {
        kind: "IMAGE",
        url: finalUrl,
        cloudflareMediaId
      });

      setMedia((prev) => [...prev, created.data.media as EditorMedia]);
      if (fileRef.current) fileRef.current.value = "";
      refresh();
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : "Erro inesperado no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function setAsPrimary(mediaId: string) {
    try {
      await fetchJson(`/api/crm/properties/${property.id}/media/${mediaId}`, "PATCH", {
        makePrimary: true
      });
      setMedia((prev) => {
        const target = prev.find((item) => item.id === mediaId);
        if (!target) return prev;
        return [target, ...prev.filter((item) => item.id !== mediaId)].map((item, index) => ({
          ...item,
          position: index
        }));
      });
      refresh();
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : "Erro ao definir capa.");
    }
  }

  async function move(mediaId: string, direction: -1 | 1) {
    setMedia((prev) => {
      const index = prev.findIndex((item) => item.id === mediaId);
      if (index < 0) return prev;
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      const remapped = next.map((item, idx) => ({ ...item, position: idx }));

      void fetchJson(`/api/crm/properties/${property.id}/media/${mediaId}`, "PATCH", {
        position: target
      })
        .then(() => refresh())
        .catch((error) => {
          setMediaError(error instanceof Error ? error.message : "Erro ao reordenar.");
        });

      return remapped;
    });
  }

  async function removeMedia(mediaId: string) {
    if (!confirm("Remover esta foto?")) return;
    try {
      await fetchJson(`/api/crm/properties/${property.id}/media/${mediaId}`, "DELETE");
      setMedia((prev) => prev.filter((item) => item.id !== mediaId));
      refresh();
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : "Erro ao remover.");
    }
  }

  return (
    <div className="property-editor">
      <article className="card" style={{ padding: 18 }}>
        <h2 className="title-luxury" style={{ marginTop: 0 }}>Galeria de fotos</h2>
        <p className="section-subtitle" style={{ marginTop: 0 }}>
          A primeira foto é usada como capa nas listagens. Arraste a ordem via botões.
        </p>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
          <input ref={fileRef} type="file" accept="image/*" />
          <button
            type="button"
            className="button button-primary"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Enviando..." : "Adicionar foto"}
          </button>
        </div>
        {mediaError ? <p style={{ color: "#b91c1c", marginTop: 8 }}>{mediaError}</p> : null}

        {media.length ? (
          <div className="property-editor__gallery">
            {media.map((item, index) => (
              <div key={item.id} className="property-editor__media">
                <div
                  className="property-editor__thumb"
                  style={{ backgroundImage: `url(${item.url})` }}
                >
                  {index === 0 ? <span className="badge badge-tone-available">Capa</span> : null}
                </div>
                <div className="property-editor__media-actions">
                  <button
                    type="button"
                    className="property-status-chip"
                    onClick={() => setAsPrimary(item.id)}
                    disabled={index === 0}
                  >
                    Tornar capa
                  </button>
                  <button
                    type="button"
                    className="property-status-chip"
                    onClick={() => move(item.id, -1)}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="property-status-chip"
                    onClick={() => move(item.id, 1)}
                    disabled={index === media.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="property-status-chip property-status-chip--danger"
                    onClick={() => removeMedia(item.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--text-muted)", marginTop: 12 }}>
            Nenhuma foto adicionada ainda.
          </p>
        )}
      </article>

      <form className="property-editor__form" onSubmit={handleSave}>
        <article className="card" style={{ padding: 18 }}>
          <h2 className="title-luxury" style={{ marginTop: 0 }}>Informações básicas</h2>
          <div className="form-grid">
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Título</label>
              <input name="title" defaultValue={property.title} required />
            </div>
            <div>
              <label>Slug</label>
              <input name="slug" defaultValue={property.slug} required />
            </div>
            <div>
              <label>Status</label>
              <select name="status" defaultValue={property.status}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Tipo</label>
              <select name="type" defaultValue={property.type}>
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Finalidade</label>
              <select name="purpose" defaultValue={property.purpose}>
                {PURPOSE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Preço (R$)</label>
              <input name="price" type="number" min={0} step="0.01" defaultValue={property.price} required />
            </div>
            <div>
              <label>Comissão (%)</label>
              <input
                name="commissionPct"
                type="number"
                min={0}
                max={100}
                step="0.01"
                defaultValue={property.commissionPct ?? ""}
              />
            </div>
          </div>
        </article>

        <article className="card" style={{ padding: 18 }}>
          <h2 className="title-luxury" style={{ marginTop: 0 }}>Endereço</h2>
          <div className="form-grid">
            <div>
              <label>Cidade</label>
              <input name="city" defaultValue={property.city} required />
            </div>
            <div>
              <label>Bairro</label>
              <input name="district" defaultValue={property.district} required />
            </div>
            <div>
              <label>Endereço</label>
              <input name="address" defaultValue={property.address ?? ""} />
            </div>
            <div>
              <label>CEP</label>
              <input name="postalCode" defaultValue={property.postalCode ?? ""} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Link do Google Maps</label>
              <input name="googleMapsUrl" defaultValue={property.googleMapsUrl ?? ""} />
            </div>
            <div>
              <label>Latitude</label>
              <input name="latitude" type="number" step="any" defaultValue={property.latitude ?? ""} />
            </div>
            <div>
              <label>Longitude</label>
              <input name="longitude" type="number" step="any" defaultValue={property.longitude ?? ""} />
            </div>
          </div>
        </article>

        <article className="card" style={{ padding: 18 }}>
          <h2 className="title-luxury" style={{ marginTop: 0 }}>Características</h2>
          <div className="form-grid">
            <div>
              <label>Área (m²)</label>
              <input name="areaM2" type="number" min={0} step="0.01" defaultValue={property.areaM2 ?? ""} />
            </div>
            <div>
              <label>Quartos</label>
              <input name="bedrooms" type="number" min={0} defaultValue={property.bedrooms ?? ""} />
            </div>
            <div>
              <label>Suítes</label>
              <input name="suites" type="number" min={0} defaultValue={property.suites ?? ""} />
            </div>
            <div>
              <label>Banheiros</label>
              <input name="bathrooms" type="number" min={0} defaultValue={property.bathrooms ?? ""} />
            </div>
            <div>
              <label>Vagas</label>
              <input name="parkingSpaces" type="number" min={0} defaultValue={property.parkingSpaces ?? ""} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Descrição</label>
              <textarea name="description" defaultValue={property.description} required rows={4} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Características (uma por linha)</label>
              <textarea
                name="features"
                defaultValue={property.features.join("\n")}
                placeholder="Piscina&#10;Área gourmet"
                rows={4}
              />
            </div>
          </div>
        </article>

        <article className="card" style={{ padding: 18 }}>
          <h2 className="title-luxury" style={{ marginTop: 0 }}>Análise de mercado</h2>
          <div className="form-grid">
            <div>
              <label>Valor de mercado pedido</label>
              <input
                name="marketAskingValue"
                type="number"
                min={0}
                step="0.01"
                defaultValue={property.marketAskingValue ?? ""}
              />
            </div>
            <div>
              <label>Valor de mercado estimado</label>
              <input
                name="marketEstimatedValue"
                type="number"
                min={0}
                step="0.01"
                defaultValue={property.marketEstimatedValue ?? ""}
              />
            </div>
            <div>
              <label>Valor de oportunidade</label>
              <input
                name="marketOpportunity"
                type="number"
                min={0}
                step="0.01"
                defaultValue={property.marketOpportunity ?? ""}
              />
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", paddingTop: 22 }}>
              <label style={{ display: "flex", gap: 6, alignItems: "center", margin: 0 }}>
                <input
                  type="checkbox"
                  name="isInvestorHighlight"
                  defaultChecked={property.isInvestorHighlight}
                />
                Destaque investidor
              </label>
              <label style={{ display: "flex", gap: 6, alignItems: "center", margin: 0 }}>
                <input
                  type="checkbox"
                  name="isAuctionOpportunity"
                  defaultChecked={property.isAuctionOpportunity}
                />
                Oportunidade leilão
              </label>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Links comparativos (um por linha)</label>
              <textarea
                name="marketComparableLinks"
                defaultValue={property.marketComparableLinks.join("\n")}
                rows={3}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Notas sobre liquidez</label>
              <textarea
                name="marketLiquidityNotes"
                defaultValue={property.marketLiquidityNotes ?? ""}
                rows={3}
              />
            </div>
          </div>
        </article>

        <article className="card" style={{ padding: 18 }}>
          <h2 className="title-luxury" style={{ marginTop: 0 }}>Notas internas</h2>
          <div className="form-grid">
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Notas jurídicas / documentais</label>
              <textarea name="legalNotes" defaultValue={property.legalNotes ?? ""} rows={3} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Notas internas (não públicas)</label>
              <textarea name="internalNotes" defaultValue={property.internalNotes ?? ""} rows={3} />
            </div>
          </div>
        </article>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button type="submit" className="button button-primary">Salvar alterações</button>
          {status.type !== "idle" ? (
            <span style={{ color: status.type === "success" ? "#15803d" : "#b91c1c" }}>
              {status.message}
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
