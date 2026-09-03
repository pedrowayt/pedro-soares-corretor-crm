import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SeoListingMode } from "@prisma/client";
import { PropertyCard } from "@/components/public/property-card";
import { getPublishedSeoLandingPageByPath } from "@/lib/data/seo-landing-pages";
import { listPublicProperties } from "@/lib/data/properties";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

type AutoSeoRoute =
  | { kind: "city"; citySlug: string; city: string }
  | { kind: "district"; citySlug: string; city: string; district: string }
  | { kind: "builder"; citySlug: string; city: string; builderSlug: string; builderName: string };

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

function slugToText(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferCityFromSlug(citySlug: string) {
  const normalized = citySlug.toLowerCase();
  if (normalized.endsWith("-to")) {
    return slugToText(normalized.slice(0, -3));
  }

  return slugToText(normalized);
}

function resolveAutoSeoRoute(citySlug: string, segments?: string[]): AutoSeoRoute | null {
  const normalizedSegments = (segments ?? []).map((segment) => segment.toLowerCase());
  const city = inferCityFromSlug(citySlug);

  if (normalizedSegments.length === 1 && normalizedSegments[0] === "lancamentos") {
    return { kind: "city", citySlug, city };
  }

  if (normalizedSegments.length === 2 && normalizedSegments[1] === "lancamentos") {
    return {
      kind: "district",
      citySlug,
      city,
      district: slugToText(normalizedSegments[0])
    };
  }

  if (
    normalizedSegments.length === 3 &&
    normalizedSegments[0] === "construtora" &&
    normalizedSegments[2] === "lancamentos"
  ) {
    return {
      kind: "builder",
      citySlug,
      city,
      builderSlug: normalizedSegments[1],
      builderName: slugToText(normalizedSegments[1])
    };
  }

  return null;
}

function buildAutoSeoMetadata(route: AutoSeoRoute) {
  if (route.kind === "city") {
    const title = `Imóveis na Planta em ${route.city} TO | Pedro Soares`;
    return {
      title,
      description: `Veja lançamentos e apartamentos na planta em ${route.city} TO com atendimento especializado de Pedro Soares.`,
      keywords: [
        `imoveis na planta em ${route.city.toLowerCase()} to`,
        `lancamentos em ${route.city.toLowerCase()}`,
        `apartamentos na planta ${route.city.toLowerCase()}`
      ]
    };
  }

  if (route.kind === "district") {
    const title = `Imóveis na Planta no ${route.district} em ${route.city} TO | Pedro Soares`;
    return {
      title,
      description: `Encontre empreendimentos na planta no ${route.district} em ${route.city} TO e fale direto com Pedro Soares.`,
      keywords: [
        `imoveis na planta ${route.district.toLowerCase()}`,
        `lancamentos ${route.district.toLowerCase()} ${route.city.toLowerCase()}`,
        `apartamento na planta ${route.district.toLowerCase()}`
      ]
    };
  }

  const title = `Lançamentos da Construtora ${route.builderName} em ${route.city} TO | Pedro Soares`;
  return {
    title,
    description: `Conheça os lançamentos da construtora ${route.builderName} em ${route.city} TO com suporte comercial completo.`,
    keywords: [
      `construtora ${route.builderName.toLowerCase()} ${route.city.toLowerCase()}`,
      `lancamentos ${route.builderName.toLowerCase()}`,
      `empreendimentos ${route.builderName.toLowerCase()}`
    ]
  };
}

function buildAutoSeoH1(route: AutoSeoRoute) {
  if (route.kind === "city") return `Imóveis na Planta em ${route.city} TO`;
  if (route.kind === "district") return `Imóveis na Planta no ${route.district}`;
  return `Lançamentos da Construtora ${route.builderName}`;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ citySlug: string; segments?: string[] }>;
}): Promise<Metadata> {
  const { citySlug, segments } = await params;
  const autoRoute = resolveAutoSeoRoute(citySlug, segments);

  if (autoRoute) {
    const data = buildAutoSeoMetadata(autoRoute);
    const canonical = `${baseUrl}/${citySlug}/${(segments ?? []).join("/")}`;

    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      alternates: { canonical },
      openGraph: {
        type: "website",
        locale: "pt_BR",
        url: canonical,
        title: data.title,
        description: data.description
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.description
      }
    };
  }

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
  const autoRoute = resolveAutoSeoRoute(citySlug, segments);

  if (autoRoute) {
    redirect("/lancamentos");
  }

  if (path === "/palmas-to/imoveis-na-planta") {
    redirect("/lancamentos");
  }

  const page = await getPublishedSeoLandingPageByPath(path);

  if (!page) {
    notFound();
  }

  const propertiesRaw = await listPublicProperties({ city: page.city });

  const properties = propertiesRaw.filter((property) => districtMatches(property.district, page.district));
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

  const listedProperties = highlightedProperties.slice(0, 12);

  const itemList = listedProperties.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/imoveis/${item.slug}`,
      name: item.title
    }));

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
            <h2 className="section-title">Imóveis em destaque</h2>
            <div className="grid-3" style={{ marginTop: 16 }}>
              {highlightedProperties.slice(0, 9).map((property) => (
                <PropertyCard
                  key={property.id}
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
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {page.faqs.length ? (
        <section className="section wp-soft-section" style={{ paddingTop: 34 }}>
          <div className="container">
            <h2 className="section-title">Perguntas frequentes</h2>
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
                className="button button-whatsapp"
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
