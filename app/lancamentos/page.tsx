import type { Metadata } from "next";
import Link from "next/link";
import { DevelopmentPropertyType } from "@prisma/client";
import { DevelopmentCard } from "@/components/public/development-card";
import { developmentPublicStageLabels, listPublicDevelopments, type PublicDevelopmentStage } from "@/lib/data/developments";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const propertyTypeOptions: Array<{ value: DevelopmentPropertyType; label: string }> = [
  { value: "APARTAMENTO", label: "Apartamento" },
  { value: "CASA", label: "Casa" },
  { value: "LOTE", label: "Lote" },
  { value: "SALA_COMERCIAL", label: "Sala comercial" },
  { value: "STUDIO", label: "Studio" },
  { value: "COBERTURA", label: "Cobertura" }
];

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
  if (typeof value !== "string") return undefined;
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

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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
    publicStage: parseText(params.publicStage) as PublicDevelopmentStage | undefined,
    propertyType: parsePropertyType(params.propertyType),
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
    bedrooms: parseNumber(params.bedrooms),
    minArea: parseNumber(params.minArea),
    feature: parseText(params.feature)
  };

  const [developments, allDevelopments] = await Promise.all([
    listPublicDevelopments(filters),
    listPublicDevelopments()
  ]);

  const cityOptions = Array.from(new Set(allDevelopments.map((item) => item.city))).sort((a, b) => a.localeCompare(b));
  const districtOptions = Array.from(new Set(allDevelopments.map((item) => item.district))).sort((a, b) => a.localeCompare(b));
  const builderOptions = Array.from(new Set(allDevelopments.map((item) => item.displayBuilderName).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
  const featureOptions = Array.from(
    new Set(
      allDevelopments
        .flatMap((item) => [...item.amenities, ...item.differentials])
        .map((item) => item.trim())
        .filter(Boolean)
    )
  )
    .slice(0, 40)
    .sort((a, b) => a.localeCompare(b));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Apartamentos na planta à venda em Palmas - TO",
    description:
      "Conheça os principais lançamentos imobiliários, compare plantas, preços, localização e fale direto com um corretor.",
    url: `${baseUrl}/lancamentos`
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="container wp-section-head">
          <p className="wp-hero-eyebrow" style={{ marginBottom: 12 }}>
            Pedro Soares • Lançamentos em Palmas/TO
          </p>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            Apartamentos na planta à venda em Palmas - TO
          </h1>
          <p className="section-subtitle text-card">
            Conheça os principais lançamentos imobiliários, compare plantas, preços, localização e fale direto com um corretor.
          </p>

          <div className="wp-type-switches" style={{ marginTop: 16 }}>
            <Link href="/imoveis/prontos" className="wp-type-chip">
              Imóveis prontos
            </Link>
            <Link href="/lancamentos" className="wp-type-chip active">
              Imóveis na planta
            </Link>
            <Link href="/imoveis/leilao" className="wp-type-chip">
              Imóveis leilão
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <form method="GET" className="card" style={{ padding: 16, marginBottom: 20 }}>
            <div className="form-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="q">Busca</label>
                <input
                  id="q"
                  name="q"
                  defaultValue={filters.q ?? ""}
                  placeholder="Busque por bairro, empreendimento ou construtora"
                />
              </div>

              <div>
                <label htmlFor="city">Cidade</label>
                <select id="city" name="city" defaultValue={filters.city ?? ""}>
                  <option value="">Todas</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="district">Bairro</label>
                <select id="district" name="district" defaultValue={filters.district ?? ""}>
                  <option value="">Todos</option>
                  {districtOptions.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="builder">Construtora</label>
                <select id="builder" name="builder" defaultValue={filters.builder ?? ""}>
                  <option value="">Todas</option>
                  {builderOptions.map((builder) => (
                    <option key={builder} value={builder}>
                      {builder}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="publicStage">Status do empreendimento</label>
                <select id="publicStage" name="publicStage" defaultValue={filters.publicStage ?? ""}>
                  <option value="">Todos</option>
                  {Object.entries(developmentPublicStageLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="propertyType">Tipo do imóvel</label>
                <select id="propertyType" name="propertyType" defaultValue={filters.propertyType ?? ""}>
                  <option value="">Todos</option>
                  {propertyTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="bedrooms">Quartos</label>
                <input id="bedrooms" name="bedrooms" type="number" min={1} defaultValue={filters.bedrooms ?? ""} />
              </div>

              <div>
                <label htmlFor="minArea">Metragem mínima (m²)</label>
                <input id="minArea" name="minArea" type="number" min={0} defaultValue={filters.minArea ?? ""} />
              </div>

              <div>
                <label htmlFor="minPrice">Preço mínimo</label>
                <input id="minPrice" name="minPrice" type="number" min={0} defaultValue={filters.minPrice ?? ""} />
              </div>

              <div>
                <label htmlFor="maxPrice">Preço máximo</label>
                <input id="maxPrice" name="maxPrice" type="number" min={0} defaultValue={filters.maxPrice ?? ""} />
              </div>

              <div>
                <label htmlFor="feature">Característica</label>
                <select id="feature" name="feature" defaultValue={filters.feature ?? ""}>
                  <option value="">Todas</option>
                  {featureOptions.map((feature) => (
                    <option key={feature} value={feature}>
                      {toTitleCase(feature)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="submit" className="button button-primary">
                Buscar empreendimentos
              </button>
              <Link href="/lancamentos" className="button button-ghost">
                Limpar filtros
              </Link>
            </div>
          </form>

          {developments.length ? (
            <div className="grid-3">
              {developments.map((development) => (
                <DevelopmentCard
                  key={development.id}
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
                  builderName={development.displayBuilderName}
                  imageUrl={
                    development.media.find((item) => item.isPrimary)?.url ??
                    development.media.find((item) => item.kind === "HERO")?.url ??
                    development.media.find((item) => item.kind === "GALLERY")?.url
                  }
                />
              ))}
            </div>
          ) : (
            <article className="card" style={{ padding: 18 }}>
              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                Nenhum empreendimento encontrado com os filtros atuais. Ajuste os critérios e tente novamente.
              </p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
