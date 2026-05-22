import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

function isStrongEnough(password: string) {
  return password.length >= 12;
}

function deriveKey(password: string, salt: string, keyLength: number, options: { N: number; r: number; p: number }) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

export async function hashPassword(password: string) {
  if (!isStrongEnough(password)) {
    throw new Error("A senha precisa ter pelo menos 12 caracteres.");
  }

  const salt = randomBytes(16).toString("base64url");
  const derivedKey = await deriveKey(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P
  });

  return `scrypt:v1:${SCRYPT_N}:${SCRYPT_R}:${SCRYPT_P}:${salt}:${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password: string, storedHash: string | null | undefined) {
  if (!storedHash) {
    return false;
  }

  const [algorithm, version, n, r, p, salt, key] = storedHash.split(":");

  if (algorithm !== "scrypt" || version !== "v1" || !n || !r || !p || !salt || !key) {
    return false;
  }

  const storedKey = Buffer.from(key, "base64url");
  const derivedKey = await deriveKey(password, salt, storedKey.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p)
  });

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
}

export function validatePasswordStrength(password: string) {
  return isStrongEnough(password);
}
