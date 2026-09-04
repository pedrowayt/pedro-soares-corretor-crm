import { listCrmLandingPages } from "@/lib/data/marketing-landing-pages";
import { getSiteUrl } from "@/lib/site-url";
import { LandingPagesList } from "@/components/crm/landing-pages-list";

export default async function CrmLandingPagesPage() {
  const pages = await listCrmLandingPages();
  const siteUrl = getSiteUrl();
  const serializedPages = pages.map((page) => ({
    id: page.id,
    name: page.name,
    slug: page.slug,
    publicPath: page.publicPath,
    type: page.type,
    status: page.status,
    deployUrl: page.deployUrl,
    deployRef: page.deployRef,
    linkedDevelopment: page.linkedDevelopment,
    publishedAt: page.publishedAt?.toISOString() ?? null,
    updatedAt: page.updatedAt.toISOString(),
    leads: page._count.leads,
    metrics: page.metrics
  }));

  return <LandingPagesList pages={serializedPages} siteUrl={siteUrl} />;
}
