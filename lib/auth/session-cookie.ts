export const CRM_SESSION_COOKIE = "crm_session";

const DEV_SESSION_SECRET = "development-only-crm-session-secret-change-before-production";

function getSessionSecret() {
  const secret = process.env.CRM_SESSION_SECRET ?? process.env.AUTH_SECRET;

  if (secret && secret.length >= 32) {
    return secret;
  }

  if (process.env.NODE_ENV !== "production") {
    return DEV_SESSION_SECRET;
  }

  return null;
}

function encodeBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeStringEquals(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

async function hmacSha256(value: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return encodeBase64Url(new Uint8Array(signature));
}

export function hasValidCrmSessionSecret() {
  return Boolean(getSessionSecret());
}

export async function signSessionToken(token: string) {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("CRM_SESSION_SECRET precisa ter pelo menos 32 caracteres em produção.");
  }

  const signature = await hmacSha256(token, secret);
  return `${token}.${signature}`;
}

export async function verifySessionCookie(value: string | null | undefined) {
  const secret = getSessionSecret();

  if (!secret || !value) {
    return null;
  }

  const separatorIndex = value.lastIndexOf(".");
  if (separatorIndex <= 0) {
    return null;
  }

  const token = value.slice(0, separatorIndex);
  const signature = value.slice(separatorIndex + 1);
  const expectedSignature = await hmacSha256(token, secret);

  return safeStringEquals(signature, expectedSignature) ? token : null;
}

export async function hashSessionToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return toHex(new Uint8Array(digest));
}

export async function hashLoginSignal(value: string) {
  const secret = getSessionSecret() ?? DEV_SESSION_SECRET;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${secret}:${value}`));
  return toHex(new Uint8Array(digest));
}
