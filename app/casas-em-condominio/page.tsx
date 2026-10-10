import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PropertyPurpose, PropertyType } from "@prisma/client";
import { listPublicCatalogLaunches } from "@/lib/data/public-catalog";
import { listPublicProperties } from "@/lib/data/properties";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();
const whatsappUrl =
  "https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20conhecer%20casas%20em%20condom%C3%ADnio%20em%20Palmas.";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Casas em condomínio à venda em Palmas TO | Pedro Soares",
  description:
    "Conheça casas em condomínio à venda em Palmas, com curadoria de imóveis no Mirante do Lago, Caribe Residence e outros condomínios selecionados.",
  keywords: [
    "casas em condomínio em Palmas",
    "casa em condomínio à venda em Palmas",
    "casa de alto padrão em Palmas",
    "casa no Mirante do Lago"
  ],
  alternates: { canonical: `${baseUrl}/casas-em-condominio` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/casas-em-condominio`,
    title: "Casas em condomínio à venda em Palmas | Pedro Soares",
    description:
      "Uma seleção de casas em condomínios de Palmas para morar com mais privacidade, segurança e qualidade de vida."
  }
};

function formatArea(value: number | null) {
  return value ? `${value.toLocaleString("pt-BR")} m²` : null;
}

type HouseCard = {
  id: string;
  slug: string;
  href: string;
  title: string;
  city: string;
  district: string;
  category: string;
  summary: string;
  imageUrl?: string;
  status: string;
  areaFromM2: number | null;
  bedroomsFrom: number | null;
  suitesFrom: number | null;
};

const featuredCondominiumHouses: HouseCard[] = [
  {
    id: "landing:casa-condominio-caribe-resort",
    slug: "casa-condominio-caribe-resort",
    href: "/casa-condominio-caribe",
    title: "Casa no Condomínio Caribe Resort",
    city: "Palmas/TO",
    district: "Condomínio Caribe Resort",
    category: "Casa em condomínio de alto padrão",
    summary:
      "Casa contemporânea com 600 m² de terreno, 240 m² construídos, 4 suítes, piscina e energia solar no Condomínio Caribe Resort.",
    imageUrl: "/brand/caribe-resort/casa-fachada-hero.jpg",
    status: "À venda",
    areaFromM2: 240,
    bedroomsFrom: null,
    suitesFrom: 4
  },
  {
    id: "landing:casa-caribe-residence-resort",
    slug: "casa-caribe-residence-resort",
    href: "/casa-caribe-residence",
    title: "Casa no Caribe Residence & Resort",
    city: "Palmas/TO",
    district: "Caribe Residence & Resort",
    category: "Casa em condomínio de alto padrão",
    summary:
      "Casa contemporânea com 4 suítes plenas, pé-direito duplo, espaço gourmet completo e piscina com cascata no Caribe Residence & Resort.",
    imageUrl: "/brand/caribe-residence/6-Foto-6.jpg",
    status: "À venda",
    areaFromM2: null,
    bedroomsFrom: null,
    suitesFrom: 4
  }
];

export default async function CasasEmCondominioPage() {
  const [landingHouses, publicProperties] = await Promise.all([
    listPublicCatalogLaunches({ type: PropertyType.CASA_EM_CONDOMINIO }),
    listPublicProperties({ type: PropertyType.CASA_EM_CONDOMINIO, purpose: PropertyPurpose.VENDA })
  ]);
  const editorialHouses: HouseCard[] = [
    ...landingHouses.map((house) => ({ ...house, suitesFrom: null })),
    ...featuredCondominiumHouses
  ].filter((house, index, all) => all.findIndex((candidate) => candidate.slug === house.slug) === index);
  const editorialSlugs = new Set(editorialHouses.map((house) => house.slug));
  const propertyLandingHrefs: Record<string, string> = {
    "casa-nova-caribe-residence-resort": "/casa-nova-caribe-residence",
    "casa-caribe-residence-resort": "/casa-caribe-residence",
    "casa-condominio-caribe-resort": "/casa-condominio-caribe"
  };
  const propertyHouses: HouseCard[] = publicProperties
    .filter((property) => !editorialSlugs.has(property.slug))
    .map((property) => ({
      id: `property:${property.id}`,
      slug: property.slug,
      href: propertyLandingHrefs[property.slug] ?? `/imoveis/${property.slug}`,
      title: property.title,
      city: property.city,
      district: property.district,
      category: "Casa em condomínio",
      summary: property.description,
      imageUrl: property.media?.[0]?.url,
      status: property.status === "RESERVADO" ? "Reservada" : "À venda",
      areaFromM2: property.areaM2Value,
      bedroomsFrom: property.bedrooms,
      suitesFrom: property.suites
    }));
  const houses: HouseCard[] = [
    ...editorialHouses,
    ...propertyHouses
  ];
  const itemList = houses.map((house, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: house.title,
    url: `${baseUrl}${house.href}`,
    image: house.imageUrl ? `${baseUrl}${house.imageUrl}` : undefined
  }));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Casas em condomínio à venda em Palmas",
    description: metadata.description,
    url: `${baseUrl}/casas-em-condominio`,
    inLanguage: "pt-BR",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: itemList
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <main className="section listing-page">
        <div className="container">
          <nav className="listing-breadcrumb" aria-label="Você está em">
            <Link href="/">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href="/imoveis">Imóveis</Link>
            <span aria-hidden="true">/</span>
            <span>Casas em condomínio</span>
          </nav>

          <div className="listing-page-head">
            <div>
              <p className="wp-hero-eyebrow">Curadoria Pedro Soares</p>
              <h1 className="listing-page-title">Casas em condomínio em Palmas</h1>
              <p className="listing-page-subtitle">
                Residências selecionadas para quem busca mais privacidade, segurança e espaço para viver bem.
              </p>
            </div>
            <a href={whatsappUrl} className="button button-whatsapp" target="_blank" rel="noreferrer">
              Falar sobre uma casa
            </a>
          </div>

          <section className="listing-related-landings" aria-labelledby="houses-intro-title">
            <div className="listing-related-landings-head">
              <p className="wp-section-eyebrow">Mais do que uma casa</p>
              <h2 id="houses-intro-title">O condomínio também faz parte da escolha.</h2>
              <p>
                Compare localização, planta, área externa e estrutura do condomínio com orientação direta para entender
                qual residência combina melhor com a sua rotina.
              </p>
            </div>
            <Link href="/condominios-beira-lago-palmas" className="button button-ghost">
              Conhecer condomínios em Palmas
            </Link>
          </section>

          <div className="listing-results-head">
            <p className="wp-section-eyebrow">Imóveis selecionados</p>
            <h2>Casas disponíveis para conhecer</h2>
            <p>{houses.length ? `${houses.length} opções na curadoria atual.` : "Nenhuma casa publicada no momento."}</p>
          </div>

          {houses.length ? (
            <div className="wp-property-grid wp-property-grid-3">
              {houses.map((house) => {
                const area = formatArea(house.areaFromM2);
                const details = [
                  area,
                  house.bedroomsFrom ? `${house.bedroomsFrom} quartos` : null,
                  house.suitesFrom ? `${house.suitesFrom} suítes` : null
                ].filter(Boolean);

                return (
                  <article key={house.id} className="wp-property-card">
                    <div className="wp-property-media" style={{ position: "relative", minHeight: 230 }}>
                      <Image
                        src={house.imageUrl ?? "/brand/logo-light-bg.png"}
                        alt={house.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7, 13, 24, 0.05), rgba(7, 13, 24, 0.78))" }} />
                      <div style={{ position: "absolute", inset: "auto 16px 16px", color: "white" }}>
                        <span className="badge">{house.status}</span>
                        <p style={{ margin: "10px 0 0", fontWeight: 700 }}>{house.category}</p>
                      </div>
                    </div>
                    <div className="wp-property-body">
                      <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>{house.district} · {house.city}</p>
                      <h2 style={{ margin: 0 }}>{house.title}</h2>
                      {details.length ? <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>{details.join(" · ")}</p> : null}
                      <p className="section-subtitle text-card">{house.summary}</p>
                      <Link href={house.href} className="button button-primary" style={{ width: "100%" }}>
                        Ver detalhes da casa
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <section className="crm-panel">
              <p className="crm-panel__empty">Entre em contato para receber as próximas casas selecionadas.</p>
            </section>
          )}

          <section className="section" style={{ paddingBottom: 0 }} aria-labelledby="houses-next-step-title">
            <div className="listing-related-landings">
              <div className="listing-related-landings-head">
                <p className="wp-section-eyebrow">Atendimento personalizado</p>
                <h2 id="houses-next-step-title">Quer receber opções dentro do seu perfil?</h2>
                <p>
                  Fale comigo para receber disponibilidade, valores atualizados e horários de visita das casas em
                  condomínio em Palmas.
                </p>
              </div>
              <a href={whatsappUrl} className="button button-primary" target="_blank" rel="noreferrer">
                Receber opções no WhatsApp
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
