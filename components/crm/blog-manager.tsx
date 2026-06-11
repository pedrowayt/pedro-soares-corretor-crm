"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Edit3,
  Eye,
  ExternalLink,
  Plus,
  Search,
  Tags,
  Trash2
} from "lucide-react";
import type { BlogCategoryView, BlogPostView } from "@/lib/data/blog";

type Props = {
  posts: BlogPostView[];
  categories: BlogCategoryView[];
};

const statusLabel: Record<string, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  ARCHIVED: "Arquivado"
};

function formatDate(date: Date | string | null) {
  if (!date) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

function formatViews(views: number) {
  return `${views.toLocaleString("pt-BR")} ${views === 1 ? "visualização" : "visualizações"}`;
}

export function CrmBlogManager({ posts, categories }: Props) {
  const [rows, setRows] = useState(posts);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [categoryId, setCategoryId] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(
    null
  );

  const metrics = useMemo(() => {
    const published = rows.filter((post) => post.status === "PUBLISHED").length;
    const drafts = rows.filter((post) => post.status === "DRAFT").length;
    const views = rows.reduce((total, post) => total + (post.views ?? 0), 0);
    return { published, drafts, views };
  }, [rows]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return rows.filter((post) => {
      const matchesStatus = status === "ALL" || post.status === status;
      const matchesCategory = categoryId === "ALL" || post.categoryId === categoryId;
      const searchable = [
        post.title,
        post.excerpt,
        post.slug,
        post.category?.label,
        post.tags.map((tag) => tag.label).join(" ")
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        matchesStatus &&
        matchesCategory &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [categoryId, query, rows, status]);

  async function handleDelete(post: BlogPostView) {
    if (!confirm(`Excluir "${post.title}"? Esta ação é permanente.`)) return;

    setDeletingId(post.id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/crm/blog/${post.id}`, { method: "DELETE" });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) {
        setFeedback({
          kind: "error",
          message: json?.error?.message ?? "Não foi possível excluir o post."
        });
        return;
      }
      setRows((current) => current.filter((item) => item.id !== post.id));
      setFeedback({ kind: "success", message: "Post excluído." });
    } catch {
      setFeedback({ kind: "error", message: "Erro de rede ao excluir o post." });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap"
        }}
      >
        <div>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            Blog
          </h1>
          <p className="section-subtitle">
            Planeje notícias, organize categorias e publique conteúdo com SEO pronto para busca.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link href="/crm/blog/categorias" className="button button-ghost">
            <Tags size={16} strokeWidth={1.8} aria-hidden="true" />
            Categorias
          </Link>
          <Link href="/crm/blog/novo" className="button button-primary">
            <Plus size={16} strokeWidth={1.8} aria-hidden="true" />
            Novo post
          </Link>
        </div>
      </div>

      <section
        aria-label="Resumo do blog"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 12
        }}
      >
        {[
          ["Publicados", metrics.published.toLocaleString("pt-BR"), "Posts visíveis no site"],
          ["Rascunhos", metrics.drafts.toLocaleString("pt-BR"), "Conteúdos em preparação"],
          ["Leituras", metrics.views.toLocaleString("pt-BR"), "Visualizações registradas"]
        ].map(([label, value, caption]) => (
          <article
            key={label}
            className="card"
            style={{
              padding: 16,
              display: "grid",
              gap: 6,
              minHeight: 92,
              alignContent: "center"
            }}
          >
            <span
              style={{
                color: "var(--text-muted)",
                fontSize: "var(--fs-12)",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase"
              }}
            >
              {label}
            </span>
            <strong style={{ color: "var(--text-strong)", fontSize: 28, lineHeight: 1 }}>
              {value}
            </strong>
            <small style={{ color: "var(--text-muted)", fontSize: "var(--fs-13)" }}>
              {caption}
            </small>
          </article>
        ))}
      </section>

      <section
        className="card"
        style={{
          padding: 14,
          display: "grid",
          gridTemplateColumns: "minmax(220px, 1fr) repeat(2, minmax(160px, 220px))",
          gap: 10,
          alignItems: "center"
        }}
        aria-label="Filtros do blog"
      >
        <label style={{ position: "relative", display: "grid" }}>
          <span className="sr-only">Buscar post</span>
          <Search
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por título, slug, categoria ou tag"
            style={{ paddingLeft: 36 }}
          />
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          <span className="sr-only">Filtrar por status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="ALL">Todos os status</option>
            <option value="DRAFT">Rascunhos</option>
            <option value="PUBLISHED">Publicados</option>
            <option value="ARCHIVED">Arquivados</option>
          </select>
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          <span className="sr-only">Filtrar por categoria</span>
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="ALL">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      {feedback ? (
        <p
          className="text-card"
          style={{
            margin: 0,
            color: feedback.kind === "success" ? "var(--success)" : "var(--danger)"
          }}
        >
          {feedback.message}
        </p>
      ) : null}

      <section className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(360px, 1fr) 150px 135px 140px 150px",
            gap: 12,
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontSize: "var(--fs-12)",
            fontWeight: 900,
            letterSpacing: "0.04em",
            textTransform: "uppercase"
          }}
        >
          <span>Postagem</span>
          <span>Status</span>
          <span>Visualizações</span>
          <span>Atualizado</span>
          <span style={{ textAlign: "right" }}>Ações</span>
        </div>

        {filteredPosts.length ? (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(360px, 1fr) 150px 135px 140px 150px",
                gap: 12,
                alignItems: "center",
                padding: "14px 16px",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <div style={{ display: "flex", gap: 12, minWidth: 0, alignItems: "center" }}>
                {post.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImageUrl}
                    alt=""
                    style={{
                      width: 76,
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      flexShrink: 0
                    }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    style={{
                      width: 76,
                      aspectRatio: "4 / 3",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--surface-muted, #f5f5f5)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--text-muted)",
                      flexShrink: 0
                    }}
                  >
                    <Tags size={20} strokeWidth={1.7} />
                  </span>
                )}

                <div style={{ minWidth: 0, display: "grid", gap: 5 }}>
                  <Link
                    href={`/crm/blog/${post.id}`}
                    className="title-luxury"
                    style={{
                      margin: 0,
                      color: "var(--text-strong)",
                      textDecoration: "none",
                      fontSize: "1rem",
                      lineHeight: 1.25
                    }}
                  >
                    {post.title}
                  </Link>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "var(--fs-13)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    /blog/{post.slug}
                  </span>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "var(--fs-12)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {post.category?.label ?? "Sem categoria"}
                    {post.tags.length ? ` · ${post.tags.map((tag) => tag.label).join(", ")}` : ""}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className="badge">{statusLabel[post.status] ?? post.status}</span>
                {post.source === "AI_GENERATED" ? (
                  <span className="badge" title="Rascunho gerado por IA">
                    IA
                  </span>
                ) : null}
              </div>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--text)",
                  fontWeight: 800
                }}
                title={formatViews(post.views)}
              >
                <Eye size={15} strokeWidth={1.7} aria-hidden="true" />
                {post.views.toLocaleString("pt-BR")}
              </span>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--text-muted)",
                  fontSize: "var(--fs-13)"
                }}
              >
                <CalendarDays size={15} strokeWidth={1.7} aria-hidden="true" />
                {formatDate(post.updatedAt)}
              </span>

              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                {post.status === "PUBLISHED" ? (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-ghost"
                    title="Ver publicação"
                    aria-label={`Ver publicação ${post.title}`}
                    style={{ minHeight: 36, padding: "0 10px" }}
                  >
                    <ExternalLink size={15} strokeWidth={1.8} aria-hidden="true" />
                  </a>
                ) : null}
                <Link
                  href={`/crm/blog/${post.id}`}
                  className="button button-ghost"
                  title="Editar post"
                  aria-label={`Editar ${post.title}`}
                  style={{ minHeight: 36, padding: "0 10px" }}
                >
                  <Edit3 size={15} strokeWidth={1.8} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => void handleDelete(post)}
                  disabled={deletingId === post.id}
                  title="Excluir post"
                  aria-label={`Excluir ${post.title}`}
                  style={{ minHeight: 36, padding: "0 10px" }}
                >
                  <Trash2 size={15} strokeWidth={1.8} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))
        ) : (
          <article style={{ padding: 18 }}>
            <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
              Nenhum post encontrado com os filtros atuais.
            </p>
          </article>
        )}
      </section>
    </div>
  );
}
