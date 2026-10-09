import { DevelopmentPropertyType, PropertyType } from "@prisma/client";
import { publicLandingPages, type PublicLandingPage } from "@/lib/data/landing-pages";
import { listPublicDevelopments } from "@/lib/data/developments";

export type PublicCatalogSource = "PROPERTY" | "LAUNCH";

export type PublicCatalogLaunch = {
  source: "LAUNCH";
  id: string;
  slug: string;
  href: string;
  title: string;
  city: string;
  district: string;
  category: string;
  summary: string;
  imageUrl?: string;
  status: string;
  propertyTypes: PropertyType[];
  startingPrice: number | null;
  bedroomsFrom: number | null;
  areaFromM2: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  hasPublishedLanding: boolean;
};

export function toPublicLandingPage(launch: PublicCatalogLaunch): PublicLandingPage {
  return {
    slug: launch.slug,
    href: launch.href,
    title: launch.title,
    category: launch.category,
    location: `${launch.district} · ${launch.city}`,
    summary: launch.summary,
    image: launch.imageUrl ?? "/brand/logo-light-bg.png",
    status: launch.status,
    propertyTypes: launch.propertyTypes
  };
}

export type PublicCatalogFilters = {
  city?: string;
  district?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  minAreaM2?: number;
};

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includes(value: string | null | undefined, query: string | undefined) {
  return !query || normalize(value).includes(normalize(query));
}

function inferPropertyTypes(landing: PublicLandingPage): PropertyType[] {
  if (landing.propertyTypes?.length) return landing.propertyTypes;

  const text = normalize(`${landing.title} ${landing.category} ${landing.summary}`);
  const types = new Set<PropertyType>();

  if (text.includes("lote")) types.add(text.includes("condominio") ? PropertyType.LOTE_EM_CONDOMINIO : PropertyType.LOTE);
  if (text.includes("chacara")) types.add(PropertyType.CHACARA_EM_CONDOMINIO);
  if (text.includes("comercial") || text.includes("office") || text.includes("mall") || text.includes("mixed-use")) {
    types.add(PropertyType.COMERCIAL);
  }
  if (text.includes("apartamento") || text.includes("studio") || text.includes("residencial") || text.includes("cobertura")) {
    types.add(text.includes("cobertura") ? PropertyType.COBERTURA : PropertyType.APARTAMENTO);
  }

  return [...types];
}

function matchesLaunchFilters(item: PublicCatalogLaunch, filters: PublicCatalogFilters) {
  if (!includes(item.city, filters.city) || !includes(item.district, filters.district)) return false;
  if (filters.type && item.propertyTypes.length && !item.propertyTypes.includes(filters.type)) return false;

  if (typeof filters.minPrice === "number") {
    if (item.startingPrice === null || item.startingPrice < filters.minPrice) return false;
  }
  if (typeof filters.maxPrice === "number") {
    if (item.startingPrice === null || item.startingPrice > filters.maxPrice) return false;
  }
  if (typeof filters.bedrooms === "number") {
    if (item.bedroomsFrom === null || item.bedroomsFrom < filters.bedrooms) return false;
  }
  if (typeof filters.minAreaM2 === "number") {
    if (item.areaFromM2 === null || item.areaFromM2 < filters.minAreaM2) return false;
  }

  return true;
}

function fromEditorialLanding(landing: PublicLandingPage): PublicCatalogLaunch {
  const [districtPart, cityPart] = landing.location.split("·").map((item) => item.trim());

  return {
    source: "LAUNCH",
    id: `landing:${landing.slug}`,
    slug: landing.slug,
    href: landing.href,
    title: landing.title,
    city: cityPart || landing.location,
    district: districtPart || landing.location,
    category: landing.category,
    summary: landing.summary,
    imageUrl: landing.image,
    status: landing.status,
    propertyTypes: inferPropertyTypes(landing),
    startingPrice: null,
    bedroomsFrom: null,
    areaFromM2: null,
    hasPublishedLanding: true
  };
}

function developmentPropertyTypes(propertyType: DevelopmentPropertyType | null | undefined) {
  const mapping: Partial<Record<DevelopmentPropertyType, PropertyType[]>> = {
    COMPLEXO: [PropertyType.APARTAMENTO, PropertyType.COMERCIAL],
    APARTAMENTO: [PropertyType.APARTAMENTO],
    CASA: [PropertyType.CASA],
    LOTE: [PropertyType.LOTE],
    LOTE_EM_CONDOMINIO: [PropertyType.LOTE_EM_CONDOMINIO],
    SALA_COMERCIAL: [PropertyType.SALA, PropertyType.COMERCIAL],
    STUDIO: [PropertyType.APARTAMENTO, PropertyType.FLAT],
    COBERTURA: [PropertyType.COBERTURA]
  };

  return propertyType ? mapping[propertyType] ?? [] : [];
}

function fromDevelopment(development: Awaited<ReturnType<typeof listPublicDevelopments>>[number]): PublicCatalogLaunch {
  const relatedLanding = Array.isArray((development as { landingPages?: unknown }).landingPages)
    ? ((development as { landingPages?: Array<{ publicPath: string }> }).landingPages?.[0] ?? null)
    : null;
  const editorial = publicLandingPages.find((item) => item.slug === development.slug);
  const media = Array.isArray(development.media) ? development.media : [];
  const primaryImage = media.find((item) => "isPrimary" in item && item.isPrimary)?.url ?? media[0]?.url;

  return {
    source: "LAUNCH",
    id: `development:${development.id}`,
    slug: development.slug,
    href: relatedLanding?.publicPath ?? editorial?.href ?? `/lancamentos/${development.slug}`,
    title: development.title,
    city: development.city,
    district: development.district,
    category: editorial?.category ?? development.propertyType ?? "Lançamento imobiliário",
    summary: development.summary,
    imageUrl: primaryImage ?? editorial?.image,
    status: editorial?.status ?? development.stageLabel,
    propertyTypes: developmentPropertyTypes(
      typeof development.propertyType === "string"
        ? (development.propertyType as DevelopmentPropertyType)
        : development.propertyType
    ),
    startingPrice: development.startingPriceNumber,
    bedroomsFrom: development.bedroomsFrom ?? null,
    areaFromM2: development.areaFromM2Number,
    createdAt: "createdAt" in development ? development.createdAt : undefined,
    updatedAt: "updatedAt" in development ? development.updatedAt : undefined,
    hasPublishedLanding: Boolean(relatedLanding || editorial)
  };
}

/**
 * Returns published launches for the public catalog. Database-backed
 * developments take precedence over the editorial fallback with the same slug.
 */
export async function listPublicCatalogLaunches(filters: PublicCatalogFilters = {}) {
  const developments = await listPublicDevelopments({
    city: filters.city,
    district: filters.district,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    bedrooms: filters.bedrooms,
    minArea: filters.minAreaM2
  });

  const dynamicItems = developments.map(fromDevelopment).filter((item) => item.hasPublishedLanding);
  const dynamicSlugs = new Set(dynamicItems.map((item) => item.slug));
  const editorialItems = publicLandingPages
    .filter((landing) => !dynamicSlugs.has(landing.slug))
    .map(fromEditorialLanding);

  return [...dynamicItems, ...editorialItems].filter((item) => matchesLaunchFilters(item, filters));
}
