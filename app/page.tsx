import type { Metadata } from "next";
import { PropertyPurpose, PropertyStatus, PropertyType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { listPublishedBlogPosts } from "@/lib/data/blog";
import { exclusiveManagementLanding, publicLandingPages } from "@/lib/data/landing-pages";
import { LandingPagesSlider } from "@/components/public/landing-pages-slider";
import { PropertySpecs } from "@/components/public/property-specs";
import { listPublicProperties } from "@/lib/data/properties";
import {
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPE_OPTIONS
} from "@/lib/property-types";
import { getSiteUrl } from "@/lib/site-url";
import { formatCurrencyBRL } from "@/lib/utils";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Pedro Soares | Corretor de Imóveis em Palmas TO",
  description:
    "Encontre imóveis prontos, lançamentos, leilões e oportunidades para investir em Palmas TO com atendimento direto de Pedro Soares.",
  alternates: {
    canonical: baseUrl
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: baseUrl,
    title: "Pedro Soares | Corretor de Imóveis em Palmas TO",
    description:
      "Imóveis prontos, lançamentos e oportunidades de leilão em Palmas TO com atendimento consultivo."
  }
};

type SearchMode = "geral" | "leilao";

type HomePropertyCard = {
  id: string;
  href: string;
  title: string;
  city: string;
  district: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  areaM2: number | null;
  purpose: PropertyPurpose;
  type: PropertyType;
  status: PropertyStatus;
  purposeLabel: string;
  typeLabel: string;
  isAuctionOpportunity: boolean;
  hasAuctionCase: boolean;
  imageUrl: string;
};

type AreaCard = {
  key: string;
  district: string;
  city: string;
  count: number;
  imageUrl: string;
};

type FeaturedArea = {
  district: string;
  city: string;
  aliases: string[];
  imageUrl: string;
};

const objectiveCards = [
  {
    title: "Quero comprar para morar",
    description: "Casas, apartamentos e condomínios escolhidos para a sua rotina.",
    href: "/imoveis/prontos?purpose=VENDA",
    action: "Ver imóveis para morar"
  },
  {
    title: "Quero investir",
    description: "Oportunidades para avaliar localização, liquidez e potencial de valorização.",
    href: "/imoveis/prontos?purpose=INVESTIMENTO",
    action: "Ver opções para investir"
  },
  {
    title: "Quero conhecer um lançamento",
    description: "Páginas especiais com informações, condições e atendimento para cada campanha.",
    href: "/lancamentos",
    action: "Ver lançamentos"
  }
] as const;

const palmasLakeTowers = [
  {
    name: "Lake Sky",
    type: "Residencial · 2032",
    description: "Coberturas duplex e mansões suspensas com vista permanente para o lago.",
    image: "/brand/palmas-lake/sky.jpg",
    href: "/palmas-lake/lake-sky"
  },
  {
    name: "Lake Garden",
    type: "Residencial · 2032",
    description: "Espaço, paisagismo exuberante e a calma de morar de frente para o lago.",
    image: "/brand/palmas-lake/garden.jpg",
    href: "/palmas-lake/lake-garden"
  },
  {
    name: "Lake Park",
    type: "Residencial · 2032",
    description: "Plantas amplas, living integrado e um ponto de entrada especial no residencial.",
    image: "/brand/palmas-lake/park.jpg",
    href: "/palmas-lake/lake-park"
  },
  {
    name: "Lake Loft",
    type: "Multifuncional · 2029",
    description: "Compactos inteligentes preparados para morar, hospedar e investir.",
    image: "/brand/palmas-lake/loft.jpg",
    href: "/palmas-lake/lake-loft"
  },
  {
    name: "Lake Office",
    type: "Business center · 2029",
    description: "Salas e lajes corporativas conectadas ao Mall, à marina e à orla.",
    image: "/brand/palmas-lake/office.jpg",
    href: "/palmas-lake/lake-office"
  },
  {
    name: "Lake Mall",
    type: "Shopping conceito · 2029",
    description: "Gastronomia, serviços e encontros com a água como paisagem todos os dias.",
    image: "/brand/palmas-lake/mall.jpg",
    href: "/palmas-lake/lake-mall"
  }
] as const;

const purposeLabelMap: Record<PropertyPurpose, string> = {
  VENDA: "Venda",
  LOCACAO: "Locação",
  INVESTIMENTO: "Investimento",
  LEILAO: "Leilão",
  LANCAMENTO: "Lançamento"
};

const typeLabelMap: Record<PropertyType, string> = PROPERTY_TYPE_LABELS;

const featuredAreas: FeaturedArea[] = [
  {
    district: "Plano Diretor Sul",
    city: "Palmas",
    aliases: ["plano diretor sul", "plano diretor expansao sul"],
    imageUrl: "/brand/areas/plano-diretor-sul.png"
  },
  {
    district: "Plano Diretor Norte",
    city: "Palmas",
    aliases: ["plano diretor norte", "103 norte", "104 norte"],
    imageUrl: "/brand/areas/plano-diretor-norte.png"
  },
  {
    district: "Centro",
    city: "Palmas",
    aliases: ["centro"],
    imageUrl: "/brand/areas/centro.png"
  },
  {
    district: "Taquaralto",
    city: "Palmas",
    aliases: ["taquaralto", "taquari"],
    imageUrl: "/brand/areas/taquaralto-aureny.png"
  },
  {
    district: "Orla da Graciosa",
    city: "Palmas",
    aliases: ["orla da graciosa", "graciosa", "praia graciosa"],
    imageUrl: "/brand/areas/orla-graciosa.png"
  },
  {
    district: "Jardim Aureny",
    city: "Palmas",
    aliases: ["jardim aureny", "aureny", "aureny iii", "aureny iv"],
    imageUrl: "/brand/areas/taquaralto-aureny.png"
  }
];

type HomeImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

function HomeImage({ src, alt, sizes, priority = false, className = "" }: HomeImageProps) {
  const canUseNextImage =
    src.startsWith("/") ||
    src.startsWith("https://imagedelivery.net/") ||
    src.startsWith("https://images.unsplash.com/");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!canUseNextImage}
      className={`wp-home-image ${className}`.trim()}
    />
  );
}
function normalizePropertyCard(property: {
  id: string;
  slug: string;
  title: string;
  city: string;
  district: string;
  priceValue: number;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  areaM2Value: number | null;
  purpose: PropertyPurpose;
  type: PropertyType;
  status: PropertyStatus;
  isAuctionOpportunity?: boolean | null;
  auctionCase?: unknown | null;
  media?: ReadonlyArray<{ url: string }>;
}) {
  return {
    id: property.id,
    href: `/imoveis/${property.slug}`,
    title: property.title,
    city: property.city,
    district: property.district,
    price: property.priceValue,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parkingSpaces: property.parkingSpaces,
    areaM2: property.areaM2Value,
    purpose: property.purpose,
    type: property.type,
    status: property.status,
    purposeLabel: purposeLabelMap[property.purpose],
    typeLabel: typeLabelMap[property.type],
    isAuctionOpportunity: Boolean(property.isAuctionOpportunity),
    hasAuctionCase: Boolean(property.auctionCase),
    imageUrl:
      property.media?.[0]?.url ??
      "/brand/logo-light-bg.png"
  } satisfies HomePropertyCard;
}

function districtKey(city: string, district: string) {
  return `${normalizeLocation(city)}-${normalizeLocation(district)}`.replace(/\s+/g, "-");
}

function normalizeLocation(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesDistrict(district: string, aliases: string[]) {
  const normalizedDistrict = normalizeLocation(district);
  return aliases.some((alias) => normalizedDistrict.includes(normalizeLocation(alias)));
}

function getFeaturedArea(city: string, district: string) {
  return featuredAreas.find((area) => {
    const sameCity = normalizeLocation(city) === normalizeLocation(area.city);
    return sameCity && matchesDistrict(district, area.aliases);
  });
}

function isAuctionCard(property: HomePropertyCard) {
  return property.purpose === "LEILAO" || property.isAuctionOpportunity || property.hasAuctionCase;
}

function buildAreaCards(properties: HomePropertyCard[]) {
  const groups = new Map<string, AreaCard & { rank: number }>();

  for (const property of properties) {
    const key = districtKey(property.city, property.district);
    const featuredArea = getFeaturedArea(property.city, property.district);
    const existing = groups.get(key);

    if (existing) {
      existing.count += 1;
      continue;
    }

    groups.set(key, {
      key,
      district: property.district,
      city: property.city,
      count: 1,
      imageUrl: featuredArea?.imageUrl ?? property.imageUrl,
      rank: featuredArea ? featuredAreas.indexOf(featuredArea) : Number.MAX_SAFE_INTEGER
    });
  }

  return [...groups.values()]
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      if (a.count !== b.count) return b.count - a.count;
      return `${a.city} ${a.district}`.localeCompare(`${b.city} ${b.district}`);
    })
    .slice(0, 6)
    .map(({ key, district, city, count, imageUrl }) => ({ key, district, city, count, imageUrl }));
}

function formatCountLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getSearchMode(modeInput: string | string[] | undefined): SearchMode {
  if (modeInput === "leilao") return "leilao";
  return "geral";
}

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParams;
  const searchMode = getSearchMode(filters.mode);

  const [propertiesRaw, blogPosts] = await Promise.all([
    listPublicProperties(),
    listPublishedBlogPosts(3)
  ]);

  const allCards = propertiesRaw.map(normalizePropertyCard);
  const readySaleCards = allCards.filter(
    (card) => card.purpose === "VENDA" && !isAuctionCard(card) && card.status === "DISPONIVEL"
  );

  const featuredProperties = readySaleCards.slice(0, 6);

  const areaCards = buildAreaCards(readySaleCards);
  // The editorial landing-page registry is the single source for these home
  // cards. New entries appear here automatically without another home edit.
  const featuredLandings = publicLandingPages;

  return (
    <>
      <section className="wp-hero">
        <div className="container wp-hero-shell">
          <div className="wp-hero-content">
            <p className="wp-hero-eyebrow">Pedro Soares <span>•</span> Especialista em imóveis em Palmas</p>
            <h1>O lugar certo muda tudo.</h1>
            <p className="wp-hero-lede">
              Encontre imóveis, lançamentos e oportunidades com uma curadoria mais clara para morar, investir ou começar um novo capítulo.
            </p>
            <div className="wp-hero-proof" aria-label="Diferenciais do atendimento">
              <span>Curadoria local</span>
              <span>Leitura de mercado</span>
              <span>Atendimento direto</span>
            </div>

            <div className="wp-search-tabs" role="tablist" aria-label="Tipos de busca">
              {(
                [
                  { key: "geral", label: "Busca Geral" },
                  { key: "leilao", label: "Imóveis Leilão" }
                ] as Array<{ key: SearchMode; label: string }>
              ).map((tab) => (
                <Link
                  key={tab.key}
                  href={`/?mode=${tab.key}`}
                  className={`wp-search-tab ${searchMode === tab.key ? "active" : ""}`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>

            {searchMode === "leilao" ? (
              <form className="wp-search-panel" action="/imoveis/leilao" method="GET">
                <div>
                  <label htmlFor="district-auction">Região</label>
                  <input id="district-auction" name="district" placeholder="Bairro ou região" />
                </div>
                <div>
                  <label htmlFor="type-auction">Tipo</label>
                  <select id="type-auction" name="type" defaultValue="">
                    <option value="">Todos</option>
                    {PROPERTY_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="button button-primary">
                  Ver oportunidades
                </button>

                <details className="wp-search-advanced">
                  <summary>Mais filtros</summary>
                  <div className="wp-search-advanced-content">
                    <div>
                      <label htmlFor="maxPrice-auction">Preço até</label>
                      <input id="maxPrice-auction" name="maxPrice" type="number" placeholder="800000" />
                    </div>
                    <div>
                      <label htmlFor="bedrooms-auction">Quartos</label>
                      <input id="bedrooms-auction" name="bedrooms" type="number" min={0} placeholder="2" />
                    </div>
                    <div>
                      <label htmlFor="area-auction">Metragem mínima</label>
                      <input id="area-auction" name="minAreaM2" type="number" min={0} placeholder="60" />
                    </div>
                  </div>
                </details>
              </form>
            ) : (
              <form className="wp-search-panel" action="/imoveis/prontos" method="GET">
                <div>
                  <label htmlFor="purpose">Finalidade</label>
                  <select id="purpose" name="purpose" defaultValue="VENDA">
                    <option value="VENDA">Venda</option>
                    <option value="LOCACAO">Locação</option>
                    <option value="INVESTIMENTO">Investimento</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="type">Tipo</label>
                  <select id="type" name="type" defaultValue="">
                    <option value="">Todos</option>
                    {PROPERTY_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="district-ready">Bairro ou região</label>
                  <input id="district-ready" name="district" placeholder="Plano Diretor Sul" />
                </div>
                <button type="submit" className="button button-primary">
                  Encontrar imóveis
                </button>

                <details className="wp-search-advanced">
                  <summary>Mais filtros</summary>
                  <div className="wp-search-advanced-content">
                    <div>
                      <label htmlFor="maxPrice-ready">Preço até</label>
                      <input id="maxPrice-ready" name="maxPrice" type="number" placeholder="1200000" />
                    </div>
                    <div>
                      <label htmlFor="bedrooms-ready">Quartos</label>
                      <input id="bedrooms-ready" name="bedrooms" type="number" min={0} placeholder="3" />
                    </div>
                    <div>
                      <label htmlFor="area-ready">Metragem mínima</label>
                      <input id="area-ready" name="minAreaM2" type="number" min={0} placeholder="80" />
                    </div>
                  </div>
                </details>
              </form>
            )}
          </div>

          <div className="wp-hero-media">
            <HomeImage
              src="/brand/pedro-portrait-5.png"
              alt="Pedro Soares, corretor de imóveis em Palmas"
              sizes="(max-width: 900px) 100vw, 54vw"
              priority
            />
            <div className="wp-hero-overlay" />
            <div className="wp-hero-media-meta">
              <span>Palmas · Tocantins</span>
              <strong>Imóveis escolhidos para a vida que você quer construir.</strong>
            </div>
            <span className="wp-hero-media-index" aria-hidden="true">01 / 04</span>
          </div>
        </div>
      </section>

      <section className="section wp-objectives-section">
        <div className="container">
          <div className="wp-section-head">
            <p className="wp-section-eyebrow">Atendimento sob medida</p>
            <h2 className="section-title">O que você está buscando?</h2>
            <p className="section-subtitle text-card">
              Comece pelo seu objetivo e encontre o caminho mais rápido para a próxima decisão.
            </p>
          </div>
          <div className="wp-objective-grid">
            {objectiveCards.map((objective, index) => (
              <Link key={objective.href} href={objective.href} className="wp-objective-card">
                <span className="wp-objective-card-index" aria-hidden="true">0{index + 1}</span>
                <h3>{objective.title}</h3>
                <p>{objective.description}</p>
                <span className="wp-objective-card-action">{objective.action} <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section wp-exclusive-shortcut-section" aria-labelledby="wp-exclusive-shortcut-title">
        <div className="container">
          <div className="wp-exclusive-shortcut">
            <div className="wp-exclusive-shortcut-media">
              <HomeImage
                src={exclusiveManagementLanding.image}
                alt="Pedro Soares, corretor responsável pela Gestão Exclusiva"
                sizes="(max-width: 760px) 100vw, 47vw"
                className="wp-cover-image"
              />
              <span className="wp-exclusive-shortcut-shade" aria-hidden="true" />
              <div className="wp-exclusive-shortcut-media-label">
                <span>Para proprietários</span>
                <strong>Exclusividade na gestão.<br />Alcance aberto.</strong>
              </div>
            </div>
            <div className="wp-exclusive-shortcut-copy">
              <p className="wp-section-eyebrow">Gestão Exclusiva de Venda</p>
              <h2 id="wp-exclusive-shortcut-title">Seu imóvel merece uma estratégia, não apenas um anúncio.</h2>
              <p>
                Um único responsável organiza a divulgação, os interessados, as visitas e as propostas para você vender com mais clareza e controle.
              </p>
              <div className="wp-exclusive-shortcut-points" aria-label="Benefícios da Gestão Exclusiva">
                <span>Preço e comunicação consistentes</span>
                <span>Divulgação profissional e parcerias</span>
                <span>Negociação conduzida de ponta a ponta</span>
              </div>
              <Link href={exclusiveManagementLanding.href} className="button button-primary">
                Conhecer a Gestão Exclusiva <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {featuredLandings.length ? (
        <section className="section wp-featured-landing-section">
          <div className="container">
            <div className="wp-section-head wp-featured-landing-head">
              <p className="wp-section-eyebrow">Conheça nossos projetos</p>
              <h2 className="section-title">Lançamentos em destaque</h2>
              <p className="section-subtitle text-card">Conheça as campanhas atuais e fale diretamente com Pedro Soares.</p>
            </div>
            <LandingPagesSlider landings={featuredLandings} />
          </div>
        </section>
      ) : null}

      <section className="section wp-palmas-lake-section" aria-labelledby="wp-palmas-lake-title">
        <div className="container">
          <div className="wp-palmas-lake-intro">
            <div className="wp-palmas-lake-copy">
              <p className="wp-section-eyebrow">Palmas Lake</p>
              <h2 id="wp-palmas-lake-title">Um novo horizonte para viver Palmas.</h2>
              <p>
                Um complexo multifuncional à beira do lago, com residências, lofts, escritórios e experiências de lazer em um só endereço.
              </p>
              <Link href="/palmas-lake" className="button button-primary">
                Conhecer o Palmas Lake <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="wp-palmas-lake-feature">
              <HomeImage
                src="/brand/palmas-lake/palmas-lake-overview.jpg"
                alt="Vista geral do complexo Palmas Lake à beira do lago"
                sizes="(max-width: 760px) 100vw, 48vw"
                className="wp-cover-image"
              />
              <span className="wp-palmas-lake-feature-shade" aria-hidden="true" />
              <span className="wp-palmas-lake-feature-label">Um endereço · seis experiências</span>
            </div>
          </div>

          <div className="wp-palmas-lake-grid">
            {palmasLakeTowers.map((tower, index) => (
              <Link key={tower.href} href={tower.href} className="wp-palmas-lake-card">
                <div className="wp-palmas-lake-card-media">
                  <HomeImage
                    src={tower.image}
                    alt={`Conheça o ${tower.name}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                    className="wp-cover-image"
                  />
                  <span className="wp-image-shade" aria-hidden="true" />
                  <span className="wp-palmas-lake-card-number">0{index + 1}</span>
                </div>
                <div className="wp-palmas-lake-card-body">
                  <p>{tower.type}</p>
                  <h3>{tower.name}</h3>
                  <span>{tower.description}</span>
                  <strong>Ver detalhes <span aria-hidden="true">↗</span></strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section wp-soft-section">
        <div className="container">
          <div className="wp-section-head">
            <h2 className="section-title">Bairros em destaque</h2>
            <p className="section-subtitle text-card">
              Bairros com maior oferta e oportunidades de negociação em Palmas.
            </p>
          </div>
          {areaCards.length ? (
            <div className="wp-area-grid">
              {areaCards.map((area) => (
                <Link
                  key={area.key}
                  href={`/imoveis/prontos?city=${encodeURIComponent(area.city)}&district=${encodeURIComponent(area.district)}`}
                  className="wp-area-card"
                >
                  <HomeImage
                    src={area.imageUrl}
                    alt=""
                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                    className="wp-cover-image"
                  />
                  <span className="wp-image-shade" aria-hidden="true" />
                  <span>{area.city}</span>
                  <h3>{area.district}</h3>
                  <strong>{formatCountLabel(area.count, "imóvel", "imóveis")}</strong>
                </Link>
              ))}
            </div>
          ) : (
            <article className="card" style={{ padding: 16 }}>
              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                Nenhuma região com imóveis disponíveis no backend.
              </p>
            </article>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="container">
          <div className="wp-section-head">
            <h2 className="section-title">Buscas populares em Palmas</h2>
            <p className="section-subtitle text-card">
              Acesse páginas específicas por bairro e objetivo para encontrar oportunidades com mais rapidez.
            </p>
          </div>
          <div className="wp-type-switches" style={{ marginTop: 18 }}>
            <Link href="/palmas-to/imoveis-leilao" className="wp-type-chip">Imóveis de Leilão em Palmas</Link>
            <Link href="/palmas-to/plano-diretor-sul/imoveis" className="wp-type-chip">Plano Diretor Sul</Link>
            <Link href="/palmas-to/plano-diretor-norte/imoveis" className="wp-type-chip">Plano Diretor Norte</Link>
            <Link href="/palmas-to/orla-da-graciosa/imoveis" className="wp-type-chip">Orla da Graciosa</Link>
            <Link href="/palmas-to/taquaralto/imoveis" className="wp-type-chip">Taquaralto</Link>
            <Link href="/palmas-to/aureny/imoveis" className="wp-type-chip">Aureny</Link>
            <Link href="/palmas-to/centro/imoveis" className="wp-type-chip">Centro de Palmas</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="wp-featured-properties-head">
            <div className="wp-section-head">
              <p className="wp-section-eyebrow">Seleção atual</p>
              <h2 className="section-title">Imóveis em destaque</h2>
              <p className="section-subtitle text-card">Oportunidades disponíveis, selecionadas para morar ou investir.</p>
            </div>
            <Link href="/imoveis/prontos" className="button button-ghost">Ver todos os imóveis</Link>
          </div>

          {featuredProperties.length ? (
            <div className="wp-property-grid" style={{ marginTop: 20 }}>
              {featuredProperties.map((property) => {
                return (
                  <article key={property.id} className="wp-property-card">
                    <div className="wp-property-media">
                      <HomeImage
                        src={property.imageUrl}
                        alt={property.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                        className="wp-cover-image"
                      />
                      <span className="wp-image-shade" aria-hidden="true" />
                      <div className="wp-media-badges">
                        <span className="badge">{property.purposeLabel}</span>
                        <span className="badge">{property.typeLabel}</span>
                      </div>
                      <p>{property.city} • {property.district}</p>
                    </div>
                    <div className="wp-property-body">
                      <h3>{property.title}</h3>
                      <p className="wp-price">{formatCurrencyBRL(property.price)}</p>
                      <PropertySpecs
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        parkingSpaces={property.parkingSpaces}
                        areaM2={property.areaM2}
                      />
                      <Link href={property.href} className="button button-primary" style={{ width: "100%" }}>
                        Ver imóvel
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <article className="card" style={{ padding: 16, marginTop: 20 }}>
              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                Nenhum imóvel disponível no backend.
              </p>
            </article>
          )}
        </div>
      </section>

      <section className="section wp-soft-section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="wp-section-head">
            <p className="wp-section-eyebrow">Experiência do início ao fechamento</p>
            <h2 className="section-title">Decisão imobiliária com clareza.</h2>
            <p className="section-subtitle text-card">
              Você não precisa navegar sozinho entre anúncios, tabelas e documentos para encontrar a melhor oportunidade.
            </p>
          </div>

          <div className="wp-trust-grid">
            <article className="wp-trust-card">
              <span className="wp-trust-card-index">01</span>
              <h3>Curadoria objetiva</h3>
              <p>Imóveis e lançamentos organizados por objetivo, localização e momento de compra.</p>
            </article>
            <article className="wp-trust-card">
              <span className="wp-trust-card-index">02</span>
              <h3>Análise que orienta</h3>
              <p>Informações essenciais para comparar opções com mais segurança e menos ruído.</p>
            </article>
            <article className="wp-trust-card">
              <span className="wp-trust-card-index">03</span>
              <h3>Atendimento direto</h3>
              <p>Conversa clara no WhatsApp para tirar dúvidas e avançar no seu ritmo.</p>
            </article>
          </div>
          <div className="wp-trust-action">
            <a
              href="https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20encontrar%20um%20im%C3%B3vel."
              target="_blank"
              rel="noreferrer"
              className="button button-whatsapp"
            >
              Falar com Pedro
            </a>
          </div>
        </div>
      </section>

      {blogPosts.length ? (
        <section className="section" style={{ paddingTop: 24 }}>
          <div className="container">
            <div className="wp-section-head">
              <h2 className="section-title">Do blog</h2>
              <p className="section-subtitle text-card">
                Análises do mercado, dicas para comprar e bastidores de Palmas TO.
              </p>
            </div>

            <div className="wp-property-grid wp-property-grid-3" style={{ marginTop: 24 }}>
              {blogPosts.map((post) => {
                const cover = post.coverImageUrl ?? "/brand/logo-light-bg.png";
                return (
                  <article key={post.id} className="wp-property-card compact">
                    <div className="wp-property-media">
                      <HomeImage
                        src={cover}
                        alt={post.title}
                        sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                        className="wp-cover-image"
                      />
                      <span className="wp-image-shade" aria-hidden="true" />
                      <div className="wp-media-badges">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag.id} className="badge">
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="wp-property-body">
                      <p
                        className="text-card"
                        style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--fs-12)" }}
                      >
                        {post.publishedAt
                          ? new Intl.DateTimeFormat("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric"
                            }).format(post.publishedAt)
                          : ""}
                      </p>
                      <h3 style={{ marginTop: 6 }}>{post.title}</h3>
                      <p className="text-card" style={{ marginTop: 6 }}>
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="button button-primary"
                        style={{ width: "100%", marginTop: 12 }}
                      >
                        Ler post
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Link href="/blog" className="button button-ghost">
                Ver todos os posts
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container wp-cta-bar">
          <h3>Quer vender ou alugar seu imóvel? Entre em contato.</h3>
          <div>
            <a
              className="button button-whatsapp"
              href="https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20vender%20ou%20alugar%20meu%20im%C3%B3vel."
              target="_blank"
              rel="noreferrer"
            >
              Falar sobre captação
            </a>
            <Link className="button button-primary" href="/gestao-exclusiva">
              Gestão exclusiva
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
