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
  const { accountId } = getCloudflareEnv();
  return callCloudflare<{ id: string; uploadURL: string }>(`/accounts/${accountId}/images/v2/direct_upload`, {
    method: "POST",
    body: JSON.stringify(input)
  });
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
