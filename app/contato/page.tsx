import type { Metadata } from "next";
import { SellerCaptureForm } from "@/components/public/lead-forms";
import { PageHero } from "@/components/ui/page-hero";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Contato | Pedro Soares Corretor de Imóveis",
  description:
    "Fale com Pedro Soares para comprar, vender ou investir em imóveis em Palmas TO.",
  alternates: {
    canonical: `${baseUrl}/contato`
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/contato`,
    title: "Contato | Pedro Soares Corretor de Imóveis",
    description:
      "Atendimento direto no WhatsApp para compra, venda e investimento imobiliário em Palmas TO."
  }
};

export default function ContatoPage() {
  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Fale comigo para comprar, vender ou investir"
        subtitle="Retorno rápido no WhatsApp com atendimento consultivo e plano de ação." 
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid-3">
          <article className="card" style={{ padding: 18 }}>
            <h3 style={{ marginTop: 0 }}>WhatsApp</h3>
            <a
              className="button button-whatsapp"
              href="https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20falar%20sobre%20im%C3%B3veis."
              target="_blank"
              rel="noreferrer"
            >
              Chamar agora
            </a>
            <p className="section-subtitle" style={{ marginTop: 10 }}>
              CRECI 5861-TO • Atendimento em horário comercial com priorização por urgência.
            </p>
          </article>
          <article className="card" style={{ padding: 18, gridColumn: "span 2" }}>
            <h3 style={{ marginTop: 0 }}>Captação de proprietário</h3>
            <SellerCaptureForm />
          </article>
        </div>
      </section>
    </>
  );
}
