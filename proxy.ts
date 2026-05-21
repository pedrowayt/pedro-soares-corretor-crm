import { NextRequest, NextResponse } from "next/server";

const CRM_ROLES = new Set(["ADMIN", "CORRETOR", "PARCEIRO"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/imoveis/na-planta" || pathname.startsWith("/imoveis/na-planta/")) {
    const target = new URL("/lancamentos", request.url);
    target.search = request.nextUrl.search;
    return NextResponse.redirect(target, 301);
  }

  if (pathname.startsWith("/crm") || pathname.startsWith("/api/crm")) {
    const roleCookie = request.cookies.get("crm_role")?.value;

    if (process.env.NODE_ENV === "production" && (!roleCookie || !CRM_ROLES.has(roleCookie))) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, error: { message: "Não autorizado" } }, { status: 401 });
      }

      return NextResponse.redirect(new URL("/contato", request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/crm/:path*", "/api/crm/:path*", "/imoveis/na-planta/:path*"]
};
