import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/crm/blog-form";
import { getCrmBlogPostById } from "@/lib/data/blog";

export default async function CrmBlogEditPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getCrmBlogPostById(id);
  if (!post) notFound();

  return (
    <>
      <p style={{ marginTop: 0 }}>
        <Link href="/crm/blog">← Voltar para o blog</Link>
      </p>
      <h1 className="section-title" style={{ marginTop: 0 }}>
        Editar post
      </h1>
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
            tagSlugs: post.tags.map((tag) => tag.slug)
          }}
        />
      </div>
    </>
  );
}
