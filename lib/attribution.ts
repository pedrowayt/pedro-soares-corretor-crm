export type AttributionTouch = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  gclid?: string;
  referrer?: string;
  landingPage?: string;
  capturedAt?: string;
};

export type PublicAttribution = {
  firstTouch?: AttributionTouch;
  lastTouch?: AttributionTouch;
};

const ATTRIBUTION_STORAGE_KEY = "ps_first_touch_attribution_v1";
const QUERY_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanTouch(value: unknown): AttributionTouch | undefined {
  if (!isRecord(value)) return undefined;

  const touch: AttributionTouch = {};
  for (const key of ["source", "medium", "campaign", "content", "term", "gclid", "referrer", "landingPage", "capturedAt"] as const) {
    const item = value[key];
    if (typeof item === "string" && item.trim()) touch[key] = item.trim().slice(0, 500);
  }

  return Object.keys(touch).length ? touch : undefined;
}

export function normalizeAttribution(value: unknown): PublicAttribution | undefined {
  if (!isRecord(value)) return undefined;

  const firstTouch = cleanTouch(value.firstTouch);
  const lastTouch = cleanTouch(value.lastTouch);
  if (!firstTouch && !lastTouch) return undefined;

  return { ...(firstTouch ? { firstTouch } : {}), ...(lastTouch ? { lastTouch } : {}) };
}

export function mergeAttribution(existing: unknown, incoming: unknown): PublicAttribution | undefined {
  const current = normalizeAttribution(existing);
  const next = normalizeAttribution(incoming);
  if (!current && !next) return undefined;

  return {
    firstTouch: current?.firstTouch ?? next?.firstTouch,
    lastTouch: next?.lastTouch ?? current?.lastTouch
  };
}

export function attributionEventMetadata(value: unknown): Record<string, string> | undefined {
  const attribution = normalizeAttribution(value);
  if (!attribution) return undefined;

  const metadata: Record<string, string> = {};
  for (const [touchName, touch] of Object.entries(attribution)) {
    if (!touch || typeof touch !== "object") continue;
    for (const [key, item] of Object.entries(touch)) {
      if (typeof item === "string" && item) metadata[`${touchName}_${key}`] = item;
    }
  }
  return Object.keys(metadata).length ? metadata : undefined;
}

function readStoredAttribution(): PublicAttribution | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    return normalizeAttribution(JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? "null"));
  } catch {
    return undefined;
  }
}

function currentTouch(): AttributionTouch {
  const params = new URLSearchParams(window.location.search);
  const touch: AttributionTouch = {
    referrer: document.referrer,
    landingPage: window.location.pathname,
    capturedAt: new Date().toISOString()
  };

  const mapping = {
    utm_source: "source",
    utm_medium: "medium",
    utm_campaign: "campaign",
    utm_content: "content",
    utm_term: "term",
    gclid: "gclid"
  } as const;

  for (const key of QUERY_KEYS) {
    const value = params.get(key);
    if (value) touch[mapping[key]] = value;
  }

  return touch;
}

export function getPublicAttribution(): PublicAttribution | undefined {
  if (typeof window === "undefined") return undefined;

  const current = currentTouch();
  const stored = readStoredAttribution();
  const firstTouch = stored?.firstTouch ?? current;
  const attribution = { firstTouch, lastTouch: current };

  if (!stored?.firstTouch) {
    try {
      window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify({ firstTouch }));
    } catch {
      // Attribution is optional and must never block navigation or conversion.
    }
  }

  return attribution;
}
