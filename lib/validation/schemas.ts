import {
  BlogSource,
  BlogStatus,
  CaptureSourceKind,
  DevelopmentAmenityType,
  DevelopmentLeadStatus,
  DevelopmentMediaCategory,
  DevelopmentMediaKind,
  DevelopmentMilestoneStatus,
  DevelopmentPropertyType,
  DevelopmentPublicationStatus,
  DevelopmentStage,
  DevelopmentUnitCategory,
  DevelopmentUnitStatus,
  LeadIntent,
  LeadSource,
  LeadStage,
  PortalPublicationStatus,
  ProposalStatus,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
  SeoListingMode,
  SeoPageStatus,
  TaskPriority
} from "@prisma/client";
import { z } from "zod";

export const publicPropertyInterestSchema = z.object({
  name: z.string().min(3),
  whatsapp: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().optional(),
  propertySlug: z.string().optional(),
  lgpdConsent: z.boolean().optional().default(true)
});

export const publicSellerCaptureSchema = z.object({
  name: z.string().min(3),
  whatsapp: z.string().min(10),
  propertyType: z.nativeEnum(PropertyType),
  district: z.string().min(2),
  city: z.string().default("Palmas"),
  askingPrice: z.coerce.number().positive(),
  statusDescription: z.string().optional(),
  photos: z.array(z.string().url()).optional(),
  lgpdConsent: z.boolean().optional().default(true)
});

export const publicWhatsappClickSchema = z.object({
  propertyId: z.string().optional(),
  propertySlug: z.string().optional(),
  developmentId: z.string().optional(),
  developmentSlug: z.string().optional(),
  unitTypeId: z.string().optional(),
  unitTypeName: z.string().optional(),
  unitId: z.string().optional(),
  unitLabel: z.string().optional(),
  leadPhone: z.string().optional(),
  leadName: z.string().optional(),
  leadEmail: z.string().email().optional().or(z.literal("")),
  messageTemplate: z.string().optional(),
  context: z.enum(["development", "unit_type", "schedule"]).optional()
});

export const publicDevelopmentInterestSchema = z.object({
  name: z.string().min(3),
  whatsapp: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().optional(),
  developmentSlug: z.string().optional(),
  developmentId: z.string().optional(),
  unitTypeId: z.string().optional(),
  unitId: z.string().optional(),
  requestTable: z.boolean().optional().default(false),
  lgpdConsent: z.boolean().optional().default(true)
});

export const crmCreateLeadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional(),
  source: z.nativeEnum(LeadSource),
  intent: z.nativeEnum(LeadIntent),
  desiredType: z.nativeEnum(PropertyType).optional(),
  desiredPurpose: z.nativeEnum(PropertyPurpose).optional(),
  budgetMin: z.coerce.number().optional(),
  budgetMax: z.coerce.number().optional(),
  desiredCity: z.string().optional(),
  desiredDistrict: z.string().optional(),
  notes: z.string().optional(),
  developmentLeadStatus: z.nativeEnum(DevelopmentLeadStatus).optional(),
  ownerUserId: z.string().optional(),
  linkedPropertyId: z.string().optional(),
  linkedDevelopmentId: z.string().optional(),
  linkedDevelopmentUnitTypeId: z.string().optional()
});

export const crmCreatePropertySchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  type: z.nativeEnum(PropertyType),
  purpose: z.nativeEnum(PropertyPurpose),
  status: z.nativeEnum(PropertyStatus).default(PropertyStatus.DISPONIVEL),
  price: z.coerce.number().positive(),
  city: z.string().min(2).default("Palmas"),
  district: z.string().min(2),
  address: z.string().nullish(),
  postalCode: z.string().nullish(),
  googleMapsUrl: z.string().nullish().or(z.literal("")),
  latitude: z.coerce.number().nullish(),
  longitude: z.coerce.number().nullish(),
  areaM2: z.coerce.number().nullish(),
  landAreaM2: z.coerce.number().nullish(),
  frontMeters: z.coerce.number().nullish(),
  backMeters: z.coerce.number().nullish(),
  sideLeftMeters: z.coerce.number().nullish(),
  sideRightMeters: z.coerce.number().nullish(),
  ceilingHeightM: z.coerce.number().nullish(),
  bedrooms: z.coerce.number().int().nullish(),
  livingRooms: z.coerce.number().int().nullish(),
  suites: z.coerce.number().int().nullish(),
  bathrooms: z.coerce.number().int().nullish(),
  parkingSpaces: z.coerce.number().int().nullish(),
  floorNumber: z.coerce.number().int().nullish(),
  floorCount: z.coerce.number().int().nullish(),
  unitCount: z.coerce.number().int().nullish(),
  description: z.string().min(12),
  features: z.array(z.string()).default([]),
  legalNotes: z.string().nullish(),
  internalNotes: z.string().nullish(),
  documents: z.record(z.string(), z.unknown()).nullish(),
  commissionPct: z.coerce.number().min(0).max(100).nullish(),
  marketAskingValue: z.coerce.number().nullish(),
  marketEstimatedValue: z.coerce.number().nullish(),
  marketOpportunity: z.coerce.number().nullish(),
  marketComparableLinks: z.array(z.string()).default([]),
  marketLiquidityNotes: z.string().nullish(),
  isInvestorHighlight: z.boolean().optional(),
  isAuctionOpportunity: z.boolean().optional(),
  auctionCase: z
    .object({
      caseNumber: z.string().nullish(),
      courtName: z.string().nullish(),
      auctionDate: z.string().nullish(),
      firstAuctionDate: z.string().nullish(),
      secondAuctionDate: z.string().nullish(),
      minimumBid: z.coerce.number().nullish(),
      appraisedValue: z.coerce.number().nullish(),
      estimatedCosts: z.coerce.number().nullish(),
      documentaryRisk: z.enum(["BAIXO", "MEDIO", "ALTO"]).nullish(),
      legalStatus: z.string().nullish(),
      editalUrl: z.string().nullish(),
      appraisalUrl: z.string().nullish(),
      registryUrl: z.string().nullish(),
      bidUrl: z.string().nullish(),
      lotCode: z.string().nullish(),
      auctioneerName: z.string().nullish(),
      auctionType: z.string().nullish(),
      auctionMode: z.string().nullish(),
      registryNumber: z.string().nullish(),
      registryOffice: z.string().nullish(),
      occupancyStatus: z.enum(["OCUPADO", "DESOCUPADO", "NAO_INFORMADO"]).nullish(),
      debtsInfo: z.string().nullish(),
      notes: z.string().nullish(),
      documentLinks: z.record(z.string(), z.unknown()).nullish()
    })
    .optional(),
  ownerName: z.string().trim().min(2).max(120).nullish().or(z.literal("")),
  ownerPhone: z.string().trim().min(8).max(40).nullish().or(z.literal(""))
});

export const crmUpdatePropertySchema = crmCreatePropertySchema.partial();

export const crmCreateOwnerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(40),
  email: z.string().trim().email().optional().nullable().or(z.literal("")),
  city: z.string().trim().max(80).optional().nullable().or(z.literal("")),
  district: z.string().trim().max(80).optional().nullable().or(z.literal("")),
  address: z.string().trim().max(180).optional().nullable().or(z.literal("")),
  notes: z.string().trim().max(3000).optional().nullable().or(z.literal(""))
});

export const crmUpdateOwnerSchema = crmCreateOwnerSchema.partial();

export const crmCreateCapturedListingSchema = z.object({
  title: z.string().trim().min(3).max(180),
  description: z.string().trim().max(5000).optional().nullable().or(z.literal("")),
  sourceName: z.string().trim().max(120).optional().nullable().or(z.literal("")),
  sourceKind: z.nativeEnum(CaptureSourceKind).optional().default(CaptureSourceKind.MANUAL),
  externalId: z.string().trim().max(160).optional().nullable().or(z.literal("")),
  sourceUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  purpose: z.nativeEnum(PropertyPurpose),
  type: z.nativeEnum(PropertyType),
  price: z.coerce.number().positive(),
  address: z.string().trim().max(180).optional().nullable().or(z.literal("")),
  city: z.string().trim().min(2).max(80).default("Palmas"),
  district: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().max(20).optional().nullable().or(z.literal("")),
  latitude: z.coerce.number().nullish(),
  longitude: z.coerce.number().nullish(),
  areaM2: z.coerce.number().positive().nullish(),
  landAreaM2: z.coerce.number().positive().nullish(),
  bedrooms: z.coerce.number().int().min(0).nullish(),
  suites: z.coerce.number().int().min(0).nullish(),
  bathrooms: z.coerce.number().int().min(0).nullish(),
  parkingSpaces: z.coerce.number().int().min(0).nullish(),
  advertiserName: z.string().trim().max(120).optional().nullable().or(z.literal("")),
  advertiserPhone: z.string().trim().max(40).optional().nullable().or(z.literal("")),
  advertiserEmail: z.string().trim().email().optional().nullable().or(z.literal("")),
  isPrivateSeller: z.boolean().optional().default(false),
  hasFullAddress: z.boolean().optional().default(false),
  adAgeDays: z.coerce.number().int().min(0).nullish(),
  publishedAt: z.coerce.date().nullish(),
  marketAvgPrice: z.coerce.number().positive().nullish(),
  marketAvgPriceM2: z.coerce.number().positive().nullish(),
  rawPayload: z.unknown().optional(),
  notes: z.string().trim().max(3000).optional().nullable().or(z.literal(""))
});

export const crmImportOlxCapturedListingSchema = z.object({
  sourceUrl: z.string().trim().url()
});

export const capturePortalProviderSchema = z.enum(["olx", "zap", "imovelweb", "chaves-na-mao", "facebook-marketplace"]);

export const crmImportPortalCapturedListingSchema = z.object({
  sourceUrl: z.string().trim().url(),
  provider: capturePortalProviderSchema.optional()
});

const browserCapturedListingSchema = z.object({
  sourceUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  url: z.string().trim().url().optional().nullable().or(z.literal("")),
  href: z.string().trim().url().optional().nullable().or(z.literal("")),
  title: z.string().trim().max(180).optional().nullable().or(z.literal("")),
  name: z.string().trim().max(180).optional().nullable().or(z.literal("")),
  text: z.string().trim().max(5000).optional().nullable().or(z.literal("")),
  rawText: z.string().trim().max(5000).optional().nullable().or(z.literal("")),
  description: z.string().trim().max(5000).optional().nullable().or(z.literal("")),
  advertiserName: z.string().trim().max(120).optional().nullable().or(z.literal("")),
  sellerName: z.string().trim().max(120).optional().nullable().or(z.literal("")),
  publishedAt: z.union([z.coerce.date(), z.string().trim().max(180)]).nullish(),
  publicationDate: z.union([z.coerce.date(), z.string().trim().max(180)]).nullish(),
  publishedAtText: z.string().trim().max(180).optional().nullable().or(z.literal("")),
  price: z.union([z.string(), z.number()]).optional().nullable(),
  imageUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  thumbnailUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  photoUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  city: z.string().trim().max(80).optional().nullable().or(z.literal("")),
  district: z.string().trim().max(80).optional().nullable().or(z.literal("")),
  neighborhood: z.string().trim().max(80).optional().nullable().or(z.literal("")),
  location: z.string().trim().max(180).optional().nullable().or(z.literal("")),
  address: z.string().trim().max(180).optional().nullable().or(z.literal("")),
  areaM2: z.union([z.string(), z.number()]).optional().nullable(),
  bedrooms: z.union([z.string(), z.number()]).optional().nullable(),
  bathrooms: z.union([z.string(), z.number()]).optional().nullable(),
  parkingSpaces: z.union([z.string(), z.number()]).optional().nullable(),
  isPrivateSeller: z.boolean().optional()
});

export const crmImportBrowserCapturedListingsSchema = z
  .object({
    provider: capturePortalProviderSchema.optional(),
    rawText: z.string().trim().max(120000).optional().nullable().or(z.literal("")),
    items: z.array(browserCapturedListingSchema).max(60).optional(),
    city: z.string().trim().min(2).max(80).optional().default("Palmas"),
    district: z.string().trim().max(80).optional().nullable().or(z.literal("")),
    purpose: z.nativeEnum(PropertyPurpose).optional().default(PropertyPurpose.VENDA),
    type: z.nativeEnum(PropertyType).optional().default(PropertyType.CASA)
  })
  .refine((payload) => Boolean(payload.rawText?.trim() || payload.items?.length), {
    message: "Informe a captura do navegador ou uma lista de anúncios."
  });

export const crmCreateCaptureAlertSchema = z.object({
  name: z.string().trim().min(3).max(120),
  provider: capturePortalProviderSchema.optional().default("olx"),
  searchUrl: z.string().trim().url(),
  city: z.string().trim().min(2).max(80).default("Palmas"),
  district: z.string().trim().max(80).optional().nullable().or(z.literal("")),
  purpose: z.nativeEnum(PropertyPurpose).optional().nullable().or(z.literal("")),
  type: z.nativeEnum(PropertyType).optional().nullable().or(z.literal("")),
  priceMin: z.coerce.number().positive().optional().nullable().or(z.literal("")),
  priceMax: z.coerce.number().positive().optional().nullable().or(z.literal("")),
  onlyPrivateSeller: z.boolean().optional().default(true),
  onlyFullAddress: z.boolean().optional().default(false),
  maxResultsPerRun: z.coerce.number().int().min(1).max(30).optional().default(8),
  active: z.boolean().optional().default(true)
});

export const crmDiscardCapturedListingSchema = z.object({
  reason: z.string().trim().max(1000).optional().nullable().or(z.literal(""))
});

export const marketplacePortalKeySchema = z.enum(["olx", "zap", "vivareal"]);

export const crmPortalPublicationInputSchema = z.object({
  portalName: marketplacePortalKeySchema,
  enabled: z.boolean().default(false),
  status: z.nativeEnum(PortalPublicationStatus).optional(),
  customTitle: z.string().trim().max(160).nullish().or(z.literal("")),
  customDescription: z.string().trim().max(5000).nullish().or(z.literal("")),
  customPrice: z.coerce.number().positive().nullish(),
  showFullAddress: z.boolean().optional().default(false),
  showPrice: z.boolean().optional().default(true),
  highlightEnabled: z.boolean().optional().default(false),
  highlightType: z.string().trim().max(80).nullish().or(z.literal(""))
});

export const crmUpdatePortalPublicationsSchema = z.object({
  publications: z.array(crmPortalPublicationInputSchema).max(3)
});

export const publicPortalLeadSchema = z.object({
  portalName: marketplacePortalKeySchema,
  name: z.string().trim().min(2),
  phone: z.string().trim().min(8),
  email: z.string().trim().email().optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional(),
  propertyId: z.string().optional(),
  propertySlug: z.string().optional(),
  externalLeadId: z.string().trim().max(160).optional(),
  portalPropertyCode: z.string().trim().max(160).optional()
});

export const crmCreatePropertyMediaSchema = z.object({
  kind: z.enum(["IMAGE", "VIDEO", "TOUR"]).default("IMAGE"),
  url: z.string().url(),
  cloudflareMediaId: z.string().optional(),
  position: z.coerce.number().int().min(0).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

const auctionImportLooseObject = z.record(z.string(), z.unknown());

export const auctionImportPayloadSchema = z
  .object({
    source: z.string().trim().min(2).max(80),
    externalId: z.string().trim().min(1).max(160),
    originalUrl: z.string().trim().url(),
    property: auctionImportLooseObject.optional(),
    auction: auctionImportLooseObject.optional(),
    legal: auctionImportLooseObject.optional(),
    documents: auctionImportLooseObject.optional(),
    images: z
      .array(
        z.union([
          z.string().trim().url(),
          auctionImportLooseObject
        ])
      )
      .optional(),
    updatedAt: z.string().optional()
  })
  .passthrough();

const auctionImportSourceKeySchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífen.");

export const crmCreateAuctionImportSourceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  sourceKey: auctionImportSourceKeySchema,
  active: z.boolean().optional().default(true),
  allowedDomains: z.array(z.string().trim().min(2).max(180)).default([]),
  notes: z.string().trim().max(500).nullish()
});

export const crmUpdateAuctionImportSourceSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  sourceKey: auctionImportSourceKeySchema.optional(),
  active: z.boolean().optional(),
  allowedDomains: z.array(z.string().trim().min(2).max(180)).optional(),
  notes: z.string().trim().max(500).nullish()
});

export const crmUpdatePropertyMediaSchema = z.object({
  position: z.coerce.number().int().min(0).optional(),
  makePrimary: z.boolean().optional()
});

export const crmUpdateStageSchema = z.object({
  toStage: z.nativeEnum(LeadStage),
  reason: z.string().optional()
});

export const crmUpdateDevelopmentLeadStatusSchema = z.object({
  developmentLeadStatus: z.nativeEnum(DevelopmentLeadStatus)
});

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIA),
  dueAt: z.string().datetime().optional(),
  leadId: z.string().optional(),
  propertyId: z.string().optional(),
  assignedToId: z.string().optional()
});

export const createVisitSchema = z.object({
  leadId: z.string(),
  propertyId: z.string(),
  scheduledAt: z.string().datetime(),
  notes: z.string().optional(),
  assignedToId: z.string().optional()
});

export const createProposalSchema = z.object({
  leadId: z.string().min(1),
  propertyId: z.string().min(1),
  offeredValue: z.coerce.number().positive(),
  commissionPct: z.coerce.number().min(0).max(100).optional(),
  notes: z.string().optional()
});

export const updateProposalSchema = z
  .object({
    status: z.nativeEnum(ProposalStatus).optional(),
    offeredValue: z.coerce.number().positive().optional(),
    commissionPct: z.coerce.number().min(0).max(100).nullable().optional(),
    notes: z.string().optional()
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "Informe ao menos um campo para atualizar."
  });

export const cloudflareImageDirectUploadSchema = z.object({
  id: z.string().optional(),
  creator: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  requireSignedURLs: z.boolean().optional().default(false),
  expiry: z.string().datetime().optional()
});

export const cloudflareStreamDirectUploadSchema = z.object({
  maxDurationSeconds: z.coerce.number().int().positive().max(10800).default(3600),
  requireSignedURLs: z.boolean().optional().default(false),
  allowedOrigins: z.array(z.string()).optional(),
  creator: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export const crmUpdateProfileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  creci: z.string().trim().max(40).optional().or(z.literal("")),
  jobTitle: z.string().trim().max(80).optional().or(z.literal("")),
  bio: z.string().trim().max(500).optional().or(z.literal("")),
  instagramUrl: z.string().trim().url().optional().or(z.literal("")),
  profilePhotoUrl: z.string().trim().url().optional().or(z.literal(""))
});

export const whatsappTemplateSchema = z.object({
  to: z.string().min(8),
  templateName: z.string().min(2),
  languageCode: z.string().default("pt_BR"),
  bodyParams: z.array(z.string()).default([])
});

const crmReferencePointSchema = z.object({
  name: z.string().min(2),
  distance: z.string().optional(),
  type: z.string().optional()
});

export const crmCreateDevelopmentSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  propertyType: z.nativeEnum(DevelopmentPropertyType).optional(),
  tagline: z.string().optional(),
  summary: z.string().min(10),
  description: z.string().min(20),
  district: z.string().min(2),
  city: z.string().default("Palmas"),
  neighborhood: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  developerName: z.string().optional(),
  builderName: z.string().optional(),
  builderId: z.string().optional(),
  stage: z.nativeEnum(DevelopmentStage).default(DevelopmentStage.PRE_LAUNCH),
  deliveryDate: z.string().datetime().nullable().optional(),
  constructionProgressPct: z.coerce.number().int().min(0).max(100).nullable().optional(),
  appreciationPotential: z.enum(["BAIXO", "MEDIO", "ALTO", "MUITO_ALTO"]).nullable().optional(),
  buyerProfile: z.string().nullable().optional(),
  opportunityText: z.string().nullable().optional(),
  showInvestmentPotentialBlock: z.boolean().optional(),
  startingPrice: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  areaFromM2: z.coerce.number().optional(),
  areaToM2: z.coerce.number().optional(),
  landAreaM2: z.coerce.number().optional(),
  bedroomsFrom: z.coerce.number().int().optional(),
  bedroomsTo: z.coerce.number().int().optional(),
  suitesFrom: z.coerce.number().int().optional(),
  suitesTo: z.coerce.number().int().optional(),
  bathroomsFrom: z.coerce.number().int().optional(),
  bathroomsTo: z.coerce.number().int().optional(),
  parkingFrom: z.coerce.number().int().optional(),
  parkingTo: z.coerce.number().int().optional(),
  towersCount: z.coerce.number().int().optional(),
  floorsCount: z.coerce.number().int().optional(),
  elevatorsCount: z.coerce.number().int().optional(),
  totalUnits: z.coerce.number().int().optional(),
  availableUnits: z.coerce.number().int().optional(),
  incorporationRegistry: z.string().optional(),
  hasPatrimonyOfAffectation: z.boolean().optional(),
  amenities: z.array(z.string()).default([]),
  differentials: z.array(z.string()).default([]),
  projectText: z.string().optional(),
  apartmentsText: z.string().optional(),
  locationText: z.string().optional(),
  locationHighlights: z.string().optional(),
  referencePoints: z.array(crmReferencePointSchema).default([]),
  regionLiquidityNotes: z.string().optional(),
  mapEmbedUrl: z.string().optional().or(z.literal("")),
  tablePdfUrl: z.string().url().optional().or(z.literal("")),
  whatsappMessageTemplate: z.string().optional(),
  ctaPrimaryLabel: z.string().optional(),
  ctaPrimaryUrl: z.string().url().optional().or(z.literal("")),
  ctaSecondaryLabel: z.string().optional(),
  ctaSecondaryUrl: z.string().optional().or(z.literal("")),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoOgImageUrl: z.string().url().optional().or(z.literal("")),
  seoKeyword: z.string().optional(),
  seoNoIndex: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  displayOrder: z.coerce.number().int().optional(),
  showPrice: z.boolean().optional(),
  showMap: z.boolean().optional(),
  showBuilder: z.boolean().optional(),
  showFloorplanTable: z.boolean().optional(),
  showWhatsappButton: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  status: z.nativeEnum(DevelopmentPublicationStatus).optional()
});

export const crmUpdateDevelopmentSchema = crmCreateDevelopmentSchema.partial().extend({
  status: z.nativeEnum(DevelopmentPublicationStatus).optional()
});

export const crmUpdateDevelopmentStatusSchema = z.object({
  status: z.nativeEnum(DevelopmentPublicationStatus)
});

export const crmCreateDevelopmentUnitTypeSchema = z.object({
  towerId: z.string().optional(),
  name: z.string().min(2),
  unitCategory: z.nativeEnum(DevelopmentUnitCategory).optional(),
  bedrooms: z.coerce.number().int().optional(),
  suites: z.coerce.number().int().optional(),
  bathrooms: z.coerce.number().int().optional(),
  parkingSpaces: z.coerce.number().int().optional(),
  areaFromM2: z.coerce.number().optional(),
  areaToM2: z.coerce.number().optional(),
  areaPrivateM2: z.coerce.number().optional(),
  areaTotalM2: z.coerce.number().optional(),
  priceFrom: z.coerce.number().optional(),
  priceTo: z.coerce.number().optional(),
  initialPrice: z.coerce.number().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isAvailable: z.boolean().optional(),
  availableUnits: z.coerce.number().int().optional(),
  totalUnits: z.coerce.number().int().optional(),
  description: z.string().optional(),
  position: z.coerce.number().int().optional()
});

export const crmCreateDevelopmentTowerSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  propertyType: z.nativeEnum(DevelopmentPropertyType).optional(),
  description: z.string().optional(),
  floorsCount: z.coerce.number().int().optional(),
  elevatorsCount: z.coerce.number().int().optional(),
  totalUnits: z.coerce.number().int().optional(),
  availableUnits: z.coerce.number().int().optional(),
  deliveryDate: z.string().datetime().nullable().optional(),
  incorporationRegistry: z.string().optional(),
  position: z.coerce.number().int().optional()
});

export const crmCreateDevelopmentUnitSchema = z.object({
  towerId: z.string().optional(),
  unitTypeId: z.string().optional(),
  label: z.string().min(1),
  unitNumber: z.string().optional(),
  floor: z.coerce.number().int().optional(),
  status: z.nativeEnum(DevelopmentUnitStatus).optional(),
  price: z.coerce.number().optional(),
  areaPrivateM2: z.coerce.number().optional(),
  areaTotalM2: z.coerce.number().optional(),
  parkingSpaces: z.coerce.number().int().optional(),
  orientation: z.string().optional(),
  notes: z.string().optional(),
  position: z.coerce.number().int().optional()
});

export const crmCreateDevelopmentMediaSchema = z.object({
  towerId: z.string().optional(),
  unitTypeId: z.string().optional(),
  kind: z.nativeEnum(DevelopmentMediaKind),
  category: z.nativeEnum(DevelopmentMediaCategory).optional(),
  url: z.string().url(),
  title: z.string().optional(),
  caption: z.string().optional(),
  isPrimary: z.boolean().optional(),
  position: z.coerce.number().int().optional(),
  cloudflareMediaId: z.string().optional(),
  status: z.enum(["PENDENTE", "PROCESSANDO", "PRONTO", "FALHA"]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export const crmCreateDevelopmentAmenitySchema = z.object({
  towerId: z.string().optional(),
  type: z.nativeEnum(DevelopmentAmenityType).default(DevelopmentAmenityType.LAZER),
  label: z.string().min(2),
  description: z.string().optional(),
  icon: z.string().optional(),
  isHighlighted: z.boolean().optional(),
  position: z.coerce.number().int().optional()
});

export const crmCreateDevelopmentMilestoneSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.nativeEnum(DevelopmentMilestoneStatus).default(DevelopmentMilestoneStatus.NOT_STARTED),
  targetDate: z.string().datetime().optional(),
  actualDate: z.string().datetime().optional(),
  progressPct: z.coerce.number().int().min(0).max(100).optional(),
  position: z.coerce.number().int().optional()
});

export const crmCreateDevelopmentFaqSchema = z.object({
  question: z.string().min(4),
  answer: z.string().min(6),
  position: z.coerce.number().int().optional()
});

export const crmCreateBuilderSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  logoUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  foundedYear: z.coerce.number().int().nullable().optional(),
  website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().optional(),
  deliveredDevelopmentsCount: z.coerce.number().int().nullable().optional(),
  deliveredUnitsCount: z.coerce.number().int().nullable().optional(),
  activeProjectsCount: z.coerce.number().int().nullable().optional(),
  institutionalText: z.string().optional()
});

export const crmUpdateBuilderSchema = crmCreateBuilderSchema.partial();

export const crmSeoFaqSchema = z.object({
  question: z.string().min(4),
  answer: z.string().min(6)
});

export const crmCreateSeoLandingPageSchema = z.object({
  name: z.string().min(4),
  path: z.string().min(3),
  city: z.string().min(2).default("Palmas"),
  district: z.string().optional(),
  listingMode: z.nativeEnum(SeoListingMode).default(SeoListingMode.TODOS),
  title: z.string().min(10),
  description: z.string().min(20),
  h1: z.string().min(6),
  intro: z.string().min(20),
  keywords: z.array(z.string()).default([]),
  faqs: z.array(crmSeoFaqSchema).default([]),
  status: z.nativeEnum(SeoPageStatus).default(SeoPageStatus.DRAFT)
});

export const crmUpdateSeoLandingPageSchema = crmCreateSeoLandingPageSchema.partial();

const optionalNullableText = z.string().trim().optional().nullable();

export const crmCreateBlogCategorySchema = z.object({
  label: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug deve usar minúsculas, números e hífens."),
  description: z.string().trim().max(280).optional().nullable(),
  active: z.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
  seoTitle: z.string().trim().max(70).optional().nullable(),
  seoDescription: z.string().trim().max(180).optional().nullable()
});

export const crmUpdateBlogCategorySchema = crmCreateBlogCategorySchema.partial();

export const crmCreateBlogPostSchema = z.object({
  title: z.string().min(4),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug deve usar minúsculas, números e hífens."),
  excerpt: z.string().min(20).max(280),
  coverImageUrl: z.string().url().optional().nullable(),
  bodyMarkdown: z.string().min(80),
  status: z.nativeEnum(BlogStatus).default(BlogStatus.DRAFT),
  source: z.nativeEnum(BlogSource).default(BlogSource.MANUAL),
  categoryId: z.string().optional().nullable(),
  seoTitle: z.string().trim().max(70).optional().nullable(),
  seoDescription: z.string().trim().max(180).optional().nullable(),
  seoKeyword: z.string().trim().max(80).optional().nullable(),
  seoOgImageUrl: z.string().url().optional().nullable().or(z.literal("")),
  seoNoIndex: z.boolean().optional().default(false),
  tagSlugs: z.array(z.string().min(1)).default([])
});

export const crmUpdateBlogPostSchema = crmCreateBlogPostSchema.partial();

export const crmBlogSeoAutofillSchema = z.object({
  title: z.string().trim().min(4).max(120),
  slug: z.string().trim().max(100).optional(),
  excerpt: z.string().trim().max(400).optional(),
  bodyMarkdown: z.string().trim().max(12000).optional(),
  categoryLabel: optionalNullableText,
  tagLabels: z.array(z.string().trim().min(1).max(80)).default([])
});
