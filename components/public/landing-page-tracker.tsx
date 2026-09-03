"use client";

import { useEffect } from "react";

type Props = {
  landingPageSlug: string;
};

export function LandingPageTracker({ landingPageSlug }: Props) {
  useEffect(() => {
    const storageKey = `landing-page-session:${landingPageSlug}`;
    const viewKey = `${storageKey}:viewed`;
    if (window.sessionStorage.getItem(viewKey)) return;

    let sessionId = window.sessionStorage.getItem(storageKey);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      window.sessionStorage.setItem(storageKey, sessionId);
    }
    window.sessionStorage.setItem(viewKey, "1");

    const entryPoint = new URLSearchParams(window.location.search).get("entrada");

    void fetch("/api/public/landing-page-events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        landingPageSlug,
        sourcePage: window.location.pathname,
        type: "PAGE_VIEW",
        sessionId,
        ...(entryPoint ? { metadata: { entryPoint } } : {})
      }),
      keepalive: true
    }).catch(() => undefined);
  }, [landingPageSlug]);

  return null;
}
