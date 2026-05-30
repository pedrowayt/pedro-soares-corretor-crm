import type { Metadata } from "next";
import { PropertyPurpose } from "@prisma/client";
import Link from "next/link";
import { PropertyCardHorizontal } from "@/components/public/property-card-horizontal";
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

const typeOptions = PROPERTY_TYPE_OPTIONS;

const sortOptions = [
  { value: "", label: "Mais relevantes" },
  { value: "newest", label: "Mais recentes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "area-desc", label: "Maior área" }
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

export const metadata: Metadata = {
  title: "Imóveis prontos em Palmas TO | Casas e apartamentos",
  description:
    "Veja imóveis prontos em Palmas TO com filtros por bairro, valor, quartos e metragem. Atendimento direto com Pedro Soares.",
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

type CardProperty = {
  id: string;
  slug: string;
  title: string;
  city: string;
  district: string;
  priceValue: number;
  areaM2Value: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
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

  const properties = (await listPublicProperties({
    city: city || undefined,
    district: district || undefined,
    minPrice,
    maxPrice,
    bedrooms,
    minAreaM2,
    type,
    purpose
  })) as CardProperty[];

  const filtered = properties.filter(
    (property) =>
      !(property as unknown as { isAuctionOpportunity?: boolean }).isAuctionOpportunity &&
      !(property as unknown as { auctionCase?: unknown }).auctionCase
  );

  const sorted = sortProperties(filtered, sort);

  const totalCount = sorted.length;
  const purposeTab = purpose ?? "VENDA";
  const headingLocation = city ? city : "Palmas e região";

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Imóveis prontos em Palmas TO",
    description:
      "Listagem de imóveis prontos com filtros por região, tipologia e faixa de valor.",
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
      sort: sort || undefined
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
                {totalCount.toLocaleString("pt-BR")} {totalCount === 1 ? "imóvel" : "imóveis"}{" "}
                {purposeTabs.find((t) => t.value === purposeTab)?.cta ?? "à venda"}
              </h1>
              <p className="listing-page-subtitle">em {headingLocation}</p>
            </div>
            <form method="GET" className="listing-sort">
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
              <button type="submit" className="visually-hidden">Aplicar</button>
            </form>
          </div>

          <div className="listing-layout">
            <aside className="listing-filters" aria-label="Filtros">
              <details className="listing-filters-details">
                <summary className="listing-filters-summary">
                  <span>Filtros</span>
                  <span className="listing-filters-summary-chevron" aria-hidden="true">
                    ▾
                  </span>
                </summary>
              <form method="GET" className="listing-filters-form">
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
                </div>

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
                  Aplicar filtros
                </button>
              </form>
              </details>
            </aside>

            <section className="listing-results" aria-label="Resultados">
              {sorted.length ? (
                <ul className="listing-results-list">
                  {sorted.map((property) => (
                    <li key={property.id}>
                      <PropertyCardHorizontal
                        slug={property.slug}
                        title={property.title}
                        city={property.city}
                        district={property.district}
                        price={property.priceValue}
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        parkingSpaces={property.parkingSpaces}
                        areaM2={property.areaM2Value}
                        imageUrl={property.media?.[0]?.url}
                        status={property.status}
                        purposeLabel={purposeLabelFor(property.purpose)}
                        typeLabel={typeLabelFor(property.type)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <article className="card" style={{ padding: 16 }}>
                  <p style={{ margin: 0, color: "var(--text-muted)" }}>
                    Nenhum imóvel encontrado com os filtros atuais. Ajuste os critérios e tente novamente.
                  </p>
                </article>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
