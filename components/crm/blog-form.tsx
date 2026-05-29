"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Marked } from "marked";

const previewRenderer = new Marked({ async: false, gfm: true, breaks: false });

const COVER_DIMENSION_HINT =
  "Sugerido: 1200×630 px (proporção 1.91:1) para Open Graph; mínimo 1080×600. JPG ou PNG, até 5 MB.";

type BlogStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type BlogFormInitial = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImageUrl?: string | null;
  bodyMarkdown?: string;
  status?: BlogStatusValue;
  tagSlugs?: string[];
};

type Props = {
  initial?: BlogFormInitial;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export function BlogPostForm({ initial }: Props) {
  const router = useRouter();
  const isEditing = Boolean(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
  const [bodyMarkdown, setBodyMarkdown] = useState(initial?.bodyMarkdown ?? "");
  const [status, setStatus] = useState<BlogStatusValue>(initial?.status ?? "DRAFT");
  const [tagsInput, setTagsInput] = useState(initial?.tagSlugs?.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [sourceText, setSourceText] = useState("");
  const coverFileRef = useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(
    null
  );

  async function handleGenerateImage() {
    if (!title.trim() && !excerpt.trim() && !sourceText.trim()) {
      setFeedback({
        kind: "error",
        message: "Preencha o título, resumo ou cole um texto/URL fonte antes de gerar a imagem."
      });
      return;
    }
    if (coverImageUrl.trim() && !confirm("Isso vai substituir a capa atual. Continuar?")) {
      return;
    }

    setGeneratingImage(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/crm/blog/ai-image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sourceText: sourceText.trim() || undefined,
          title: title.trim() || undefined,
          excerpt: excerpt.trim() || undefined,
          tagLabels: tagsInput
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)
        })
      });
      const json = await response.json().catch(() => null);

      if (!response.ok || !json?.success) {
        const message = json?.error?.message ?? "Não foi possível gerar a imagem.";
        setFeedback({ kind: "error", message });
        return;
      }

      const image = json.data?.image;
      if (!image?.imageUrl) {
        setFeedback({ kind: "error", message: "A API não retornou URL de imagem." });
        return;
      }
      setCoverImageUrl(image.imageUrl);
      setFeedback({
        kind: "success",
        message:
          image.strategy === "og"
            ? "Capa extraída da URL fonte (og:image)."
            : "Capa gerada com IA. Revise antes de salvar."
      });
    } catch {
      setFeedback({ kind: "error", message: "Erro de rede ao gerar imagem." });
    } finally {
      setGeneratingImage(false);
    }
  }

  async function handleCoverUpload(file: File) {
    setUploadingCover(true);
    setFeedback(null);
    try {
      const directRes = await fetch("/api/media/images/direct-upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ metadata: { module: "blog" } })
      });
      const directJson = await directRes.json().catch(() => null);
      if (!directRes.ok || !directJson?.success) {
        const message = directJson?.error?.message ?? "Não foi possível iniciar o upload.";
        setFeedback({ kind: "error", message });
        return;
      }

      const uploadUrl = directJson.data?.directUpload?.uploadURL as string | undefined;
      const imageDeliveryUrl = directJson.data?.imageDeliveryUrl as string | null | undefined;
      if (!uploadUrl) {
        setFeedback({ kind: "error", message: "URL de upload não retornada." });
        return;
      }

      const body = new FormData();
      body.append("file", file);
      const cfRes = await fetch(uploadUrl, { method: "POST", body });
      const cfJson = await cfRes.json().catch(() => null);
      if (!cfRes.ok || !cfJson?.success) {
        const message = cfJson?.errors?.[0]?.message ?? `Falha no upload (HTTP ${cfRes.status}).`;
        setFeedback({ kind: "error", message });
        return;
      }

      const variants = cfJson?.result?.variants as string[] | undefined;
      const finalUrl = imageDeliveryUrl ?? variants?.[0] ?? "";
      if (!finalUrl) {
        setFeedback({ kind: "error", message: "Upload concluído, mas a URL pública não veio." });
        return;
      }

      setCoverImageUrl(finalUrl);
      setFeedback({ kind: "success", message: "Imagem enviada." });
      if (coverFileRef.current) coverFileRef.current.value = "";
    } catch {
      setFeedback({ kind: "error", message: "Erro de rede ao enviar imagem." });
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleGenerateWithAi() {
    const trimmedSource = sourceText.trim();
    if (trimmedSource && trimmedSource.length < 30) {
      setFeedback({
        kind: "error",
        message: "Cole pelo menos 30 caracteres para a IA trabalhar em cima — ou deixe vazio para usar dados internos."
      });
      return;
    }

    if ((title || bodyMarkdown) && !confirm("Isso vai sobrescrever os campos preenchidos. Continuar?")) {
      return;
    }

    setGenerating(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/crm/blog/ai-draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(trimmedSource ? { sourceText: trimmedSource } : {})
      });
      const json = await response.json().catch(() => null);

      if (!response.ok || !json?.success) {
        const message = json?.error?.message ?? "Não foi possível gerar com IA.";
        setFeedback({ kind: "error", message });
        return;
      }

      const draft = json.data?.draft;
      if (!draft) {
        setFeedback({ kind: "error", message: "A IA não retornou um rascunho." });
        return;
      }

      setTitle(draft.title ?? "");
      setSlug(draft.slug ?? "");
      setExcerpt(draft.excerpt ?? "");
      setBodyMarkdown(draft.bodyMarkdown ?? "");
      if (Array.isArray(draft.tagSlugs)) setTagsInput(draft.tagSlugs.join(", "));
      setFeedback({ kind: "success", message: "Rascunho gerado. Revise e salve." });
    } catch {
      setFeedback({ kind: "error", message: "Erro de rede ao gerar com IA." });
    } finally {
      setGenerating(false);
    }
  }

  const previewHtml = useMemo(() => {
    if (!bodyMarkdown.trim()) return "";
    try {
      return previewRenderer.parse(bodyMarkdown) as string;
    } catch {
      return "";
    }
  }, [bodyMarkdown]);

  const tagSlugs = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((tag) => slugify(tag))
        .filter(Boolean),
    [tagsInput]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim(),
      coverImageUrl: coverImageUrl.trim() ? coverImageUrl.trim() : null,
      bodyMarkdown,
      status,
      tagSlugs
    };

    const endpoint = isEditing ? `/api/crm/blog/${initial?.id}` : "/api/crm/blog";
    const method = isEditing ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await response.json().catch(() => null);

      if (!response.ok || !json?.success) {
        const message = json?.error?.message ?? "Não foi possível salvar o post.";
        setFeedback({ kind: "error", message });
        return;
      }

      setFeedback({ kind: "success", message: "Post salvo." });

      if (!isEditing && json.data?.post?.id) {
        router.push(`/crm/blog/${json.data.post.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setFeedback({ kind: "error", message: "Erro de rede ao salvar." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("Apagar este post? Esta ação é permanente.")) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/crm/blog/${initial.id}`, { method: "DELETE" });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) {
        setFeedback({
          kind: "error",
          message: json?.error?.message ?? "Não foi possível apagar."
        });
        setSaving(false);
        return;
      }
      router.push("/crm/blog");
    } catch {
      setFeedback({ kind: "error", message: "Erro de rede ao apagar." });
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
    <form onSubmit={handleSubmit} className="card" style={{ padding: 16, display: "grid", gap: 12 }}>
      {!isEditing ? (
        <div
          style={{
            display: "grid",
            gap: 10,
            padding: 14,
            borderRadius: 10,
            background: "var(--surface-muted, #f5f5f5)",
            border: "1px solid var(--border, #e5e5e5)"
          }}
        >
          <div>
            <strong>Gerar rascunho com IA</strong>
            <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
              Cole a notícia, release ou anotação abaixo — a IA reescreve com tom consultivo
              e preenche título, slug, resumo, tags e corpo. Sem texto, gera a partir de
              lançamentos e imóveis ativos.
            </div>
          </div>
          <textarea
            id="blog-source"
            value={sourceText}
            onChange={(event) => setSourceText(event.target.value)}
            placeholder="Cole aqui o texto da notícia (ou deixe vazio para usar dados internos do site)..."
            rows={6}
            style={{
              fontFamily: "inherit",
              fontSize: 14,
              padding: 10,
              borderRadius: 6,
              border: "1px solid var(--border, #d4d8e0)",
              resize: "vertical",
              background: "#fff"
            }}
            disabled={generating}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              flexWrap: "wrap"
            }}
          >
            <small style={{ color: "var(--text-muted)" }}>
              {sourceText.trim().length
                ? `${sourceText.trim().length} caracteres • modo: a partir do texto`
                : "Sem texto • modo: a partir dos dados internos"}
            </small>
            <button
              type="button"
              className="button button-primary"
              onClick={handleGenerateWithAi}
              disabled={generating || saving}
            >
              {generating ? "Gerando..." : "Gerar com IA"}
            </button>
          </div>
        </div>
      ) : null}

      <div style={{ display: "grid", gap: 4 }}>
        <label htmlFor="blog-title">Título</label>
        <input
          id="blog-title"
          value={title}
          onChange={(event) => {
            const value = event.target.value;
            setTitle(value);
            if (!isEditing && !slug.trim()) setSlug(slugify(value));
          }}
          required
        />
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        <label htmlFor="blog-slug">Slug</label>
        <input
          id="blog-slug"
          value={slug}
          onChange={(event) => setSlug(slugify(event.target.value))}
          required
        />
        <small style={{ color: "var(--text-muted)" }}>URL: /blog/{slug || "..."}</small>
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        <label htmlFor="blog-excerpt">Resumo (até 280 caracteres)</label>
        <textarea
          id="blog-excerpt"
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value.slice(0, 280))}
          rows={3}
          required
        />
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        <label htmlFor="blog-cover">Imagem de capa</label>
        <small style={{ color: "var(--text-muted)" }}>{COVER_DIMENSION_HINT}</small>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            ref={coverFileRef}
            id="blog-cover-file"
            type="file"
            accept="image/*"
            disabled={uploadingCover || generatingImage}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleCoverUpload(file);
            }}
          />
          <button
            type="button"
            className="button button-ghost"
            onClick={handleGenerateImage}
            disabled={generatingImage || uploadingCover || saving}
            title="Se a fonte for URL, busca a capa original (og:image). Se for texto, gera com IA."
          >
            {generatingImage ? "Gerando..." : "Buscar/Gerar imagem"}
          </button>
          {uploadingCover ? (
            <span style={{ color: "var(--text-muted)" }}>Enviando...</span>
          ) : null}
        </div>
        <input
          id="blog-cover"
          type="url"
          value={coverImageUrl ?? ""}
          onChange={(event) => setCoverImageUrl(event.target.value)}
          placeholder="https://imagedelivery.net/... (ou envie um arquivo acima)"
        />
        {coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt="Pré-visualização da capa"
            style={{
              marginTop: 4,
              maxWidth: 240,
              maxHeight: 160,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid var(--border, #e5e5e5)"
            }}
          />
        ) : null}
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        <label htmlFor="blog-tags">Tags (separadas por vírgula)</label>
        <input
          id="blog-tags"
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          placeholder="mercado, palmas, lancamentos"
        />
        {tagSlugs.length ? (
          <small style={{ color: "var(--text-muted)" }}>
            Salvas como: {tagSlugs.join(", ")}
          </small>
        ) : null}
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        <label htmlFor="blog-body">Conteúdo (Markdown)</label>
        <textarea
          id="blog-body"
          value={bodyMarkdown}
          onChange={(event) => setBodyMarkdown(event.target.value)}
          rows={18}
          required
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        />
      </div>

      <div style={{ display: "grid", gap: 4 }}>
        <label htmlFor="blog-status">Status</label>
        <select
          id="blog-status"
          value={status}
          onChange={(event) => setStatus(event.target.value as BlogStatusValue)}
        >
          <option value="DRAFT">Rascunho</option>
          <option value="PUBLISHED">Publicado</option>
          <option value="ARCHIVED">Arquivado</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" className="button button-primary" disabled={saving}>
          {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar post"}
        </button>
        {isEditing && status === "PUBLISHED" && slug ? (
          <a
            href={`/blog/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-ghost"
          >
            Ver publicação ↗
          </a>
        ) : null}
        {isEditing ? (
          <button
            type="button"
            className="button button-ghost"
            onClick={handleDelete}
            disabled={saving}
          >
            Apagar
          </button>
        ) : null}
        {feedback ? (
          <span style={{ color: feedback.kind === "success" ? "var(--success)" : "var(--danger)" }}>
            {feedback.message}
            {feedback.kind === "success" && status === "PUBLISHED" && slug ? (
              <>
                {" "}
                <a href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer">
                  Clique aqui para ver a publicação ↗
                </a>
              </>
            ) : null}
          </span>
        ) : null}
      </div>
    </form>

    <section
      aria-label="Preview da publicação"
      className="card"
      style={{ padding: 16, display: "grid", gap: 12 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap"
        }}
      >
        <h2 className="section-title" style={{ margin: 0, fontSize: 20 }}>
          Preview
        </h2>
        <small style={{ color: "var(--text-muted)" }}>
          Aproximado de como o post vai aparecer publicado.
        </small>
      </div>

      {coverImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImageUrl}
          alt={title || "Capa"}
          style={{
            width: "100%",
            maxHeight: 320,
            objectFit: "cover",
            borderRadius: 12,
            border: "1px solid var(--border, #e5e5e5)"
          }}
        />
      ) : null}

      {tagSlugs.length ? (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tagSlugs.map((tag) => (
            <span key={tag} className="badge">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <h1 className="section-title" style={{ marginTop: 4, marginBottom: 0 }}>
        {title || "Título do post"}
      </h1>

      <p style={{ color: "var(--text-muted)", margin: 0 }}>
        Por Pedro Soares · CRECI 5861-TO
      </p>

      {excerpt ? (
        <p style={{ marginTop: 0, fontStyle: "italic", color: "var(--text-muted)" }}>
          {excerpt}
        </p>
      ) : null}

      {previewHtml ? (
        <div
          className="blog-article"
          style={{ marginTop: 4 }}
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      ) : (
        <p style={{ color: "var(--text-muted)", margin: 0 }}>
          Comece a escrever o conteúdo (ou gere com IA) para ver o preview aqui.
        </p>
      )}
    </section>
    </div>
  );
}
