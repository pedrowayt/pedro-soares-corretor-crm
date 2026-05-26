-- AlterTable
ALTER TABLE "DevelopmentMedia" ADD COLUMN "towerId" TEXT;
ALTER TABLE "DevelopmentMedia" ADD COLUMN "unitTypeId" TEXT;

-- CreateIndex
CREATE INDEX "DevelopmentMedia_towerId_idx" ON "DevelopmentMedia"("towerId");

-- CreateIndex
CREATE INDEX "DevelopmentMedia_unitTypeId_idx" ON "DevelopmentMedia"("unitTypeId");

-- AddForeignKey
ALTER TABLE "DevelopmentMedia" ADD CONSTRAINT "DevelopmentMedia_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "DevelopmentTower"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentMedia" ADD CONSTRAINT "DevelopmentMedia_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "DevelopmentUnitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
