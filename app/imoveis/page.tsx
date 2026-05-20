import type { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Imóveis em Palmas TO | Pedro Soares Corretor de Imóveis",
  description:
    "Encontre imóveis prontos, imóveis na planta e imóveis de leilão em Palmas TO com atendimento direto de Pedro Soares.",
  keywords: [
    "imóveis em Palmas TO",
    "imóveis prontos Palmas",
    "imóveis na planta Palmas",
    "imóveis de leilão Palmas",
    "Pedro Soares corretor"
  ],
  alternates: {
    canonical: `${baseUrl}/imoveis`
  }
};

const categoryCards = [
  {
    href: "/imoveis/prontos",
    title: "Imóveis prontos",
    subtitle: "Casas, apartamentos e lotes prontos para morar ou investir.",
    image: "/brand/areas/plano-diretor-sul.png"
  },
  {
    href: "/imoveis/na-planta",
    title: "Imóveis na planta",
    subtitle: "Empreendimentos com tipologias, entrega prevista e tabela atualizada.",
    image: "/brand/areas/plano-diretor-norte.png"
  },
  {
    href: "/imoveis/leilao",
    title: "Imóveis leilão",
    subtitle: "Oportunidades com foco em margem, risco e potencial de revenda.",
    image: "/brand/areas/centro.png"
  }
];

const regionalLinks = [
  { href: "/palmas-to/plano-diretor-sul/imoveis", label: "Plano Diretor Sul" },
  { href: "/palmas-to/plano-diretor-norte/imoveis", label: "Plano Diretor Norte" },
  { href: "/palmas-to/orla-da-graciosa/imoveis", label: "Orla da Graciosa" },
  { href: "/palmas-to/taquaralto/imoveis", label: "Taquaralto" },
  { href: "/palmas-to/aureny/imoveis", label: "Aureny" },
  { href: "/palmas-to/centro/imoveis", label: "Centro de Palmas" }
];

export default function ImoveisPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Imóveis em Palmas TO",
    description:
      "Página de entrada para imóveis prontos, na planta e leilão em Palmas TO.",
    url: `${baseUrl}/imoveis`,
    inLanguage: "pt-BR"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="section" style={{ paddingBottom: 20 }}>
        <div className="container wp-section-head">
          <p className="wp-hero-eyebrow" style={{ marginBottom: 12 }}>
            Pedro Soares • Corretor de Imóveis em Palmas TO
          </p>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            Imóveis em Palmas TO
          </h1>
          <p className="section-subtitle text-card">
            Escolha o tipo de oportunidade que faz sentido para você e filtre por bairro, faixa de valor, tipologia e
            metragem.
          </p>

          <div className="wp-type-switches" style={{ marginTop: 18 }}>
            <Link href="/imoveis/prontos" className="wp-type-chip">
              Imóveis prontos
            </Link>
            <Link href="/imoveis/na-planta" className="wp-type-chip">
              Imóveis na planta
            </Link>
            <Link href="/imoveis/leilao" className="wp-type-chip">
              Imóveis leilão
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container wp-property-grid wp-property-grid-3">
          {categoryCards.map((item) => (
            <article key={item.href} className="wp-property-card compact">
              <div
                className="wp-property-media"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(7, 13, 24, 0.06), rgba(7, 13, 24, 0.7)), url(${item.image})`
                }}
              >
                <p>Palmas • Tocantins</p>
              </div>
              <div className="wp-property-body">
                <h2 style={{ margin: 0 }}>{item.title}</h2>
                <p className="section-subtitle text-card">{item.subtitle}</p>
                <Link href={item.href} className="button button-primary" style={{ width: "100%" }}>
                  Ver imóveis
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section wp-soft-section" style={{ paddingTop: 28 }}>
        <div className="container">
          <div className="wp-section-head">
            <h2 className="section-title">Regiões de Palmas</h2>
            <p className="section-subtitle text-card">
              Páginas locais com foco em intenção de busca por bairro e tipo de imóvel.
            </p>
          </div>

          <div className="wp-type-switches" style={{ marginTop: 16 }}>
            {regionalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="wp-type-chip">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
