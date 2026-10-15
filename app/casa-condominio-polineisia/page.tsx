import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { PolinesiaLanding } from "./polineisia-landing";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Casa Nova no Condomínio Polinésia | Palmas/TO",
  description:
    "Casa nova de alto padrão no Condomínio Polinésia, em Palmas/TO, com 4 suítes, piscina com hidromassagem, 972 m² de terreno e 290,76 m² construídos.",
  alternates: { canonical: `${baseUrl}/casa-condominio-polineisia` },
  keywords: [
    "casa no Condomínio Polinésia",
    "casa de alto padrão em Palmas",
    "casa nova em condomínio Palmas TO",
    "casa com piscina em Palmas"
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/casa-condominio-polineisia`,
    title: "Casa Nova no Condomínio Polinésia | Palmas/TO",
    description:
      "Arquitetura contemporânea, 4 suítes e lazer privativo em uma casa nova no Condomínio Polinésia.",
    images: [
      {
        url: `${baseUrl}/brand/casa-polineisia/1-Foto-1.jpg`,
        width: 1280,
        height: 720,
        alt: "Fachada da casa nova no Condomínio Polinésia"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Nova no Condomínio Polinésia | Palmas/TO",
    description: "Casa de alto padrão com 4 suítes, piscina e 972 m² de terreno.",
    images: [`${baseUrl}/brand/casa-polineisia/1-Foto-1.jpg`]
  }
};

export default function CasaCondominioPolineisiaPage() {
  return <PolinesiaLanding />;
}
