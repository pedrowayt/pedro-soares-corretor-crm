import type { Metadata } from "next";
import { PropertyPurpose, PropertyType } from "@prisma/client";
import Link from "next/link";
import { PropertyCard } from "@/components/public/property-card";
import { listPublicProperties } from "@/lib/data/properties";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const allowedPurposes: PropertyPurpose[] = ["VENDA", "LOCACAO", "INVESTIMENTO"];

const purposeOptions: Array<{ value: PropertyPurpose; label: string }> = [
  { value: "VENDA", label: "Venda" },
  { value: "LOCACAO", label: "Aluguel" },
  { value: "INVESTIMENTO", label: "Investimento" }
];

const typeOptions: Array<{ value: PropertyType; label: string }> = [
  { value: "CASA", label: "Casa" },
  { value: "APARTAMENTO", label: "Apartamento" },
  { value: "LOTE", label: "Lote" },
  { value: "COMERCIAL", label: "Comercial" },
  { value: "RURAL", label: "Rural" }
];

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
  if (typeof value !== "string") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseType(value: string | string[] | undefined) {
  if (typeof value !== "string") return undefined;
  const found = typeOptions.find((item) => item.value === value);
  return found?.value;
}

function parsePurpose(value: string | string[] | undefined) {
  if (typeof value !== "string") return "VENDA" as PropertyPurpose;
  return allowedPurposes.includes(value as PropertyPurpose) ? (value as PropertyPurpose) : ("VENDA" as PropertyPurpose);
}

export default async function ImoveisProntosPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParams;

  const city = typeof filters.city === "string" && filters.city ? filters.city : "Palmas";
  const district = typeof filters.district === "string" ? filters.district : "";
  const minPrice = parseNumber(filters.minPrice);
  const maxPrice = parseNumber(filters.maxPrice);
  const bedrooms = parseNumber(filters.bedrooms);
  const minAreaM2 = parseNumber(filters.minAreaM2);
  const type = parseType(filters.type);
  const purpose = parsePurpose(filters.purpose);

  const properties = await listPublicProperties({
    city,
    district: district || undefined,
    minPrice,
    maxPrice,
    bedrooms,
    minAreaM2,
    type,
    purpose
  });

  const filtered = properties.filter((property) => !property.isAuctionOpportunity && !property.auctionCase);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Imóveis prontos em Palmas TO",
    description:
      "Listagem de imóveis prontos com filtros por região, tipologia e faixa de valor.",
    url: `${baseUrl}/imoveis/prontos`
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="container wp-section-head">
          <p className="wp-hero-eyebrow" style={{ marginBottom: 12 }}>
            Imóveis prontos em Palmas TO
          </p>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            Casas, apartamentos e lotes prontos
          </h1>
          <p className="section-subtitle text-card">
            Filtre por bairro, valor, quartos e metragem para encontrar seu próximo imóvel com atendimento direto.
          </p>

          <div className="wp-type-switches" style={{ marginTop: 16 }}>
            <Link href="/imoveis/prontos" className="wp-type-chip active">
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
        <div className="container">
          <form method="GET" className="card" style={{ padding: 16, marginBottom: 20 }}>
            <div className="form-grid">
              <div>
                <label htmlFor="city">Cidade</label>
                <input id="city" name="city" defaultValue={city} />
              </div>
              <div>
                <label htmlFor="district">Bairro</label>
                <input id="district" name="district" defaultValue={district} placeholder="Plano Diretor Sul" />
              </div>
              <div>
                <label htmlFor="purpose">Finalidade</label>
                <select id="purpose" name="purpose" defaultValue={purpose}>
                  {purposeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="type">Tipo</label>
                <select id="type" name="type" defaultValue={type ?? ""}>
                  <option value="">Todos</option>
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="minPrice">Valor mínimo</label>
                <input id="minPrice" name="minPrice" type="number" min={0} defaultValue={minPrice ?? ""} />
              </div>
              <div>
                <label htmlFor="maxPrice">Valor máximo</label>
                <input id="maxPrice" name="maxPrice" type="number" min={0} defaultValue={maxPrice ?? ""} />
              </div>
              <div>
                <label htmlFor="bedrooms">Quartos</label>
                <input id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={bedrooms ?? ""} />
              </div>
              <div>
                <label htmlFor="minAreaM2">Metragem mínima (m²)</label>
                <input id="minAreaM2" name="minAreaM2" type="number" min={0} defaultValue={minAreaM2 ?? ""} />
              </div>
            </div>
            <button type="submit" className="button button-primary" style={{ marginTop: 12 }}>
              Aplicar filtros
            </button>
          </form>

          {filtered.length ? (
            <div className="grid-3">
              {filtered.map((property) => (
                <PropertyCard
                  key={property.id}
                  slug={property.slug}
                  title={property.title}
                  city={property.city}
                  district={property.district}
                  price={property.priceValue}
                  bedrooms={property.bedrooms}
                  areaM2={property.areaM2Value}
                  imageUrl={property.media?.[0]?.url}
                />
              ))}
            </div>
          ) : (
            <article className="card" style={{ padding: 16 }}>
              <p style={{ margin: 0, color: "var(--text-muted)" }}>
                Nenhum imóvel encontrado com os filtros atuais. Ajuste os critérios e tente novamente.
              </p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
