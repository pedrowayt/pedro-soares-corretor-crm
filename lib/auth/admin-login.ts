import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { hashLoginSignal, hasValidCrmSessionSecret } from "@/lib/auth/session-cookie";

const CRM_ROLES = new Set<Role>([Role.ADMIN, Role.CORRETOR, Role.PARCEIRO]);

function positiveNumber(input: string | undefined, fallback: number) {
  const parsed = Number(input);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const LOGIN_WINDOW_MS = positiveNumber(process.env.CRM_LOGIN_RATE_LIMIT_WINDOW_SECONDS, 60 * 15) * 1000;
const MAX_EMAIL_FAILURES = positiveNumber(process.env.CRM_LOGIN_MAX_EMAIL_FAILURES, 5);
const MAX_IP_FAILURES = positiveNumber(process.env.CRM_LOGIN_MAX_IP_FAILURES, 20);

type LoginFailureReason = "config" | "invalid" | "rate_limited";

type LoginResult =
  | {
      ok: true;
      user: {
        id: string;
        email: string;
        name: string;
        role: Role;
      };
    }
  | {
      ok: false;
      reason: LoginFailureReason;
    };

type HeaderReader = {
  get(name: string): string | null;
};

type LoginRequestMetadata = {
  ipHash?: string | null;
  userAgent?: string | null;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getClientIp(headersList: HeaderReader) {
  const forwardedFor =
    headersList.get("x-forwarded-for") ??
    headersList.get("x-real-ip") ??
    headersList.get("x-vercel-forwarded-for") ??
    headersList.get("cf-connecting-ip");

  return forwardedFor?.split(",")[0]?.trim() || null;
}

async function isRateLimited(email: string, ipHash?: string | null) {
  const windowStart = new Date(Date.now() - LOGIN_WINDOW_MS);
  const [emailFailures, ipFailures] = await Promise.all([
    prisma.loginAttempt.count({
      where: {
        email,
        success: false,
        createdAt: { gte: windowStart }
      }
    }),
    ipHash
      ? prisma.loginAttempt.count({
          where: {
            ipHash,
            success: false,
            createdAt: { gte: windowStart }
          }
        })
      : Promise.resolve(0)
  ]);

  return emailFailures >= MAX_EMAIL_FAILURES || ipFailures >= MAX_IP_FAILURES;
}

async function recordLoginAttempt({
  email,
  success,
  reason,
  userId,
  ipHash,
  userAgent
}: LoginRequestMetadata & {
  email: string;
  success: boolean;
  reason?: string;
  userId?: string | null;
}) {
  await prisma.loginAttempt.create({
    data: {
      email,
      success,
      reason,
      userId: userId ?? undefined,
      ipHash: ipHash ?? undefined,
      userAgent: userAgent?.slice(0, 512) ?? undefined
    }
  });
}

export async function getLoginRequestMetadata(headersList: HeaderReader): Promise<LoginRequestMetadata> {
  const ip = getClientIp(headersList);

  return {
    ipHash: ip ? await hashLoginSignal(ip) : null,
    userAgent: headersList.get("user-agent")
  };
}

export async function authenticateCrmAdmin(
  username: string,
  password: string,
  metadata: LoginRequestMetadata
): Promise<LoginResult> {
  const email = normalizeEmail(username);

  if (!email || !password || !hasValidCrmSessionSecret()) {
    return { ok: false, reason: "config" };
  }

  try {
    if (await isRateLimited(email, metadata.ipHash)) {
      await recordLoginAttempt({
        ...metadata,
        email,
        success: false,
        reason: "rate_limited"
      });
      return { ok: false, reason: "rate_limited" };
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    const passwordMatches = await verifyPassword(password, user?.passwordHash);
    const canAccessCrm = Boolean(user?.active && user.role && CRM_ROLES.has(user.role));

    if (!user || !passwordMatches || !canAccessCrm) {
      await recordLoginAttempt({
        ...metadata,
        email,
        success: false,
        reason: "invalid",
        userId: user?.id
      });
      return { ok: false, reason: "invalid" };
    }

    await recordLoginAttempt({
      ...metadata,
      email,
      success: true,
      userId: user.id
    });

    return {
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  } catch {
    return { ok: false, reason: "config" };
  }
}

export function sanitizeCrmNextPath(nextPath: string | null | undefined) {
  if (!nextPath || !nextPath.startsWith("/crm") || nextPath.startsWith("//")) {
    return "/crm/dashboard";
  }

  return nextPath;
}
