import type { Metadata } from "next";
import { SellerCaptureForm } from "@/components/public/lead-forms";
import { PageHero } from "@/components/ui/page-hero";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Venda seu imóvel em Palmas TO | Pedro Soares",
  description:
    "Cadastre seu imóvel em Palmas TO para receber avaliação mercadológica simplificada e plano de venda com Pedro Soares.",
  alternates: {
    canonical: `${baseUrl}/venda-seu-imovel`
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/venda-seu-imovel`,
    title: "Venda seu imóvel em Palmas TO | Pedro Soares",
    description:
      "Avaliação e plano de venda para proprietários que querem anunciar imóveis em Palmas TO."
  }
};

export default function VendaSeuImovelPage() {
  return (
    <>
      <PageHero
        eyebrow="Captação de Imóveis"
        title="Quer vender seu imóvel em Palmas?"
        subtitle="Cadastre seu imóvel, receba avaliação mercadológica simplificada e plano de venda." 
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SellerCaptureForm />
        </div>
      </section>
    </>
  );
}
