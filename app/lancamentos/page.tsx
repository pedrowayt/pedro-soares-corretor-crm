import type { Metadata } from "next";
import Link from "next/link";
import { DevelopmentPropertyType } from "@prisma/client";
import { AutoSubmitForm } from "@/components/public/auto-submit-form";
import { DevelopmentCardHorizontal } from "@/components/public/development-card-horizontal";
import { MobileFilterToggle } from "@/components/public/mobile-filter-toggle";
import {
  developmentPublicStageLabels,
  listPublicDevelopments,
  type PublicDevelopmentStage
} from "@/lib/data/developments";
import { publicDevelopmentStageOrder } from "@/lib/development-investment";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

const propertyTypeOptions: Array<{ value: DevelopmentPropertyType; label: string }> = [
  { value: "COMPLEXO", label: "Complexo" },
  { value: "APARTAMENTO", label: "Apartamento" },
  { value: "CASA", label: "Casa" },
  { value: "LOTE", label: "Lote" },
  { value: "SALA_COMERCIAL", label: "Sala comercial" },
  { value: "STUDIO", label: "Studio" },
  { value: "COBERTURA", label: "Cobertura" }
];

const sortOptions = [
  { value: "", label: "Mais relevantes" },
  { value: "newest", label: "Mais recentes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "delivery-asc", label: "Entrega mais próxima" }
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

export const metadata: Metadata = {
  title: "Apartamentos na planta à venda em Palmas - TO | Pedro Soares",
  description:
    "Conheça os principais lançamentos imobiliários, compare plantas, preços, localização e fale direto com Pedro Soares.",
  alternates: {
    canonical: `${baseUrl}/lancamentos`
  },
  keywords: [
    "apartamentos na planta em palmas",
    "lancamentos imobiliarios palmas to",
    "empreendimentos em palmas tocantins",
    "pedro soares corretor"
  ]
};

function parseNumber(value: string | string[] | undefined) {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseText(value: string | string[] | undefined) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parsePropertyType(value: string | string[] | undefined) {
  if (typeof value !== "string") return undefined;
  return Object.values(DevelopmentPropertyType).includes(value as DevelopmentPropertyType)
    ? (value as DevelopmentPropertyType)
    : undefined;
}

function parsePublicStage(value: string | string[] | undefined): PublicDevelopmentStage | undefined {
  if (typeof value !== "string") return undefined;
  return (publicDevelopmentStageOrder as readonly string[]).includes(value)
    ? (value as PublicDevelopmentStage)
    : undefined;
}

function parseSort(value: string | string[] | undefined): SortValue {
  if (typeof value !== "string") return "";
  return (sortOptions.find((item) => item.value === value)?.value ?? "") as SortValue;
}

type DevCard = Awaited<ReturnType<typeof listPublicDevelopments>>[number];

function sortDevelopments(list: DevCard[], sort: SortValue): DevCard[] {
  switch (sort) {
    case "price-asc":
      return [...list].sort(
        (a, b) => (a.startingPriceNumber ?? Infinity) - (b.startingPriceNumber ?? Infinity)
      );
    case "price-desc":
      return [...list].sort(
        (a, b) => (b.startingPriceNumber ?? -Infinity) - (a.startingPriceNumber ?? -Infinity)
      );
    case "delivery-asc":
      return [...list].sort((a, b) => {
        const aTs = a.deliveryDate ? new Date(a.deliveryDate).getTime() : Infinity;
        const bTs = b.deliveryDate ? new Date(b.deliveryDate).getTime() : Infinity;
        return aTs - bTs;
      });
    case "newest":
      return [...list].sort((a, b) => {
        const ax = (a as { updatedAt?: Date | string }).updatedAt;
        const bx = (b as { updatedAt?: Date | string }).updatedAt;
        return (bx ? new Date(bx).getTime() : 0) - (ax ? new Date(ax).getTime() : 0);
      });
    default:
      return list;
  }
}

export default async function LancamentosPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const filters = {
    q: parseText(params.q),
    city: parseText(params.city),
    district: parseText(params.district),
    builder: parseText(params.builder),
    publicStage: parsePublicStage(params.publicStage),
    propertyType: parsePropertyType(params.propertyType),
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
    bedrooms: parseNumber(params.bedrooms),
    minArea: parseNumber(params.minArea)
  };

  const sort = parseSort(params.sort);

  const [developments, allDevelopments] = await Promise.all([
    listPublicDevelopments(filters),
    listPublicDevelopments()
  ]);

  const cityOptions = Array.from(new Set(allDevelopments.map((item) => item.city))).sort((a, b) =>
    a.localeCompare(b)
  );
  const districtOptions = Array.from(new Set(allDevelopments.map((item) => item.district))).sort(
    (a, b) => a.localeCompare(b)
  );
  const builderOptions = Array.from(
    new Set(
      allDevelopments.map((item) => item.displayBuilderName).filter(Boolean) as string[]
    )
  ).sort((a, b) => a.localeCompare(b));

  const sorted = sortDevelopments(developments, sort);
  const totalCount = sorted.length;
  const headingLocation = filters.city ?? "Palmas e região";

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Apartamentos na planta à venda em Palmas - TO",
    description:
      "Conheça os principais lançamentos imobiliários, compare plantas, preços, localização e fale direto com um corretor.",
    url: `${baseUrl}/lancamentos`
  };

  function hrefWith(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const current: Record<string, string | undefined> = {
      publicStage: filters.publicStage,
      city: filters.city,
      district: filters.district,
      builder: filters.builder,
      propertyType: filters.propertyType,
      q: filters.q,
      minPrice: typeof filters.minPrice === "number" ? String(filters.minPrice) : undefined,
      maxPrice: typeof filters.maxPrice === "number" ? String(filters.maxPrice) : undefined,
      bedrooms: typeof filters.bedrooms === "number" ? String(filters.bedrooms) : undefined,
      minArea: typeof filters.minArea === "number" ? String(filters.minArea) : undefined,
      sort: sort || undefined
    };
    const merged = { ...current, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `/lancamentos?${qs}` : "/lancamentos";
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <main className="section listing-page">
        <div className="container">
          <nav className="listing-breadcrumb" aria-label="Você está em">
            <Link href="/">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href="/imoveis">Imóveis</Link>
            <span aria-hidden="true">/</span>
            <span>Lançamentos</span>
          </nav>

          <div className="listing-page-head">
            <div>
              <h1 className="listing-page-title">
                {totalCount.toLocaleString("pt-BR")}{" "}
                {totalCount === 1 ? "lançamento" : "lançamentos"} em {headingLocation}
              </h1>
              <p className="listing-page-subtitle">
                Compare plantas, status de obra, construtoras e fale direto com Pedro Soares.
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
              {filters.publicStage ? (
                <input type="hidden" name="publicStage" value={filters.publicStage} />
              ) : null}
              {filters.city ? <input type="hidden" name="city" value={filters.city} /> : null}
              {filters.district ? (
                <input type="hidden" name="district" value={filters.district} />
              ) : null}
              {filters.builder ? (
                <input type="hidden" name="builder" value={filters.builder} />
              ) : null}
              {filters.propertyType ? (
                <input type="hidden" name="propertyType" value={filters.propertyType} />
              ) : null}
              {filters.q ? <input type="hidden" name="q" value={filters.q} /> : null}
              {typeof filters.minPrice === "number" ? (
                <input type="hidden" name="minPrice" value={String(filters.minPrice)} />
              ) : null}
              {typeof filters.maxPrice === "number" ? (
                <input type="hidden" name="maxPrice" value={String(filters.maxPrice)} />
              ) : null}
              {typeof filters.bedrooms === "number" ? (
                <input type="hidden" name="bedrooms" value={String(filters.bedrooms)} />
              ) : null}
              {typeof filters.minArea === "number" ? (
                <input type="hidden" name="minArea" value={String(filters.minArea)} />
              ) : null}
              <button type="submit" className="visually-hidden">
                Aplicar
              </button>
            </AutoSubmitForm>
          </div>

          <div className="listing-layout">
            <aside className="listing-filters" aria-label="Filtros">
              <MobileFilterToggle>
              <AutoSubmitForm method="GET" className="listing-filters-form">
                <div className="listing-filters-head">
                  <h2 className="listing-filters-title">Filtros</h2>
                  <Link href="/lancamentos" className="listing-filters-clear">
                    Limpar tudo
                  </Link>
                </div>

                <div className="listing-filter-block">
                  <h3>Status da obra</h3>
                  <div className="listing-chip-group">
                    {publicDevelopmentStageOrder.map((stage) => {
                      const isActive = filters.publicStage === stage;
                      return (
                        <Link
                          key={stage}
                          href={hrefWith({ publicStage: isActive ? undefined : stage })}
                          className={`listing-chip${isActive ? " is-active" : ""}`}
                          aria-pressed={isActive ? "true" : "false"}
                        >
                          {developmentPublicStageLabels[stage]}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="listing-filter-block">
                  <h3>Busca livre</h3>
                  <input
                    name="q"
                    defaultValue={filters.q ?? ""}
                    placeholder="Bairro, empreendimento ou construtora"
                  />
                </div>

                <div className="listing-filter-block">
                  <h3>Localização</h3>
                  <div className="listing-filter-fields">
                    <select name="city" defaultValue={filters.city ?? ""}>
                      <option value="">Todas as cidades</option>
                      {cityOptions.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <select name="district" defaultValue={filters.district ?? ""}>
                      <option value="">Todos os bairros</option>
                      {districtOptions.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="listing-filter-block">
                  <h3>Tipo</h3>
                  <select name="propertyType" defaultValue={filters.propertyType ?? ""}>
                    <option value="">Todos</option>
                    {propertyTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="listing-filter-block">
                  <h3>Construtora</h3>
                  <select name="builder" defaultValue={filters.builder ?? ""}>
                    <option value="">Todas</option>
                    {builderOptions.map((builder) => (
                      <option key={builder} value={builder}>
                        {builder}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="listing-filter-block">
                  <h3>Preço inicial (R$)</h3>
                  <div className="listing-filter-fields listing-filter-fields-2">
                    <input
                      name="minPrice"
                      type="number"
                      min={0}
                      step={10000}
                      defaultValue={filters.minPrice ?? ""}
                      placeholder="Mínimo"
                    />
                    <input
                      name="maxPrice"
                      type="number"
                      min={0}
                      step={10000}
                      defaultValue={filters.maxPrice ?? ""}
                      placeholder="Máximo"
                    />
                  </div>
                </div>

                <div className="listing-filter-block">
                  <h3>Quartos (mínimo)</h3>
                  <div className="listing-chip-group">
                    {[1, 2, 3, 4].map((n) => {
                      const isActive = filters.bedrooms === n;
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
                    name="minArea"
                    type="number"
                    min={0}
                    step={10}
                    defaultValue={filters.minArea ?? ""}
                    placeholder="Ex.: 70"
                  />
                </div>

                {/* Carry the stage from the chip group into the form so the
                    'Aplicar filtros' submit preserves it. */}
                {filters.publicStage ? (
                  <input type="hidden" name="publicStage" value={filters.publicStage} />
                ) : null}
                {sort ? <input type="hidden" name="sort" value={sort} /> : null}

                <button type="submit" className="button button-primary listing-filters-apply">
                  Aplicar filtros
                </button>
              </AutoSubmitForm>
              </MobileFilterToggle>
            </aside>

            <section className="listing-results" aria-label="Resultados">
              {sorted.length ? (
                <ul className="listing-results-list">
                  {sorted.map((development) => (
                    <li key={development.id}>
                      <DevelopmentCardHorizontal
                        slug={development.slug}
                        title={development.title}
                        district={development.district}
                        city={development.city}
                        stageLabel={development.stageLabel}
                        deliveryDate={development.deliveryDate}
                        startingPrice={development.startingPriceNumber}
                        areaFromM2={development.areaFromM2Number}
                        areaToM2={development.areaToM2Number}
                        bedroomsFrom={development.bedroomsFrom}
                        bedroomsTo={development.bedroomsTo}
                        suitesFrom={development.suitesFrom}
                        suitesTo={development.suitesTo}
                        parkingFrom={development.parkingFrom}
                        parkingTo={development.parkingTo}
                        bathroomsFrom={development.bathroomsFrom}
                        bathroomsTo={development.bathroomsTo}
                        builderName={development.displayBuilderName}
                        imageUrl={
                          development.media.find((item) => item.isPrimary)?.url ??
                          development.media.find((item) => item.kind === "HERO")?.url ??
                          development.media.find((item) => item.kind === "GALLERY")?.url
                        }
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <article className="card" style={{ padding: 16 }}>
                  <p style={{ margin: 0, color: "var(--text-muted)" }}>
                    Nenhum lançamento encontrado com os filtros atuais. Ajuste os critérios e tente
                    novamente.
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
