"use client";

import { dispatchOpenCookieConsent } from "@/components/layout/cookie-consent-banner";

export function ManageCookiesButton() {
  return (
    <button
      type="button"
      className="button button-ghost"
      onClick={() => dispatchOpenCookieConsent()}
    >
      Gerenciar cookies
    </button>
  );
}
