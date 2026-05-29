import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Marked } from "marked";
import { BlogShareBar } from "@/components/blog/BlogShareBar";
import { listPublishedBlogPosts } from "@/lib/data/blog";
import { listPublicProperties } from "@/lib/data/properties";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/utils";

export const revalidate = 60;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.pedrosoarescorretor.com.br";
const SITE_NAME = "Pedro Soares Imóveis";
const DEFAULT_AUTHOR = "Pedro Soares";
const AUTHOR_AVATAR_URL = "/brand/pedro-portrait-1.png";
const SOCIAL_LINKS = [
  { label: "Instagram @pedrosoarespmw", href: "https://www.instagram.com/pedrosoarespmw/" },
  { label: "WhatsApp", href: "https://wa.me/5563984845101" }
];

const blogMarkdownRenderer = new Marked({
  async: false,
  gfm: true,
  breaks: false
});

function renderMarkdown(value: string) {
  return blogMarkdownRenderer.parse(value) as string;
}

function estimateReadingTime(markdown: string) {
  const words = markdown.replace(/[#>*_`\[\]\(\)\-]+/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return { words, minutes };
}

function formatLongDate(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
    date
  );
}

function formatTime(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo"
  }).format(date);
}

async function getPublishedBySlug(slug: string) {
  const hasDatabase = Boolean(process.env.DATABASE_URL);
  if (!hasDatabase) {
    const posts = await listPublishedBlogPosts();
    return posts.find((post) => post.slug === slug) ?? null;
  }
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { tags: true, author: { select: { id: true, name: true } } }
    });
    return post;
  } catch {
    const posts = await listPublishedBlogPosts();
    return posts.find((post) => post.slug === slug) ?? null;
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBySlug(slug);
  if (!post) return { title: `Post não encontrado | ${SITE_NAME}` };

  const tags = "tags" in post ? post.tags : [];
  const keywords = tags.map((tag: { label: string }) => tag.label);
  const url = `${baseUrl}/blog/${post.slug}`;
  const images = post.coverImageUrl ? [{ url: post.coverImageUrl, alt: post.title }] : undefined;

  return {
    title: `${post.title} | Blog ${SITE_NAME}`,
    description: post.excerpt,
    keywords: keywords.length ? keywords : undefined,
    authors: [{ name: DEFAULT_AUTHOR }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
      siteName: SITE_NAME,
      locale: "pt_BR",
      images,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [DEFAULT_AUTHOR],
      tags: keywords
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined
    }
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBySlug(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.bodyMarkdown);
  const tags = "tags" in post ? post.tags : [];
  const authorName = ("author" in post && post.author?.name) || DEFAULT_AUTHOR;
  const reading = estimateReadingTime(post.bodyMarkdown);
  const publishedAt = post.publishedAt ?? null;
  const updatedAt = post.updatedAt ?? null;
  const url = `${baseUrl}/blog/${post.slug}`;

  const [allPosts, allProperties] = await Promise.all([
    listPublishedBlogPosts(6),
    listPublicProperties()
  ]);

  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const recentProperties = allProperties
    .filter((p) => p.status === "DISPONIVEL")
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl ?? undefined,
    datePublished: publishedAt?.toISOString(),
    dateModified: updatedAt?.toISOString(),
    keywords: tags.map((tag: { label: string }) => tag.label).join(", ") || undefined,
    articleSection: tags[0]?.label,
    author: {
      "@type": "Person",
      name: authorName,
      url: baseUrl
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${baseUrl}/brand/logo-light-bg.png` }
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url }
    ]
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 820 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        <p style={{ marginTop: 0 }}>
          <Link href="/blog">← Voltar para o blog</Link>
        </p>

        <article>
          <header>
            {post.coverImageUrl ? (
              <div
                style={{
                  height: 320,
                  borderRadius: 16,
                  backgroundImage: `linear-gradient(180deg, rgba(7,13,24,0.05), rgba(7,13,24,0.35)), url(${post.coverImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  marginBottom: 20
                }}
                role="img"
                aria-label={post.title}
              />
            ) : null}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              {tags.map((tag: { id: string; label: string }) => (
                <span key={tag.id} className="badge">
                  {tag.label}
                </span>
              ))}
            </div>

            <h1 className="section-title" style={{ marginTop: 4 }}>
              {post.title}
            </h1>

            <div className="blog-author">
              <div
                className="blog-author-avatar"
                style={{ backgroundImage: `url(${AUTHOR_AVATAR_URL})` }}
                aria-hidden="true"
              />
              <div>
                <div className="blog-author-name">Por {authorName}</div>
                <div className="blog-author-meta">
                  {publishedAt ? (
                    <>
                      Publicado em{" "}
                      <time dateTime={publishedAt.toISOString()}>
                        {formatLongDate(publishedAt)} às {formatTime(publishedAt)}
                      </time>
                    </>
                  ) : null}
                  {" • "}
                  {reading.minutes} min de leitura
                  {updatedAt && publishedAt && updatedAt.getTime() - publishedAt.getTime() > 60_000 ? (
                    <>
                      {" • "}
                      Atualizado em{" "}
                      <time dateTime={updatedAt.toISOString()}>{formatLongDate(updatedAt)}</time>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <BlogShareBar url={url} title={post.title} excerpt={post.excerpt} />
            </div>
          </header>

          <div
            className="blog-article"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <footer style={{ marginTop: 32 }}>
            <hr style={{ margin: "24px 0", border: 0, borderTop: "1px solid var(--border)" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-14)", margin: "0 0 8px" }}>
              Gostou? Compartilhe com quem está pensando em comprar ou investir em Palmas.
            </p>
            <BlogShareBar url={url} title={post.title} excerpt={post.excerpt} />
          </footer>
        </article>

        <hr style={{ margin: "32px 0", border: 0, borderTop: "1px solid var(--border)" }} />

        <div className="wp-cta-bar">
          <h3>Quer conversar sobre imóveis em Palmas?</h3>
          <div>
            <a
              className="button button-whatsapp"
              href="https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20li%20um%20post%20do%20blog%20e%20quero%20falar%20sobre%20im%C3%B3veis."
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp
            </a>
            <Link className="button button-primary" href="/imoveis/prontos">
              Ver imóveis
            </Link>
          </div>
        </div>

        <section style={{ marginTop: 36 }} aria-labelledby="follow-heading">
          <h3 id="follow-heading" style={{ marginBottom: 8 }}>
            Acompanhe Pedro Soares
          </h3>
          <p style={{ color: "var(--text-muted)", margin: "0 0 12px", fontSize: "var(--fs-14)" }}>
            Conteúdo do mercado, novos imóveis e bastidores de Palmas TO.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-ghost"
              >
                {social.label} ↗
              </a>
            ))}
          </div>
        </section>
      </div>

      {recentProperties.length ? (
        <div className="container" style={{ marginTop: 48 }}>
          <div className="wp-section-head">
            <h2 className="section-title">Imóveis recentes em Palmas</h2>
            <p className="section-subtitle text-card">
              Selecione, agende visita e converse direto pelo WhatsApp.
            </p>
          </div>

          <div className="wp-property-grid wp-property-grid-3" style={{ marginTop: 20 }}>
            {recentProperties.map((property) => {
              const imageUrl = property.media?.[0]?.url ?? "/brand/logo-light-bg.png";
              return (
                <article key={property.id} className="wp-property-card compact">
                  <div
                    className="wp-property-media"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(7,13,24,0.05), rgba(7,13,24,0.55)), url(${imageUrl})`
                    }}
                  />
                  <div className="wp-property-body">
                    <p
                      className="text-card"
                      style={{
                        margin: 0,
                        color: "var(--text-muted)",
                        fontSize: "var(--fs-12)"
                      }}
                    >
                      {property.district} — {property.city}
                    </p>
                    <h3 style={{ marginTop: 6 }}>{property.title}</h3>
                    <p
                      className="text-card"
                      style={{ marginTop: 6, fontWeight: 600 }}
                    >
                      {formatCurrencyBRL(property.priceValue)}
                    </p>
                    <p
                      className="text-card"
                      style={{ marginTop: 4, color: "var(--text-muted)", fontSize: "var(--fs-13)" }}
                    >
                      {property.bedrooms ? `${property.bedrooms} quartos` : ""}
                      {property.areaM2Value ? ` • ${property.areaM2Value} m²` : ""}
                    </p>
                    <Link
                      href={`/imoveis/${property.slug}`}
                      className="button button-primary"
                      style={{ width: "100%", marginTop: 12 }}
                    >
                      Ver imóvel
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Link href="/imoveis/prontos" className="button button-ghost">
              Ver todos os imóveis
            </Link>
          </div>
        </div>
      ) : null}

      {relatedPosts.length ? (
        <div className="container" style={{ marginTop: 56 }}>
          <div className="wp-section-head">
            <h2 className="section-title">Mais do blog</h2>
          </div>
          <div className="wp-property-grid wp-property-grid-3" style={{ marginTop: 20 }}>
            {relatedPosts.map((other) => {
              const cover = other.coverImageUrl ?? "/brand/logo-light-bg.png";
              return (
                <article key={other.id} className="wp-property-card compact">
                  <div
                    className="wp-property-media"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(7,13,24,0.05), rgba(7,13,24,0.6)), url(${cover})`
                    }}
                  />
                  <div className="wp-property-body">
                    <p
                      className="text-card"
                      style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--fs-12)" }}
                    >
                      {formatLongDate(other.publishedAt)}
                    </p>
                    <h3 style={{ marginTop: 6 }}>{other.title}</h3>
                    <p className="text-card" style={{ marginTop: 6 }}>
                      {other.excerpt}
                    </p>
                    <Link
                      href={`/blog/${other.slug}`}
                      className="button button-primary"
                      style={{ width: "100%", marginTop: 12 }}
                    >
                      Ler post
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </main>
  );
}
