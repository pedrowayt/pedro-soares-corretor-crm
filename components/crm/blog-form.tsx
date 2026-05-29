"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(
    null
  );

  async function handleGenerateWithAi() {
    setGenerating(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/crm/blog/ai-draft", { method: "POST" });
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
    <form onSubmit={handleSubmit} className="card" style={{ padding: 16, display: "grid", gap: 12 }}>
      {!isEditing ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: 12,
            borderRadius: 8,
            background: "var(--surface-muted, #f5f5f5)",
            flexWrap: "wrap"
          }}
        >
          <div>
            <strong>Gerar rascunho com IA</strong>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Usa lançamentos e imóveis ativos para escrever um post inicial.
            </div>
          </div>
          <button
            type="button"
            className="button button-ghost"
            onClick={handleGenerateWithAi}
            disabled={generating || saving}
          >
            {generating ? "Gerando..." : "Gerar com IA"}
          </button>
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
        <label htmlFor="blog-cover">URL da imagem de capa</label>
        <input
          id="blog-cover"
          type="url"
          value={coverImageUrl ?? ""}
          onChange={(event) => setCoverImageUrl(event.target.value)}
          placeholder="https://imagedelivery.net/..."
        />
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
          </span>
        ) : null}
      </div>
    </form>
  );
}
