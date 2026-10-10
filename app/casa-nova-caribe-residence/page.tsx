import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { CasaNovaCaribeLanding } from "./casa-nova-landing";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Casa nova no Caribe Residence | Palmas/TO",
  description:
    "Casa nova com 3 suítes plenas, 243 m² construídos e lote de 609,76 m² no Caribe Residence Condomínio Resort, em Palmas/TO.",
  alternates: { canonical: `${baseUrl}/casa-nova-caribe-residence` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/casa-nova-caribe-residence`,
    title: "Casa nova no Caribe Residence | Palmas/TO",
    description:
      "Projeto QUBUS Arquitetura, 3 suítes plenas, piscina, varanda gourmet e 243 m² construídos.",
    images: [
      {
        url: `${baseUrl}/brand/casa-nova-caribe/1-Foto-1.jpg`,
        width: 960,
        height: 1280,
        alt: "Fachada da casa nova no Caribe Residence Condomínio Resort"
      }
    ]
  }
};

export default function CasaNovaCaribeResidencePage() {
  return <CasaNovaCaribeLanding />;
}
