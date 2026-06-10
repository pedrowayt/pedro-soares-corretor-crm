"use client";

import { useMemo, useState } from "react";
import { Ban, CheckCircle2, Copy, Plus, RotateCcw, Save } from "lucide-react";

export type AuctionImportSourceSettingsItem = {
  id: string;
  name: string;
  sourceKey: string;
  tokenPreview: string | null;
  active: boolean;
  allowedDomains: string[];
  notes: string | null;
  lastImportAt: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
  counts: {
    total: number;
    needsReview: number;
    ready: number;
    published: number;
    error: number;
  };
};

type EditableSource = {
  name: string;
  sourceKey: string;
  active: boolean;
  allowedDomainsText: string;
  notes: string;
};

type TokenNotice = {
  sourceName: string;
  sourceKey: string;
  token: string;
};

type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  error?: {
    message?: string;
    details?: unknown;
  };
};

function slugifySourceKey(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function domainsToText(domains: string[]) {
  return domains.join("\n");
}

function textToDomains(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function makeEditable(source: AuctionImportSourceSettingsItem): EditableSource {
  return {
    name: source.name,
    sourceKey: source.sourceKey,
    active: source.active,
    allowedDomainsText: domainsToText(source.allowedDomains),
    notes: source.notes ?? ""
  };
}

function formatDate(value: string | null) {
  if (!value) return "Nunca";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Nunca";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

async function parseJson<T>(response: Response) {
  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error?.message ?? "Falha na operação.");
  }
  return payload.data as T;
}

function toItem(source: Omit<AuctionImportSourceSettingsItem, "counts"> & Partial<Pick<AuctionImportSourceSettingsItem, "counts">>) {
  return {
    ...source,
    lastImportAt: source.lastImportAt ? new Date(source.lastImportAt).toISOString() : null,
    createdAt: source.createdAt ? new Date(source.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: source.updatedAt ? new Date(source.updatedAt).toISOString() : new Date().toISOString(),
    counts: source.counts ?? {
      total: 0,
      needsReview: 0,
      ready: 0,
      published: 0,
      error: 0
    }
  };
}

export function AuctionImportSourcesSettings({
  initialSources,
  importEndpoint
}: {
  initialSources: AuctionImportSourceSettingsItem[];
  importEndpoint: string;
}) {
  const [sources, setSources] = useState(initialSources);
  const [drafts, setDrafts] = useState<Record<string, EditableSource>>(() =>
    Object.fromEntries(initialSources.map((source) => [source.id, makeEditable(source)]))
  );
  const [createForm, setCreateForm] = useState<EditableSource>({
    name: "",
    sourceKey: "",
    active: true,
    allowedDomainsText: "",
    notes: ""
  });
  const [sourceKeyTouched, setSourceKeyTouched] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [tokenNotice, setTokenNotice] = useState<TokenNotice | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const curlSnippet = useMemo(() => {
    if (!tokenNotice) return "";
    return `curl -X POST ${importEndpoint} \\
  -H "Authorization: Bearer ${tokenNotice.token}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source": "${tokenNotice.sourceKey}",
    "externalId": "LOTE-12345",
    "originalUrl": "https://site-do-leilao.com/lote/12345"
  }'`;
  }, [importEndpoint, tokenNotice]);

  function patchCreate(partial: Partial<EditableSource>) {
    setFeedback(null);
    setCreateForm((current) => {
      const next = { ...current, ...partial };
      if (partial.name !== undefined && !sourceKeyTouched) {
        next.sourceKey = slugifySourceKey(partial.name);
      }
      if (partial.sourceKey !== undefined) {
        next.sourceKey = slugifySourceKey(partial.sourceKey);
      }
      return next;
    });
  }

  function patchDraft(id: string, partial: Partial<EditableSource>) {
    setFeedback(null);
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...partial,
        ...(partial.sourceKey !== undefined ? { sourceKey: slugifySourceKey(partial.sourceKey) } : {})
      }
    }));
  }

  async function createSource() {
    setCreating(true);
    setFeedback(null);
    setTokenNotice(null);
    try {
      const data = await fetch("/api/crm/auction-import-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          sourceKey: createForm.sourceKey,
          active: createForm.active,
          allowedDomains: textToDomains(createForm.allowedDomainsText),
          notes: createForm.notes
        })
      }).then((response) =>
        parseJson<{
          source: Omit<AuctionImportSourceSettingsItem, "counts">;
          token: string;
        }>(response)
      );

      const item = toItem(data.source);
      setSources((current) => [item, ...current]);
      setDrafts((current) => ({ ...current, [item.id]: makeEditable(item) }));
      setCreateForm({ name: "", sourceKey: "", active: true, allowedDomainsText: "", notes: "" });
      setSourceKeyTouched(false);
      setTokenNotice({ sourceName: item.name, sourceKey: item.sourceKey, token: data.token });
      setFeedback({ tone: "success", message: "Fonte criada." });
    } catch (error) {
      setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Erro ao criar fonte." });
    } finally {
      setCreating(false);
    }
  }

  async function saveSource(source: AuctionImportSourceSettingsItem) {
    const draft = drafts[source.id];
    setPendingId(source.id);
    setFeedback(null);
    try {
      const data = await fetch(`/api/crm/auction-import-sources/${source.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          sourceKey: draft.sourceKey,
          active: draft.active,
          allowedDomains: textToDomains(draft.allowedDomainsText),
          notes: draft.notes
        })
      }).then((response) =>
        parseJson<{
          source: Omit<AuctionImportSourceSettingsItem, "counts">;
        }>(response)
      );

      const nextItem = toItem({ ...data.source, counts: source.counts });
      setSources((current) => current.map((item) => (item.id === source.id ? nextItem : item)));
      setDrafts((current) => ({ ...current, [source.id]: makeEditable(nextItem) }));
      setFeedback({ tone: "success", message: "Fonte atualizada." });
    } catch (error) {
      setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Erro ao salvar fonte." });
    } finally {
      setPendingId(null);
    }
  }

  async function rotateToken(source: AuctionImportSourceSettingsItem) {
    if (!window.confirm(`Gerar novo token para "${source.name}"? O token anterior deixará de funcionar.`)) return;
    setPendingId(source.id);
    setFeedback(null);
    setTokenNotice(null);
    try {
      const data = await fetch(`/api/crm/auction-import-sources/${source.id}/rotate-token`, {
        method: "POST"
      }).then((response) =>
        parseJson<{
          source: Omit<AuctionImportSourceSettingsItem, "counts">;
          token: string;
        }>(response)
      );

      const nextItem = toItem({ ...data.source, counts: source.counts });
      setSources((current) => current.map((item) => (item.id === source.id ? nextItem : item)));
      setDrafts((current) => ({ ...current, [source.id]: makeEditable(nextItem) }));
      setTokenNotice({ sourceName: nextItem.name, sourceKey: nextItem.sourceKey, token: data.token });
      setFeedback({ tone: "success", message: "Novo token gerado." });
    } catch (error) {
      setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Erro ao gerar token." });
    } finally {
      setPendingId(null);
    }
  }

  async function revokeToken(source: AuctionImportSourceSettingsItem) {
    if (!window.confirm(`Revogar token de "${source.name}"? A fonte será desativada.`)) return;
    setPendingId(source.id);
    setFeedback(null);
    setTokenNotice(null);
    try {
      const data = await fetch(`/api/crm/auction-import-sources/${source.id}/revoke-token`, {
        method: "POST"
      }).then((response) =>
        parseJson<{
          source: Omit<AuctionImportSourceSettingsItem, "counts">;
        }>(response)
      );

      const nextItem = toItem({ ...data.source, counts: source.counts });
      setSources((current) => current.map((item) => (item.id === source.id ? nextItem : item)));
      setDrafts((current) => ({ ...current, [source.id]: makeEditable(nextItem) }));
      setFeedback({ tone: "success", message: "Token revogado." });
    } catch (error) {
      setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Erro ao revogar token." });
    } finally {
      setPendingId(null);
    }
  }

  async function copyToken() {
    if (!tokenNotice) return;
    await navigator.clipboard.writeText(tokenNotice.token).catch(() => null);
    setFeedback({ tone: "success", message: "Token copiado." });
  }

  return (
    <section className="crm-settings-integrations" aria-labelledby="auction-sources-heading">
      <header>
        <h2 id="auction-sources-heading">Integrações de leilão</h2>
        <p>Fontes autorizadas para enviar imóveis para o CRM.</p>
      </header>

      <article className="card crm-settings-integration-card" style={{ marginBottom: 16 }}>
        <h3>Endpoint de recebimento</h3>
        <p style={{ wordBreak: "break-all" }}>{importEndpoint}</p>
        <span className="badge">POST · Authorization Bearer</span>
      </article>

      {feedback ? (
        <p
          className={`wiz-alert ${feedback.tone === "success" ? "wiz-alert--success" : "wiz-alert--error"}`}
          role="status"
        >
          {feedback.message}
        </p>
      ) : null}

      {tokenNotice ? (
        <article className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ marginTop: 0 }}>Token gerado para {tokenNotice.sourceName}</h3>
              <p className="section-subtitle" style={{ marginTop: 0 }}>
                Este token aparece apenas agora.
              </p>
            </div>
            <button type="button" className="button button-ghost" onClick={copyToken}>
              <Copy size={16} strokeWidth={1.8} aria-hidden="true" />
              Copiar token
            </button>
          </div>
          <pre style={{ whiteSpace: "pre-wrap", overflow: "auto" }}>{tokenNotice.token}</pre>
          <pre style={{ whiteSpace: "pre-wrap", overflow: "auto" }}>{curlSnippet}</pre>
        </article>
      ) : null}

      <article className="card" style={{ padding: 16, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Nova fonte</h3>
        <div className="form-grid">
          <div>
            <label>Nome</label>
            <input
              value={createForm.name}
              onChange={(event) => patchCreate({ name: event.target.value })}
              placeholder="Lance Judicial"
            />
          </div>
          <div>
            <label>Source key</label>
            <input
              value={createForm.sourceKey}
              onChange={(event) => {
                setSourceKeyTouched(true);
                patchCreate({ sourceKey: event.target.value });
              }}
              placeholder="lance-judicial"
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Domínios permitidos</label>
            <textarea
              rows={2}
              value={createForm.allowedDomainsText}
              onChange={(event) => patchCreate({ allowedDomainsText: event.target.value })}
              placeholder="lancejudicial.com.br"
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Observações internas</label>
            <textarea
              rows={2}
              value={createForm.notes}
              onChange={(event) => patchCreate({ notes: event.target.value })}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, margin: 0 }}>
            <input
              type="checkbox"
              checked={createForm.active}
              onChange={(event) => patchCreate({ active: event.target.checked })}
            />
            Ativa
          </label>
          <button
            type="button"
            className="button button-primary"
            onClick={createSource}
            disabled={creating || !createForm.name.trim() || !createForm.sourceKey.trim()}
          >
            <Plus size={16} strokeWidth={1.8} aria-hidden="true" />
            {creating ? "Criando..." : "Criar fonte"}
          </button>
        </div>
      </article>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14
        }}
      >
        {sources.map((source) => {
          const draft = drafts[source.id] ?? makeEditable(source);
          const busy = pendingId === source.id;
          return (
            <article key={source.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{source.name}</h3>
                  <p className="section-subtitle" style={{ marginTop: 4 }}>{source.sourceKey}</p>
                </div>
                <span className={`badge ${source.active ? "is-success" : ""}`}>
                  {source.active ? "Ativa" : "Inativa"}
                </span>
              </div>

              <div className="form-grid" style={{ marginTop: 12 }}>
                <div>
                  <label>Nome</label>
                  <input value={draft.name} onChange={(event) => patchDraft(source.id, { name: event.target.value })} />
                </div>
                <div>
                  <label>Source key</label>
                  <input
                    value={draft.sourceKey}
                    onChange={(event) => patchDraft(source.id, { sourceKey: event.target.value })}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Domínios permitidos</label>
                  <textarea
                    rows={2}
                    value={draft.allowedDomainsText}
                    onChange={(event) => patchDraft(source.id, { allowedDomainsText: event.target.value })}
                  />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label>Observações</label>
                  <textarea
                    rows={2}
                    value={draft.notes}
                    onChange={(event) => patchDraft(source.id, { notes: event.target.value })}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 8,
                  marginTop: 12
                }}
              >
                <div className="crm-settings-integration-card" style={{ padding: 0 }}>
                  <p style={{ margin: 0 }}>Importados</p>
                  <strong>{source.counts.total}</strong>
                </div>
                <div className="crm-settings-integration-card" style={{ padding: 0 }}>
                  <p style={{ margin: 0 }}>Publicados</p>
                  <strong>{source.counts.published}</strong>
                </div>
                <div className="crm-settings-integration-card" style={{ padding: 0 }}>
                  <p style={{ margin: 0 }}>Pendentes</p>
                  <strong>{source.counts.needsReview}</strong>
                </div>
                <div className="crm-settings-integration-card" style={{ padding: 0 }}>
                  <p style={{ margin: 0 }}>Prontos</p>
                  <strong>{source.counts.ready}</strong>
                </div>
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                <span className="crm-property-meta">
                  Token: {source.tokenPreview ?? "revogado"}
                </span>
                <span className="crm-property-meta">
                  Última importação: {formatDate(source.lastImportAt)}
                </span>
                {source.lastError ? (
                  <span className="crm-property-meta" style={{ color: "#b91c1c" }}>
                    Último erro: {source.lastError}
                  </span>
                ) : null}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 6, margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(event) => patchDraft(source.id, { active: event.target.checked })}
                  />
                  Ativa
                </label>
                <button type="button" className="button button-primary" onClick={() => saveSource(source)} disabled={busy}>
                  <Save size={16} strokeWidth={1.8} aria-hidden="true" />
                  {busy ? "Salvando..." : "Salvar"}
                </button>
                <button type="button" className="button button-ghost" onClick={() => rotateToken(source)} disabled={busy}>
                  <RotateCcw size={16} strokeWidth={1.8} aria-hidden="true" />
                  Token
                </button>
                <button type="button" className="button button-ghost" onClick={() => revokeToken(source)} disabled={busy}>
                  <Ban size={16} strokeWidth={1.8} aria-hidden="true" />
                  Revogar
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {!sources.length ? (
        <article className="card" style={{ padding: 16 }}>
          <CheckCircle2 size={18} strokeWidth={1.8} aria-hidden="true" />
          <p style={{ marginBottom: 0 }}>Nenhuma fonte cadastrada ainda.</p>
        </article>
      ) : null}
    </section>
  );
}
