"use client";

import { dispatchOpenCookieConsent } from "@/components/layout/cookie-consent-banner";

export function OpenCookieSettingsButton() {
  return (
    <button type="button" className="site-footer-cookie-action" onClick={dispatchOpenCookieConsent}>
      Preferências de Cookies
    </button>
  );
}
