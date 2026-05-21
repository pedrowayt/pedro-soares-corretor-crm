import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DevelopmentCard } from "@/components/public/development-card";
import { getPublicBuilderBySlug } from "@/lib/data/developments";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const builder = await getPublicBuilderBySlug(slug);

  if (!builder) {
    return {
      title: "Construtora não encontrada"
    };
  }

  const title = `${builder.name} | Empreendimentos em Palmas TO`;
  const description =
    builder.description ||
    `Conheça os empreendimentos da ${builder.name} com atendimento especializado de Pedro Soares.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/construtoras/${builder.slug}`
    }
  };
}

export default async function BuilderPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const builder = await getPublicBuilderBySlug(slug);

  if (!builder) notFound();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Empreendimentos da ${builder.name}`,
    description:
      builder.description || `Listagem de empreendimentos da ${builder.name} em Palmas TO.`,
    url: `${baseUrl}/construtoras/${builder.slug}`
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="section" style={{ paddingBottom: 24 }}>
        <div className="container wp-section-head">
          <p className="wp-hero-eyebrow" style={{ marginBottom: 12 }}>
            Construtora
          </p>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            {builder.name}
          </h1>
          <p className="section-subtitle text-card" style={{ margin: "0 auto" }}>
            {builder.institutionalText || builder.description || "Empreendimentos com curadoria em Palmas TO."}
          </p>
          <p className="text-card" style={{ margin: "8px auto 0", color: "var(--text-muted)" }}>
            Fundação: {builder.foundedYear ?? "-"} • Entregues: {builder.deliveredDevelopmentsCount ?? "-"} • Unidades: {builder.deliveredUnitsCount ?? "-"}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {builder.developments.length ? (
            <div className="grid-3">
              {builder.developments.map((development) => (
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
                    development.media.find((item) => item.isPrimary)?.url ||
                    development.media.find((item) => item.kind === "HERO")?.url ||
                    development.media[0]?.url
                  }
                />
              ))}
            </div>
          ) : (
            <article className="card" style={{ padding: 16 }}>
              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                Nenhum empreendimento publicado para esta construtora no momento.
              </p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
