import { buildMarketplaceFeedResponse } from "@/lib/integrations/portal-feed-response";

export const dynamic = "force-dynamic";

export async function GET() {
  return buildMarketplaceFeedResponse("olx", "olx");
}
