/**
 * Canonical site URL used for sitemaps, robots, canonicals, OG and any
 * absolute link generated on the server. Falls back to the production
 * domain so a missing env var never produces an HTML-looking sitemap or
 * cross-domain canonicals.
 */

const DEFAULT_SITE_URL = "https://www.pedrosoarescorretor.com.br";

/** Hostnames that should be 301-redirected to the canonical host. */
export const NON_CANONICAL_HOSTS = new Set<string>([
  "pedro-soares-corretor-crm-production.up.railway.app",
  "pedrosoarescorretor.com.br"
]);

function normalize(value: string): string {
  let url = value.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  // strip trailing slash
  return url.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return DEFAULT_SITE_URL;
  try {
    const url = new URL(normalize(raw));
    if (NON_CANONICAL_HOSTS.has(url.hostname)) {
      return DEFAULT_SITE_URL;
    }
    return normalize(raw);
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function getCanonicalHost(): string {
  return new URL(getSiteUrl()).host;
}
