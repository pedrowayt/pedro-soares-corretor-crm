import crypto from "crypto";

const API_BASE = "https://api.cloudflare.com/client/v4";

type CloudflareResult<T> = {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  messages: Array<{ code: number; message: string }>;
  result: T;
};

function getCloudflareEnv() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !token) {
    throw new Error("Cloudflare env vars ausentes (CLOUDFLARE_ACCOUNT_ID/CLOUDFLARE_API_TOKEN)");
  }

  return { accountId, token };
}

export function getCloudflareImagesDeliveryBaseUrl() {
  const accountHash = process.env.CLOUDFLARE_IMAGES_ACCOUNT_HASH;
  return accountHash ? `https://imagedelivery.net/${accountHash}` : null;
}

export function getCloudflareImagesVariant() {
  return process.env.CLOUDFLARE_IMAGES_VARIANT?.trim() || "public";
}

export function getCloudflareImageDeliveryUrl(imageId: string, variant?: string) {
  const baseUrl = getCloudflareImagesDeliveryBaseUrl();
  const resolvedVariant = variant ?? getCloudflareImagesVariant();
  return baseUrl ? `${baseUrl}/${imageId}/${resolvedVariant}` : null;
}

const IMAGE_DELIVERY_HOSTNAME = "imagedelivery.net";

export function rewriteCloudflareDeliveryUrl(url: string | null | undefined, variant?: string) {
  if (!url) return url ?? null;
  if (!url.includes(IMAGE_DELIVERY_HOSTNAME)) return url;

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== IMAGE_DELIVERY_HOSTNAME) return url;

    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < 2) return url;

    const target = variant ?? getCloudflareImagesVariant();
    const [accountHash, imageId] = segments;
    parsed.pathname = `/${accountHash}/${imageId}/${target}`;
    return parsed.toString();
  } catch {
    return url;
  }
}

async function callCloudflare<T>(path: string, init?: RequestInit): Promise<T> {
  const { token } = getCloudflareEnv();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  const payload = (await response.json()) as CloudflareResult<T>;

  if (!response.ok || !payload.success) {
    const errorMessage = payload.errors?.[0]?.message ?? "Falha ao chamar API Cloudflare";
    throw new Error(errorMessage);
  }

  return payload.result;
}

export async function createImageDirectUpload(input: {
  id?: string;
  creator?: string;
  metadata?: Record<string, unknown>;
  requireSignedURLs?: boolean;
  expiry?: string;
}) {
  const { accountId, token } = getCloudflareEnv();

  const form = new FormData();
  if (input.id) form.append("id", input.id);
  if (input.creator) form.append("creator", input.creator);
  if (input.expiry) form.append("expiry", input.expiry);
  if (typeof input.requireSignedURLs === "boolean") {
    form.append("requireSignedURLs", String(input.requireSignedURLs));
  }
  if (input.metadata) form.append("metadata", JSON.stringify(input.metadata));

  const response = await fetch(`${API_BASE}/accounts/${accountId}/images/v2/direct_upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    cache: "no-store"
  });

  const payload = (await response.json()) as CloudflareResult<{ id: string; uploadURL: string }>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.errors?.[0]?.message ?? "Falha ao gerar upload de imagem.");
  }

  return payload.result;
}

export async function createStreamDirectUpload(input: {
  maxDurationSeconds?: number;
  requireSignedURLs?: boolean;
  allowedOrigins?: string[];
  creator?: string;
  meta?: Record<string, unknown>;
}) {
  const { accountId } = getCloudflareEnv();
  return callCloudflare<{ uid: string; uploadURL: string }>(`/accounts/${accountId}/stream/direct_upload`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function verifyCloudflareWebhookSignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.CLOUDFLARE_WEBHOOK_SECRET;

  if (!secret) return true;
  if (!signatureHeader) return false;

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));
}
