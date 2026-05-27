"use client";

import Image from "next/image";
import { createElement, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { slugify } from "@/lib/crm/slug";
import { appreciationPotentialOptions, developmentStageOptions } from "@/lib/development-investment";
import { developmentAmenityIconOptions, getDevelopmentAmenityIcon } from "@/lib/icons/development";
import { applyWatermarkToImage } from "@/lib/media/watermark";

const MAX_AI_UPLOAD_BYTES = 20 * 1024 * 1024;

type DevelopmentItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  stage: string;
  city: string;
  district: string;
  tagline: string | null;
  summary: string;
  description: string;
  propertyType: string | null;
  builderId: string | null;
  builderName: string | null;
  developerName: string | null;
  deliveryDate: Date | string | null;
  constructionProgressPct: number | null;
  appreciationPotential: string | null;
  buyerProfile: string | null;
  opportunityText: string | null;
  showInvestmentPotentialBlock: boolean;
  startingPriceNumber: number | null;
  priceMaxNumber: number | null;
  areaFromM2Number: number | null;
  areaToM2Number: number | null;
  landAreaM2Number: number | null;
  bedroomsFrom: number | null;
  bedroomsTo: number | null;
  suitesFrom: number | null;
  suitesTo: number | null;
  bathroomsFrom: number | null;
  bathroomsTo: number | null;
  parkingFrom: number | null;
  parkingTo: number | null;
  towersCount: number | null;
  floorsCount: number | null;
  elevatorsCount: number | null;
  totalUnits: number | null;
  availableUnits: number | null;
  incorporationRegistry: string | null;
  hasPatrimonyOfAffectation: boolean | null;
  amenities: string[];
  differentials: string[];
  amenityItems: Array<{
    id: string;
    towerId: string | null;
    towerName: string | null;
    type: string;
    label: string;
    description: string | null;
    icon: string | null;
    isHighlighted: boolean;
    position: number;
  }>;
  projectText: string | null;
  apartmentsText: string | null;
  locationText: string | null;
  locationHighlights: string | null;
  referencePoints: unknown;
  regionLiquidityNotes: string | null;
  address: string | null;
  neighborhood: string | null;
  postalCode: string | null;
  latitudeNumber: number | null;
  longitudeNumber: number | null;
  mapEmbedUrl: string | null;
  tablePdfUrl: string | null;
  whatsappMessageTemplate: string | null;
  ctaPrimaryLabel: string | null;
  ctaPrimaryUrl: string | null;
  ctaSecondaryLabel: string | null;
  ctaSecondaryUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoOgImageUrl: string | null;
  seoKeyword: string | null;
  seoNoIndex: boolean;
  isFeatured: boolean;
  displayOrder: number;
  showPrice: boolean;
  showMap: boolean;
  showBuilder: boolean;
  showFloorplanTable: boolean;
  showWhatsappButton: boolean;
  isPublished: boolean;
  media: Array<{
    id: string;
    url: string;
    title: string | null;
    caption: string | null;
    kind: string;
    category: string;
    position: number;
    isPrimary: boolean;
    towerId: string | null;
    towerName: string | null;
    unitTypeId: string | null;
    unitTypeName: string | null;
  }>;
  towers: Array<{
    id: string;
    name: string;
    slug: string | null;
    propertyType: string | null;
    description: string | null;
    floorsCount: number | null;
    elevatorsCount: number | null;
    totalUnits: number | null;
    availableUnits: number | null;
    deliveryDate: Date | string | null;
    incorporationRegistry: string | null;
    position: number;
  }>;
  unitTypes: Array<{
    id: string;
    towerId: string | null;
    towerName: string | null;
    name: string;
    unitCategory: string | null;
    bedrooms: number | null;
    suites: number | null;
    bathrooms: number | null;
    parkingSpaces: number | null;
    areaPrivateM2Number: number | null;
    areaTotalM2Number: number | null;
    initialPriceNumber: number | null;
    imageUrl: string | null;
    availableUnits: number | null;
    totalUnits: number | null;
    description: string | null;
    position: number;
    isAvailable: boolean;
  }>;
  units: Array<{
    id: string;
    towerId: string | null;
    unitTypeId: string | null;
    towerName: string | null;
    unitTypeName: string | null;
    label: string;
    unitNumber: string | null;
    floor: number | null;
    status: string;
    priceNumber: number | null;
    areaPrivateM2Number: number | null;
    areaTotalM2Number: number | null;
    parkingSpaces: number | null;
    orientation: string | null;
    notes: string | null;
    position: number;
  }>;
  milestones: Array<{ id: string; title: string; status: string; progressPct: number | null }>;
  faqs: Array<{ id: string; question: string; answer: string }>;
};

type BuilderItem = {
  id: string;
  name: string;
  slug: string;
};

type AiAutofillUnitType = {
  name: string | null;
  unitCategory: string | null;
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  areaPrivateM2: number | null;
  areaTotalM2: number | null;
  initialPrice: number | null;
  isAvailable: boolean | null;
  description: string | null;
  position: number | null;
};

type AiAutofillMediaCandidate = {
  page: number | null;
  imageUrl: string | null;
  kind: string | null;
  category: string | null;
  title: string | null;
  caption: string | null;
  cropX: number | null;
  cropY: number | null;
  cropWidth: number | null;
  cropHeight: number | null;
  confidence: number | null;
  shouldAttach: boolean | null;
  dataUrl?: string;
  width?: number;
  height?: number;
  cropApplied?: boolean;
  crop?: { x: number; y: number; width: number; height: number } | null;
};

type AiAutofillResponse = {
  fields: Record<string, string | number | boolean | null>;
  unitTypes: AiAutofillUnitType[];
  mediaCandidates: AiAutofillMediaCandidate[];
  notes: string[];
};

type AiUnitTypeDraft = {
  name: string;
  unitCategory: string;
  bedrooms: string;
  suites: string;
  bathrooms: string;
  parkingSpaces: string;
  areaPrivateM2: string;
  areaTotalM2: string;
  initialPrice: string;
  isAvailable: boolean;
  description: string;
  position: string;
};

type AiMediaCandidateDraft = {
  page: number | null;
  imageUrl: string | null;
  kind: string;
  category: string;
  title: string;
  caption: string;
  confidence: string;
  dataUrl: string;
  width: number | null;
  height: number | null;
  cropApplied: boolean;
  crop: { x: number; y: number; width: number; height: number } | null;
  attached: boolean;
};

type SaveStatus = "idle" | "saving" | "success" | "error";
type AiStatus = "idle" | "loading" | "success" | "error";

type AiProgressState = {
  percent: number;
  label: string;
  detail: string;
};

const publicationOptions = [
  { value: "DRAFT", label: "Rascunho" },
  { value: "REVIEW", label: "Revisão" },
  { value: "PUBLISHED", label: "Publicado" },
  { value: "ARCHIVED", label: "Arquivado" }
];

const unitCategoryOptions = [
  { value: "STUDIO", label: "Studio" },
  { value: "UM_QUARTO", label: "1 quarto" },
  { value: "DOIS_QUARTOS", label: "2 quartos" },
  { value: "TRES_QUARTOS", label: "3 quartos" },
  { value: "QUATRO_QUARTOS", label: "4 quartos" },
  { value: "GARDEN", label: "Garden" },
  { value: "COBERTURA", label: "Cobertura" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "SALA_COMERCIAL", label: "Sala comercial" }
];

const unitStatusOptions = [
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "RESERVADA", label: "Reservada" },
  { value: "VENDIDA", label: "Vendida" },
  { value: "BLOQUEADA", label: "Bloqueada" }
];

const amenityTypeOptions = [
  { value: "LAZER", label: "Lazer" },
  { value: "DIFERENCIAL", label: "Diferencial" }
];

const developmentPropertyTypeOptions = [
  { value: "COMPLEXO", label: "Complexo" },
  { value: "APARTAMENTO", label: "Apartamento" },
  { value: "CASA", label: "Casa" },
  { value: "LOTE", label: "Lote" },
  { value: "SALA_COMERCIAL", label: "Sala comercial" },
  { value: "STUDIO", label: "Studio" },
  { value: "COBERTURA", label: "Cobertura" }
];

const mediaKindOptions = [
  { value: "HERO", label: "Hero" },
  { value: "GALLERY", label: "Galeria" },
  { value: "FLOORPLAN", label: "Planta" },
  { value: "VIDEO", label: "Vídeo" },
  { value: "PDF", label: "PDF" }
];

const mediaCategoryOptions = [
  { value: "HERO", label: "Hero" },
  { value: "FACHADA", label: "Fachada" },
  { value: "LAZER", label: "Lazer" },
  { value: "DECORADO", label: "Decorado" },
  { value: "PLANTA", label: "Planta" },
  { value: "LOCALIZACAO", label: "Localização" },
  { value: "OBRA", label: "Obra" },
  { value: "OUTROS", label: "Outros" }
];

const developmentMediaGuidelines = [
  {
    title: "Hero / slider",
    details: "2400 x 1350 px exato, proporção 16:9. Mínimo aceito: 1920 x 1080 px."
  },
  {
    title: "Galeria, fachada, lazer, decorado e obra",
    details: "1600 x 1200 px exato, proporção 4:3. Mínimo aceito: 1200 x 900 px."
  },
  {
    title: "Plantas",
    details: "2000 x 1600 px exato para planta horizontal ou 1600 x 2000 px para planta vertical."
  },
  {
    title: "Localização / mapa",
    details: "1600 x 900 px exato, proporção 16:9."
  }
];

const tabs = [
  { id: "basic", label: "Informações básicas" },
  { id: "location", label: "Localização" },
  { id: "features", label: "Características" },
  { id: "investment", label: "Investimento" },
  { id: "descriptions", label: "Descrições" },
  { id: "media", label: "Imagens" },
  { id: "plants", label: "Torres, plantas e preços" },
  { id: "amenities", label: "Lazer e diferenciais" },
  { id: "builder", label: "Construtora" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publicação" }
] as const;

type TabId = (typeof tabs)[number]["id"];

const developmentFieldLabels: Record<string, string> = {
  title: "Nome do empreendimento",
  slug: "Slug",
  summary: "Frase curta",
  description: "Descrição principal",
  city: "Cidade",
  district: "Bairro",
  tablePdfUrl: "PDF da tabela",
  ctaPrimaryUrl: "Link do CTA principal",
  seoOgImageUrl: "Imagem OG"
};

const developmentFieldTabs: Record<string, TabId> = {
  title: "basic",
  slug: "basic",
  summary: "basic",
  description: "basic",
  city: "location",
  district: "location",
  tablePdfUrl: "descriptions",
  ctaPrimaryUrl: "descriptions",
  seoOgImageUrl: "seo"
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function humanizeValidationMessage(message: string) {
  const lower = message.toLowerCase();
  const minMatch = message.match(/>=\s*(\d+)/);

  if (lower.includes("too small") && lower.includes("string")) {
    return minMatch ? `mínimo de ${minMatch[1]} caracteres` : "texto muito curto";
  }

  if (lower.includes("invalid url") || lower.includes("url")) {
    return "URL inválida";
  }

  if (lower.includes("required") || lower.includes("expected string")) {
    return "obrigatório";
  }

  return message;
}

function validationMessagesFromUnknown(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  return typeof value === "string" && value.trim() ? [value.trim()] : [];
}

function formatValidationDetails(details: unknown) {
  if (!isRecord(details)) return "";

  const fieldErrors = isRecord(details.fieldErrors) ? details.fieldErrors : null;
  const formErrors = validationMessagesFromUnknown(details.formErrors);
  const messages: string[] = [];

  if (fieldErrors) {
    for (const [field, rawMessages] of Object.entries(fieldErrors)) {
      const fieldMessages = validationMessagesFromUnknown(rawMessages);
      if (!fieldMessages.length) continue;

      const label = developmentFieldLabels[field] ?? field;
      messages.push(`${label}: ${humanizeValidationMessage(fieldMessages[0])}`);
    }
  }

  for (const message of formErrors) {
    messages.push(humanizeValidationMessage(message));
  }

  if (!messages.length) return "";

  const visibleMessages = messages.slice(0, 6);
  const suffix = messages.length > visibleMessages.length ? `; +${messages.length - visibleMessages.length} campo(s)` : "";
  return `Campos para revisar: ${visibleMessages.join("; ")}${suffix}.`;
}

function formatApiError(payload: unknown) {
  const error = isRecord(payload) && isRecord(payload.error) ? payload.error : null;
  const baseMessage = typeof error?.message === "string" ? error.message : "Falha na operação.";
  const detailsMessage = formatValidationDetails(error?.details);

  return detailsMessage ? `${baseMessage} ${detailsMessage}` : baseMessage;
}

function parseReferencePoints(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const point = item as { name?: unknown; distance?: unknown; type?: unknown };
      const name = String(point.name ?? "").trim();
      if (!name) return null;
      const distance = String(point.distance ?? "").trim();
      const type = String(point.type ?? "").trim();
      return [name, distance, type].filter(Boolean).join(" | ");
    })
    .filter(Boolean)
    .join("\n");
}

function normalizeNumberInput(value: string) {
  const cleaned = value
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^\d,.-]/g, "");

  if (!cleaned || cleaned === "-" || cleaned === "," || cleaned === ".") return "";

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandsSeparator = decimalSeparator === "," ? "." : ",";
    return cleaned.replace(new RegExp(`\\${thousandsSeparator}`, "g"), "").replace(decimalSeparator, ".");
  }

  if (lastComma >= 0) {
    const looksLikeThousands = /^\d{1,3}(,\d{3})+$/.test(cleaned);
    return looksLikeThousands ? cleaned.replace(/,/g, "") : cleaned.replace(",", ".");
  }

  if (lastDot >= 0 && /^\d{1,3}(\.\d{3})+$/.test(cleaned)) {
    return cleaned.replace(/\./g, "");
  }

  return cleaned;
}

function parseNumber(value: string) {
  const normalized = normalizeNumberInput(value);
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseNullableNumber(value: string) {
  const normalized = normalizeNumberInput(value);
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseReferencePointLines(value: string) {
  const lines = parseLines(value);
  return lines
    .map((line) => {
      const [name = "", distance = "", type = ""] = line.split("|").map((part) => part.trim());
      if (!name) return null;
      return { name, distance, type };
    })
    .filter((item): item is { name: string; distance: string; type: string } => Boolean(item));
}

function optionalString(value: string) {
  return value.trim() ? value.trim() : undefined;
}

function mediaScopeLabel(media: Pick<DevelopmentItem["media"][number], "towerName" | "unitTypeName">) {
  if (media.unitTypeName && media.towerName) return `${media.towerName} / ${media.unitTypeName}`;
  if (media.unitTypeName) return `Planta: ${media.unitTypeName}`;
  if (media.towerName) return `Torre: ${media.towerName}`;
  return "Geral do empreendimento";
}

function amenityTypeLabel(type: string) {
  return amenityTypeOptions.find((item) => item.value === type)?.label ?? type;
}

function amenityScopeLabel(item: Pick<DevelopmentItem["amenityItems"][number], "towerName">) {
  return item.towerName ? `Torre: ${item.towerName}` : "Geral do empreendimento";
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
  }

  return `${Math.ceil(bytes / 1024).toLocaleString("pt-BR")} KB`;
}

function nullableString(value: string) {
  return value.trim() ? value.trim() : null;
}

function formatMonthInput(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function monthInputToIso(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const normalized = /^\d{4}$/.test(trimmed) ? `${trimmed}-01` : trimmed;
  if (!/^\d{4}-\d{2}$/.test(normalized)) return null;

  const date = new Date(`${normalized}-01T12:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toFormState(development: DevelopmentItem | null) {
  return {
    title: development?.title ?? "",
    slug: development?.slug ?? "",
    summary: development?.summary ?? "",
    tagline: development?.tagline ?? "",
    description: development?.description ?? "",
    propertyType: development?.propertyType ?? "APARTAMENTO",
    stage: development?.stage ?? "PRE_LAUNCH",
    status: development?.status ?? "DRAFT",
    city: development?.city ?? "Palmas",
    district: development?.district ?? "",
    neighborhood: development?.neighborhood ?? "",
    address: development?.address ?? "",
    postalCode: development?.postalCode ?? "",
    latitude: development?.latitudeNumber?.toString() ?? "",
    longitude: development?.longitudeNumber?.toString() ?? "",
    developerName: development?.developerName ?? "",
    builderName: development?.builderName ?? "",
    builderId: development?.builderId ?? "",
    deliveryDate: formatMonthInput(development?.deliveryDate),
    constructionProgressPct: development?.constructionProgressPct?.toString() ?? "",
    appreciationPotential: development?.appreciationPotential ?? "",
    buyerProfile: development?.buyerProfile ?? "",
    opportunityText: development?.opportunityText ?? "",
    showInvestmentPotentialBlock: development?.showInvestmentPotentialBlock ?? true,
    startingPrice: development?.startingPriceNumber?.toString() ?? "",
    priceMax: development?.priceMaxNumber?.toString() ?? "",
    areaFromM2: development?.areaFromM2Number?.toString() ?? "",
    areaToM2: development?.areaToM2Number?.toString() ?? "",
    landAreaM2: development?.landAreaM2Number?.toString() ?? "",
    bedroomsFrom: development?.bedroomsFrom?.toString() ?? "",
    bedroomsTo: development?.bedroomsTo?.toString() ?? "",
    suitesFrom: development?.suitesFrom?.toString() ?? "",
    suitesTo: development?.suitesTo?.toString() ?? "",
    bathroomsFrom: development?.bathroomsFrom?.toString() ?? "",
    bathroomsTo: development?.bathroomsTo?.toString() ?? "",
    parkingFrom: development?.parkingFrom?.toString() ?? "",
    parkingTo: development?.parkingTo?.toString() ?? "",
    towersCount: development?.towersCount?.toString() ?? "",
    floorsCount: development?.floorsCount?.toString() ?? "",
    elevatorsCount: development?.elevatorsCount?.toString() ?? "",
    totalUnits: development?.totalUnits?.toString() ?? "",
    availableUnits: development?.availableUnits?.toString() ?? "",
    incorporationRegistry: development?.incorporationRegistry ?? "",
    hasPatrimonyOfAffectation: Boolean(development?.hasPatrimonyOfAffectation),
    amenitiesText: (development?.amenities ?? []).join("\n"),
    differentialsText: (development?.differentials ?? []).join("\n"),
    projectText: development?.projectText ?? "",
    apartmentsText: development?.apartmentsText ?? "",
    locationText: development?.locationText ?? "",
    locationHighlights: development?.locationHighlights ?? "",
    referencePoints: parseReferencePoints(development?.referencePoints),
    regionLiquidityNotes: development?.regionLiquidityNotes ?? "",
    mapEmbedUrl: development?.mapEmbedUrl ?? "",
    tablePdfUrl: development?.tablePdfUrl ?? "",
    whatsappMessageTemplate: development?.whatsappMessageTemplate ?? "",
    ctaPrimaryLabel: development?.ctaPrimaryLabel ?? "Falar no WhatsApp",
    ctaPrimaryUrl: development?.ctaPrimaryUrl ?? "https://wa.me/5563984845101",
    ctaSecondaryLabel: development?.ctaSecondaryLabel ?? "Receber tabela",
    ctaSecondaryUrl: development?.ctaSecondaryUrl ?? "",
    seoTitle: development?.seoTitle ?? "",
    seoDescription: development?.seoDescription ?? "",
    seoOgImageUrl: development?.seoOgImageUrl ?? "",
    seoKeyword: development?.seoKeyword ?? "",
    seoNoIndex: Boolean(development?.seoNoIndex),
    isFeatured: Boolean(development?.isFeatured),
    displayOrder: development?.displayOrder?.toString() ?? "0",
    showPrice: development?.showPrice ?? true,
    showMap: development?.showMap ?? true,
    showBuilder: development?.showBuilder ?? true,
    showFloorplanTable: development?.showFloorplanTable ?? true,
    showWhatsappButton: development?.showWhatsappButton ?? true,
    isPublished: development?.isPublished ?? false
  };
}

type DevelopmentFormState = ReturnType<typeof toFormState>;

type DevelopmentValidationIssue = {
  field: string;
  message: string;
  tab: TabId;
};

function isValidUrlOrEmpty(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function labelForPropertyType(value: string) {
  return developmentPropertyTypeOptions.find((item) => item.value === value)?.label.toLowerCase() ?? "empreendimento";
}

function firstTextWithMinimumLength(minLength: number, ...values: Array<string | null | undefined>) {
  return values.map((value) => normalizeWhitespace(value ?? "")).find((value) => value.length >= minLength) ?? "";
}

function truncateSentence(value: string, maxLength: number) {
  const normalized = normalizeWhitespace(value);
  if (normalized.length <= maxLength) return normalized;

  const clipped = normalized.slice(0, maxLength).replace(/\s+\S*$/, "").trim();
  return clipped || normalized.slice(0, maxLength).trim();
}

function ensureFinalPunctuation(value: string) {
  const trimmed = normalizeWhitespace(value);
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function inferDistrictFromText(...values: Array<string | null | undefined>) {
  const text = values.map((value) => value ?? "").join("\n");
  if (!text.trim()) return "";

  const patterns = [
    /\bPlano Diretor Sul\b/i,
    /\bPlano Diretor Norte\b/i,
    /\bJardim Aureny\s*(?:I{1,3}|IV|V)?\b/i,
    /\bTaquaralto\b/i,
    /\bTaquari\b/i,
    /\bGraciosa\b/i,
    /\bOrla(?:\s+de\s+Palmas)?\b/i,
    /\bCentro\b/i,
    /\b(?:ARSE|ARSO|ARNO|ACNO|ACSO|ACSU|ACSU-SE|ACSU-SO|ACSU-NO|ACSU-NE)\s*-?\s*\d{1,3}\b/i,
    /\b(?:Setor|Quadra)\s+([A-Z]{2,}[-\s]?\d{1,3})\b/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    const value = match?.[1] ?? match?.[0] ?? "";
    if (value.trim().length >= 2) {
      return normalizeWhitespace(value)
        .replace(/\s*-\s*/g, "-")
        .replace(/\b(arse|arso|arno|acno|acso|acsu|acsu-se|acsu-so|acsu-no|acsu-ne)\b/gi, (item) => item.toUpperCase());
    }
  }

  return "";
}

function completeAiRequiredFields(next: DevelopmentFormState) {
  const title = normalizeWhitespace(next.title);
  if (title) next.title = title;

  if (!next.slug.trim() && title) {
    next.slug = slugify(title);
  }

  if (!next.city.trim()) {
    next.city = "Palmas";
  }

  if (next.district.trim().length < 2) {
    const inferredDistrict = inferDistrictFromText(
      next.neighborhood,
      next.address,
      next.locationText,
      next.locationHighlights,
      next.referencePoints,
      next.regionLiquidityNotes
    );

    if (inferredDistrict) {
      next.district = inferredDistrict;
    }
  }

  if (next.summary.trim().length < 10) {
    const fallbackSummary = firstTextWithMinimumLength(
      10,
      next.tagline,
      next.projectText,
      next.apartmentsText,
      next.locationHighlights,
      next.description
    );

    if (fallbackSummary) {
      next.summary = truncateSentence(fallbackSummary, 180);
    } else if (title) {
      const location = [next.district, next.city].map((value) => value.trim()).filter(Boolean).join(", ");
      next.summary = truncateSentence(
        [title, location ? `em ${location}` : "", labelForPropertyType(next.propertyType)].filter(Boolean).join(" "),
        180
      );
    }
  }

  if (next.description.trim().length < 20) {
    const fallbackDescription = firstTextWithMinimumLength(
      20,
      next.description,
      next.projectText,
      next.apartmentsText,
      next.locationText,
      next.summary,
      next.locationHighlights
    );

    if (fallbackDescription) {
      next.description = ensureFinalPunctuation(fallbackDescription);
    } else if (title) {
      const location = [next.district, next.city].map((value) => value.trim()).filter(Boolean).join(", ");
      next.description = ensureFinalPunctuation(
        `${title} é um ${labelForPropertyType(next.propertyType)}${location ? ` localizado em ${location}` : ""}.`
      );
    }
  }
}

function validateRequiredDevelopmentForm(form: DevelopmentFormState): DevelopmentValidationIssue[] {
  const slug = form.slug.trim() || slugify(form.title);
  const checks = [
    { field: "title", value: form.title, min: 3, message: "mínimo de 3 caracteres" },
    { field: "slug", value: slug, min: 3, message: "mínimo de 3 caracteres" },
    { field: "summary", value: form.summary, min: 10, message: "mínimo de 10 caracteres" },
    { field: "description", value: form.description, min: 20, message: "mínimo de 20 caracteres" },
    { field: "city", value: form.city, min: 2, message: "obrigatória" },
    { field: "district", value: form.district, min: 2, message: "obrigatório" }
  ];

  const issues = checks
    .filter((check) => check.value.trim().length < check.min)
    .map((check) => ({
      field: check.field,
      message: check.message,
      tab: developmentFieldTabs[check.field] ?? "basic"
    }));

  const urlChecks = [
    { field: "tablePdfUrl", value: form.tablePdfUrl },
    { field: "ctaPrimaryUrl", value: form.ctaPrimaryUrl },
    { field: "seoOgImageUrl", value: form.seoOgImageUrl }
  ];

  for (const check of urlChecks) {
    if (!isValidUrlOrEmpty(check.value)) {
      issues.push({
        field: check.field,
        message: "URL inválida",
        tab: developmentFieldTabs[check.field] ?? "basic"
      });
    }
  }

  return issues;
}

function formatClientValidationMessage(issues: DevelopmentValidationIssue[]) {
  const visibleIssues = issues.slice(0, 6);
  const suffix = issues.length > visibleIssues.length ? `; +${issues.length - visibleIssues.length} campo(s)` : "";
  return `Revise antes de salvar: ${visibleIssues
    .map((issue) => `${developmentFieldLabels[issue.field] ?? issue.field}: ${issue.message}`)
    .join("; ")}${suffix}.`;
}

function numberToInput(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "";
  return String(value);
}

function apiNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string") return parseNullableNumber(value);
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function emptyUnitTypeDraft(position = 0): AiUnitTypeDraft {
  return {
    name: "",
    unitCategory: "",
    bedrooms: "",
    suites: "",
    bathrooms: "",
    parkingSpaces: "",
    areaPrivateM2: "",
    areaTotalM2: "",
    initialPrice: "",
    isAvailable: true,
    description: "",
    position: String(position)
  };
}

function unitTypeDraftFromAi(unit: AiAutofillUnitType, index: number): AiUnitTypeDraft {
  const unitCategory = unit.unitCategory && unitCategoryOptions.some((item) => item.value === unit.unitCategory)
    ? unit.unitCategory
    : "";

  return {
    name: unit.name ?? "",
    unitCategory,
    bedrooms: numberToInput(unit.bedrooms),
    suites: numberToInput(unit.suites),
    bathrooms: numberToInput(unit.bathrooms),
    parkingSpaces: numberToInput(unit.parkingSpaces),
    areaPrivateM2: numberToInput(unit.areaPrivateM2),
    areaTotalM2: numberToInput(unit.areaTotalM2),
    initialPrice: numberToInput(unit.initialPrice),
    isAvailable: unit.isAvailable ?? true,
    description: unit.description ?? "",
    position: numberToInput(unit.position ?? index)
  };
}

function mediaCandidateDraftFromAi(candidate: AiAutofillMediaCandidate): AiMediaCandidateDraft | null {
  if (!candidate.dataUrl || (!candidate.page && !candidate.imageUrl)) return null;

  const kind = candidate.kind && mediaKindOptions.some((item) => item.value === candidate.kind)
    ? candidate.kind
    : "GALLERY";
  const category = candidate.category && mediaCategoryOptions.some((item) => item.value === candidate.category)
    ? candidate.category
    : "OUTROS";

  return {
    page: candidate.page ?? null,
    imageUrl: candidate.imageUrl ?? null,
    kind,
    category,
    title: candidate.title ?? (candidate.page ? `Página ${candidate.page}` : "Imagem da página"),
    caption: candidate.caption ?? "",
    confidence: numberToInput(candidate.confidence),
    dataUrl: candidate.dataUrl,
    width: candidate.width ?? null,
    height: candidate.height ?? null,
    cropApplied: candidate.cropApplied ?? false,
    crop: candidate.crop ?? null,
    attached: false
  };
}

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl);
  return response.blob();
}

async function fetchJson(url: string, method: "POST" | "PATCH" | "DELETE", payload?: unknown) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: payload ? JSON.stringify(payload) : undefined
  });

  const data = (await response.json().catch(() => ({}))) as unknown;
  if (response.status === 401 && typeof window !== "undefined") {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.assign(`/admin/login?next=${next}`);
    throw new Error("Sessão expirada. Redirecionando para o login...");
  }
  if (!response.ok || !isRecord(data) || data.success !== true) {
    throw new Error(formatApiError(data));
  }

  return data as { success: true; data: Record<string, unknown> };
}

export function DevelopmentForms({ developments, builders }: { developments: DevelopmentItem[]; builders: BuilderItem[] }) {
  const [items, setItems] = useState(developments);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedId, setSelectedId] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("basic");
  const [form, setForm] = useState(() => toFormState(null));
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaFileUploading, setMediaFileUploading] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [mediaInfo, setMediaInfo] = useState("");
  const [mediaLocalPreview, setMediaLocalPreview] = useState<{ name: string; sizeKb: number; url: string } | null>(null);
  const [mediaShowManualUrl, setMediaShowManualUrl] = useState(false);
  const [mediaSubmitting, setMediaSubmitting] = useState(false);
  const [mediaKind, setMediaKind] = useState("GALLERY");
  const [mediaCategory, setMediaCategory] = useState("FACHADA");
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [mediaPosition, setMediaPosition] = useState("0");
  const [mediaIsPrimary, setMediaIsPrimary] = useState(false);
  const [mediaTowerId, setMediaTowerId] = useState("");
  const [mediaUnitTypeId, setMediaUnitTypeId] = useState("");
  const [amenityTowerId, setAmenityTowerId] = useState("");
  const [amenityType, setAmenityType] = useState("LAZER");
  const [amenityIcon, setAmenityIcon] = useState("pool");
  const [amenityLabel, setAmenityLabel] = useState("");
  const [amenityDescription, setAmenityDescription] = useState("");
  const [amenityPosition, setAmenityPosition] = useState("0");
  const [amenityIsHighlighted, setAmenityIsHighlighted] = useState(true);
  const [amenitySubmitting, setAmenitySubmitting] = useState(false);
  const [amenityMessage, setAmenityMessage] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiSourceUrl, setAiSourceUrl] = useState("");
  const [aiFileName, setAiFileName] = useState("");
  const [aiStatus, setAiStatus] = useState<AiStatus>("idle");
  const [aiMessage, setAiMessage] = useState("");
  const [aiProgress, setAiProgress] = useState<AiProgressState>({
    percent: 0,
    label: "",
    detail: ""
  });
  const [aiUnitTypes, setAiUnitTypes] = useState<AiUnitTypeDraft[]>([]);
  const [aiMediaCandidates, setAiMediaCandidates] = useState<AiMediaCandidateDraft[]>([]);
  const [aiMediaUploadingIndex, setAiMediaUploadingIndex] = useState<number | null>(null);
  const aiFileRef = useRef<HTMLInputElement | null>(null);
  const uploadFileRef = useRef<HTMLInputElement | null>(null);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);
  const mediaUnitTypeOptions = useMemo(() => {
    if (!selected) return [];
    if (!mediaTowerId) return selected.unitTypes;
    return selected.unitTypes.filter((unitType) => !unitType.towerId || unitType.towerId === mediaTowerId);
  }, [mediaTowerId, selected]);
  const amenityIconPreview = getDevelopmentAmenityIcon(amenityIcon, amenityLabel);
  const amenityGroups = useMemo(() => {
    if (!selected) return { general: [], byTower: [] };

    return {
      general: selected.amenityItems.filter((item) => !item.towerId),
      byTower: selected.towers.map((tower) => ({
        tower,
        items: selected.amenityItems.filter((item) => item.towerId === tower.id)
      }))
    };
  }, [selected]);

  function renderMediaScopeFields() {
    return (
      <>
        <div>
          <label>Torre/bloco da mídia</label>
          <select
            value={mediaTowerId}
            onChange={(event) => {
              setMediaTowerId(event.target.value);
              setMediaUnitTypeId("");
            }}
            disabled={!selected?.towers.length}
          >
            <option value="">Geral do empreendimento</option>
            {selected?.towers.map((tower) => (
              <option key={tower.id} value={tower.id}>{tower.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Planta/tipologia da mídia</label>
          <select
            value={mediaUnitTypeId}
            onChange={(event) => {
              const unitTypeId = event.target.value;
              setMediaUnitTypeId(unitTypeId);
              const unitType = selected?.unitTypes.find((item) => item.id === unitTypeId);
              if (unitType?.towerId) setMediaTowerId(unitType.towerId);
            }}
            disabled={!mediaUnitTypeOptions.length}
          >
            <option value="">Sem planta específica</option>
            {mediaUnitTypeOptions.map((unitType) => (
              <option key={unitType.id} value={unitType.id}>
                {unitType.towerName ? `${unitType.towerName} / ` : ""}{unitType.name}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  }

  useEffect(() => {
    return () => {
      if (mediaLocalPreview?.url) {
        URL.revokeObjectURL(mediaLocalPreview.url);
      }
    };
  }, [mediaLocalPreview?.url]);

  useEffect(() => {
    if (aiStatus !== "loading") return;

    const file = aiFileRef.current?.files?.[0] ?? null;
    const hasUrl = Boolean(aiSourceUrl.trim());
    const isPdf = Boolean(file?.name.toLowerCase().endsWith(".pdf") || file?.type === "application/pdf");

    const interval = window.setInterval(() => {
      setAiProgress((prev) => {
        const nextPercent = Math.min(prev.percent + (isPdf ? 3 : 5), 94);

        if (nextPercent < 20) {
          return {
            percent: nextPercent,
            label: "Preparando material",
            detail: file ? `Validando ${file.name}` : hasUrl ? "Validando URL informada" : "Preparando texto colado"
          };
        }

        if (nextPercent < 48) {
          return {
            percent: nextPercent,
            label: isPdf ? "Lendo PDF" : hasUrl ? "Lendo página" : "Lendo texto",
            detail: isPdf
              ? "Extraindo texto, renderizando páginas e procurando imagens."
              : hasUrl
                ? "Extraindo HTML, metadados, textos e imagens da página."
                : "Organizando o conteúdo para análise."
          };
        }

        if (nextPercent < 78) {
          return {
            percent: nextPercent,
            label: "Analisando com IA",
            detail: "Identificando informações, localização, preços, plantas e SEO."
          };
        }

        return {
          percent: nextPercent,
          label: isPdf ? "Recortando imagens" : hasUrl ? "Selecionando imagens" : "Finalizando rascunho",
          detail: isPdf
            ? "Separando fachadas, plantas e imagens úteis para anexar."
            : hasUrl
              ? "Escolhendo imagens comerciais encontradas no site."
              : "Aplicando os campos encontrados ao formulário."
        };
      });
    }, 700);

    return () => window.clearInterval(interval);
  }, [aiSourceUrl, aiStatus]);

  function selectDevelopment(id: string) {
    const next = items.find((item) => item.id === id) ?? null;
    setSelectedId(id);
    setMode("edit");
    setForm(toFormState(next));
    setSaveStatus("idle");
    setSaveMessage("");
    setAiStatus("idle");
    setAiMessage("");
    setAiSourceUrl("");
    setAiProgress({ percent: 0, label: "", detail: "" });
    setAiUnitTypes([]);
    setAiMediaCandidates([]);
    setAiMediaUploadingIndex(null);
    resetMediaForm();
    resetAmenityForm();
    setMediaPosition(String(next?.media.length ?? 0));
    setAmenityPosition(String(next?.amenityItems.length ?? 0));
  }

  function resetCreate() {
    setMode("create");
    setSelectedId("");
    setForm(toFormState(null));
    setSaveStatus("idle");
    setSaveMessage("");
    setAiStatus("idle");
    setAiMessage("");
    setAiSourceUrl("");
    setAiProgress({ percent: 0, label: "", detail: "" });
    setAiUnitTypes([]);
    setAiMediaCandidates([]);
    setAiMediaUploadingIndex(null);
    resetMediaForm();
    resetAmenityForm();
    setAmenityPosition("0");
    setActiveTab("basic");
  }

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function matchBuilderIdByName(name: string) {
    const normalizedName = slugify(name);
    if (!normalizedName) return "";

    const matched = builders.find((builder) => {
      const normalizedBuilder = slugify(builder.name);
      return normalizedBuilder === normalizedName || normalizedBuilder.includes(normalizedName) || normalizedName.includes(normalizedBuilder);
    });

    return matched?.id ?? "";
  }

  function applyAiAutofillFields(fields: AiAutofillResponse["fields"]) {
    setForm((prev) => {
      const next = { ...prev };
      const mutable = next as Record<keyof DevelopmentFormState, string | boolean>;

      for (const [key, value] of Object.entries(fields)) {
        if (value === null || value === undefined || !(key in next)) continue;

        const fieldKey = key as keyof DevelopmentFormState;
        const currentValue = next[fieldKey];
        if (typeof currentValue === "boolean") {
          mutable[fieldKey] = Boolean(value);
          continue;
        }

        const stringValue = normalizeWhitespace(String(value));
        if (!stringValue) continue;
        mutable[fieldKey] = stringValue;
      }

      completeAiRequiredFields(next);

      const builderName = typeof fields.builderName === "string" ? fields.builderName : "";
      const matchedBuilderId = builderName ? matchBuilderIdByName(builderName) : "";
      if (matchedBuilderId) {
        next.builderId = matchedBuilderId;
      }

      return next;
    });
  }

  function handleAiFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setAiFileName(file?.name ?? "");
    setAiProgress({ percent: 0, label: "", detail: "" });
    setAiStatus("idle");
    setAiMessage("");

    if (file && file.size > MAX_AI_UPLOAD_BYTES) {
      setAiStatus("error");
      setAiMessage(
        `Esse arquivo tem ${formatFileSize(file.size)}. O limite atual para preenchimento com IA é ${formatFileSize(MAX_AI_UPLOAD_BYTES)}. Compacte o PDF ou envie uma versão menor.`
      );
    }
  }

  async function runAiAutofill() {
    const file = aiFileRef.current?.files?.[0] ?? null;
    const sourceUrl = aiSourceUrl.trim();

    if (!file && !aiText.trim() && !sourceUrl) {
      setAiStatus("error");
      setAiMessage("Informe uma URL, envie um arquivo .txt/.pdf ou cole o texto do material.");
      return;
    }

    if (file && file.size > MAX_AI_UPLOAD_BYTES) {
      setAiStatus("error");
      setAiProgress({ percent: 0, label: "", detail: "" });
      setAiMessage(
        `Esse arquivo tem ${formatFileSize(file.size)}. O limite atual para preenchimento com IA é ${formatFileSize(MAX_AI_UPLOAD_BYTES)}. Compacte o PDF ou divida o material antes de enviar.`
      );
      return;
    }

    setAiStatus("loading");
    setAiMessage("Lendo arquivo e analisando com IA. Isso pode levar alguns instantes.");
    setAiProgress({
      percent: 8,
      label: file ? "Preparando material" : sourceUrl ? "Preparando página" : "Preparando texto",
      detail: file ? `Validando ${file.name}` : sourceUrl ? "Validando URL informada" : "Organizando texto colado"
    });

    try {
      const body = new FormData();
      if (aiText.trim()) body.append("text", aiText.trim());
      if (sourceUrl) body.append("sourceUrl", sourceUrl);
      if (file) body.append("file", file);

      const response = await fetch("/api/crm/developments/ai-autofill", {
        method: "POST",
        body
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Sessão expirada ou usuário sem permissão para preencher com IA. Entre no CRM novamente e tente outra vez.");
        }

        throw new Error(data?.error?.message ?? "Falha ao preencher com IA.");
      }

      const autofill = data.data.autofill as AiAutofillResponse;
      const mediaCandidates = autofill.mediaCandidates
        .map(mediaCandidateDraftFromAi)
        .filter((candidate): candidate is AiMediaCandidateDraft => Boolean(candidate));

      applyAiAutofillFields(autofill.fields);
      setAiUnitTypes(autofill.unitTypes.map(unitTypeDraftFromAi).filter((unit) => unit.name.trim()));
      setAiMediaCandidates(mediaCandidates);
      setActiveTab("basic");
      setAiStatus("success");
      setAiProgress({
        percent: 100,
        label: "Rascunho pronto",
        detail: "Campos preenchidos para revisão."
      });
      setAiMessage(
        autofill.unitTypes.length || mediaCandidates.length
          ? `Rascunho preenchido. ${autofill.unitTypes.length} planta(s) e ${mediaCandidates.length} imagem(ns) sugeridas foram colocadas para revisão.`
          : "Rascunho preenchido. Revise os campos antes de salvar."
      );
    } catch (error) {
      setAiStatus("error");
      setAiProgress({
        percent: 0,
        label: "",
        detail: ""
      });
      setAiMessage(error instanceof Error ? error.message : "Erro ao preencher com IA.");
    }
  }

  function updateAiUnitType<K extends keyof AiUnitTypeDraft>(index: number, key: K, value: AiUnitTypeDraft[K]) {
    setAiUnitTypes((prev) => prev.map((unit, itemIndex) => (itemIndex === index ? { ...unit, [key]: value } : unit)));
  }

  function addAiUnitType() {
    setAiUnitTypes((prev) => [...prev, emptyUnitTypeDraft(prev.length)]);
    setActiveTab("plants");
  }

  function removeAiUnitType(index: number) {
    setAiUnitTypes((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  function buildUnitTypePayload(unit: AiUnitTypeDraft, index: number) {
    return {
      name: unit.name.trim(),
      unitCategory: unit.unitCategory || undefined,
      bedrooms: parseNumber(unit.bedrooms),
      suites: parseNumber(unit.suites),
      bathrooms: parseNumber(unit.bathrooms),
      parkingSpaces: parseNumber(unit.parkingSpaces),
      areaPrivateM2: parseNumber(unit.areaPrivateM2),
      areaTotalM2: parseNumber(unit.areaTotalM2),
      initialPrice: parseNumber(unit.initialPrice),
      description: optionalString(unit.description),
      isAvailable: unit.isAvailable,
      position: parseNumber(unit.position) ?? index
    };
  }

  async function persistAiUnitTypes(developmentId: string) {
    const validUnitTypes = aiUnitTypes.filter((unit) => unit.name.trim().length >= 2);

    await Promise.all(
      validUnitTypes.map((unit, index) =>
        fetchJson(`/api/crm/developments/${developmentId}/unit-types`, "POST", buildUnitTypePayload(unit, index))
      )
    );

    return validUnitTypes.length;
  }

  function updateAiMediaCandidate<K extends keyof AiMediaCandidateDraft>(
    index: number,
    key: K,
    value: AiMediaCandidateDraft[K]
  ) {
    setAiMediaCandidates((prev) =>
      prev.map((candidate, itemIndex) => (itemIndex === index ? { ...candidate, [key]: value } : candidate))
    );
  }

  function removeAiMediaCandidate(index: number) {
    setAiMediaCandidates((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  async function attachAiMediaCandidate(index: number) {
    if (!selectedId) {
      setSaveStatus("error");
      setSaveMessage("Salve o empreendimento antes de anexar a imagem sugerida.");
      return;
    }

    const candidate = aiMediaCandidates[index];
    if (!candidate || candidate.attached) return;

    setAiMediaUploadingIndex(index);
    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const directUploadResponse = await fetch("/api/media/images/direct-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          metadata: {
            module: "development",
            developmentId: selectedId,
            source: candidate.imageUrl ? "ai-web-scrape" : "ai-pdf",
            page: candidate.page,
            imageUrl: candidate.imageUrl,
            category: candidate.category,
            kind: candidate.kind
          }
        })
      });

      const directUploadData = await directUploadResponse.json();
      if (!directUploadResponse.ok || !directUploadData.success) {
        throw new Error(directUploadData?.error?.message ?? "Falha ao gerar upload direto.");
      }

      const uploadUrl = directUploadData.data.directUpload.uploadURL as string;
      const imageDeliveryUrl = directUploadData.data.imageDeliveryUrl as string | null | undefined;
      const blob = await dataUrlToBlob(candidate.dataUrl);
      const fileName = `${candidate.cropApplied ? "recorte" : candidate.imageUrl ? "site" : "pagina"}-${candidate.page ?? index + 1}.png`;
      const watermarkedFile = await applyWatermarkToImage(blob, { fileName });
      const body = new FormData();
      body.append("file", watermarkedFile);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body
      });

      const uploadPayload = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadPayload.success) {
        throw new Error(uploadPayload?.errors?.[0]?.message ?? "Falha no upload da imagem.");
      }

      const variants = uploadPayload?.result?.variants as string[] | undefined;
      const imageUrl = imageDeliveryUrl || variants?.[0];
      if (!imageUrl) {
        throw new Error("Upload concluído, mas a URL da imagem não foi retornada.");
      }

      await fetchJson(`/api/crm/developments/${selectedId}/media`, "POST", {
        kind: candidate.kind,
        category: candidate.category,
        url: imageUrl,
        title: optionalString(candidate.title),
        caption: optionalString(candidate.caption),
        isPrimary: candidate.kind === "HERO",
        position: (selected?.media.length ?? 0) + index,
        status: "PRONTO",
        metadata: {
          source: candidate.imageUrl ? "ai-web-scrape" : "ai-pdf",
          page: candidate.page,
          imageUrl: candidate.imageUrl,
          confidence: parseNumber(candidate.confidence),
          cropApplied: candidate.cropApplied,
          crop: candidate.crop,
          width: candidate.width,
          height: candidate.height
        }
      });

      updateAiMediaCandidate(index, "attached", true);
      setSaveStatus("success");
      setSaveMessage("Imagem sugerida anexada ao empreendimento.");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Falha ao anexar imagem sugerida.");
    } finally {
      setAiMediaUploadingIndex(null);
    }
  }

  function buildPayload() {
    const title = form.title.trim();
    const slug = form.slug.trim() || slugify(title);

    return {
      title,
      slug,
      summary: form.summary.trim(),
      tagline: optionalString(form.tagline),
      description: form.description.trim(),
      propertyType: form.propertyType,
      stage: form.stage,
      status: form.status,
      city: form.city.trim() || "Palmas",
      district: form.district.trim(),
      neighborhood: optionalString(form.neighborhood),
      address: optionalString(form.address),
      postalCode: optionalString(form.postalCode),
      latitude: parseNumber(form.latitude),
      longitude: parseNumber(form.longitude),
      developerName: optionalString(form.developerName),
      builderName: optionalString(form.builderName),
      builderId: form.builderId || undefined,
      deliveryDate: monthInputToIso(form.deliveryDate),
      constructionProgressPct: parseNullableNumber(form.constructionProgressPct),
      appreciationPotential: form.appreciationPotential || null,
      buyerProfile: nullableString(form.buyerProfile),
      opportunityText: nullableString(form.opportunityText),
      showInvestmentPotentialBlock: form.showInvestmentPotentialBlock,
      startingPrice: parseNumber(form.startingPrice),
      priceMax: parseNumber(form.priceMax),
      areaFromM2: parseNumber(form.areaFromM2),
      areaToM2: parseNumber(form.areaToM2),
      landAreaM2: parseNumber(form.landAreaM2),
      bedroomsFrom: parseNumber(form.bedroomsFrom),
      bedroomsTo: parseNumber(form.bedroomsTo),
      suitesFrom: parseNumber(form.suitesFrom),
      suitesTo: parseNumber(form.suitesTo),
      bathroomsFrom: parseNumber(form.bathroomsFrom),
      bathroomsTo: parseNumber(form.bathroomsTo),
      parkingFrom: parseNumber(form.parkingFrom),
      parkingTo: parseNumber(form.parkingTo),
      towersCount: parseNumber(form.towersCount),
      floorsCount: parseNumber(form.floorsCount),
      elevatorsCount: parseNumber(form.elevatorsCount),
      totalUnits: parseNumber(form.totalUnits),
      availableUnits: parseNumber(form.availableUnits),
      incorporationRegistry: optionalString(form.incorporationRegistry),
      hasPatrimonyOfAffectation: form.hasPatrimonyOfAffectation,
      amenities: parseLines(form.amenitiesText),
      differentials: parseLines(form.differentialsText),
      projectText: optionalString(form.projectText),
      apartmentsText: optionalString(form.apartmentsText),
      locationText: optionalString(form.locationText),
      locationHighlights: optionalString(form.locationHighlights),
      referencePoints: parseReferencePointLines(form.referencePoints),
      regionLiquidityNotes: optionalString(form.regionLiquidityNotes),
      mapEmbedUrl: optionalString(form.mapEmbedUrl),
      tablePdfUrl: optionalString(form.tablePdfUrl),
      whatsappMessageTemplate: optionalString(form.whatsappMessageTemplate),
      ctaPrimaryLabel: optionalString(form.ctaPrimaryLabel),
      ctaPrimaryUrl: optionalString(form.ctaPrimaryUrl),
      ctaSecondaryLabel: optionalString(form.ctaSecondaryLabel),
      ctaSecondaryUrl: optionalString(form.ctaSecondaryUrl),
      seoTitle: optionalString(form.seoTitle),
      seoDescription: optionalString(form.seoDescription),
      seoOgImageUrl: optionalString(form.seoOgImageUrl),
      seoKeyword: optionalString(form.seoKeyword),
      seoNoIndex: form.seoNoIndex,
      isFeatured: form.isFeatured,
      displayOrder: parseNumber(form.displayOrder) ?? 0,
      showPrice: form.showPrice,
      showMap: form.showMap,
      showBuilder: form.showBuilder,
      showFloorplanTable: form.showFloorplanTable,
      showWhatsappButton: form.showWhatsappButton,
      isPublished: form.isPublished
    };
  }

  async function onSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationIssues = validateRequiredDevelopmentForm(form);
    if (validationIssues.length) {
      setSaveStatus("error");
      setSaveMessage(formatClientValidationMessage(validationIssues));
      setActiveTab(validationIssues[0]?.tab ?? "basic");
      return;
    }

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = buildPayload();
      let targetDevelopmentId = selectedId;

      if (mode === "create") {
        const data = await fetchJson("/api/crm/developments", "POST", payload);
        const created = data.data.development as DevelopmentItem;
        setItems((prev) => [{ ...created, amenityItems: [], media: [], towers: [], unitTypes: [], units: [], milestones: [], faqs: [] }, ...prev]);
        setSelectedId(created.id);
        setMode("edit");
        targetDevelopmentId = created.id;
        setAmenityPosition("0");
      } else {
        const data = await fetchJson(`/api/crm/developments/${selectedId}`, "PATCH", payload);
        const updated = data.data.development as DevelopmentItem;
        setItems((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
      }

      let createdUnitTypes = 0;
      let unitTypeError = "";

      if (targetDevelopmentId && aiUnitTypes.some((unit) => unit.name.trim().length >= 2)) {
        try {
          createdUnitTypes = await persistAiUnitTypes(targetDevelopmentId);
          setAiUnitTypes([]);
        } catch (error) {
          unitTypeError = error instanceof Error ? error.message : "Falha ao criar plantas sugeridas.";
        }
      }

      setSaveStatus(unitTypeError ? "error" : "success");
      setSaveMessage(
        unitTypeError
          ? `Empreendimento salvo, mas as plantas sugeridas não foram criadas: ${unitTypeError}`
          : createdUnitTypes
            ? `Empreendimento salvo com sucesso. ${createdUnitTypes} planta(s) sugeridas foram adicionadas.`
            : "Empreendimento salvo com sucesso."
      );
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Erro ao salvar empreendimento.");
    }
  }

  async function updatePublicationStatus(status: string) {
    if (!selectedId) return;
    setSaveStatus("saving");

    try {
      await fetchJson(`/api/crm/developments/${selectedId}/status`, "PATCH", { status });
      setSaveStatus("success");
      setSaveMessage(`Status atualizado para ${status}. Recarregue para ver checklist final.`);
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Falha ao atualizar status.");
    }
  }

  async function duplicateSelected() {
    if (!selectedId) return;
    setSaveStatus("saving");
    try {
      await fetchJson(`/api/crm/developments/${selectedId}/duplicate`, "POST");
      setSaveStatus("success");
      setSaveMessage("Cópia criada. Atualize a página para carregar a nova versão.");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Falha ao duplicar.");
    }
  }

  async function archiveSelected() {
    if (!selectedId) return;
    if (!window.confirm("Arquivar este empreendimento?")) return;

    setSaveStatus("saving");
    try {
      await fetchJson(`/api/crm/developments/${selectedId}/archive`, "PATCH");
      setSaveStatus("success");
      setSaveMessage("Empreendimento arquivado.");
      setItems((prev) => prev.filter((item) => item.id !== selectedId));
      resetCreate();
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Falha ao arquivar.");
    }
  }

  async function createTower(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) return;

    const fd = new FormData(event.currentTarget);

    try {
      const data = await fetchJson(`/api/crm/developments/${selectedId}/towers`, "POST", {
        name: fd.get("name"),
        slug: optionalString(String(fd.get("slug") ?? "")),
        propertyType: fd.get("propertyType") || undefined,
        description: optionalString(String(fd.get("description") ?? "")),
        floorsCount: parseNumber(String(fd.get("floorsCount") ?? "")),
        elevatorsCount: parseNumber(String(fd.get("elevatorsCount") ?? "")),
        totalUnits: parseNumber(String(fd.get("totalUnits") ?? "")),
        availableUnits: parseNumber(String(fd.get("availableUnits") ?? "")),
        deliveryDate: monthInputToIso(String(fd.get("deliveryDate") ?? "")),
        incorporationRegistry: optionalString(String(fd.get("incorporationRegistry") ?? "")),
        position: parseNumber(String(fd.get("position") ?? ""))
      });

      const tower = data.data.tower as DevelopmentItem["towers"][number];
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                towers: [...item.towers, tower].sort((a, b) => a.position - b.position)
              }
            : item
        )
      );
      setSaveStatus("success");
      setSaveMessage("Torre/bloco adicionado.");
      event.currentTarget.reset();
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Falha ao criar torre/bloco.");
    }
  }

  async function createUnitType(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) return;

    const fd = new FormData(event.currentTarget);

    try {
      const data = await fetchJson(`/api/crm/developments/${selectedId}/unit-types`, "POST", {
        towerId: fd.get("towerId") || undefined,
        name: fd.get("name"),
        unitCategory: fd.get("unitCategory") || undefined,
        bedrooms: parseNumber(String(fd.get("bedrooms") ?? "")),
        suites: parseNumber(String(fd.get("suites") ?? "")),
        bathrooms: parseNumber(String(fd.get("bathrooms") ?? "")),
        parkingSpaces: parseNumber(String(fd.get("parkingSpaces") ?? "")),
        areaPrivateM2: parseNumber(String(fd.get("areaPrivateM2") ?? "")),
        areaTotalM2: parseNumber(String(fd.get("areaTotalM2") ?? "")),
        initialPrice: parseNumber(String(fd.get("initialPrice") ?? "")),
        imageUrl: optionalString(String(fd.get("imageUrl") ?? "")),
        description: optionalString(String(fd.get("description") ?? "")),
        isAvailable: fd.get("isAvailable") === "on",
        position: parseNumber(String(fd.get("position") ?? ""))
      });

      const rawUnitType = data.data.unitType as {
        id: string;
        towerId: string | null;
        name: string;
        unitCategory: string | null;
        bedrooms: number | null;
        suites: number | null;
        bathrooms: number | null;
        parkingSpaces: number | null;
        areaPrivateM2?: unknown;
        areaTotalM2?: unknown;
        initialPrice?: unknown;
        imageUrl: string | null;
        availableUnits: number | null;
        totalUnits: number | null;
        description: string | null;
        position: number;
        isAvailable: boolean;
      };
      const towerName = selected?.towers.find((tower) => tower.id === rawUnitType.towerId)?.name ?? null;
      const unitType: DevelopmentItem["unitTypes"][number] = {
        id: rawUnitType.id,
        towerId: rawUnitType.towerId ?? null,
        towerName,
        name: rawUnitType.name,
        unitCategory: rawUnitType.unitCategory ?? null,
        bedrooms: rawUnitType.bedrooms ?? null,
        suites: rawUnitType.suites ?? null,
        bathrooms: rawUnitType.bathrooms ?? null,
        parkingSpaces: rawUnitType.parkingSpaces ?? null,
        areaPrivateM2Number: apiNumber(rawUnitType.areaPrivateM2),
        areaTotalM2Number: apiNumber(rawUnitType.areaTotalM2),
        initialPriceNumber: apiNumber(rawUnitType.initialPrice),
        imageUrl: rawUnitType.imageUrl ?? null,
        availableUnits: rawUnitType.availableUnits ?? null,
        totalUnits: rawUnitType.totalUnits ?? null,
        description: rawUnitType.description ?? null,
        position: rawUnitType.position ?? 0,
        isAvailable: rawUnitType.isAvailable
      };
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                unitTypes: [...item.unitTypes, unitType]
              }
            : item
        )
      );
      setSaveStatus("success");
      setSaveMessage("Tipologia adicionada.");
      event.currentTarget.reset();
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Falha ao criar tipologia.");
    }
  }

  async function createUnit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) return;

    const fd = new FormData(event.currentTarget);

    try {
      const data = await fetchJson(`/api/crm/developments/${selectedId}/units`, "POST", {
        towerId: fd.get("towerId") || undefined,
        unitTypeId: fd.get("unitTypeId") || undefined,
        label: fd.get("label"),
        unitNumber: optionalString(String(fd.get("unitNumber") ?? "")),
        floor: parseNumber(String(fd.get("floor") ?? "")),
        status: fd.get("status") || "DISPONIVEL",
        price: parseNumber(String(fd.get("price") ?? "")),
        areaPrivateM2: parseNumber(String(fd.get("areaPrivateM2") ?? "")),
        areaTotalM2: parseNumber(String(fd.get("areaTotalM2") ?? "")),
        parkingSpaces: parseNumber(String(fd.get("parkingSpaces") ?? "")),
        orientation: optionalString(String(fd.get("orientation") ?? "")),
        notes: optionalString(String(fd.get("notes") ?? "")),
        position: parseNumber(String(fd.get("position") ?? ""))
      });

      const rawUnit = data.data.unit as {
        id: string;
        towerId: string | null;
        unitTypeId: string | null;
        label: string;
        unitNumber: string | null;
        floor: number | null;
        status: string;
        price?: unknown;
        areaPrivateM2?: unknown;
        areaTotalM2?: unknown;
        parkingSpaces: number | null;
        orientation: string | null;
        notes: string | null;
        position: number;
      };
      const towerName = selected?.towers.find((tower) => tower.id === rawUnit.towerId)?.name ?? null;
      const unitTypeName = selected?.unitTypes.find((unitType) => unitType.id === rawUnit.unitTypeId)?.name ?? null;
      const unit: DevelopmentItem["units"][number] = {
        id: rawUnit.id,
        towerId: rawUnit.towerId ?? null,
        unitTypeId: rawUnit.unitTypeId ?? null,
        towerName,
        unitTypeName,
        label: rawUnit.label,
        unitNumber: rawUnit.unitNumber ?? null,
        floor: rawUnit.floor ?? null,
        status: rawUnit.status,
        priceNumber: apiNumber(rawUnit.price),
        areaPrivateM2Number: apiNumber(rawUnit.areaPrivateM2),
        areaTotalM2Number: apiNumber(rawUnit.areaTotalM2),
        parkingSpaces: rawUnit.parkingSpaces ?? null,
        orientation: rawUnit.orientation ?? null,
        notes: rawUnit.notes ?? null,
        position: rawUnit.position
      };

      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                units: [...item.units, unit].sort((a, b) => a.position - b.position)
              }
            : item
        )
      );
      setSaveStatus("success");
      setSaveMessage("Unidade adicionada.");
      event.currentTarget.reset();
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Falha ao criar unidade.");
    }
  }

  async function createMilestone(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) return;

    const fd = new FormData(event.currentTarget);

    try {
      await fetchJson(`/api/crm/developments/${selectedId}/milestones`, "POST", {
        title: fd.get("title"),
        description: optionalString(String(fd.get("description") ?? "")),
        status: fd.get("status") || "NOT_STARTED",
        progressPct: parseNumber(String(fd.get("progressPct") ?? "")),
        targetDate: fd.get("targetDate")
          ? new Date(String(fd.get("targetDate"))).toISOString()
          : undefined,
        position: parseNumber(String(fd.get("position") ?? ""))
      });

      setSaveStatus("success");
      setSaveMessage("Marco de obra adicionado.");
      event.currentTarget.reset();
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Falha ao criar marco.");
    }
  }

  async function createFaq(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) return;

    const fd = new FormData(event.currentTarget);

    try {
      await fetchJson(`/api/crm/developments/${selectedId}/faqs`, "POST", {
        question: fd.get("question"),
        answer: fd.get("answer"),
        position: parseNumber(String(fd.get("position") ?? ""))
      });

      setSaveStatus("success");
      setSaveMessage("FAQ adicionada.");
      event.currentTarget.reset();
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Falha ao criar FAQ.");
    }
  }

  function resetMediaForm(form?: HTMLFormElement | null) {
    if (form) form.reset();
    if (uploadFileRef.current) uploadFileRef.current.value = "";
    if (mediaLocalPreview?.url) URL.revokeObjectURL(mediaLocalPreview.url);
    setMediaLocalPreview(null);
    setMediaUrl("");
    setMediaShowManualUrl(false);
    setMediaKind("GALLERY");
    setMediaCategory("FACHADA");
    setMediaTitle("");
    setMediaCaption("");
    setMediaPosition("0");
    setMediaIsPrimary(false);
    setMediaTowerId("");
    setMediaUnitTypeId("");
    setMediaInfo("");
    setMediaError("");
  }

  function handleMediaFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    setMediaError("");
    setMediaInfo("");
    const file = event.target.files?.[0];
    if (mediaLocalPreview?.url) URL.revokeObjectURL(mediaLocalPreview.url);

    if (!file) {
      setMediaLocalPreview(null);
      return;
    }

    const MAX_BYTES = 10 * 1024 * 1024;
    if (!file.type.startsWith("image/")) {
      setMediaError("Arquivo inválido. Selecione uma imagem (JPG, PNG, WEBP).");
      setMediaLocalPreview(null);
      event.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setMediaError(`Imagem acima do limite de 10 MB (tamanho atual: ${(file.size / 1024 / 1024).toFixed(1)} MB).`);
      setMediaLocalPreview(null);
      event.target.value = "";
      return;
    }

    setMediaLocalPreview({
      name: file.name,
      sizeKb: Math.round(file.size / 1024),
      url: URL.createObjectURL(file)
    });
    // URL anterior fica obsoleta com o novo arquivo selecionado
    setMediaUrl("");
  }

  async function createMedia() {
    if (!selectedId) {
      setMediaError("Salve o empreendimento antes de adicionar imagens.");
      return;
    }

    const url = mediaUrl.trim();

    if (!url) {
      setMediaError("Envie uma imagem ou informe uma URL externa antes de adicionar a mídia.");
      return;
    }

    setMediaError("");
    setMediaInfo("");
    setMediaSubmitting(true);
    setSaveStatus("saving");

    try {
      const data = await fetchJson(`/api/crm/developments/${selectedId}/media`, "POST", {
        towerId: mediaTowerId || undefined,
        unitTypeId: mediaUnitTypeId || undefined,
        kind: mediaKind,
        category: mediaCategory,
        url,
        title: optionalString(mediaTitle),
        caption: optionalString(mediaCaption),
        isPrimary: mediaIsPrimary,
        position: parseNumber(mediaPosition)
      });
      const rawMedia = data.data.media as DevelopmentItem["media"][number];
      const createdMedia: DevelopmentItem["media"][number] = {
        ...rawMedia,
        caption: rawMedia.caption ?? optionalString(mediaCaption) ?? null,
        isPrimary: rawMedia.isPrimary ?? mediaIsPrimary,
        towerId: (rawMedia.towerId ?? mediaTowerId) || null,
        towerName: selected?.towers.find((tower) => tower.id === (rawMedia.towerId ?? mediaTowerId))?.name ?? null,
        unitTypeId: (rawMedia.unitTypeId ?? mediaUnitTypeId) || null,
        unitTypeName:
          selected?.unitTypes.find((unitType) => unitType.id === (rawMedia.unitTypeId ?? mediaUnitTypeId))?.name ?? null
      };

      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                media: [...item.media, createdMedia].sort((a, b) => a.position - b.position)
              }
            : item
        )
      );

      setSaveStatus("success");
      setSaveMessage("Mídia adicionada.");
      setMediaInfo("Mídia adicionada com sucesso.");
      resetMediaForm();
      setMediaPosition(String((selected?.media.length ?? 0) + 1));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao adicionar mídia.";
      setSaveStatus("error");
      setSaveMessage(message);
      setMediaError(message);
    } finally {
      setMediaSubmitting(false);
    }
  }

  async function deleteMedia(mediaId: string) {
    if (!selectedId) return;
    if (!window.confirm("Excluir esta mídia? Esta ação não pode ser desfeita.")) return;

    setSaveStatus("saving");
    setMediaError("");
    setMediaInfo("");

    try {
      await fetchJson(`/api/crm/developments/${selectedId}/media/${mediaId}`, "DELETE");

      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? { ...item, media: item.media.filter((m) => m.id !== mediaId) }
            : item
        )
      );

      setSaveStatus("success");
      setSaveMessage("Mídia excluída.");
      setMediaInfo("Mídia excluída.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao excluir mídia.";
      setSaveStatus("error");
      setSaveMessage(message);
      setMediaError(message);
    }
  }

  function resetAmenityForm() {
    setAmenityTowerId("");
    setAmenityType("LAZER");
    setAmenityIcon("pool");
    setAmenityLabel("");
    setAmenityDescription("");
    setAmenityPosition(String(selected?.amenityItems.length ?? 0));
    setAmenityIsHighlighted(true);
    setAmenityMessage("");
  }

  async function createAmenity() {
    if (!selectedId) {
      setAmenityMessage("Salve o empreendimento antes de adicionar lazer ou diferencial.");
      return;
    }

    if (!amenityLabel.trim()) {
      setAmenityMessage("Informe o nome do item antes de adicionar.");
      return;
    }

    setAmenitySubmitting(true);
    setSaveStatus("saving");
    setAmenityMessage("");

    try {
      const data = await fetchJson(`/api/crm/developments/${selectedId}/amenities`, "POST", {
        towerId: amenityTowerId || undefined,
        type: amenityType,
        label: amenityLabel,
        description: optionalString(amenityDescription),
        icon: amenityIcon || undefined,
        isHighlighted: amenityIsHighlighted,
        position: parseNumber(amenityPosition)
      });

      const rawAmenity = data.data.amenity as DevelopmentItem["amenityItems"][number];
      const createdAmenity: DevelopmentItem["amenityItems"][number] = {
        ...rawAmenity,
        towerId: (rawAmenity.towerId ?? amenityTowerId) || null,
        towerName: selected?.towers.find((tower) => tower.id === (rawAmenity.towerId ?? amenityTowerId))?.name ?? rawAmenity.towerName ?? null,
        description: rawAmenity.description ?? optionalString(amenityDescription) ?? null,
        icon: rawAmenity.icon ?? amenityIcon ?? null,
        isHighlighted: rawAmenity.isHighlighted ?? amenityIsHighlighted,
        position: rawAmenity.position ?? parseNumber(amenityPosition) ?? 0
      };

      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? {
                ...item,
                amenityItems: [...item.amenityItems, createdAmenity].sort((a, b) => a.position - b.position)
              }
            : item
        )
      );

      setSaveStatus("success");
      setSaveMessage("Item de lazer/diferencial adicionado.");
      setAmenityMessage("Item adicionado.");
      setAmenityLabel("");
      setAmenityDescription("");
      setAmenityPosition(String((selected?.amenityItems.length ?? 0) + 1));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao adicionar lazer/diferencial.";
      setSaveStatus("error");
      setSaveMessage(message);
      setAmenityMessage(message);
    } finally {
      setAmenitySubmitting(false);
    }
  }

  async function deleteAmenity(amenityId: string) {
    if (!selectedId) return;
    if (!window.confirm("Excluir este item de lazer/diferencial?")) return;

    setAmenitySubmitting(true);
    setSaveStatus("saving");
    setAmenityMessage("");

    try {
      await fetchJson(`/api/crm/developments/${selectedId}/amenities/${amenityId}`, "DELETE");

      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedId
            ? { ...item, amenityItems: item.amenityItems.filter((amenity) => amenity.id !== amenityId) }
            : item
        )
      );

      setSaveStatus("success");
      setSaveMessage("Item de lazer/diferencial excluído.");
      setAmenityMessage("Item excluído.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao excluir lazer/diferencial.";
      setSaveStatus("error");
      setSaveMessage(message);
      setAmenityMessage(message);
    } finally {
      setAmenitySubmitting(false);
    }
  }

  function renderAmenityCards(items: DevelopmentItem["amenityItems"]) {
    if (!items.length) {
      return (
        <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
          Nenhum item cadastrado neste escopo.
        </p>
      );
    }

    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
        {items
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((item) => {
            const Icon = getDevelopmentAmenityIcon(item.icon, `${item.label} ${item.description ?? ""}`);
            return (
              <div
                key={item.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 10,
                  display: "grid",
                  gap: 8,
                  background: "#ffffff"
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      display: "grid",
                      placeItems: "center",
                      color: "#1f3149",
                      background: "#f1f5f9",
                      flex: "0 0 auto"
                    }}
                  >
                    <Icon size={19} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ display: "block", color: "#1f3149", fontSize: "var(--fs-13)" }}>{item.label}</strong>
                    <span style={{ display: "block", color: "#64748b", fontSize: "var(--fs-12)" }}>
                      {amenityTypeLabel(item.type)} · {amenityScopeLabel(item)} · ordem {item.position}
                    </span>
                  </div>
                </div>
                {item.description ? (
                  <p className="text-card" style={{ margin: 0, color: "#526174", fontSize: "var(--fs-12)" }}>
                    {item.description}
                  </p>
                ) : null}
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => deleteAmenity(item.id)}
                  disabled={amenitySubmitting || saveStatus === "saving"}
                  style={{ justifySelf: "start", padding: "0.4rem 0.7rem", color: "#b3261e", fontSize: "var(--fs-12)" }}
                >
                  Excluir
                </button>
              </div>
            );
          })}
      </div>
    );
  }

  async function handleDirectUpload() {
    const file = uploadFileRef.current?.files?.[0];
    if (!file) {
      setMediaError("Selecione um arquivo de imagem antes de enviar.");
      return;
    }

    setMediaError("");
    setMediaInfo("Enviando imagem para a CDN...");
    setMediaFileUploading(true);

    try {
      const directUploadResponse = await fetch("/api/media/images/direct-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          metadata: {
            module: "development",
            developmentId: selectedId || "new"
          }
        })
      });

      const directUploadData = await directUploadResponse.json().catch(() => null);
      if (!directUploadResponse.ok || !directUploadData?.success) {
        throw new Error(directUploadData?.error?.message ?? "Não foi possível gerar o link de upload. Verifique as credenciais do Cloudflare.");
      }

      const uploadUrl = directUploadData.data.directUpload.uploadURL as string;
      const imageDeliveryUrl = directUploadData.data.imageDeliveryUrl as string | null | undefined;

      const watermarkedFile = await applyWatermarkToImage(file);
      const body = new FormData();
      body.append("file", watermarkedFile);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body
      });

      const uploadPayload = await uploadResponse.json().catch(() => null);
      if (!uploadResponse.ok || !uploadPayload?.success) {
        const cfMessage = uploadPayload?.errors?.[0]?.message as string | undefined;
        throw new Error(cfMessage ?? `Falha no upload (HTTP ${uploadResponse.status}).`);
      }

      const variants = uploadPayload?.result?.variants as string[] | undefined;
      const uploadResultUrl = variants?.[0];
      const finalUrl = imageDeliveryUrl ?? uploadResultUrl ?? "";

      if (!finalUrl) {
        throw new Error("Upload concluído, mas a URL pública não foi retornada. Verifique CLOUDFLARE_IMAGES_ACCOUNT_HASH.");
      }

      setMediaUrl(finalUrl);
      setMediaInfo("Imagem enviada com sucesso. Já pode adicionar a mídia.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro inesperado no upload.";
      setMediaError(message);
      setMediaInfo("");
    } finally {
      setMediaFileUploading(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <article className="card" style={{ padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <h3 className="title-luxury" style={{ margin: 0 }}>
            Lista de empreendimentos
          </h3>
          <button type="button" className="button button-primary" onClick={resetCreate}>
            Novo empreendimento
          </button>
        </div>
        <div style={{ marginTop: 10, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Cidade/Bairro</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Preço inicial</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={tdStyle}>{item.title}</td>
                  <td style={tdStyle}>{item.city} • {item.district}</td>
                  <td style={tdStyle}>{item.status}</td>
                  <td style={tdStyle}>{item.startingPriceNumber ? `R$ ${item.startingPriceNumber.toLocaleString("pt-BR")}` : "-"}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button type="button" className="button button-ghost" style={{ padding: "0.44rem 0.7rem" }} onClick={() => selectDevelopment(item.id)}>
                        Editar
                      </button>
                      <a className="button button-ghost" style={{ padding: "0.44rem 0.7rem" }} href={`/lancamentos/${item.slug}`} target="_blank" rel="noreferrer">
                        Preview
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <h3 className="title-luxury" style={{ margin: 0 }}>
            Preencher com IA
          </h3>
          {aiFileName ? (
            <span className="text-card" style={{ color: "var(--text-muted)", fontSize: "var(--fs-12)" }}>
              {aiFileName}
            </span>
          ) : null}
        </div>

        <div className="form-grid" style={{ marginTop: 12 }}>
          <div>
            <label>Arquivo de texto ou PDF</label>
            <input ref={aiFileRef} type="file" accept=".txt,.pdf,text/plain,application/pdf" onChange={handleAiFileChange} />
          </div>
          <div>
            <label>URL do empreendimento</label>
            <input
              value={aiSourceUrl}
              onChange={(event) => {
                setAiSourceUrl(event.target.value);
                setAiProgress({ percent: 0, label: "", detail: "" });
                if (aiStatus !== "loading") {
                  setAiStatus("idle");
                  setAiMessage("");
                }
              }}
              placeholder="https://site.com/empreendimento"
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Texto do material</label>
            <textarea value={aiText} onChange={(event) => setAiText(event.target.value)} />
          </div>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="button button-primary" onClick={runAiAutofill} disabled={aiStatus === "loading"}>
              {aiStatus === "loading" ? "Preenchendo..." : "Preencher com IA"}
            </button>
            <button
              type="button"
              className="button button-ghost"
              onClick={() => {
                setAiText("");
                setAiSourceUrl("");
                setAiFileName("");
                setAiStatus("idle");
                setAiMessage("");
                setAiProgress({ percent: 0, label: "", detail: "" });
                setAiUnitTypes([]);
                setAiMediaCandidates([]);
                if (aiFileRef.current) aiFileRef.current.value = "";
              }}
            >
              Limpar
            </button>
          </div>

          {aiStatus === "loading" || aiProgress.percent > 0 ? (
            <div style={{ gridColumn: "1 / -1", display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <strong className="text-card" style={{ fontSize: "var(--fs-12)" }}>
                  {aiProgress.label || "Processando"}
                </strong>
                <span className="text-card" style={{ color: "var(--text-muted)", fontSize: "var(--fs-12)" }}>
                  {aiProgress.percent}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={aiProgress.percent}
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(15, 23, 42, 0.08)",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${aiProgress.percent}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #0f766e, #d4a017)",
                    transition: "width 500ms ease"
                  }}
                />
              </div>
              {aiProgress.detail ? (
                <span className="text-card" style={{ color: "var(--text-muted)", fontSize: "var(--fs-12)" }}>
                  {aiProgress.detail}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        {aiMessage ? (
          <p style={{ marginBottom: 0, color: aiStatus === "error" ? "#c92a2a" : aiStatus === "success" ? "#0a7a56" : "#64748b" }}>
            {aiMessage}
          </p>
        ) : null}
      </article>

      <article className="card" style={{ padding: 16 }}>
        <h3 className="title-luxury" style={{ marginTop: 0 }}>
          {mode === "create" ? "Novo empreendimento" : `Editar empreendimento${selected ? ` • ${selected.title}` : ""}`}
        </h3>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`button ${activeTab === tab.id ? "button-primary" : "button-ghost"}`}
              style={{ padding: "0.5rem 0.75rem" }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form className="form-grid" onSubmit={onSave}>
          {activeTab === "basic" ? (
            <>
              <div><label>Nome do empreendimento</label><input value={form.title} onChange={(e) => updateField("title", e.target.value)} required /></div>
              <div><label>Slug</label><input value={form.slug} onChange={(e) => updateField("slug", e.target.value)} required /></div>
              <div>
                <label>Tipo</label>
                <select value={form.propertyType} onChange={(e) => updateField("propertyType", e.target.value)}>
                  {developmentPropertyTypeOptions.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div><label>Etapa atual do empreendimento</label><select value={form.stage} onChange={(e) => updateField("stage", e.target.value)}>{developmentStageOptions.map((item)=><option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
              <div><label>Status editorial</label><select value={form.status} onChange={(e) => updateField("status", e.target.value)}>{publicationOptions.map((item)=><option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
              <div><label>Frase curta</label><input value={form.summary} onChange={(e) => updateField("summary", e.target.value)} required /></div>
              <div style={{ gridColumn: "1 / -1" }}><label>Tagline</label><input value={form.tagline} onChange={(e) => updateField("tagline", e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label>Descrição principal</label><textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} required /></div>
            </>
          ) : null}

          {activeTab === "location" ? (
            <>
              <div><label>Cidade</label><input value={form.city} onChange={(e) => updateField("city", e.target.value)} required /></div>
              <div><label>Bairro</label><input value={form.district} onChange={(e) => updateField("district", e.target.value)} required /></div>
              <div><label>Setor/Quadra</label><input value={form.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} /></div>
              <div><label>CEP</label><input value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label>Endereço</label><input value={form.address} onChange={(e) => updateField("address", e.target.value)} /></div>
              <div><label>Latitude</label><input value={form.latitude} onChange={(e) => updateField("latitude", e.target.value)} /></div>
              <div><label>Longitude</label><input value={form.longitude} onChange={(e) => updateField("longitude", e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label>Link/Embed do mapa</label><input value={form.mapEmbedUrl} onChange={(e) => updateField("mapEmbedUrl", e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label>Pontos de referência (1 por linha: Nome | Distância | Tipo)</label><textarea value={form.referencePoints} onChange={(e) => updateField("referencePoints", e.target.value)} /></div>
            </>
          ) : null}

          {activeTab === "features" ? (
            <>
              <div><label>Preço inicial</label><input value={form.startingPrice} onChange={(e) => updateField("startingPrice", e.target.value)} /></div>
              <div><label>Preço máximo</label><input value={form.priceMax} onChange={(e) => updateField("priceMax", e.target.value)} /></div>
              <div><label>Área mínima (m²)</label><input value={form.areaFromM2} onChange={(e) => updateField("areaFromM2", e.target.value)} /></div>
              <div><label>Área máxima (m²)</label><input value={form.areaToM2} onChange={(e) => updateField("areaToM2", e.target.value)} /></div>
              <div><label>Área do terreno (m²)</label><input value={form.landAreaM2} onChange={(e) => updateField("landAreaM2", e.target.value)} /></div>
              <div><label>Quartos (de)</label><input value={form.bedroomsFrom} onChange={(e) => updateField("bedroomsFrom", e.target.value)} /></div>
              <div><label>Quartos (até)</label><input value={form.bedroomsTo} onChange={(e) => updateField("bedroomsTo", e.target.value)} /></div>
              <div><label>Suítes (de)</label><input value={form.suitesFrom} onChange={(e) => updateField("suitesFrom", e.target.value)} /></div>
              <div><label>Suítes (até)</label><input value={form.suitesTo} onChange={(e) => updateField("suitesTo", e.target.value)} /></div>
              <div><label>Banheiros (de)</label><input value={form.bathroomsFrom} onChange={(e) => updateField("bathroomsFrom", e.target.value)} /></div>
              <div><label>Banheiros (até)</label><input value={form.bathroomsTo} onChange={(e) => updateField("bathroomsTo", e.target.value)} /></div>
              <div><label>Vagas (de)</label><input value={form.parkingFrom} onChange={(e) => updateField("parkingFrom", e.target.value)} /></div>
              <div><label>Vagas (até)</label><input value={form.parkingTo} onChange={(e) => updateField("parkingTo", e.target.value)} /></div>
              <div><label>Torres</label><input value={form.towersCount} onChange={(e) => updateField("towersCount", e.target.value)} /></div>
              <div><label>Pavimentos</label><input value={form.floorsCount} onChange={(e) => updateField("floorsCount", e.target.value)} /></div>
              <div><label>Elevadores</label><input value={form.elevatorsCount} onChange={(e) => updateField("elevatorsCount", e.target.value)} /></div>
              <div><label>Unidades totais</label><input value={form.totalUnits} onChange={(e) => updateField("totalUnits", e.target.value)} /></div>
              <div><label>Unidades disponíveis</label><input value={form.availableUnits} onChange={(e) => updateField("availableUnits", e.target.value)} /></div>
              <div><label>Registro de incorporação</label><input value={form.incorporationRegistry} onChange={(e) => updateField("incorporationRegistry", e.target.value)} /></div>
              <label style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={form.hasPatrimonyOfAffectation} onChange={(e) => updateField("hasPatrimonyOfAffectation", e.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Patrimônio de afetação</span></label>
            </>
          ) : null}

          {activeTab === "investment" ? (
            <>
              <div><label>Previsão de entrega</label><input type="month" value={form.deliveryDate} onChange={(e) => updateField("deliveryDate", e.target.value)} /></div>
              <div><label>Percentual da obra (%)</label><input type="number" min={0} max={100} value={form.constructionProgressPct} onChange={(e) => updateField("constructionProgressPct", e.target.value)} placeholder="Automático pela etapa" /></div>
              <div><label>Potencial de valorização</label><select value={form.appreciationPotential} onChange={(e) => updateField("appreciationPotential", e.target.value)}><option value="">Automático pela etapa</option>{appreciationPotentialOptions.map((item)=><option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
              <div><label>Perfil indicado</label><input value={form.buyerProfile} onChange={(e) => updateField("buyerProfile", e.target.value)} placeholder="Automático pela etapa" /></div>
              <div style={{ gridColumn: "1 / -1" }}><label>Texto personalizado da oportunidade</label><textarea value={form.opportunityText} onChange={(e) => updateField("opportunityText", e.target.value)} placeholder="Se vazio, o site usa uma explicação consultiva baseada na etapa da obra." /></div>
              <label style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={form.showInvestmentPotentialBlock} onChange={(e) => updateField("showInvestmentPotentialBlock", e.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Exibir bloco “Potencial de Valorização por Etapa da Obra” na página pública</span></label>
              <p className="text-card" style={{ gridColumn: "1 / -1", margin: 0, color: "var(--text-muted)" }}>
                Os campos em branco usam uma leitura automática pela etapa atual. A comunicação pública deve falar em potencial, tendência e oportunidade de entrada, sem promessa de rentabilidade garantida.
              </p>
            </>
          ) : null}

          {activeTab === "descriptions" ? (
            <>
              <div style={{ gridColumn: "1 / -1" }}><label>Texto da seção Projeto</label><textarea value={form.projectText} onChange={(e) => updateField("projectText", e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label>Texto da seção Apartamentos</label><textarea value={form.apartmentsText} onChange={(e) => updateField("apartmentsText", e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label>Texto da seção Localização</label><textarea value={form.locationText} onChange={(e) => updateField("locationText", e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label>Destaques da localização</label><textarea value={form.locationHighlights} onChange={(e) => updateField("locationHighlights", e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label>Observações de liquidez</label><textarea value={form.regionLiquidityNotes} onChange={(e) => updateField("regionLiquidityNotes", e.target.value)} /></div>
              <div><label>Template WhatsApp</label><input value={form.whatsappMessageTemplate} onChange={(e) => updateField("whatsappMessageTemplate", e.target.value)} /></div>
              <div><label>PDF tabela</label><input value={form.tablePdfUrl} onChange={(e) => updateField("tablePdfUrl", e.target.value)} /></div>
            </>
          ) : null}

          {activeTab === "media" ? (
            <>
              <div style={{ gridColumn: "1 / -1", display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <strong className="text-card">Imagens sugeridas pela IA</strong>
                  {!selectedId && aiMediaCandidates.length ? (
                    <span className="text-card" style={{ color: "var(--text-muted)", fontSize: "var(--fs-12)" }}>
                      Salve o empreendimento para anexar.
                    </span>
                  ) : null}
                </div>

                {aiMediaCandidates.length ? (
                  <div style={{ display: "grid", gap: 12 }}>
                    {aiMediaCandidates.map((candidate, index) => (
                      <div
                        key={`${candidate.page ?? candidate.imageUrl ?? "media"}-${index}`}
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          overflow: "hidden",
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
                        }}
                      >
                        <Image
                          src={candidate.dataUrl}
                          alt={candidate.title || (candidate.page ? `Página ${candidate.page}` : "Imagem da página")}
                          width={candidate.width ?? 1024}
                          height={candidate.height ?? 1400}
                          unoptimized
                          style={{ width: "100%", height: "100%", minHeight: 180, objectFit: "cover", background: "#eef2f7" }}
                        />
                        <div className="form-grid" style={{ padding: 12 }}>
                          <div>
                            <label>Tipo</label>
                            <select value={candidate.kind} onChange={(e) => updateAiMediaCandidate(index, "kind", e.target.value)}>
                              {mediaKindOptions.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label>Categoria</label>
                            <select value={candidate.category} onChange={(e) => updateAiMediaCandidate(index, "category", e.target.value)}>
                              {mediaCategoryOptions.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                              ))}
                            </select>
                          </div>
                          <div><label>Título</label><input value={candidate.title} onChange={(e) => updateAiMediaCandidate(index, "title", e.target.value)} /></div>
                          <div><label>Origem</label><input value={candidate.page ? `PDF página ${candidate.page}` : "Página web"} readOnly /></div>
                          <div style={{ gridColumn: "1 / -1" }}>
                            <span className="text-card" style={{ color: "var(--text-muted)", fontSize: "var(--fs-12)" }}>
                              {candidate.cropApplied ? "Preview recortado automaticamente pela IA." : "Preview usando a página inteira do PDF."}
                            </span>
                          </div>
                          <div style={{ gridColumn: "1 / -1" }}><label>Legenda</label><input value={candidate.caption} onChange={(e) => updateAiMediaCandidate(index, "caption", e.target.value)} /></div>
                          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button
                              type="button"
                              className="button button-primary"
                              onClick={() => attachAiMediaCandidate(index)}
                              disabled={!selectedId || candidate.attached || aiMediaUploadingIndex === index}
                            >
                              {candidate.attached ? "Anexada" : aiMediaUploadingIndex === index ? "Anexando..." : "Anexar imagem"}
                            </button>
                            <button type="button" className="button button-ghost" onClick={() => removeAiMediaCandidate(index)} disabled={aiMediaUploadingIndex === index}>
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                    Nenhuma imagem sugerida no rascunho atual.
                  </p>
                )}

                <div
                  style={{
                    border: "1px solid #dbe4f0",
                    borderRadius: 10,
                    background: "#f8fbff",
                    padding: 12,
                    display: "grid",
                    gap: 8
                  }}
                >
                  <strong style={{ fontSize: "var(--fs-14)", color: "#1f3149" }}>Medidas exatas para carregar mídia</strong>
                  <div style={{ display: "grid", gap: 6 }}>
                    {developmentMediaGuidelines.map((item) => (
                      <p key={item.title} className="text-card" style={{ margin: 0, color: "#526174", fontSize: "var(--fs-12)" }}>
                        <strong>{item.title}:</strong> {item.details}
                      </p>
                    ))}
                  </div>
                  <p className="text-card" style={{ margin: 0, color: "#526174", fontSize: "var(--fs-12)" }}>
                    Formatos aceitos para upload: JPG, PNG ou WEBP. Limite: 10 MB por imagem. A marca d&apos;água é aplicada automaticamente no envio.
                  </p>
                </div>

                <div
                  style={{
                    border: "1px dashed #c7d2e1",
                    borderRadius: 12,
                    padding: 14,
                    display: "grid",
                    gap: 12,
                    background: "#fcfdff"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ display: "grid", gap: 4 }}>
                      <strong style={{ fontSize: "var(--fs-13)", color: "#1f3149" }}>Upload manual de imagem</strong>
                      <p style={{ margin: 0, color: "#64748b", fontSize: "var(--fs-12)" }}>
                        Envie o arquivo, confira a URL gerada e clique em adicionar mídia.
                      </p>
                    </div>
                    {!selectedId ? (
                      <span className="text-card" style={{ color: "var(--text-muted)", fontSize: "var(--fs-12)" }}>
                        Salve o empreendimento para liberar o upload.
                      </span>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <input
                      ref={uploadFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleMediaFileSelect}
                      style={{ maxWidth: 320 }}
                      disabled={mediaFileUploading || !selectedId}
                    />
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={handleDirectUpload}
                      disabled={mediaFileUploading || !mediaLocalPreview || !selectedId}
                    >
                      {mediaFileUploading ? "Enviando..." : "Enviar imagem"}
                    </button>
                    {(mediaLocalPreview || mediaUrl) && !mediaFileUploading ? (
                      <button type="button" className="button button-ghost" onClick={() => resetMediaForm()}>
                        Limpar
                      </button>
                    ) : null}
                  </div>

                  {(mediaLocalPreview || mediaUrl) ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        padding: 10,
                        borderRadius: 10,
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        minWidth: 0
                      }}
                    >
                      <div
                        style={{
                          width: 112,
                          height: 78,
                          borderRadius: 8,
                          overflow: "hidden",
                          background: "#f1f5f9",
                          flex: "0 0 auto",
                          display: "grid",
                          placeItems: "center"
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mediaUrl || mediaLocalPreview?.url}
                          alt="Pré-visualização da mídia"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ display: "grid", gap: 2, minWidth: 0, flex: 1 }}>
                        <strong style={{ fontSize: "var(--fs-13)", color: "#1f3149" }}>
                          {mediaUrl ? "Imagem enviada à CDN" : "Aguardando envio"}
                        </strong>
                        {mediaLocalPreview ? (
                          <span style={{ fontSize: "var(--fs-12)", color: "#64748b" }}>
                            {mediaLocalPreview.name} · {mediaLocalPreview.sizeKb} KB
                          </span>
                        ) : null}
                        {mediaUrl ? (
                          <span
                            style={{
                              fontSize: "var(--fs-11)",
                              color: "#64748b",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}
                            title={mediaUrl}
                          >
                            {mediaUrl}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <div className="form-grid">
                    <div>
                      <label>Tipo</label>
                      <select value={mediaKind} onChange={(event) => setMediaKind(event.target.value)}>
                        {mediaKindOptions.map((item) => (
                          <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Categoria</label>
                      <select value={mediaCategory} onChange={(event) => setMediaCategory(event.target.value)}>
                        {mediaCategoryOptions.map((item) => (
                          <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                      </select>
                    </div>
                    {renderMediaScopeFields()}
                    <div><label>Título</label><input value={mediaTitle} onChange={(event) => setMediaTitle(event.target.value)} /></div>
                    <div><label>Legenda</label><input value={mediaCaption} onChange={(event) => setMediaCaption(event.target.value)} /></div>
                    <div><label>Ordem</label><input type="number" min={0} value={mediaPosition} onChange={(event) => setMediaPosition(event.target.value)} /></div>
                    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input type="checkbox" checked={mediaIsPrimary} onChange={(event) => setMediaIsPrimary(event.target.checked)} style={{ width: 16, height: 16 }} />
                      <span className="text-card">Imagem principal</span>
                    </label>
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={createMedia}
                        disabled={mediaSubmitting || !mediaUrl || !selectedId}
                        title={!selectedId ? "Salve o empreendimento antes de adicionar imagens." : !mediaUrl ? "Envie a imagem ou informe uma URL externa primeiro." : undefined}
                      >
                        {mediaSubmitting ? "Adicionando..." : "Adicionar mídia"}
                      </button>
                      <button
                        type="button"
                        className="button button-ghost"
                        style={{ padding: "0.35rem 0.7rem", fontSize: "var(--fs-12)" }}
                        onClick={() => setMediaShowManualUrl((prev) => !prev)}
                      >
                        {mediaShowManualUrl ? "Ocultar URL externa" : "Usar URL externa"}
                      </button>
                    </div>
                  </div>

                  {mediaShowManualUrl ? (
                    <div style={{ display: "grid", gap: 4 }}>
                      <label style={{ fontSize: "var(--fs-12)", color: "#64748b" }}>URL pública da mídia</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={mediaUrl}
                        onChange={(event) => {
                          setMediaUrl(event.target.value);
                          setMediaError("");
                        }}
                      />
                    </div>
                  ) : null}

                  {mediaError ? (
                    <div role="alert" style={{ padding: 10, borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", fontSize: "var(--fs-12)" }}>
                      {mediaError}
                    </div>
                  ) : null}

                  {mediaInfo && !mediaError ? (
                    <div role="status" style={{ padding: 10, borderRadius: 8, background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", fontSize: "var(--fs-12)" }}>
                      {mediaInfo}
                    </div>
                  ) : null}
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <strong className="text-card">Mídias cadastradas</strong>
                  {selected?.media.length ? (
                    <div style={{ display: "grid", gap: 8 }}>
                      {selected.media
                        .slice()
                        .sort((a, b) => a.position - b.position)
                        .map((media) => (
                          <div
                            key={media.id}
                            style={{
                              border: "1px solid var(--border)",
                              borderRadius: 8,
                              padding: 8,
                              display: "grid",
                              gridTemplateColumns: "88px minmax(0, 1fr) auto",
                              gap: 10,
                              alignItems: "center"
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={media.url}
                              alt={media.title || "Mídia cadastrada"}
                              style={{ width: 88, height: 58, borderRadius: 6, objectFit: "cover", background: "#eef2f7" }}
                            />
                            <div style={{ minWidth: 0 }}>
                              <strong style={{ display: "block", fontSize: "var(--fs-13)", color: "#1f3149" }}>
                                {media.title || mediaCategoryOptions.find((item) => item.value === media.category)?.label || "Mídia sem título"}
                              </strong>
                              <span style={{ display: "block", color: "#64748b", fontSize: "var(--fs-12)" }}>
                                {mediaKindOptions.find((item) => item.value === media.kind)?.label ?? media.kind} · {media.category} · ordem {media.position}
                              </span>
                              <span style={{ display: "block", color: "#64748b", fontSize: "var(--fs-12)" }}>
                                {mediaScopeLabel(media)}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="button button-ghost"
                              onClick={() => deleteMedia(media.id)}
                              disabled={mediaSubmitting || saveStatus === "saving"}
                              style={{ padding: "0.4rem 0.7rem", color: "#b3261e", fontSize: "var(--fs-12)" }}
                              aria-label={`Excluir ${media.title || "mídia"}`}
                            >
                              Excluir
                            </button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                      Nenhuma mídia cadastrada ainda.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}

          {activeTab === "plants" ? (
            <>
              <div style={{ gridColumn: "1 / -1", display: "grid", gap: 12 }}>
                <div
                  style={{
                    border: "1px solid #dbe4f0",
                    borderRadius: 10,
                    background: "#f8fbff",
                    padding: 12,
                    display: "grid",
                    gap: 8
                  }}
                >
                  <strong style={{ color: "#1f3149" }}>Estrutura recomendada do cadastro</strong>
                  <p className="text-card" style={{ margin: 0, color: "#526174" }}>
                    Cadastre primeiro as torres/blocos, depois as plantas de cada torre e por fim as unidades
                    individuais quando precisar controlar estoque, preço ou status por apartamento/sala.
                  </p>
                </div>

                {selected?.towers.length ? (
                  <div style={{ display: "grid", gap: 10 }}>
                    <strong className="text-card">Mapa visual por torre/bloco</strong>
                    {selected.towers.map((tower) => {
                      const towerUnitTypes = selected.unitTypes.filter((unitType) => unitType.towerId === tower.id);
                      const towerUnits = selected.units.filter((unit) => unit.towerId === tower.id);
                      const towerUnitTypeIds = new Set(towerUnitTypes.map((unitType) => unitType.id));
                      const towerMedia = selected.media.filter(
                        (media) => media.towerId === tower.id || (media.unitTypeId ? towerUnitTypeIds.has(media.unitTypeId) : false)
                      );

                      return (
                        <section
                          key={tower.id}
                          style={{
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            padding: 12,
                            display: "grid",
                            gap: 10,
                            background: "#ffffff"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                            <div>
                              <strong style={{ display: "block", color: "#1f3149" }}>{tower.name}</strong>
                              <span style={{ color: "#64748b", fontSize: "var(--fs-12)" }}>
                                {tower.propertyType ? `${tower.propertyType} · ` : ""}
                                {tower.floorsCount ? `${tower.floorsCount} pavimentos · ` : ""}
                                {tower.availableUnits ?? "-"} / {tower.totalUnits ?? "-"} unidades
                              </span>
                            </div>
                            <a
                              className="button button-ghost"
                              href={selected ? `/lancamentos/${selected.slug}/torres/${tower.slug || tower.id}` : "#"}
                              target="_blank"
                              rel="noreferrer"
                              style={{ padding: "0.4rem 0.7rem", fontSize: "var(--fs-12)" }}
                            >
                              Ver página da torre
                            </a>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
                            <div className="property-summary-grid-item">Plantas: {towerUnitTypes.length}</div>
                            <div className="property-summary-grid-item">Unidades: {towerUnits.length}</div>
                            <div className="property-summary-grid-item">Mídias da torre: {towerMedia.length}</div>
                          </div>

                          {towerUnitTypes.length ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 8 }}>
                              {towerUnitTypes.map((unitType) => {
                                const unitTypeMedia = selected.media.find((media) => media.unitTypeId === unitType.id);
                                const previewUrl = unitType.imageUrl || unitTypeMedia?.url || "";
                                return (
                                  <div key={unitType.id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 8, display: "grid", gap: 6 }}>
                                    {previewUrl ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={previewUrl} alt={unitType.name} style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderRadius: 6, background: "#eef2f7" }} />
                                    ) : null}
                                    <strong style={{ color: "#1f3149", fontSize: "var(--fs-13)" }}>{unitType.name}</strong>
                                    <span style={{ color: "#64748b", fontSize: "var(--fs-12)" }}>
                                      {unitType.areaPrivateM2Number ? `${unitType.areaPrivateM2Number} m²` : "Área sob consulta"} · {unitType.bedrooms ?? "-"} quartos
                                    </span>
                                    <span style={{ color: "#64748b", fontSize: "var(--fs-12)" }}>
                                      {unitType.initialPriceNumber ? `A partir de R$ ${unitType.initialPriceNumber.toLocaleString("pt-BR")}` : "Preço sob consulta"}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                              Nenhuma planta vinculada a esta torre ainda.
                            </p>
                          )}
                        </section>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                    Nenhuma torre/bloco cadastrado. Comece pelo formulário Adicionar torre/bloco abaixo.
                  </p>
                )}

                {selected?.towers.length ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    <strong className="text-card">Torres e blocos cadastrados</strong>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <th style={thStyle}>Nome</th>
                            <th style={thStyle}>Tipo</th>
                            <th style={thStyle}>Pavimentos</th>
                            <th style={thStyle}>Unidades</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selected.towers.map((tower) => (
                            <tr key={tower.id}>
                              <td style={tdStyle}>{tower.name}</td>
                              <td style={tdStyle}>{tower.propertyType ?? "-"}</td>
                              <td style={tdStyle}>{tower.floorsCount ?? "-"}</td>
                              <td style={tdStyle}>
                                {tower.availableUnits ?? "-"} / {tower.totalUnits ?? "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}

                {selected?.unitTypes.length ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    <strong className="text-card">Tipologias cadastradas</strong>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <th style={thStyle}>Torre/bloco</th>
                            <th style={thStyle}>Nome</th>
                            <th style={thStyle}>Quartos</th>
                            <th style={thStyle}>Área privativa</th>
                            <th style={thStyle}>Preço inicial</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selected.unitTypes.map((unit) => (
                            <tr key={unit.id}>
                              <td style={tdStyle}>{unit.towerName ?? "-"}</td>
                              <td style={tdStyle}>{unit.name}</td>
                              <td style={tdStyle}>{unit.bedrooms ?? "-"}</td>
                              <td style={tdStyle}>{unit.areaPrivateM2Number ? `${unit.areaPrivateM2Number} m²` : "-"}</td>
                              <td style={tdStyle}>{unit.initialPriceNumber ? `R$ ${unit.initialPriceNumber.toLocaleString("pt-BR")}` : "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}

                {selected?.units.length ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    <strong className="text-card">Unidades individuais</strong>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <th style={thStyle}>Unidade</th>
                            <th style={thStyle}>Torre/bloco</th>
                            <th style={thStyle}>Tipologia</th>
                            <th style={thStyle}>Andar</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Preço</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selected.units.map((unit) => (
                            <tr key={unit.id}>
                              <td style={tdStyle}>{unit.label}</td>
                              <td style={tdStyle}>{unit.towerName ?? "-"}</td>
                              <td style={tdStyle}>{unit.unitTypeName ?? "-"}</td>
                              <td style={tdStyle}>{unit.floor ?? "-"}</td>
                              <td style={tdStyle}>{unitStatusOptions.find((item) => item.value === unit.status)?.label ?? unit.status}</td>
                              <td style={tdStyle}>{unit.priceNumber ? `R$ ${unit.priceNumber.toLocaleString("pt-BR")}` : "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}

                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <strong className="text-card">Plantas sugeridas</strong>
                  <button type="button" className="button button-ghost" onClick={addAiUnitType} style={{ padding: "0.44rem 0.7rem" }}>
                    Adicionar planta
                  </button>
                </div>

                {aiUnitTypes.length ? (
                  <div style={{ display: "grid", gap: 10 }}>
                    {aiUnitTypes.map((unit, index) => (
                      <div key={`${unit.name}-${index}`} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
                        <div className="form-grid">
                          <div><label>Nome da planta</label><input value={unit.name} onChange={(e) => updateAiUnitType(index, "name", e.target.value)} /></div>
                          <div>
                            <label>Categoria</label>
                            <select value={unit.unitCategory} onChange={(e) => updateAiUnitType(index, "unitCategory", e.target.value)}>
                              <option value="">Selecionar</option>
                              {unitCategoryOptions.map((item) => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                              ))}
                            </select>
                          </div>
                          <div><label>Quartos</label><input type="number" min={0} value={unit.bedrooms} onChange={(e) => updateAiUnitType(index, "bedrooms", e.target.value)} /></div>
                          <div><label>Suítes</label><input type="number" min={0} value={unit.suites} onChange={(e) => updateAiUnitType(index, "suites", e.target.value)} /></div>
                          <div><label>Banheiros</label><input type="number" min={0} value={unit.bathrooms} onChange={(e) => updateAiUnitType(index, "bathrooms", e.target.value)} /></div>
                          <div><label>Vagas</label><input type="number" min={0} value={unit.parkingSpaces} onChange={(e) => updateAiUnitType(index, "parkingSpaces", e.target.value)} /></div>
                          <div><label>Área privativa (m²)</label><input type="number" min={0} step="0.01" value={unit.areaPrivateM2} onChange={(e) => updateAiUnitType(index, "areaPrivateM2", e.target.value)} /></div>
                          <div><label>Área total (m²)</label><input type="number" min={0} step="0.01" value={unit.areaTotalM2} onChange={(e) => updateAiUnitType(index, "areaTotalM2", e.target.value)} /></div>
                          <div><label>Preço inicial</label><input type="number" min={0} value={unit.initialPrice} onChange={(e) => updateAiUnitType(index, "initialPrice", e.target.value)} /></div>
                          <div><label>Ordem</label><input type="number" min={0} value={unit.position} onChange={(e) => updateAiUnitType(index, "position", e.target.value)} /></div>
                          <div style={{ gridColumn: "1 / -1" }}><label>Descrição</label><textarea value={unit.description} onChange={(e) => updateAiUnitType(index, "description", e.target.value)} /></div>
                          <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={unit.isAvailable} onChange={(e) => updateAiUnitType(index, "isAvailable", e.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Disponível</span></label>
                          <div style={{ alignSelf: "end" }}>
                            <button type="button" className="button button-ghost" onClick={() => removeAiUnitType(index)}>
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                    Nenhuma planta sugerida no rascunho atual.
                  </p>
                )}
              </div>
            </>
          ) : null}

          {activeTab === "amenities" ? (
            <>
              <div style={{ gridColumn: "1 / -1", display: "grid", gap: 14 }}>
                <div
                  style={{
                    border: "1px solid #dbe4f0",
                    borderRadius: 10,
                    background: "#f8fbff",
                    padding: 12,
                    display: "grid",
                    gap: 6
                  }}
                >
                  <strong style={{ color: "#1f3149" }}>Cadastro com ícones e escopo</strong>
                  <p className="text-card" style={{ margin: 0, color: "#526174" }}>
                    Use Geral do empreendimento para itens do complexo inteiro. Se o lazer ou diferencial for exclusivo de uma torre, selecione a torre antes de adicionar.
                  </p>
                </div>

                <div className="form-grid" style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 12, background: "#ffffff" }}>
                  <div>
                    <label>Tipo do item</label>
                    <select value={amenityType} onChange={(event) => setAmenityType(event.target.value)}>
                      {amenityTypeOptions.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Escopo</label>
                    <select value={amenityTowerId} onChange={(event) => setAmenityTowerId(event.target.value)} disabled={!selected?.towers.length}>
                      <option value="">Geral do empreendimento</option>
                      {selected?.towers.map((tower) => (
                        <option key={tower.id} value={tower.id}>{tower.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Ícone</label>
                    <div style={{ display: "grid", gridTemplateColumns: "42px minmax(0, 1fr)", gap: 8, alignItems: "center" }}>
                      <span
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 8,
                          display: "grid",
                          placeItems: "center",
                          border: "1px solid #dbe4f0",
                          color: "#1f3149",
                          background: "#f8fafc"
                        }}
                      >
                        {createElement(amenityIconPreview, { size: 21 })}
                      </span>
                      <select value={amenityIcon} onChange={(event) => setAmenityIcon(event.target.value)}>
                        {developmentAmenityIconOptions.map((item) => (
                          <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label>Nome do item</label>
                    <input value={amenityLabel} onChange={(event) => setAmenityLabel(event.target.value)} placeholder="Piscina com borda infinita" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label>Descrição complementar</label>
                    <textarea
                      value={amenityDescription}
                      onChange={(event) => setAmenityDescription(event.target.value)}
                      placeholder="Ex.: frente lago, exclusivo por torre, mobiliário assinado..."
                    />
                  </div>
                  <div><label>Ordem</label><input type="number" min={0} value={amenityPosition} onChange={(event) => setAmenityPosition(event.target.value)} /></div>
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="checkbox" checked={amenityIsHighlighted} onChange={(event) => setAmenityIsHighlighted(event.target.checked)} style={{ width: 16, height: 16 }} />
                    <span className="text-card">Exibir na página pública</span>
                  </label>
                  <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={createAmenity}
                      disabled={amenitySubmitting || !selectedId}
                      title={!selectedId ? "Salve o empreendimento antes de adicionar itens." : undefined}
                    >
                      {amenitySubmitting ? "Adicionando..." : "Adicionar item"}
                    </button>
                    <button type="button" className="button button-ghost" onClick={resetAmenityForm} disabled={amenitySubmitting}>
                      Limpar
                    </button>
                  </div>
                  {amenityMessage ? (
                    <div
                      role="status"
                      style={{
                        gridColumn: "1 / -1",
                        padding: 10,
                        borderRadius: 8,
                        border: amenityMessage.includes("Falha") || amenityMessage.includes("Informe") ? "1px solid #fecaca" : "1px solid #a7f3d0",
                        background: amenityMessage.includes("Falha") || amenityMessage.includes("Informe") ? "#fef2f2" : "#ecfdf5",
                        color: amenityMessage.includes("Falha") || amenityMessage.includes("Informe") ? "#991b1b" : "#065f46",
                        fontSize: "var(--fs-12)"
                      }}
                    >
                      {amenityMessage}
                    </div>
                  ) : null}
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  <strong className="text-card">Itens cadastrados</strong>
                  {!selectedId ? (
                    <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                      Salve o empreendimento para cadastrar itens com ícones e vínculo por torre.
                    </p>
                  ) : (
                    <>
                      <section style={{ display: "grid", gap: 8 }}>
                        <strong style={{ color: "#1f3149", fontSize: "var(--fs-13)" }}>Geral do empreendimento</strong>
                        {renderAmenityCards(amenityGroups.general)}
                      </section>
                      {amenityGroups.byTower.map(({ tower, items: towerItems }) => (
                        <section key={tower.id} style={{ display: "grid", gap: 8 }}>
                          <strong style={{ color: "#1f3149", fontSize: "var(--fs-13)" }}>{tower.name}</strong>
                          {renderAmenityCards(towerItems)}
                        </section>
                      ))}
                    </>
                  )}
                </div>

                <details style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12, background: "#fcfdff" }}>
                  <summary style={{ cursor: "pointer", color: "#1f3149", fontWeight: 700 }}>Listas simples antigas</summary>
                  <div className="form-grid" style={{ marginTop: 12 }}>
                    <div><label>Lazer (1 por linha)</label><textarea value={form.amenitiesText} onChange={(e) => updateField("amenitiesText", e.target.value)} /></div>
                    <div><label>Diferenciais (1 por linha)</label><textarea value={form.differentialsText} onChange={(e) => updateField("differentialsText", e.target.value)} /></div>
                  </div>
                </details>
              </div>
            </>
          ) : null}

          {activeTab === "builder" ? (
            <>
              <div><label>Construtora vinculada</label><select value={form.builderId} onChange={(e) => updateField("builderId", e.target.value)}><option value="">Selecionar</option>{builders.map((builder)=><option key={builder.id} value={builder.id}>{builder.name}</option>)}</select></div>
              <div><label>Construtora (texto legado)</label><input value={form.builderName} onChange={(e) => updateField("builderName", e.target.value)} /></div>
              <div><label>Incorporadora</label><input value={form.developerName} onChange={(e) => updateField("developerName", e.target.value)} /></div>
            </>
          ) : null}

          {activeTab === "seo" ? (
            <>
              <div style={{ gridColumn: "1 / -1" }}><label>Meta title</label><input value={form.seoTitle} onChange={(e) => updateField("seoTitle", e.target.value)} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label>Meta description</label><textarea value={form.seoDescription} onChange={(e) => updateField("seoDescription", e.target.value)} /></div>
              <div><label>Palavra-chave</label><input value={form.seoKeyword} onChange={(e) => updateField("seoKeyword", e.target.value)} /></div>
              <div><label>Imagem OG</label><input value={form.seoOgImageUrl} onChange={(e) => updateField("seoOgImageUrl", e.target.value)} /></div>
              <label style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={form.seoNoIndex} onChange={(e) => updateField("seoNoIndex", e.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Não indexar no Google</span></label>
            </>
          ) : null}

          {activeTab === "publish" ? (
            <>
              <div><label>Status editorial</label><select value={form.status} onChange={(e) => updateField("status", e.target.value)}>{publicationOptions.map((item)=><option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
              <div><label>Ordem de exibição</label><input value={form.displayOrder} onChange={(e) => updateField("displayOrder", e.target.value)} /></div>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={form.isFeatured} onChange={(e) => updateField("isFeatured", e.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Destaque na home</span></label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={form.isPublished} onChange={(e) => updateField("isPublished", e.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Publicado</span></label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={form.showPrice} onChange={(e) => updateField("showPrice", e.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Mostrar preço</span></label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={form.showMap} onChange={(e) => updateField("showMap", e.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Mostrar mapa</span></label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={form.showBuilder} onChange={(e) => updateField("showBuilder", e.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Mostrar construtora</span></label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={form.showFloorplanTable} onChange={(e) => updateField("showFloorplanTable", e.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Mostrar tabela de plantas</span></label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={form.showWhatsappButton} onChange={(e) => updateField("showWhatsappButton", e.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Mostrar botão WhatsApp</span></label>
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" className="button button-ghost" onClick={() => updatePublicationStatus(form.status)} disabled={!selectedId}>Aplicar status</button>
                {selectedId ? <button type="button" className="button button-ghost" onClick={duplicateSelected}>Duplicar</button> : null}
                {selectedId ? <button type="button" className="button button-ghost" onClick={archiveSelected}>Arquivar</button> : null}
              </div>
            </>
          ) : null}

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="submit" className="button button-primary" disabled={saveStatus === "saving"}>
              {saveStatus === "saving" ? "Salvando..." : mode === "create" ? "Criar empreendimento" : "Salvar alterações"}
            </button>
            {mode === "edit" && selected ? (
              <a className="button button-ghost" href={`/lancamentos/${selected.slug}`} target="_blank" rel="noreferrer">
                Ver página pública
              </a>
            ) : null}
          </div>
        </form>

        {saveMessage ? (
          <p style={{ marginBottom: 0, color: saveStatus === "error" ? "#c92a2a" : saveStatus === "success" ? "#0a7a56" : "#64748b" }}>
            {saveMessage}
          </p>
        ) : null}
      </article>

      {mode === "edit" && selected ? (
        <article className="card" style={{ padding: 16, display: "grid", gap: 14 }}>
          <h3 className="title-luxury" style={{ margin: 0 }}>Cadastro complementar</h3>

          <div style={{ display: "grid", gap: 12 }}>
            {activeTab !== "media" ? (
            <div className="card" style={{ padding: 12 }}>
              <h4 style={{ marginTop: 0 }}>Adicionar mídia</h4>
              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    border: "1px solid #dbe4f0",
                    borderRadius: 10,
                    background: "#f8fbff",
                    padding: 10,
                    display: "grid",
                    gap: 6
                  }}
                >
                  <strong style={{ fontSize: "var(--fs-14)", color: "#1f3149" }}>Medidas exatas das mídias</strong>
                  <p style={{ margin: 0, color: "#526174", fontSize: "var(--fs-12)" }}>
                    Hero / slider: <strong>2400 x 1350 px</strong>, proporção 16:9, mínimo 1920 x 1080 px.
                  </p>
                  <p style={{ margin: 0, color: "#526174", fontSize: "var(--fs-12)" }}>
                    Galeria: <strong>1600 x 1200 px</strong>. Plantas: <strong>2000 x 1600 px</strong> ou <strong>1600 x 2000 px</strong>. Localização: <strong>1600 x 900 px</strong>. Máx. 10 MB.
                  </p>
                </div>

                <div
                  style={{
                    border: "1px dashed #c7d2e1",
                    borderRadius: 12,
                    padding: 14,
                    display: "grid",
                    gap: 12,
                    background: "#fcfdff"
                  }}
                >
                  <div style={{ display: "grid", gap: 6 }}>
                    <strong style={{ fontSize: "var(--fs-13)", color: "#1f3149" }}>1. Envie o arquivo</strong>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "var(--fs-12)" }}>
                      A URL pública é preenchida automaticamente após o envio.
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <input
                      ref={uploadFileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleMediaFileSelect}
                      style={{ maxWidth: 320 }}
                      disabled={mediaFileUploading}
                    />
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={handleDirectUpload}
                      disabled={mediaFileUploading || !mediaLocalPreview}
                    >
                      {mediaFileUploading ? "Enviando..." : "Enviar imagem"}
                    </button>
                    {(mediaLocalPreview || mediaUrl) && !mediaFileUploading ? (
                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={() => resetMediaForm()}
                      >
                        Limpar
                      </button>
                    ) : null}
                  </div>

                  {(mediaLocalPreview || mediaUrl) ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        padding: 10,
                        borderRadius: 10,
                        background: "#ffffff",
                        border: "1px solid #e2e8f0"
                      }}
                    >
                      <div
                        style={{
                          width: 96,
                          height: 72,
                          borderRadius: 8,
                          overflow: "hidden",
                          background: "#f1f5f9",
                          flex: "0 0 auto",
                          display: "grid",
                          placeItems: "center"
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mediaUrl || mediaLocalPreview?.url}
                          alt="Pré-visualização da mídia"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ display: "grid", gap: 2, minWidth: 0, flex: 1 }}>
                        <strong style={{ fontSize: "var(--fs-13)", color: "#1f3149" }}>
                          {mediaUrl ? "Imagem enviada à CDN" : "Aguardando envio"}
                        </strong>
                        {mediaLocalPreview ? (
                          <span style={{ fontSize: "var(--fs-12)", color: "#64748b" }}>
                            {mediaLocalPreview.name} · {mediaLocalPreview.sizeKb} KB
                          </span>
                        ) : null}
                        {mediaUrl ? (
                          <span
                            style={{
                              fontSize: "var(--fs-11)",
                              color: "#64748b",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}
                            title={mediaUrl}
                          >
                            {mediaUrl}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {mediaError ? (
                    <div
                      role="alert"
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#991b1b",
                        fontSize: "var(--fs-12)"
                      }}
                    >
                      {mediaError}
                    </div>
                  ) : null}

                  {mediaInfo && !mediaError ? (
                    <div
                      role="status"
                      style={{
                        padding: 10,
                        borderRadius: 8,
                        background: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        color: "#065f46",
                        fontSize: "var(--fs-12)"
                      }}
                    >
                      {mediaInfo}
                    </div>
                  ) : null}

                  <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: 10 }}>
                    <button
                      type="button"
                      className="button button-ghost"
                      style={{ padding: "0.35rem 0.7rem", fontSize: "var(--fs-12)" }}
                      onClick={() => setMediaShowManualUrl((prev) => !prev)}
                    >
                      {mediaShowManualUrl ? "Ocultar URL externa" : "Usar URL externa (vídeo/PDF)"}
                    </button>
                    {mediaShowManualUrl ? (
                      <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
                        <label style={{ fontSize: "var(--fs-12)", color: "#64748b" }}>URL pública da mídia</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={mediaUrl}
                          onChange={(event) => {
                            setMediaUrl(event.target.value);
                            setMediaError("");
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="form-grid">
                  <div style={{ gridColumn: "1 / -1" }}>
                    <strong style={{ fontSize: "var(--fs-13)", color: "#1f3149" }}>2. Detalhes da mídia</strong>
                  </div>
                  <div><label>Tipo</label><select value={mediaKind} onChange={(event) => setMediaKind(event.target.value)}>{mediaKindOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
                  <div><label>Categoria</label><select value={mediaCategory} onChange={(event) => setMediaCategory(event.target.value)}>{mediaCategoryOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
                  {renderMediaScopeFields()}
                  <div><label>Título</label><input value={mediaTitle} onChange={(event) => setMediaTitle(event.target.value)} /></div>
                  <div><label>Legenda</label><input value={mediaCaption} onChange={(event) => setMediaCaption(event.target.value)} /></div>
                  <div><label>Ordem</label><input type="number" min={0} value={mediaPosition} onChange={(event) => setMediaPosition(event.target.value)} /></div>
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={mediaIsPrimary} onChange={(event) => setMediaIsPrimary(event.target.checked)} style={{ width: 16, height: 16 }} /><span className="text-card">Imagem principal</span></label>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={createMedia}
                      disabled={mediaSubmitting || !mediaUrl}
                      title={!mediaUrl ? "Envie a imagem ou informe uma URL externa primeiro." : undefined}
                    >
                      {mediaSubmitting ? "Adicionando..." : "Adicionar mídia"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ) : null}

            <div className="card" style={{ padding: 12 }}>
              <h4 style={{ marginTop: 0 }}>Adicionar torre/bloco</h4>
              <form className="form-grid" onSubmit={createTower}>
                <div><label>Nome da torre/bloco</label><input name="name" placeholder="Torre A, Bloco Loft, Comercial" required /></div>
                <div><label>Slug interno</label><input name="slug" placeholder="torre-a" /></div>
                <div>
                  <label>Tipo predominante</label>
                  <select name="propertyType" defaultValue="">
                    <option value="">Selecionar</option>
                    {developmentPropertyTypeOptions.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <div><label>Previsão de entrega</label><input name="deliveryDate" type="month" /></div>
                <div><label>Pavimentos</label><input name="floorsCount" type="number" min={0} /></div>
                <div><label>Elevadores</label><input name="elevatorsCount" type="number" min={0} /></div>
                <div><label>Unidades totais</label><input name="totalUnits" type="number" min={0} /></div>
                <div><label>Unidades disponíveis</label><input name="availableUnits" type="number" min={0} /></div>
                <div><label>Registro de incorporação</label><input name="incorporationRegistry" /></div>
                <div><label>Ordem</label><input name="position" type="number" min={0} defaultValue={selected?.towers.length ?? 0} /></div>
                <div style={{ gridColumn: "1 / -1" }}><label>Descrição</label><textarea name="description" /></div>
                <div style={{ gridColumn: "1 / -1" }}><button type="submit" className="button button-primary">Adicionar torre/bloco</button></div>
              </form>
            </div>

            <div className="card" style={{ padding: 12 }}>
              <h4 style={{ marginTop: 0 }}>Adicionar planta/tipologia</h4>
              <form className="form-grid" onSubmit={createUnitType}>
                <div>
                  <label>Torre/bloco</label>
                  <select name="towerId" defaultValue="">
                    <option value="">Geral do empreendimento</option>
                    {selected.towers.map((tower) => (
                      <option key={tower.id} value={tower.id}>{tower.name}</option>
                    ))}
                  </select>
                </div>
                <div><label>Nome da planta</label><input name="name" required /></div>
                <div><label>Categoria</label><select name="unitCategory" defaultValue="DOIS_QUARTOS"><option value="STUDIO">Studio</option><option value="UM_QUARTO">1 quarto</option><option value="DOIS_QUARTOS">2 quartos</option><option value="TRES_QUARTOS">3 quartos</option><option value="QUATRO_QUARTOS">4 quartos</option><option value="GARDEN">Garden</option><option value="COBERTURA">Cobertura</option><option value="DUPLEX">Duplex</option><option value="SALA_COMERCIAL">Sala comercial</option></select></div>
                <div><label>Quartos</label><input name="bedrooms" type="number" min={0} /></div>
                <div><label>Suítes</label><input name="suites" type="number" min={0} /></div>
                <div><label>Banheiros</label><input name="bathrooms" type="number" min={0} /></div>
                <div><label>Vagas</label><input name="parkingSpaces" type="number" min={0} /></div>
                <div><label>Área privativa (m²)</label><input name="areaPrivateM2" type="number" min={0} step="0.01" /></div>
                <div><label>Área total (m²)</label><input name="areaTotalM2" type="number" min={0} step="0.01" /></div>
                <div><label>Preço inicial</label><input name="initialPrice" type="number" min={0} /></div>
                <div><label>Imagem da planta (URL)</label><input name="imageUrl" /></div>
                <div style={{ gridColumn: "1 / -1" }}><label>Descrição</label><textarea name="description" /></div>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="isAvailable" defaultChecked style={{ width: 16, height: 16 }} /><span className="text-card">Disponível</span></label>
                <div><label>Ordem</label><input name="position" type="number" min={0} defaultValue={0} /></div>
                <div style={{ gridColumn: "1 / -1" }}><button type="submit" className="button button-primary">Adicionar tipologia</button></div>
              </form>
            </div>

            <div className="card" style={{ padding: 12 }}>
              <h4 style={{ marginTop: 0 }}>Adicionar unidade individual</h4>
              <form className="form-grid" onSubmit={createUnit}>
                <div>
                  <label>Torre/bloco</label>
                  <select name="towerId" defaultValue="">
                    <option value="">Sem torre</option>
                    {selected.towers.map((tower) => (
                      <option key={tower.id} value={tower.id}>{tower.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Tipologia/planta</label>
                  <select name="unitTypeId" defaultValue="">
                    <option value="">Sem tipologia</option>
                    {selected.unitTypes.map((unitType) => (
                      <option key={unitType.id} value={unitType.id}>
                        {unitType.towerName ? `${unitType.towerName} • ` : ""}{unitType.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div><label>Nome da unidade</label><input name="label" placeholder="Apto 1204, Loft 308, Sala 514" required /></div>
                <div><label>Número</label><input name="unitNumber" /></div>
                <div><label>Andar</label><input name="floor" type="number" /></div>
                <div>
                  <label>Status</label>
                  <select name="status" defaultValue="DISPONIVEL">
                    {unitStatusOptions.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <div><label>Preço</label><input name="price" type="number" min={0} /></div>
                <div><label>Área privativa (m²)</label><input name="areaPrivateM2" type="number" min={0} step="0.01" /></div>
                <div><label>Área total (m²)</label><input name="areaTotalM2" type="number" min={0} step="0.01" /></div>
                <div><label>Vagas</label><input name="parkingSpaces" type="number" min={0} /></div>
                <div><label>Orientação/posição</label><input name="orientation" placeholder="Nascente, vista parque..." /></div>
                <div><label>Ordem</label><input name="position" type="number" min={0} defaultValue={selected?.units.length ?? 0} /></div>
                <div style={{ gridColumn: "1 / -1" }}><label>Observações internas</label><textarea name="notes" /></div>
                <div style={{ gridColumn: "1 / -1" }}><button type="submit" className="button button-primary">Adicionar unidade</button></div>
              </form>
            </div>

            <div className="card" style={{ padding: 12 }}>
              <h4 style={{ marginTop: 0 }}>Adicionar marco de obra</h4>
              <form className="form-grid" onSubmit={createMilestone}>
                <div><label>Título</label><input name="title" required /></div>
                <div><label>Status</label><select name="status" defaultValue="NOT_STARTED"><option value="NOT_STARTED">Não iniciado</option><option value="IN_PROGRESS">Em andamento</option><option value="COMPLETED">Concluído</option></select></div>
                <div><label>Progresso (%)</label><input name="progressPct" type="number" min={0} max={100} /></div>
                <div><label>Data prevista</label><input name="targetDate" type="datetime-local" /></div>
                <div><label>Ordem</label><input name="position" type="number" min={0} defaultValue={0} /></div>
                <div style={{ gridColumn: "1 / -1" }}><label>Descrição</label><textarea name="description" /></div>
                <div style={{ gridColumn: "1 / -1" }}><button type="submit" className="button button-primary">Adicionar marco</button></div>
              </form>
            </div>

            <div className="card" style={{ padding: 12 }}>
              <h4 style={{ marginTop: 0 }}>Adicionar FAQ</h4>
              <form className="form-grid" onSubmit={createFaq}>
                <div style={{ gridColumn: "1 / -1" }}><label>Pergunta</label><input name="question" required /></div>
                <div style={{ gridColumn: "1 / -1" }}><label>Resposta</label><textarea name="answer" required /></div>
                <div><label>Ordem</label><input name="position" type="number" min={0} defaultValue={0} /></div>
                <div style={{ alignSelf: "end" }}><button type="submit" className="button button-primary">Adicionar FAQ</button></div>
              </form>
            </div>
          </div>
        </article>
      ) : null}
    </div>
  );
}

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid rgba(15,34,61,.12)",
  color: "#64748b",
  fontSize: "var(--fs-12)"
};

const tdStyle: CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(15,34,61,.09)",
  fontSize: "var(--fs-14)"
};
