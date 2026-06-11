import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/crm/blog-form";
import { getCrmBlogPostById, listCrmBlogCategories } from "@/lib/data/blog";

export default async function CrmBlogEditPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getCrmBlogPostById(id),
    listCrmBlogCategories()
  ]);
  if (!post) notFound();

  return (
    <>
      <p style={{ marginTop: 0 }}>
        <Link href="/crm/blog">← Voltar para o blog</Link>
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap"
        }}
      >
        <h1 className="section-title" style={{ marginTop: 0 }}>
          Editar post
        </h1>
        {post.status === "PUBLISHED" ? (
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-ghost"
          >
            Ver publicação ↗
          </a>
        ) : null}
      </div>
      <p className="section-subtitle">
        URL pública: <code>/blog/{post.slug}</code>
        {post.publishedAt ? ` • publicado em ${post.publishedAt.toLocaleDateString("pt-BR")}` : ""}
      </p>
      <div style={{ marginTop: 16 }}>
        <BlogPostForm
          initial={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            coverImageUrl: post.coverImageUrl,
            bodyMarkdown: post.bodyMarkdown,
            status: post.status,
            categoryId: post.categoryId,
            tagSlugs: post.tags.map((tag) => tag.slug),
            seoTitle: post.seoTitle,
            seoDescription: post.seoDescription,
            seoKeyword: post.seoKeyword,
            seoOgImageUrl: post.seoOgImageUrl,
            seoNoIndex: post.seoNoIndex
          }}
          categories={categories}
        />
      </div>
    </>
  );
}
