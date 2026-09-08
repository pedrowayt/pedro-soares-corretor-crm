"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_STORAGE_KEY = "ps_site_session_id_v1";
const ATTRIBUTION_STORAGE_KEY = "ps_site_visit_attribution_v1";
const CONSENT_COOKIE_NAME = "ps_cookie_consent";
const CONSENT_CHANGE_EVENT = "ps:cookie-consent-changed";

function readAnalyticsConsent() {
  if (typeof document === "undefined") return false;
  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!cookie) return false;

  const value = decodeURIComponent(cookie.split("=")[1] ?? "");
  if (value === "accepted") return true;
  if (value === "rejected") return false;

  try {
    const parsed = JSON.parse(value) as { analytics?: boolean };
    return Boolean(parsed.analytics);
  } catch {
    return false;
  }
}

function getSessionId() {
  try {
    const current = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (current) return current;
    const created = window.crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, created);
    return created;
  } catch {
    return null;
  }
}

function getReferrerOrigin() {
  if (!document.referrer) return undefined;
  try {
    return new URL(document.referrer).origin;
  } catch {
    return undefined;
  }
}

function getSessionAttribution(params: URLSearchParams) {
  const current = {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    content: params.get("utm_content") ?? undefined,
    term: params.get("utm_term") ?? undefined,
    gclid: params.get("gclid") ?? undefined
  };
  const hasCurrentAttribution = Object.values(current).some(Boolean);

  try {
    if (hasCurrentAttribution) {
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(current));
      return current;
    }
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return stored ? { ...current, ...(JSON.parse(stored) as typeof current) } : current;
  } catch {
    return current;
  }
}

export function SiteVisitTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    const track = () => {
      const query = window.location.search.slice(1);
      const trackedPath = `${pathname}${window.location.search}`;
      if (!readAnalyticsConsent() || lastTrackedPath.current === trackedPath) return;
      const sessionId = getSessionId();
      if (!sessionId) return;

      const params = new URLSearchParams(query);
      const attribution = getSessionAttribution(params);
      lastTrackedPath.current = trackedPath;
      void fetch("/api/public/site-visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          path: trackedPath,
          referrer: getReferrerOrigin(),
          ...attribution,
          title: document.title
        }),
        keepalive: true
      }).catch(() => undefined);
    };

    track();
    window.addEventListener(CONSENT_CHANGE_EVENT, track);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, track);
  }, [pathname]);

  return null;
}
