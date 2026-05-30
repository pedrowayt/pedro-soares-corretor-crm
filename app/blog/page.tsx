import type { Metadata } from "next";
import Link from "next/link";
import { BlogNewsletterForm } from "@/components/blog/BlogNewsletterForm";
import {
  listPublishedBlogPosts,
  listPublishedBlogTagsWithCounts,
  listTopViewedBlogPosts
} from "@/lib/data/blog";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

const baseUrl = getSiteUrl();

const AUTHOR_NAME = "Pedro Soares";
const AUTHOR_CREDENTIAL = "CRECI 5861-TO";
const AUTHOR_AVATAR_URL = "/brand/pedro-portrait-1.png";

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

function Byline({ reading, full = false }: { reading: number; full?: boolean }) {
  return (
    <div className="blog-byline">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={AUTHOR_AVATAR_URL}
        alt=""
        className="blog-byline-avatar"
        aria-hidden="true"
        loading="lazy"
      />
      <span>
        Por {AUTHOR_NAME}{" "}
        <span className="blog-author-credential">· {AUTHOR_CREDENTIAL}</span>
      </span>
      <span className="blog-meta-dot">·</span>
      <span>
        {reading} {full ? "min de leitura" : "min"}
      </span>
    </div>
  );
}

export default async function BlogIndexPage({
  searchParams
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const sp = await searchParams;
  const activeTag = (sp.tag ?? "").trim() || null;

  const [posts, tags, topViewed] = await Promise.all([
    listPublishedBlogPosts(undefined, activeTag ?? undefined),
    listPublishedBlogTagsWithCounts(),
    listTopViewedBlogPosts(3)
  ]);

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
          {tags.length && activeTag ? (
            <p className="text-card" style={{ color: "var(--text-muted)" }}>
              Nenhuma publicação na categoria selecionada.{" "}
              <Link href="/blog">Ver tudo</Link>.
            </p>
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

  const [hero, ...rest] = posts;
  const featured = rest.slice(0, 2);
  const list = rest.slice(2);

  const heroReading = estimateReadingMinutes(hero.bodyMarkdown);
  const activeTagLabel = activeTag
    ? tags.find((t) => t.slug === activeTag)?.label ?? activeTag
    : null;

  return (
    <main className="section">
      <div className="container blog-magazine">
        <header className="blog-magazine-header">
          <p className="blog-magazine-eyebrow">Blog</p>
          <h1 className="blog-magazine-title">
            {activeTagLabel ? `Blog · ${activeTagLabel}` : "Mercado imobiliário em Palmas TO"}
          </h1>
          <p className="blog-magazine-lede">
            Bastidores, dicas para comprador e vendedor, leituras de bairro e lançamentos — direto
            de Pedro Soares.
          </p>
        </header>

        {tags.length ? (
          <nav className="blog-tag-filter" aria-label="Filtrar por categoria">
            <Link
              href="/blog"
              className={`blog-tag-filter-chip${!activeTag ? " is-active" : ""}`}
            >
              Todos
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/blog?tag=${encodeURIComponent(tag.slug)}`}
                className={`blog-tag-filter-chip${activeTag === tag.slug ? " is-active" : ""}`}
              >
                {tag.label}
                <span className="blog-tag-filter-count">{tag.count}</span>
              </Link>
            ))}
          </nav>
        ) : null}

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
            <p className="blog-hero-watermark" aria-hidden="true">
              Pedro Soares Imóveis · Palmas TO
            </p>
            <p className="blog-hero-lede">{hero.excerpt}</p>
            <Byline reading={heroReading} full />
            <Link href={`/blog/${hero.slug}`} className="blog-read-more">
              Continuar lendo →
            </Link>
          </div>
        </section>

        <BlogNewsletterForm source="blog-index" />

        {featured.length ? (
          <section className="blog-featured-grid" aria-label="Em destaque">
            {featured.map((post) => {
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
                    <Byline reading={reading} />
                  </div>
                </article>
              );
            })}
          </section>
        ) : null}

        {topViewed.length && !activeTag ? (
          <section className="blog-trending" aria-labelledby="trending-heading">
            <div className="blog-trending-head">
              <span className="blog-trending-eyebrow">🔥 Em alta</span>
              <h2 id="trending-heading" className="blog-list-heading">
                Mais lidos esta semana
              </h2>
            </div>
            <ol className="blog-trending-list">
              {topViewed.map((post, index) => (
                <li key={post.id}>
                  <span className="blog-trending-rank">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="blog-trending-title">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="blog-trending-meta">
                      {post.tags[0]?.label ? `${post.tags[0].label} · ` : ""}
                      {post.views} {post.views === 1 ? "leitura" : "leituras"}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {list.length ? (
          <section className="blog-story-list" aria-label="Mais publicações">
            <h2 className="blog-list-heading">Mais publicações</h2>
            <ul>
              {list.map((post) => {
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
                      <Byline reading={reading} />
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
