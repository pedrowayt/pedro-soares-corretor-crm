-- CreateEnum
CREATE TYPE "DevelopmentUnitStatus" AS ENUM ('DISPONIVEL', 'RESERVADA', 'VENDIDA', 'BLOQUEADA');

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "linkedDevelopmentUnitId" TEXT;

-- AlterTable
ALTER TABLE "LeadInteraction" ADD COLUMN "unitId" TEXT;

-- AlterTable
ALTER TABLE "DevelopmentUnitType" ADD COLUMN "towerId" TEXT;

-- CreateTable
CREATE TABLE "DevelopmentTower" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "propertyType" "DevelopmentPropertyType",
    "description" TEXT,
    "floorsCount" INTEGER,
    "elevatorsCount" INTEGER,
    "totalUnits" INTEGER,
    "availableUnits" INTEGER,
    "deliveryDate" TIMESTAMP(3),
    "incorporationRegistry" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentTower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentUnit" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "towerId" TEXT,
    "unitTypeId" TEXT,
    "label" TEXT NOT NULL,
    "unitNumber" TEXT,
    "floor" INTEGER,
    "status" "DevelopmentUnitStatus" NOT NULL DEFAULT 'DISPONIVEL',
    "price" DECIMAL(14,2),
    "areaPrivateM2" DECIMAL(10,2),
    "areaTotalM2" DECIMAL(10,2),
    "parkingSpaces" INTEGER,
    "orientation" TEXT,
    "notes" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentUnit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_linkedDevelopmentUnitTypeId_idx" ON "Lead"("linkedDevelopmentUnitTypeId");

-- CreateIndex
CREATE INDEX "Lead_linkedDevelopmentUnitId_idx" ON "Lead"("linkedDevelopmentUnitId");

-- CreateIndex
CREATE INDEX "LeadInteraction_unitId_idx" ON "LeadInteraction"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentTower_developmentId_slug_key" ON "DevelopmentTower"("developmentId", "slug");

-- CreateIndex
CREATE INDEX "DevelopmentTower_developmentId_position_idx" ON "DevelopmentTower"("developmentId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentUnit_towerId_unitNumber_key" ON "DevelopmentUnit"("towerId", "unitNumber");

-- CreateIndex
CREATE INDEX "DevelopmentUnit_developmentId_status_idx" ON "DevelopmentUnit"("developmentId", "status");

-- CreateIndex
CREATE INDEX "DevelopmentUnit_towerId_status_idx" ON "DevelopmentUnit"("towerId", "status");

-- CreateIndex
CREATE INDEX "DevelopmentUnit_unitTypeId_status_idx" ON "DevelopmentUnit"("unitTypeId", "status");

-- CreateIndex
CREATE INDEX "DevelopmentUnitType_towerId_idx" ON "DevelopmentUnitType"("towerId");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_linkedDevelopmentUnitId_fkey" FOREIGN KEY ("linkedDevelopmentUnitId") REFERENCES "DevelopmentUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadInteraction" ADD CONSTRAINT "LeadInteraction_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "DevelopmentUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentTower" ADD CONSTRAINT "DevelopmentTower_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentUnitType" ADD CONSTRAINT "DevelopmentUnitType_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "DevelopmentTower"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentUnit" ADD CONSTRAINT "DevelopmentUnit_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentUnit" ADD CONSTRAINT "DevelopmentUnit_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "DevelopmentTower"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentUnit" ADD CONSTRAINT "DevelopmentUnit_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "DevelopmentUnitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
