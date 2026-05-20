import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Pedro Soares Imóveis",
  description: "Saiba como os dados pessoais são coletados e utilizados no site Pedro Soares Imóveis."
};

export default function PoliticaPrivacidadePage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 920 }}>
        <h1 className="section-title" style={{ marginTop: 0 }}>Política de Privacidade</h1>
        <p className="section-subtitle text-card" style={{ marginBottom: 16 }}>
          Esta política explica como tratamos dados pessoais em formulários, contato via WhatsApp e navegação no site.
        </p>
        <article className="card" style={{ padding: 16, display: "grid", gap: 12 }}>
          <p><strong>Dados coletados:</strong> nome, telefone, e-mail, interesse imobiliário e informações enviadas por você.</p>
          <p><strong>Finalidade:</strong> atendimento comercial, retorno de contato, envio de opções de imóveis e acompanhamento da jornada.</p>
          <p><strong>Compartilhamento:</strong> dados não são vendidos; podem ser compartilhados com parceiros necessários para viabilizar a negociação.</p>
          <p><strong>Segurança:</strong> adotamos medidas técnicas e operacionais para proteger as informações.</p>
          <p><strong>Direitos do titular:</strong> você pode solicitar atualização, correção ou exclusão dos seus dados a qualquer momento.</p>
          <p><strong>Contato LGPD:</strong> WhatsApp (63) 98484-5101.</p>
        </article>
      </div>
    </section>
  );
}
