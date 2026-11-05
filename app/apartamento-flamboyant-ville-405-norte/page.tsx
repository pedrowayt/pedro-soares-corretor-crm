import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { FlamboyantLanding } from "./flamboyant-landing";

const baseUrl = getSiteUrl();
const path = "/apartamento-flamboyant-ville-405-norte";
const hero = `${baseUrl}/brand/apartamento-flamboyant-ville-405-norte/11-area-externa-entrada.jpg`;

export const metadata: Metadata = {
  title: "Apartamento à venda e para locação no Flamboyant Ville | Palmas/TO",
  description:
    "Apartamento de 58 m² com 2 quartos, armários planejados, varanda e lazer completo no Residencial Flamboyant Ville, 405 Norte, em Palmas/TO.",
  alternates: { canonical: `${baseUrl}${path}` },
  keywords: [
    "apartamento à venda 405 Norte Palmas",
    "apartamento para alugar 405 Norte",
    "Residencial Flamboyant Ville Palmas",
    "apartamento 58 m² Palmas"
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}${path}`,
    title: "Apartamento Flamboyant Ville · 405 Norte",
    description: "2 quartos, 58 m², varanda e condomínio com piscina em Palmas/TO.",
    images: [{ url: hero, width: 1280, height: 960, alt: "Entrada do Residencial Flamboyant Ville na 405 Norte" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Apartamento Flamboyant Ville · 405 Norte",
    description: "Disponível para venda ou locação em Palmas/TO.",
    images: [hero]
  }
};

export default function FlamboyantVillePage() {
  return <FlamboyantLanding />;
}
