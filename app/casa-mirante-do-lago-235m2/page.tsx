import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { CasaMirante235Landing } from "./casa-mirante-235-landing";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Casa térrea de 235 m² à venda no Mirante do Lago | Palmas/TO",
  description:
    "Casa térrea à venda no Condomínio Mirante do Lago, em Palmas/TO, com 235 m² construídos, terreno de 420 m², 3 suítes, piscina aquecida, energia solar e móveis planejados.",
  alternates: { canonical: `${baseUrl}/casa-mirante-do-lago-235m2` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/casa-mirante-do-lago-235m2`,
    title: "Casa térrea de 235 m² no Condomínio Mirante do Lago",
    description: "Casa térrea com 3 suítes, piscina aquecida, energia solar e móveis planejados em Palmas/TO.",
    images: [{
      url: `${baseUrl}/brand/casa-mirante-do-lago-235m2/16-entrada.jpg`,
      width: 960,
      height: 1280,
      alt: "Entrada com jardim e parte da fachada da casa no Condomínio Mirante do Lago"
    }]
  }
};

export default function CasaMirante235Page() {
  return <CasaMirante235Landing />;
}
