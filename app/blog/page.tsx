import type { Metadata } from "next";
import Link from "next/link";
import { BlogShareBar } from "@/components/blog/BlogShareBar";
import { listPublishedBlogPosts } from "@/lib/data/blog";

export const revalidate = 60;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.pedrosoarescorretor.com.br";

export const metadata: Metadata = {
  title: "Blog | Pedro Soares Imóveis em Palmas TO",
  description:
    "Notícias, dicas e análises do mercado imobiliário em Palmas TO. Lançamentos, bairros em alta e orientação direta de Pedro Soares.",
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    title: "Blog Pedro Soares Imóveis",
    description:
      "Análises e dicas do mercado imobiliário em Palmas TO direto de Pedro Soares.",
    url: `${baseUrl}/blog`,
    type: "website"
  }
};

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
    date
  );
}

export default async function BlogIndexPage() {
  const posts = await listPublishedBlogPosts();

  return (
    <main className="section">
      <div className="container">
        <div className="wp-section-head">
          <h1 className="section-title">Blog Pedro Soares Imóveis</h1>
          <p className="section-subtitle text-card">
            Análises de bairros, dicas para comprador e vendedor, lançamentos em Palmas e bastidores
            do mercado imobiliário do Tocantins.
          </p>
        </div>

        {posts.length ? (
          <div className="wp-property-grid wp-property-grid-3" style={{ marginTop: 24 }}>
            {posts.map((post) => (
              <article key={post.id} className="wp-property-card compact">
                {post.coverImageUrl ? (
                  <div
                    className="wp-property-media"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(7,13,24,0.05), rgba(7,13,24,0.6)), url(${post.coverImageUrl})`
                    }}
                  >
                    <div className="wp-media-badges">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag.id} className="badge">
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    className="wp-property-media"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg, rgba(7,13,24,0.05), rgba(7,13,24,0.6)), url(/brand/logo-light-bg.png)"
                    }}
                  >
                    <div className="wp-media-badges">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag.id} className="badge">
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="wp-property-body">
                  <p
                    className="text-card"
                    style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--fs-12)" }}
                  >
                    {formatDate(post.publishedAt)}
                  </p>
                  <h2 style={{ marginTop: 6 }}>{post.title}</h2>
                  <p className="text-card" style={{ marginTop: 6 }}>
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="button button-primary"
                    style={{ width: "100%", marginTop: 12 }}
                  >
                    Ler post
                  </Link>
                  <div style={{ marginTop: 10 }}>
                    <BlogShareBar
                      url={`${baseUrl}/blog/${post.slug}`}
                      title={post.title}
                      excerpt={post.excerpt}
                      compact
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className="card" style={{ padding: 16, marginTop: 24 }}>
            <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
              Nenhum post publicado ainda. Volte em breve.
            </p>
          </article>
        )}
      </div>
    </main>
  );
}
