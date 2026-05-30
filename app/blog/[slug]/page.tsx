import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Marked } from "marked";
import { BlogNewsletterForm } from "@/components/blog/BlogNewsletterForm";
import { BlogShareBar } from "@/components/blog/BlogShareBar";
import { BlogSidebarAuthor } from "@/components/blog/BlogSidebarAuthor";
import { BlogViewTracker } from "@/components/blog/BlogViewTracker";
import { listPublishedBlogPosts, listTopViewedBlogPosts } from "@/lib/data/blog";
import { listPublicProperties } from "@/lib/data/properties";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/utils";

export const revalidate = 60;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.pedrosoarescorretor.com.br";
const SITE_NAME = "Pedro Soares Imóveis";
const AUTHOR_NAME = "Pedro Soares";
const AUTHOR_CREDENTIAL = "CRECI 5861-TO";
const AUTHOR_AVATAR_URL = "/brand/pedro-portrait-1.png";
const WHATSAPP_URL =
  "https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20li%20um%20post%20do%20blog%20e%20quero%20falar%20sobre%20im%C3%B3veis.";
const INSTAGRAM_URL = "https://www.instagram.com/pedrosoarespmw/";

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
    authors: [{ name: AUTHOR_NAME }],
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
      authors: [AUTHOR_NAME],
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
  const authorName = AUTHOR_NAME;
  const reading = estimateReadingTime(post.bodyMarkdown);
  const publishedAt = post.publishedAt ?? null;
  const updatedAt = post.updatedAt ?? null;
  const url = `${baseUrl}/blog/${post.slug}`;

  const [allProperties, topViewedRaw] = await Promise.all([
    listPublicProperties(),
    listTopViewedBlogPosts(4)
  ]);

  const sidebarProperties = allProperties
    .filter((p) => p.status === "DISPONIVEL")
    .slice(0, 5);

  const trendingPosts = topViewedRaw.filter((p) => p.slug !== post.slug).slice(0, 3);

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
      <div className="container blog-post-layout">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <BlogViewTracker slug={post.slug} />

        <div className="blog-post-main">
          <p style={{ marginTop: 0 }}>
            <Link href="/blog">← Voltar para o blog</Link>
          </p>

        <article>
          <header>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {tags.map((tag: { id: string; label: string }) => (
                <span key={tag.id} className="badge">
                  {tag.label}
                </span>
              ))}
            </div>

            <h1 className="section-title" style={{ marginTop: 0 }}>
              {post.title}
            </h1>

            <div style={{ marginTop: 16 }}>
              <BlogShareBar url={url} title={post.title} excerpt={post.excerpt} />
            </div>

            <p className="blog-post-meta-line">
              Por {authorName}{" "}
              <span className="blog-author-credential">· {AUTHOR_CREDENTIAL}</span>
              {publishedAt ? (
                <>
                  {" · "}Publicado em{" "}
                  <time dateTime={publishedAt.toISOString()}>
                    {formatLongDate(publishedAt)} às {formatTime(publishedAt)}
                  </time>
                </>
              ) : null}
              {" · "}
              {reading.minutes} min de leitura
              {updatedAt && publishedAt && updatedAt.getTime() - publishedAt.getTime() > 60_000 ? (
                <>
                  {" · "}Atualizado em{" "}
                  <time dateTime={updatedAt.toISOString()}>{formatLongDate(updatedAt)}</time>
                </>
              ) : null}
            </p>

            {post.coverImageUrl ? (
              <div
                style={{
                  height: 320,
                  borderRadius: 16,
                  backgroundImage: `linear-gradient(180deg, rgba(7,13,24,0.05), rgba(7,13,24,0.35)), url(${post.coverImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  marginTop: 18
                }}
                role="img"
                aria-label={post.title}
              />
            ) : null}
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
                href={WHATSAPP_URL}
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
        </div>

        <aside className="blog-post-sidebar" aria-label="Sidebar do post">
          <BlogNewsletterForm
            source={`post:${post.slug}`}
            variant="compact"
            heading="Receba no e-mail"
            lede="Um envio semanal com bairros em alta, oportunidades e leituras do mercado."
          />

          {sidebarProperties.length ? (
            <section className="blog-sidebar-card" aria-labelledby="sidebar-properties-heading">
              <p className="blog-sidebar-eyebrow">Imóveis em destaque</p>
              <h3 id="sidebar-properties-heading" className="blog-sidebar-heading">
                Para conhecer agora
              </h3>
              <ul className="blog-sidebar-properties">
                {sidebarProperties.map((property) => {
                  const imageUrl = property.media?.[0]?.url ?? "/brand/logo-light-bg.png";
                  return (
                    <li key={property.id}>
                      <Link
                        href={`/imoveis/${property.slug}`}
                        className="blog-sidebar-property"
                        aria-label={`Ver ${property.title}`}
                      >
                        <span
                          className="blog-sidebar-property-thumb"
                          style={{ backgroundImage: `url(${imageUrl})` }}
                          aria-hidden="true"
                        />
                        <span className="blog-sidebar-property-info">
                          <span className="blog-sidebar-property-title">{property.title}</span>
                          <span className="blog-sidebar-property-meta">
                            {property.district} · {property.city}
                          </span>
                          <span className="blog-sidebar-property-price">
                            {formatCurrencyBRL(property.priceValue)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link href="/imoveis/prontos" className="blog-sidebar-link">
                Ver todos os imóveis →
              </Link>
            </section>
          ) : null}

          {trendingPosts.length ? (
            <section className="blog-sidebar-card" aria-labelledby="sidebar-trending-heading">
              <p className="blog-sidebar-eyebrow">🔥 Em alta</p>
              <h3 id="sidebar-trending-heading" className="blog-sidebar-heading">
                Mais lidos do blog
              </h3>
              <ol className="blog-sidebar-trending">
                {trendingPosts.map((other, index) => (
                  <li key={other.id}>
                    <span className="blog-sidebar-trending-rank">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <Link
                        href={`/blog/${other.slug}`}
                        className="blog-sidebar-trending-title"
                      >
                        {other.title}
                      </Link>
                      <span className="blog-sidebar-trending-meta">
                        {other.views ?? 0} {(other.views ?? 0) === 1 ? "leitura" : "leituras"}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <BlogSidebarAuthor whatsappUrl={WHATSAPP_URL} instagramUrl={INSTAGRAM_URL} />
        </aside>
      </div>
    </main>
  );
}
