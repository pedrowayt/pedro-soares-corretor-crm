import { Role } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  CRM_SESSION_COOKIE,
  hashSessionToken,
  signSessionToken,
  verifySessionCookie
} from "@/lib/auth/session-cookie";

export type AppSession = {
  userId: string;
  sessionId: string;
  email: string;
  name: string;
  role: Role;
};

function getSessionTtlSeconds() {
  const parsed = Number(process.env.CRM_SESSION_TTL_SECONDS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60 * 60 * 4;
}

const SESSION_TTL_SECONDS = getSessionTtlSeconds();
const LAST_SEEN_UPDATE_MS = 1000 * 60 * 5;

export async function getSession(): Promise<AppSession | null> {
  const cookieStore = await cookies();
  const token = await verifySessionCookie(cookieStore.get(CRM_SESSION_COOKIE)?.value);

  if (!token) {
    return null;
  }

  const tokenHash = await hashSessionToken(token);
  const session = await prisma.crmSession.findUnique({
    where: { tokenHash },
    include: {
      user: true
    }
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date() || !session.user.active) {
    return null;
  }

  if (!session.lastSeenAt || Date.now() - session.lastSeenAt.getTime() > LAST_SEEN_UPDATE_MS) {
    void prisma.crmSession
      .update({
        where: { id: session.id },
        data: { lastSeenAt: new Date() }
      })
      .catch(() => null);
  }

  return {
    userId: session.user.id,
    sessionId: session.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role
  };
}

export function hasAnyRole(session: AppSession | null, roles: Role[]) {
  if (!session) return false;
  return roles.includes(session.role);
}

export function getCrmSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production"
  };
}

export async function createCrmSession({
  userId,
  ipHash,
  userAgent
}: {
  userId: string;
  ipHash?: string | null;
  userAgent?: string | null;
}) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = await hashSessionToken(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000);

  await prisma.$transaction([
    prisma.crmSession.updateMany({
      where: {
        userId,
        revokedAt: null
      },
      data: {
        revokedAt: now
      }
    }),
    prisma.crmSession.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
        lastSeenAt: now,
        ipHash: ipHash ?? undefined,
        userAgent: userAgent?.slice(0, 512) ?? undefined
      }
    })
  ]);

  return signSessionToken(token);
}

export async function revokeCrmSession(signedCookie: string | null | undefined) {
  const token = await verifySessionCookie(signedCookie);

  if (!token) {
    return;
  }

  await prisma.crmSession
    .update({
      where: {
        tokenHash: await hashSessionToken(token)
      },
      data: {
        revokedAt: new Date()
      }
    })
    .catch(() => null);
}
