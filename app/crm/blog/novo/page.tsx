import Link from "next/link";
import { BlogPostForm } from "@/components/crm/blog-form";

export default function CrmBlogNewPage() {
  return (
    <>
      <p style={{ marginTop: 0 }}>
        <Link href="/crm/blog">← Voltar para o blog</Link>
      </p>
      <h1 className="section-title" style={{ marginTop: 0 }}>
        Novo post
      </h1>
      <p className="section-subtitle">
        Comece como rascunho, revise e publique quando estiver pronto.
      </p>
      <div style={{ marginTop: 16 }}>
        <BlogPostForm />
      </div>
    </>
  );
}
