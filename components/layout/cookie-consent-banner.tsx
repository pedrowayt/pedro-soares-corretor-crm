"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ConsentChoice = "accepted" | "rejected";

const CONSENT_STORAGE_KEY = "ps_cookie_consent_v1";
const CONSENT_COOKIE_NAME = "ps_cookie_consent";
const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const OPEN_EVENT_NAME = "ps:open-cookie-consent";

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

function persistConsent(choice: ConsentChoice) {
  const payload = JSON.stringify({
    choice,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString()
  });
  localStorage.setItem(CONSENT_STORAGE_KEY, payload);
  document.cookie = `${CONSENT_COOKIE_NAME}=${choice}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    const localValue = localStorage.getItem(CONSENT_STORAGE_KEY);
    const cookieValue = readCookieConsent();
    return !localValue && !cookieValue;
  });

  useEffect(() => {
    const openBanner = () => setIsVisible(true);
    window.addEventListener(OPEN_EVENT_NAME, openBanner);
    return () => window.removeEventListener(OPEN_EVENT_NAME, openBanner);
  }, []);

  const bannerClassName = useMemo(
    () => `cookie-consent-banner ${isVisible ? "open" : ""}`,
    [isVisible]
  );

  const handleChoice = (choice: ConsentChoice) => {
    persistConsent(choice);
    setIsVisible(false);
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
