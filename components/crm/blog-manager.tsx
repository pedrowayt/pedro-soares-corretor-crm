"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, Eye, Plus, Search, Tags } from "lucide-react";
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
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(date)
  );
}

export function CrmBlogManager({ posts, categories }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [categoryId, setCategoryId] = useState("ALL");

  const metrics = useMemo(() => {
    const published = posts.filter((post) => post.status === "PUBLISHED").length;
    const drafts = posts.filter((post) => post.status === "DRAFT").length;
    const views = posts.reduce((total, post) => total + (post.views ?? 0), 0);
    return { published, drafts, views };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
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
      return matchesStatus && matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [categoryId, posts, query, status]);

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

      <section className="grid-3" aria-label="Resumo do blog">
        <article className="metric-card">
          <span>Publicados</span>
          <strong>{metrics.published}</strong>
          <small>Posts visíveis no site</small>
        </article>
        <article className="metric-card">
          <span>Rascunhos</span>
          <strong>{metrics.drafts}</strong>
          <small>Conteúdos em preparação</small>
        </article>
        <article className="metric-card">
          <span>Leituras</span>
          <strong>{metrics.views.toLocaleString("pt-BR")}</strong>
          <small>Visualizações registradas</small>
        </article>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 14
        }}
      >
        {filteredPosts.length ? (
          filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/crm/blog/${post.id}`}
              className="card"
              style={{ padding: 14, display: "grid", gap: 12, textDecoration: "none" }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                {post.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImageUrl}
                    alt=""
                    style={{
                      width: 92,
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid var(--border)"
                    }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    style={{
                      width: 92,
                      aspectRatio: "4 / 3",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--surface-muted, #f5f5f5)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--text-muted)"
                    }}
                  >
                    <Tags size={20} strokeWidth={1.7} />
                  </span>
                )}
                <div style={{ minWidth: 0, display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className="badge">{statusLabel[post.status] ?? post.status}</span>
                    {post.category ? <span className="badge">{post.category.label}</span> : null}
                    {post.source === "AI_GENERATED" ? (
                      <span className="badge" title="Rascunho gerado por IA">
                        IA
                      </span>
                    ) : null}
                  </div>
                  <h3 className="title-luxury" style={{ margin: 0 }}>
                    {post.title}
                  </h3>
                </div>
              </div>

              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                /blog/{post.slug}
              </p>
              <p
                className="text-card"
                style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--fs-14)" }}
              >
                {post.excerpt}
              </p>

              <footer
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  color: "var(--text-muted)",
                  fontSize: "var(--fs-12)"
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Eye size={14} strokeWidth={1.7} aria-hidden="true" />
                  {post.views}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <CalendarDays size={14} strokeWidth={1.7} aria-hidden="true" />
                  {formatDate(post.updatedAt)}
                </span>
                {post.tags.length ? <span>Tags: {post.tags.map((tag) => tag.label).join(", ")}</span> : null}
              </footer>
            </Link>
          ))
        ) : (
          <article className="card" style={{ padding: 18, gridColumn: "1 / -1" }}>
            <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
              Nenhum post encontrado com os filtros atuais.
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
