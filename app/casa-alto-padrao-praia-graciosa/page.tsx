import type { Metadata } from "next";
import { CasaAltoPadraoLanding } from "./casa-alto-padrao-landing";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();
const canonicalPath = "/casa-alto-padrao-praia-graciosa";

export const metadata: Metadata = {
  title: "Casa nova de alto padrão próxima à Praia da Graciosa | Palmas/TO",
  description:
    "Casa nova de alto padrão próxima à Orla da Praia da Graciosa, em Palmas/TO, com 4 suítes, escritório, piscina, energia solar, automação e 192,68 m² construídos.",
  alternates: { canonical: `${baseUrl}${canonicalPath}` },
  keywords: [
    "casa de alto padrão em Palmas",
    "casa próxima à Praia da Graciosa",
    "casa à venda em Palmas",
    "casa com piscina em Palmas",
    "imóveis de alto padrão em Palmas"
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}${canonicalPath}`,
    title: "Casa nova de alto padrão próxima à Praia da Graciosa",
    description:
      "Residência moderna com 4 suítes, escritório, piscina, energia solar, automação e acabamentos premium em Palmas/TO.",
    images: [
      {
        url: `${baseUrl}/brand/casa-alto-padrao-praia-graciosa/foto-01.jpg`,
        width: 960,
        height: 1280,
        alt: "Fachada da casa nova de alto padrão próxima à Praia da Graciosa"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa nova de alto padrão próxima à Praia da Graciosa",
    description:
      "4 suítes, escritório, piscina, energia solar, automação e acabamentos premium em Palmas/TO.",
    images: [`${baseUrl}/brand/casa-alto-padrao-praia-graciosa/foto-01.jpg`]
  }
};

export default function CasaAltoPadraoPraiaGraciosaPage() {
  return <CasaAltoPadraoLanding />;
}
