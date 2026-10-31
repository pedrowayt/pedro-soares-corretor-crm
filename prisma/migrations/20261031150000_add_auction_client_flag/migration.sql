ALTER TABLE "Lead" ADD COLUMN "isAuctionClient" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "Lead_isAuctionClient_idx" ON "Lead"("isAuctionClient");
