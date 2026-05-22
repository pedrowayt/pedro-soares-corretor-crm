import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  authenticateCrmAdmin,
  getLoginRequestMetadata,
  sanitizeCrmNextPath
} from "@/lib/auth/admin-login";
import { createCrmSession, getCrmSessionCookieOptions } from "@/lib/auth/session";
import { CRM_SESSION_COOKIE } from "@/lib/auth/session-cookie";

export const metadata: Metadata = {
  title: "Área admin | Pedro Soares CRM",
  description: "Login administrativo para acesso ao CRM Pedro Soares."
};

const loginErrors: Record<string, string> = {
  config: "Autenticação indisponível. Verifique banco, senha do usuário e CRM_SESSION_SECRET.",
  invalid: "Usuário ou senha inválidos.",
  rate_limited: "Muitas tentativas. Aguarde alguns minutos e tente novamente."
};

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

async function loginAction(formData: FormData) {
  "use server";

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeCrmNextPath(String(formData.get("next") ?? "/crm/dashboard"));
  const metadata = await getLoginRequestMetadata(await headers());
  const result = await authenticateCrmAdmin(username, password, metadata);

  if (!result.ok) {
    redirect(`/admin/login?error=${result.reason}&next=${encodeURIComponent(nextPath)}`);
  }

  const signedSession = await createCrmSession({
    userId: result.user.id,
    ipHash: metadata.ipHash,
    userAgent: metadata.userAgent
  });
  const cookieStore = await cookies();
  cookieStore.set(CRM_SESSION_COOKIE, signedSession, getCrmSessionCookieOptions());

  redirect(nextPath);
}

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextPath = sanitizeCrmNextPath(getParam(params, "next"));
  const error = getParam(params, "error");
  const logout = getParam(params, "logout");

  return (
    <section className="admin-login-page">
      <div className="container admin-login-shell">
        <div className="admin-login-panel">
          <h1 className="admin-login-title">Login CRM</h1>

          {error && loginErrors[error] ? <p className="admin-login-alert">{loginErrors[error]}</p> : null}
          {logout ? <p className="admin-login-success">Sessão encerrada com segurança.</p> : null}

          <form action={loginAction} className="admin-login-form">
            <input type="hidden" name="next" value={nextPath} />

            <label htmlFor="admin-username">Login</label>
            <input
              id="admin-username"
              name="username"
              type="email"
              inputMode="email"
              autoComplete="username"
              placeholder="usuario@dominio.com"
              required
            />

            <label htmlFor="admin-password">Senha</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              required
            />

            <button className="button button-primary admin-login-submit" type="submit">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
