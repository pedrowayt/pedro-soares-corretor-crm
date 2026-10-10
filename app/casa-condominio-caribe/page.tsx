import type { Metadata } from "next";
import { CaribeLanding } from "./caribe-landing";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Casa no Condomínio Caribe Resort | Palmas/TO",
  description:
    "Casa contemporânea com 4 suítes, piscina e energia solar à venda no Condomínio Caribe Resort, em Palmas/TO.",
  alternates: { canonical: `${baseUrl}/casa-condominio-caribe` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/casa-condominio-caribe`,
    title: "Casa no Condomínio Caribe Resort | Palmas/TO",
    description:
      "Um lar completo com 600 m² de terreno, 240 m² construídos, piscina e 4 suítes.",
    images: [
      {
        url: `${baseUrl}/brand/caribe-resort/1-Foto-1.jpg`,
        width: 960,
        height: 1280,
        alt: "Fachada da casa no Condomínio Caribe Resort"
      }
    ]
  }
};

export default function CasaCondominioCaribePage() {
  return <CaribeLanding />;
}
