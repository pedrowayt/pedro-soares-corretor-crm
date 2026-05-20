import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoListingMode } from "@prisma/client";
import { DevelopmentCard } from "@/components/public/development-card";
import { PropertyCard } from "@/components/public/property-card";
import { getPublishedSeoLandingPageByPath } from "@/lib/data/seo-landing-pages";
import { listPublicDevelopments } from "@/lib/data/developments";
import { listPublicProperties } from "@/lib/data/properties";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function districtMatches(candidate: string, target: string | null) {
  if (!target) return true;
  const normalizedCandidate = normalizeText(candidate);
  const normalizedTarget = normalizeText(target);
  return normalizedCandidate.includes(normalizedTarget) || normalizedTarget.includes(normalizedCandidate);
}

function buildPath(citySlug: string, segments?: string[]) {
  const all = [citySlug, ...(segments ?? [])].filter(Boolean);
  return `/${all.join("/")}`.toLowerCase();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ citySlug: string; segments?: string[] }>;
}): Promise<Metadata> {
  const { citySlug, segments } = await params;
  const path = buildPath(citySlug, segments);
  const page = await getPublishedSeoLandingPageByPath(path);

  if (!page) {
    return {
      title: "Página não encontrada | Pedro Soares",
      description: "A página solicitada não está disponível."
    };
  }

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: `${baseUrl}${page.path}` },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: `${baseUrl}${page.path}`,
      title: page.title,
      description: page.description
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description
    }
  };
}

export default async function SeoLandingPage({
  params
}: {
  params: Promise<{ citySlug: string; segments?: string[] }>;
}) {
  const { citySlug, segments } = await params;
  const path = buildPath(citySlug, segments);
  const page = await getPublishedSeoLandingPageByPath(path);

  if (!page) {
    notFound();
  }

  const [propertiesRaw, developmentsRaw] = await Promise.all([
    listPublicProperties({ city: page.city }),
    listPublicDevelopments()
  ]);

  const properties = propertiesRaw.filter((property) => districtMatches(property.district, page.district));
  const developments = developmentsRaw.filter((development) => {
    const sameCity = normalizeText(development.city) === normalizeText(page.city);
    const sameDistrict = districtMatches(development.district, page.district);
    return sameCity && sameDistrict;
  });

  const readyProperties = properties.filter(
    (item) =>
      item.purpose !== "LANCAMENTO" &&
      item.purpose !== "LEILAO" &&
      !item.isAuctionOpportunity &&
      !item.auctionCase
  );
  const auctionProperties = properties.filter(
    (item) => item.purpose === "LEILAO" || item.isAuctionOpportunity || item.auctionCase
  );

  const highlightedProperties =
    page.listingMode === SeoListingMode.LEILAO
      ? auctionProperties
      : page.listingMode === SeoListingMode.PRONTOS
        ? readyProperties
        : properties;

  const highlightedDevelopments =
    page.listingMode === SeoListingMode.PLANTA || page.listingMode === SeoListingMode.TODOS
      ? developments
      : [];

  const listedProperties = highlightedProperties.slice(0, 12);
  const listedDevelopments = highlightedDevelopments.slice(0, 12);

  const itemList = [
    ...listedProperties.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/imoveis/${item.slug}`,
      name: item.title
    })),
    ...listedDevelopments.map((item, index) => ({
      "@type": "ListItem",
      position: listedProperties.length + index + 1,
      url: `${baseUrl}/lancamentos/${item.slug}`,
      name: item.title
    }))
  ];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.h1,
    description: page.description,
    url: `${baseUrl}${page.path}`,
    about: {
      "@type": "Place",
      name: page.district ? `${page.district}, ${page.city}` : page.city
    },
    inLanguage: "pt-BR",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: itemList
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      {page.faqs.length ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}

      <section className="section" style={{ paddingBottom: 34 }}>
        <div className="container">
          <p className="wp-hero-eyebrow" style={{ marginBottom: 10 }}>
            Pedro Soares • Corretor de Imóveis em Palmas TO
          </p>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            {page.h1}
          </h1>
          <p className="section-subtitle text-card" style={{ maxWidth: "90ch" }}>
            {page.intro}
          </p>
        </div>
      </section>

      {highlightedProperties.length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="section-title" style={{ fontSize: "clamp(1.4rem, 2vw, 2rem)" }}>
              Imóveis em destaque
            </h2>
            <div className="grid-3" style={{ marginTop: 16 }}>
              {highlightedProperties.slice(0, 9).map((property) => (
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
          </div>
        </section>
      ) : null}

      {highlightedDevelopments.length ? (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="section-title" style={{ fontSize: "clamp(1.4rem, 2vw, 2rem)" }}>
              Empreendimentos na planta
            </h2>
            <div className="grid-3" style={{ marginTop: 16 }}>
              {highlightedDevelopments.slice(0, 6).map((development) => (
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
          </div>
        </section>
      ) : null}

      {page.faqs.length ? (
        <section className="section wp-soft-section" style={{ paddingTop: 34 }}>
          <div className="container">
            <h2 className="section-title" style={{ fontSize: "clamp(1.4rem, 2vw, 2rem)" }}>
              Perguntas frequentes
            </h2>
            <div className="property-faq-list" style={{ marginTop: 12 }}>
              {page.faqs.map((faq) => (
                <details key={faq.question} className="property-faq-item">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" style={{ paddingTop: 34 }}>
        <div className="container">
          <div className="wp-cta-bar">
            <h3>Quer ajuda para escolher a melhor oportunidade?</h3>
            <div>
              <a
                className="button button-primary"
                href="https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20vi%20a%20p%C3%A1gina%20e%20quero%20ajuda%20para%20escolher%20um%20im%C3%B3vel."
                target="_blank"
                rel="noreferrer"
              >
                Falar no WhatsApp
              </a>
              <Link className="button button-ghost" href="/imoveis/prontos">
                Ver todos os imóveis
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
