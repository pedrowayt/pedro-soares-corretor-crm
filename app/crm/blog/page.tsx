import Link from "next/link";
import { listCrmBlogPosts } from "@/lib/data/blog";

const statusLabel: Record<string, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  ARCHIVED: "Arquivado"
};

export default async function CrmBlogListPage() {
  const posts = await listCrmBlogPosts();

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
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
            Conteúdo para atrair tráfego orgânico e nutrir leads. Comece como rascunho e publique
            quando estiver pronto.
          </p>
        </div>
        <Link href="/crm/blog/novo" className="button button-primary">
          Novo post
        </Link>
      </div>

      <div className="grid-3" style={{ marginTop: 16 }}>
        {posts.length ? (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/crm/blog/${post.id}`}
              className="card"
              style={{ padding: 14, display: "block" }}
            >
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className="badge">{statusLabel[post.status] ?? post.status}</span>
                {post.source === "AI_GENERATED" ? (
                  <span className="badge" title="Rascunho gerado por IA — revisar antes de publicar">
                    🤖 IA
                  </span>
                ) : null}
              </div>
              <h3 className="title-luxury" style={{ marginTop: 8, marginBottom: 8 }}>
                {post.title}
              </h3>
              <p className="text-card" style={{ margin: "4px 0", color: "var(--text-muted)" }}>
                /blog/{post.slug}
              </p>
              <p
                className="text-card"
                style={{ margin: "4px 0", color: "var(--text-muted)", fontSize: "var(--fs-14)" }}
              >
                {post.excerpt}
              </p>
              {post.tags.length ? (
                <p
                  className="text-card"
                  style={{ margin: "8px 0 0", color: "var(--text-muted)", fontSize: "var(--fs-12)" }}
                >
                  Tags: {post.tags.map((tag) => tag.label).join(", ")}
                </p>
              ) : null}
            </Link>
          ))
        ) : (
          <article className="card" style={{ padding: 14, gridColumn: "1 / -1" }}>
            <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
              Nenhum post criado ainda. Use “Novo post” pra começar.
            </p>
          </article>
        )}
      </div>
    </>
  );
}
