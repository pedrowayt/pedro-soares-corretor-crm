import type { MetadataRoute } from "next";
import { listPublishedBlogPosts } from "@/lib/data/blog";
import { listPublicBuilders, listPublicDevelopments } from "@/lib/data/developments";
import { listPublicProperties } from "@/lib/data/properties";
import { listPublishedSeoLandingPages } from "@/lib/data/seo-landing-pages";
import { slugify } from "@/lib/crm/slug";
import { getSiteUrl } from "@/lib/site-url";

const STATIC_ROUTE_LAST_MODIFIED = new Date("2026-06-09T00:00:00.000Z");

function cityToSeoSlug(city: string) {
  const normalized = slugify(city);
  return normalized.endsWith("-to") ? normalized : `${normalized}-to`;
}

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
  const [properties, developments, seoPages, builders, blogPosts] = await Promise.all([
    listPublicProperties(),
    listPublicDevelopments(),
    listPublishedSeoLandingPages(),
    listPublicBuilders(),
    listPublishedBlogPosts()
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

  const developmentRoutes = developments.map((development) => ({
    url: `${baseUrl}/lancamentos/${development.slug}`,
    lastModified: pickLastModified(
      (development as { updatedAt?: Date | string | null }).updatedAt,
      (development as { publishedAt?: Date | string | null }).publishedAt
    ),
    changeFrequency: "weekly" as const,
    priority: 0.9
  }));

  const builderRoutes = builders.map((builder) => ({
    url: `${baseUrl}/construtoras/${builder.slug}`,
    lastModified: pickLastModified(builder.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  const seoRoutes = seoPages.map((page) => ({
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

  // Auto-generated city/district/builder index routes — their freshness
  // tracks the latest development that lives in that bucket.
  const autoLaunchBuckets = new Map<string, Date | undefined>();
  developments.forEach((development) => {
    const devDate = toDate(
      (development as { updatedAt?: Date | string | null }).updatedAt
    );
    const citySlug = cityToSeoSlug(development.city);
    const targets = [`/${citySlug}/lancamentos`];
    if (development.district) {
      targets.push(`/${citySlug}/${slugify(development.district)}/lancamentos`);
    }
    const builderSlug =
      development.builder?.slug ??
      (development.displayBuilderName ? slugify(development.displayBuilderName) : null);
    if (builderSlug) {
      targets.push(`/${citySlug}/construtora/${builderSlug}/lancamentos`);
    }
    targets.forEach((path) => {
      const current = autoLaunchBuckets.get(path);
      autoLaunchBuckets.set(path, maxDate([current, devDate]));
    });
  });

  const autoLaunchRoutes = Array.from(autoLaunchBuckets.entries()).map(([path, date]) => ({
    url: `${baseUrl}${path}`,
    lastModified: pickLastModified(date),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  // Static routes use the freshness of the catalogue as a whole so they
  // signal "site refreshed" only when content actually changed, instead of
  // every crawl.
  const catalogueFreshness =
    maxDate([
      ...propertyRoutes.map((r) => toDate(r.lastModified)),
      ...developmentRoutes.map((r) => toDate(r.lastModified)),
      ...builderRoutes.map((r) => toDate(r.lastModified)),
      ...seoRoutes.map((r) => toDate(r.lastModified)),
      ...blogRoutes.map((r) => toDate(r.lastModified))
    ]) ?? STATIC_ROUTE_LAST_MODIFIED;

  const staticRoutes = [
    "",
    "/imoveis",
    "/imoveis/prontos",
    "/lancamentos",
    "/construtoras",
    "/imoveis/leilao",
    "/investidores",
    "/venda-seu-imovel",
    "/blog",
    "/sobre",
    "/contato",
    "/politica-de-cookies",
    "/politica-de-privacidade",
    "/termos-de-servico",
    "/termos-de-uso"
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: catalogueFreshness,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8
  }));

  return [
    ...staticRoutes,
    ...propertyRoutes,
    ...developmentRoutes,
    ...builderRoutes,
    ...autoLaunchRoutes,
    ...seoRoutes,
    ...blogRoutes
  ];
}
