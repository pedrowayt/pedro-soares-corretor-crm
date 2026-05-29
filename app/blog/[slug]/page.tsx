import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Marked } from "marked";
import { listPublishedBlogPosts } from "@/lib/data/blog";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const blogMarkdownRenderer = new Marked({
  async: false,
  gfm: true,
  breaks: false
});

function renderMarkdown(value: string) {
  return blogMarkdownRenderer.parse(value) as string;
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
  if (!post) return { title: "Post não encontrado | Pedro Soares Imóveis" };

  return {
    title: `${post.title} | Blog Pedro Soares Imóveis`,
    description: post.excerpt,
    alternates: { canonical: `${baseUrl}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${baseUrl}/blog/${post.slug}`,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
      publishedTime: post.publishedAt?.toISOString()
    }
  };
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(
    date
  );
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
  const authorName =
    "author" in post && post.author ? post.author.name : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: authorName
      ? { "@type": "Person", name: authorName }
      : { "@type": "Organization", name: "Pedro Soares Imóveis" },
    publisher: {
      "@type": "Organization",
      name: "Pedro Soares Imóveis",
      logo: { "@type": "ImageObject", url: `${baseUrl}/brand/logo-light-bg.png` }
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/blog/${post.slug}` }
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 820 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <p style={{ marginTop: 0 }}>
          <Link href="/blog">← Voltar para o blog</Link>
        </p>

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
        <p className="text-card" style={{ color: "var(--text-muted)" }}>
          {formatDate(post.publishedAt)}
          {authorName ? ` • ${authorName}` : ""}
        </p>

        <article
          className="blog-article"
          style={{ marginTop: 24, lineHeight: 1.7, fontSize: "var(--fs-18)" }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

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
      </div>
    </main>
  );
}
