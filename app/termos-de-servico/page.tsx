import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Termos de Serviço | Pedro Soares Imóveis",
  description: "Condições de uso dos serviços de intermediação e atendimento imobiliário de Pedro Soares.",
  alternates: { canonical: `${baseUrl}/termos-de-servico` }
};

export default function TermosServicoPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 920 }}>
        <h1 className="section-title" style={{ marginTop: 0 }}>Termos de Serviço</h1>
        <p className="section-subtitle text-card" style={{ marginBottom: 16 }}>
          Estes termos regulam o atendimento e o uso dos serviços imobiliários oferecidos por Pedro Soares.
        </p>
        <article className="card" style={{ padding: 16, display: "grid", gap: 12 }}>
          <p><strong>Objeto:</strong> intermediação de compra, venda, locação e análise de oportunidades imobiliárias.</p>
          <p><strong>Responsabilidades:</strong> as informações de imóveis podem variar conforme atualização de proprietários e parceiros.</p>
          <p><strong>Disponibilidade:</strong> valores, status e condições comerciais estão sujeitos a alteração sem aviso prévio.</p>
          <p><strong>Atendimento:</strong> o canal oficial é o WhatsApp (63) 98484-5101 e formulários do site.</p>
          <p><strong>Limites:</strong> análises de mercado, ROI e risco são estimativas e não constituem garantia de resultado.</p>
        </article>
      </div>
    </section>
  );
}
