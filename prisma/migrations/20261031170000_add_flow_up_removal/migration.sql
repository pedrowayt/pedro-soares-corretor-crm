ALTER TABLE "Lead" ADD COLUMN "flowUpRemovedAt" TIMESTAMP(3);
ALTER TABLE "Lead" ADD COLUMN "flowUpRemovedReason" TEXT;

CREATE INDEX "Lead_flowUpRemovedAt_idx" ON "Lead"("flowUpRemovedAt");
