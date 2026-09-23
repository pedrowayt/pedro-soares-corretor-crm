import type { Metadata } from "next";
import { CinnamonExperience } from "@/components/public/cinnamon-experience";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Cinnamon Studio | Studios na Orla de Palmas",
  description:
    "Cinnamon Studio: studios de padrão hoteleiro na Orla 14 de Palmas, com estrutura de serviços, tecnologia e operação pensada para locação por temporada. Receba o material do projeto.",
  alternates: { canonical: `${baseUrl}/cinnamon-studio` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/cinnamon-studio`,
    title: "Cinnamon Studio | Studios na Orla de Palmas",
    description:
      "Studios de padrão hoteleiro na beira do lago, na Orla 14 de Palmas. Conheça o projeto e receba as condições sob consulta.",
    images: [
      {
        url: "/brand/cinnamon/hero.webp",
        width: 1600,
        height: 1600,
        alt: "Fachada do Cinnamon Studio ao entardecer"
      }
    ]
  }
};

export default function CinnamonStudioPage() {
  return <CinnamonExperience />;
}
