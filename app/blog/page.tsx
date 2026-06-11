import type { Metadata } from "next";
import { BlogMagazineIndex } from "@/components/blog/BlogMagazineIndex";
import {
  listPublishedBlogCategoriesWithCounts,
  listPublishedBlogPosts,
  listTopViewedBlogPosts
} from "@/lib/data/blog";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 60;

const baseUrl = getSiteUrl();

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

export default async function BlogIndexPage({
  searchParams
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const sp = await searchParams;
  const tagSlug = (sp.tag ?? "").trim() || null;

  const [posts, categories, topViewed] = await Promise.all([
    listPublishedBlogPosts(undefined, tagSlug ? { tagSlug } : undefined),
    listPublishedBlogCategoriesWithCounts(),
    listTopViewedBlogPosts(3)
  ]);

  const activeLabel = tagSlug ? `tag ${tagSlug}` : null;

  return (
    <BlogMagazineIndex
      posts={posts}
      categories={categories}
      topViewed={topViewed}
      activeLabel={activeLabel}
    />
  );
}
