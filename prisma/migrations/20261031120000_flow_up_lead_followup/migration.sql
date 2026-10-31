ALTER TABLE "Lead" ADD COLUMN "targetValue" DECIMAL(14,2);
ALTER TABLE "Lead" ADD COLUMN "interestDescription" TEXT;
ALTER TABLE "Lead" ADD COLUMN "nextFollowUpAt" TIMESTAMP(3);
CREATE INDEX "Lead_nextFollowUpAt_idx" ON "Lead"("nextFollowUpAt");
