import { listFeedPropertiesForPortal, markPortalPublicationsSynced } from "@/lib/data/portal-publications";
import { buildOlxFeedXml, buildPortalFeedXml } from "@/lib/feeds/portal-feed";
import type { MarketplacePortalId } from "@/lib/integrations/marketplace-portals";

type FeedKind = "olx" | "vrsync";

export async function buildMarketplaceFeedResponse(portalName: MarketplacePortalId, kind: FeedKind) {
  const properties = await listFeedPropertiesForPortal(portalName);
  const xml = kind === "olx" ? buildOlxFeedXml(properties) : buildPortalFeedXml(properties);

  await markPortalPublicationsSynced(properties.map((property) => property.publicationId)).catch(() => null);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=900"
    }
  });
}
