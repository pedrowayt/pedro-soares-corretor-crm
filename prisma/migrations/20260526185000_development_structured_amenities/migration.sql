-- CreateEnum
CREATE TYPE "DevelopmentAmenityType" AS ENUM ('LAZER', 'DIFERENCIAL');

-- CreateTable
CREATE TABLE "DevelopmentAmenity" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "towerId" TEXT,
    "type" "DevelopmentAmenityType" NOT NULL DEFAULT 'LAZER',
    "label" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isHighlighted" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DevelopmentAmenity_developmentId_type_position_idx" ON "DevelopmentAmenity"("developmentId", "type", "position");

-- CreateIndex
CREATE INDEX "DevelopmentAmenity_towerId_type_position_idx" ON "DevelopmentAmenity"("towerId", "type", "position");

-- AddForeignKey
ALTER TABLE "DevelopmentAmenity" ADD CONSTRAINT "DevelopmentAmenity_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentAmenity" ADD CONSTRAINT "DevelopmentAmenity_towerId_fkey" FOREIGN KEY ("towerId") REFERENCES "DevelopmentTower"("id") ON DELETE SET NULL ON UPDATE CASCADE;
