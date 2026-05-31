import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpFromLine,
  Bath,
  Bed,
  BedDouble,
  Car,
  DoorOpen,
  LandPlot,
  Layers,
  Ruler,
  Sofa
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { PropertyGallery } from "@/components/public/property-gallery";
import { WhatsAppPropertyButton } from "@/components/public/whatsapp-property-button";
import { getSiteUrl } from "@/lib/site-url";

const INSTAGRAM_URL =
  "https://www.instagram.com/pedrosoarespmw?igsh=MXQ3ZTA2YW13ZjZmNQ%3D%3D&utm_source=qr";
import { getPropertyBySlug } from "@/lib/data/properties";
import {
  getPropertyCategory,
  groupFeaturesForCategory,
  type CounterFieldId,
  type DimensionFieldId
} from "@/lib/property-categories";
import { buildGoogleMapsEmbedUrl, buildGoogleMapsOpenUrl } from "@/lib/maps";
import { formatCurrencyBRL } from "@/lib/utils";

const baseUrl = getSiteUrl();

const purposeLabelMap: Record<string, string> = {
  VENDA: "venda",
  LOCACAO: "aluguel",
  INVESTIMENTO: "investimento",
  LEILAO: "leilão",
  LANCAMENTO: "lançamento"
};

const broker = {
  name: "Pedro Soares",
  creci: "CRECI 5861-TO",
  photo: "/brand/pedro-portrait-5.png",
  phone: "(63) 98484-5101"
};

function formatAreaM2(value: number | null | undefined) {
  if (!value) return "Sob consulta";
  return `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value)} m²`;
}

function formatCount(value: number | null | undefined, singular: string, plural: string) {
  if (value === null || value === undefined) return "Sob consulta";
  return `${value} ${value === 1 ? singular : plural}`;
}

function normalizeFeature(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function findFeatureSummary(features: readonly string[], keywords: string[]) {
  const normalizedKeywords = keywords.map(normalizeFeature);
  return features.find((feature) => {
    const normalizedFeature = normalizeFeature(feature);
    return normalizedKeywords.some((keyword) => normalizedFeature.includes(keyword));
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Imóvel não encontrado | Pedro Soares",
      description: "O imóvel solicitado não foi encontrado."
    };
  }

  const purposeLabel = purposeLabelMap[property.purpose] ?? "imóvel";
  const title = `${property.title} em ${property.district}, ${property.city} | Pedro Soares`;
  const description = `${purposeLabel.toUpperCase()} em ${property.district}, ${property.city}. ${property.bedrooms ?? "-"} quartos, ${property.areaM2Value ?? "-"} m². Fale com Pedro Soares para mais informações.`;
  const canonical = `${baseUrl}/imoveis/${property.slug}`;
  const mainImage = property.media?.[0]?.url ?? `${baseUrl}/brand/home-search-showcase.png`;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    keywords: [
      `${property.type.toLowerCase()} em ${property.city}`,
      `imóvel em ${property.district}`,
      `${purposeLabel} em Palmas`,
      "imóveis em Palmas",
      "corretor de imóveis Palmas",
      "Pedro Soares imóveis"
    ],
    openGraph: {
      type: "article",
      locale: "pt_BR",
      url: canonical,
      title,
      description,
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: property.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [mainImage]
    }
  };
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const propertyUrl = `${baseUrl}/imoveis/${property.slug}`;
  const purposeLabel = purposeLabelMap[property.purpose] ?? "imóvel";
  const whatsappMessage = `Olá, vi o imóvel ${property.title} no site e gostaria de mais informações.`;
  const mapEmbedUrl = buildGoogleMapsEmbedUrl({
    googleMapsUrl: property.googleMapsUrl,
    latitude: property.latitude,
    longitude: property.longitude,
    address: property.address,
    district: property.district,
    city: property.city
  });
  const mapOpenUrl = buildGoogleMapsOpenUrl({
    googleMapsUrl: property.googleMapsUrl,
    latitude: property.latitude,
    longitude: property.longitude,
    address: property.address,
    district: property.district,
    city: property.city
  });
  const propertyImages = (property.media ?? [])
    .slice()
    .sort((a, b) => ("position" in a ? a.position : 0) - ("position" in b ? b.position : 0))
    .map((media) => ({
      id: media.id,
      url: media.url
    }));
  const fallbackImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";
  const galleryImages = propertyImages.length
    ? propertyImages
    : [{ id: "fallback-property-image", url: fallbackImage }];
  const features = property.features ?? [];
  const roomFeature = findFeatureSummary(features, ["sala", "living"]);
  const landFeature = findFeatureSummary(features, ["terreno", "quintal", "lote"]);
  const isLandProperty =
    property.type === "LOTE" ||
    property.type === "LOTE_EM_CONDOMINIO" ||
    property.type === "RURAL" ||
    property.type === "CHACARA" ||
    property.type === "CHACARA_EM_CONDOMINIO" ||
    property.type === "FAZENDA";
  const propertyCategory = getPropertyCategory(property.type);
  const groupedFeatures = groupFeaturesForCategory(features, propertyCategory);

  const formatMetersValue = (value: number | null | undefined) =>
    typeof value === "number" && value > 0 ? `${value.toLocaleString("pt-BR")} m` : "Sob consulta";

  const dimensionLabelMap: Record<DimensionFieldId, string> = {
    areaM2: "Área",
    landAreaM2: "Terreno",
    frontMeters: "Frente",
    backMeters: "Fundo",
    sideLeftMeters: "Lateral esq.",
    sideRightMeters: "Lateral dir.",
    ceilingHeightM: "Pé-direito"
  };

  const counterLabelMap: Record<CounterFieldId, { label: string; singular: string; plural: string }> = {
    bedrooms: { label: "Quartos", singular: "quarto", plural: "quartos" },
    livingRooms: { label: "Salas", singular: "sala", plural: "salas" },
    suites: { label: "Suítes", singular: "suíte", plural: "suítes" },
    bathrooms: { label: "Banheiros", singular: "banheiro", plural: "banheiros" },
    parkingSpaces: { label: "Vagas", singular: "vaga", plural: "vagas" },
    floorNumber: { label: "Andar", singular: "andar", plural: "andares" },
    floorCount: { label: "Andares", singular: "andar", plural: "andares" },
    unitCount: { label: "Unidades", singular: "unidade", plural: "unidades" }
  };

  const counterIconMap: Record<CounterFieldId, LucideIcon> = {
    bedrooms: Bed,
    livingRooms: Sofa,
    suites: BedDouble,
    bathrooms: Bath,
    parkingSpaces: Car,
    floorNumber: ArrowUpFromLine,
    floorCount: Layers,
    unitCount: DoorOpen
  };

  const dimensionIconMap: Record<DimensionFieldId, LucideIcon> = {
    areaM2: Ruler,
    landAreaM2: LandPlot,
    frontMeters: LandPlot,
    backMeters: LandPlot,
    sideLeftMeters: LandPlot,
    sideRightMeters: LandPlot,
    ceilingHeightM: Ruler
  };
  const dimensionRawValue = (id: DimensionFieldId): number | null => {
    switch (id) {
      case "areaM2":
        return property.areaM2Value ?? null;
      case "landAreaM2":
        return property.landAreaM2Value ?? null;
      case "frontMeters":
        return property.frontMeters ?? null;
      case "backMeters":
        return property.backMeters ?? null;
      case "sideLeftMeters":
        return property.sideLeftMeters ?? null;
      case "sideRightMeters":
        return property.sideRightMeters ?? null;
      case "ceilingHeightM":
        return property.ceilingHeightM ?? null;
    }
  };

  const dimensionDisplay = (id: DimensionFieldId): string | null => {
    if (id === "areaM2" || id === "landAreaM2") {
      const value = dimensionRawValue(id);
      return value && value > 0 ? formatAreaM2(value) : null;
    }
    const value = dimensionRawValue(id);
    return value && value > 0 ? formatMetersValue(value) : null;
  };

  const counterRawValue = (id: CounterFieldId): number | null => {
    const raw = (property as unknown as Record<CounterFieldId, number | null | undefined>)[id];
    return raw ?? null;
  };

  const counterDisplay = (id: CounterFieldId): string | null => {
    const meta = counterLabelMap[id];
    const value = counterRawValue(id);
    if (value !== null && value > 0) {
      return formatCount(value, meta.singular, meta.plural);
    }
    // livingRooms may still be implied by a feature like "3 salas".
    if (id === "livingRooms" && roomFeature) {
      return roomFeature;
    }
    return null;
  };

  const technicalSummaryItems: Array<{
    label: string;
    value: string;
    Icon: LucideIcon;
  }> = [
    ...propertyCategory.dimensions.flatMap((id) => {
      const value = dimensionDisplay(id);
      return value
        ? [{ label: dimensionLabelMap[id], value, Icon: dimensionIconMap[id] }]
        : [];
    }),
    ...propertyCategory.counters.flatMap((id) => {
      const value = counterDisplay(id);
      return value
        ? [{ label: counterLabelMap[id].label, value, Icon: counterIconMap[id] }]
        : [];
    })
  ];

  const faqItems = [
    {
      question: `Este imóvel em ${property.district} está disponível?`,
      answer: `Sim, este imóvel está com status de oportunidade para ${purposeLabel}. Fale comigo no WhatsApp para confirmar disponibilidade em tempo real.`
    },
    {
      question: "Posso agendar visita?",
      answer: "Sim. Você pode enviar o formulário nesta página ou chamar no WhatsApp para agendar a melhor data."
    },
    {
      question: "Vocês ajudam com financiamento?",
      answer: "Sim. Eu te oriento na simulação e no encaminhamento com bancos parceiros para facilitar o processo."
    },
    {
      question: "Esse imóvel serve para investimento?",
      answer: "Posso te ajudar a avaliar potencial de valorização, liquidez da região e comparativos antes da decisão."
    }
  ];

  const reviews = [
    {
      author: "Cliente de Compra",
      rating: 5,
      text: "Atendimento claro e rápido. Entendi todo o processo sem complicação."
    },
    {
      author: "Cliente Investidor",
      rating: 5,
      text: "Recebi opções com boa análise de região e margem. Ganhei tempo na decisão."
    },
    {
      author: "Cliente Leilão",
      rating: 4,
      text: "Suporte técnico e comercial muito bom. Passei mais segurança na arrematação."
    }
  ];

  const aggregateRating = {
    ratingValue: 4.7,
    reviewCount: reviews.length
  };

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: propertyUrl,
    image: (property.media ?? []).map((media) => media.url),
    offers: {
      "@type": "Offer",
      price: property.priceValue,
      priceCurrency: "BRL",
      availability:
        property.status === "VENDIDO"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      url: propertyUrl
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: "TO",
      addressCountry: "BR",
      postalCode: "77020-018",
      streetAddress: `${property.district} (região aproximada)`
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5
      },
      reviewBody: review.text
    }))
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <section className="section property-detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="container property-detail-shell">
        <div className="property-detail-heading">
          <div>
            <div className="property-detail-badges">
              <p className="badge">
                {property.city} • {property.district}
              </p>
              {property.status === "VENDIDO" ? (
                <span className="badge badge-tone-sold">Vendido</span>
              ) : property.status === "RESERVADO" ? (
                <span className="badge badge-tone-reserved">Reservado</span>
              ) : property.status === "ALUGADO" ? (
                <span className="badge badge-tone-rented">Alugado</span>
              ) : null}
            </div>
            <h1 className="section-title title-luxury">
              {property.title}
            </h1>
          </div>
        </div>

        <div
          className="property-detail-price-box property-detail-price-box--inline"
          aria-hidden="true"
        >
          <span>{purposeLabel}</span>
          <strong>{formatCurrencyBRL(property.priceValue)}</strong>
          <small>Valor anunciado do imóvel</small>
        </div>

        {property.status === "VENDIDO" ? (
          <p className="property-sold-alert">
            Este imóvel já foi vendido. Posso te apresentar oportunidades semelhantes — fale comigo no WhatsApp.
          </p>
        ) : null}

        <div className="property-detail-layout">
          <aside className="property-detail-sidebar">
            <div className="property-detail-price-box property-detail-price-box--sidebar">
              <span>{purposeLabel}</span>
              <strong>{formatCurrencyBRL(property.priceValue)}</strong>
              <small>Valor anunciado do imóvel</small>
            </div>

            <div className="property-contact-panel">
              <div className="property-broker-card">
                <Image src={broker.photo} alt={broker.name} width={88} height={104} className="property-broker-photo" />
                <div className="property-broker-copy">
                  <span>Atendimento direto</span>
                  <strong>{broker.name}</strong>
                  <small>{broker.creci}</small>
                </div>
              </div>

              <div className="property-contact-actions">
                <WhatsAppPropertyButton
                  propertyId={property.id}
                  propertySlug={property.slug}
                  message={whatsappMessage}
                  className="button button-primary"
                  label="Chamar Pedro no WhatsApp"
                />
                <a
                  className="button button-ghost property-instagram-button"
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir Instagram de Pedro Soares"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Ver no Instagram
                </a>
              </div>

              <div className="property-contact-points">
                <p>Agendamento de visita com orientação sobre documentação, região e potencial de negociação.</p>
                <p>Resposta rápida para disponibilidade, proposta e simulação de financiamento.</p>
              </div>
            </div>
          </aside>

          <div className="property-detail-main">
            <PropertyGallery images={galleryImages} propertyTitle={property.title} />

            <article className="card property-detail-content" style={{ padding: 16 }}>
              <h2 className="title-luxury" style={{ marginTop: 0 }}>
                Descrição completa
              </h2>
              <p className="section-subtitle text-card">{property.description}</p>

              <h3 className="title-luxury">Características</h3>
              {groupedFeatures.length ? (
                <div className="property-land-feature-groups">
                  {groupedFeatures.map((group) => (
                    <div className="property-land-feature-group" key={group.id}>
                      <h4 className="property-land-feature-group-title">
                        <span aria-hidden="true">{group.icon}</span> {group.title}
                      </h4>
                      <div
                        className="property-feature-badges"
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        {group.items.map((feature) => (
                          <span className="badge" key={feature}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                  Características complementares serão adicionadas em breve.
                </p>
              )}

              <h3 className="title-luxury" style={{ marginBottom: 8 }}>
                Resumo técnico
              </h3>
              <div className="property-summary-grid">
                {technicalSummaryItems.map(({ label, value, Icon }) => (
                  <div className="property-summary-grid-item property-summary-grid-item--metric" key={label}>
                    <span className="property-summary-grid-icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={2.1} />
                    </span>
                    <span className="property-summary-grid-copy">
                      <span className="property-summary-grid-label">{label}</span>
                      <strong className="property-summary-grid-value">{value}</strong>
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="title-luxury">Mapa aproximado</h3>
              {mapEmbedUrl ? (
                <div className="card property-map-card">
                  <iframe
                    title={`Mapa do imóvel ${property.title}`}
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="property-map-card-footer">
                    <p>Região aproximada: {property.district}, {property.city}</p>
                    {mapOpenUrl ? (
                      <a href={mapOpenUrl} target="_blank" rel="noreferrer">
                        Abrir no Google Maps
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="card property-info-block" style={{ minHeight: 180, padding: 14 }}>
                  <p className="text-card">
                    Região aproximada: {property.district}, {property.city}
                  </p>
                </div>
              )}

              <h3 className="title-luxury">Financiamento</h3>
              <p className="section-subtitle text-card">
                Se quiser, eu te envio uma simulação de financiamento com os principais bancos parceiros.
              </p>

              <h3 className="title-luxury">FAQ</h3>
              <div className="property-faq-list">
                {faqItems.map((item) => (
                  <details key={item.question} className="property-faq-item">
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>

              <h3 className="title-luxury">Avaliações</h3>
              <p className="property-review-summary">
                Nota média do atendimento: <strong>{aggregateRating.ratingValue.toFixed(1)}</strong>/5
              </p>
              <div className="property-review-grid">
                {reviews.map((review, index) => (
                  <article key={`${review.author}-${index}`} className="property-review-card">
                    <p className="property-review-stars">{Array.from({ length: review.rating }).map(() => "★").join("")}</p>
                    <p className="property-review-text">{review.text}</p>
                    <strong className="property-review-author">{review.author}</strong>
                  </article>
                ))}
              </div>

              <div style={{ marginTop: 10 }}>
                <WhatsAppPropertyButton
                  propertyId={property.id}
                  propertySlug={property.slug}
                  message={whatsappMessage}
                  className="button button-primary"
                  label="Falar com Pedro no WhatsApp"
                />
              </div>
            </article>
          </div>
        </div>
      </div>

      <div className="property-mobile-cta">
        <WhatsAppPropertyButton
          propertyId={property.id}
          propertySlug={property.slug}
          message={whatsappMessage}
          className="button button-primary property-mobile-cta-button"
          label="WhatsApp • Fale comigo"
        />
      </div>
    </section>
  );
}
