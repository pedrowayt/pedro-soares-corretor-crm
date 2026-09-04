import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight, Building2, Home, LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
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
        <aside className="admin-login-brand">
          <Link href="/" className="admin-login-brand-link" aria-label="Voltar para a home Pedro Soares">
            <Image
              src="/brand/logo-home-2026.png"
              alt="Pedro Soares Corretor de Imóveis"
              width={813}
              height={182}
              priority
              className="admin-login-logo"
            />
          </Link>
          <div className="admin-login-brand-copy">
            <p className="admin-login-kicker">Área exclusiva</p>
            <h1>Seu negócio imobiliário, mais perto de cada oportunidade.</h1>
            <p>Entre no CRM para acompanhar leads, imóveis, campanhas e os próximos passos da sua operação.</p>
          </div>
          <div className="admin-login-brand-points" aria-label="Recursos do CRM">
            <span><ShieldCheck size={17} /> Acesso protegido</span>
            <span><Building2 size={17} /> Gestão de oportunidades</span>
          </div>
          <Link href="/" className="admin-login-home-link">
            <Home size={16} /> Voltar para a home <ArrowRight size={15} />
          </Link>
        </aside>

        <div className="admin-login-panel">
          <div className="admin-login-panel-head">
            <span className="admin-login-badge"><LockKeyhole size={14} /> Acesso seguro</span>
            <span className="admin-login-panel-mark">CRM</span>
          </div>
          <h2 className="admin-login-title">Bem-vindo de volta</h2>
          <p className="admin-login-subtitle">Acesse seu painel para continuar sua operação.</p>

          {error && loginErrors[error] ? <p className="admin-login-alert">{loginErrors[error]}</p> : null}
          {logout ? <p className="admin-login-success">Sessão encerrada com segurança.</p> : null}

          <form action={loginAction} className="admin-login-form">
            <input type="hidden" name="next" value={nextPath} />

            <label htmlFor="admin-username">
              E-mail de acesso
              <input
                id="admin-username"
                name="username"
                type="email"
                inputMode="email"
                autoComplete="username"
                placeholder="usuario@dominio.com"
                required
              />
            </label>

            <label htmlFor="admin-password">
              Senha
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Digite sua senha"
                required
              />
            </label>

            <button className="button button-primary admin-login-submit" type="submit">
              <LogIn size={17} /> Entrar no CRM
            </button>
          </form>

          <div className="admin-login-shortcuts">
            <p>Atalhos rápidos</p>
            <div className="admin-login-shortcut-grid">
              <Link href="/" className="admin-login-shortcut">
                <Home size={16} />
                <span><strong>Home pública</strong><small>Ver o site</small></span>
                <ArrowRight size={14} />
              </Link>
              <Link href="/lancamentos" className="admin-login-shortcut">
                <Building2 size={16} />
                <span><strong>Lançamentos</strong><small>Ver campanhas ativas</small></span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <p className="admin-login-security-note"><LockKeyhole size={14} /> Seus dados de acesso são usados somente para entrar no painel.</p>
        </div>
      </div>
    </section>
  );
}
