-- New enums for developments v2
CREATE TYPE "DevelopmentPropertyType" AS ENUM ('APARTAMENTO', 'CASA', 'LOTE', 'SALA_COMERCIAL', 'STUDIO', 'COBERTURA');
CREATE TYPE "DevelopmentUnitCategory" AS ENUM ('STUDIO', 'UM_QUARTO', 'DOIS_QUARTOS', 'TRES_QUARTOS', 'QUATRO_QUARTOS', 'GARDEN', 'COBERTURA', 'DUPLEX', 'SALA_COMERCIAL');
CREATE TYPE "DevelopmentMediaCategory" AS ENUM ('HERO', 'FACHADA', 'LAZER', 'DECORADO', 'PLANTA', 'LOCALIZACAO', 'OBRA', 'OUTROS');
CREATE TYPE "DevelopmentLeadStatus" AS ENUM ('NOVO', 'EM_ATENDIMENTO', 'RECEBEU_TABELA', 'AGENDOU_APRESENTACAO', 'EM_NEGOCIACAO', 'COMPROU', 'PERDIDO');

-- Builder (Construtora)
CREATE TABLE "Builder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "description" TEXT,
    "city" TEXT,
    "state" TEXT,
    "foundedYear" INTEGER,
    "website" TEXT,
    "instagram" TEXT,
    "deliveredDevelopmentsCount" INTEGER,
    "deliveredUnitsCount" INTEGER,
    "activeProjectsCount" INTEGER,
    "institutionalText" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Builder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Builder_slug_key" ON "Builder"("slug");
CREATE INDEX "Builder_archivedAt_idx" ON "Builder"("archivedAt");

-- Lead extensions for development context
ALTER TABLE "Lead"
  ADD COLUMN "developmentLeadStatus" "DevelopmentLeadStatus" NOT NULL DEFAULT 'NOVO',
  ADD COLUMN "linkedDevelopmentUnitTypeId" TEXT;

CREATE INDEX "Lead_developmentLeadStatus_idx" ON "Lead"("developmentLeadStatus");

-- Interaction context for unit type
ALTER TABLE "LeadInteraction"
  ADD COLUMN "unitTypeId" TEXT;

-- Development extensions
ALTER TABLE "Development"
  ADD COLUMN "propertyType" "DevelopmentPropertyType",
  ADD COLUMN "builderId" TEXT,
  ADD COLUMN "priceMax" DECIMAL(14,2),
  ADD COLUMN "landAreaM2" DECIMAL(12,2),
  ADD COLUMN "suitesFrom" INTEGER,
  ADD COLUMN "suitesTo" INTEGER,
  ADD COLUMN "bathroomsFrom" INTEGER,
  ADD COLUMN "bathroomsTo" INTEGER,
  ADD COLUMN "towersCount" INTEGER,
  ADD COLUMN "floorsCount" INTEGER,
  ADD COLUMN "elevatorsCount" INTEGER,
  ADD COLUMN "incorporationRegistry" TEXT,
  ADD COLUMN "hasPatrimonyOfAffectation" BOOLEAN,
  ADD COLUMN "projectText" TEXT,
  ADD COLUMN "apartmentsText" TEXT,
  ADD COLUMN "locationText" TEXT,
  ADD COLUMN "locationHighlights" TEXT,
  ADD COLUMN "referencePoints" JSONB,
  ADD COLUMN "seoKeyword" TEXT,
  ADD COLUMN "seoNoIndex" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "showPrice" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "showMap" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "showBuilder" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "showFloorplanTable" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "showWhatsappButton" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "archivedAt" TIMESTAMP(3);

UPDATE "Development"
SET "isPublished" = CASE WHEN "status" = 'PUBLISHED' THEN true ELSE false END;

CREATE INDEX "Development_builderId_idx" ON "Development"("builderId");
CREATE INDEX "Development_archivedAt_idx" ON "Development"("archivedAt");
CREATE INDEX "Development_isFeatured_displayOrder_idx" ON "Development"("isFeatured", "displayOrder");

-- Unit types extensions
ALTER TABLE "DevelopmentUnitType"
  ADD COLUMN "unitCategory" "DevelopmentUnitCategory",
  ADD COLUMN "areaPrivateM2" DECIMAL(10,2),
  ADD COLUMN "areaTotalM2" DECIMAL(10,2),
  ADD COLUMN "initialPrice" DECIMAL(14,2),
  ADD COLUMN "imageUrl" TEXT,
  ADD COLUMN "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- Media extensions
ALTER TABLE "DevelopmentMedia"
  ADD COLUMN "category" "DevelopmentMediaCategory" NOT NULL DEFAULT 'OUTROS',
  ADD COLUMN "caption" TEXT,
  ADD COLUMN "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "DevelopmentMedia"
SET "category" = CASE
  WHEN "kind" = 'HERO' THEN 'HERO'::"DevelopmentMediaCategory"
  WHEN "kind" = 'FLOORPLAN' THEN 'PLANTA'::"DevelopmentMediaCategory"
  WHEN "kind" = 'GALLERY' THEN 'FACHADA'::"DevelopmentMediaCategory"
  ELSE 'OUTROS'::"DevelopmentMediaCategory"
END;

-- Foreign keys
ALTER TABLE "Development"
  ADD CONSTRAINT "Development_builderId_fkey"
  FOREIGN KEY ("builderId") REFERENCES "Builder"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Lead"
  ADD CONSTRAINT "Lead_linkedDevelopmentUnitTypeId_fkey"
  FOREIGN KEY ("linkedDevelopmentUnitTypeId") REFERENCES "DevelopmentUnitType"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LeadInteraction"
  ADD CONSTRAINT "LeadInteraction_unitTypeId_fkey"
  FOREIGN KEY ("unitTypeId") REFERENCES "DevelopmentUnitType"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
