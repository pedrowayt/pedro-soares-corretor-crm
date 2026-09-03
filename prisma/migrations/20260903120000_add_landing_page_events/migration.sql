-- CreateEnum
CREATE TYPE "LandingPageEventType" AS ENUM ('PAGE_VIEW', 'CTA_CLICK', 'FORM_START', 'FORM_SUBMISSION', 'WHATSAPP_CLICK', 'DOWNLOAD');

-- CreateTable
CREATE TABLE "LandingPageEvent" (
    "id" TEXT NOT NULL,
    "landingPageId" TEXT NOT NULL,
    "type" "LandingPageEventType" NOT NULL,
    "sessionId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandingPageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LandingPageEvent_landingPageId_type_createdAt_idx" ON "LandingPageEvent"("landingPageId", "type", "createdAt");
CREATE INDEX "LandingPageEvent_landingPageId_createdAt_idx" ON "LandingPageEvent"("landingPageId", "createdAt");

-- AddForeignKey
ALTER TABLE "LandingPageEvent" ADD CONSTRAINT "LandingPageEvent_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
