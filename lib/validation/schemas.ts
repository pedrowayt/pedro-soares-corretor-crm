import {
  BlogSource,
  BlogStatus,
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
  bedrooms: z.coerce.number().int().nullish(),
  livingRooms: z.coerce.number().int().nullish(),
  suites: z.coerce.number().int().nullish(),
  bathrooms: z.coerce.number().int().nullish(),
  parkingSpaces: z.coerce.number().int().nullish(),
  description: z.string().min(12),
  features: z.array(z.string()).default([]),
  legalNotes: z.string().nullish(),
  internalNotes: z.string().nullish(),
  commissionPct: z.coerce.number().min(0).max(100).nullish(),
  marketAskingValue: z.coerce.number().nullish(),
  marketEstimatedValue: z.coerce.number().nullish(),
  marketOpportunity: z.coerce.number().nullish(),
  marketComparableLinks: z.array(z.string()).default([]),
  marketLiquidityNotes: z.string().nullish(),
  isInvestorHighlight: z.boolean().optional(),
  isAuctionOpportunity: z.boolean().optional(),
  ownerName: z.string().trim().min(2).max(120).nullish().or(z.literal("")),
  ownerPhone: z.string().trim().min(8).max(40).nullish().or(z.literal(""))
});

export const crmUpdatePropertySchema = crmCreatePropertySchema.partial();

export const crmCreatePropertyMediaSchema = z.object({
  kind: z.enum(["IMAGE", "VIDEO", "TOUR"]).default("IMAGE"),
  url: z.string().url(),
  cloudflareMediaId: z.string().optional(),
  position: z.coerce.number().int().min(0).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
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
  leadId: z.string(),
  propertyId: z.string(),
  offeredValue: z.coerce.number().positive(),
  commissionPct: z.coerce.number().min(0).max(100).optional(),
  notes: z.string().optional()
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

export const crmCreateBlogPostSchema = z.object({
  title: z.string().min(4),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug deve usar minúsculas, números e hífens."),
  excerpt: z.string().min(20).max(280),
  coverImageUrl: z.string().url().optional().nullable(),
  bodyMarkdown: z.string().min(80),
  status: z.nativeEnum(BlogStatus).default(BlogStatus.DRAFT),
  source: z.nativeEnum(BlogSource).default(BlogSource.MANUAL),
  tagSlugs: z.array(z.string().min(1)).default([])
});

export const crmUpdateBlogPostSchema = crmCreateBlogPostSchema.partial();
