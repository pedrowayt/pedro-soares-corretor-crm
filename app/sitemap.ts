import type { MetadataRoute } from "next";
import { listPublicDevelopments } from "@/lib/data/developments";
import { listPublicProperties } from "@/lib/data/properties";
import { listPublishedSeoLandingPages } from "@/lib/data/seo-landing-pages";
import { slugify } from "@/lib/crm/slug";

function cityToSeoSlug(city: string) {
  const normalized = slugify(city);
  return normalized.endsWith("-to") ? normalized : `${normalized}-to`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const [properties, developments, seoPages] = await Promise.all([
    listPublicProperties(),
    listPublicDevelopments(),
    listPublishedSeoLandingPages()
  ]);

  const staticRoutes = [
    "",
    "/imoveis",
    "/imoveis/prontos",
    "/lancamentos",
    "/imoveis/leilao",
    "/investidores",
    "/venda-seu-imovel",
    "/sobre",
    "/contato",
    "/politica-de-cookies",
    "/politica-de-privacidade",
    "/termos-de-servico",
    "/termos-de-uso"
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8
  }));

  const propertyRoutes = properties.map((property) => ({
    url: `${baseUrl}/imoveis/${property.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9
  }));

  const developmentRoutes = developments.map((development) => ({
    url: `${baseUrl}/lancamentos/${development.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9
  }));

  const seoRoutes = seoPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: page.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.85
  }));

  const autoLaunchRoutesSet = new Set<string>();

  developments.forEach((development) => {
    const citySlug = cityToSeoSlug(development.city);
    autoLaunchRoutesSet.add(`/${citySlug}/lancamentos`);

    if (development.district) {
      autoLaunchRoutesSet.add(`/${citySlug}/${slugify(development.district)}/lancamentos`);
    }

    const builderSlug = development.builder?.slug ?? (development.displayBuilderName ? slugify(development.displayBuilderName) : null);
    if (builderSlug) {
      autoLaunchRoutesSet.add(`/${citySlug}/construtora/${builderSlug}/lancamentos`);
    }
  });

  const autoLaunchRoutes = Array.from(autoLaunchRoutesSet).map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  return [...staticRoutes, ...propertyRoutes, ...developmentRoutes, ...autoLaunchRoutes, ...seoRoutes];
}
