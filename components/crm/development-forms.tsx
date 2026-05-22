"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { slugify } from "@/lib/crm/slug";
import { appreciationPotentialOptions, developmentStageOptions } from "@/lib/development-investment";

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
  media: Array<{ id: string; url: string; title: string | null; kind: string; category: string; position: number }>;
  towers: Array<{
    id: string;
    name: string;
    slug: string | null;
    propertyType: string | null;
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

const developmentPropertyTypeOptions = [
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

const tabs = [
  { id: "basic", label: "Informações básicas" },
  { id: "location", label: "Localização" },
  { id: "features", label: "Características" },
  { id: "investment", label: "Investimento" },
  { id: "descriptions", label: "Descrições" },
  { id: "media", label: "Imagens" },
  { id: "plants", label: "Plantas e preços" },
  { id: "amenities", label: "Lazer e diferenciais" },
  { id: "builder", label: "Construtora" },
  { id: "seo", label: "SEO" },
  { id: "publish", label: "Publicação" }
] as const;

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

function parseNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseNullableNumber(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
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
  if (!value.trim()) return null;
  return new Date(`${value}-01T12:00:00.000Z`).toISOString();
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

function numberToInput(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "";
  return String(value);
}

function apiNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
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

async function fetchJson(url: string, method: "POST" | "PATCH", payload?: unknown) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: payload ? JSON.stringify(payload) : undefined
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data?.error?.message ?? "Falha na operação.");
  }

  return data;
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
        mutable[fieldKey] = typeof currentValue === "boolean" ? Boolean(value) : String(value);
      }

      if (!next.slug && next.title) {
        next.slug = slugify(next.title);
      }

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
      const body = new FormData();
      body.append("file", blob, `${candidate.cropApplied ? "recorte" : candidate.imageUrl ? "site" : "pagina"}-${candidate.page ?? index + 1}.png`);

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
    return {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      tagline: optionalString(form.tagline),
      description: form.description,
      propertyType: form.propertyType,
      stage: form.stage,
      status: form.status,
      city: form.city,
      district: form.district,
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
    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const payload = buildPayload();
      let targetDevelopmentId = selectedId;

      if (mode === "create") {
        const data = await fetchJson("/api/crm/developments", "POST", payload);
        const created = data.data.development as DevelopmentItem;
        setItems((prev) => [{ ...created, media: [], towers: [], unitTypes: [], units: [], milestones: [], faqs: [] }, ...prev]);
        setSelectedId(created.id);
        setMode("edit");
        targetDevelopmentId = created.id;
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

  async function createMedia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) return;

    const fd = new FormData(event.currentTarget);

    try {
      await fetchJson(`/api/crm/developments/${selectedId}/media`, "POST", {
        kind: fd.get("kind"),
        category: fd.get("category"),
        url: fd.get("url"),
        title: optionalString(String(fd.get("title") ?? "")),
        caption: optionalString(String(fd.get("caption") ?? "")),
        isPrimary: fd.get("isPrimary") === "on",
        position: parseNumber(String(fd.get("position") ?? ""))
      });

      setSaveStatus("success");
      setSaveMessage("Mídia adicionada.");
      event.currentTarget.reset();
      setMediaUrl("");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Falha ao adicionar mídia.");
    }
  }

  async function handleDirectUpload() {
    if (!uploadFileRef.current?.files?.[0]) {
      setSaveStatus("error");
      setSaveMessage("Selecione um arquivo de imagem para upload.");
      return;
    }

    const file = uploadFileRef.current.files[0];
    setMediaFileUploading(true);
    setSaveStatus("saving");

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

      const directUploadData = await directUploadResponse.json();
      if (!directUploadResponse.ok || !directUploadData.success) {
        throw new Error(directUploadData?.error?.message ?? "Falha ao gerar upload direto.");
      }

      const uploadUrl = directUploadData.data.directUpload.uploadURL as string;
      const imageDeliveryUrl = directUploadData.data.imageDeliveryUrl as string | null | undefined;

      const body = new FormData();
      body.append("file", file);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body
      });

      const uploadPayload = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadPayload.success) {
        throw new Error(uploadPayload?.errors?.[0]?.message ?? "Falha no upload da imagem.");
      }

      const variants = uploadPayload?.result?.variants as string[] | undefined;
      const uploadResultUrl = variants?.[0];

      if (imageDeliveryUrl) {
        setMediaUrl(imageDeliveryUrl);
      } else if (uploadResultUrl) {
        setMediaUrl(uploadResultUrl);
      }

      setSaveStatus("success");
      setSaveMessage("Upload concluído. URL preenchida no campo de mídia.");
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(error instanceof Error ? error.message : "Erro no upload.");
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
              <div><label>Tipo</label><select value={form.propertyType} onChange={(e) => updateField("propertyType", e.target.value)}><option value="APARTAMENTO">Apartamento</option><option value="CASA">Casa</option><option value="LOTE">Lote</option><option value="SALA_COMERCIAL">Sala comercial</option><option value="STUDIO">Studio</option><option value="COBERTURA">Cobertura</option></select></div>
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
              </div>
            </>
          ) : null}

          {activeTab === "plants" ? (
            <>
              <div style={{ gridColumn: "1 / -1", display: "grid", gap: 12 }}>
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
              <div><label>Lazer (1 por linha)</label><textarea value={form.amenitiesText} onChange={(e) => updateField("amenitiesText", e.target.value)} /></div>
              <div><label>Diferenciais (1 por linha)</label><textarea value={form.differentialsText} onChange={(e) => updateField("differentialsText", e.target.value)} /></div>
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
            <div className="card" style={{ padding: 12 }}>
              <h4 style={{ marginTop: 0 }}>Adicionar mídia</h4>
              <div style={{ display: "grid", gap: 10 }}>
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
                  <strong style={{ fontSize: "var(--fs-14)", color: "#1f3149" }}>Guia rápido do Hero Slider</strong>
                  <p style={{ margin: 0, color: "#526174", fontSize: "var(--fs-12)" }}>
                    Para o topo da página de lançamento virar slider, cadastre mais de 1 imagem com <strong>Tipo = Hero</strong>.
                    Use <strong>Ordem</strong> para controlar a sequência dos slides (0, 1, 2...).
                  </p>
                  <p style={{ margin: 0, color: "#526174", fontSize: "var(--fs-12)" }}>
                    Dimensão recomendada: <strong>2400x1350</strong> (mínimo 1920x1080), formato horizontal, foco principal no
                    centro da imagem para funcionar bem no desktop e no mobile.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input ref={uploadFileRef} type="file" accept="image/*" style={{ maxWidth: 320 }} />
                  <button type="button" className="button button-ghost" onClick={handleDirectUpload} disabled={mediaFileUploading}>
                    {mediaFileUploading ? "Enviando..." : "Enviar imagem"}
                  </button>
                </div>
                <form className="form-grid" onSubmit={createMedia}>
                  <div><label>Tipo</label><select name="kind" defaultValue="GALLERY"><option value="HERO">Hero</option><option value="GALLERY">Galeria</option><option value="FLOORPLAN">Planta</option><option value="VIDEO">Vídeo</option><option value="PDF">PDF</option></select></div>
                  <div><label>Categoria</label><select name="category" defaultValue="FACHADA"><option value="HERO">Hero</option><option value="FACHADA">Fachada</option><option value="LAZER">Lazer</option><option value="DECORADO">Decorado</option><option value="PLANTA">Planta</option><option value="LOCALIZACAO">Localização</option><option value="OBRA">Obra</option><option value="OUTROS">Outros</option></select></div>
                  <div style={{ gridColumn: "1 / -1" }}><label>URL da mídia</label><input name="url" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} required /></div>
                  <div><label>Título</label><input name="title" /></div>
                  <div><label>Legenda</label><input name="caption" /></div>
                  <div><label>Ordem</label><input name="position" type="number" min={0} defaultValue={0} /></div>
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" name="isPrimary" style={{ width: 16, height: 16 }} /><span className="text-card">Imagem principal</span></label>
                  <div style={{ gridColumn: "1 / -1" }}><button type="submit" className="button button-primary">Adicionar mídia</button></div>
                </form>
              </div>
            </div>

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
