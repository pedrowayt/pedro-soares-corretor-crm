import { NextRequest, NextResponse } from "next/server";
import { CRM_SESSION_COOKIE, verifySessionCookie } from "@/lib/auth/session-cookie";

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/imoveis/na-planta" || pathname.startsWith("/imoveis/na-planta/")) {
    const target = new URL("/lancamentos", request.url);
    target.search = request.nextUrl.search;
    return withSecurityHeaders(NextResponse.redirect(target, 301));
  }

  if (pathname.startsWith("/crm") || pathname.startsWith("/api/crm")) {
    const sessionToken = await verifySessionCookie(request.cookies.get(CRM_SESSION_COOKIE)?.value);

    if (!sessionToken) {
      if (pathname.startsWith("/api/")) {
        return withSecurityHeaders(
          NextResponse.json({ success: false, error: { message: "Não autorizado" } }, { status: 401 })
        );
      }

      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      return withSecurityHeaders(NextResponse.redirect(loginUrl));
    }

    return withSecurityHeaders(NextResponse.next());
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/crm/:path*", "/api/crm/:path*", "/imoveis/na-planta/:path*"]
};
