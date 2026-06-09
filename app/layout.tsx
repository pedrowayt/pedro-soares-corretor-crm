import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CookieConsentBanner } from "@/components/layout/cookie-consent-banner";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const titlePrimary = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-title",
  weight: ["500", "600", "700"]
});

const cardPrimary = Montserrat({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "500", "600"]
});

const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  "7S3pLS6MEUO9a-P5HX9Y9MxJpn34iGNktsGfZuHC9KA";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Pedro Soares | Imóveis e Oportunidades",
  description:
    "Plataforma imobiliária com foco em captação, qualificação e fechamento de oportunidades em Palmas/TO.",
  keywords: ["imóveis", "Palmas", "corretor", "investidor", "leilão"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: baseUrl,
    title: "Pedro Soares | Imóveis e Oportunidades",
    description:
      "Plataforma imobiliária com foco em captação, qualificação e fechamento de oportunidades em Palmas/TO."
  },
  verification: GOOGLE_SITE_VERIFICATION
    ? { google: GOOGLE_SITE_VERIFICATION }
    : undefined
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Consent Mode v2 — default everything to denied (LGPD-friendly).
            The cookie banner updates these grants when the visitor consents. We
            also hydrate from the persisted consent cookie BEFORE the GA / GTM
            loader runs so a returning visitor with consent already given does
            not lose a page view on first paint. */}
        {GA_ID || GTM_ID || META_PIXEL_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted'});try{var c=document.cookie.split(';').map(function(s){return s.trim();}).find(function(s){return s.indexOf('ps_cookie_consent=')===0;});if(c){var v=decodeURIComponent(c.split('=')[1]||'');var p=v.indexOf('{')===0?JSON.parse(v):null;var analytics=p?!!p.analytics:v==='accepted';var marketing=p?!!p.marketing:v==='accepted';gtag('consent','update',{ad_storage:marketing?'granted':'denied',ad_user_data:marketing?'granted':'denied',ad_personalization:marketing?'granted':'denied',analytics_storage:analytics?'granted':'denied'});}}catch(e){}`
            }}
          />
        ) : null}
        {GA_ID ? (
          <>
            {/* Google tag (gtag.js) — rendered as plain <script> so it lands
                literally inside <head> in the SSR HTML, which is what Google
                Search Console / Analytics verification scrapes. */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `gtag('js', new Date());gtag('config', '${GA_ID}', { anonymize_ip: true });`
              }}
            />
          </>
        ) : null}
        {GTM_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`
            }}
          />
        ) : null}
        {META_PIXEL_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('consent','revoke');try{var c=document.cookie.split(';').map(function(s){return s.trim();}).find(function(s){return s.indexOf('ps_cookie_consent=')===0;});var v=c?decodeURIComponent(c.split('=')[1]||''):'';var p=v.indexOf('{')===0?JSON.parse(v):null;var mk=p?!!p.marketing:v==='accepted';if(mk){fbq('consent','grant');}}catch(e){}fbq('init', '${META_PIXEL_ID}');fbq('track', 'PageView');`
            }}
          />
        ) : null}
      </head>
      <body className={`${titlePrimary.variable} ${cardPrimary.variable}`}>
        {GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
