CREATE TABLE "SiteVisit" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "content" TEXT,
    "term" TEXT,
    "gclid" TEXT,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteVisit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SiteVisit_createdAt_idx" ON "SiteVisit"("createdAt");
CREATE INDEX "SiteVisit_path_createdAt_idx" ON "SiteVisit"("path", "createdAt");
CREATE INDEX "SiteVisit_sessionId_createdAt_idx" ON "SiteVisit"("sessionId", "createdAt");
CREATE INDEX "SiteVisit_source_medium_createdAt_idx" ON "SiteVisit"("source", "medium", "createdAt");
