import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { CaribeResidenceLanding } from "./caribe-residence-landing";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Casa no Caribe Residence & Resort | Palmas/TO",
  description:
    "Casa com 4 suítes plenas, piscina com cascata e espaço gourmet completo à venda no Caribe Residence & Resort, em Palmas/TO.",
  alternates: { canonical: `${baseUrl}/casa-caribe-residence` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/casa-caribe-residence`,
    title: "Casa no Caribe Residence & Resort | Palmas/TO",
    description:
      "Uma casa elegante com pé-direito duplo, piscina com cascata e 4 suítes plenas.",
    images: [
      {
        url: `${baseUrl}/brand/caribe-residence/6-Foto-6.jpg`,
        width: 960,
        height: 1280,
        alt: "Fachada da casa no Caribe Residence & Resort"
      }
    ]
  }
};

export default function CasaCaribeResidencePage() {
  return <CaribeResidenceLanding />;
}
