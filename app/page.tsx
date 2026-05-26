import { PropertyPurpose, PropertyStatus, PropertyType } from "@prisma/client";
import Link from "next/link";
import { developmentPublicStageLabels, listHighlightedDevelopments } from "@/lib/data/developments";
import { getDevelopmentStageLabel } from "@/lib/development-investment";
import { listPublicProperties } from "@/lib/data/properties";
import { formatCurrencyBRL } from "@/lib/utils";

type SearchMode = "prontos" | "planta" | "leilao";

type HomePropertyCard = {
  id: string;
  href: string;
  title: string;
  city: string;
  district: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
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

type CategoryCard = {
  label: string;
  type: PropertyType;
  count: number;
  imageUrl: string;
};

const purposeLabelMap: Record<PropertyPurpose, string> = {
  VENDA: "Venda",
  LOCACAO: "Locação",
  INVESTIMENTO: "Investimento",
  LEILAO: "Leilão",
  LANCAMENTO: "Lançamento"
};

const typeLabelMap: Record<PropertyType, string> = {
  CASA: "Casa",
  APARTAMENTO: "Apartamento",
  LOTE: "Lote",
  COMERCIAL: "Comercial",
  RURAL: "Rural"
};

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

const propertyTypeOrder: PropertyType[] = ["CASA", "APARTAMENTO", "LOTE", "COMERCIAL", "RURAL"];

function normalizePropertyCard(property: {
  id: string;
  slug: string;
  title: string;
  city: string;
  district: string;
  priceValue: number;
  bedrooms: number | null;
  bathrooms: number | null;
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

function buildCategoryCards(properties: HomePropertyCard[]) {
  const categoryMap = new Map<PropertyType, CategoryCard>();

  for (const property of properties) {
    const existing = categoryMap.get(property.type);

    if (existing) {
      existing.count += 1;
      continue;
    }

    categoryMap.set(property.type, {
      label: property.typeLabel,
      type: property.type,
      count: 1,
      imageUrl: property.imageUrl
    });
  }

  return [...categoryMap.values()].sort(
    (a, b) => propertyTypeOrder.indexOf(a.type) - propertyTypeOrder.indexOf(b.type)
  );
}

function getSearchMode(modeInput: string | string[] | undefined): SearchMode {
  if (modeInput === "planta") return "planta";
  if (modeInput === "leilao") return "leilao";
  return "prontos";
}

function formatCountLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParams;
  const searchMode = getSearchMode(filters.mode);

  const [propertiesRaw, developmentsRaw] = await Promise.all([
    listPublicProperties(),
    listHighlightedDevelopments(8)
  ]);

  const allCards = propertiesRaw.map(normalizePropertyCard);
  const readySaleCards = allCards.filter(
    (card) => card.purpose === "VENDA" && !isAuctionCard(card) && card.status === "DISPONIVEL"
  );

  const latestProperties = allCards.slice(0, 6);
  const auctionCards = allCards.filter(isAuctionCard).slice(0, 3);

  const developmentCards = developmentsRaw.slice(0, 3);

  const categoryCards = buildCategoryCards(readySaleCards);
  const areaCards = buildAreaCards(readySaleCards);

  const modeTabs: Array<{ key: SearchMode; label: string }> = [
    { key: "prontos", label: "Imóveis prontos" },
    { key: "planta", label: "Imóveis na planta" },
    { key: "leilao", label: "Imóveis leilão" }
  ];

  return (
    <>
      <section className="wp-hero">
        <div className="wp-hero-media" />
        <div className="wp-hero-overlay" />

        <div className="container wp-hero-content">
          <p className="wp-hero-eyebrow">Pedro Soares • Imóveis prontos, na planta e especialista em leilões</p>

          <div className="wp-search-tabs" role="tablist" aria-label="Tipos de busca">
            {modeTabs.map((tab) => (
              <Link
                key={tab.key}
                href={`/?mode=${tab.key}`}
                className={`wp-search-tab ${searchMode === tab.key ? "active" : ""}`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {searchMode === "planta" ? (
            <form className="wp-search-panel" action="/lancamentos" method="GET">
              <div>
                <label htmlFor="district">Bairro</label>
                <input id="district" name="district" placeholder="Plano Diretor Sul" />
              </div>
              <div>
                <label htmlFor="maxPrice">Preço inicial até</label>
                <input id="maxPrice" name="maxPrice" type="number" placeholder="900000" />
              </div>
              <button type="submit" className="button button-primary">
                Buscar
              </button>

              <details className="wp-search-advanced">
                <summary>Mais filtros</summary>
                <div className="wp-search-advanced-content">
                  <div>
                    <label htmlFor="publicStage">Status</label>
                    <select id="publicStage" name="publicStage" defaultValue="">
                      <option value="">Todos</option>
                      {Object.entries(developmentPublicStageLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="minPrice">Preço inicial a partir de</label>
                    <input id="minPrice" name="minPrice" type="number" placeholder="300000" />
                  </div>
                  <div>
                    <label htmlFor="bedrooms">Quartos</label>
                    <input id="bedrooms" name="bedrooms" type="number" min={1} placeholder="2" />
                  </div>
                </div>
              </details>
            </form>
          ) : (
            <form className="wp-search-panel" action={searchMode === "leilao" ? "/imoveis/leilao" : "/imoveis/prontos"} method="GET">
              {searchMode !== "leilao" ? <input type="hidden" name="purpose" value="VENDA" /> : null}
              <div>
                <label htmlFor="district-ready">Região</label>
                <input id="district-ready" name="district" placeholder="Bairro ou região" />
              </div>
              <div>
                <label htmlFor="maxPrice-ready">Preço até</label>
                <input id="maxPrice-ready" name="maxPrice" type="number" placeholder="1200000" />
              </div>
              <button type="submit" className="button button-primary">
                Buscar
              </button>

              <details className="wp-search-advanced">
                <summary>Mais filtros</summary>
                <div className="wp-search-advanced-content">
                  <div>
                    <label htmlFor="type">Tipo</label>
                    <select id="type" name="type" defaultValue="">
                      <option value="">Todos</option>
                      <option value="CASA">Casa</option>
                      <option value="APARTAMENTO">Apartamento</option>
                      <option value="LOTE">Lote</option>
                      <option value="COMERCIAL">Comercial</option>
                      <option value="RURAL">Rural</option>
                    </select>
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
      </section>

      <section className="section wp-soft-section">
        <div className="container">
          <div className="wp-section-head">
            <h2 className="section-title">Imóveis por região</h2>
            <p className="section-subtitle text-card">
              Selecione bairros com maior oferta e oportunidades de negociação em Palmas.
            </p>
          </div>
          {areaCards.length ? (
            <div className="wp-area-grid">
              {areaCards.map((area) => (
                <Link
                  key={area.key}
                  href={`/imoveis/prontos?city=${encodeURIComponent(area.city)}&district=${encodeURIComponent(area.district)}`}
                  className="wp-area-card"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(7, 13, 24, 0.08), rgba(7, 13, 24, 0.68)), url(${area.imageUrl})` }}
                >
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
            <Link href="/palmas-to/imoveis-na-planta" className="wp-type-chip">Imóveis na Planta em Palmas</Link>
            <Link href="/palmas-to/imoveis-prontos" className="wp-type-chip">Imóveis Prontos em Palmas</Link>
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

      <section className="section wp-soft-section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="wp-section-head">
            <h2 className="section-title">Imóveis na planta</h2>
            <p className="section-subtitle text-card">
              Lançamentos com ficha técnica completa, cronograma, FAQ e captação de lead por empreendimento.
            </p>
          </div>
          {developmentCards.length ? (
            <div className="wp-property-grid wp-property-grid-3" style={{ marginTop: 20 }}>
              {developmentCards.map((development) => {
                const media =
                  development.media.find((item) => item.isPrimary)?.url ??
                  development.media.find((item) => item.kind === "HERO")?.url ??
                  development.media.find((item) => item.kind === "GALLERY")?.url ??
                  "/brand/logo-light-bg.png";

                return (
                  <article key={development.id} className="wp-property-card compact">
                    <div
                      className="wp-property-media"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(7, 13, 24, 0.1), rgba(7, 13, 24, 0.68)), url(${media})`
                      }}
                    >
                      <div className="wp-media-badges">
                        <span className="badge">Lançamento</span>
                        <span className="badge">{getDevelopmentStageLabel(development.stage)}</span>
                      </div>
                      <p>{development.city} • {development.district}</p>
                    </div>
                    <div className="wp-property-body">
                      <h3>{development.title}</h3>
                      <p className="wp-price">
                        A partir de{" "}
                        {development.startingPriceNumber
                          ? formatCurrencyBRL(development.startingPriceNumber)
                          : "Sob consulta"}
                      </p>
                      <div className="wp-spec-row">
                        <span>{development.bedroomsFrom ?? "-"} a {development.bedroomsTo ?? "-"} quartos</span>
                        <span>{development.areaFromM2Number ?? "-"} a {development.areaToM2Number ?? "-"} m²</span>
                      </div>
                      <Link href={`/lancamentos/${development.slug}`} className="button button-primary" style={{ width: "100%" }}>
                        Ver empreendimento
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <article className="card" style={{ padding: 16, marginTop: 20 }}>
              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                Nenhum lançamento publicado no backend.
              </p>
            </article>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="wp-section-head">
            <h2 className="section-title">Últimos imóveis à venda</h2>
            <p className="section-subtitle text-card">Novos anúncios e ativos com melhor momento comercial.</p>
          </div>

          <div className="wp-type-switches">
            <Link href="/?mode=prontos" className={`wp-type-chip ${searchMode === "prontos" ? "active" : ""}`}>
              Imóveis prontos
            </Link>
            <Link href="/?mode=planta" className={`wp-type-chip ${searchMode === "planta" ? "active" : ""}`}>
              Imóveis na planta
            </Link>
            <Link href="/?mode=leilao" className={`wp-type-chip ${searchMode === "leilao" ? "active" : ""}`}>
              Imóveis leilão
            </Link>
          </div>

          {latestProperties.length ? (
            <div className="wp-property-grid" style={{ marginTop: 20 }}>
              {latestProperties.map((property) => {
                const isSold = property.status === "VENDIDO";
                return (
                  <article key={property.id} className={`wp-property-card ${isSold ? "is-sold" : ""}`}>
                    <div
                      className="wp-property-media"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(7, 13, 24, 0.06), rgba(7, 13, 24, 0.62)), url(${property.imageUrl})`
                      }}
                    >
                      <div className="wp-media-badges">
                        {isSold ? <span className="badge badge-tone-sold">Vendido</span> : null}
                        <span className="badge">{property.purposeLabel}</span>
                        <span className="badge">{property.typeLabel}</span>
                      </div>
                      <p>{property.city} • {property.district}</p>
                    </div>
                    <div className="wp-property-body">
                      <h3>{property.title}</h3>
                      <p className="wp-price">{formatCurrencyBRL(property.price)}</p>
                      <div className="wp-spec-row">
                        <span>{property.bedrooms ?? "-"} quartos</span>
                        <span>{property.bathrooms ?? "-"} banheiros</span>
                        <span>{property.areaM2 ?? "-"} m²</span>
                      </div>
                      <Link
                        href={property.href}
                        className={isSold ? "button button-ghost" : "button button-primary"}
                        style={{ width: "100%" }}
                      >
                        {isSold ? "Ver imóvel vendido" : "Ver imóvel"}
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
            <h2 className="section-title">Imóveis por categorias</h2>
            <p className="section-subtitle text-card">Explore o portfólio por tipo de ativo e perfil de compra.</p>
          </div>
          {categoryCards.length ? (
            <div className="wp-category-grid">
              {categoryCards.slice(0, 5).map((category, index) => (
                <Link
                  key={category.type}
                  href={`/imoveis/prontos?type=${encodeURIComponent(category.type)}`}
                  className={`wp-category-card ${index === 0 ? "large" : ""}`}
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(7, 13, 24, 0.08), rgba(7, 13, 24, 0.66)), url(${category.imageUrl})`
                  }}
                >
                  <h3>{category.label}</h3>
                  <p>{formatCountLabel(category.count, "listagem", "listagens")}</p>
                </Link>
              ))}
            </div>
          ) : (
            <article className="card" style={{ padding: 16 }}>
              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                Nenhuma categoria com imóveis prontos à venda no backend.
              </p>
            </article>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="wp-section-head">
            <h2 className="section-title">Imóveis leilão</h2>
            <p className="section-subtitle text-card">
              Oportunidades com leitura de risco, margem e suporte para tomada de decisão rápida.
            </p>
          </div>

          {auctionCards.length ? (
            <div className="wp-property-grid wp-property-grid-3" style={{ marginTop: 20 }}>
              {auctionCards.map((property) => {
                const isSold = property.status === "VENDIDO";
                return (
                  <article key={property.id} className={`wp-property-card compact ${isSold ? "is-sold" : ""}`}>
                    <div
                      className="wp-property-media"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(7, 13, 24, 0.08), rgba(7, 13, 24, 0.7)), url(${property.imageUrl})`
                      }}
                    >
                      <div className="wp-media-badges">
                        {isSold ? <span className="badge badge-tone-sold">Vendido</span> : null}
                        <span className="badge">Leilão</span>
                        <span className="badge">Oportunidade</span>
                      </div>
                      <p>{property.city} • {property.district}</p>
                    </div>
                    <div className="wp-property-body">
                      <h3>{property.title}</h3>
                      <p className="wp-price">{formatCurrencyBRL(property.price)}</p>
                      <div className="wp-spec-row">
                        <span>{property.bedrooms ?? "-"} quartos</span>
                        <span>{property.bathrooms ?? "-"} banheiros</span>
                        <span>{property.areaM2 ?? "-"} m²</span>
                      </div>
                      <Link href={property.href} className="button button-ghost" style={{ width: "100%" }}>
                        {isSold ? "Ver imóvel vendido" : "Analisar oportunidade"}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <article className="card" style={{ padding: 16, marginTop: 20 }}>
              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                Nenhuma oportunidade de leilão disponível no backend.
              </p>
            </article>
          )}
        </div>
      </section>

      <section className="section wp-soft-section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="wp-section-head">
            <h2 className="section-title">Nossa equipe</h2>
            <p className="section-subtitle text-card">
              Atendimento consultivo em imóvel pronto, lançamentos e leilões com padrão comercial único.
            </p>
          </div>

          <div className="wp-team-grid">
            <article className="wp-team-card">
              <div className="wp-team-media" style={{ backgroundImage: "url(/brand/pedro-portrait-1.png)" }} />
              <div className="wp-team-body">
                <h3>Pedro Soares</h3>
                <p>Corretor de Imóveis • CRECI 5861-TO</p>
                <a
                  href="https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20falar%20sobre%20im%C3%B3veis."
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp comercial
                </a>
              </div>
            </article>

            <article className="wp-team-card">
              <div className="wp-team-media" style={{ backgroundImage: "url(/brand/pedro-portrait-3.png)" }} />
              <div className="wp-team-body">
                <h3>Atendimento Lançamentos</h3>
                <p>Suporte para tipologias, tabela e fluxo de proposta.</p>
                <Link href="/lancamentos">Ver empreendimentos</Link>
              </div>
            </article>

            <article className="wp-team-card">
              <div className="wp-team-media" style={{ backgroundImage: "url(/brand/pedro-portrait-4.png)" }} />
              <div className="wp-team-body">
                <h3>Time Investidor e Leilão</h3>
                <p>Análise de margem, risco jurídico e potencial de revenda.</p>
                <Link href="/leiloes-oportunidades">Explorar oportunidades</Link>
              </div>
            </article>
          </div>
        </div>
      </section>

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
            <Link className="button button-primary" href="/venda-seu-imovel">
              Anunciar imóvel
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
