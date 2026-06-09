CREATE TYPE "AuctionImportStatus" AS ENUM ('NEEDS_REVIEW', 'READY', 'PUBLISHED', 'ERROR');

ALTER TABLE "AuctionCase"
  ADD COLUMN "firstAuctionDate" TIMESTAMP(3),
  ADD COLUMN "secondAuctionDate" TIMESTAMP(3),
  ADD COLUMN "appraisedValue" DECIMAL(14,2),
  ADD COLUMN "appraisalUrl" TEXT,
  ADD COLUMN "registryUrl" TEXT,
  ADD COLUMN "bidUrl" TEXT,
  ADD COLUMN "lotCode" TEXT,
  ADD COLUMN "auctioneerName" TEXT,
  ADD COLUMN "auctionType" TEXT,
  ADD COLUMN "auctionMode" TEXT,
  ADD COLUMN "registryNumber" TEXT,
  ADD COLUMN "registryOffice" TEXT,
  ADD COLUMN "occupancyStatus" TEXT,
  ADD COLUMN "debtsInfo" TEXT,
  ADD COLUMN "documentLinks" JSONB;

CREATE TABLE "AuctionImport" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "externalId" TEXT NOT NULL,
  "originalUrl" TEXT NOT NULL,
  "status" "AuctionImportStatus" NOT NULL DEFAULT 'NEEDS_REVIEW',
  "rawPayload" JSONB NOT NULL,
  "missingFields" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "lastImportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "propertyId" TEXT,

  CONSTRAINT "AuctionImport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AuctionImport_source_externalId_key" ON "AuctionImport"("source", "externalId");
CREATE INDEX "AuctionImport_status_lastImportedAt_idx" ON "AuctionImport"("status", "lastImportedAt");
CREATE INDEX "AuctionImport_propertyId_idx" ON "AuctionImport"("propertyId");

ALTER TABLE "AuctionImport"
  ADD CONSTRAINT "AuctionImport_propertyId_fkey"
  FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
