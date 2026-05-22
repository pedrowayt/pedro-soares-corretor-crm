import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, AtSign, ExternalLink, Globe2, MessageCircle } from "lucide-react";
import { DevelopmentCard } from "@/components/public/development-card";
import { getPublicBuilderBySlug } from "@/lib/data/developments";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function formatCount(value: number | null | undefined, fallback = "Não informado") {
  return typeof value === "number" ? value.toLocaleString("pt-BR") : fallback;
}

function formatLocation(city: string | null, state: string | null) {
  if (city && state) return `${city}, ${state}`;
  return city ?? state ?? "Atuação regional";
}

function splitParagraphs(value: string | null | undefined) {
  if (!value) return [];
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function countBy(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function getInstagramHref(value: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, "").replace(/^instagram\.com\//i, "").replace(/^\/+/, "");
  return handle ? `https://instagram.com/${handle}` : null;
}

function getPrimaryDevelopmentImage(
  development: NonNullable<Awaited<ReturnType<typeof getPublicBuilderBySlug>>>["developments"][number]
) {
  return (
    development.media.find((item) => item.isPrimary)?.url ||
    development.media.find((item) => item.kind === "HERO")?.url ||
    development.media.find((item) => item.kind === "GALLERY")?.url ||
    development.media[0]?.url
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const builder = await getPublicBuilderBySlug(slug);

  if (!builder) {
    return {
      title: "Construtora não encontrada"
    };
  }

  const title = `${builder.name} | Construtora em Palmas TO`;
  const description =
    builder.description ||
    `Conheça a ${builder.name}, seus empreendimentos publicados e regiões de atuação com atendimento especializado de Pedro Soares.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/construtoras/${builder.slug}`
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/construtoras/${builder.slug}`,
      images: builder.logoUrl ? [{ url: builder.logoUrl }] : undefined
    }
  };
}

export default async function BuilderPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const builder = await getPublicBuilderBySlug(slug);

  if (!builder) notFound();

  const instagramHref = getInstagramHref(builder.instagram);
  const sameAs = [builder.website, instagramHref].filter(Boolean);
  const aboutParagraphs = splitParagraphs(builder.institutionalText);
  const cityRegions = countBy(builder.developments.map((development) => development.city).filter(Boolean));
  const districtRegions = countBy(
    builder.developments
      .map((development) => [development.district, development.city].filter(Boolean).join(", "))
      .filter(Boolean)
  );
  const activeProjects = builder.activeProjectsCount ?? builder.developments.length;
  const summary =
    builder.description ||
    `Conheça os empreendimentos publicados da ${builder.name} e fale com Pedro Soares para receber tabela, plantas e condições.`;
  const pageUrl = `${baseUrl}/construtoras/${builder.slug}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: builder.name,
    description: summary,
    url: pageUrl,
    logo: builder.logoUrl ?? undefined,
    foundingDate: builder.foundedYear ? String(builder.foundedYear) : undefined,
    address: builder.city || builder.state
      ? {
          "@type": "PostalAddress",
          addressLocality: builder.city ?? undefined,
          addressRegion: builder.state ?? undefined,
          addressCountry: "BR"
        }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Empreendimentos da ${builder.name}`,
    description: summary,
    url: pageUrl,
    inLanguage: "pt-BR",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: builder.developments.map((development, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: development.title,
        url: `${baseUrl}/lancamentos/${development.slug}`
      }))
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="section builder-profile-section" style={{ paddingBottom: 28 }}>
        <div className="container">
          <div className="builder-profile-hero">
            <div className="builder-profile-copy">
              <p className="wp-hero-eyebrow">Construtora</p>
              <h1 className="section-title builder-profile-title">{builder.name}</h1>
              <p className="section-subtitle text-card builder-profile-summary">{summary}</p>

              <div className="builder-profile-actions">
                <a
                  className="button button-whatsapp"
                  href={buildWhatsAppUrl(`Olá, Pedro. Quero conhecer os empreendimentos da construtora ${builder.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Falar no WhatsApp <MessageCircle size={16} />
                </a>
                <Link className="button button-ghost" href="/lancamentos">
                  Ver lançamentos <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <aside className="builder-profile-brand" aria-label={`Dados da construtora ${builder.name}`}>
              <div className="builder-logo-frame">
                {builder.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={builder.logoUrl} alt={`Logo da construtora ${builder.name}`} className="builder-logo-image" />
                ) : (
                  <div className="builder-logo-fallback" role="img" aria-label={`Iniciais da construtora ${builder.name}`}>
                    {getInitials(builder.name)}
                  </div>
                )}
              </div>
              <p className="title-luxury builder-profile-brand-name">{builder.name}</p>
              <p className="text-card builder-profile-location">{formatLocation(builder.city, builder.state)}</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container builder-profile-layout">
          <div className="builder-profile-main">
            <article className="card builder-content-card">
              <h2 className="title-luxury">Sobre a {builder.name}</h2>
              {aboutParagraphs.length ? (
                aboutParagraphs.map((paragraph) => (
                  <p key={paragraph} className="text-card">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-card">
                  A história institucional desta construtora ainda não foi preenchida no CRM. Enquanto isso, veja os empreendimentos publicados e as regiões de atuação abaixo.
                </p>
              )}
            </article>

            <article className="card builder-content-card">
              <h2 className="title-luxury">Principais regiões da {builder.name}</h2>
              {cityRegions.length || districtRegions.length ? (
                <div className="builder-region-grid">
                  <div>
                    <h3 className="builder-region-title">Cidades</h3>
                    <div className="builder-region-list">
                      {cityRegions.slice(0, 6).map(([region, count]) => (
                        <p key={region} className="text-card">
                          <span>{region}</span>
                          <strong>{count} empreendimento{count === 1 ? "" : "s"}</strong>
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="builder-region-title">Bairros</h3>
                    <div className="builder-region-list">
                      {districtRegions.slice(0, 6).map(([region, count]) => (
                        <p key={region} className="text-card">
                          <span>{region}</span>
                          <strong>{count} empreendimento{count === 1 ? "" : "s"}</strong>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-card">
                  Nenhuma região publicada para esta construtora no momento.
                </p>
              )}
            </article>

            <article className="card builder-content-card">
              <h2 className="title-luxury">Empreendimentos da {builder.name}</h2>
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
                      imageUrl={getPrimaryDevelopmentImage(development)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-card">
                  Nenhum empreendimento publicado para esta construtora no momento.
                </p>
              )}
            </article>
          </div>

          <aside className="builder-profile-sidebar">
            <article className="card builder-content-card">
              <h2 className="title-luxury">Resumo</h2>
              <div className="builder-profile-stats">
                <p>
                  <span>Fundação</span>
                  <strong>{builder.foundedYear ?? "Não informado"}</strong>
                </p>
                <p>
                  <span>Empreendimentos no site</span>
                  <strong>{formatCount(builder.developments.length)}</strong>
                </p>
                <p>
                  <span>Obras ativas</span>
                  <strong>{formatCount(activeProjects)}</strong>
                </p>
                <p>
                  <span>Empreendimentos entregues</span>
                  <strong>{formatCount(builder.deliveredDevelopmentsCount)}</strong>
                </p>
                <p>
                  <span>Unidades entregues</span>
                  <strong>{formatCount(builder.deliveredUnitsCount)}</strong>
                </p>
              </div>
            </article>

            {(builder.website || instagramHref) ? (
              <article className="card builder-content-card">
                <h2 className="title-luxury">Canais oficiais</h2>
                <div className="builder-link-list">
                  {builder.website ? (
                    <a href={builder.website} target="_blank" rel="noreferrer">
                      <Globe2 size={16} /> Site oficial <ExternalLink size={14} />
                    </a>
                  ) : null}
                  {instagramHref ? (
                    <a href={instagramHref} target="_blank" rel="noreferrer">
                      <AtSign size={16} /> Instagram <ExternalLink size={14} />
                    </a>
                  ) : null}
                </div>
              </article>
            ) : null}

            <article className="card builder-content-card builder-sidebar-cta">
              <h2 className="title-luxury">Atendimento especializado</h2>
              <p className="text-card">
                Receba tabela atualizada, disponibilidade e análise dos empreendimentos desta construtora.
              </p>
              <a
                className="button button-whatsapp"
                href={buildWhatsAppUrl(`Olá, Pedro. Quero informações sobre os empreendimentos da construtora ${builder.name}.`)}
                target="_blank"
                rel="noreferrer"
              >
                Chamar no WhatsApp <MessageCircle size={16} />
              </a>
            </article>
          </aside>
        </div>
      </section>
    </>
  );
}
