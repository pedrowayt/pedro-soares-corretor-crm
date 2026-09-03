-- CreateEnum
CREATE TYPE "LandingPageType" AS ENUM ('DEVELOPMENT', 'CAMPAIGN', 'REGION', 'CAPTURE');

-- CreateEnum
CREATE TYPE "LandingPageStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'PAUSED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "LandingPage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "publicPath" TEXT NOT NULL,
    "type" "LandingPageType" NOT NULL DEFAULT 'CAMPAIGN',
    "status" "LandingPageStatus" NOT NULL DEFAULT 'DRAFT',
    "formKey" TEXT,
    "deployUrl" TEXT,
    "deployRef" TEXT,
    "publishedAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "linkedDevelopmentId" TEXT,

    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "landingPageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "LandingPage_slug_key" ON "LandingPage"("slug");
CREATE UNIQUE INDEX "LandingPage_publicPath_key" ON "LandingPage"("publicPath");
CREATE INDEX "LandingPage_status_idx" ON "LandingPage"("status");
CREATE INDEX "LandingPage_type_idx" ON "LandingPage"("type");
CREATE INDEX "LandingPage_linkedDevelopmentId_idx" ON "LandingPage"("linkedDevelopmentId");
CREATE INDEX "Lead_landingPageId_idx" ON "Lead"("landingPageId");

-- AddForeignKey
ALTER TABLE "LandingPage" ADD CONSTRAINT "LandingPage_linkedDevelopmentId_fkey" FOREIGN KEY ("linkedDevelopmentId") REFERENCES "Development"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Register the first Codex-managed custom landing.
INSERT INTO "LandingPage" (
    "id", "name", "slug", "publicPath", "type", "status", "formKey", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
    'landing-lake-village',
    'Lake Village Residences',
    'lake-village',
    '/lake-village',
    'CAMPAIGN',
    'PUBLISHED',
    'development-interest',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Register the second Codex-managed custom landing.
INSERT INTO "LandingPage" (
    "id", "name", "slug", "publicPath", "type", "status", "formKey", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
    'landing-quinta-do-lago',
    'Quinta do Lago',
    'quinta-do-lago',
    '/quinta-do-lago',
    'CAMPAIGN',
    'PUBLISHED',
    'development-interest',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
