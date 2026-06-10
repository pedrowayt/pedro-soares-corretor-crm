CREATE TABLE "AuctionImportSource" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "sourceKey" TEXT NOT NULL,
  "tokenHash" TEXT,
  "tokenPreview" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "allowedDomains" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "notes" TEXT,
  "lastImportAt" TIMESTAMP(3),
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AuctionImportSource_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AuctionImportSource_sourceKey_key" ON "AuctionImportSource"("sourceKey");
CREATE UNIQUE INDEX "AuctionImportSource_tokenHash_key" ON "AuctionImportSource"("tokenHash");
CREATE INDEX "AuctionImportSource_active_idx" ON "AuctionImportSource"("active");
