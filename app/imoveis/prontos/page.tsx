import type { Metadata } from "next";
import { PropertyPurpose } from "@prisma/client";
import Link from "next/link";
import { AutoSubmitForm } from "@/components/public/auto-submit-form";
import { LaunchCardHorizontal } from "@/components/public/launch-card-horizontal";
import { LandingPagesSlider } from "@/components/public/landing-pages-slider";
import { MobileFilterToggle } from "@/components/public/mobile-filter-toggle";
import { PropertyCardHorizontal } from "@/components/public/property-card-horizontal";
import { listPublicCatalogLaunches, toPublicLandingPage, type PublicCatalogLaunch } from "@/lib/data/public-catalog";
import { listPublicProperties } from "@/lib/data/properties";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/property-types";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

const allowedPurposes = ["VENDA", "LOCACAO", "INVESTIMENTO"] as const;

const purposeTabs: Array<{ value: PropertyPurpose; label: string; cta: string }> = [
  { value: "VENDA", label: "Comprar", cta: "à venda" },
  { value: "LOCACAO", label: "Alugar", cta: "para alugar" },
  { value: "INVESTIMENTO", label: "Investir", cta: "para investimento" }
];

const investmentSources = [
  { value: "", label: "Todas as oportunidades" },
  { value: "launches", label: "Lançamentos" },
  { value: "ready", label: "Imóveis prontos" },
  { value: "land", label: "Terrenos e lotes" }
] as const;

type InvestmentSource = (typeof investmentSources)[number]["value"];

const catalogSources = [
  { value: "", label: "Todos" },
  { value: "ready", label: "Imóveis prontos" },
  { value: "launches", label: "Lançamentos" }
] as const;

type CatalogSource = (typeof catalogSources)[number]["value"];

const typeOptions = PROPERTY_TYPE_OPTIONS;

const sortOptions = [
  { value: "", label: "Mais relevantes" },
  { value: "newest", label: "Mais recentes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "area-desc", label: "Maior área" }
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

const baseMetadata: Metadata = {
  title: "Imóveis e lançamentos em Palmas TO | Casas e apartamentos",
  description:
    "Veja imóveis prontos e lançamentos em Palmas TO com filtros por bairro, valor, quartos e metragem. Atendimento direto com Pedro Soares.",
  keywords: [
    "imóveis prontos em Palmas TO",
    "casas prontas em Palmas",
    "apartamentos prontos em Palmas",
    "imóveis para comprar em Palmas",
    "imóveis para alugar em Palmas"
  ],
  alternates: {
    canonical: `${baseUrl}/imoveis/prontos`
  }
};

type FilterSearchParams = Record<string, string | string[] | undefined>;

function hasFilterQuery(searchParams: FilterSearchParams) {
  return Object.values(searchParams).some((value) =>
    Array.isArray(value) ? value.some((item) => Boolean(item)) : Boolean(value)
  );
}

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<FilterSearchParams>;
}): Promise<Metadata> {
  const filters = await searchParams;

  return {
    ...baseMetadata,
    robots: hasFilterQuery(filters) ? { index: false, follow: true } : undefined
  };
}

function parseNumber(value: string | string[] | undefined) {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseType(value: string | string[] | undefined) {
  if (typeof value !== "string") return undefined;
  const found = typeOptions.find((item) => item.value === value);
  return found?.value;
}

function parsePurpose(value: string | string[] | undefined): PropertyPurpose | undefined {
  if (typeof value !== "string" || !value) return undefined;
  return (allowedPurposes as readonly string[]).includes(value)
    ? (value as PropertyPurpose)
    : undefined;
}

function parseSort(value: string | string[] | undefined): SortValue {
  if (typeof value !== "string") return "";
  return (sortOptions.find((item) => item.value === value)?.value ?? "") as SortValue;
}

function parseInvestmentSource(value: string | string[] | undefined): InvestmentSource {
  if (typeof value !== "string") return "";
  return investmentSources.some((option) => option.value === value)
    ? (value as InvestmentSource)
    : "";
}

function parseCatalogSource(value: string | string[] | undefined): CatalogSource {
  if (typeof value !== "string") return "";
  return catalogSources.some((option) => option.value === value) ? (value as CatalogSource) : "";
}

function countLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

type CardProperty = {
  id: string;
  slug: string;
  title: string;
  city: string;
  district: string;
  priceValue: number;
  areaM2Value: number | null;
  landAreaM2Value?: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  suites?: number | null;
  livingRooms?: number | null;
  parkingSpaces: number | null;
  frontMeters?: number | null;
  backMeters?: number | null;
  sideLeftMeters?: number | null;
  sideRightMeters?: number | null;
  ceilingHeightM?: number | null;
  floorNumber?: number | null;
  floorCount?: number | null;
  unitCount?: number | null;
  status: string;
  type: string;
  purpose: PropertyPurpose;
  media?: ReadonlyArray<{ url: string }>;
  createdAt?: Date;
  updatedAt?: Date;
};

function sortProperties(list: CardProperty[], sort: SortValue): CardProperty[] {
  switch (sort) {
    case "price-asc":
      return [...list].sort((a, b) => a.priceValue - b.priceValue);
    case "price-desc":
      return [...list].sort((a, b) => b.priceValue - a.priceValue);
    case "area-desc":
      return [...list].sort((a, b) => (b.areaM2Value ?? 0) - (a.areaM2Value ?? 0));
    case "newest":
      return [...list].sort(
        (a, b) =>
          (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
          (a.createdAt ? new Date(a.createdAt).getTime() : 0)
      );
    default:
      return list;
  }
}

function purposeLabelFor(purpose: PropertyPurpose) {
  return purposeTabs.find((tab) => tab.value === purpose)?.label;
}

function typeLabelFor(typeValue: string) {
  return typeOptions.find((option) => option.value === typeValue)?.label;
}

export default async function ImoveisProntosPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParams;

  const city = typeof filters.city === "string" ? filters.city.trim() : "";
  const district = typeof filters.district === "string" ? filters.district.trim() : "";
  const minPrice = parseNumber(filters.minPrice);
  const maxPrice = parseNumber(filters.maxPrice);
  const bedrooms = parseNumber(filters.bedrooms);
  const minAreaM2 = parseNumber(filters.minAreaM2);
  const type = parseType(filters.type);
  const purpose = parsePurpose(filters.purpose);
  const sort = parseSort(filters.sort);
  const investmentSource = parseInvestmentSource(filters.investmentSource);
  const catalogSource = parseCatalogSource(filters.catalogSource);

  const activePurpose = purpose ?? "VENDA";
  const isInvestmentPage = activePurpose === "INVESTIMENTO";
  const effectiveSource = isInvestmentPage && investmentSource ? investmentSource : catalogSource;
  const showInvestmentProperties = effectiveSource !== "launches";
  const showInvestmentLandings =
    activePurpose !== "LOCACAO" && effectiveSource !== "ready" && effectiveSource !== "land";
  const investmentType =
    isInvestmentPage && investmentSource === "land" && !type ? undefined : type;

  const properties = showInvestmentProperties
    ? ((await listPublicProperties({
        city: city || undefined,
        district: district || undefined,
        minPrice,
        maxPrice,
        bedrooms,
        minAreaM2,
        type: investmentType,
        purpose: isInvestmentPage ? undefined : activePurpose,
        investmentOnly: isInvestmentPage
      })) as CardProperty[])
    : [];

  const filtered = properties.filter(
    (property) =>
      !(property as unknown as { isAuctionOpportunity?: boolean }).isAuctionOpportunity &&
      !(property as unknown as { auctionCase?: unknown }).auctionCase &&
      (investmentSource !== "land" || ["LOTE", "LOTE_EM_CONDOMINIO"].includes(property.type))
  );

  const sorted = sortProperties(filtered, sort);

  const launches = showInvestmentLandings
    ? await listPublicCatalogLaunches({
        city: city || undefined,
        district: district || undefined,
        minPrice,
        maxPrice,
        bedrooms,
        minAreaM2,
        type
      })
    : [];

  type CatalogResult =
    | { source: "PROPERTY"; item: CardProperty }
    | { source: "LAUNCH"; item: PublicCatalogLaunch };

  const combinedResults: CatalogResult[] = [
    ...(showInvestmentProperties ? sorted.map((item) => ({ source: "PROPERTY" as const, item })) : []),
    ...launches.map((item) => ({ source: "LAUNCH" as const, item }))
  ];

  const sortedCatalogResults = [...combinedResults].sort((a, b) => {
    if (!sort) return a.source === b.source ? 0 : a.source === "PROPERTY" ? -1 : 1;

    if (sort === "newest") {
      const dateFor = (result: CatalogResult) => {
        const value = result.item.updatedAt ?? result.item.createdAt;
        return value ? new Date(value).getTime() : 0;
      };
      return dateFor(b) - dateFor(a);
    }

    if (sort === "price-asc" || sort === "price-desc") {
      const priceFor = (result: CatalogResult) =>
        result.source === "PROPERTY" ? result.item.priceValue : result.item.startingPrice;
      const aPrice = priceFor(a);
      const bPrice = priceFor(b);
      if (aPrice === null && bPrice === null) return 0;
      if (aPrice === null) return 1;
      if (bPrice === null) return -1;
      return sort === "price-asc" ? aPrice - bPrice : bPrice - aPrice;
    }

    if (sort === "area-desc") {
      const areaFor = (result: CatalogResult) =>
        result.source === "PROPERTY"
          ? result.item.areaM2Value ?? result.item.landAreaM2Value ?? 0
          : result.item.areaFromM2 ?? 0;
      return areaFor(b) - areaFor(a);
    }

    return 0;
  });

  const propertyCount = sorted.length;
  const totalCount = combinedResults.length;
  const purposeTab = activePurpose;
  const headingLocation = city ? city : "Palmas e região";

  const launchCount = launches.length;
  const activeFilterCount = [
    purpose && purpose !== "VENDA" ? purpose : "",
    city,
    district,
    type,
    minPrice,
    maxPrice,
    bedrooms,
    minAreaM2,
    investmentSource,
    catalogSource
  ].filter((value) => value !== undefined && value !== null && value !== "").length;
  const investmentEmptyLabel = investmentSource === "land" ? "terreno ou lote" : "imóvel pronto";
  const launchSummary = countLabel(launchCount, "lançamento selecionado", "lançamentos selecionados");
  const propertySummary = countLabel(
    propertyCount,
    investmentSource === "land" ? "terreno ou lote" : "imóvel pronto",
    investmentSource === "land" ? "terrenos e lotes" : "imóveis prontos"
  );
  const investmentSummary =
    investmentSource === "launches"
      ? launchSummary
      : investmentSource === "ready"
        ? `${propertySummary} para avaliar`
        : investmentSource === "land"
          ? `${propertySummary} para avaliar`
          : `${launchSummary} e ${propertySummary} para avaliar`;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Imóveis e lançamentos em Palmas TO",
    description:
      "Listagem de imóveis prontos e lançamentos com filtros por região, tipologia e faixa de valor.",
    url: `${baseUrl}/imoveis/prontos`
  };

  function hrefWith(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const current: Record<string, string | undefined> = {
      purpose: purpose,
      city: city || undefined,
      district: district || undefined,
      type: type,
      minPrice: typeof minPrice === "number" ? String(minPrice) : undefined,
      maxPrice: typeof maxPrice === "number" ? String(maxPrice) : undefined,
      bedrooms: typeof bedrooms === "number" ? String(bedrooms) : undefined,
      minAreaM2: typeof minAreaM2 === "number" ? String(minAreaM2) : undefined,
      sort: sort || undefined,
      investmentSource: investmentSource || undefined,
      catalogSource: catalogSource || undefined
    };
    const merged = { ...current, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `/imoveis/prontos?${qs}` : "/imoveis/prontos";
  }

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
            <span>Prontos</span>
          </nav>

          <div className="listing-page-head">
            <div>
              <h1 className="listing-page-title">
                {isInvestmentPage
                  ? "Oportunidades para investir"
                  : `${totalCount.toLocaleString("pt-BR")} ${totalCount === 1 ? "resultado" : "resultados"} ${purposeTabs.find((t) => t.value === purposeTab)?.cta ?? "à venda"}`}
              </h1>
              <p className="listing-page-subtitle">
                {isInvestmentPage
                  ? `${investmentSummary}${city || district ? ` em ${headingLocation}` : ""}`
                  : `em ${headingLocation}`}
              </p>
            </div>
            <AutoSubmitForm method="GET" className="listing-sort">
              <label htmlFor="sort">Ordenar por</label>
              <select id="sort" name="sort" defaultValue={sort} aria-label="Ordenar resultados">
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* preserve current query state on form submit */}
              {purpose ? <input type="hidden" name="purpose" value={purpose} /> : null}
              {city ? <input type="hidden" name="city" value={city} /> : null}
              {district ? <input type="hidden" name="district" value={district} /> : null}
              {type ? <input type="hidden" name="type" value={type} /> : null}
              {typeof minPrice === "number" ? <input type="hidden" name="minPrice" value={String(minPrice)} /> : null}
              {typeof maxPrice === "number" ? <input type="hidden" name="maxPrice" value={String(maxPrice)} /> : null}
              {typeof bedrooms === "number" ? <input type="hidden" name="bedrooms" value={String(bedrooms)} /> : null}
              {typeof minAreaM2 === "number" ? <input type="hidden" name="minAreaM2" value={String(minAreaM2)} /> : null}
              {investmentSource ? <input type="hidden" name="investmentSource" value={investmentSource} /> : null}
              {catalogSource ? <input type="hidden" name="catalogSource" value={catalogSource} /> : null}
              <button type="submit" className="visually-hidden">Aplicar</button>
            </AutoSubmitForm>
          </div>

          {(purposeTab === "VENDA" || purposeTab === "INVESTIMENTO") &&
          showInvestmentLandings &&
          launches.length ? (
            <section className="listing-related-landings" aria-labelledby="listing-related-landings-title">
              <div className="listing-related-landings-head">
                <p className="wp-section-eyebrow">Empreendimentos em destaque</p>
                <h2 id="listing-related-landings-title">
                  {purposeTab === "VENDA"
                    ? "Encontre também um lançamento para morar ou investir"
                    : "Lançamentos para investir"}
                </h2>
                <p>
                  {purposeTab === "VENDA"
                    ? "Explore projetos selecionados em detalhe e fale diretamente comigo sobre plantas, localização e condições."
                    : "Compare localização, estágio, perfil do projeto e condições antes de decidir onde investir."}
                </p>
              </div>
              <LandingPagesSlider
                landings={launches.map(toPublicLandingPage)}
                entryPoint={purposeTab === "VENDA" ? "imoveis-prontos-venda" : "imoveis-prontos-investimento"}
              />
            </section>
          ) : null}

          <div className="listing-layout">
            <aside className="listing-filters" aria-label="Filtros">
              <MobileFilterToggle
                activeFilterCount={activeFilterCount}
                resultCount={totalCount}
                formId="listing-filters-form"
                clearHref="/imoveis/prontos"
              >
              <AutoSubmitForm id="listing-filters-form" method="GET" className="listing-filters-form" manualOnMobile>
                <div className="listing-filters-head">
                  <h2 className="listing-filters-title">Filtros</h2>
                  <Link href="/imoveis/prontos" className="listing-filters-clear">
                    Limpar tudo
                  </Link>
                </div>

                <div className="listing-purpose-tabs" role="tablist">
                  {purposeTabs.map((tab) => {
                    const isActive = (purpose ?? "VENDA") === tab.value;
                    return (
                      <Link
                        key={tab.value}
                        href={hrefWith({ purpose: tab.value })}
                        className={`listing-purpose-tab${isActive ? " is-active" : ""}`}
                        role="tab"
                        aria-selected={isActive ? "true" : "false"}
                      >
                        {tab.label}
                      </Link>
                    );
                  })}
                  {/* keep this submit happy with purpose */}
                  <input type="hidden" name="purpose" value={purposeTab} />
                  <input type="hidden" name="sort" value={sort} />
                  {investmentSource ? <input type="hidden" name="investmentSource" value={investmentSource} /> : null}
                  {catalogSource ? <input type="hidden" name="catalogSource" value={catalogSource} /> : null}
                </div>

                {!isInvestmentPage && purposeTab === "VENDA" ? (
                  <div className="listing-filter-block">
                    <h3>Mostrar</h3>
                    <div className="listing-chip-group">
                      {catalogSources.map((option) => {
                        const isActive = catalogSource === option.value;
                        return (
                          <Link
                            key={option.value || "all"}
                            href={hrefWith({ catalogSource: option.value || undefined })}
                            className={`listing-chip${isActive ? " is-active" : ""}`}
                            aria-pressed={isActive ? "true" : "false"}
                          >
                            {option.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {isInvestmentPage ? (
                  <div className="listing-filter-block">
                    <h3>O que você quer comparar?</h3>
                    <div className="listing-chip-group">
                      {investmentSources.map((option) => {
                        const isActive = investmentSource === option.value;
                        return (
                          <Link
                            key={option.value || "all"}
                            href={hrefWith({ investmentSource: option.value || undefined })}
                            className={`listing-chip${isActive ? " is-active" : ""}`}
                            aria-pressed={isActive ? "true" : "false"}
                          >
                            {option.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="listing-filter-block">
                  <h3>Localização</h3>
                  <div className="listing-filter-fields">
                    <input
                      name="city"
                      defaultValue={city}
                      placeholder="Cidade"
                      aria-label="Cidade"
                    />
                    <input
                      name="district"
                      defaultValue={district}
                      placeholder="Bairro ou região"
                      aria-label="Bairro"
                    />
                  </div>
                </div>

                <div className="listing-filter-block">
                  <h3>Tipo de imóvel</h3>
                  <select name="type" defaultValue={type ?? ""} aria-label="Tipo de imóvel">
                    <option value="">Todos os tipos</option>
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="listing-filter-block">
                  <h3>Preço (R$)</h3>
                  <div className="listing-filter-fields listing-filter-fields-2">
                    <input
                      name="minPrice"
                      type="number"
                      min={0}
                      step={10000}
                      defaultValue={minPrice ?? ""}
                      placeholder="Mínimo"
                    />
                    <input
                      name="maxPrice"
                      type="number"
                      min={0}
                      step={10000}
                      defaultValue={maxPrice ?? ""}
                      placeholder="Máximo"
                    />
                  </div>
                </div>

                <div className="listing-filter-block">
                  <h3>Quartos (mínimo)</h3>
                  <div className="listing-chip-group">
                    {[1, 2, 3, 4].map((n) => {
                      const isActive = bedrooms === n;
                      return (
                        <Link
                          key={n}
                          href={hrefWith({ bedrooms: isActive ? undefined : String(n) })}
                          className={`listing-chip${isActive ? " is-active" : ""}`}
                          aria-pressed={isActive ? "true" : "false"}
                        >
                          +{n}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="listing-filter-block">
                  <h3>Área mínima (m²)</h3>
                  <input
                    name="minAreaM2"
                    type="number"
                    min={0}
                    step={10}
                    defaultValue={minAreaM2 ?? ""}
                    placeholder="Ex.: 70"
                  />
                </div>

                <button type="submit" className="button button-primary listing-filters-apply">
                  <span className="listing-filters-apply-desktop">Aplicar filtros</span>
                  <span className="listing-filters-apply-mobile">Ver resultados</span>
                </button>
              </AutoSubmitForm>
              </MobileFilterToggle>
            </aside>

            <section id="listing-results" className="listing-results" aria-label="Resultados">
              {showInvestmentProperties && isInvestmentPage ? (
                <div className="listing-results-head">
                  <p className="wp-section-eyebrow">
                    {investmentSource === "land" ? "Terrenos e lotes" : "Imóveis prontos"}
                  </p>
                  <h2>{investmentSource === "land" ? "Terrenos e lotes para investir" : "Imóveis prontos para investir"}</h2>
                  <p>
                    {investmentSource === "land"
                      ? "Opções de terreno e lote em condomínio para avaliar localização, entrada e potencial de valorização."
                      : "Opções cadastradas com destaque para renda, liquidez ou potencial de valorização."}
                  </p>
                </div>
              ) : null}

              {sortedCatalogResults.length ? (
                <ul className="listing-results-list">
                  {sortedCatalogResults.map((result) => {
                    if (result.source === "LAUNCH") {
                      return (
                        <li key={result.item.id}>
                          <LaunchCardHorizontal
                            href={result.item.href}
                            title={result.item.title}
                            city={result.item.city}
                            district={result.item.district}
                            category={result.item.category}
                            status={result.item.status}
                            summary={result.item.summary}
                            imageUrl={result.item.imageUrl}
                            startingPrice={result.item.startingPrice}
                            bedroomsFrom={result.item.bedroomsFrom}
                            areaFromM2={result.item.areaFromM2}
                          />
                        </li>
                      );
                    }

                    const property = result.item;
                    return (
                      <li key={property.id}>
                        <PropertyCardHorizontal
                          slug={property.slug}
                          title={property.title}
                          city={property.city}
                          district={property.district}
                          price={property.priceValue}
                          type={property.type}
                          bedrooms={property.bedrooms}
                          bathrooms={property.bathrooms}
                          suites={property.suites}
                          livingRooms={property.livingRooms}
                          parkingSpaces={property.parkingSpaces}
                          areaM2={property.areaM2Value}
                          landAreaM2={property.landAreaM2Value}
                          frontMeters={property.frontMeters}
                          backMeters={property.backMeters}
                          sideLeftMeters={property.sideLeftMeters}
                          sideRightMeters={property.sideRightMeters}
                          ceilingHeightM={property.ceilingHeightM}
                          floorNumber={property.floorNumber}
                          floorCount={property.floorCount}
                          unitCount={property.unitCount}
                          imageUrl={property.media?.[0]?.url}
                          status={property.status}
                          purposeLabel={isInvestmentPage ? "Investir" : purposeLabelFor(property.purpose)}
                          typeLabel={typeLabelFor(property.type)}
                        />
                      </li>
                    );
                  })}
                </ul>
              ) : showInvestmentProperties ? (
                <article className="card" style={{ padding: 16 }}>
                  <p style={{ margin: 0, color: "var(--text-muted)" }}>
                    Nenhum {investmentEmptyLabel} encontrado com esses critérios. Você ainda pode explorar os lançamentos acima.
                  </p>
                </article>
              ) : null}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
