import type { Metadata } from "next";
import { CinnamonExperience } from "@/components/public/cinnamon-experience";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Cinnamon Studio | Studios na Orla de Palmas",
  description:
    "Cinnamon Studio: studios inteligentes de 29,92 m² para quem vive em movimento, na Orla de Palmas. Receba o material do projeto.",
  alternates: { canonical: `${baseUrl}/cinnamon-studio` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/cinnamon-studio`,
    title: "Cinnamon Studio | Studios na Orla de Palmas",
    description:
      "Seu espaço. Seu ritmo. Conheça o projeto de studios inteligentes na Orla de Palmas.",
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
