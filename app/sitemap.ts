import type { MetadataRoute } from "next";
import {
  listPublishedBlogCategoriesWithCounts,
  listPublishedBlogPosts
} from "@/lib/data/blog";
import { listPublicProperties } from "@/lib/data/properties";
import { listPublishedSeoLandingPages } from "@/lib/data/seo-landing-pages";
import { getSiteUrl } from "@/lib/site-url";

const STATIC_ROUTE_LAST_MODIFIED = new Date("2026-06-09T00:00:00.000Z");

function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : undefined;
  const parsed = new Date(value as string | number);
  return Number.isFinite(parsed.getTime()) ? parsed : undefined;
}

function pickLastModified(...candidates: Array<unknown>): Date {
  for (const candidate of candidates) {
    const date = toDate(candidate);
    if (date) return date;
  }
  return new Date();
}

function maxDate(dates: Array<Date | undefined>): Date | undefined {
  const valid = dates.filter((d): d is Date => Boolean(d));
  if (!valid.length) return undefined;
  return new Date(Math.max(...valid.map((d) => d.getTime())));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const [properties, seoPages, blogPosts, blogCategories] = await Promise.all([
    listPublicProperties(),
    listPublishedSeoLandingPages(),
    listPublishedBlogPosts(),
    listPublishedBlogCategoriesWithCounts()
  ]);

  // Per-record routes use the row's own updatedAt so Google can detect real
  // changes; if missing (mock/fallback data) we fall back to "now".
  const propertyRoutes = properties.map((property) => ({
    url: `${baseUrl}/imoveis/${property.slug}`,
    lastModified: pickLastModified(
      (property as { updatedAt?: Date | string | null }).updatedAt,
      (property as { createdAt?: Date | string | null }).createdAt
    ),
    changeFrequency: "weekly" as const,
    priority: 0.9
  }));

  const seoRoutes = seoPages
    .filter((page) => page.path !== "/palmas-to/imoveis-na-planta")
    .map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: pickLastModified(page.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.85
    }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: pickLastModified(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  const blogCategoryRoutes = blogCategories.map((category) => ({
    url: `${baseUrl}/blog/categoria/${category.slug}`,
    lastModified: pickLastModified(
      category.updatedAt,
      maxDate(
        blogPosts
          .filter((post) => post.category?.slug === category.slug)
          .map((post) => toDate(post.updatedAt))
      )
    ),
    changeFrequency: "weekly" as const,
    priority: 0.65
  }));

  // Static routes use the freshness of the catalogue as a whole so they
  // signal "site refreshed" only when content actually changed, instead of
  // every crawl.
  const catalogueFreshness =
    maxDate([
      ...propertyRoutes.map((r) => toDate(r.lastModified)),
      ...seoRoutes.map((r) => toDate(r.lastModified)),
      ...blogRoutes.map((r) => toDate(r.lastModified)),
      ...blogCategoryRoutes.map((r) => toDate(r.lastModified))
    ]) ?? STATIC_ROUTE_LAST_MODIFIED;

  const staticRoutes = [
    "",
    "/imoveis",
    "/imoveis/prontos",
    "/lancamentos",
    "/imoveis/leilao",
    "/investidores",
    "/venda-seu-imovel",
    "/blog",
    "/sobre",
    "/contato",
    "/politica-de-cookies",
    "/politica-de-privacidade",
    "/termos-de-servico",
    "/termos-de-uso",
    "/palmas-lake",
    "/palmas-lake/lake-sky",
    "/palmas-lake/lake-garden",
    "/palmas-lake/lake-park",
    "/palmas-lake/lake-loft",
    "/palmas-lake/lake-office",
    "/palmas-lake/lake-mall",
    "/lake-village",
    "/quinta-do-lago",
    "/acordes",
    "/like-210"
    "/you",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: catalogueFreshness,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8
  }));

  return [
    ...staticRoutes,
    ...propertyRoutes,
    ...seoRoutes,
    ...blogRoutes,
    ...blogCategoryRoutes
  ];
}
