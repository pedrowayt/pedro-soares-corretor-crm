export const MARKETPLACE_PORTALS = [
  {
    id: "olx",
    label: "OLX",
    type: "XML OLX",
    feedPath: "/api/feeds/olx",
    description: "Feed XML dedicado para anúncios selecionados na OLX."
  },
  {
    id: "zap",
    label: "ZAP Imóveis",
    type: "XML VRSync",
    feedPath: "/api/feeds/zap",
    description: "Feed VRSync compartilhado com o padrão VivaReal/ZAP."
  },
  {
    id: "vivareal",
    label: "Viva Real",
    type: "XML VRSync",
    feedPath: "/api/feeds/vivareal",
    description: "Feed VRSync para publicação no Viva Real."
  }
] as const;

export type MarketplacePortalId = (typeof MARKETPLACE_PORTALS)[number]["id"];

const PORTAL_LABELS = new Map(MARKETPLACE_PORTALS.map((portal) => [portal.id, portal.label]));

export function isMarketplacePortalId(input: string): input is MarketplacePortalId {
  return MARKETPLACE_PORTALS.some((portal) => portal.id === input);
}

export function getMarketplacePortalLabel(portalId: string) {
  return PORTAL_LABELS.get(portalId as MarketplacePortalId) ?? portalId;
}

export function getMarketplaceFeedUrl(siteUrl: string, portalId: MarketplacePortalId) {
  const portal = MARKETPLACE_PORTALS.find((item) => item.id === portalId);
  return portal ? `${siteUrl}${portal.feedPath}` : siteUrl;
}
