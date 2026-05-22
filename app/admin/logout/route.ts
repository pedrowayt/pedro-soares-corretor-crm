import { NextRequest, NextResponse } from "next/server";
import { revokeCrmSession } from "@/lib/auth/session";
import { CRM_SESSION_COOKIE } from "@/lib/auth/session-cookie";

const expiredCookie = {
  httpOnly: true,
  maxAge: 0,
  path: "/",
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production"
};

export async function GET(request: NextRequest) {
  await revokeCrmSession(request.cookies.get(CRM_SESSION_COOKIE)?.value);

  const response = NextResponse.redirect(new URL("/admin/login?logout=1", request.url));
  response.cookies.set(CRM_SESSION_COOKIE, "", expiredCookie);

  return response;
}
