import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { CasaTerreaMiranteLanding } from "./casa-terrea-mirante-landing";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Casa térrea à venda no Condomínio Mirante do Lago | Palmas/TO",
  description:
    "Casa térrea à venda no Condomínio Mirante do Lago, em Palmas/TO, com 210 m² construídos, terreno de 420 m², 3 suítes, piscina com hidromassagem e móveis planejados.",
  alternates: { canonical: `${baseUrl}/casa-terrea-mirante-do-lago` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/casa-terrea-mirante-do-lago`,
    title: "Casa térrea no Condomínio Mirante do Lago | Palmas/TO",
    description:
      "Casa térrea com 3 suítes, ambientes planejados, piscina com hidromassagem e varanda gourmet no Condomínio Mirante do Lago.",
    images: [
      {
        url: `${baseUrl}/brand/casa-terrea-mirante-do-lago/fotos/18-fachada.jpg`,
        width: 960,
        height: 1280,
        alt: "Fachada da casa térrea no Condomínio Mirante do Lago"
      }
    ]
  }
};

export default function CasaTerreaMiranteDoLagoPage() {
  return <CasaTerreaMiranteLanding />;
}
