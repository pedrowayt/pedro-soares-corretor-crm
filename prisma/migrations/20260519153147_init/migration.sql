-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CORRETOR', 'PARCEIRO');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('INSTAGRAM', 'SITE', 'WHATSAPP', 'INDICACAO', 'TRAFEGO_PAGO', 'OUTRO');

-- CreateEnum
CREATE TYPE "LeadIntent" AS ENUM ('COMPRAR', 'VENDER', 'INVESTIR', 'ALUGAR');

-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('NOVO', 'PRIMEIRO_CONTATO', 'QUALIFICADO', 'OPCOES_ENVIADAS', 'VISITA_AGENDADA', 'PROPOSTA_ENVIADA', 'NEGOCIACAO', 'FECHADO', 'PERDIDO');

-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('FORM_SUBMISSION', 'WHATSAPP_CLICK', 'WHATSAPP_MESSAGE', 'TABLE_DOWNLOAD', 'EMAIL', 'PHONE_CALL', 'NOTE');

-- CreateEnum
CREATE TYPE "InteractionChannel" AS ENUM ('SITE', 'WHATSAPP', 'EMAIL', 'PHONE', 'INSTAGRAM', 'CRM');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('CASA', 'APARTAMENTO', 'LOTE', 'COMERCIAL', 'RURAL');

-- CreateEnum
CREATE TYPE "PropertyPurpose" AS ENUM ('VENDA', 'LOCACAO', 'INVESTIMENTO', 'LEILAO', 'LANCAMENTO');

-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DISPONIVEL', 'RESERVADO', 'VENDIDO', 'ALUGADO', 'EM_ANALISE');

-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'VIDEO', 'TOUR', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDENTE', 'PROCESSANDO', 'PRONTO', 'FALHA');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDENTE', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('AGENDADA', 'REALIZADA', 'CANCELADA', 'REAGENDADA');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('ENVIADA', 'ACEITA', 'RECUSADA', 'CONTRA_PROPOSTA', 'EXPIRADA');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('ANALISE', 'ATIVA', 'FECHADA', 'DESCARTADA');

-- CreateEnum
CREATE TYPE "AuctionRisk" AS ENUM ('BAIXO', 'MEDIO', 'ALTO');

-- CreateEnum
CREATE TYPE "PortalPublicationStatus" AS ENUM ('PENDENTE', 'PUBLICADO', 'ERRO', 'PAUSADO');

-- CreateEnum
CREATE TYPE "DevelopmentPublicationStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DevelopmentStage" AS ENUM ('PRE_LAUNCH', 'LAUNCH', 'SALES', 'CONSTRUCTION', 'DELIVERED');

-- CreateEnum
CREATE TYPE "DevelopmentMediaKind" AS ENUM ('HERO', 'GALLERY', 'FLOORPLAN', 'VIDEO', 'PDF');

-- CreateEnum
CREATE TYPE "DevelopmentMilestoneStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "creci" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CORRETOR',
    "passwordHash" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "source" "LeadSource" NOT NULL,
    "intent" "LeadIntent" NOT NULL,
    "stage" "LeadStage" NOT NULL DEFAULT 'NOVO',
    "desiredType" "PropertyType",
    "desiredPurpose" "PropertyPurpose",
    "budgetMin" DECIMAL(14,2),
    "budgetMax" DECIMAL(14,2),
    "desiredCity" TEXT,
    "desiredDistrict" TEXT,
    "notes" TEXT,
    "lastContactAt" TIMESTAMP(3),
    "lgpdConsentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerUserId" TEXT,
    "linkedPropertyId" TEXT,
    "linkedDevelopmentId" TEXT,
    "linkedOwnerId" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadInteraction" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" "InteractionType" NOT NULL,
    "channel" "InteractionChannel" NOT NULL,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "propertyId" TEXT,
    "developmentId" TEXT,
    "createdById" TEXT,

    CONSTRAINT "LeadInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineStageHistory" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "fromStage" "LeadStage",
    "toStage" "LeadStage" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedById" TEXT,

    CONSTRAINT "PipelineStageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "district" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Development" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "developerName" TEXT,
    "builderName" TEXT,
    "stage" "DevelopmentStage" NOT NULL DEFAULT 'PRE_LAUNCH',
    "deliveryDate" TIMESTAMP(3),
    "startingPrice" DECIMAL(14,2),
    "areaFromM2" DECIMAL(10,2),
    "areaToM2" DECIMAL(10,2),
    "bedroomsFrom" INTEGER,
    "bedroomsTo" INTEGER,
    "parkingFrom" INTEGER,
    "parkingTo" INTEGER,
    "totalUnits" INTEGER,
    "availableUnits" INTEGER,
    "amenities" TEXT[],
    "differentials" TEXT[],
    "regionLiquidityNotes" TEXT,
    "mapEmbedUrl" TEXT,
    "tablePdfUrl" TEXT,
    "whatsappMessageTemplate" TEXT,
    "ctaPrimaryLabel" TEXT,
    "ctaPrimaryUrl" TEXT,
    "ctaSecondaryLabel" TEXT,
    "ctaSecondaryUrl" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoOgImageUrl" TEXT,
    "status" "DevelopmentPublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Development_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentUnitType" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bedrooms" INTEGER,
    "suites" INTEGER,
    "bathrooms" INTEGER,
    "parkingSpaces" INTEGER,
    "areaFromM2" DECIMAL(10,2),
    "areaToM2" DECIMAL(10,2),
    "priceFrom" DECIMAL(14,2),
    "priceTo" DECIMAL(14,2),
    "availableUnits" INTEGER,
    "totalUnits" INTEGER,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentUnitType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentMedia" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "kind" "DevelopmentMediaKind" NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDENTE',
    "cloudflareMediaId" TEXT,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DevelopmentMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentMilestone" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "DevelopmentMilestoneStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "targetDate" TIMESTAMP(3),
    "actualDate" TIMESTAMP(3),
    "progressPct" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentFaq" (
    "id" TEXT NOT NULL,
    "developmentId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentFaq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "purpose" "PropertyPurpose" NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'DISPONIVEL',
    "price" DECIMAL(14,2) NOT NULL,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "postalCode" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "areaM2" DECIMAL(10,2),
    "bedrooms" INTEGER,
    "suites" INTEGER,
    "bathrooms" INTEGER,
    "parkingSpaces" INTEGER,
    "description" TEXT NOT NULL,
    "features" TEXT[],
    "legalNotes" TEXT,
    "internalNotes" TEXT,
    "commissionPct" DECIMAL(5,2),
    "documents" JSONB,
    "marketAskingValue" DECIMAL(14,2),
    "marketEstimatedValue" DECIMAL(14,2),
    "marketOpportunity" DECIMAL(14,2),
    "marketComparableLinks" TEXT[],
    "marketLiquidityNotes" TEXT,
    "isInvestorHighlight" BOOLEAN NOT NULL DEFAULT false,
    "isAuctionOpportunity" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyMedia" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "kind" "MediaKind" NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDENTE',
    "cloudflareMediaId" TEXT,
    "url" TEXT NOT NULL,
    "variant" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "status" "VisitStatus" NOT NULL DEFAULT 'AGENDADA',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assignedToId" TEXT,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'ENVIADA',
    "offeredValue" DECIMAL(14,2) NOT NULL,
    "commissionPct" DECIMAL(5,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDENTE',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIA',
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assignedToId" TEXT,
    "leadId" TEXT,
    "propertyId" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorOpportunity" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'ANALISE',
    "marketValue" DECIMAL(14,2),
    "entryValue" DECIMAL(65,30),
    "estimatedRoiPct" DECIMAL(5,2),
    "legalRiskSummary" TEXT,
    "documentaryRisk" "AuctionRisk",
    "liquidityRating" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestorOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionCase" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "caseNumber" TEXT,
    "courtName" TEXT,
    "auctionDate" TIMESTAMP(3),
    "minimumBid" DECIMAL(14,2),
    "estimatedCosts" DECIMAL(14,2),
    "documentaryRisk" "AuctionRisk",
    "legalStatus" TEXT,
    "editalUrl" TEXT,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'ANALISE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortalPublication" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "portalName" TEXT NOT NULL,
    "externalId" TEXT,
    "status" "PortalPublicationStatus" NOT NULL DEFAULT 'PENDENTE',
    "lastSyncAt" TIMESTAMP(3),
    "payload" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortalPublication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Lead_stage_idx" ON "Lead"("stage");

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "Lead"("source");

-- CreateIndex
CREATE INDEX "Lead_intent_idx" ON "Lead"("intent");

-- CreateIndex
CREATE INDEX "Lead_phone_idx" ON "Lead"("phone");

-- CreateIndex
CREATE INDEX "Lead_linkedDevelopmentId_idx" ON "Lead"("linkedDevelopmentId");

-- CreateIndex
CREATE INDEX "LeadInteraction_leadId_createdAt_idx" ON "LeadInteraction"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "PipelineStageHistory_leadId_createdAt_idx" ON "PipelineStageHistory"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "Owner_phone_idx" ON "Owner"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Development_slug_key" ON "Development"("slug");

-- CreateIndex
CREATE INDEX "Development_status_stage_idx" ON "Development"("status", "stage");

-- CreateIndex
CREATE INDEX "Development_city_district_idx" ON "Development"("city", "district");

-- CreateIndex
CREATE INDEX "Development_startingPrice_idx" ON "Development"("startingPrice");

-- CreateIndex
CREATE INDEX "DevelopmentUnitType_developmentId_position_idx" ON "DevelopmentUnitType"("developmentId", "position");

-- CreateIndex
CREATE INDEX "DevelopmentMedia_developmentId_kind_idx" ON "DevelopmentMedia"("developmentId", "kind");

-- CreateIndex
CREATE INDEX "DevelopmentMilestone_developmentId_position_idx" ON "DevelopmentMilestone"("developmentId", "position");

-- CreateIndex
CREATE INDEX "DevelopmentFaq_developmentId_position_idx" ON "DevelopmentFaq"("developmentId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");

-- CreateIndex
CREATE INDEX "Property_status_purpose_idx" ON "Property"("status", "purpose");

-- CreateIndex
CREATE INDEX "Property_city_district_idx" ON "Property"("city", "district");

-- CreateIndex
CREATE INDEX "Property_price_idx" ON "Property"("price");

-- CreateIndex
CREATE INDEX "PropertyMedia_propertyId_kind_idx" ON "PropertyMedia"("propertyId", "kind");

-- CreateIndex
CREATE INDEX "Visit_scheduledAt_idx" ON "Visit"("scheduledAt");

-- CreateIndex
CREATE INDEX "Visit_status_idx" ON "Visit"("status");

-- CreateIndex
CREATE INDEX "Proposal_status_idx" ON "Proposal"("status");

-- CreateIndex
CREATE INDEX "Task_status_dueAt_idx" ON "Task"("status", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorOpportunity_propertyId_key" ON "InvestorOpportunity"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "AuctionCase_propertyId_key" ON "AuctionCase"("propertyId");

-- CreateIndex
CREATE INDEX "PortalPublication_status_idx" ON "PortalPublication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PortalPublication_propertyId_portalName_key" ON "PortalPublication"("propertyId", "portalName");

-- CreateIndex
CREATE INDEX "AuditLog_resource_createdAt_idx" ON "AuditLog"("resource", "createdAt");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_linkedPropertyId_fkey" FOREIGN KEY ("linkedPropertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_linkedDevelopmentId_fkey" FOREIGN KEY ("linkedDevelopmentId") REFERENCES "Development"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_linkedOwnerId_fkey" FOREIGN KEY ("linkedOwnerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadInteraction" ADD CONSTRAINT "LeadInteraction_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadInteraction" ADD CONSTRAINT "LeadInteraction_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadInteraction" ADD CONSTRAINT "LeadInteraction_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadInteraction" ADD CONSTRAINT "LeadInteraction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineStageHistory" ADD CONSTRAINT "PipelineStageHistory_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineStageHistory" ADD CONSTRAINT "PipelineStageHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentUnitType" ADD CONSTRAINT "DevelopmentUnitType_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentMedia" ADD CONSTRAINT "DevelopmentMedia_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentMilestone" ADD CONSTRAINT "DevelopmentMilestone_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentFaq" ADD CONSTRAINT "DevelopmentFaq_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "Development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyMedia" ADD CONSTRAINT "PropertyMedia_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorOpportunity" ADD CONSTRAINT "InvestorOpportunity_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionCase" ADD CONSTRAINT "AuctionCase_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortalPublication" ADD CONSTRAINT "PortalPublication_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
