"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building,
  Home,
  Leaf,
  List,
  Mountain,
  Warehouse,
  type LucideIcon
} from "lucide-react";
import { applyWatermarkToImage } from "@/lib/media/watermark";
import {
  COUNTER_FIELDS,
  DIMENSION_FIELDS,
  getPropertyCategory,
  type CounterFieldId,
  type DimensionFieldId
} from "@/lib/property-categories";

const TYPE_OPTIONS: ReadonlyArray<{
  value: string;
  label: string;
  Icon: LucideIcon;
  hint: string;
}> = [
  { value: "CASA", label: "Casa", Icon: Home, hint: "Residencial unifamiliar" },
  { value: "APARTAMENTO", label: "Apartamento", Icon: Building, hint: "Edifício / condomínio" },
  { value: "LOTE", label: "Lote", Icon: Mountain, hint: "Terreno urbano" },
  { value: "COMERCIAL", label: "Comercial", Icon: Briefcase, hint: "Salas, lojas, galpões" },
  { value: "RURAL", label: "Rural", Icon: Leaf, hint: "Chácara, sítio, fazenda" },
  { value: "PREDIO", label: "Prédio", Icon: Warehouse, hint: "Edifício inteiro" }
];

const PURPOSE_OPTIONS = [
  { value: "VENDA", label: "Venda" },
  { value: "LOCACAO", label: "Locação" },
  { value: "INVESTIMENTO", label: "Investimento" },
  { value: "LEILAO", label: "Leilão" },
  { value: "LANCAMENTO", label: "Lançamento" }
] as const;

const STATUS_OPTIONS = [
  { value: "DISPONIVEL", label: "Disponível" },
  { value: "RESERVADO", label: "Reservado" },
  { value: "VENDIDO", label: "Vendido" },
  { value: "ALUGADO", label: "Alugado" },
  { value: "EM_ANALISE", label: "Em análise" }
] as const;

const STEPS = [
  { id: "tipo", label: "Tipo", short: "Tipo" },
  { id: "local", label: "Localização", short: "Local" },
  { id: "features", label: "Características", short: "Imóvel" },
  { id: "fotos", label: "Fotos", short: "Fotos" },
  { id: "detalhes", label: "Detalhes & Preço", short: "Detalhes" },
  { id: "portais", label: "Portais", short: "Portais" }
] as const;

type StepId = (typeof STEPS)[number]["id"];

type PortalPublicationStatusValue = "PENDENTE" | "PUBLICADO" | "ERRO" | "PAUSADO" | "REMOVIDO";

const PORTAL_STATUS_OPTIONS: ReadonlyArray<{ value: PortalPublicationStatusValue; label: string }> = [
  { value: "PENDENTE", label: "Aguardando envio" },
  { value: "PUBLICADO", label: "Publicado" },
  { value: "PAUSADO", label: "Pausado" },
  { value: "ERRO", label: "Com erro" }
];

const DEFAULT_PORTAL_PUBLICATIONS: WizardPortalPublication[] = [
  {
    portalName: "olx",
    portalLabel: "OLX",
    type: "XML OLX",
    description: "Feed XML dedicado para anúncios selecionados na OLX.",
    feedUrl: "/api/feeds/olx",
    enabled: false,
    status: "PENDENTE",
    externalId: null,
    customTitle: null,
    customDescription: null,
    customPrice: null,
    showFullAddress: false,
    showPrice: true,
    highlightEnabled: false,
    highlightType: null,
    publishedAt: null,
    lastSyncAt: null,
    removedAt: null,
    errorMessage: null
  },
  {
    portalName: "zap",
    portalLabel: "ZAP Imóveis",
    type: "XML VRSync",
    description: "Feed VRSync compartilhado com o padrão VivaReal/ZAP.",
    feedUrl: "/api/feeds/zap",
    enabled: false,
    status: "PENDENTE",
    externalId: null,
    customTitle: null,
    customDescription: null,
    customPrice: null,
    showFullAddress: false,
    showPrice: true,
    highlightEnabled: false,
    highlightType: null,
    publishedAt: null,
    lastSyncAt: null,
    removedAt: null,
    errorMessage: null
  },
  {
    portalName: "vivareal",
    portalLabel: "Viva Real",
    type: "XML VRSync",
    description: "Feed VRSync para publicação no Viva Real.",
    feedUrl: "/api/feeds/vivareal",
    enabled: false,
    status: "PENDENTE",
    externalId: null,
    customTitle: null,
    customDescription: null,
    customPrice: null,
    showFullAddress: false,
    showPrice: true,
    highlightEnabled: false,
    highlightType: null,
    publishedAt: null,
    lastSyncAt: null,
    removedAt: null,
    errorMessage: null
  }
];

export type WizardMedia = {
  id: string;
  url: string;
  position: number;
};

export type WizardPortalPublication = {
  portalName: "olx" | "zap" | "vivareal";
  portalLabel: string;
  type: string;
  description: string;
  feedUrl: string;
  enabled: boolean;
  status: PortalPublicationStatusValue;
  externalId: string | null;
  customTitle: string | null;
  customDescription: string | null;
  customPrice: number | null;
  showFullAddress: boolean;
  showPrice: boolean;
  highlightEnabled: boolean;
  highlightType: string | null;
  publishedAt: string | null;
  lastSyncAt: string | null;
  removedAt: string | null;
  errorMessage: string | null;
};

export type WizardProperty = {
  id?: string;
  title: string;
  slug: string;
  type: string;
  purpose: string;
  status: string;
  price: number;
  city: string;
  district: string;
  address: string | null;
  postalCode: string | null;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  areaM2: number | null;
  landAreaM2: number | null;
  frontMeters: number | null;
  backMeters: number | null;
  sideLeftMeters: number | null;
  sideRightMeters: number | null;
  ceilingHeightM: number | null;
  bedrooms: number | null;
  livingRooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  floorNumber: number | null;
  floorCount: number | null;
  unitCount: number | null;
  description: string;
  features: string[];
  legalNotes: string | null;
  internalNotes: string | null;
  commissionPct: number | null;
  marketAskingValue: number | null;
  marketEstimatedValue: number | null;
  marketOpportunity: number | null;
  marketComparableLinks: string[];
  marketLiquidityNotes: string | null;
  isInvestorHighlight: boolean;
  isAuctionOpportunity: boolean;
  ownerName: string | null;
  ownerPhone: string | null;
  media: WizardMedia[];
  portalPublications?: WizardPortalPublication[];
};

type FormState = Omit<WizardProperty, "id" | "media" | "portalPublications">;

type Props = {
  mode: "create" | "edit";
  initial?: WizardProperty;
};

function normalizeFeatureKey(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeInitialState(initial?: WizardProperty): FormState {
  return {
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    type: initial?.type ?? "CASA",
    purpose: initial?.purpose ?? "VENDA",
    status: initial?.status ?? "DISPONIVEL",
    price: initial?.price ?? 0,
    city: initial?.city ?? "Palmas",
    district: initial?.district ?? "",
    address: initial?.address ?? null,
    postalCode: initial?.postalCode ?? null,
    googleMapsUrl: initial?.googleMapsUrl ?? null,
    latitude: initial?.latitude ?? null,
    longitude: initial?.longitude ?? null,
    areaM2: initial?.areaM2 ?? null,
    landAreaM2: initial?.landAreaM2 ?? null,
    frontMeters: initial?.frontMeters ?? null,
    backMeters: initial?.backMeters ?? null,
    sideLeftMeters: initial?.sideLeftMeters ?? null,
    sideRightMeters: initial?.sideRightMeters ?? null,
    ceilingHeightM: initial?.ceilingHeightM ?? null,
    bedrooms: initial?.bedrooms ?? null,
    livingRooms: initial?.livingRooms ?? null,
    suites: initial?.suites ?? null,
    bathrooms: initial?.bathrooms ?? null,
    parkingSpaces: initial?.parkingSpaces ?? null,
    floorNumber: initial?.floorNumber ?? null,
    floorCount: initial?.floorCount ?? null,
    unitCount: initial?.unitCount ?? null,
    description: initial?.description ?? "",
    features: initial?.features ?? [],
    legalNotes: initial?.legalNotes ?? null,
    internalNotes: initial?.internalNotes ?? null,
    commissionPct: initial?.commissionPct ?? null,
    marketAskingValue: initial?.marketAskingValue ?? null,
    marketEstimatedValue: initial?.marketEstimatedValue ?? null,
    marketOpportunity: initial?.marketOpportunity ?? null,
    marketComparableLinks: initial?.marketComparableLinks ?? [],
    marketLiquidityNotes: initial?.marketLiquidityNotes ?? null,
    isInvestorHighlight: initial?.isInvestorHighlight ?? false,
    isAuctionOpportunity: initial?.isAuctionOpportunity ?? false,
    ownerName: initial?.ownerName ?? null,
    ownerPhone: initial?.ownerPhone ?? null
  };
}

function describeValidationErrors(details: unknown): string | null {
  if (!details || typeof details !== "object") return null;
  const flat = details as { fieldErrors?: Record<string, string[]>; formErrors?: string[] };
  const parts: string[] = [];
  if (flat.fieldErrors) {
    for (const [field, msgs] of Object.entries(flat.fieldErrors)) {
      if (msgs && msgs.length) parts.push(`${field}: ${msgs.join(", ")}`);
    }
  }
  if (flat.formErrors?.length) parts.push(flat.formErrors.join(", "));
  return parts.length ? parts.join(" · ") : null;
}

async function fetchJson(url: string, method: string, body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  if (response.status === 401 && typeof window !== "undefined") {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.assign(`/admin/login?next=${next}`);
    throw new Error("Sessão expirada. Redirecionando para o login...");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    const detail = describeValidationErrors(data?.error?.details);
    const baseMessage = data?.error?.message ?? "Falha na operação.";
    throw new Error(detail ? `${baseMessage} (${detail})` : baseMessage);
  }
  return data;
}

function validateStep(stepId: StepId, state: FormState): string | null {
  switch (stepId) {
    case "tipo":
      if (!state.type) return "Selecione o tipo do imóvel.";
      if (!state.purpose) return "Selecione a finalidade.";
      return null;
    case "local":
      if (!state.city.trim()) return "Informe a cidade.";
      if (!state.district.trim()) return "Informe o bairro.";
      return null;
    case "features":
      return null;
    case "fotos":
      return null;
    case "detalhes":
      if (!state.title.trim() || state.title.trim().length < 3)
        return "Informe um título com pelo menos 3 caracteres.";
      if (!state.slug.trim()) return "Slug é obrigatório.";
      if (state.description.trim().length < 12)
        return "Descrição precisa de pelo menos 12 caracteres.";
      if (!(state.price > 0)) return "Informe um preço válido.";
      return null;
    default:
      return null;
  }
}

function mergePortalPublications(initial?: WizardPortalPublication[]) {
  const byPortal = new Map((initial ?? []).map((item) => [item.portalName, item]));
  return DEFAULT_PORTAL_PUBLICATIONS.map((item) => ({
    ...item,
    ...(byPortal.get(item.portalName) ?? {})
  }));
}

function getPortalChecklist(state: FormState, mediaCount: number) {
  const checks = [
    { label: "Status disponível", ok: state.status === "DISPONIVEL", blocking: true },
    { label: "Título preenchido", ok: state.title.trim().length >= 3, blocking: true },
    { label: "Tipo e finalidade definidos", ok: Boolean(state.type && state.purpose), blocking: true },
    { label: "Preço informado", ok: state.price > 0, blocking: true },
    { label: "Cidade e bairro informados", ok: Boolean(state.city.trim() && state.district.trim()), blocking: true },
    { label: "Descrição mínima", ok: state.description.trim().length >= 12, blocking: true },
    { label: "Pelo menos uma foto", ok: mediaCount > 0, blocking: true },
    { label: "Cinco ou mais fotos", ok: mediaCount >= 5, blocking: false }
  ];
  const blockingIssues = checks.filter((item) => item.blocking && !item.ok);
  const completed = checks.filter((item) => item.ok).length;
  return {
    ready: blockingIssues.length === 0,
    percent: Math.round((completed / checks.length) * 100),
    checks,
    blockingIssues
  };
}

export function PropertyWizard({ mode, initial }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [propertyId, setPropertyId] = useState<string | undefined>(initial?.id);
  const [media, setMedia] = useState<WizardMedia[]>(initial?.media ?? []);
  const [portalPublications, setPortalPublications] = useState<WizardPortalPublication[]>(
    mergePortalPublications(initial?.portalPublications)
  );
  const [state, setState] = useState<FormState>(makeInitialState(initial));
  const [stepIndex, setStepIndex] = useState(0);
  const [savingStep, setSavingStep] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [advancedLocation, setAdvancedLocation] = useState(false);
  const [showMarketing, setShowMarketing] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (!hash) return;
    const target = STEPS.findIndex((step) => step.id === hash);
    if (target < 0) return;
    const frame = window.requestAnimationFrame(() => setStepIndex(target));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const stepId = STEPS[stepIndex].id;
  const isLast = stepIndex === STEPS.length - 1;
  const isFirst = stepIndex === 0;

  function patchState(partial: Partial<FormState>) {
    setStepError(null);
    setGlobalSuccess(null);
    setState((prev) => {
      const next = { ...prev, ...partial };
      if (!slugTouched && partial.title !== undefined && partial.slug === undefined) {
        next.slug = slugify(partial.title);
      }
      return next;
    });
  }

  function patchPortalPublication(
    portalName: WizardPortalPublication["portalName"],
    partial: Partial<WizardPortalPublication>
  ) {
    setStepError(null);
    setGlobalSuccess(null);
    setPortalPublications((prev) =>
      prev.map((item) =>
        item.portalName === portalName
          ? {
              ...item,
              ...partial,
              status:
                partial.enabled === false
                  ? "REMOVIDO"
                  : partial.enabled === true && item.status === "REMOVIDO"
                    ? "PENDENTE"
                    : partial.status ?? item.status
            }
          : item
      )
    );
  }

  function toggleFeature(value: string) {
    const nextFeature = value.trim();
    if (!nextFeature) return;

    setState((prev) => {
      const nextKey = normalizeFeatureKey(nextFeature);
      const exists = prev.features.some((item) => normalizeFeatureKey(item) === nextKey);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((item) => normalizeFeatureKey(item) !== nextKey)
          : [...prev.features, nextFeature]
      };
    });
  }

  async function persistDraft(): Promise<string | null> {
    const payload = {
      title: state.title || `Rascunho ${new Date().toLocaleDateString("pt-BR")}`,
      slug: state.slug || `rascunho-${Date.now()}`,
      type: state.type,
      purpose: state.purpose,
      status: state.status,
      price: state.price || 1,
      city: state.city,
      district: state.district,
      address: state.address,
      postalCode: state.postalCode,
      googleMapsUrl: state.googleMapsUrl,
      latitude: state.latitude ?? undefined,
      longitude: state.longitude ?? undefined,
      areaM2: state.areaM2 ?? undefined,
      landAreaM2: state.landAreaM2 ?? undefined,
      frontMeters: state.frontMeters ?? undefined,
      backMeters: state.backMeters ?? undefined,
      sideLeftMeters: state.sideLeftMeters ?? undefined,
      sideRightMeters: state.sideRightMeters ?? undefined,
      ceilingHeightM: state.ceilingHeightM ?? undefined,
      bedrooms: state.bedrooms ?? undefined,
      livingRooms: state.livingRooms ?? undefined,
      suites: state.suites ?? undefined,
      bathrooms: state.bathrooms ?? undefined,
      parkingSpaces: state.parkingSpaces ?? undefined,
      floorNumber: state.floorNumber ?? undefined,
      floorCount: state.floorCount ?? undefined,
      unitCount: state.unitCount ?? undefined,
      description: state.description || "Aguardando descrição final do imóvel.",
      features: state.features,
      legalNotes: state.legalNotes,
      internalNotes: state.internalNotes,
      commissionPct: state.commissionPct ?? undefined,
      marketAskingValue: state.marketAskingValue ?? undefined,
      marketEstimatedValue: state.marketEstimatedValue ?? undefined,
      marketOpportunity: state.marketOpportunity ?? undefined,
      marketComparableLinks: state.marketComparableLinks,
      marketLiquidityNotes: state.marketLiquidityNotes,
      isInvestorHighlight: state.isInvestorHighlight,
      isAuctionOpportunity: state.isAuctionOpportunity,
      ownerName: state.ownerName ?? undefined,
      ownerPhone: state.ownerPhone ?? undefined
    };

    if (propertyId) {
      await fetchJson(`/api/crm/properties/${propertyId}`, "PATCH", payload);
      return propertyId;
    }
    const result = await fetchJson("/api/crm/properties", "POST", payload);
    const newId = result?.data?.property?.id as string | undefined;
    if (newId) {
      setPropertyId(newId);
      return newId;
    }
    return null;
  }

  async function persistPortalPublications(targetPropertyId: string) {
    const result = await fetchJson(
      `/api/crm/properties/${targetPropertyId}/portal-publications`,
      "PUT",
      {
        publications: portalPublications.map((publication) => ({
          portalName: publication.portalName,
          enabled: publication.enabled,
          status: publication.status,
          customTitle: publication.customTitle,
          customDescription: publication.customDescription,
          customPrice: publication.customPrice,
          showFullAddress: publication.showFullAddress,
          showPrice: publication.showPrice,
          highlightEnabled: publication.highlightEnabled,
          highlightType: publication.highlightType
        }))
      }
    );
    if (Array.isArray(result?.data?.publications)) {
      setPortalPublications(mergePortalPublications(result.data.publications as WizardPortalPublication[]));
    }
  }

  async function handleNext() {
    setStepError(null);
    const error = validateStep(stepId, state);
    if (error) {
      setStepError(error);
      return;
    }

    setSavingStep(true);
    try {
      if (stepId === "local" && !propertyId) {
        await persistDraft();
        setGlobalSuccess("Rascunho salvo. Você já pode adicionar fotos na próxima etapa.");
      } else if (propertyId) {
        await persistDraft();
      }
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    } catch (err) {
      setStepError(err instanceof Error ? err.message : "Erro ao salvar etapa.");
    } finally {
      setSavingStep(false);
    }
  }

  async function handleFinish() {
    setStepError(null);
    const error = validateStep(stepId === "portais" ? "detalhes" : stepId, state);
    if (error) {
      setStepError(error);
      return;
    }
    setSavingStep(true);
    try {
      const id = await persistDraft();
      if (id && stepId === "portais") {
        await persistPortalPublications(id);
      }
      setGlobalSuccess(mode === "create" ? "Imóvel criado com sucesso." : "Imóvel atualizado.");
      startTransition(() => router.refresh());
      if (mode === "create" && id) {
        setTimeout(() => router.push(`/crm/imoveis/${id}`), 600);
      }
    } catch (err) {
      setStepError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSavingStep(false);
    }
  }

  function handleBack() {
    setStepError(null);
    setGlobalSuccess(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleJump(index: number) {
    if (mode === "create") {
      if (!propertyId && index > 1) return;
    }
    setStepIndex(index);
    setStepError(null);
  }

  return (
    <div className="wiz">
      <ProgressBar
        steps={STEPS}
        currentIndex={stepIndex}
        canJump={mode === "edit" || Boolean(propertyId)}
        onJump={handleJump}
      />

      <div className="wiz-card">
        {stepId === "tipo" ? <StepTipo state={state} onChange={patchState} /> : null}
        {stepId === "local" ? (
          <StepLocal
            state={state}
            onChange={patchState}
            advanced={advancedLocation}
            onAdvancedToggle={() => setAdvancedLocation((v) => !v)}
          />
        ) : null}
        {stepId === "features" ? (
          <StepFeatures state={state} onChange={patchState} onToggleFeature={toggleFeature} />
        ) : null}
        {stepId === "fotos" ? (
          <StepFotos
            propertyId={propertyId}
            media={media}
            onMediaChange={(next) => {
              setMedia(next);
              startTransition(() => router.refresh());
            }}
          />
        ) : null}
        {stepId === "detalhes" ? (
          <StepDetalhes
            state={state}
            onChange={patchState}
            onSlugTouched={() => setSlugTouched(true)}
            showMarketing={showMarketing}
            onToggleMarketing={() => setShowMarketing((v) => !v)}
            showNotes={showNotes}
            onToggleNotes={() => setShowNotes((v) => !v)}
          />
        ) : null}
        {stepId === "portais" ? (
          <StepPortais
            state={state}
            mediaCount={media.length}
            publications={portalPublications}
            onChange={patchPortalPublication}
          />
        ) : null}

        {stepError ? <p className="wiz-alert wiz-alert--error">{stepError}</p> : null}
        {globalSuccess ? <p className="wiz-alert wiz-alert--success">{globalSuccess}</p> : null}
      </div>

      <div className="wiz-actions">
        <button
          type="button"
          className="button button-ghost"
          onClick={handleBack}
          disabled={isFirst || savingStep}
        >
          ← Voltar
        </button>
        <div className="wiz-actions__spacer" />
        {isLast ? (
          <button
            type="button"
            className="button button-primary"
            onClick={handleFinish}
            disabled={savingStep}
          >
            {savingStep
              ? "Salvando..."
              : stepId === "portais"
                ? "Salvar publicação"
                : mode === "create"
                  ? "Criar imóvel"
                  : "Salvar alterações"}
          </button>
        ) : (
          <button
            type="button"
            className="button button-primary"
            onClick={handleNext}
            disabled={savingStep}
          >
            {savingStep ? "Salvando..." : "Avançar →"}
          </button>
        )}
      </div>
    </div>
  );
}

function ProgressBar({
  steps,
  currentIndex,
  canJump,
  onJump
}: {
  steps: typeof STEPS;
  currentIndex: number;
  canJump: boolean;
  onJump: (index: number) => void;
}) {
  return (
    <ol className="wiz-progress">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const clickable = canJump || index <= currentIndex;
        return (
          <li
            key={step.id}
            className={`wiz-progress__item ${isDone ? "is-done" : ""} ${isCurrent ? "is-current" : ""}`}
          >
            <button
              type="button"
              className="wiz-progress__step"
              onClick={() => clickable && onJump(index)}
              disabled={!clickable}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span className="wiz-progress__circle">{isDone ? "✓" : index + 1}</span>
              <span className="wiz-progress__label">{step.label}</span>
              <span className="wiz-progress__label--short">{step.short}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function StepTipo({ state, onChange }: { state: FormState; onChange: (partial: Partial<FormState>) => void }) {
  return (
    <div className="wiz-step">
      <h2 className="wiz-step__title">Que tipo de imóvel é?</h2>
      <p className="wiz-step__hint">Comece pelo tipo, a finalidade do anúncio e o status comercial atual.</p>

      <div className="wiz-tiles">
        {TYPE_OPTIONS.map((option) => {
          const TileIcon = option.Icon;
          return (
            <button
              key={option.value}
              type="button"
              className={`wiz-tile ${state.type === option.value ? "is-active" : ""}`}
              onClick={() => onChange({ type: option.value })}
            >
              <span className="wiz-tile__icon" aria-hidden="true">
                <TileIcon size={22} strokeWidth={1.6} />
              </span>
              <span className="wiz-tile__label">{option.label}</span>
              <span className="wiz-tile__hint">{option.hint}</span>
            </button>
          );
        })}
      </div>

      <h3 className="wiz-step__subtitle">Finalidade do anúncio</h3>
      <div className="wiz-chips">
        {PURPOSE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`wiz-chip ${state.purpose === option.value ? "is-active" : ""}`}
            onClick={() => onChange({ purpose: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>

      <h3 className="wiz-step__subtitle">Status comercial</h3>
      <div className="wiz-chips">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`wiz-chip ${state.status === option.value ? "is-active" : ""}`}
            onClick={() => onChange({ status: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepLocal({
  state,
  onChange,
  advanced,
  onAdvancedToggle
}: {
  state: FormState;
  onChange: (partial: Partial<FormState>) => void;
  advanced: boolean;
  onAdvancedToggle: () => void;
}) {
  return (
    <div className="wiz-step">
      <h2 className="wiz-step__title">Onde está o imóvel?</h2>
      <p className="wiz-step__hint">Localização correta gera mais leads. Capriche no bairro e no link do Google Maps.</p>

      <div className="wiz-form">
        <div className="wiz-field">
          <label>Cidade</label>
          <input
            value={state.city}
            onChange={(event) => onChange({ city: event.target.value })}
            placeholder="Palmas"
          />
        </div>
        <div className="wiz-field">
          <label>Bairro *</label>
          <input
            value={state.district}
            onChange={(event) => onChange({ district: event.target.value })}
            placeholder="Plano Diretor Sul"
          />
        </div>
        <div className="wiz-field wiz-field--wide">
          <label>Endereço</label>
          <input
            value={state.address ?? ""}
            onChange={(event) => onChange({ address: event.target.value || null })}
            placeholder="Quadra 401 Sul, Av. JK..."
          />
        </div>
        <div className="wiz-field">
          <label>CEP</label>
          <input
            value={state.postalCode ?? ""}
            onChange={(event) => onChange({ postalCode: event.target.value || null })}
            placeholder="77000-000"
          />
        </div>
        <div className="wiz-field wiz-field--wide">
          <label>Link do Google Maps</label>
          <input
            value={state.googleMapsUrl ?? ""}
            onChange={(event) => onChange({ googleMapsUrl: event.target.value || null })}
            placeholder="https://maps.google.com/?q=..."
          />
        </div>
      </div>

      <button type="button" className="wiz-link" onClick={onAdvancedToggle}>
        {advanced ? "Ocultar coordenadas" : "+ Adicionar coordenadas (lat/lng)"}
      </button>
      {advanced ? (
        <div className="wiz-form">
          <div className="wiz-field">
            <label>Latitude</label>
            <input
              type="number"
              step="any"
              value={state.latitude ?? ""}
              onChange={(event) =>
                onChange({ latitude: event.target.value === "" ? null : Number(event.target.value) })
              }
            />
          </div>
          <div className="wiz-field">
            <label>Longitude</label>
            <input
              type="number"
              step="any"
              value={state.longitude ?? ""}
              onChange={(event) =>
                onChange({ longitude: event.target.value === "" ? null : Number(event.target.value) })
              }
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 99
}: {
  label: string;
  value: number | null;
  onChange: (next: number | null) => void;
  min?: number;
  max?: number;
}) {
  const current = value ?? 0;
  return (
    <div className="wiz-stepper">
      <span className="wiz-stepper__label">{label}</span>
      <div className="wiz-stepper__controls">
        <button
          type="button"
          aria-label={`Diminuir ${label.toLowerCase()}`}
          onClick={() => onChange(Math.max(min, current - 1) || null)}
          disabled={current <= min}
        >
          −
        </button>
        <span className="wiz-stepper__value">{current}</span>
        <button
          type="button"
          aria-label={`Aumentar ${label.toLowerCase()}`}
          onClick={() => onChange(Math.min(max, current + 1))}
          disabled={current >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

function StepFeatures({
  state,
  onChange,
  onToggleFeature
}: {
  state: FormState;
  onChange: (partial: Partial<FormState>) => void;
  onToggleFeature: (value: string) => void;
}) {
  const [customFeature, setCustomFeature] = useState("");
  const category = getPropertyCategory(state.type);
  const allCategoryPresets = useMemo(
    () => new Set(category.groups.flatMap((group) => group.presets)),
    [category]
  );
  const selectedFeatureKeys = useMemo(
    () => new Set(state.features.map((feature) => normalizeFeatureKey(feature))),
    [state.features]
  );
  const customFeatures = state.features.filter((feature) => !allCategoryPresets.has(feature));
  const isFeatureSelected = (feature: string) => selectedFeatureKeys.has(normalizeFeatureKey(feature));

  const renderDimensionField = (id: DimensionFieldId) => {
    const meta = DIMENSION_FIELDS[id];
    const value = state[id];
    return (
      <div className="wiz-field" key={id}>
        <label>{meta.label}</label>
        <input
          type="number"
          min={0}
          step={meta.step}
          value={value ?? ""}
          onChange={(event) =>
            onChange({
              [id]: event.target.value === "" ? null : Number(event.target.value)
            } as Partial<FormState>)
          }
          placeholder={meta.placeholder}
        />
      </div>
    );
  };

  const renderCounterField = (id: CounterFieldId) => (
    <NumberStepper
      key={id}
      label={COUNTER_FIELDS[id]}
      value={state[id]}
      onChange={(v) => onChange({ [id]: v } as Partial<FormState>)}
    />
  );

  const CategoryIcon = category.Icon;

  return (
    <div className="wiz-step">
      <h2 className="wiz-step__title wiz-step__title--with-icon">
        <CategoryIcon size={20} strokeWidth={1.75} aria-hidden="true" />
        <span>{category.label}</span>
      </h2>
      <p className="wiz-step__hint">
        {category.hint ??
          "Quanto mais completo, melhor o filtro funciona pra compradores e investidores."}
      </p>

      {category.dimensions.length ? (
        <div className="wiz-form wiz-form--cols-2">{category.dimensions.map(renderDimensionField)}</div>
      ) : null}

      {category.counters.length ? (
        <div className="wiz-steppers">{category.counters.map(renderCounterField)}</div>
      ) : null}

      {category.groups.map((group) => {
        const GroupIcon = group.Icon;
        const selectedCount = group.presets.reduce((count, preset) => (isFeatureSelected(preset) ? count + 1 : count), 0);
        return (
          <section key={group.id} className="wiz-feature-group">
            <header className="wiz-feature-group__header">
              <span className="wiz-feature-group__title">
                <GroupIcon size={16} strokeWidth={1.75} aria-hidden="true" />
                {group.title}
              </span>
              <span className="wiz-feature-group__count" aria-label={`${selectedCount} de ${group.presets.length} selecionados`}>
                {selectedCount}/{group.presets.length}
              </span>
            </header>
            <div className="wiz-chips wiz-chips--multi">
              {group.presets.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  className={`wiz-chip ${isFeatureSelected(feature) ? "is-active" : ""}`}
                  aria-pressed={isFeatureSelected(feature)}
                  onClick={() => onToggleFeature(feature)}
                >
                  {feature}
                </button>
              ))}
            </div>
          </section>
        );
      })}

      {customFeatures.length ? (
        <section className="wiz-feature-group">
          <header className="wiz-feature-group__header">
            <span className="wiz-feature-group__title">
              <List size={16} strokeWidth={1.75} aria-hidden="true" />
              Características personalizadas
            </span>
            <span className="wiz-feature-group__count" aria-label={`${customFeatures.length} características personalizadas`}>
              {customFeatures.length}
            </span>
          </header>
          <div className="wiz-chips wiz-chips--multi">
            {customFeatures.map((feature) => (
              <button
                key={feature}
                type="button"
                className="wiz-chip is-active is-custom"
                aria-pressed="true"
                onClick={() => onToggleFeature(feature)}
              >
                {feature} ×
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <div className="wiz-form">
        <div className="wiz-field wiz-field--wide">
          <label>Adicionar característica personalizada</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={customFeature}
              onChange={(event) => setCustomFeature(event.target.value)}
              placeholder="Ex: Sistema de automação"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (customFeature.trim()) {
                    onToggleFeature(customFeature.trim());
                    setCustomFeature("");
                  }
                }
              }}
            />
            <button
              type="button"
              className="button button-ghost"
              onClick={() => {
                if (customFeature.trim()) {
                  onToggleFeature(customFeature.trim());
                  setCustomFeature("");
                }
              }}
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepFotos({
  propertyId,
  media,
  onMediaChange
}: {
  propertyId?: string;
  media: WizardMedia[];
  onMediaChange: (next: WizardMedia[]) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  if (!propertyId) {
    return (
      <div className="wiz-step">
        <h2 className="wiz-step__title">Fotos do imóvel</h2>
        <div className="wiz-empty">
          <p>
            Preencha pelo menos a etapa <strong>Tipo</strong> e <strong>Localização</strong> e clique em
            &quot;Avançar&quot; para criar o rascunho. Depois disso você pode adicionar fotos aqui.
          </p>
        </div>
      </div>
    );
  }

  async function uploadFiles(files: File[]) {
    if (!files.length) return;
    setError(null);
    setUploading(true);
    setProgress({ current: 0, total: files.length });
    try {
      const newItems: WizardMedia[] = [];
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        setProgress({ current: i + 1, total: files.length });
        try {
          const directUpload = await fetchJson("/api/media/images/direct-upload", "POST", {
            metadata: { module: "property", propertyId }
          });
          const uploadUrl = directUpload.data.directUpload.uploadURL as string;
          const imageDeliveryUrl = directUpload.data.imageDeliveryUrl as string | null | undefined;
          const watermarkedFile = await applyWatermarkToImage(file);
          const body = new FormData();
          body.append("file", watermarkedFile);
          const cfResponse = await fetch(uploadUrl, { method: "POST", body });
          const cfPayload = await cfResponse.json().catch(() => null);
          if (!cfResponse.ok || !cfPayload?.success) {
            throw new Error(cfPayload?.errors?.[0]?.message ?? `Falha no upload (HTTP ${cfResponse.status}).`);
          }
          const variants = cfPayload?.result?.variants as string[] | undefined;
          const finalUrl = imageDeliveryUrl ?? variants?.[0] ?? "";
          if (!finalUrl) throw new Error("URL pública não retornada.");
          const cloudflareMediaId = cfPayload?.result?.id as string | undefined;
          const registered = await fetchJson(`/api/crm/properties/${propertyId}/media`, "POST", {
            kind: "IMAGE",
            url: finalUrl,
            cloudflareMediaId
          });
          newItems.push(registered.data.media as WizardMedia);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Falha no upload de uma foto.");
        }
      }
      onMediaChange([...media, ...newItems]);
    } finally {
      setUploading(false);
      setProgress(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function setAsPrimary(mediaId: string) {
    try {
      await fetchJson(`/api/crm/properties/${propertyId}/media/${mediaId}`, "PATCH", { makePrimary: true });
      const target = media.find((item) => item.id === mediaId);
      if (!target) return;
      onMediaChange(
        [target, ...media.filter((item) => item.id !== mediaId)].map((item, index) => ({
          ...item,
          position: index
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao definir capa.");
    }
  }

  async function move(mediaId: string, direction: -1 | 1) {
    const index = media.findIndex((item) => item.id === mediaId);
    if (index < 0) return;
    const target = index + direction;
    if (target < 0 || target >= media.length) return;
    const next = [...media];
    [next[index], next[target]] = [next[target], next[index]];
    const remapped = next.map((item, idx) => ({ ...item, position: idx }));
    onMediaChange(remapped);
    try {
      await fetchJson(`/api/crm/properties/${propertyId}/media/${mediaId}`, "PATCH", { position: target });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao reordenar.");
    }
  }

  async function removeMedia(mediaId: string) {
    if (!confirm("Remover esta foto?")) return;
    try {
      await fetchJson(`/api/crm/properties/${propertyId}/media/${mediaId}`, "DELETE");
      onMediaChange(media.filter((item) => item.id !== mediaId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover.");
    }
  }

  return (
    <div className="wiz-step">
      <h2 className="wiz-step__title">Fotos do imóvel</h2>
      <p className="wiz-step__hint">
        Capa = primeira foto. Anúncios com 6 ou mais fotos performam melhor. Suba fotos em ordem cronológica
        de impacto: fachada → áreas comuns → cômodos.
      </p>

      <div
        className={`wiz-drop ${dragOver ? "is-dragover" : ""} ${uploading ? "is-uploading" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          const files = Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith("image/"));
          void uploadFiles(files);
        }}
        onClick={() => fileRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            void uploadFiles(files);
          }}
        />
        <div className="wiz-drop__icon" aria-hidden>🖼️</div>
        {uploading && progress ? (
          <>
            <p className="wiz-drop__title">Enviando {progress.current} de {progress.total}...</p>
            <div className="wiz-drop__progress">
              <div style={{ width: `${(progress.current / progress.total) * 100}%` }} />
            </div>
          </>
        ) : (
          <>
            <p className="wiz-drop__title">
              Arraste fotos aqui ou <span>clique para escolher</span>
            </p>
            <p className="wiz-drop__hint">JPG, PNG ou WEBP até 10MB cada • envio múltiplo suportado</p>
          </>
        )}
      </div>

      {error ? <p className="wiz-alert wiz-alert--error">{error}</p> : null}

      {media.length ? (
        <>
          <div className="wiz-gallery__head">
            <h3 className="wiz-step__subtitle" style={{ margin: 0 }}>
              {media.length} {media.length === 1 ? "foto" : "fotos"}
            </h3>
            <span className="wiz-step__hint" style={{ margin: 0 }}>
              Arraste para reordenar pelos botões. A primeira é a capa do anúncio.
            </span>
          </div>
          <div className="wiz-gallery">
            {media.map((item, index) => (
              <div key={item.id} className="wiz-media">
                <div
                  className="wiz-media__thumb"
                  style={{ backgroundImage: `url(${item.url})` }}
                >
                  {index === 0 ? <span className="badge badge-tone-available">Capa</span> : null}
                </div>
                <div className="wiz-media__actions">
                  <button
                    type="button"
                    className="property-status-chip"
                    onClick={() => setAsPrimary(item.id)}
                    disabled={index === 0}
                    title="Tornar capa"
                  >
                    ★
                  </button>
                  <button
                    type="button"
                    className="property-status-chip"
                    onClick={() => move(item.id, -1)}
                    disabled={index === 0}
                    title="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="property-status-chip"
                    onClick={() => move(item.id, 1)}
                    disabled={index === media.length - 1}
                    title="Mover para baixo"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="property-status-chip property-status-chip--danger"
                    onClick={() => removeMedia(item.id)}
                    title="Remover"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="wiz-empty">
          <p>Nenhuma foto ainda. Adicione pelo menos uma foto antes de publicar.</p>
        </div>
      )}
    </div>
  );
}

function StepDetalhes({
  state,
  onChange,
  onSlugTouched,
  showMarketing,
  onToggleMarketing,
  showNotes,
  onToggleNotes
}: {
  state: FormState;
  onChange: (partial: Partial<FormState>) => void;
  onSlugTouched: () => void;
  showMarketing: boolean;
  onToggleMarketing: () => void;
  showNotes: boolean;
  onToggleNotes: () => void;
}) {
  const formattedPrice = useMemo(() => {
    if (!state.price) return "";
    return state.price.toString();
  }, [state.price]);

  return (
    <div className="wiz-step">
      <h2 className="wiz-step__title">Detalhes do anúncio</h2>
      <p className="wiz-step__hint">Capriche no título, descrição e preço — são o que mais influencia o clique.</p>

      <div className="wiz-form">
        <div className="wiz-field wiz-field--wide">
          <label>Título do anúncio *</label>
          <input
            value={state.title}
            onChange={(event) => onChange({ title: event.target.value })}
            placeholder="Casa moderna 4 suítes no Plano Diretor Sul"
          />
        </div>
        <div className="wiz-field wiz-field--wide">
          <label>Slug (URL amigável)</label>
          <input
            value={state.slug}
            onChange={(event) => {
              onSlugTouched();
              onChange({ slug: event.target.value });
            }}
            placeholder="casa-moderna-plano-diretor-sul"
          />
          <span className="wiz-field__hint">
            Aparece em <code>/imoveis/{state.slug || "..."}</code>
          </span>
        </div>
        <div className="wiz-field wiz-field--price">
          <label>Preço *</label>
          <div className="wiz-input-with-prefix">
            <span>R$</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={formattedPrice}
              onChange={(event) =>
                onChange({ price: event.target.value === "" ? 0 : Number(event.target.value) })
              }
              placeholder="850000"
            />
          </div>
        </div>
        <div className="wiz-field">
          <label>Comissão</label>
          <div className="wiz-input-with-suffix">
            <input
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={state.commissionPct ?? ""}
              onChange={(event) =>
                onChange({ commissionPct: event.target.value === "" ? null : Number(event.target.value) })
              }
              placeholder="5"
            />
            <span>%</span>
          </div>
        </div>
        <div className="wiz-field wiz-field--wide">
          <label>Descrição completa *</label>
          <textarea
            rows={5}
            value={state.description}
            onChange={(event) => onChange({ description: event.target.value })}
            placeholder="Descreva o imóvel: padrão de acabamento, contexto da região, diferenciais, condições..."
          />
          <span className="wiz-field__hint">Mínimo 12 caracteres • {state.description.length} digitados</span>
        </div>
      </div>

      <button type="button" className="wiz-disclosure" onClick={onToggleMarketing}>
        <span>{showMarketing ? "−" : "+"}</span> Análise de mercado e flags
      </button>
      {showMarketing ? (
        <div className="wiz-form">
          <div className="wiz-field">
            <label>Valor de mercado pedido</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={state.marketAskingValue ?? ""}
              onChange={(event) =>
                onChange({
                  marketAskingValue: event.target.value === "" ? null : Number(event.target.value)
                })
              }
            />
          </div>
          <div className="wiz-field">
            <label>Valor de mercado estimado</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={state.marketEstimatedValue ?? ""}
              onChange={(event) =>
                onChange({
                  marketEstimatedValue: event.target.value === "" ? null : Number(event.target.value)
                })
              }
            />
          </div>
          <div className="wiz-field">
            <label>Valor de oportunidade</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={state.marketOpportunity ?? ""}
              onChange={(event) =>
                onChange({
                  marketOpportunity: event.target.value === "" ? null : Number(event.target.value)
                })
              }
            />
          </div>
          <div className="wiz-field wiz-field--checks">
            <label style={{ display: "flex", gap: 6, alignItems: "center", margin: 0 }}>
              <input
                type="checkbox"
                checked={state.isInvestorHighlight}
                onChange={(event) => onChange({ isInvestorHighlight: event.target.checked })}
              />
              Destaque investidor
            </label>
            <label style={{ display: "flex", gap: 6, alignItems: "center", margin: 0 }}>
              <input
                type="checkbox"
                checked={state.isAuctionOpportunity}
                onChange={(event) => onChange({ isAuctionOpportunity: event.target.checked })}
              />
              Oportunidade leilão
            </label>
          </div>
          <div className="wiz-field wiz-field--wide">
            <label>Links comparativos (um por linha)</label>
            <textarea
              rows={3}
              value={state.marketComparableLinks.join("\n")}
              onChange={(event) =>
                onChange({
                  marketComparableLinks: event.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean)
                })
              }
            />
          </div>
          <div className="wiz-field wiz-field--wide">
            <label>Notas sobre liquidez</label>
            <textarea
              rows={3}
              value={state.marketLiquidityNotes ?? ""}
              onChange={(event) => onChange({ marketLiquidityNotes: event.target.value || null })}
            />
          </div>
        </div>
      ) : null}

      <button type="button" className="wiz-disclosure" onClick={onToggleNotes}>
        <span>{showNotes ? "−" : "+"}</span> Notas jurídicas e internas
      </button>
      {showNotes ? (
        <div className="wiz-form">
          <div className="wiz-field wiz-field--wide">
            <label>Notas jurídicas / documentais</label>
            <textarea
              rows={3}
              value={state.legalNotes ?? ""}
              onChange={(event) => onChange({ legalNotes: event.target.value || null })}
            />
          </div>
          <div className="wiz-field wiz-field--wide">
            <label>Notas internas (não públicas)</label>
            <textarea
              rows={3}
              value={state.internalNotes ?? ""}
              onChange={(event) => onChange({ internalNotes: event.target.value || null })}
            />
          </div>
        </div>
      ) : null}

      <fieldset className="wiz-fieldset wiz-fieldset--internal">
        <legend>Proprietário (uso interno)</legend>
        <p className="wiz-step__hint" style={{ marginTop: 0 }}>
          Estes dados não aparecem na página pública. O telefone vira link de WhatsApp dentro do CRM.
        </p>
        <div className="wiz-form">
          <div className="wiz-field">
            <label>Nome do proprietário</label>
            <input
              type="text"
              value={state.ownerName ?? ""}
              onChange={(event) => onChange({ ownerName: event.target.value || null })}
              placeholder="Ex.: Mariana Costa"
            />
          </div>
          <div className="wiz-field">
            <label>WhatsApp do proprietário</label>
            <input
              type="tel"
              value={state.ownerPhone ?? ""}
              onChange={(event) => onChange({ ownerPhone: event.target.value || null })}
              placeholder="Ex.: +55 63 99999-0000"
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}

function formatPortalDate(value: string | null) {
  if (!value) return "Nunca";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Nunca";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function StepPortais({
  state,
  mediaCount,
  publications,
  onChange
}: {
  state: FormState;
  mediaCount: number;
  publications: WizardPortalPublication[];
  onChange: (
    portalName: WizardPortalPublication["portalName"],
    partial: Partial<WizardPortalPublication>
  ) => void;
}) {
  const checklist = getPortalChecklist(state, mediaCount);
  const selectedCount = publications.filter((publication) => publication.enabled).length;

  return (
    <div className="wiz-step">
      <h2 className="wiz-step__title">Publicação em portais</h2>
      <p className="wiz-step__hint">
        {checklist.ready
          ? "Imóvel pronto para exportação nos portais selecionados."
          : "Corrija as pendências obrigatórias antes de exportar o imóvel."}
      </p>

      <section className="wiz-portal-readiness" aria-label="Checklist de publicação">
        <div className="wiz-portal-readiness__head">
          <span>Pronto para publicação</span>
          <strong>{checklist.percent}%</strong>
        </div>
        <div className="wiz-portal-readiness__bar" aria-hidden="true">
          <div style={{ width: `${checklist.percent}%` }} />
        </div>
        <ul className="wiz-portal-checklist">
          {checklist.checks.map((item) => (
            <li key={item.label} className={item.ok ? "is-ok" : item.blocking ? "is-blocking" : "is-warning"}>
              <span>{item.ok ? "✓" : item.blocking ? "!" : "i"}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </section>

      <div className="wiz-portal-toolbar">
        <strong>{selectedCount} {selectedCount === 1 ? "portal selecionado" : "portais selecionados"}</strong>
        <span>{mediaCount} {mediaCount === 1 ? "foto disponível" : "fotos disponíveis"}</span>
      </div>

      <div className="wiz-portal-list">
        {publications.map((publication) => (
          <section
            key={publication.portalName}
            className={`wiz-portal-item ${publication.enabled ? "is-enabled" : ""}`}
          >
            <header className="wiz-portal-item__head">
              <label className="wiz-portal-toggle">
                <input
                  type="checkbox"
                  checked={publication.enabled}
                  onChange={(event) =>
                    onChange(publication.portalName, { enabled: event.target.checked })
                  }
                />
                <span>
                  <strong>{publication.portalLabel}</strong>
                  <small>{publication.type}</small>
                </span>
              </label>
              <span className={`wiz-portal-status wiz-portal-status--${publication.status.toLowerCase()}`}>
                {PORTAL_STATUS_OPTIONS.find((option) => option.value === publication.status)?.label ??
                  (publication.status === "REMOVIDO" ? "Removido" : publication.status)}
              </span>
            </header>

            <p className="wiz-step__hint">{publication.description}</p>

            <div className="wiz-form">
              <div className="wiz-field">
                <label>Status no portal</label>
                <select
                  value={publication.status === "REMOVIDO" ? "PENDENTE" : publication.status}
                  disabled={!publication.enabled}
                  onChange={(event) =>
                    onChange(publication.portalName, {
                      status: event.target.value as PortalPublicationStatusValue
                    })
                  }
                >
                  {PORTAL_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="wiz-field">
                <label>Preço específico</label>
                <div className="wiz-input-with-prefix">
                  <span>R$</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={publication.customPrice ?? ""}
                    disabled={!publication.enabled}
                    onChange={(event) =>
                      onChange(publication.portalName, {
                        customPrice: event.target.value === "" ? null : Number(event.target.value)
                      })
                    }
                    placeholder={state.price ? String(state.price) : "0"}
                  />
                </div>
              </div>
              <div className="wiz-field wiz-field--wide">
                <label>Título específico</label>
                <input
                  value={publication.customTitle ?? ""}
                  disabled={!publication.enabled}
                  onChange={(event) =>
                    onChange(publication.portalName, { customTitle: event.target.value || null })
                  }
                  placeholder={state.title || "Usar título do imóvel"}
                />
              </div>
              <div className="wiz-field wiz-field--wide">
                <label>Descrição específica</label>
                <textarea
                  rows={3}
                  value={publication.customDescription ?? ""}
                  disabled={!publication.enabled}
                  onChange={(event) =>
                    onChange(publication.portalName, { customDescription: event.target.value || null })
                  }
                  placeholder="Usar descrição do imóvel"
                />
              </div>
              <div className="wiz-field wiz-field--checks">
                <label>
                  <input
                    type="checkbox"
                    checked={publication.showPrice}
                    disabled={!publication.enabled}
                    onChange={(event) =>
                      onChange(publication.portalName, { showPrice: event.target.checked })
                    }
                  />
                  Mostrar preço
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={publication.showFullAddress}
                    disabled={!publication.enabled}
                    onChange={(event) =>
                      onChange(publication.portalName, { showFullAddress: event.target.checked })
                    }
                  />
                  Mostrar endereço completo
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={publication.highlightEnabled}
                    disabled={!publication.enabled}
                    onChange={(event) =>
                      onChange(publication.portalName, { highlightEnabled: event.target.checked })
                    }
                  />
                  Marcar como destaque
                </label>
              </div>
              {publication.highlightEnabled ? (
                <div className="wiz-field">
                  <label>Tipo de destaque</label>
                  <input
                    value={publication.highlightType ?? ""}
                    disabled={!publication.enabled}
                    onChange={(event) =>
                      onChange(publication.portalName, { highlightType: event.target.value || null })
                    }
                    placeholder="Destaque"
                  />
                </div>
              ) : null}
            </div>

            <footer className="wiz-portal-item__foot">
              <span>Última sincronização: {formatPortalDate(publication.lastSyncAt)}</span>
              <a href={publication.feedUrl} target="_blank" rel="noopener noreferrer">
                Ver XML
              </a>
            </footer>
            {publication.errorMessage ? (
              <p className="wiz-alert wiz-alert--error">{publication.errorMessage}</p>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
