-- CreateEnum
CREATE TYPE "CaptureSourceKind" AS ENUM ('MANUAL', 'PORTAL', 'CSV', 'API');

-- CreateEnum
CREATE TYPE "CapturedListingStatus" AS ENUM ('NOVO', 'EM_ANALISE', 'CAPTADO', 'DESCARTADO');

-- CreateTable
CREATE TABLE "CaptureSource" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "kind" "CaptureSourceKind" NOT NULL DEFAULT 'MANUAL',
  "baseUrl" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CaptureSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapturedListing" (
  "id" TEXT NOT NULL,
  "status" "CapturedListingStatus" NOT NULL DEFAULT 'NOVO',
  "title" TEXT NOT NULL,
  "description" TEXT,
  "sourceName" TEXT,
  "externalId" TEXT,
  "sourceUrl" TEXT,
  "purpose" "PropertyPurpose" NOT NULL,
  "type" "PropertyType" NOT NULL,
  "price" DECIMAL(14,2) NOT NULL,
  "address" TEXT,
  "city" TEXT NOT NULL,
  "district" TEXT NOT NULL,
  "postalCode" TEXT,
  "latitude" DECIMAL(10,7),
  "longitude" DECIMAL(10,7),
  "areaM2" DECIMAL(10,2),
  "landAreaM2" DECIMAL(12,2),
  "bedrooms" INTEGER,
  "suites" INTEGER,
  "bathrooms" INTEGER,
  "parkingSpaces" INTEGER,
  "advertiserName" TEXT,
  "advertiserPhone" TEXT,
  "advertiserEmail" TEXT,
  "isPrivateSeller" BOOLEAN NOT NULL DEFAULT false,
  "hasFullAddress" BOOLEAN NOT NULL DEFAULT false,
  "adAgeDays" INTEGER,
  "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "marketAvgPrice" DECIMAL(14,2),
  "marketAvgPriceM2" DECIMAL(14,2),
  "marketOpportunity" DECIMAL(14,2),
  "opportunityScore" INTEGER NOT NULL DEFAULT 0,
  "rawPayload" JSONB,
  "notes" TEXT,
  "capturedAt" TIMESTAMP(3),
  "discardedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "sourceId" TEXT,
  "assignedToId" TEXT,
  "linkedOwnerId" TEXT,
  "linkedPropertyId" TEXT,
  "linkedLeadId" TEXT,

  CONSTRAINT "CapturedListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaptureAlert" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "district" TEXT,
  "purpose" "PropertyPurpose",
  "type" "PropertyType",
  "priceMin" DECIMAL(14,2),
  "priceMax" DECIMAL(14,2),
  "onlyPrivateSeller" BOOLEAN NOT NULL DEFAULT false,
  "onlyFullAddress" BOOLEAN NOT NULL DEFAULT false,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "lastRunAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "ownerUserId" TEXT,

  CONSTRAINT "CaptureAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaptureSource_name_key" ON "CaptureSource"("name");

-- CreateIndex
CREATE INDEX "CaptureSource_kind_active_idx" ON "CaptureSource"("kind", "active");

-- CreateIndex
CREATE UNIQUE INDEX "CapturedListing_sourceUrl_key" ON "CapturedListing"("sourceUrl");

-- CreateIndex
CREATE UNIQUE INDEX "CapturedListing_sourceId_externalId_key" ON "CapturedListing"("sourceId", "externalId");

-- CreateIndex
CREATE INDEX "CapturedListing_status_updatedAt_idx" ON "CapturedListing"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "CapturedListing_city_district_idx" ON "CapturedListing"("city", "district");

-- CreateIndex
CREATE INDEX "CapturedListing_purpose_type_idx" ON "CapturedListing"("purpose", "type");

-- CreateIndex
CREATE INDEX "CapturedListing_isPrivateSeller_hasFullAddress_idx" ON "CapturedListing"("isPrivateSeller", "hasFullAddress");

-- CreateIndex
CREATE INDEX "CapturedListing_opportunityScore_idx" ON "CapturedListing"("opportunityScore");

-- CreateIndex
CREATE INDEX "CapturedListing_assignedToId_status_idx" ON "CapturedListing"("assignedToId", "status");

-- CreateIndex
CREATE INDEX "CaptureAlert_active_city_district_idx" ON "CaptureAlert"("active", "city", "district");

-- CreateIndex
CREATE INDEX "CaptureAlert_ownerUserId_active_idx" ON "CaptureAlert"("ownerUserId", "active");

-- AddForeignKey
ALTER TABLE "CapturedListing" ADD CONSTRAINT "CapturedListing_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "CaptureSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapturedListing" ADD CONSTRAINT "CapturedListing_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapturedListing" ADD CONSTRAINT "CapturedListing_linkedOwnerId_fkey" FOREIGN KEY ("linkedOwnerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapturedListing" ADD CONSTRAINT "CapturedListing_linkedPropertyId_fkey" FOREIGN KEY ("linkedPropertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapturedListing" ADD CONSTRAINT "CapturedListing_linkedLeadId_fkey" FOREIGN KEY ("linkedLeadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaptureAlert" ADD CONSTRAINT "CaptureAlert_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
