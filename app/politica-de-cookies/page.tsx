import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | Pedro Soares Imóveis",
  description: "Entenda como usamos cookies e como você pode gerenciar seu consentimento no site Pedro Soares Imóveis."
};

export default function PoliticaCookiesPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 920 }}>
        <h1 className="section-title" style={{ marginTop: 0 }}>
          Política de Cookies
        </h1>
        <p className="section-subtitle text-card" style={{ marginBottom: 16 }}>
          Esta política explica o uso de cookies no site Pedro Soares Imóveis, em conformidade com a LGPD.
        </p>

        <article className="card" style={{ padding: 16, display: "grid", gap: 12 }}>
          <p>
            <strong>O que são cookies:</strong> cookies são pequenos arquivos de texto armazenados no seu navegador para
            lembrar preferências e melhorar sua experiência.
          </p>
          <p>
            <strong>Cookies essenciais:</strong> necessários para funcionamento básico do site, incluindo segurança,
            navegação e registro de preferências de consentimento.
          </p>
          <p>
            <strong>Cookies opcionais:</strong> podem ser usados para métricas de acesso e melhoria da experiência quando
            você autoriza.
          </p>
          <p>
            <strong>Como gerenciar:</strong> você pode aceitar ou recusar cookies opcionais no banner de consentimento e
            também alterar permissões no seu navegador.
          </p>
          <p>
            <strong>Prazo de armazenamento:</strong> o registro de consentimento pode ser armazenado por até 180 dias para
            manter sua escolha.
          </p>
          <p>
            <strong>Contato:</strong> em caso de dúvidas sobre privacidade e cookies, fale no WhatsApp (63) 98484-5101.
          </p>
        </article>
      </div>
    </section>
  );
}
