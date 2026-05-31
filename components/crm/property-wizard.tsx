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
  { id: "detalhes", label: "Detalhes & Preço", short: "Detalhes" }
] as const;

type StepId = (typeof STEPS)[number]["id"];

export type WizardMedia = {
  id: string;
  url: string;
  position: number;
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
};

type FormState = Omit<WizardProperty, "id" | "media">;

type Props = {
  mode: "create" | "edit";
  initial?: WizardProperty;
};

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

export function PropertyWizard({ mode, initial }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [propertyId, setPropertyId] = useState<string | undefined>(initial?.id);
  const [media, setMedia] = useState<WizardMedia[]>(initial?.media ?? []);
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

  function toggleFeature(value: string) {
    setState((prev) => {
      const exists = prev.features.includes(value);
      return {
        ...prev,
        features: exists ? prev.features.filter((item) => item !== value) : [...prev.features, value]
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
    const error = validateStep("detalhes", state);
    if (error) {
      setStepError(error);
      return;
    }
    setSavingStep(true);
    try {
      const id = await persistDraft();
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
            {savingStep ? "Salvando..." : mode === "create" ? "Criar imóvel" : "Salvar alterações"}
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
  const customFeatures = state.features.filter((feature) => !allCategoryPresets.has(feature));

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
        const selectedCount = group.presets.reduce(
          (count, preset) => (state.features.includes(preset) ? count + 1 : count),
          0
        );
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
                  className={`wiz-chip ${state.features.includes(feature) ? "is-active" : ""}`}
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
