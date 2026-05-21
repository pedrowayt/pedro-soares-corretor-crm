-- Expand construction stages for investment-positioning module.
ALTER TYPE "DevelopmentStage" ADD VALUE IF NOT EXISTS 'FOUNDATION_COMPLETED';
ALTER TYPE "DevelopmentStage" ADD VALUE IF NOT EXISTS 'ADVANCED_STRUCTURE';
ALTER TYPE "DevelopmentStage" ADD VALUE IF NOT EXISTS 'FINISHING';
ALTER TYPE "DevelopmentStage" ADD VALUE IF NOT EXISTS 'READY_TO_MOVE';

UPDATE "Development"
SET "stage" = 'LAUNCH'
WHERE "stage" = 'SALES';

ALTER TABLE "Development"
  ADD COLUMN "constructionProgressPct" INTEGER,
  ADD COLUMN "appreciationPotential" TEXT,
  ADD COLUMN "buyerProfile" TEXT,
  ADD COLUMN "opportunityText" TEXT,
  ADD COLUMN "showInvestmentPotentialBlock" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "Development"
  ADD CONSTRAINT "Development_constructionProgressPct_check"
  CHECK (
    "constructionProgressPct" IS NULL
    OR ("constructionProgressPct" >= 0 AND "constructionProgressPct" <= 100)
  );
