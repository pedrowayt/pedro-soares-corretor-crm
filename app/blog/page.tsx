import type { Metadata } from "next";
import Link from "next/link";
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

function estimateReadingMinutes(markdown: string) {
  const words = markdown.replace(/[#>*_`\[\]\(\)\-]+/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const DEFAULT_AUTHOR = "Pedro Soares";

export default async function BlogIndexPage() {
  const posts = await listPublishedBlogPosts();

  if (!posts.length) {
    return (
      <main className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <header className="blog-magazine-header">
            <p className="blog-magazine-eyebrow">Blog</p>
            <h1 className="blog-magazine-title">Análises do mercado imobiliário em Palmas TO</h1>
            <p className="blog-magazine-lede">
              Bastidores, dicas para comprador e vendedor, leituras de bairro e lançamentos —
              direto de Pedro Soares.
            </p>
          </header>
          <article className="card" style={{ padding: 16, marginTop: 24 }}>
            <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
              Nenhum post publicado ainda. Volte em breve.
            </p>
          </article>
        </div>
      </main>
    );
  }

  const [hero, ...rest] = posts;
  const featured = rest.slice(0, 2);
  const list = rest.slice(2);

  const heroAuthor = ("author" in hero && hero.author?.name) || DEFAULT_AUTHOR;
  const heroReading = estimateReadingMinutes(hero.bodyMarkdown);

  return (
    <main className="section">
      <div className="container blog-magazine">
        <header className="blog-magazine-header">
          <p className="blog-magazine-eyebrow">Blog</p>
          <h1 className="blog-magazine-title">Mercado imobiliário em Palmas TO</h1>
          <p className="blog-magazine-lede">
            Bastidores, dicas para comprador e vendedor, leituras de bairro e lançamentos — direto
            de Pedro Soares.
          </p>
        </header>

        <section aria-labelledby="hero-post" className="blog-hero">
          {hero.coverImageUrl ? (
            <Link href={`/blog/${hero.slug}`} className="blog-hero-media" aria-hidden="true">
              <div
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(7,13,24,0) 0%, rgba(7,13,24,0.35) 100%), url(${hero.coverImageUrl})`
                }}
              />
            </Link>
          ) : null}
          <div className="blog-hero-body">
            <div className="blog-hero-meta">
              {hero.tags.slice(0, 2).map((tag) => (
                <span key={tag.id} className="blog-tag-chip">
                  {tag.label}
                </span>
              ))}
              <span className="blog-meta-dot">·</span>
              <time dateTime={hero.publishedAt?.toISOString() ?? ""}>
                {formatDate(hero.publishedAt)}
              </time>
            </div>
            <h2 id="hero-post" className="blog-hero-title">
              <Link href={`/blog/${hero.slug}`}>{hero.title}</Link>
            </h2>
            <p className="blog-hero-lede">{hero.excerpt}</p>
            <div className="blog-byline">
              <span>Por {heroAuthor}</span>
              <span className="blog-meta-dot">·</span>
              <span>{heroReading} min de leitura</span>
            </div>
            <Link href={`/blog/${hero.slug}`} className="blog-read-more">
              Continuar lendo →
            </Link>
          </div>
        </section>

        {featured.length ? (
          <section className="blog-featured-grid" aria-label="Em destaque">
            {featured.map((post) => {
              const author = ("author" in post && post.author?.name) || DEFAULT_AUTHOR;
              const reading = estimateReadingMinutes(post.bodyMarkdown);
              return (
                <article key={post.id} className="blog-feature-card">
                  {post.coverImageUrl ? (
                    <Link
                      href={`/blog/${post.slug}`}
                      className="blog-feature-media"
                      aria-hidden="true"
                    >
                      <div
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(7,13,24,0) 0%, rgba(7,13,24,0.35) 100%), url(${post.coverImageUrl})`
                        }}
                      />
                    </Link>
                  ) : null}
                  <div className="blog-feature-body">
                    <div className="blog-feature-meta">
                      {post.tags[0] ? (
                        <span className="blog-tag-chip">{post.tags[0].label}</span>
                      ) : null}
                      <time dateTime={post.publishedAt?.toISOString() ?? ""}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                    <h3 className="blog-feature-title">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="blog-feature-excerpt">{post.excerpt}</p>
                    <div className="blog-byline">
                      <span>Por {author}</span>
                      <span className="blog-meta-dot">·</span>
                      <span>{reading} min</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : null}

        {list.length ? (
          <section className="blog-story-list" aria-label="Mais publicações">
            <h2 className="blog-list-heading">Mais publicações</h2>
            <ul>
              {list.map((post) => {
                const author = ("author" in post && post.author?.name) || DEFAULT_AUTHOR;
                const reading = estimateReadingMinutes(post.bodyMarkdown);
                return (
                  <li key={post.id} className="blog-story-row">
                    <div className="blog-story-text">
                      <div className="blog-feature-meta">
                        {post.tags[0] ? (
                          <span className="blog-tag-chip">{post.tags[0].label}</span>
                        ) : null}
                        <time dateTime={post.publishedAt?.toISOString() ?? ""}>
                          {formatDate(post.publishedAt)}
                        </time>
                      </div>
                      <h3 className="blog-story-title">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="blog-story-excerpt">{post.excerpt}</p>
                      <div className="blog-byline">
                        <span>Por {author}</span>
                        <span className="blog-meta-dot">·</span>
                        <span>{reading} min</span>
                      </div>
                    </div>
                    {post.coverImageUrl ? (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="blog-story-thumb"
                        aria-hidden="true"
                      >
                        <div style={{ backgroundImage: `url(${post.coverImageUrl})` }} />
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
