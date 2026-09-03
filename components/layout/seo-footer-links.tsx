import Link from "next/link";

type SeoFooterLinkGroup = {
  title: string;
  links: Array<{
    href: string;
    label: string;
  }>;
};

const seoFooterLinkGroups: SeoFooterLinkGroup[] = [
  {
    title: "Imóveis em Palmas",
    links: [
      { href: "/imoveis", label: "Imóveis em Palmas TO" },
      { href: "/palmas-to/imoveis-prontos", label: "Imóveis prontos em Palmas" },
      { href: "/palmas-to/imoveis-leilao", label: "Imóveis de leilão em Palmas" },
      { href: "/lancamentos", label: "Lançamentos em destaque em Palmas" }
    ]
  },
  {
    title: "Comprar",
    links: [
      { href: "/imoveis/prontos?city=Palmas&purpose=VENDA&type=APARTAMENTO", label: "Comprar apartamento em Palmas" },
      { href: "/imoveis/prontos?city=Palmas&purpose=VENDA&type=CASA", label: "Casa à venda em Palmas" },
      { href: "/imoveis/prontos?city=Palmas&purpose=VENDA&type=LOTE", label: "Lote à venda em Palmas" },
      { href: "/imoveis/prontos?city=Palmas&purpose=VENDA&type=COMERCIAL", label: "Imóvel comercial à venda em Palmas" },
      { href: "/imoveis/prontos?city=Palmas&purpose=INVESTIMENTO", label: "Imóveis para investir em Palmas" }
    ]
  },
  {
    title: "Alugar",
    links: [
      { href: "/imoveis/prontos?city=Palmas&purpose=LOCACAO&type=APARTAMENTO", label: "Apartamento para alugar em Palmas" },
      { href: "/imoveis/prontos?city=Palmas&purpose=LOCACAO&type=CASA", label: "Casa para alugar em Palmas" },
      { href: "/imoveis/prontos?city=Palmas&purpose=LOCACAO&type=COMERCIAL", label: "Ponto comercial para alugar em Palmas" },
      { href: "/imoveis/prontos?city=Palmas&purpose=LOCACAO", label: "Imóveis para alugar em Palmas" }
    ]
  },
  {
    title: "Bairros",
    links: [
      { href: "/palmas-to/plano-diretor-sul/imoveis", label: "Imóveis no Plano Diretor Sul" },
      { href: "/palmas-to/plano-diretor-norte/imoveis", label: "Imóveis no Plano Diretor Norte" },
      { href: "/palmas-to/orla-da-graciosa/imoveis", label: "Imóveis na Orla da Graciosa" },
      { href: "/palmas-to/centro/imoveis", label: "Imóveis no Centro de Palmas" },
      { href: "/palmas-to/taquaralto/imoveis", label: "Imóveis em Taquaralto" },
      { href: "/palmas-to/aureny/imoveis", label: "Imóveis no Aureny" }
    ]
  },
  {
    title: "Lançamentos e leilões",
    links: [
      { href: "/lancamentos", label: "Lançamentos em destaque" },
      { href: "/imoveis/leilao?city=Palmas&type=APARTAMENTO", label: "Apartamentos de leilão em Palmas" },
      { href: "/imoveis/leilao?city=Palmas&type=CASA", label: "Casas de leilão em Palmas" }
    ]
  }
];

export function SeoFooterLinks() {
  return (
    <section className="site-footer-seo" aria-labelledby="site-footer-seo-title">
      <div className="container">
        <div className="site-footer-seo-head">
          <h2 id="site-footer-seo-title">Buscas populares em Palmas</h2>
          <p>Atalhos para encontrar imóveis por tipo, finalidade e região.</p>
        </div>

        <nav className="site-footer-seo-grid" aria-label="Buscas populares em Palmas">
          {seoFooterLinkGroups.map((group) => (
            <section key={group.title} className="site-footer-seo-group" aria-label={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>
    </section>
  );
}
