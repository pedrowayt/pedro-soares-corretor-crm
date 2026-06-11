import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogMagazineIndex } from "@/components/blog/BlogMagazineIndex";
import {
  getPublishedBlogCategoryBySlug,
  listPublishedBlogCategoriesWithCounts,
  listPublishedBlogPosts,
  listTopViewedBlogPosts
} from "@/lib/data/blog";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

const baseUrl = getSiteUrl();

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPublishedBlogCategoryBySlug(slug);
  if (!category) return { title: "Categoria não encontrada | Blog Pedro Soares Imóveis" };

  const url = `${baseUrl}/blog/categoria/${category.slug}`;
  const title = category.seoTitle || `${category.label} | Blog Pedro Soares Imóveis`;
  const description =
    category.seoDescription ||
    category.description ||
    `Notícias e análises sobre ${category.label.toLowerCase()} no mercado imobiliário em Palmas TO.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "pt_BR"
    }
  };
}

export default async function BlogCategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getPublishedBlogCategoryBySlug(slug);
  if (!category) notFound();

  const [posts, categories, topViewed] = await Promise.all([
    listPublishedBlogPosts(undefined, { categorySlug: category.slug }),
    listPublishedBlogCategoriesWithCounts(),
    listTopViewedBlogPosts(3)
  ]);

  return (
    <BlogMagazineIndex
      posts={posts}
      categories={categories}
      topViewed={topViewed}
      activeCategorySlug={category.slug}
      activeLabel={category.label}
    />
  );
}
