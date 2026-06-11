import { buildMarketplaceFeedResponse } from "@/lib/integrations/portal-feed-response";

export async function GET() {
  return buildMarketplaceFeedResponse("vivareal", "vrsync");
}
