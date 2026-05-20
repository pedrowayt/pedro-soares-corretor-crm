import type { Metadata } from "next";
import { DevelopmentStage } from "@prisma/client";
import Link from "next/link";
import { DevelopmentCard } from "@/components/public/development-card";
import { listPublicDevelopments } from "@/lib/data/developments";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const stageOptions: Array<{ value: DevelopmentStage; label: string }> = [
  { value: "PRE_LAUNCH", label: "Pré-lançamento" },
  { value: "LAUNCH", label: "Lançamento" },
  { value: "SALES", label: "Vendas" },
  { value: "CONSTRUCTION", label: "Em obras" },
  { value: "DELIVERED", label: "Entregue" }
];

export const metadata: Metadata = {
  title: "Imóveis na planta em Palmas TO | Lançamentos",
  description:
    "Acompanhe os principais imóveis na planta em Palmas TO com filtro por bairro, preço, estágio e tipologia.",
  keywords: [
    "imóveis na planta em Palmas TO",
    "lançamentos em Palmas",
    "apartamento na planta Palmas",
    "empreendimentos em Palmas TO",
    "Pedro Soares lançamentos"
  ],
  alternates: {
    canonical: `${baseUrl}/imoveis/na-planta`
  }
};

function parseNumber(value: string | string[] | undefined) {
  if (typeof value !== "string") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseStage(value: string | string[] | undefined) {
  if (typeof value !== "string") return undefined;
  const stage = stageOptions.find((item) => item.value === value);
  return stage?.value;
}

export default async function ImoveisNaPlantaPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = await searchParams;

  const district = typeof filters.district === "string" ? filters.district : "";
  const minPrice = parseNumber(filters.minPrice);
  const maxPrice = parseNumber(filters.maxPrice);
  const bedrooms = parseNumber(filters.bedrooms);
  const stage = parseStage(filters.stage);

  const developments = await listPublicDevelopments({
    district: district || undefined,
    minPrice,
    maxPrice,
    bedrooms,
    stage
  });

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Imóveis na planta em Palmas TO",
    description:
      "Listagem de empreendimentos na planta com filtro por bairro, estágio, preço e tipologia.",
    url: `${baseUrl}/imoveis/na-planta`
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="container wp-section-head">
          <p className="wp-hero-eyebrow" style={{ marginBottom: 12 }}>
            Imóveis na planta em Palmas TO
          </p>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            Lançamentos com potencial de valorização
          </h1>
          <p className="section-subtitle text-card">
            Compare estágio de obra, tipologias e preços iniciais para decidir com mais segurança.
          </p>

          <div className="wp-type-switches" style={{ marginTop: 16 }}>
            <Link href="/imoveis/prontos" className="wp-type-chip">
              Imóveis prontos
            </Link>
            <Link href="/imoveis/na-planta" className="wp-type-chip active">
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
                <label htmlFor="district">Bairro</label>
                <input id="district" name="district" defaultValue={district} placeholder="Plano Diretor Sul" />
              </div>
              <div>
                <label htmlFor="stage">Estágio da obra</label>
                <select id="stage" name="stage" defaultValue={stage ?? ""}>
                  <option value="">Todos</option>
                  {stageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="minPrice">Preço inicial mínimo</label>
                <input id="minPrice" name="minPrice" type="number" min={0} defaultValue={minPrice ?? ""} />
              </div>
              <div>
                <label htmlFor="maxPrice">Preço inicial máximo</label>
                <input id="maxPrice" name="maxPrice" type="number" min={0} defaultValue={maxPrice ?? ""} />
              </div>
              <div>
                <label htmlFor="bedrooms">Quartos</label>
                <input id="bedrooms" name="bedrooms" type="number" min={1} defaultValue={bedrooms ?? ""} />
              </div>
            </div>
            <button type="submit" className="button button-primary" style={{ marginTop: 12 }}>
              Aplicar filtros
            </button>
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
                  stage={development.stage}
                  deliveryDate={development.deliveryDate}
                  startingPrice={development.startingPriceNumber}
                  imageUrl={
                    development.media.find((item) => item.kind === "HERO")?.url ??
                    development.media.find((item) => item.kind === "GALLERY")?.url
                  }
                />
              ))}
            </div>
          ) : (
            <article className="card" style={{ padding: 16 }}>
              <p style={{ margin: 0, color: "var(--text-muted)" }}>
                Nenhum lançamento encontrado com os filtros atuais. Ajuste os critérios e tente novamente.
              </p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
