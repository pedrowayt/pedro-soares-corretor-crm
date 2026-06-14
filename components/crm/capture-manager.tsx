"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  CheckCircle2,
  Clock3,
  Clipboard,
  Download,
  ExternalLink,
  Filter,
  Link2,
  MapPin,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X
} from "lucide-react";
import type { CaptureAlertItem, CaptureAlertRunResult, CaptureListingItem } from "@/lib/data/capture";
import { formatCurrencyBRL } from "@/lib/utils";

type CaptureFilters = {
  query: string;
  status: string;
  purpose: string;
  type: string;
  location: string;
  priceMin: string;
  priceMax: string;
  privateOnly: boolean;
  fullAddressOnly: boolean;
};

type ManualFormState = {
  sourceName: string;
  sourceUrl: string;
  title: string;
  purpose: string;
  type: string;
  price: string;
  city: string;
  district: string;
  address: string;
  areaM2: string;
  landAreaM2: string;
  bedrooms: string;
  suites: string;
  bathrooms: string;
  parkingSpaces: string;
  advertiserName: string;
  advertiserPhone: string;
  marketAvgPrice: string;
  notes: string;
  isPrivateSeller: boolean;
  hasFullAddress: boolean;
};

type AlertFormState = {
  name: string;
  provider: CapturePortalProviderId;
  searchUrl: string;
  city: string;
  district: string;
  purpose: string;
  type: string;
  priceMin: string;
  priceMax: string;
  maxResultsPerRun: string;
  onlyPrivateSeller: boolean;
  onlyFullAddress: boolean;
  active: boolean;
};

type ApiPayload = {
  success?: boolean;
  listing?: CaptureListingItem;
  data?: {
    listing?: CaptureListingItem;
    listings?: CaptureListingItem[];
    alert?: CaptureAlertItem;
    alerts?: CaptureAlertItem[];
    results?: CaptureAlertRunResult[];
    importedCount?: number;
    failedCount?: number;
    errors?: string[];
  };
  error?: { message?: string };
};

type CapturePortalProviderId = "olx" | "zap" | "imovelweb" | "chaves-na-mao" | "facebook-marketplace";

const EMPTY_FILTERS: CaptureFilters = {
  query: "",
  status: "",
  purpose: "",
  type: "",
  location: "",
  priceMin: "",
  priceMax: "",
  privateOnly: false,
  fullAddressOnly: false
};

const EMPTY_FORM: ManualFormState = {
  sourceName: "Manual",
  sourceUrl: "",
  title: "",
  purpose: "VENDA",
  type: "CASA",
  price: "",
  city: "Palmas",
  district: "",
  address: "",
  areaM2: "",
  landAreaM2: "",
  bedrooms: "",
  suites: "",
  bathrooms: "",
  parkingSpaces: "",
  advertiserName: "",
  advertiserPhone: "",
  marketAvgPrice: "",
  notes: "",
  isPrivateSeller: true,
  hasFullAddress: false
};

const EMPTY_ALERT_FORM: AlertFormState = {
  name: "Portais Palmas - particulares",
  provider: "olx",
  searchUrl: "",
  city: "Palmas",
  district: "",
  purpose: "VENDA",
  type: "",
  priceMin: "",
  priceMax: "",
  maxResultsPerRun: "8",
  onlyPrivateSeller: true,
  onlyFullAddress: false,
  active: true
};

const STATUS_LABELS: Record<string, string> = {
  NOVO: "Novo",
  EM_ANALISE: "Em análise",
  CAPTADO: "Captado",
  DESCARTADO: "Descartado"
};

const PURPOSE_LABELS: Record<string, string> = {
  VENDA: "Venda",
  LOCACAO: "Locação",
  INVESTIMENTO: "Investimento",
  LEILAO: "Leilão",
  LANCAMENTO: "Lançamento"
};

const TYPE_LABELS: Record<string, string> = {
  CASA: "Casa",
  APARTAMENTO: "Apartamento",
  LOTE: "Lote",
  COMERCIAL: "Comercial",
  RURAL: "Rural",
  AREA_PRIVATIVA: "Área privativa",
  CASA_EM_CONDOMINIO: "Casa em condomínio",
  CASA_GEMINADA: "Casa geminada",
  CHACARA: "Chácara",
  CHACARA_EM_CONDOMINIO: "Chácara em condomínio",
  COBERTURA: "Cobertura",
  FAZENDA: "Fazenda",
  FLAT: "Flat",
  GALPAO: "Galpão",
  LOJA: "Loja",
  LOTE_EM_CONDOMINIO: "Lote em condomínio",
  PREDIO: "Prédio",
  SALA: "Sala",
  SOBRADO: "Sobrado"
};

const PURPOSE_OPTIONS = Object.entries(PURPOSE_LABELS);
const TYPE_OPTIONS = Object.entries(TYPE_LABELS);
const STATUS_OPTIONS = Object.entries(STATUS_LABELS);
const PORTAL_OPTIONS: Array<[CapturePortalProviderId, string]> = [
  ["olx", "OLX"],
  ["zap", "ZAP Imóveis"],
  ["imovelweb", "Imovelweb"],
  ["chaves-na-mao", "Chaves na Mão"],
  ["facebook-marketplace", "Facebook Marketplace"]
];
const PORTAL_LABELS = Object.fromEntries(PORTAL_OPTIONS) as Record<CapturePortalProviderId, string>;
const SEARCH_PLACEHOLDERS: Record<CapturePortalProviderId, string> = {
  olx: "https://to.olx.com.br/tocantins/imoveis...",
  zap: "https://www.zapimoveis.com.br/venda/imoveis/to+palmas/",
  imovelweb: "https://www.imovelweb.com.br/imoveis-venda-palmas-to.html",
  "chaves-na-mao": "https://www.chavesnamao.com.br/imoveis-a-venda/to-palmas/",
  "facebook-marketplace": "https://www.facebook.com/marketplace/palmas/propertyforsale/"
};

function buildBrowserCollectorBookmarklet() {
  const script = `(()=>{const seen=new Set();const items=[];const clean=v=>(v||'').replace(/\\s+/g,' ').trim();const isAd=u=>{const h=u.hostname.toLowerCase();const p=decodeURIComponent(u.pathname);return h.includes('olx.com.br')?/(?:-|\\/)\\d{5,}/.test(p):h.includes('zapimoveis.com.br')?/\\/imovel\\/|\\/imoveis\\/|id-\\d{5,}|-\\d{7,}/.test(p):h.includes('imovelweb.com.br')?/\\/propriedades\\/|\\/imovel\\/|-\\d{7,}/.test(p):h.includes('chavesnamao.com.br')?/\\/imovel\\/|\\/imoveis\\/|\\/casa-|\\/apartamento-|\\/terreno-|\\/sobrado-|\\/chacara-|-\\d{5,}/.test(p):h.includes('facebook.com')?/\\/marketplace\\/item\\/\\d+/.test(p):false};document.querySelectorAll('a[href]').forEach(a=>{try{const u=new URL(a.href,location.href);u.hash='';u.search='';if(!isAd(u)||seen.has(u.href))return;seen.add(u.href);const box=a.closest('article,li,section,div')||a;const text=clean(box.innerText||a.textContent||'');const lines=text.split(/\\n+/).map(clean).filter(Boolean);const price=(text.match(/R\\$\\s*[\\d.]+(?:,\\d{2})?/i)||[''])[0];const title=clean(a.innerText)||lines.find(l=>l&&!/^R\\$/i.test(l)&&!/patrocinado|favorito|online/i.test(l))||document.title;const location=lines.find(l=>/palmas|\\bto\\b|setor|plano diretor|jardim|centro/i.test(l))||'';items.push({sourceUrl:u.href,title,price,location,rawText:text.slice(0,1200)});}catch(e){}});const out=JSON.stringify(items,null,2);navigator.clipboard.writeText(out).then(()=>alert('Captura copiada: '+items.length+' anúncios')).catch(()=>prompt('Copie a captura',out));})();`;
  return `javascript:${encodeURIComponent(script)}`;
}

function normalizeSearchTerm(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function parseNumberInput(value: string) {
  const normalized = value
    .trim()
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function optionalNumber(value: string) {
  const parsed = parseNumberInput(value);
  return parsed ?? undefined;
}

function buildSpecs(listing: CaptureListingItem) {
  return [
    listing.bedrooms !== null ? `${listing.bedrooms} qtos` : null,
    listing.suites !== null ? `${listing.suites} suítes` : null,
    listing.bathrooms !== null ? `${listing.bathrooms} banh.` : null,
    listing.parkingSpaces !== null ? `${listing.parkingSpaces} vagas` : null,
    listing.areaM2 !== null ? `${listing.areaM2} m²` : null,
    listing.landAreaM2 !== null ? `${listing.landAreaM2} m² terreno` : null
  ].filter(Boolean);
}

function formatAge(days: number | null) {
  if (days === null) return "Idade não informada";
  if (days === 0) return "Publicado hoje";
  if (days === 1) return "1 dia de anúncio";
  return `${days} dias de anúncio`;
}

function formatDateTime(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatShortDateTime(value: string | null) {
  if (!value) return "Nunca executado";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function buildLocationOptions(listings: CaptureListingItem[]) {
  const options = new Map<string, string>();
  listings.forEach((listing) => {
    const city = listing.city.trim();
    const district = listing.district.trim();
    const label = [district, city].filter(Boolean).join(", ");
    if (!label) return;
    options.set(`${city}||${district}`, label);
  });
  return Array.from(options, ([value, label]) => ({ value, label })).sort((first, second) =>
    first.label.localeCompare(second.label, "pt-BR")
  );
}

function buildWhatsappLink(phone: string, listing: CaptureListingItem) {
  const digits = phone.replace(/\D/g, "");
  const text = encodeURIComponent(
    `Olá! Vi seu anúncio "${listing.title}" e queria conversar sobre uma possível parceria para venda/captação do imóvel.`
  );
  return `https://wa.me/${digits}?text=${text}`;
}

function getStatusTone(status: string) {
  if (status === "CAPTADO") return "success";
  if (status === "DESCARTADO") return "muted";
  if (status === "EM_ANALISE") return "warning";
  return "info";
}

function getScoreTone(score: number) {
  if (score >= 75) return "hot";
  if (score >= 55) return "warm";
  return "cold";
}

function buildSubmitPayload(form: ManualFormState) {
  return {
    sourceName: form.sourceName,
    sourceKind: "MANUAL",
    sourceUrl: form.sourceUrl,
    title: form.title,
    purpose: form.purpose,
    type: form.type,
    price: optionalNumber(form.price),
    city: form.city,
    district: form.district,
    address: form.address,
    areaM2: optionalNumber(form.areaM2),
    landAreaM2: optionalNumber(form.landAreaM2),
    bedrooms: optionalNumber(form.bedrooms),
    suites: optionalNumber(form.suites),
    bathrooms: optionalNumber(form.bathrooms),
    parkingSpaces: optionalNumber(form.parkingSpaces),
    advertiserName: form.advertiserName,
    advertiserPhone: form.advertiserPhone,
    isPrivateSeller: form.isPrivateSeller,
    hasFullAddress: form.hasFullAddress,
    marketAvgPrice: optionalNumber(form.marketAvgPrice),
    notes: form.notes
  };
}

function buildAlertPayload(form: AlertFormState) {
  return {
    name: form.name,
    provider: form.provider,
    searchUrl: form.searchUrl,
    city: form.city,
    district: form.district,
    purpose: form.purpose,
    type: form.type,
    priceMin: optionalNumber(form.priceMin),
    priceMax: optionalNumber(form.priceMax),
    maxResultsPerRun: optionalNumber(form.maxResultsPerRun) ?? 8,
    onlyPrivateSeller: form.onlyPrivateSeller,
    onlyFullAddress: form.onlyFullAddress,
    active: form.active
  };
}

function getRunTone(status: string | null) {
  if (status === "success") return "success";
  if (status === "warning") return "warning";
  if (status === "error") return "danger";
  return "muted";
}

export function CaptureManager({ listings, alerts }: { listings: CaptureListingItem[]; alerts: CaptureAlertItem[] }) {
  const [items, setItems] = useState<CaptureListingItem[]>(listings);
  const [alertItems, setAlertItems] = useState<CaptureAlertItem[]>(alerts);
  const [filters, setFilters] = useState<CaptureFilters>(EMPTY_FILTERS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ManualFormState>(EMPTY_FORM);
  const [alertForm, setAlertForm] = useState<AlertFormState>(EMPTY_ALERT_FORM);
  const [portalUrl, setPortalUrl] = useState("");
  const [importingPortal, setImportingPortal] = useState(false);
  const [browserCaptureText, setBrowserCaptureText] = useState("");
  const [browserCaptureProvider, setBrowserCaptureProvider] = useState<CapturePortalProviderId>("olx");
  const [importingBrowserCapture, setImportingBrowserCapture] = useState(false);
  const [creatingAlert, setCreatingAlert] = useState(false);
  const [runningAlertId, setRunningAlertId] = useState<string | null>(null);
  const [runningBrowserAlertId, setRunningBrowserAlertId] = useState<string | null>(null);
  const [deletingAlertId, setDeletingAlertId] = useState<string | null>(null);
  const [runningAllAlerts, setRunningAllAlerts] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "warning" | "error"; message: string } | null>(null);

  const locationOptions = useMemo(() => buildLocationOptions(items), [items]);

  const metrics = useMemo(() => {
    const active = items.filter((item) => item.status === "NOVO" || item.status === "EM_ANALISE");
    const hot = active.filter((item) => item.opportunityScore >= 70);
    const captured = items.filter((item) => item.status === "CAPTADO");
    const privateCount = active.filter((item) => item.isPrivateSeller).length;
    return { total: items.length, active: active.length, hot: hot.length, captured: captured.length, privateCount };
  }, [items]);

  const hasActiveFilters =
    Object.entries(filters).some(([, value]) => (typeof value === "boolean" ? value : value.trim().length > 0));

  const filteredItems = useMemo(() => {
    const queryTokens = normalizeSearchTerm(filters.query).split(/\s+/).filter(Boolean);
    const minPrice = parseNumberInput(filters.priceMin);
    const maxPrice = parseNumberInput(filters.priceMax);
    const [filterCity, filterDistrict] = filters.location.split("||");

    return items.filter((listing) => {
      if (filters.status && listing.status !== filters.status) return false;
      if (filters.purpose && listing.purpose !== filters.purpose) return false;
      if (filters.type && listing.type !== filters.type) return false;
      if (filterCity && listing.city.trim() !== filterCity) return false;
      if (filterDistrict && listing.district.trim() !== filterDistrict) return false;
      if (filters.privateOnly && !listing.isPrivateSeller) return false;
      if (filters.fullAddressOnly && !listing.hasFullAddress) return false;
      if (minPrice !== null && listing.price < minPrice) return false;
      if (maxPrice !== null && listing.price > maxPrice) return false;

      if (queryTokens.length) {
        const searchable = normalizeSearchTerm(
          [
            listing.title,
            listing.description,
            listing.city,
            listing.district,
            listing.address,
            listing.advertiserName,
            listing.advertiserPhone,
            listing.sourceName,
            listing.notes,
            STATUS_LABELS[listing.status],
            PURPOSE_LABELS[listing.purpose],
            TYPE_LABELS[listing.type]
          ]
            .filter(Boolean)
            .join(" ")
        );
        if (queryTokens.some((token) => !searchable.includes(token))) return false;
      }

      return true;
    });
  }, [filters, items]);

  function updateFilter<K extends keyof CaptureFilters>(field: K, value: CaptureFilters[K]) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function updateForm(field: keyof ManualFormState, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateFormFromInput(field: keyof ManualFormState) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = event.target;
      updateForm(field, target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value);
    };
  }

  function updateAlertForm(field: keyof AlertFormState, value: string | boolean) {
    setAlertForm((current) => ({ ...current, [field]: value }));
  }

  function updateAlertFormFromInput(field: keyof AlertFormState) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = event.target;
      updateAlertForm(field, target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value);
    };
  }

  async function handleApiData(response: Response) {
    if (response.status === 401) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.assign(`/admin/login?next=${next}`);
      throw new Error("Sessão expirada. Redirecionando para o login...");
    }

    const data = (await response.json().catch(() => null)) as ApiPayload | null;
    if (!response.ok || !data?.success || !data.data) {
      throw new Error(data?.error?.message ?? "Falha na operação.");
    }
    return data.data;
  }

  async function handleResponse(response: Response) {
    const data = await handleApiData(response);
    const listing = data.listing;
    if (!listing) throw new Error("Resposta sem oportunidade de captação.");
    return listing;
  }

  function replaceListing(nextListing: CaptureListingItem) {
    setItems((current) =>
      current.some((item) => item.id === nextListing.id)
        ? current.map((item) => (item.id === nextListing.id ? nextListing : item))
        : [nextListing, ...current]
    );
  }

  function mergeListings(nextListings: CaptureListingItem[]) {
    if (!nextListings.length) return;
    setItems((current) => {
      const byId = new Map(current.map((item) => [item.id, item]));
      nextListings.forEach((listing) => byId.set(listing.id, listing));
      return Array.from(byId.values()).sort((first, second) => {
        if (first.status !== second.status) return first.status.localeCompare(second.status);
        return second.opportunityScore - first.opportunityScore;
      });
    });
  }

  function replaceAlert(nextAlert: CaptureAlertItem) {
    setAlertItems((current) =>
      current.some((alert) => alert.id === nextAlert.id)
        ? current.map((alert) => (alert.id === nextAlert.id ? nextAlert : alert))
        : [nextAlert, ...current]
    );
  }

  async function submitManualListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/crm/captacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSubmitPayload(form))
      });
      const listing = await handleResponse(response);
      replaceListing(listing);
      setForm(EMPTY_FORM);
      setShowForm(false);
      setFeedback({ tone: "success", message: "Oportunidade criada para análise." });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Erro ao criar oportunidade."
      });
    } finally {
      setSaving(false);
    }
  }

  async function importPortalListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setImportingPortal(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/crm/captacao/import/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceUrl: portalUrl })
      });
      const listing = await handleResponse(response);
      replaceListing(listing);
      setPortalUrl("");
      setFeedback({ tone: "success", message: "Anúncio importado para a fila de captação." });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Erro ao importar anúncio do portal."
      });
    } finally {
      setImportingPortal(false);
    }
  }

  async function copyBrowserCollector() {
    setFeedback(null);
    try {
      await navigator.clipboard.writeText(buildBrowserCollectorBookmarklet());
      setFeedback({ tone: "success", message: "Coletor copiado." });
    } catch {
      setFeedback({ tone: "error", message: "Não foi possível copiar o coletor." });
    }
  }

  async function importBrowserCapture(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setImportingBrowserCapture(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/crm/captacao/import/browser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: browserCaptureProvider,
          rawText: browserCaptureText,
          city: "Palmas",
          purpose: "VENDA",
          type: "CASA"
        })
      });
      const data = await handleApiData(response);
      const imported = data.listings ?? [];
      mergeListings(imported);
      setBrowserCaptureText("");
      const failed = data.failedCount ?? 0;
      setFeedback({
        tone: failed > 0 ? "warning" : "success",
        message:
          failed > 0
            ? `${data.importedCount ?? imported.length} anúncios importados; ${failed} não entraram.`
            : `${data.importedCount ?? imported.length} anúncios importados pela captura do navegador.`
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Erro ao importar captura do navegador."
      });
    } finally {
      setImportingBrowserCapture(false);
    }
  }

  async function createAlert(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatingAlert(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/crm/captacao/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildAlertPayload(alertForm))
      });
      const data = await handleApiData(response);
      if (!data.alert) throw new Error("Resposta sem monitoramento.");
      replaceAlert(data.alert);
      setAlertForm(EMPTY_ALERT_FORM);
      setFeedback({ tone: "success", message: "Monitoramento automático criado." });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Erro ao criar monitoramento."
      });
    } finally {
      setCreatingAlert(false);
    }
  }

  async function runAlert(alert: CaptureAlertItem) {
    setRunningAlertId(alert.id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/crm/captacao/alerts/${alert.id}/run`, { method: "POST" });
      const data = await handleApiData(response);
      if (!data.alert) throw new Error("Resposta sem monitoramento.");
      replaceAlert(data.alert);
      mergeListings(data.listings ?? []);
      const runTone = data.alert.lastRunStatus === "error" ? "error" : data.alert.lastRunStatus === "warning" ? "warning" : "success";
      setFeedback({
        tone: runTone,
        message: data.alert.lastRunMessage ?? "Monitoramento executado."
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Erro ao executar monitoramento."
      });
    } finally {
      setRunningAlertId(null);
    }
  }

  async function runBrowserAlert(alert: CaptureAlertItem) {
    setRunningBrowserAlertId(alert.id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/crm/captacao/alerts/${alert.id}/run-browser`, { method: "POST" });
      const data = await handleApiData(response);
      if (!data.alert) throw new Error("Resposta sem monitoramento.");
      replaceAlert(data.alert);
      mergeListings(data.listings ?? []);
      const runTone = data.alert.lastRunStatus === "error" ? "error" : data.alert.lastRunStatus === "warning" ? "warning" : "success";
      setFeedback({
        tone: runTone,
        message: data.alert.lastRunMessage ?? "Monitoramento com navegador executado."
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Erro ao executar navegador."
      });
    } finally {
      setRunningBrowserAlertId(null);
    }
  }

  async function runAllAlerts() {
    setRunningAllAlerts(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/crm/captacao/alerts/run", { method: "POST" });
      const data = await handleApiData(response);
      const results = data.results ?? [];
      results.forEach((result) => replaceAlert(result.alert));
      mergeListings(results.flatMap((result) => result.listings));
      const imported = results.reduce((total, result) => total + result.importedCount, 0);
      const failed = results.reduce((total, result) => total + result.failedCount, 0);
      const hasError = results.some((result) => result.alert.lastRunStatus === "error");
      setFeedback({
        tone: failed > 0 ? (hasError ? "error" : "warning") : "success",
        message:
          failed > 0
            ? `${results.length} monitoramentos executados; ${imported} importados/atualizados; ${failed} falhas.`
            : `${results.length} monitoramentos executados; ${imported} anúncios importados/atualizados.`
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Erro ao executar monitoramentos."
      });
    } finally {
      setRunningAllAlerts(false);
    }
  }

  async function deleteAlert(alert: CaptureAlertItem) {
    if (!window.confirm(`Excluir definitivamente o monitoramento "${alert.name}"?`)) return;
    setDeletingAlertId(alert.id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/crm/captacao/alerts/${alert.id}`, { method: "DELETE" });
      await handleApiData(response);
      setAlertItems((current) => current.filter((item) => item.id !== alert.id));
      setFeedback({ tone: "success", message: "Monitoramento excluído." });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Erro ao excluir monitoramento."
      });
    } finally {
      setDeletingAlertId(null);
    }
  }

  async function captureItem(listing: CaptureListingItem) {
    if (!window.confirm(`Captar "${listing.title}" e criar imóvel em análise?`)) return;
    setPendingId(listing.id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/crm/captacao/${listing.id}/captar`, { method: "POST" });
      const updated = await handleResponse(response);
      replaceListing(updated);
      setFeedback({ tone: "success", message: "Imóvel em análise criado a partir da oportunidade." });
    } catch (error) {
      setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Erro ao captar." });
    } finally {
      setPendingId(null);
    }
  }

  async function discardItem(listing: CaptureListingItem) {
    const reason = window.prompt("Motivo do descarte", "");
    if (reason === null) return;
    setPendingId(listing.id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/crm/captacao/${listing.id}/descartar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });
      const updated = await handleResponse(response);
      replaceListing(updated);
      setFeedback({ tone: "success", message: "Oportunidade descartada." });
    } catch (error) {
      setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Erro ao descartar." });
    } finally {
      setPendingId(null);
    }
  }

  async function deleteItem(listing: CaptureListingItem) {
    const linkedWarning = listing.linkedPropertyId
      ? " O imóvel, lead ou proprietário já vinculados continuarão no CRM."
      : "";
    if (!window.confirm(`Excluir definitivamente "${listing.title}" da captação?${linkedWarning}`)) return;
    setPendingId(listing.id);
    setFeedback(null);
    try {
      const response = await fetch(`/api/crm/captacao/${listing.id}`, { method: "DELETE" });
      await handleApiData(response);
      setItems((current) => current.filter((item) => item.id !== listing.id));
      setFeedback({ tone: "success", message: "Oportunidade excluída da captação." });
    } catch (error) {
      setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Erro ao excluir oportunidade." });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="crm-capture-page">
      <div className="crm-capture-head">
        <div>
          <h1 className="section-title" style={{ marginTop: 0 }}>Captação ativa</h1>
          <p className="section-subtitle">
            Triagem de anúncios externos, proprietários particulares e oportunidades antes de entrarem na carteira.
          </p>
        </div>
        <button type="button" className="button button-primary" onClick={() => setShowForm((open) => !open)}>
          {showForm ? <X size={16} strokeWidth={1.75} aria-hidden="true" /> : <Plus size={16} strokeWidth={1.75} aria-hidden="true" />}
          {showForm ? "Fechar" : "Nova oportunidade"}
        </button>
      </div>

      <section className="crm-capture-metrics" aria-label="Resumo de captação">
        <div className="crm-capture-metric">
          <span>Total monitorado</span>
          <strong>{metrics.total}</strong>
        </div>
        <div className="crm-capture-metric">
          <span>Fila ativa</span>
          <strong>{metrics.active}</strong>
        </div>
        <div className="crm-capture-metric">
          <span>Score quente</span>
          <strong>{metrics.hot}</strong>
        </div>
        <div className="crm-capture-metric">
          <span>Particulares ativos</span>
          <strong>{metrics.privateCount}</strong>
        </div>
        <div className="crm-capture-metric">
          <span>Já captados</span>
          <strong>{metrics.captured}</strong>
        </div>
      </section>

      <section className="crm-capture-automation" aria-label="Captação automática">
        <div className="crm-capture-section-head">
          <div>
            <h2>Captação automática</h2>
            <p>Monitore buscas de portais e importe novos anúncios para a fila.</p>
          </div>
          <button type="button" className="button button-ghost" onClick={runAllAlerts} disabled={runningAllAlerts || !alertItems.length}>
            <RefreshCw size={16} strokeWidth={1.75} aria-hidden="true" />
            {runningAllAlerts ? "Rodando..." : "Rodar ativos"}
          </button>
        </div>

        <form className="crm-capture-alert-form" onSubmit={createAlert}>
          <label>
            Nome
            <input value={alertForm.name} onChange={updateAlertFormFromInput("name")} required minLength={3} />
          </label>
          <label>
            Portal
            <select value={alertForm.provider} onChange={updateAlertFormFromInput("provider")}>
              {PORTAL_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="crm-capture-alert-form__url">
            URL da busca
            <input
              type="url"
              value={alertForm.searchUrl}
              onChange={updateAlertFormFromInput("searchUrl")}
              placeholder={SEARCH_PLACEHOLDERS[alertForm.provider]}
              required
            />
          </label>
          <label>
            Cidade
            <input value={alertForm.city} onChange={updateAlertFormFromInput("city")} required />
          </label>
          <label>
            Bairro
            <input value={alertForm.district} onChange={updateAlertFormFromInput("district")} />
          </label>
          <label>
            Finalidade
            <select value={alertForm.purpose} onChange={updateAlertFormFromInput("purpose")}>
              <option value="">Qualquer</option>
              {PURPOSE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Tipo
            <select value={alertForm.type} onChange={updateAlertFormFromInput("type")}>
              <option value="">Qualquer</option>
              {TYPE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Preço mín.
            <input inputMode="decimal" value={alertForm.priceMin} onChange={updateAlertFormFromInput("priceMin")} placeholder="R$ 300.000" />
          </label>
          <label>
            Preço máx.
            <input inputMode="decimal" value={alertForm.priceMax} onChange={updateAlertFormFromInput("priceMax")} placeholder="R$ 900.000" />
          </label>
          <label>
            Limite
            <input inputMode="numeric" value={alertForm.maxResultsPerRun} onChange={updateAlertFormFromInput("maxResultsPerRun")} />
          </label>
          <label className="crm-capture-check">
            <input type="checkbox" checked={alertForm.onlyPrivateSeller} onChange={updateAlertFormFromInput("onlyPrivateSeller")} />
            Particular
          </label>
          <label className="crm-capture-check">
            <input type="checkbox" checked={alertForm.active} onChange={updateAlertFormFromInput("active")} />
            Ativo
          </label>
          <div className="crm-capture-alert-form__actions">
            <button type="submit" className="button button-primary" disabled={creatingAlert}>
              <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
              {creatingAlert ? "Criando..." : "Criar monitoramento"}
            </button>
          </div>
        </form>

        {alertItems.length ? (
          <div className="crm-capture-alerts">
            {alertItems.map((alert) => (
              <article key={alert.id} className="crm-capture-alert-card">
                <div>
                  <div className="crm-capture-card__badges">
                    <span className="crm-capture-pill" data-tone={alert.active ? "success" : "muted"}>
                      {alert.active ? "Ativo" : "Pausado"}
                    </span>
                    <span className="crm-capture-pill" data-tone={getRunTone(alert.lastRunStatus)}>
                      {alert.lastRunStatus ?? "Pendente"}
                    </span>
                  </div>
                  <h3>{alert.name}</h3>
                  <p>
                    {[alert.district, alert.city].filter(Boolean).join(", ")} ·{" "}
                    {PORTAL_LABELS[alert.provider as CapturePortalProviderId] ?? alert.provider}
                  </p>
                  {alert.searchUrl ? (
                    <a href={alert.searchUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={13} strokeWidth={1.75} aria-hidden="true" />
                      Ver busca
                    </a>
                  ) : null}
                </div>
                <div className="crm-capture-alert-card__stats">
                  <span><Clock3 size={14} strokeWidth={1.75} aria-hidden="true" /> {formatShortDateTime(alert.lastRunAt)}</span>
                  <strong>{alert.lastRunImportedCount} importados</strong>
                  <small>{alert.lastRunMessage ?? `${alert.maxResultsPerRun} anúncios por rodada`}</small>
                </div>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => runAlert(alert)}
                  disabled={runningAlertId === alert.id || runningBrowserAlertId === alert.id || deletingAlertId === alert.id || runningAllAlerts}
                >
                  <Play size={16} strokeWidth={1.75} aria-hidden="true" />
                  {runningAlertId === alert.id ? "Rodando..." : "Rodar"}
                </button>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => runBrowserAlert(alert)}
                  disabled={runningAlertId === alert.id || runningBrowserAlertId === alert.id || deletingAlertId === alert.id || runningAllAlerts}
                >
                  <Search size={16} strokeWidth={1.75} aria-hidden="true" />
                  {runningBrowserAlertId === alert.id ? "Abrindo..." : "Rodar navegador"}
                </button>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => deleteAlert(alert)}
                  disabled={runningAlertId === alert.id || runningBrowserAlertId === alert.id || deletingAlertId === alert.id || runningAllAlerts}
                >
                  <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
                  {deletingAlertId === alert.id ? "Excluindo..." : "Excluir"}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="crm-capture-empty">
            <p>Nenhum monitoramento automático cadastrado.</p>
          </div>
        )}
      </section>

      <section className="crm-capture-import" aria-label="Importar anúncio de portal">
        <div className="crm-capture-section-head">
          <div>
            <h2>Importar anúncio</h2>
            <p>Transforme uma URL de OLX, ZAP, Imovelweb, Chaves na Mão ou Facebook em oportunidade.</p>
          </div>
        </div>
        <form className="crm-capture-import__form" onSubmit={importPortalListing}>
          <label htmlFor="capture-portal-url">URL do anúncio</label>
          <div className="crm-capture-import__row">
            <div className="crm-capture-import__input">
              <Link2 size={16} strokeWidth={1.75} aria-hidden="true" />
              <input
                id="capture-portal-url"
                type="url"
                value={portalUrl}
                onChange={(event) => setPortalUrl(event.target.value)}
                placeholder="Cole a URL do anúncio"
                disabled={importingPortal}
                required
              />
            </div>
            <button type="submit" className="button button-primary" disabled={importingPortal || !portalUrl.trim()}>
              <Download size={16} strokeWidth={1.75} aria-hidden="true" />
              {importingPortal ? "Importando..." : "Importar"}
            </button>
          </div>
        </form>
      </section>

      <section className="crm-capture-import" aria-label="Importar captura do navegador">
        <div className="crm-capture-section-head">
          <div>
            <h2>Captura do navegador</h2>
            <p>Use quando o portal bloquear a leitura automática pelo servidor.</p>
          </div>
          <button type="button" className="button button-ghost" onClick={copyBrowserCollector}>
            <Clipboard size={16} strokeWidth={1.75} aria-hidden="true" />
            Copiar coletor
          </button>
        </div>
        <form className="crm-capture-import__form" onSubmit={importBrowserCapture}>
          <div className="crm-capture-import__grid">
            <label>
              Portal
              <select value={browserCaptureProvider} onChange={(event) => setBrowserCaptureProvider(event.target.value as CapturePortalProviderId)}>
                {PORTAL_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="crm-capture-import__wide">
              Captura
              <textarea
                value={browserCaptureText}
                onChange={(event) => setBrowserCaptureText(event.target.value)}
                placeholder='[{"sourceUrl":"https://...","title":"Casa...","price":"R$ 650.000","location":"Plano Diretor Sul, Palmas"}]'
                rows={5}
                disabled={importingBrowserCapture}
                required
              />
            </label>
          </div>
          <div className="crm-capture-import__actions">
            <button type="submit" className="button button-primary" disabled={importingBrowserCapture || !browserCaptureText.trim()}>
              <Download size={16} strokeWidth={1.75} aria-hidden="true" />
              {importingBrowserCapture ? "Importando..." : "Importar captura"}
            </button>
          </div>
        </form>
      </section>

      {showForm ? (
        <section className="crm-capture-form-wrap" aria-label="Cadastrar oportunidade manual">
          <div className="crm-capture-section-head">
            <div>
              <h2>Nova oportunidade</h2>
              <p>Use para cadastrar manualmente um anúncio visto em portal, rede social, WhatsApp ou placa.</p>
            </div>
          </div>

          <form className="crm-capture-form" onSubmit={submitManualListing}>
            <label>
              Título
              <input value={form.title} onChange={updateFormFromInput("title")} required minLength={3} />
            </label>
            <label>
              Origem
              <input value={form.sourceName} onChange={updateFormFromInput("sourceName")} placeholder="OLX, ZAP, Chaves na Mão..." />
            </label>
            <label className="crm-capture-form__wide">
              URL do anúncio
              <input type="url" value={form.sourceUrl} onChange={updateFormFromInput("sourceUrl")} placeholder="https://..." />
            </label>
            <label>
              Finalidade
              <select value={form.purpose} onChange={updateFormFromInput("purpose")}>
                {PURPOSE_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label>
              Tipo
              <select value={form.type} onChange={updateFormFromInput("type")}>
                {TYPE_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label>
              Preço pedido
              <input inputMode="decimal" value={form.price} onChange={updateFormFromInput("price")} required placeholder="R$ 650.000" />
            </label>
            <label>
              Cidade
              <input value={form.city} onChange={updateFormFromInput("city")} required />
            </label>
            <label>
              Bairro
              <input value={form.district} onChange={updateFormFromInput("district")} required />
            </label>
            <label className="crm-capture-form__wide">
              Endereço
              <input value={form.address} onChange={updateFormFromInput("address")} />
            </label>
            <label>
              Área útil
              <input inputMode="decimal" value={form.areaM2} onChange={updateFormFromInput("areaM2")} />
            </label>
            <label>
              Terreno
              <input inputMode="decimal" value={form.landAreaM2} onChange={updateFormFromInput("landAreaM2")} />
            </label>
            <label>
              Quartos
              <input inputMode="numeric" value={form.bedrooms} onChange={updateFormFromInput("bedrooms")} />
            </label>
            <label>
              Suítes
              <input inputMode="numeric" value={form.suites} onChange={updateFormFromInput("suites")} />
            </label>
            <label>
              Banheiros
              <input inputMode="numeric" value={form.bathrooms} onChange={updateFormFromInput("bathrooms")} />
            </label>
            <label>
              Vagas
              <input inputMode="numeric" value={form.parkingSpaces} onChange={updateFormFromInput("parkingSpaces")} />
            </label>
            <label>
              Anunciante
              <input value={form.advertiserName} onChange={updateFormFromInput("advertiserName")} />
            </label>
            <label>
              Telefone
              <input value={form.advertiserPhone} onChange={updateFormFromInput("advertiserPhone")} inputMode="tel" />
            </label>
            <label>
              Média do mercado
              <input inputMode="decimal" value={form.marketAvgPrice} onChange={updateFormFromInput("marketAvgPrice")} />
            </label>
            <label className="crm-capture-check">
              <input type="checkbox" checked={form.isPrivateSeller} onChange={updateFormFromInput("isPrivateSeller")} />
              Anúncio particular
            </label>
            <label className="crm-capture-check">
              <input type="checkbox" checked={form.hasFullAddress} onChange={updateFormFromInput("hasFullAddress")} />
              Endereço completo
            </label>
            <label className="crm-capture-form__wide">
              Observações
              <textarea value={form.notes} onChange={updateFormFromInput("notes")} rows={3} />
            </label>
            <div className="crm-capture-form__actions">
              <button type="button" className="button button-ghost" onClick={() => setShowForm(false)} disabled={saving}>
                Cancelar
              </button>
              <button type="submit" className="button button-primary" disabled={saving}>
                {saving ? "Salvando..." : "Salvar oportunidade"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {feedback ? (
        <p className="crm-capture-feedback" data-tone={feedback.tone} role="status">
          {feedback.message}
        </p>
      ) : null}

      <section className="crm-capture-list" aria-label="Oportunidades para captação">
        <div className="crm-capture-toolbar">
          <div>
            <strong>
              {filteredItems.length} de {items.length} oportunidades
            </strong>
            <span>{hasActiveFilters ? "Filtros aplicados" : "Ordenadas por status, score e atualização"}</span>
          </div>
          <Filter size={18} strokeWidth={1.75} aria-hidden="true" />
        </div>

        <form className="crm-capture-filters" onSubmit={(event) => event.preventDefault()}>
          <div className="crm-capture-filters__field crm-capture-filters__field--search">
            <label htmlFor="capture-query">Buscar</label>
            <div className="crm-capture-search">
              <Search size={16} strokeWidth={1.75} aria-hidden="true" />
              <input
                id="capture-query"
                type="search"
                value={filters.query}
                onChange={(event) => updateFilter("query", event.target.value)}
                placeholder="Título, bairro, origem ou contato"
              />
            </div>
          </div>
          <div className="crm-capture-filters__field">
            <label htmlFor="capture-status">Status</label>
            <select id="capture-status" value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
              <option value="">Todos</option>
              {STATUS_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="crm-capture-filters__field">
            <label htmlFor="capture-purpose">Finalidade</label>
            <select id="capture-purpose" value={filters.purpose} onChange={(event) => updateFilter("purpose", event.target.value)}>
              <option value="">Todas</option>
              {PURPOSE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="crm-capture-filters__field">
            <label htmlFor="capture-type">Tipo</label>
            <select id="capture-type" value={filters.type} onChange={(event) => updateFilter("type", event.target.value)}>
              <option value="">Todos</option>
              {TYPE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="crm-capture-filters__field">
            <label htmlFor="capture-location">Cidade/bairro</label>
            <select id="capture-location" value={filters.location} onChange={(event) => updateFilter("location", event.target.value)}>
              <option value="">Todos</option>
              {locationOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="crm-capture-filters__field">
            <label>Preço</label>
            <div className="crm-capture-price-grid">
              <input
                inputMode="decimal"
                value={filters.priceMin}
                onChange={(event) => updateFilter("priceMin", event.target.value)}
                placeholder="Mín."
                aria-label="Preço mínimo"
              />
              <input
                inputMode="decimal"
                value={filters.priceMax}
                onChange={(event) => updateFilter("priceMax", event.target.value)}
                placeholder="Máx."
                aria-label="Preço máximo"
              />
            </div>
          </div>
          <label className="crm-capture-toggle">
            <input
              type="checkbox"
              checked={filters.privateOnly}
              onChange={(event) => updateFilter("privateOnly", event.target.checked)}
            />
            Particular
          </label>
          <label className="crm-capture-toggle">
            <input
              type="checkbox"
              checked={filters.fullAddressOnly}
              onChange={(event) => updateFilter("fullAddressOnly", event.target.checked)}
            />
            Endereço completo
          </label>
          <div className="crm-capture-filters__actions">
            <button type="button" className="button button-ghost" onClick={() => setFilters(EMPTY_FILTERS)} disabled={!hasActiveFilters}>
              <X size={16} strokeWidth={1.75} aria-hidden="true" />
              Limpar
            </button>
          </div>
        </form>

        {filteredItems.length ? (
          <ul className="crm-capture-cards">
            {filteredItems.map((listing) => {
              const specs = buildSpecs(listing);
              const capturedAt = formatDateTime(listing.capturedAt);
              const disabled = pendingId === listing.id || listing.status === "CAPTADO" || listing.status === "DESCARTADO";
              return (
                <li key={listing.id} className="crm-capture-card">
                  <div className="crm-capture-card__score" data-tone={getScoreTone(listing.opportunityScore)}>
                    <span>Score</span>
                    <strong>{listing.opportunityScore}</strong>
                  </div>
                  <div className="crm-capture-card__body">
                    <div className="crm-capture-card__head">
                      <div>
                        <div className="crm-capture-card__badges">
                          <span className="crm-capture-pill" data-tone={getStatusTone(listing.status)}>
                            {STATUS_LABELS[listing.status] ?? listing.status}
                          </span>
                          {listing.isPrivateSeller ? (
                            <span className="crm-capture-pill" data-tone="success">
                              <ShieldCheck size={13} strokeWidth={1.75} aria-hidden="true" />
                              Particular
                            </span>
                          ) : null}
                          {listing.hasFullAddress ? (
                            <span className="crm-capture-pill" data-tone="info">
                              <MapPin size={13} strokeWidth={1.75} aria-hidden="true" />
                              Endereço completo
                            </span>
                          ) : null}
                        </div>
                        <h3>{listing.title}</h3>
                        <p>
                          {TYPE_LABELS[listing.type] ?? listing.type} · {PURPOSE_LABELS[listing.purpose] ?? listing.purpose} ·{" "}
                          {formatAge(listing.adAgeDays)}
                        </p>
                      </div>
                      <strong className="crm-capture-card__price">{formatCurrencyBRL(listing.price)}</strong>
                    </div>

                    <div className="crm-capture-card__grid">
                      <div>
                        <span>Localização</span>
                        <strong>{listing.district}, {listing.city}</strong>
                        <small>{listing.address ?? "Endereço a confirmar"}</small>
                      </div>
                      <div>
                        <span>Características</span>
                        <strong>{specs.length ? specs.join(" · ") : "Sem métricas"}</strong>
                        <small>{listing.sourceName ?? "Origem não informada"}</small>
                      </div>
                      <div>
                        <span>Mercado</span>
                        <strong>
                          {listing.marketOpportunity !== null
                            ? `${listing.marketOpportunity > 0 ? "+" : ""}${formatCurrencyBRL(listing.marketOpportunity)}`
                            : "Sem média"}
                        </strong>
                        <small>
                          {listing.marketAvgPrice !== null ? `Média ${formatCurrencyBRL(listing.marketAvgPrice)}` : "Informe média para calcular oportunidade"}
                        </small>
                      </div>
                      <div>
                        <span>Contato</span>
                        <strong>{listing.advertiserName ?? "Anunciante não informado"}</strong>
                        {listing.advertiserPhone ? (
                          <a href={buildWhatsappLink(listing.advertiserPhone, listing)} target="_blank" rel="noopener noreferrer">
                            <Phone size={13} strokeWidth={1.75} aria-hidden="true" />
                            {listing.advertiserPhone}
                          </a>
                        ) : (
                          <small>Telefone pendente</small>
                        )}
                      </div>
                    </div>

                    {listing.notes || capturedAt ? (
                      <p className="crm-capture-card__notes">
                        {capturedAt ? `Captado em ${capturedAt}. ` : ""}
                        {listing.notes}
                      </p>
                    ) : null}

                    <div className="crm-capture-card__actions">
                      {listing.sourceUrl ? (
                        <a className="button button-ghost" href={listing.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
                          Ver anúncio
                        </a>
                      ) : null}
                      {listing.linkedPropertyId ? (
                        <Link className="button button-ghost" href={`/crm/imoveis/${listing.linkedPropertyId}`}>
                          Abrir imóvel
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={() => captureItem(listing)}
                        disabled={disabled}
                      >
                        <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" />
                        {pendingId === listing.id ? "Captando..." : "Captar"}
                      </button>
                      <button
                        type="button"
                        className="button button-ghost crm-capture-card__discard"
                        onClick={() => discardItem(listing)}
                        disabled={disabled}
                      >
                        <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
                        Descartar
                      </button>
                      <button
                        type="button"
                        className="button button-ghost crm-capture-card__discard"
                        onClick={() => deleteItem(listing)}
                        disabled={pendingId === listing.id}
                      >
                        <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
                        {pendingId === listing.id ? "Excluindo..." : "Excluir"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="crm-capture-empty">
            <p>Nenhuma oportunidade encontrada para os filtros atuais.</p>
            <button type="button" className="button button-ghost" onClick={() => setFilters(EMPTY_FILTERS)}>
              Limpar filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
