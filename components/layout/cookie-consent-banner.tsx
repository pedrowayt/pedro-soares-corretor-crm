"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

type ConsentChoice = "accepted" | "rejected";

const CONSENT_STORAGE_KEY = "ps_cookie_consent_v1";
const CONSENT_COOKIE_NAME = "ps_cookie_consent";
const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const OPEN_EVENT_NAME = "ps:open-cookie-consent";
const CHANGE_EVENT_NAME = "ps:cookie-consent-changed";

let isForcedOpen = false;

function isConsentChoice(value: unknown): value is ConsentChoice {
  return value === "accepted" || value === "rejected";
}

function readCookieConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!cookie) return null;
  const value = cookie.split("=")[1];
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

function readLocalConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;

  try {
    const storedValue = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!storedValue) return null;

    const parsed = JSON.parse(storedValue) as { choice?: unknown; version?: unknown };
    if (parsed.version === CONSENT_VERSION && isConsentChoice(parsed.choice)) {
      return parsed.choice;
    }
  } catch {
    return null;
  }

  return null;
}

function hasStoredConsent() {
  return Boolean(readLocalConsent() || readCookieConsent());
}

function getConsentSnapshot() {
  if (typeof window === "undefined") return false;
  return isForcedOpen || !hasStoredConsent();
}

function getServerConsentSnapshot() {
  return false;
}

function subscribeToConsentChanges(callback: () => void) {
  const openBanner = () => {
    isForcedOpen = true;
    callback();
  };

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) callback();
  };

  window.addEventListener(OPEN_EVENT_NAME, openBanner);
  window.addEventListener(CHANGE_EVENT_NAME, callback);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener(OPEN_EVENT_NAME, openBanner);
    window.removeEventListener(CHANGE_EVENT_NAME, callback);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function persistConsent(choice: ConsentChoice) {
  const payload = JSON.stringify({
    choice,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString()
  });

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, payload);
  } catch {
    // The consent cookie is enough when storage is blocked or unavailable.
  }

  document.cookie = `${CONSENT_COOKIE_NAME}=${choice}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

export function CookieConsentBanner() {
  const isVisible = useSyncExternalStore(
    subscribeToConsentChanges,
    getConsentSnapshot,
    getServerConsentSnapshot
  );
  const bannerClassName = `cookie-consent-banner ${isVisible ? "open" : ""}`;

  const handleChoice = (choice: ConsentChoice) => {
    persistConsent(choice);
    isForcedOpen = false;
    window.dispatchEvent(new Event(CHANGE_EVENT_NAME));
  };

  return (
    <aside className={bannerClassName} aria-live="polite" aria-label="Consentimento de cookies">
      <div className="cookie-consent-content">
        <p className="cookie-consent-title">Política de Cookies</p>
        <p className="cookie-consent-text">
          Usamos cookies essenciais para funcionamento do site e cookies opcionais para métricas e melhoria da experiência.
        </p>
        <p className="cookie-consent-link-wrap">
          <Link href="/politica-de-cookies">Ler política completa</Link>
        </p>
      </div>
      <div className="cookie-consent-actions">
        <button type="button" className="cookie-consent-button cookie-consent-button-ghost" onClick={() => handleChoice("rejected")}>
          Recusar opcionais
        </button>
        <button type="button" className="cookie-consent-button cookie-consent-button-primary" onClick={() => handleChoice("accepted")}>
          Aceitar cookies
        </button>
      </div>
    </aside>
  );
}

export function dispatchOpenCookieConsent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_EVENT_NAME));
}
