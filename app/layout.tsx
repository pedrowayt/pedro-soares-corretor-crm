import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CookieConsentBanner } from "@/components/layout/cookie-consent-banner";
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

export const metadata: Metadata = {
  title: "Pedro Soares | Imóveis e Oportunidades",
  description:
    "Plataforma imobiliária com foco em captação, qualificação e fechamento de oportunidades em Palmas/TO.",
  keywords: ["imóveis", "Palmas", "corretor", "investidor", "leilão"]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${titlePrimary.variable} ${cardPrimary.variable}`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
