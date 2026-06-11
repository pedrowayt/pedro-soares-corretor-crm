import Link from "next/link";
import { BlogCategoryManager } from "@/components/crm/blog-category-manager";
import { listCrmBlogCategories } from "@/lib/data/blog";

export default async function CrmBlogCategoriesPage() {
  const categories = await listCrmBlogCategories();

  return (
    <>
      <p style={{ marginTop: 0 }}>
        <Link href="/crm/blog">← Voltar para o blog</Link>
      </p>
      <h1 className="section-title" style={{ marginTop: 0 }}>
        Categorias do blog
      </h1>
      <p className="section-subtitle">
        Cadastre as categorias principais usadas no blog público e nos filtros do CRM.
      </p>
      <div style={{ marginTop: 16 }}>
        <BlogCategoryManager initialCategories={categories} />
      </div>
    </>
  );
}
