import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DevelopmentInterestForm } from "@/components/public/development-interest-form";
import { getPublicDevelopmentBySlug } from "@/lib/data/developments";
import { formatCurrencyBRL } from "@/lib/utils";

const stageLabels: Record<string, string> = {
  PRE_LAUNCH: "Pré-lançamento",
  LAUNCH: "Lançamento",
  SALES: "Vendas",
  CONSTRUCTION: "Em obras",
  DELIVERED: "Entregue"
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const development = await getPublicDevelopmentBySlug(slug);

  if (!development) {
    return {
      title: "Empreendimento não encontrado"
    };
  }

  const title = development.seoTitle || `${development.title} | Lançamentos em Palmas`;
  const description = development.seoDescription || development.summary;
  const ogImage =
    development.seoOgImageUrl ||
    development.media.find((media) => media.kind === "HERO")?.url ||
    development.media[0]?.url;

  return {
    title,
    description,
    alternates: {
      canonical: `/lancamentos/${development.slug}`
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/lancamentos/${development.slug}`,
      images: ogImage ? [{ url: ogImage }] : undefined
    }
  };
}

export default async function LancamentoDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const development = await getPublicDevelopmentBySlug(slug);

  if (!development) notFound();

  const hero = development.media.find((item) => item.kind === "HERO") ?? development.media[0];
  const gallery = development.media.filter((item) => item.kind === "GALLERY");
  const floorPlans = development.media.filter((item) => item.kind === "FLOORPLAN");
  const whatsappMessage =
    development.whatsappMessageTemplate || `Olá, gostaria de receber detalhes do empreendimento ${development.title}.`;
  const deliveryLabel = development.deliveryDate
    ? new Date(development.deliveryDate).toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" })
    : "A definir";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: development.title,
    description: development.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: development.city,
      addressRegion: development.district,
      streetAddress: development.address ?? undefined
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: development.startingPriceNumber ?? undefined,
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ position: "relative", minHeight: 360 }}>
              {hero ? (
                <Image
                  src={hero.url}
                  alt={hero.title ?? development.title}
                  fill
                  style={{ objectFit: "cover", filter: "brightness(.55)" }}
                />
              ) : null}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "34px clamp(20px, 4vw, 44px)",
                  display: "grid",
                  gap: 8
                }}
              >
                <p className="badge">Lançamentos • {development.city}</p>
                <h1 className="section-title title-luxury" style={{ margin: 0, maxWidth: 840 }}>
                  {development.title}
                </h1>
                <p className="text-card" style={{ margin: 0, maxWidth: 760, color: "rgba(247,247,245,.9)" }}>
                  {development.tagline || development.summary}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                  <span className="badge">{stageLabels[development.stage] ?? development.stage}</span>
                  <span className="badge">Entrega: {deliveryLabel}</span>
                  <span className="badge">{development.district}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="development-layout" style={{ marginTop: 16 }}>
            <div style={{ display: "grid", gap: 14 }}>
              <article className="card" style={{ padding: 18 }}>
                <h2 className="title-luxury" style={{ marginTop: 0 }}>Ficha técnica</h2>
                <div className="grid-3" style={{ gap: 10 }}>
                  <div>
                    <p className="text-card" style={{ margin: "0 0 4px", color: "var(--text-muted)" }}>Preço inicial</p>
                    <strong style={{ color: "var(--sophistication-gold-300)" }}>
                      {development.startingPriceNumber
                        ? formatCurrencyBRL(development.startingPriceNumber)
                        : "Sob consulta"}
                    </strong>
                  </div>
                  <div>
                    <p className="text-card" style={{ margin: "0 0 4px", color: "var(--text-muted)" }}>Metragem</p>
                    <strong>
                      {development.areaFromM2Number ?? "-"} a {development.areaToM2Number ?? "-"} m²
                    </strong>
                  </div>
                  <div>
                    <p className="text-card" style={{ margin: "0 0 4px", color: "var(--text-muted)" }}>Tipologias</p>
                    <strong>
                      {development.bedroomsFrom ?? "-"} a {development.bedroomsTo ?? "-"} quartos
                    </strong>
                  </div>
                  <div>
                    <p className="text-card" style={{ margin: "0 0 4px", color: "var(--text-muted)" }}>Disponibilidade</p>
                    <strong>{development.availableUnits ?? "-"} unidades</strong>
                  </div>
                  <div>
                    <p className="text-card" style={{ margin: "0 0 4px", color: "var(--text-muted)" }}>Incorporadora</p>
                    <strong>{development.developerName ?? "A confirmar"}</strong>
                  </div>
                  <div>
                    <p className="text-card" style={{ margin: "0 0 4px", color: "var(--text-muted)" }}>Construtora</p>
                    <strong>{development.builderName ?? "A confirmar"}</strong>
                  </div>
                </div>
                <p className="text-card" style={{ marginTop: 14, color: "var(--text-muted)" }}>{development.description}</p>
              </article>

              <article className="card" style={{ padding: 18 }}>
                <h2 className="title-luxury" style={{ marginTop: 0 }}>Tipologias e plantas</h2>
                <div style={{ display: "grid", gap: 10 }}>
                  {development.unitTypes.map((unitType) => (
                    <div key={unitType.id} className="card" style={{ padding: 12 }}>
                      <h3 style={{ margin: 0 }}>{unitType.name}</h3>
                      <p className="text-card" style={{ margin: "6px 0", color: "var(--text-muted)" }}>
                        {unitType.bedrooms ?? "-"} quartos • {unitType.suites ?? "-"} suítes • {unitType.bathrooms ?? "-"} banheiros • {unitType.parkingSpaces ?? "-"} vagas
                      </p>
                      <p className="text-card" style={{ margin: "6px 0", color: "var(--text-muted)" }}>
                        {unitType.areaFromM2Number ?? "-"} a {unitType.areaToM2Number ?? "-"} m²
                      </p>
                      <p style={{ margin: "6px 0", color: "var(--sophistication-gold-300)", fontWeight: 700 }}>
                        {unitType.priceFromNumber
                          ? `A partir de ${formatCurrencyBRL(unitType.priceFromNumber)}`
                          : "Preço sob consulta"}
                      </p>
                      {unitType.description ? (
                        <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>{unitType.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>

                {floorPlans.length ? (
                  <div className="grid-3" style={{ marginTop: 12 }}>
                    {floorPlans.map((media) => (
                      <div key={media.id} className="card" style={{ overflow: "hidden" }}>
                        <Image src={media.url} alt={media.title || "Planta"} width={800} height={520} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                        <p className="text-card" style={{ margin: 0, padding: 10 }}>{media.title || "Planta"}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>

              <article className="card" style={{ padding: 18 }}>
                <h2 className="title-luxury" style={{ marginTop: 0 }}>Lazer e diferenciais</h2>
                <div className="grid-3" style={{ gap: 10 }}>
                  <div>
                    <h3 style={{ marginTop: 0 }}>Lazer</h3>
                    <ul className="text-card" style={{ margin: 0, paddingLeft: 18 }}>
                      {development.amenities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <h3 style={{ marginTop: 0 }}>Diferenciais</h3>
                    <ul className="text-card" style={{ margin: 0, paddingLeft: 18 }}>
                      {development.differentials.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>

              {development.milestones.length ? (
                <article className="card" style={{ padding: 18 }}>
                  <h2 className="title-luxury" style={{ marginTop: 0 }}>Status da obra</h2>
                  <div style={{ display: "grid", gap: 10 }}>
                    {development.milestones.map((milestone) => (
                      <div key={milestone.id} className="card" style={{ padding: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                          <strong>{milestone.title}</strong>
                          <span className="badge">{milestone.status}</span>
                        </div>
                        <p className="text-card" style={{ margin: "6px 0", color: "var(--text-muted)" }}>
                          {milestone.description ?? "Sem descrição"}
                        </p>
                        {typeof milestone.progressPct === "number" ? (
                          <p className="text-card" style={{ margin: 0 }}>Progresso: {milestone.progressPct}%</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}

              {gallery.length ? (
                <article className="card" style={{ padding: 18 }}>
                  <h2 className="title-luxury" style={{ marginTop: 0 }}>Galeria do projeto</h2>
                  <div className="grid-3">
                    {gallery.map((media) => (
                      <div key={media.id} className="card" style={{ overflow: "hidden" }}>
                        <Image src={media.url} alt={media.title || development.title} width={960} height={640} style={{ width: "100%", height: 210, objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}

              <article className="card" style={{ padding: 18 }}>
                <h2 className="title-luxury" style={{ marginTop: 0 }}>Localização</h2>
                <p className="text-card" style={{ margin: "0 0 10px", color: "var(--text-muted)" }}>
                  {development.city} • {development.district} {development.neighborhood ? `• ${development.neighborhood}` : ""}
                </p>
                {development.mapEmbedUrl ? (
                  <a href={development.mapEmbedUrl} target="_blank" rel="noreferrer" className="button button-ghost">
                    Ver região no mapa
                  </a>
                ) : (
                  <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>Mapa será disponibilizado em breve.</p>
                )}
              </article>

              {development.faqs.length ? (
                <article className="card" style={{ padding: 18 }}>
                  <h2 className="title-luxury" style={{ marginTop: 0 }}>Perguntas frequentes</h2>
                  <div style={{ display: "grid", gap: 10 }}>
                    {development.faqs.map((faq) => (
                      <details key={faq.id} className="card" style={{ padding: 12 }}>
                        <summary style={{ cursor: "pointer", fontWeight: 600 }}>{faq.question}</summary>
                        <p className="text-card" style={{ marginTop: 8, color: "var(--text-muted)" }}>{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </article>
              ) : null}
            </div>

            <DevelopmentInterestForm
              developmentId={development.id}
              developmentSlug={development.slug}
              whatsappMessage={whatsappMessage}
              tablePdfUrl={development.tablePdfUrl}
            />
          </div>
        </div>
      </section>
    </>
  );
}
