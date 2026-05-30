"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

type ConsentCategories = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = {
  version: number;
  updatedAt: string;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_STORAGE_KEY = "ps_cookie_consent_v2";
const CONSENT_COOKIE_NAME = "ps_cookie_consent";
const CONSENT_VERSION = 2;
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const OPEN_EVENT_NAME = "ps:open-cookie-consent";
const CHANGE_EVENT_NAME = "ps:cookie-consent-changed";

let isForcedOpen = false;

function readStored(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing)
    };
  } catch {
    return null;
  }
}

function readStoredFromCookie(): StoredConsent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!raw) return null;
  const value = decodeURIComponent(raw.split("=")[1] ?? "");
  if (!value) return null;
  try {
    if (value.startsWith("{")) {
      const parsed = JSON.parse(value) as Partial<StoredConsent>;
      return {
        version: CONSENT_VERSION,
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing)
      };
    }
  } catch {
    // ignore
  }
  // Legacy v1: "accepted" | "rejected"
  return {
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
    analytics: value === "accepted",
    marketing: value === "accepted"
  };
}

function hasStoredConsent() {
  return Boolean(readStored() || readStoredFromCookie());
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return isForcedOpen || !hasStoredConsent();
}

function getServerSnapshot() {
  return false;
}

function subscribe(callback: () => void) {
  const openBanner = () => {
    isForcedOpen = true;
    callback();
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) callback();
  };
  window.addEventListener(OPEN_EVENT_NAME, openBanner);
  window.addEventListener(CHANGE_EVENT_NAME, callback);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(OPEN_EVENT_NAME, openBanner);
    window.removeEventListener(CHANGE_EVENT_NAME, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function persist(consent: ConsentCategories) {
  const payload: StoredConsent = {
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
    analytics: consent.analytics,
    marketing: consent.marketing
  };

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore — cookie below is the durable copy
  }

  // Cookie holds JSON so the SSR <head> consent-mode bootstrap can read it
  // before any third-party script runs.
  const cookieValue = encodeURIComponent(JSON.stringify(payload));
  document.cookie = `${CONSENT_COOKIE_NAME}=${cookieValue}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

function updateGtagConsent(consent: ConsentCategories) {
  if (typeof window === "undefined") return;
  type GtagFn = (command: string, ...args: unknown[]) => void;
  const w = window as unknown as { gtag?: GtagFn; dataLayer?: unknown[]; fbq?: (action: string, eventName: string) => void };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", {
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
      analytics_storage: consent.analytics ? "granted" : "denied"
    });
  }
  if (typeof w.fbq === "function") {
    if (consent.marketing) w.fbq("consent", "grant");
    else w.fbq("consent", "revoke");
  }
}

export function CookieConsentBanner() {
  const isVisible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  function commit(consent: ConsentCategories) {
    persist(consent);
    updateGtagConsent(consent);
    isForcedOpen = false;
    setShowDetails(false);
    window.dispatchEvent(new Event(CHANGE_EVENT_NAME));
  }

  function acceptAll() {
    setAnalytics(true);
    setMarketing(true);
    commit({ essential: true, analytics: true, marketing: true });
  }

  function rejectOptional() {
    setAnalytics(false);
    setMarketing(false);
    commit({ essential: true, analytics: false, marketing: false });
  }

  function saveCustom() {
    commit({ essential: true, analytics, marketing });
  }

  const bannerClassName = `cookie-consent-banner ${isVisible ? "open" : ""}${showDetails ? " expanded" : ""}`;

  return (
    <aside
      className={bannerClassName}
      aria-live="polite"
      aria-label="Consentimento de cookies"
      role="dialog"
    >
      <div className="cookie-consent-content">
        <p className="cookie-consent-title">Sua privacidade importa</p>
        <p className="cookie-consent-text">
          Usamos cookies essenciais para o site funcionar e cookies opcionais (analíticos e de marketing)
          para entender o que ajuda você a encontrar o imóvel certo. Você decide o que aceitar.
        </p>
        <p className="cookie-consent-link-wrap">
          <Link href="/politica-de-cookies">Política de cookies</Link>
          <span aria-hidden="true"> · </span>
          <Link href="/politica-de-privacidade">Política de privacidade</Link>
        </p>

        {showDetails ? (
          <div className="cookie-consent-categories" role="group" aria-label="Categorias de cookies">
            <label className="cookie-consent-category cookie-consent-category-locked">
              <span className="cookie-consent-category-head">
                <input type="checkbox" checked readOnly disabled />
                <strong>Essenciais</strong>
                <em>Sempre ativos</em>
              </span>
              <span className="cookie-consent-category-text">
                Sessão de CRM, segurança e o próprio registro de consentimento. Sem eles o site não funciona.
              </span>
            </label>
            <label className="cookie-consent-category">
              <span className="cookie-consent-category-head">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                />
                <strong>Analíticos</strong>
              </span>
              <span className="cookie-consent-category-text">
                Google Analytics 4 e Google Tag Manager — métricas anônimas de páginas mais lidas,
                origem do tráfego e tempo de leitura. Nada disso te identifica pessoalmente.
              </span>
            </label>
            <label className="cookie-consent-category">
              <span className="cookie-consent-category-head">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                />
                <strong>Marketing</strong>
              </span>
              <span className="cookie-consent-category-text">
                Meta Pixel e cookies de remarketing para mostrar imóveis relevantes em redes sociais
                após você visitar o site. Você pode revogar a qualquer momento.
              </span>
            </label>
          </div>
        ) : null}
      </div>

      <div className="cookie-consent-actions">
        {showDetails ? (
          <>
            <button
              type="button"
              className="cookie-consent-button cookie-consent-button-ghost"
              onClick={() => setShowDetails(false)}
            >
              Voltar
            </button>
            <button
              type="button"
              className="cookie-consent-button cookie-consent-button-primary"
              onClick={saveCustom}
            >
              Salvar preferências
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="cookie-consent-button cookie-consent-button-ghost"
              onClick={() => setShowDetails(true)}
            >
              Personalizar
            </button>
            <button
              type="button"
              className="cookie-consent-button cookie-consent-button-ghost"
              onClick={rejectOptional}
            >
              Recusar opcionais
            </button>
            <button
              type="button"
              className="cookie-consent-button cookie-consent-button-primary"
              onClick={acceptAll}
            >
              Aceitar tudo
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

export function dispatchOpenCookieConsent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_EVENT_NAME));
}
