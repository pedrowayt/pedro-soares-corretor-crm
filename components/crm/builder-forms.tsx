"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { LogoCropper } from "./logo-cropper";

type BuilderItem = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  city: string | null;
  state: string | null;
  foundedYear: number | null;
  website: string | null;
  instagram: string | null;
  deliveredDevelopmentsCount: number | null;
  deliveredUnitsCount: number | null;
  activeProjectsCount: number | null;
  institutionalText: string | null;
  archivedAt: Date | null;
};

type SaveStatus = "idle" | "saving" | "success" | "error";
type ScrapeStatus = "idle" | "loading" | "success" | "error";
type LogoUploadStatus = "idle" | "preparing" | "uploading" | "error";

const MAX_LOGO_BYTES = 8 * 1024 * 1024;
const ACCEPTED_LOGO_MIME = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

type BuilderFormState = ReturnType<typeof toFormState>;

type BuilderScrapeFields = Partial<Record<keyof BuilderFormState, string | number | null>>;

type LogoCandidate = {
  url: string;
  label: string;
  source: string;
  score: number;
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
  if (!response.ok || !data.success) {
    throw new Error(data?.error?.message ?? "Falha na operação.");
  }

  return data;
}

function toFormState(builder?: BuilderItem | null) {
  return {
    name: builder?.name ?? "",
    slug: builder?.slug ?? "",
    logoUrl: builder?.logoUrl ?? "",
    description: builder?.description ?? "",
    city: builder?.city ?? "",
    state: builder?.state ?? "",
    foundedYear: builder?.foundedYear?.toString() ?? "",
    website: builder?.website ?? "",
    instagram: builder?.instagram ?? "",
    deliveredDevelopmentsCount: builder?.deliveredDevelopmentsCount?.toString() ?? "",
    deliveredUnitsCount: builder?.deliveredUnitsCount?.toString() ?? "",
    activeProjectsCount: builder?.activeProjectsCount?.toString() ?? "",
    institutionalText: builder?.institutionalText ?? ""
  };
}

function optionalNumber(value: string) {
  return value.trim() ? Number(value) : null;
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function BuilderForms({ builders }: { builders: BuilderItem[] }) {
  const [items, setItems] = useState(builders);
  const [selectedId, setSelectedId] = useState<string>(builders[0]?.id ?? "");
  const [mode, setMode] = useState<"create" | "edit">("create");
  const selectedBuilder = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);
  const [form, setForm] = useState(() => toFormState(null));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeStatus, setScrapeStatus] = useState<ScrapeStatus>("idle");
  const [scrapeMessage, setScrapeMessage] = useState("");
  const [logoCandidates, setLogoCandidates] = useState<LogoCandidate[]>([]);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [logoUploadStatus, setLogoUploadStatus] = useState<LogoUploadStatus>("idle");
  const [logoUploadMessage, setLogoUploadMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleSelect(id: string) {
    setSelectedId(id);
    setMode("edit");
    const found = items.find((item) => item.id === id) ?? null;
    setForm(toFormState(found));
    setScrapeStatus("idle");
    setScrapeMessage("");
    setLogoCandidates([]);
  }

  function switchToCreate() {
    setMode("create");
    setSelectedId("");
    setForm(toFormState(null));
    setStatus("idle");
    setStatusMessage("");
    setScrapeStatus("idle");
    setScrapeMessage("");
    setLogoCandidates([]);
  }

  function mergeScrapedFields(fields: BuilderScrapeFields) {
    setForm((prev) => {
      const next = { ...prev };
      const keys = Object.keys(next) as Array<keyof BuilderFormState>;

      for (const key of keys) {
        const value = fields[key];
        if (value === null || value === undefined) continue;

        const stringValue = String(value).trim();
        if (!stringValue) continue;
        next[key] = stringValue;
      }

      return next;
    });
  }

  async function scrapeBuilder() {
    const sourceUrl = scrapeUrl.trim();
    if (!sourceUrl) {
      setScrapeStatus("error");
      setScrapeMessage("Informe a URL da construtora.");
      return;
    }

    setScrapeStatus("loading");
    setScrapeMessage("Buscando dados da construtora...");
    setLogoCandidates([]);

    try {
      const data = await requestJson("/api/crm/builders/scrape", "POST", { sourceUrl });
      const scrapedBuilder = data.data.builder as BuilderScrapeFields;
      const scrapedLogoCandidates = Array.isArray(data.data.logoCandidates)
        ? (data.data.logoCandidates as LogoCandidate[])
        : [];

      mergeScrapedFields(scrapedBuilder);
      setLogoCandidates(scrapedLogoCandidates.filter((candidate) => candidate.url).slice(0, 6));
      setScrapeStatus("success");
      setScrapeMessage(
        scrapedBuilder.logoUrl
          ? "Dados preenchidos. Revise os campos e salve."
          : "Dados preenchidos. Nenhuma logo confiável foi aplicada automaticamente."
      );
    } catch (error) {
      setScrapeStatus("error");
      setScrapeMessage(error instanceof Error ? error.message : "Erro ao buscar dados da construtora.");
    }
  }

  async function saveBuilder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setStatusMessage("");

    const payload = {
      name: form.name,
      slug: form.slug,
      logoUrl: form.logoUrl,
      description: form.description,
      city: form.city,
      state: form.state,
      foundedYear: optionalNumber(form.foundedYear),
      website: form.website,
      instagram: form.instagram,
      institutionalText: form.institutionalText,
      deliveredDevelopmentsCount: optionalNumber(form.deliveredDevelopmentsCount),
      deliveredUnitsCount: optionalNumber(form.deliveredUnitsCount),
      activeProjectsCount: optionalNumber(form.activeProjectsCount)
    };

    try {
      if (mode === "create") {
        const data = await requestJson("/api/crm/builders", "POST", payload);
        const created = data.data.builder as BuilderItem;
        setItems((prev) => [created, ...prev]);
        setSelectedId(created.id);
        setMode("edit");
        setForm(toFormState(created));
        setStatusMessage("Construtora criada.");
      } else if (selectedId) {
        const data = await requestJson(`/api/crm/builders/${selectedId}`, "PATCH", payload);
        const updated = data.data.builder as BuilderItem;
        setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setForm(toFormState(updated));
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
    await archiveBuilder(selectedId);
  }

  async function archiveBuilder(id: string) {
    if (!window.confirm("Arquivar esta construtora?")) return;

    setStatus("saving");
    try {
      await requestJson(`/api/crm/builders/${id}/archive`, "PATCH");
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, archivedAt: new Date() } : item)));
      setStatus("success");
      setStatusMessage("Construtora arquivada.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Erro ao arquivar.");
    }
  }

  async function unarchiveBuilder(id: string) {
    setStatus("saving");
    try {
      await requestJson(`/api/crm/builders/${id}/unarchive`, "PATCH");
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, archivedAt: null } : item)));
      setStatus("success");
      setStatusMessage("Construtora desarquivada.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Erro ao desarquivar.");
    }
  }

  async function deleteBuilder(id: string, name: string) {
    if (!window.confirm(`Excluir definitivamente a construtora "${name}"? Esta ação não pode ser desfeita.`)) return;

    setStatus("saving");
    try {
      await requestJson(`/api/crm/builders/${id}`, "DELETE");
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedId === id) {
        switchToCreate();
      }
      setStatus("success");
      setStatusMessage("Construtora excluída.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Erro ao excluir.");
    }
  }

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_LOGO_MIME.includes(file.type)) {
      setLogoUploadStatus("error");
      setLogoUploadMessage("Formato não suportado. Use PNG, JPG, WEBP ou SVG.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_LOGO_BYTES) {
      setLogoUploadStatus("error");
      setLogoUploadMessage("Arquivo maior que 8MB. Comprima a imagem antes de enviar.");
      event.target.value = "";
      return;
    }

    try {
      setLogoUploadStatus("preparing");
      setLogoUploadMessage("");
      const dataUrl = await readFileAsDataUrl(file);
      setCropSource(dataUrl);
    } catch (error) {
      setLogoUploadStatus("error");
      setLogoUploadMessage(error instanceof Error ? error.message : "Erro ao ler o arquivo.");
    } finally {
      event.target.value = "";
    }
  }

  function openCropForUrl(rawUrl: string) {
    const url = rawUrl.trim();
    if (!url) return;
    setLogoUploadMessage("");
    setLogoUploadStatus("preparing");
    const proxied = url.startsWith("data:")
      ? url
      : `/api/media/images/proxy?url=${encodeURIComponent(url)}`;
    setCropSource(proxied);
  }

  async function handleCropConfirm(blob: Blob) {
    setCropSource(null);
    setLogoUploadStatus("uploading");
    setLogoUploadMessage("Enviando logo recortada...");

    try {
      const directUploadResponse = await fetch("/api/media/images/direct-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata: {
            module: "builder",
            builderId: selectedId || undefined,
            source: "logo-crop"
          }
        })
      });

      const directUploadData = await directUploadResponse.json().catch(() => ({}));
      if (!directUploadResponse.ok || !directUploadData.success) {
        throw new Error(directUploadData?.error?.message ?? "Falha ao gerar upload direto.");
      }

      const uploadUrl = directUploadData.data.directUpload.uploadURL as string;
      const imageDeliveryUrl = directUploadData.data.imageDeliveryUrl as string | null | undefined;
      const body = new FormData();
      body.append("file", blob, "logo.png");

      const uploadResponse = await fetch(uploadUrl, { method: "POST", body });
      const uploadPayload = await uploadResponse.json().catch(() => ({}));
      if (!uploadResponse.ok || !uploadPayload.success) {
        throw new Error(uploadPayload?.errors?.[0]?.message ?? "Falha no upload da imagem.");
      }

      const variants = uploadPayload?.result?.variants as string[] | undefined;
      const finalUrl = imageDeliveryUrl || variants?.[0];
      if (!finalUrl) {
        throw new Error("Upload concluído, mas a URL da imagem não foi retornada.");
      }

      setForm((prev) => ({ ...prev, logoUrl: finalUrl }));
      setLogoUploadStatus("idle");
      setLogoUploadMessage("Logo atualizada. Lembre-se de salvar.");
    } catch (error) {
      setLogoUploadStatus("error");
      setLogoUploadMessage(error instanceof Error ? error.message : "Erro ao enviar a logo.");
    }
  }

  const totalCount = items.length;
  const activeCount = items.filter((item) => !item.archivedAt).length;
  const archivedCount = totalCount - activeCount;

  return (
    <div className="crm-builders-page">
      <article className="card crm-builders-list">
        <header className="crm-builders-list-head">
          <div>
            <h2 className="title-luxury" style={{ margin: 0 }}>
              Construtoras cadastradas
            </h2>
            <p className="text-card crm-builders-list-meta">
              {totalCount} cadastrada{totalCount === 1 ? "" : "s"}
              {totalCount ? ` · ${activeCount} ativa${activeCount === 1 ? "" : "s"} · ${archivedCount} arquivada${archivedCount === 1 ? "" : "s"}` : ""}
            </p>
          </div>
          <button type="button" className="button button-primary" onClick={switchToCreate}>
            Nova construtora
          </button>
        </header>

        <div className="crm-builders-table-wrap">
          <table className="crm-builders-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cidade</th>
                <th>Status</th>
                <th aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((item) => {
                  const isSelected = item.id === selectedId && mode === "edit";
                  return (
                    <tr key={item.id} className={isSelected ? "is-selected" : undefined}>
                      <td>{item.name}</td>
                      <td>{item.city ?? "—"}</td>
                      <td>
                        <span
                          className={`crm-builder-status${item.archivedAt ? " is-archived" : ""}`}
                        >
                          {item.archivedAt ? "Arquivada" : "Ativa"}
                        </span>
                      </td>
                      <td>
                        <div className="crm-builders-row-actions">
                          <button
                            type="button"
                            className="button button-ghost"
                            onClick={() => handleSelect(item.id)}
                          >
                            {isSelected ? "Editando" : "Editar"}
                          </button>
                          {item.archivedAt ? (
                            <button
                              type="button"
                              className="button button-ghost"
                              onClick={() => unarchiveBuilder(item.id)}
                              disabled={status === "saving"}
                            >
                              Desarquivar
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="button button-ghost"
                              onClick={() => archiveBuilder(item.id)}
                              disabled={status === "saving"}
                            >
                              Arquivar
                            </button>
                          )}
                          <button
                            type="button"
                            className="button button-ghost crm-builders-row-delete"
                            onClick={() => deleteBuilder(item.id, item.name)}
                            disabled={status === "saving"}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="crm-builders-empty">
                    Nenhuma construtora cadastrada. Clique em <strong>Nova construtora</strong> para começar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      <article className="card crm-builders-scrape">
        <header className="crm-builders-section-head">
          <div>
            <h3 className="title-luxury" style={{ margin: 0 }}>
              Preencher por link
            </h3>
            <p className="text-card crm-builders-section-meta">
              Cole o site da construtora e a IA preenche os campos para você revisar.
            </p>
          </div>
        </header>

        <div className="crm-builders-scrape-row">
          <input
            value={scrapeUrl}
            onChange={(event) => {
              setScrapeUrl(event.target.value);
              if (scrapeStatus !== "loading") {
                setScrapeStatus("idle");
                setScrapeMessage("");
              }
            }}
            placeholder="https://site-da-construtora.com.br"
          />
          <div className="crm-builders-scrape-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={scrapeBuilder}
              disabled={scrapeStatus === "loading"}
            >
              {scrapeStatus === "loading" ? "Buscando..." : "Buscar dados"}
            </button>
            <button
              type="button"
              className="button button-ghost"
              onClick={() => {
                setScrapeUrl("");
                setScrapeStatus("idle");
                setScrapeMessage("");
                setLogoCandidates([]);
              }}
            >
              Limpar
            </button>
          </div>
        </div>

        {logoCandidates.length ? (
          <div className="crm-builders-logo-candidates">
            <strong className="text-card" style={{ fontSize: "var(--fs-12)" }}>
              Logos encontradas
            </strong>
            <div className="crm-builders-logo-grid">
              {logoCandidates.map((candidate) => (
                <div key={candidate.url} className="crm-builders-logo-option">
                  <Image
                    src={candidate.url}
                    alt={candidate.label || "Logo da construtora"}
                    width={180}
                    height={72}
                    unoptimized
                    style={{ maxWidth: "100%", maxHeight: 54, objectFit: "contain" }}
                  />
                  <span
                    className="text-card"
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "var(--fs-12)",
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {candidate.source}
                  </span>
                  <div className="crm-builders-logo-option-actions">
                    <button
                      type="button"
                      className="button button-ghost"
                      onClick={() => setForm((prev) => ({ ...prev, logoUrl: candidate.url }))}
                    >
                      Usar
                    </button>
                    <button
                      type="button"
                      className="button button-ghost"
                      onClick={() => openCropForUrl(candidate.url)}
                    >
                      Ajustar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {scrapeMessage ? (
          <p
            className="crm-builders-feedback"
            data-tone={scrapeStatus === "error" ? "error" : scrapeStatus === "success" ? "success" : "muted"}
          >
            {scrapeMessage}
          </p>
        ) : null}
      </article>

      <article className="card crm-builders-form-card">
        <header className="crm-builders-section-head">
          <div>
            <h3 className="title-luxury" style={{ margin: 0 }}>
              {mode === "create" ? "Nova construtora" : `Editar construtora${selectedBuilder ? ` • ${selectedBuilder.name}` : ""}`}
            </h3>
            <p className="text-card crm-builders-section-meta">
              {mode === "create"
                ? "Preencha os dados ou use o preenchimento por link acima."
                : "Atualize os campos e salve. O conteúdo aparece na página pública da construtora."}
            </p>
          </div>
        </header>

        <form onSubmit={saveBuilder} className="crm-builders-form">
          <fieldset className="crm-builders-fieldset">
            <legend>Identidade</legend>
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
                <label>Slug</label>
                <input
                  value={form.slug}
                  onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                  required
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>Logo (quadro 2:1)</label>
                <input
                  value={form.logoUrl}
                  onChange={(event) => setForm((prev) => ({ ...prev, logoUrl: event.target.value }))}
                  placeholder="URL da logo ou envie um arquivo abaixo"
                />
                <div className="crm-builders-logo-actions">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_LOGO_MIME.join(",")}
                    onChange={handleFileSelected}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={logoUploadStatus === "uploading" || logoUploadStatus === "preparing"}
                  >
                    {logoUploadStatus === "uploading" ? "Enviando..." : "Enviar arquivo"}
                  </button>
                  {isHttpUrl(form.logoUrl) ? (
                    <button
                      type="button"
                      className="button button-ghost"
                      onClick={() => openCropForUrl(form.logoUrl)}
                      disabled={logoUploadStatus === "uploading" || logoUploadStatus === "preparing"}
                    >
                      Ajustar / Recortar
                    </button>
                  ) : null}
                </div>
                {isHttpUrl(form.logoUrl) ? (
                  <div className="crm-builders-logo-preview">
                    <Image
                      src={form.logoUrl}
                      alt="Preview da logo"
                      width={260}
                      height={130}
                      unoptimized
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                ) : null}
                {logoUploadMessage ? (
                  <p
                    className="crm-builders-feedback"
                    data-tone={logoUploadStatus === "error" ? "error" : "muted"}
                  >
                    {logoUploadMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </fieldset>

          <fieldset className="crm-builders-fieldset">
            <legend>Localização &amp; fundação</legend>
            <div className="form-grid">
              <div>
                <label>Cidade</label>
                <input
                  value={form.city}
                  onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                />
              </div>
              <div>
                <label>Estado</label>
                <input
                  value={form.state}
                  onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
                />
              </div>
              <div>
                <label>Ano de fundação</label>
                <input
                  type="number"
                  min={1800}
                  max={2100}
                  value={form.foundedYear}
                  onChange={(event) => setForm((prev) => ({ ...prev, foundedYear: event.target.value }))}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="crm-builders-fieldset">
            <legend>Canais oficiais</legend>
            <div className="form-grid">
              <div>
                <label>Website</label>
                <input
                  value={form.website}
                  onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
                  placeholder="https://"
                />
              </div>
              <div>
                <label>Instagram</label>
                <input
                  value={form.instagram}
                  onChange={(event) => setForm((prev) => ({ ...prev, instagram: event.target.value }))}
                  placeholder="@perfil ou URL"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="crm-builders-fieldset">
            <legend>Números &amp; portfólio</legend>
            <div className="form-grid">
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
            </div>
          </fieldset>

          <fieldset className="crm-builders-fieldset">
            <legend>Conteúdo público</legend>
            <div className="form-grid">
              <div style={{ gridColumn: "1 / -1" }}>
                <label>
                  Descrição curta
                  <span className="crm-builders-hint">Aparece como resumo no topo da página pública.</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  rows={3}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label>
                  Texto institucional
                  <span className="crm-builders-hint">
                    Conteúdo completo do bloco &quot;Sobre&quot;. Aceita markdown: <code>##</code> para subtítulo,{" "}
                    <code>###</code> para sub-subtítulo, <code>-</code> para listas, <code>**negrito**</code> e linha em branco entre parágrafos.
                  </span>
                </label>
                <textarea
                  value={form.institutionalText}
                  onChange={(event) => setForm((prev) => ({ ...prev, institutionalText: event.target.value }))}
                  rows={10}
                />
              </div>
            </div>
          </fieldset>

          <div className="crm-builders-form-actions">
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
            className="crm-builders-feedback"
            data-tone={status === "error" ? "error" : status === "success" ? "success" : "muted"}
          >
            {statusMessage}
          </p>
        ) : null}
      </article>

      {cropSource ? (
        <LogoCropper
          source={cropSource}
          onCancel={() => {
            setCropSource(null);
            setLogoUploadStatus("idle");
          }}
          onConfirm={handleCropConfirm}
        />
      ) : null}
    </div>
  );
}
