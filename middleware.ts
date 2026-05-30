import { NextRequest, NextResponse } from "next/server";
import { CRM_SESSION_COOKIE, verifySessionCookie } from "@/lib/auth/session-cookie";
import { NON_CANONICAL_HOSTS, getCanonicalHost } from "@/lib/site-url";

const CANONICAL_HOST = getCanonicalHost();

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

function canonicalRedirect(request: NextRequest): NextResponse | null {
  // Prefer the X-Forwarded-Host header (Railway sets this to the public host),
  // falling back to Host.
  const host = (
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    ""
  )
    .split(",")[0]
    .trim()
    .toLowerCase();

  if (!host || host === CANONICAL_HOST) return null;
  if (!NON_CANONICAL_HOSTS.has(host)) return null;

  const target = new URL(request.nextUrl);
  target.protocol = "https:";
  target.host = CANONICAL_HOST;
  target.port = "";
  return NextResponse.redirect(target.toString(), 308);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const canonical = canonicalRedirect(request);
  if (canonical) return canonical;

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
  // Run on every page request (including sitemap.xml and robots.txt) so the
  // canonical host redirect can fire — exclude static assets and internal
  // Next.js routes to keep things fast.
  matcher: [
    "/((?!_next/|favicon\\.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)"
  ]
};
