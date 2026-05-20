import { SellerCaptureForm } from "@/components/public/lead-forms";
import { PageHero } from "@/components/ui/page-hero";

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
