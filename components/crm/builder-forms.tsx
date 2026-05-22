"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type BuilderItem = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  website: string | null;
  instagram: string | null;
  deliveredDevelopmentsCount: number | null;
  deliveredUnitsCount: number | null;
  activeProjectsCount: number | null;
  archivedAt: Date | null;
};

type SaveStatus = "idle" | "saving" | "success" | "error";

async function requestJson(url: string, method: "POST" | "PATCH", payload?: unknown) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: payload ? JSON.stringify(payload) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data?.error?.message ?? "Falha na operação.");
  }

  return data;
}

function toFormState(builder?: BuilderItem | null) {
  return {
    name: builder?.name ?? "",
    slug: builder?.slug ?? "",
    city: builder?.city ?? "",
    state: builder?.state ?? "",
    website: builder?.website ?? "",
    instagram: builder?.instagram ?? "",
    deliveredDevelopmentsCount: builder?.deliveredDevelopmentsCount?.toString() ?? "",
    deliveredUnitsCount: builder?.deliveredUnitsCount?.toString() ?? "",
    activeProjectsCount: builder?.activeProjectsCount?.toString() ?? "",
    description: "",
    institutionalText: "",
    logoUrl: ""
  };
}

export function BuilderForms({ builders }: { builders: BuilderItem[] }) {
  const [items, setItems] = useState(builders);
  const [selectedId, setSelectedId] = useState<string>(builders[0]?.id ?? "");
  const [mode, setMode] = useState<"create" | "edit">("create");
  const selectedBuilder = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);
  const [form, setForm] = useState(() => toFormState(null));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  function handleSelect(id: string) {
    setSelectedId(id);
    setMode("edit");
    const found = items.find((item) => item.id === id) ?? null;
    setForm(toFormState(found));
  }

  function switchToCreate() {
    setMode("create");
    setSelectedId("");
    setForm(toFormState(null));
    setStatus("idle");
    setStatusMessage("");
  }

  async function saveBuilder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setStatusMessage("");

    const payload = {
      name: form.name,
      slug: form.slug,
      city: form.city,
      state: form.state,
      website: form.website,
      instagram: form.instagram,
      description: form.description,
      institutionalText: form.institutionalText,
      logoUrl: form.logoUrl,
      deliveredDevelopmentsCount: form.deliveredDevelopmentsCount ? Number(form.deliveredDevelopmentsCount) : undefined,
      deliveredUnitsCount: form.deliveredUnitsCount ? Number(form.deliveredUnitsCount) : undefined,
      activeProjectsCount: form.activeProjectsCount ? Number(form.activeProjectsCount) : undefined
    };

    try {
      if (mode === "create") {
        const data = await requestJson("/api/crm/builders", "POST", payload);
        const created = data.data.builder as BuilderItem;
        setItems((prev) => [created, ...prev]);
        setSelectedId(created.id);
        setMode("edit");
        setStatusMessage("Construtora criada.");
      } else if (selectedId) {
        const data = await requestJson(`/api/crm/builders/${selectedId}`, "PATCH", payload);
        const updated = data.data.builder as BuilderItem;
        setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setStatusMessage("Construtora atualizada.");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Erro ao salvar.");
    }
  }

  async function archiveSelected() {
    if (!selectedId) return;
    if (!window.confirm("Arquivar esta construtora?")) return;

    setStatus("saving");
    try {
      await requestJson(`/api/crm/builders/${selectedId}/archive`, "PATCH");
      setItems((prev) => prev.map((item) => (item.id === selectedId ? { ...item, archivedAt: new Date() } : item)));
      setStatus("success");
      setStatusMessage("Construtora arquivada.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Erro ao arquivar.");
    }
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <article className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <h2 className="title-luxury" style={{ margin: 0 }}>
            Construtoras cadastradas
          </h2>
          <button type="button" className="button button-primary" onClick={switchToCreate}>
            Nova construtora
          </button>
        </div>

        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Cidade</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={tdStyle}>{item.name}</td>
                  <td style={tdStyle}>{item.city ?? "-"}</td>
                  <td style={tdStyle}>{item.archivedAt ? "Arquivada" : "Ativa"}</td>
                  <td style={tdStyle}>
                    <button
                      type="button"
                      className="button button-ghost"
                      style={{ padding: "0.45rem 0.72rem" }}
                      onClick={() => handleSelect(item.id)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="card" style={{ padding: 16 }}>
        <h3 className="title-luxury" style={{ marginTop: 0 }}>
          {mode === "create" ? "Nova construtora" : `Editar construtora${selectedBuilder ? ` • ${selectedBuilder.name}` : ""}`}
        </h3>

        <form className="form-grid" onSubmit={saveBuilder}>
          <div>
            <label>Nome</label>
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required />
          </div>
          <div>
            <label>Slug</label>
            <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} required />
          </div>
          <div>
            <label>Cidade</label>
            <input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} />
          </div>
          <div>
            <label>Estado</label>
            <input value={form.state} onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))} />
          </div>
          <div>
            <label>Logo (URL)</label>
            <input value={form.logoUrl} onChange={(event) => setForm((prev) => ({ ...prev, logoUrl: event.target.value }))} />
          </div>
          <div>
            <label>Website</label>
            <input value={form.website} onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))} />
          </div>
          <div>
            <label>Instagram</label>
            <input value={form.instagram} onChange={(event) => setForm((prev) => ({ ...prev, instagram: event.target.value }))} />
          </div>
          <div>
            <label>Empreendimentos entregues</label>
            <input
              type="number"
              min={0}
              value={form.deliveredDevelopmentsCount}
              onChange={(event) => setForm((prev) => ({ ...prev, deliveredDevelopmentsCount: event.target.value }))}
            />
          </div>
          <div>
            <label>Unidades entregues</label>
            <input
              type="number"
              min={0}
              value={form.deliveredUnitsCount}
              onChange={(event) => setForm((prev) => ({ ...prev, deliveredUnitsCount: event.target.value }))}
            />
          </div>
          <div>
            <label>Obras ativas</label>
            <input
              type="number"
              min={0}
              value={form.activeProjectsCount}
              onChange={(event) => setForm((prev) => ({ ...prev, activeProjectsCount: event.target.value }))}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Descrição</label>
            <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Texto institucional</label>
            <textarea
              value={form.institutionalText}
              onChange={(event) => setForm((prev) => ({ ...prev, institutionalText: event.target.value }))}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", gridColumn: "1 / -1" }}>
            <button type="submit" className="button button-primary" disabled={status === "saving"}>
              {status === "saving" ? "Salvando..." : mode === "create" ? "Criar construtora" : "Salvar alterações"}
            </button>
            {mode === "edit" && selectedId ? (
              <button type="button" className="button button-ghost" onClick={archiveSelected}>
                Arquivar
              </button>
            ) : null}
          </div>
        </form>

        {statusMessage ? (
          <p
            style={{
              marginBottom: 0,
              color: status === "error" ? "#c92a2a" : status === "success" ? "#0a7a56" : "var(--text-muted)"
            }}
          >
            {statusMessage}
          </p>
        ) : null}
      </article>
    </div>
  );
}

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid rgba(15,34,61,.1)",
  color: "var(--text-muted)",
  fontSize: "var(--fs-12)"
};

const tdStyle: CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(15,34,61,.08)",
  fontSize: "var(--fs-14)"
};
