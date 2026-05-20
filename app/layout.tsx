import type { Metadata } from "next";
import {
  Bodoni_Moda,
  Cormorant_Garamond,
  DM_Serif_Display,
  Inter,
  Montserrat,
  Playfair_Display,
  Poppins
} from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const titlePrimary = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-title-primary",
  weight: ["500", "600", "700", "800"]
});

const titleSecondary = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-title-secondary",
  weight: ["500", "600", "700"]
});

const titleAlt = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-title-alt",
  weight: ["500", "600", "700"]
});

const titleLuxury = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-title-luxury",
  weight: ["400"]
});

const cardPrimary = Montserrat({
  subsets: ["latin"],
  variable: "--font-card-primary",
  weight: ["400", "500", "600", "700"]
});

const cardSecondary = Inter({
  subsets: ["latin"],
  variable: "--font-card-secondary",
  weight: ["400", "500", "600", "700"]
});

const cardTertiary = Poppins({
  subsets: ["latin"],
  variable: "--font-card-tertiary",
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
      <body
        className={`${titlePrimary.variable} ${titleSecondary.variable} ${titleAlt.variable} ${titleLuxury.variable} ${cardPrimary.variable} ${cardSecondary.variable} ${cardTertiary.variable}`}
      >
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
