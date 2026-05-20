import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso | Pedro Soares Imóveis",
  description: "Regras gerais de navegação e uso do site Pedro Soares Imóveis."
};

export default function TermosUsoPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 920 }}>
        <h1 className="section-title" style={{ marginTop: 0 }}>Termos de Uso</h1>
        <p className="section-subtitle text-card" style={{ marginBottom: 16 }}>
          Ao navegar neste site, você concorda com as condições abaixo.
        </p>
        <article className="card" style={{ padding: 16, display: "grid", gap: 12 }}>
          <p><strong>Conteúdo:</strong> informações de imóveis têm caráter informativo e podem ser atualizadas a qualquer momento.</p>
          <p><strong>Propriedade intelectual:</strong> textos, identidade visual e materiais do site não podem ser reproduzidos sem autorização.</p>
          <p><strong>Boa-fé:</strong> o uso dos formulários deve ocorrer com dados verdadeiros e finalidade legítima.</p>
          <p><strong>Terceiros:</strong> links externos (como Google Maps, WhatsApp e redes sociais) seguem as políticas próprias de cada plataforma.</p>
        </article>
      </div>
    </section>
  );
}
