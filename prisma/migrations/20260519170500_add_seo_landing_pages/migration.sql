-- CreateEnum
CREATE TYPE "SeoPageStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "SeoListingMode" AS ENUM ('TODOS', 'PRONTOS', 'PLANTA', 'LEILAO');

-- CreateTable
CREATE TABLE "SeoLandingPage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "listingMode" "SeoListingMode" NOT NULL DEFAULT 'TODOS',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "h1" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "keywords" TEXT[],
    "faqs" JSONB,
    "status" "SeoPageStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoLandingPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeoLandingPage_path_key" ON "SeoLandingPage"("path");

-- CreateIndex
CREATE INDEX "SeoLandingPage_status_idx" ON "SeoLandingPage"("status");

-- CreateIndex
CREATE INDEX "SeoLandingPage_city_district_idx" ON "SeoLandingPage"("city", "district");
