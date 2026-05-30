import type { Metadata } from "next";
import Link from "next/link";
import { ManageCookiesButton } from "@/components/layout/manage-cookies-button";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();
const LAST_UPDATED = "30 de maio de 2026";

export const metadata: Metadata = {
  title: "Política de Cookies | Pedro Soares Imóveis",
  description:
    "Quais cookies o site Pedro Soares Imóveis utiliza, com que finalidade, e como ajustar seu consentimento a qualquer momento.",
  alternates: { canonical: `${baseUrl}/politica-de-cookies` }
};

type CookieRow = {
  name: string;
  provider: string;
  category: "Essencial" | "Analítico" | "Marketing";
  purpose: string;
  duration: string;
};

const COOKIES: CookieRow[] = [
  {
    name: "ps_cookie_consent",
    provider: "Pedro Soares Imóveis",
    category: "Essencial",
    purpose: "Registra sua escolha no banner de cookies (categorias aceitas).",
    duration: "180 dias"
  },
  {
    name: "ps_crm_session",
    provider: "Pedro Soares Imóveis",
    category: "Essencial",
    purpose: "Sessão de login do CRM (apenas para usuários administradores).",
    duration: "Até 4 horas"
  },
  {
    name: "_ga",
    provider: "Google Analytics 4",
    category: "Analítico",
    purpose: "Distingue visitantes únicos de forma anônima.",
    duration: "13 meses"
  },
  {
    name: "_ga_<container>",
    provider: "Google Analytics 4",
    category: "Analítico",
    purpose: "Persiste estado da sessão e contagem de páginas.",
    duration: "13 meses"
  },
  {
    name: "_gid",
    provider: "Google Analytics",
    category: "Analítico",
    purpose: "Distingue visitantes durante 24 h.",
    duration: "24 horas"
  },
  {
    name: "_gat / _gat_gtag_<id>",
    provider: "Google Analytics",
    category: "Analítico",
    purpose: "Limita a taxa de requisições enviadas ao GA.",
    duration: "1 minuto"
  },
  {
    name: "_gcl_*",
    provider: "Google Tag Manager",
    category: "Marketing",
    purpose: "Mede conversões a partir de campanhas pagas, quando ativas.",
    duration: "90 dias"
  },
  {
    name: "_fbp",
    provider: "Meta Pixel",
    category: "Marketing",
    purpose:
      "Identifica navegadores para mostrar imóveis e lançamentos relevantes em Facebook/Instagram (quando o Pixel está ativo).",
    duration: "90 dias"
  }
];

export default function PoliticaCookiesPage() {
  return (
    <section className="section">
      <div className="container legal-page" style={{ maxWidth: 920 }}>
        <p className="legal-eyebrow">Documento legal</p>
        <h1 className="section-title" style={{ marginTop: 0 }}>
          Política de Cookies
        </h1>
        <p className="legal-meta">Última atualização: {LAST_UPDATED}</p>

        <article className="legal-article">
          <p>
            Esta Política de Cookies complementa a{" "}
            <Link href="/politica-de-privacidade">Política de Privacidade</Link> e descreve os cookies e tecnologias
            similares que utilizamos em <code>{baseUrl}</code>.
          </p>

          <h2>1. O que são cookies</h2>
          <p>
            Cookies são pequenos arquivos de texto que sites colocam no seu navegador para lembrar preferências,
            manter sessões abertas, medir uso e personalizar conteúdo. Existem cookies próprios (definidos por nós) e
            cookies de terceiros (definidos por parceiros como Google e Meta).
          </p>

          <h2>2. Categorias que usamos</h2>
          <ul>
            <li>
              <strong>Essenciais</strong> — necessários para o site funcionar. Sem eles, recursos básicos como sessão
              do CRM ou o próprio registro do seu consentimento não operam. Não exigem autorização.
            </li>
            <li>
              <strong>Analíticos</strong> — Google Analytics 4 e Google Tag Manager. Medimos páginas mais lidas,
              origem do tráfego, tempo de leitura. Os dados são agregados e anonimizados (IP truncado).
            </li>
            <li>
              <strong>Marketing</strong> — quando ativo, Meta Pixel e cookies de remarketing do Google. Permitem
              mostrar imóveis relevantes em redes sociais após a visita. Você pode revogar a qualquer momento.
            </li>
          </ul>

          <h2>3. Lista de cookies</h2>
          <div className="legal-table-wrap">
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Provedor</th>
                  <th>Categoria</th>
                  <th>Finalidade</th>
                  <th>Duração</th>
                </tr>
              </thead>
              <tbody>
                {COOKIES.map((cookie) => (
                  <tr key={cookie.name}>
                    <td>
                      <code>{cookie.name}</code>
                    </td>
                    <td>{cookie.provider}</td>
                    <td>{cookie.category}</td>
                    <td>{cookie.purpose}</td>
                    <td>{cookie.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="legal-note">
            * Cookies de terceiros são definidos diretamente pelos respectivos provedores e seguem suas próprias
            políticas:
            {" "}
            <a
              href="https://policies.google.com/technologies/cookies"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google
            </a>
            {", "}
            <a
              href="https://www.facebook.com/policy/cookies/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meta
            </a>
            .
          </p>

          <h2>4. Modo de Consentimento</h2>
          <p>
            Usamos o <em>Google Consent Mode v2</em>. Até você aceitar, cookies analíticos e de marketing começam
            negados (<code>denied</code>) por padrão. Ao confirmar suas preferências no banner, os scripts são
            atualizados em tempo real — sem precisar recarregar a página.
          </p>

          <h2>5. Como gerenciar suas preferências</h2>
          <p>Você pode alterar seu consentimento a qualquer momento:</p>
          <ul>
            <li>
              Clique em <strong>Gerenciar cookies</strong> abaixo para reabrir o banner.
            </li>
            <li>
              Apague o cookie <code>ps_cookie_consent</code> nas configurações do navegador — na próxima visita o
              banner aparece de novo.
            </li>
            <li>
              No seu navegador, em Configurações → Privacidade, bloqueie cookies de terceiros (afeta GA e Meta Pixel).
            </li>
          </ul>
          <ManageCookiesButton />

          <h2>6. Contato</h2>
          <p>
            Dúvidas sobre cookies ou privacidade?{" "}
            <a href="https://wa.me/5563984845101" target="_blank" rel="noopener noreferrer">
              WhatsApp (63) 98484-5101
            </a>
            {" ou "}
            <a href="mailto:pedro@pedrosoares.com.br">pedro@pedrosoares.com.br</a>.
          </p>
        </article>
      </div>
    </section>
  );
}
