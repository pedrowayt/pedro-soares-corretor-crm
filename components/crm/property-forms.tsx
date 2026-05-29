"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/property-types";

const PROPERTY_PURPOSE_OPTIONS = [
  { value: "VENDA", label: "Venda" },
  { value: "LOCACAO", label: "Locação" },
  { value: "INVESTIMENTO", label: "Investimento" },
  { value: "LEILAO", label: "Leilão" },
  { value: "LANCAMENTO", label: "Lançamento" }
] as const;

const PROPERTY_STATUS_OPTIONS = [
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "RESERVADO", label: "Reservado" },
  { value: "VENDIDO", label: "Vendido" },
  { value: "ALUGADO", label: "Alugado" },
  { value: "EM_ANALISE", label: "Em análise" }
] as const;

type Status = { type: "idle" | "success" | "error"; message?: string };

async function postJson(url: string, payload: unknown, method: "POST" | "PATCH" = "POST") {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data?.error?.message ?? "Falha na operação.");
  }

  return data;
}

function toOptionalNumber(input: FormDataEntryValue | null) {
  if (input === null) return undefined;
  const raw = String(input).trim();
  if (!raw.length) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function PropertyForms() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ type: "idle" });

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <article className="card" style={{ padding: 16 }}>
        <h3 className="title-luxury" style={{ marginTop: 0 }}>Novo imóvel</h3>
        <p className="section-subtitle" style={{ marginTop: 0 }}>
          Crie o registro básico aqui. Após salvar, você é redirecionado para a página do imóvel onde adiciona fotos e demais detalhes.
        </p>
        <form
          className="form-grid"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const features = String(formData.get("features") || "")
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean);

            try {
              const result = await postJson("/api/crm/properties", {
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
                areaM2: toOptionalNumber(formData.get("areaM2")),
                landAreaM2: toOptionalNumber(formData.get("landAreaM2")),
                bedrooms: toOptionalNumber(formData.get("bedrooms")),
                livingRooms: toOptionalNumber(formData.get("livingRooms")),
                suites: toOptionalNumber(formData.get("suites")),
                bathrooms: toOptionalNumber(formData.get("bathrooms")),
                parkingSpaces: toOptionalNumber(formData.get("parkingSpaces")),
                description: formData.get("description"),
                features,
                commissionPct: toOptionalNumber(formData.get("commissionPct"))
              });

              setStatus({ type: "success", message: "Imóvel criado. Redirecionando para adicionar fotos..." });
              const newId = result?.data?.property?.id as string | undefined;
              if (newId) {
                router.push(`/crm/imoveis/${newId}`);
              } else {
                router.refresh();
              }
            } catch (error) {
              setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro ao criar imóvel." });
            }
          }}
        >
          <div>
            <label>Título</label>
            <input name="title" required />
          </div>
          <div>
            <label>Slug</label>
            <input name="slug" placeholder="casa-plano-diretor-sul" required />
          </div>
          <div>
            <label>Tipo</label>
            <select name="type" defaultValue="CASA">
              {PROPERTY_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Finalidade</label>
            <select name="purpose" defaultValue="VENDA">
              {PROPERTY_PURPOSE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select name="status" defaultValue="DISPONIVEL">
              {PROPERTY_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Preço</label>
            <input name="price" type="number" min={0} required />
          </div>
          <div>
            <label>Cidade</label>
            <input name="city" defaultValue="Palmas" required />
          </div>
          <div>
            <label>Bairro</label>
            <input name="district" required />
          </div>
          <div>
            <label>Endereço</label>
            <input name="address" />
          </div>
          <div>
            <label>CEP</label>
            <input name="postalCode" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Link do Google Maps</label>
            <input
              name="googleMapsUrl"
              placeholder="https://www.google.com/maps?q=Plano+Diretor+Sul+Palmas+TO"
            />
          </div>
          <div>
            <label>Área (m²)</label>
            <input name="areaM2" type="number" min={0} step="0.01" />
          </div>
          <div>
            <label>Terreno (m²)</label>
            <input name="landAreaM2" type="number" min={0} step="0.01" />
          </div>
          <div>
            <label>Quartos</label>
            <input name="bedrooms" type="number" min={0} />
          </div>
          <div>
            <label>Salas</label>
            <input name="livingRooms" type="number" min={0} />
          </div>
          <div>
            <label>Suítes</label>
            <input name="suites" type="number" min={0} />
          </div>
          <div>
            <label>Banheiros</label>
            <input name="bathrooms" type="number" min={0} />
          </div>
          <div>
            <label>Vagas</label>
            <input name="parkingSpaces" type="number" min={0} />
          </div>
          <div>
            <label>Comissão (%)</label>
            <input name="commissionPct" type="number" min={0} max={100} step="0.01" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Descrição</label>
            <textarea name="description" required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Características (1 por linha)</label>
            <textarea name="features" placeholder="Piscina\nÁrea gourmet\nCondomínio" />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <button className="button button-primary" type="submit">Criar imóvel</button>
          </div>
        </form>
      </article>

      {status.type !== "idle" ? (
        <p style={{ margin: 0, color: status.type === "success" ? "#9fe9ba" : "#ffb3ad" }}>{status.message}</p>
      ) : null}
    </div>
  );
}
