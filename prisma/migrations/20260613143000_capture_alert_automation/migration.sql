ALTER TABLE "CaptureAlert"
  ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'olx',
  ADD COLUMN "searchUrl" TEXT,
  ADD COLUMN "maxResultsPerRun" INTEGER NOT NULL DEFAULT 8,
  ADD COLUMN "lastRunStatus" TEXT,
  ADD COLUMN "lastRunMessage" TEXT,
  ADD COLUMN "lastRunImportedCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastRunFoundCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastRunFailedCount" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "CaptureAlert_provider_active_lastRunAt_idx"
  ON "CaptureAlert"("provider", "active", "lastRunAt");
