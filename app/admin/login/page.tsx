import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, LayoutDashboard, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
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
        <div className="admin-login-copy">
          <span className="admin-login-kicker">
            <ShieldCheck size={16} aria-hidden />
            Área administrativa
          </span>
          <h1>Entrar no CRM</h1>
          <p>
            Acesse leads, imóveis, propostas e tarefas comerciais em um ambiente reservado para a operação interna.
          </p>

          <div className="admin-login-highlights" aria-label="Módulos do CRM">
            <span>Leads</span>
            <span>Funil</span>
            <span>Imóveis</span>
            <span>Relatórios</span>
          </div>
        </div>

        <div className="admin-login-panel">
          <div className="admin-login-panel-head">
            <LayoutDashboard size={22} aria-hidden />
            <div>
              <p>Pedro Soares CRM</p>
              <strong>Acesso seguro</strong>
            </div>
          </div>

          {error && loginErrors[error] ? <p className="admin-login-alert">{loginErrors[error]}</p> : null}
          {logout ? <p className="admin-login-success">Sessão encerrada com segurança.</p> : null}

          <form action={loginAction} className="admin-login-form">
            <input type="hidden" name="next" value={nextPath} />

            <label htmlFor="admin-username">Usuário</label>
            <div className="admin-login-field">
              <UserRound size={18} aria-hidden />
              <input
                id="admin-username"
                name="username"
                type="email"
                inputMode="email"
                autoComplete="username"
                placeholder="usuario@dominio.com"
                required
              />
            </div>

            <label htmlFor="admin-password">Senha</label>
            <div className="admin-login-field">
              <LockKeyhole size={18} aria-hidden />
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button className="button button-primary admin-login-submit" type="submit">
              Entrar no CRM
              <ArrowRight size={18} aria-hidden />
            </button>
          </form>

          <p className="admin-login-note">
            O acesso usa usuário cadastrado no banco, senha criptografada e sessão com expiração curta.
          </p>
        </div>
      </div>
    </section>
  );
}
