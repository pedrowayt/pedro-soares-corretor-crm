function normalizeText(value: string) {
  return value.trim();
}

function parseMapQueryFromUrl(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    const directQuery =
      parsed.searchParams.get("q") ??
      parsed.searchParams.get("query") ??
      parsed.searchParams.get("destination");

    if (directQuery) return directQuery;

    const placeMatch = parsed.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch?.[1]) {
      return decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    }

    return null;
  } catch {
    return null;
  }
}

function buildQueryFromAddress(input: {
  address?: string | null;
  district?: string | null;
  city?: string | null;
}) {
  const parts = [input.address, input.district, input.city, "TO", "Brasil"]
    .map((item) => (item ? normalizeText(item) : ""))
    .filter(Boolean);

  return parts.length ? parts.join(", ") : null;
}

function isEmbedUrl(value: string) {
  return value.includes("/maps/embed") || value.includes("output=embed");
}

export function buildGoogleMapsEmbedUrl(input: {
  googleMapsUrl?: string | null;
  latitude?: unknown;
  longitude?: unknown;
  address?: string | null;
  district?: string | null;
  city?: string | null;
}) {
  const rawUrl = input.googleMapsUrl?.trim();

  if (rawUrl && isEmbedUrl(rawUrl)) {
    return rawUrl;
  }

  if (rawUrl) {
    const queryFromUrl = parseMapQueryFromUrl(rawUrl);
    const query = queryFromUrl || rawUrl;
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  }

  const lat = input.latitude !== null && input.latitude !== undefined ? Number(input.latitude) : null;
  const lng = input.longitude !== null && input.longitude !== undefined ? Number(input.longitude) : null;

  if (lat !== null && lng !== null && Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
  }

  const addressQuery = buildQueryFromAddress({
    address: input.address,
    district: input.district,
    city: input.city
  });

  if (addressQuery) {
    return `https://www.google.com/maps?q=${encodeURIComponent(addressQuery)}&output=embed`;
  }

  return null;
}

export function buildGoogleMapsOpenUrl(input: {
  googleMapsUrl?: string | null;
  latitude?: unknown;
  longitude?: unknown;
  address?: string | null;
  district?: string | null;
  city?: string | null;
}) {
  const rawUrl = input.googleMapsUrl?.trim();

  if (rawUrl) return rawUrl;

  const lat = input.latitude !== null && input.latitude !== undefined ? Number(input.latitude) : null;
  const lng = input.longitude !== null && input.longitude !== undefined ? Number(input.longitude) : null;

  if (lat !== null && lng !== null && Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  const addressQuery = buildQueryFromAddress({
    address: input.address,
    district: input.district,
    city: input.city
  });

  if (addressQuery) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`;
  }

  return null;
}
