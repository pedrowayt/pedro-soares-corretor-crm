import { NextRequest, NextResponse } from "next/server";
import { revokeCrmSession } from "@/lib/auth/session";
import { CRM_SESSION_COOKIE } from "@/lib/auth/session-cookie";
import { getSiteUrl } from "@/lib/site-url";

const expiredCookie = {
  httpOnly: true,
  maxAge: 0,
  path: "/",
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production"
};

export async function GET() {
  return NextResponse.redirect(new URL("/admin/login", getSiteUrl()));
}

export async function POST(request: NextRequest) {
  await revokeCrmSession(request.cookies.get(CRM_SESSION_COOKIE)?.value);

  const response = NextResponse.redirect(new URL("/admin/login?logout=1", getSiteUrl()), 303);
  response.cookies.set(CRM_SESSION_COOKIE, "", expiredCookie);

  return response;
}
