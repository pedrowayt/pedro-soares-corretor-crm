import type { Metadata } from "next";
import { MiranteLanding } from "./mirante-landing";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Casa Mirante do Lago à venda no Plano Diretor Sul | Palmas/TO",
  description:
    "Casa Mirante do Lago à venda no Plano Diretor Sul, em Palmas/TO, com 237 m² construídos, 420 m² de terreno, 4 suítes, piscina e área gourmet integrada.",
  alternates: { canonical: `${baseUrl}/casa-mirante-do-lago` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/casa-mirante-do-lago`,
    title: "Casa Mirante do Lago | Plano Diretor Sul · Palmas/TO",
    description: "Casa contemporânea com 4 suítes, piscina e área gourmet integrada no Condomínio Mirante do Lago.",
    images: [{
      url: `${baseUrl}/brand/casa-mirante-do-lago/01-fachada.jpg`,
      width: 720,
      height: 1280,
      alt: "Fachada da Casa Mirante do Lago"
    }]
  }
};

export default function CasaMiranteDoLagoPage() {
  return <MiranteLanding />;
}
