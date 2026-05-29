"use client";

import { useEffect } from "react";

type Props = {
  slug: string;
};

export function BlogViewTracker({ slug }: Props) {
  useEffect(() => {
    if (!slug) return;
    const key = `blog-view-${slug}`;
    try {
      const last = sessionStorage.getItem(key);
      if (last) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage may be unavailable; still fire the request
    }

    const url = `/api/blog/${encodeURIComponent(slug)}/view`;
    try {
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([JSON.stringify({})], { type: "application/json" });
        navigator.sendBeacon(url, blob);
        return;
      }
    } catch {
      // fall through to fetch
    }

    fetch(url, { method: "POST", keepalive: true }).catch(() => undefined);
  }, [slug]);

  return null;
}
