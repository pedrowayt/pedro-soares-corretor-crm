import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { WhatsAppPropertyButton } from "@/components/public/whatsapp-property-button";

const INSTAGRAM_URL =
  "https://www.instagram.com/pedrosoarespmw?igsh=MXQ3ZTA2YW13ZjZmNQ%3D%3D&utm_source=qr";
import { getPropertyBySlug } from "@/lib/data/properties";
import { buildGoogleMapsEmbedUrl, buildGoogleMapsOpenUrl } from "@/lib/maps";
import { formatCurrencyBRL } from "@/lib/utils";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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
  const coverImage = propertyImages[0]?.url ?? fallbackImage;
  const galleryImages = propertyImages.length
    ? propertyImages
    : [{ id: "fallback-property-image", url: fallbackImage }];
  const heroThumbs = galleryImages.slice(1, 5);

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
          <div className="property-detail-price-box">
            <span>{purposeLabel}</span>
            <strong>{formatCurrencyBRL(property.priceValue)}</strong>
          </div>
        </div>
        {property.status === "VENDIDO" ? (
          <p className="property-sold-alert">
            Este imóvel já foi vendido. Posso te apresentar oportunidades semelhantes — fale comigo no WhatsApp.
          </p>
        ) : null}

        <div className="property-media-showcase">
          <a className="property-media-showcase__main" href={coverImage} target="_blank" rel="noreferrer">
            <Image
              src={coverImage}
              alt={`Foto principal do imóvel ${property.title}`}
              fill
              sizes="(max-width: 960px) 100vw, 68vw"
              priority
            />
            <span>Ampliar imagem</span>
          </a>
          <div className="property-media-showcase__thumbs">
            {heroThumbs.map((image, index) => (
              <a key={image.id} href={image.url} target="_blank" rel="noreferrer">
                <Image
                  src={image.url}
                  alt={`Foto ${index + 2} do imóvel ${property.title}`}
                  fill
                  sizes="(max-width: 960px) 50vw, 18vw"
                />
              </a>
            ))}
            {!heroThumbs.length ? (
              <div className="property-media-showcase__empty">
                <span>Mais fotos serão adicionadas em breve.</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="property-image-strip" aria-label="Galeria do imóvel">
          {galleryImages.map((image, index) => (
            <a key={image.id} href={image.url} target="_blank" rel="noreferrer">
              <Image
                src={image.url}
                alt={`Imagem ${index + 1} do imóvel ${property.title}`}
                fill
                sizes="210px"
              />
            </a>
          ))}
        </div>

        <div className="grid-3 property-main-grid" style={{ alignItems: "start" }}>
          <article className="card property-detail-content" style={{ padding: 16 }}>
            <h2 className="title-luxury" style={{ marginTop: 0 }}>
              Descrição completa
            </h2>
            <p className="section-subtitle text-card">{property.description}</p>

            <h3 className="title-luxury">Características</h3>
            <div className="property-feature-badges" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(property.features ?? []).map((feature) => (
                <span className="badge" key={feature}>
                  {feature}
                </span>
              ))}
            </div>

            <h3 className="title-luxury" style={{ marginBottom: 8 }}>
              Resumo técnico
            </h3>
            <div className="property-summary-grid">
              <p>
                <strong>Quartos:</strong> {property.bedrooms ?? "-"}
              </p>
              <p>
                <strong>Suítes:</strong> {property.suites ?? "-"}
              </p>
              <p>
                <strong>Banheiros:</strong> {property.bathrooms ?? "-"}
              </p>
              <p>
                <strong>Vagas:</strong> {property.parkingSpaces ?? "-"}
              </p>
              <p>
                <strong>Área:</strong> {property.areaM2Value ?? "-"} m²
              </p>
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

          <aside className="property-contact-panel">
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
          </aside>
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
