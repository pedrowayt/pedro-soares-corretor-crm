import Link from "next/link";

type Props = {
  whatsappUrl: string;
  instagramUrl: string;
};

export function BlogSidebarAuthor({ whatsappUrl, instagramUrl }: Props) {
  return (
    <aside className="blog-sidebar-card blog-sidebar-author" aria-label="Sobre o autor">
      <div
        className="blog-sidebar-author-photo"
        style={{ backgroundImage: "url(/brand/pedro-portrait-1.png)" }}
        aria-hidden="true"
      />
      <div className="blog-sidebar-author-body">
        <p className="blog-sidebar-eyebrow">Sobre o autor</p>
        <h3 className="blog-sidebar-author-name">Pedro Soares</h3>
        <p className="blog-sidebar-author-meta">Corretor de imóveis · CRECI 5861-TO</p>
        <p className="blog-sidebar-author-bio">
          Atendimento consultivo para compra, venda, locação e investimento em Palmas TO. Lançamentos,
          imóveis prontos e oportunidades de leilão.
        </p>
        <div className="blog-sidebar-author-actions">
          <a
            className="button button-whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar no WhatsApp
          </a>
          <a
            className="button button-ghost"
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram ↗
          </a>
          <Link className="button button-ghost" href="/imoveis/prontos">
            Ver imóveis
          </Link>
        </div>
      </div>
    </aside>
  );
}
