"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatCurrencyBRL } from "@/lib/utils";

export type OwnerPropertyItem = {
  id: string;
  title: string;
  slug: string;
  purpose: string;
  status: string;
  price: number;
  city: string;
  district: string;
  updatedAt: string;
};

export type OwnerListItem = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  properties: OwnerPropertyItem[];
  leadsCount: number;
};

type OwnerFormState = ReturnType<typeof toFormState>;
type SaveStatus = "idle" | "saving" | "success" | "error";

const emptyState: OwnerFormState = {
  name: "",
  phone: "",
  email: "",
  city: "",
  district: "",
  address: "",
  notes: ""
};

const PURPOSE_LABELS: Record<string, string> = {
  VENDA: "Venda",
  LOCACAO: "Locação",
  INVESTIMENTO: "Investimento",
  LEILAO: "Leilão",
  LANCAMENTO: "Lançamento"
};

const STATUS_LABELS: Record<string, string> = {
  DISPONIVEL: "Disponível",
  RESERVADO: "Reservado",
  VENDIDO: "Vendido",
  ALUGADO: "Alugado",
  EM_ANALISE: "Em análise"
};

async function requestJson(url: string, method: "POST" | "PATCH" | "DELETE", payload?: unknown) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: payload ? JSON.stringify(payload) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && typeof window !== "undefined") {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.assign(`/admin/login?next=${next}`);
    throw new Error("Sessão expirada. Redirecionando para o login...");
  }
  if (!response.ok || !data.success) {
    throw new Error(data?.error?.message ?? "Falha na operação.");
  }

  return data;
}

function toFormState(owner?: OwnerListItem | null) {
  return {
    name: owner?.name ?? "",
    phone: owner?.phone ?? "",
    email: owner?.email ?? "",
    city: owner?.city ?? "",
    district: owner?.district ?? "",
    address: owner?.address ?? "",
    notes: owner?.notes ?? ""
  };
}

function ownerSearchText(owner: OwnerListItem) {
  return [
    owner.name,
    owner.phone,
    owner.email,
    owner.city,
    owner.district,
    owner.address,
    ...owner.properties.map((property) => property.title)
  ]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

function normalizePayload(form: OwnerFormState) {
  return {
    name: form.name,
    phone: form.phone,
    email: form.email || null,
    city: form.city || null,
    district: form.district || null,
    address: form.address || null,
    notes: form.notes || null
  };
}

export function OwnerManager({ owners }: { owners: OwnerListItem[] }) {
  const [items, setItems] = useState(owners);
  const [selectedId, setSelectedId] = useState(owners[0]?.id ?? "");
  const [mode, setMode] = useState<"create" | "edit">(owners[0] ? "edit" : "create");
  const [form, setForm] = useState(() => (owners[0] ? toFormState(owners[0]) : emptyState));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [query, setQuery] = useState("");

  const selectedOwner = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId]
  );

  const filteredOwners = useMemo(() => {
    const normalizedQuery = query
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    if (!normalizedQuery) return items;
    return items.filter((owner) => ownerSearchText(owner).includes(normalizedQuery));
  }, [items, query]);

  const totalProperties = items.reduce((sum, owner) => sum + owner.properties.length, 0);
  const ownersWithNotes = items.filter((owner) => owner.notes).length;

  function handleSelect(owner: OwnerListItem) {
    setSelectedId(owner.id);
    setMode("edit");
    setForm(toFormState(owner));
    setStatus("idle");
    setStatusMessage("");
  }

  function switchToCreate() {
    setSelectedId("");
    setMode("create");
    setForm(emptyState);
    setStatus("idle");
    setStatusMessage("");
  }

  async function saveOwner(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setStatusMessage("");

    try {
      if (mode === "create") {
        const data = await requestJson("/api/crm/owners", "POST", normalizePayload(form));
        const created = serializeOwnerResponse(data.data.owner);
        setItems((prev) => [created, ...prev]);
        setSelectedId(created.id);
        setMode("edit");
        setForm(toFormState(created));
        setStatusMessage("Proprietário criado.");
      } else if (selectedId) {
        const data = await requestJson(`/api/crm/owners/${selectedId}`, "PATCH", normalizePayload(form));
        const updated = serializeOwnerResponse(data.data.owner);
        setItems((prev) => prev.map((owner) => (owner.id === updated.id ? updated : owner)));
        setForm(toFormState(updated));
        setStatusMessage("Proprietário atualizado.");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Erro ao salvar proprietário.");
    }
  }

  async function deleteOwner(owner: OwnerListItem) {
    const hasLinks = owner.properties.length > 0 || owner.leadsCount > 0;
    const linkedText = [
      owner.properties.length ? `${owner.properties.length} ${owner.properties.length === 1 ? "imóvel" : "imóveis"}` : null,
      owner.leadsCount ? `${owner.leadsCount} lead${owner.leadsCount === 1 ? "" : "s"}` : null
    ]
      .filter(Boolean)
      .join(" e ");

    const message = hasLinks
      ? `Excluir definitivamente o proprietário "${owner.name}"? Os vínculos serão removidos de: ${linkedText}. Esta ação não pode ser desfeita.`
      : `Excluir definitivamente o proprietário "${owner.name}"? Esta ação não pode ser desfeita.`;

    if (!window.confirm(message)) return;

    setStatus("saving");
    setStatusMessage("");

    try {
      await requestJson(`/api/crm/owners/${owner.id}`, "DELETE");
      setItems((prev) => prev.filter((item) => item.id !== owner.id));
      if (selectedId === owner.id) switchToCreate();
      setStatus("success");
      setStatusMessage("Proprietário excluído.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Erro ao excluir proprietário.");
    }
  }

  return (
    <div className="crm-owners-page">
      <section className="crm-owners-metrics" aria-label="Resumo de proprietários">
        <div className="crm-owner-metric">
          <span>Proprietários</span>
          <strong>{items.length.toLocaleString("pt-BR")}</strong>
        </div>
        <div className="crm-owner-metric">
          <span>Imóveis vinculados</span>
          <strong>{totalProperties.toLocaleString("pt-BR")}</strong>
        </div>
        <div className="crm-owner-metric">
          <span>Com observações</span>
          <strong>{ownersWithNotes.toLocaleString("pt-BR")}</strong>
        </div>
      </section>

      <section className="card crm-owners-list">
        <header className="crm-owners-section-head">
          <div>
            <h2 className="title-luxury" style={{ margin: 0 }}>
              Base de proprietários
            </h2>
            <p className="text-card crm-owners-section-meta">
              {filteredOwners.length.toLocaleString("pt-BR")} de {items.length.toLocaleString("pt-BR")} registros
            </p>
          </div>
          <button type="button" className="button button-primary" onClick={switchToCreate}>
            Novo proprietário
          </button>
        </header>

        <div className="crm-owners-toolbar">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, telefone, região ou imóvel"
            aria-label="Buscar proprietários"
          />
        </div>

        <ul className="crm-owner-cards" aria-label="Proprietários cadastrados">
          {filteredOwners.length ? (
            filteredOwners.map((owner) => {
              const isSelected = owner.id === selectedId && mode === "edit";
              const propertiesCount = owner.properties.length;

              return (
                <li key={owner.id} className={`crm-owner-card${isSelected ? " is-selected" : ""}`}>
                  <div className="crm-owner-card__main">
                    <header className="crm-owner-card__head">
                      <strong>{owner.name}</strong>
                      <span>
                        {propertiesCount} {propertiesCount === 1 ? "imóvel" : "imóveis"}
                      </span>
                    </header>
                    <dl className="crm-owner-card__details">
                      <div>
                        <dt>Telefone</dt>
                        <dd>{owner.phone}</dd>
                      </div>
                      <div>
                        <dt>E-mail</dt>
                        <dd>{owner.email ?? "-"}</dd>
                      </div>
                      <div>
                        <dt>Região</dt>
                        <dd>
                          {owner.city ?? "-"}
                          {owner.district ? ` · ${owner.district}` : ""}
                        </dd>
                      </div>
                      <div>
                        <dt>Atualizado</dt>
                        <dd>{formatDate(owner.updatedAt)}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="crm-owner-card__actions">
                    <button
                      type="button"
                      className="button button-ghost"
                      onClick={() => handleSelect(owner)}
                    >
                      {isSelected ? "Editando" : "Editar"}
                    </button>
                    <button
                      type="button"
                      className="button button-ghost crm-owner-card__delete"
                      onClick={() => deleteOwner(owner)}
                      disabled={status === "saving"}
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="crm-owners-empty">Nenhum proprietário encontrado.</li>
          )}
        </ul>
      </section>

      <section className="card crm-owner-editor">
        <header className="crm-owners-section-head">
          <div>
            <h2 className="title-luxury" style={{ margin: 0 }}>
              {mode === "create" ? "Novo proprietário" : `Editar ${selectedOwner?.name ?? "proprietário"}`}
            </h2>
            <p className="text-card crm-owners-section-meta">
              Dados internos de contato, localização, observações e vínculo com imóveis.
            </p>
          </div>
        </header>

        <form onSubmit={saveOwner} className="crm-owner-form">
          <fieldset className="crm-owner-fieldset">
            <legend>Contato</legend>
            <div className="form-grid">
              <div>
                <label>Nome</label>
                <input
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
              </div>
              <div>
                <label>WhatsApp / telefone</label>
                <input
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  required
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="crm-owner-fieldset">
            <legend>Localização</legend>
            <div className="form-grid">
              <div>
                <label>Cidade</label>
                <input
                  value={form.city}
                  onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                />
              </div>
              <div>
                <label>Bairro / região</label>
                <input
                  value={form.district}
                  onChange={(event) => setForm((prev) => ({ ...prev, district: event.target.value }))}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Endereço</label>
                <input
                  value={form.address}
                  onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="crm-owner-fieldset">
            <legend>Informações internas</legend>
            <label>Observações</label>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Documentos, preferências, status da captação, restrições ou próximos passos"
              rows={6}
            />
          </fieldset>

          <div className="crm-owner-form__actions">
            <button type="submit" className="button button-primary" disabled={status === "saving"}>
              {status === "saving" ? "Salvando..." : mode === "create" ? "Criar proprietário" : "Salvar alterações"}
            </button>
            {mode === "edit" && selectedOwner ? (
              <button
                type="button"
                className="button button-ghost crm-owner-card__delete"
                onClick={() => deleteOwner(selectedOwner)}
                disabled={status === "saving"}
              >
                Excluir
              </button>
            ) : null}
          </div>
        </form>

        {statusMessage ? (
          <p
            className="crm-owner-feedback"
            data-tone={status === "error" ? "error" : status === "success" ? "success" : "muted"}
          >
            {statusMessage}
          </p>
        ) : null}

        {mode === "edit" && selectedOwner ? (
          <div className="crm-owner-linked">
            <header className="crm-owner-linked__head">
              <h3 className="title-luxury" style={{ margin: 0 }}>
                Imóveis vinculados
              </h3>
              <span>
                {selectedOwner.properties.length} {selectedOwner.properties.length === 1 ? "imóvel" : "imóveis"}
              </span>
            </header>

            {selectedOwner.properties.length ? (
              <ul className="crm-owner-property-list">
                {selectedOwner.properties.map((property) => (
                  <li key={property.id} className="crm-owner-property">
                    <div>
                      <strong>{property.title}</strong>
                      <span>
                        {property.city} · {property.district} · {PURPOSE_LABELS[property.purpose] ?? property.purpose} ·{" "}
                        {STATUS_LABELS[property.status] ?? property.status}
                      </span>
                    </div>
                    <div className="crm-owner-property__side">
                      <strong>{formatCurrencyBRL(property.price)}</strong>
                      <Link className="button button-ghost" href={`/crm/imoveis/${property.id}`}>
                        Abrir imóvel
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="crm-owners-empty">
                Nenhum imóvel vinculado a este proprietário.
              </p>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}

function serializeOwnerResponse(rawOwner: OwnerListItem & { leads?: Array<{ id: string }> }) {
  return {
    ...rawOwner,
    createdAt: String(rawOwner.createdAt),
    updatedAt: String(rawOwner.updatedAt),
    leadsCount: rawOwner.leadsCount ?? rawOwner.leads?.length ?? 0,
    properties: rawOwner.properties.map((property) => ({
      ...property,
      price: Number(property.price),
      updatedAt: String(property.updatedAt)
    }))
  };
}
