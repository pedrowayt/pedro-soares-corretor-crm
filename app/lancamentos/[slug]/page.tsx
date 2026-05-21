import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  Bed,
  BarChart3,
  Calendar,
  Car,
  CheckCircle2,
  CircleDollarSign,
  MessageCircle,
  MapPin,
  Ruler,
  ShieldAlert,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { DevelopmentInterestForm } from "@/components/public/development-interest-form";
import { DevelopmentHeroSlider } from "@/components/public/development-hero-slider";
import { amenityIconMap, featureIconMap } from "@/lib/icons/development";
import { getPublicDevelopmentBySlug } from "@/lib/data/developments";
import {
  getInvestmentPotentialAnalysis,
  publicDevelopmentStageOrder,
  developmentStageLabels
} from "@/lib/development-investment";
import {
  buildDevelopmentMessage,
  buildDevelopmentScheduleMessage,
  buildDevelopmentUnitMessage,
  buildWhatsAppUrl
} from "@/lib/integrations/whatsapp-links";
import { formatCurrencyBRL } from "@/lib/utils";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function pickAmenityIcon(label: string) {
  const normalized = normalizeText(label);
  const entry = Object.entries(amenityIconMap).find(([key]) => normalized.includes(normalizeText(key)));
  return entry?.[1] ?? ShieldCheck;
}

function pickFeatureIcon(label: string) {
  const normalized = normalizeText(label);
  const entry = Object.entries(featureIconMap).find(([key]) => normalized.includes(normalizeText(key)));
  return entry?.[1] ?? ShieldCheck;
}

function buildMapEmbedUrl(development: {
  mapEmbedUrl: string | null;
  latitudeNumber: number | null;
  longitudeNumber: number | null;
  address: string | null;
  district: string;
  city: string;
}) {
  if (development.mapEmbedUrl?.includes("maps") && development.mapEmbedUrl.includes("embed")) {
    return development.mapEmbedUrl;
  }

  if (development.latitudeNumber && development.longitudeNumber) {
    return `https://www.google.com/maps?q=${development.latitudeNumber},${development.longitudeNumber}&output=embed`;
  }

  const address = [development.address, development.district, development.city].filter(Boolean).join(", ");
  if (address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }

  return null;
}

function buildMapOpenUrl(development: {
  mapEmbedUrl: string | null;
  latitudeNumber: number | null;
  longitudeNumber: number | null;
  address: string | null;
  district: string;
  city: string;
}) {
  if (development.mapEmbedUrl?.startsWith("http")) {
    return development.mapEmbedUrl.replace("output=embed", "");
  }

  if (development.latitudeNumber && development.longitudeNumber) {
    return `https://www.google.com/maps?q=${development.latitudeNumber},${development.longitudeNumber}`;
  }

  const address = [development.address, development.district, development.city].filter(Boolean).join(", ");
  if (address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
  }

  return null;
}

function formatMonthYear(value: Date | string | null | undefined) {
  if (!value) return "A definir";
  return new Date(value).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function numberRange(from: number | null | undefined, to: number | null | undefined, suffix = "") {
  if (from && to) return `${from} a ${to}${suffix}`;
  if (from) return `${from}${suffix}`;
  if (to) return `${to}${suffix}`;
  return "-";
}

function getInitials(value: string) {
  const cleaned = value.trim();
  if (!cleaned) return "PS";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const development = await getPublicDevelopmentBySlug(slug);

  if (!development) {
    return {
      title: "Empreendimento não encontrado"
    };
  }

  const title = development.seoTitle || `${development.title} | Apartamentos na planta em ${development.city}`;
  const description =
    development.seoDescription ||
    `Conheça o ${development.title}, lançamento em ${development.city}, com plantas e condições atualizadas. Fale com Pedro Soares.`;
  const ogImage =
    development.seoOgImageUrl ||
    development.media.find((media) => media.isPrimary)?.url ||
    development.media.find((media) => media.kind === "HERO")?.url ||
    development.media[0]?.url;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/lancamentos/${development.slug}`
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/lancamentos/${development.slug}`,
      images: ogImage ? [{ url: ogImage }] : undefined
    }
  };
}

export default async function LancamentoDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const development = await getPublicDevelopmentBySlug(slug);

  if (!development) notFound();

  const heroSlides = development.media
    .filter((item) => item.kind === "HERO" || item.category === "HERO")
    .map((item) => ({
      id: item.id,
      url: item.url,
      alt: item.title || development.title,
      caption: item.caption || null
    }));

  const normalizedHeroSlides =
    heroSlides.length > 0
      ? heroSlides
      : development.media
          .filter((item) => item.kind !== "PDF")
          .slice(0, 5)
          .map((item) => ({
            id: item.id,
            url: item.url,
            alt: item.title || development.title,
            caption: item.caption || null
          }));

  const heroSlideIds = new Set(normalizedHeroSlides.map((item) => item.id));
  const gallery = development.media.filter((item) => item.kind !== "PDF" && !heroSlideIds.has(item.id));
  const normalizedGallery = gallery.length > 0 ? gallery : development.media.filter((item) => item.kind !== "PDF");
  const mapEmbedUrl = buildMapEmbedUrl(development);
  const mapOpenUrl = buildMapOpenUrl(development);
  const builderName = development.displayBuilderName ?? "A confirmar";
  const builderLogoUrl = development.builder?.logoUrl ?? null;
  const builderInitials = getInitials(builderName);
  const builderAbout =
    development.builder?.description?.trim() ||
    "Construtora parceira deste empreendimento.";
  const investmentAnalysis = getInvestmentPotentialAnalysis(development);
  const publicStage = investmentAnalysis.stage;
  const currentStageIndex = publicDevelopmentStageOrder.indexOf(publicStage);
  const investmentWhatsappMessage = `Olá, Pedro. Quero entender o potencial de valorização do empreendimento ${development.title} pela etapa atual da obra.`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Lançamentos", item: `${baseUrl}/lancamentos` },
      { "@type": "ListItem", position: 3, name: development.title, item: `${baseUrl}/lancamentos/${development.slug}` }
    ]
  };

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: development.title,
    description: development.description,
    url: `${baseUrl}/lancamentos/${development.slug}`,
    image: development.media.map((item) => item.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: development.startingPriceNumber ?? undefined,
      availability: "https://schema.org/InStock"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: development.city,
      addressRegion: "TO",
      streetAddress: development.address || development.district
    }
  };

  const residenceSchema = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: development.title,
    description: development.summary || development.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: development.address || development.district,
      addressLocality: development.city,
      addressRegion: "TO",
      addressCountry: "BR"
    },
    numberOfRooms: development.bedroomsTo ?? development.bedroomsFrom ?? undefined,
    floorSize:
      development.areaToM2Number || development.areaFromM2Number
        ? {
            "@type": "QuantitativeValue",
            unitCode: "MTK",
            value: development.areaToM2Number ?? development.areaFromM2Number
          }
        : undefined
  };

  const faqSchema =
    development.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: development.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer
            }
          }))
        }
      : null;

  return (
    <section className="section property-detail-page" style={{ paddingTop: 0 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(residenceSchema) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}

      <div className="development-hero-fullbleed">
        <div className="development-hero-slider-shell">
          <DevelopmentHeroSlider slides={normalizedHeroSlides} />
        </div>
      </div>

      <div className="container">
        <div className="card development-hero-info-card" style={{ overflow: "hidden", marginBottom: 16 }}>
          <div className={`development-hero-info${development.showBuilder ? "" : " no-builder"}`}>
            <div className="development-hero-info-main">
              <span className="badge" style={{ width: "fit-content" }}>{investmentAnalysis.stageLabel}</span>
              <h1 className="section-title title-luxury" style={{ margin: 0 }}>{development.title}</h1>
              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)", maxWidth: 860 }}>
                {development.tagline || development.summary}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="badge">{development.city} • {development.district}</span>
                <span className="badge">Entrega prevista: {formatMonthYear(development.deliveryDate)}</span>
              </div>
            </div>

            {development.showBuilder ? (
              <aside className="development-hero-builder-card" aria-label="Construtora responsável">
                <p className="development-hero-builder-label text-card">Construtora responsável</p>
                <div className="development-hero-builder-logo-shell">
                  {builderLogoUrl ? (
                    <Image
                      src={builderLogoUrl}
                      alt={`Logo da construtora ${builderName}`}
                      width={120}
                      height={120}
                      className="development-hero-builder-logo"
                    />
                  ) : (
                    <div className="development-hero-builder-logo-mock" role="img" aria-label={`Imagem mock da construtora ${builderName}`}>
                      <span>{builderInitials}</span>
                    </div>
                  )}
                </div>
                <p className="development-hero-builder-name title-luxury">{builderName}</p>
                <p className="development-hero-builder-caption text-card">Parceira deste empreendimento</p>
              </aside>
            ) : null}
          </div>
        </div>

        <div className="development-layout">
          <div style={{ display: "grid", gap: 14 }}>
            <article className="card" style={{ padding: 18 }}>
              <h2 className="title-luxury" style={{ marginTop: 0 }}>Informações principais</h2>
              <div className="grid-3" style={{ gap: 10 }}>
                <p className="property-summary-grid-item"><CircleDollarSign size={16} /> {development.startingPriceNumber ? `A partir de ${formatCurrencyBRL(development.startingPriceNumber)}` : "Sob consulta"}</p>
                <p className="property-summary-grid-item"><Ruler size={16} /> {numberRange(development.areaFromM2Number, development.areaToM2Number, " m²")}</p>
                <p className="property-summary-grid-item"><Bed size={16} /> {numberRange(development.bedroomsFrom, development.bedroomsTo, " quartos")}</p>
                <p className="property-summary-grid-item"><Bath size={16} /> {numberRange(development.bathroomsFrom, development.bathroomsTo, " banheiros")}</p>
                <p className="property-summary-grid-item"><Car size={16} /> {numberRange(development.parkingFrom, development.parkingTo, " vagas")}</p>
                <p className="property-summary-grid-item"><MapPin size={16} /> {development.city} • {development.district}</p>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <a href={buildWhatsAppUrl(buildDevelopmentMessage(development.title))} target="_blank" rel="noreferrer" className="button button-whatsapp">
                  Falar no WhatsApp
                </a>
                <a href={buildWhatsAppUrl(buildDevelopmentScheduleMessage(development.title))} target="_blank" rel="noreferrer" className="button button-ghost">
                  Agendar apresentação
                </a>
                {development.tablePdfUrl ? (
                  <a href={development.tablePdfUrl} target="_blank" rel="noreferrer" className="button button-ghost">
                    Receber tabela de preços
                  </a>
                ) : null}
              </div>
            </article>

            <article className="card" style={{ padding: 18 }}>
              <h2 className="title-luxury" style={{ marginTop: 0 }}>Projeto</h2>
              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                {development.projectText || development.description}
              </p>
            </article>

            <article className="card" style={{ padding: 18 }}>
              <h2 className="title-luxury" style={{ marginTop: 0 }}>Dados técnicos</h2>
              <div className="grid-3" style={{ gap: 10 }}>
                {development.landAreaM2Number ? <p className="property-summary-grid-item"><Ruler size={16} /> Terreno: {development.landAreaM2Number} m²</p> : null}
                {development.towersCount ? <p className="property-summary-grid-item">Torres: {development.towersCount}</p> : null}
                {development.floorsCount ? <p className="property-summary-grid-item">Pavimentos: {development.floorsCount}</p> : null}
                {development.totalUnits ? <p className="property-summary-grid-item">Unidades: {development.totalUnits}</p> : null}
                <p className="property-summary-grid-item"><Calendar size={16} /> Entrega: {formatMonthYear(development.deliveryDate)}</p>
                {development.incorporationRegistry ? <p className="property-summary-grid-item">Registro: {development.incorporationRegistry}</p> : null}
                {development.hasPatrimonyOfAffectation ? <p className="property-summary-grid-item">Patrimônio de afetação: Sim</p> : null}
              </div>
            </article>

            {normalizedGallery.length ? (
              <article className="card" style={{ padding: 18 }}>
                <h2 className="title-luxury" style={{ marginTop: 0 }}>Galeria</h2>
                <div className="grid-3">
                  {normalizedGallery.map((media) => (
                    <figure key={media.id} className="card" style={{ margin: 0, overflow: "hidden" }}>
                      <Image src={media.url} alt={media.title || development.title} width={960} height={620} style={{ width: "100%", height: 210, objectFit: "cover" }} />
                      {(media.title || media.caption) ? (
                        <figcaption className="text-card" style={{ padding: 10, color: "var(--text-muted)" }}>
                          {media.title || media.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </article>
            ) : null}

            {development.milestones.length ? (
              <article className="card" style={{ padding: 18 }}>
                <h2 className="title-luxury" style={{ marginTop: 0 }}>Marcos da obra</h2>
                <div style={{ display: "grid", gap: 8 }}>
                  {development.milestones.map((milestone) => (
                    <div key={milestone.id} className="development-milestone-row">
                      <strong>{milestone.title}</strong>
                      <p className="text-card" style={{ margin: "4px 0", color: "var(--text-muted)" }}>
                        {milestone.description || "Sem descrição"}
                      </p>
                      <small style={{ color: "var(--text-muted)" }}>
                        {milestone.status} {typeof milestone.progressPct === "number" ? `• ${milestone.progressPct}%` : ""}
                      </small>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}

            <article className="card" style={{ padding: 18 }}>
              <h2 className="title-luxury" style={{ marginTop: 0 }}>Áreas de convívio e lazer</h2>
              <div className="grid-3" style={{ gap: 10 }}>
                {development.amenities.map((item) => {
                  const Icon = pickAmenityIcon(item);
                  return (
                    <div key={item} className="property-summary-grid-item">
                      <Icon size={16} /> {item}
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="card" style={{ padding: 18 }}>
              <h2 className="title-luxury" style={{ marginTop: 0 }}>Apartamentos do {development.title}</h2>
              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                {development.apartmentsText || development.summary}
              </p>

              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {development.unitTypes.map((unit) => (
                  <div key={unit.id} className="card" style={{ padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <strong>{unit.name}</strong>
                      <span className="badge">{unit.isAvailable ? "Disponível" : "Indisponível"}</span>
                    </div>
                    <p className="text-card" style={{ margin: "6px 0", color: "var(--text-muted)" }}>
                      {numberRange(unit.areaPrivateM2Number ?? unit.areaFromM2Number, unit.areaTotalM2Number ?? unit.areaToM2Number, " m²")} • {numberRange(unit.bedrooms, unit.bedrooms, " quartos")} • {numberRange(unit.suites, unit.suites, " suítes")} • {numberRange(unit.parkingSpaces, unit.parkingSpaces, " vagas")}
                    </p>
                    <p style={{ margin: "0 0 8px", color: "var(--sophistication-gold-500)", fontWeight: 700 }}>
                      {unit.initialPriceNumber
                        ? `A partir de ${formatCurrencyBRL(unit.initialPriceNumber)}`
                        : unit.priceFromNumber
                          ? `A partir de ${formatCurrencyBRL(unit.priceFromNumber)}`
                          : "Preço sob consulta"}
                    </p>
                    {unit.description ? (
                      <p className="text-card" style={{ margin: "0 0 8px", color: "var(--text-muted)" }}>
                        {unit.description}
                      </p>
                    ) : null}
                    <a
                      className="button button-whatsapp"
                      href={buildWhatsAppUrl(buildDevelopmentUnitMessage(development.title, unit.name))}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Tenho interesse nessa planta
                    </a>
                  </div>
                ))}
              </div>
            </article>

            {development.showFloorplanTable ? (
              <article className="card" style={{ padding: 18 }}>
                <h2 className="title-luxury" style={{ marginTop: 0 }}>Quadro de áreas e preços</h2>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={tableHeadStyle}>A partir de</th>
                        <th style={tableHeadStyle}>Planta</th>
                        <th style={tableHeadStyle}>Área</th>
                        <th style={tableHeadStyle}>Quartos</th>
                        <th style={tableHeadStyle}>Suítes</th>
                        <th style={tableHeadStyle}>Banheiros</th>
                        <th style={tableHeadStyle}>Vagas</th>
                        <th style={tableHeadStyle}>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {development.unitTypes.map((unit) => (
                        <tr key={unit.id}>
                          <td style={tableCellStyle}>
                            {unit.initialPriceNumber
                              ? formatCurrencyBRL(unit.initialPriceNumber)
                              : unit.priceFromNumber
                                ? formatCurrencyBRL(unit.priceFromNumber)
                                : "Sob consulta"}
                          </td>
                          <td style={tableCellStyle}>{unit.name}</td>
                          <td style={tableCellStyle}>{numberRange(unit.areaPrivateM2Number ?? unit.areaFromM2Number, unit.areaTotalM2Number ?? unit.areaToM2Number, " m²")}</td>
                          <td style={tableCellStyle}>{unit.bedrooms ?? "-"}</td>
                          <td style={tableCellStyle}>{unit.suites ?? "-"}</td>
                          <td style={tableCellStyle}>{unit.bathrooms ?? "-"}</td>
                          <td style={tableCellStyle}>{unit.parkingSpaces ?? "-"}</td>
                          <td style={tableCellStyle}>
                            <a className="button button-ghost" href={buildWhatsAppUrl(buildDevelopmentUnitMessage(development.title, unit.name))} target="_blank" rel="noreferrer">
                              Contatar
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ) : null}

            {development.showInvestmentPotentialBlock ? (
              <article className="card development-investment-card">
                <div className="development-investment-header">
                  <div>
                    <p className="text-card development-investment-eyebrow">Etapa atual do empreendimento</p>
                    <h2 className="title-luxury">Potencial de Valorização por Etapa da Obra</h2>
                  </div>
                  <span className="development-investment-stage">{investmentAnalysis.stageLabel}</span>
                </div>

                <div className="development-stage-progress" aria-label={`Obra com ${investmentAnalysis.progressPct}% de avanço informado`}>
                  <div className="development-stage-track">
                    <div className="development-stage-fill" style={{ width: `${investmentAnalysis.progressPct}%` }} />
                  </div>
                  <div className="development-stage-progress-labels">
                    <span>{investmentAnalysis.progressPct}% da obra</span>
                    <span>Entrega: {formatMonthYear(development.deliveryDate)}</span>
                  </div>
                </div>

                <div className="development-stage-timeline">
                  {publicDevelopmentStageOrder.map((stageKey, index) => (
                    <div
                      key={stageKey}
                      className={`development-stage-step${stageKey === publicStage ? " is-active" : ""}${index < currentStageIndex ? " is-complete" : ""}`}
                    >
                      <span>{index < currentStageIndex ? <CheckCircle2 size={14} /> : index + 1}</span>
                      <strong>{developmentStageLabels[stageKey]}</strong>
                    </div>
                  ))}
                </div>

                <div className="development-investment-metrics">
                  <div><TrendingUp size={18} /><span>Potencial de valorização</span><strong>{investmentAnalysis.appreciationPotential}</strong></div>
                  <div><ShieldAlert size={18} /><span>Risco percebido</span><strong>{investmentAnalysis.perceivedRisk}</strong></div>
                  <div><BarChart3 size={18} /><span>Liquidez futura</span><strong>{investmentAnalysis.futureLiquidity}</strong></div>
                  <div><ShieldCheck size={18} /><span>Perfil indicado</span><strong>{investmentAnalysis.buyerProfile}</strong></div>
                </div>

                <div className="development-investment-copy">
                  <p className="text-card">
                    Este empreendimento está na fase de <strong>{investmentAnalysis.stageLabel}</strong>.
                  </p>
                  <p className="text-card">{investmentAnalysis.opportunityText}</p>
                  <p className="text-card development-investment-disclaimer">
                    A valorização é uma projeção de potencial baseada na etapa do empreendimento, localização, histórico da construtora e condições de mercado. Não há promessa de ganho, rentabilidade garantida ou resultado futuro.
                  </p>
                </div>

                <a
                  href={buildWhatsAppUrl(investmentWhatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-whatsapp development-investment-cta"
                >
                  <MessageCircle size={17} /> Quero analisar esta oportunidade
                </a>
              </article>
            ) : null}

            <article className="card" style={{ padding: 18 }}>
              <h2 className="title-luxury" style={{ marginTop: 0 }}>Diferenciais do {development.title}</h2>
              <div className="grid-3" style={{ gap: 10 }}>
                {development.differentials.map((item) => {
                  const Icon = pickFeatureIcon(item);
                  return (
                    <div key={item} className="property-summary-grid-item">
                      <Icon size={16} /> {item}
                    </div>
                  );
                })}
              </div>
            </article>

            {development.showBuilder ? (
              <article className="card development-builder-detail-card">
                <h2 className="title-luxury" style={{ marginTop: 0 }}>Construtora responsável</h2>
                <div className="development-builder-detail-head">
                  <div className="development-builder-detail-avatar-shell">
                    {builderLogoUrl ? (
                      <Image
                        src={builderLogoUrl}
                        alt={`Logo da construtora ${builderName}`}
                        width={108}
                        height={108}
                        className="development-builder-detail-avatar"
                      />
                    ) : (
                      <div className="development-builder-detail-avatar-mock" role="img" aria-label={`Imagem mock da construtora ${builderName}`}>
                        <span>{builderInitials}</span>
                      </div>
                    )}
                  </div>
                  <div className="development-builder-detail-meta">
                    <p className="development-builder-detail-kicker text-card">Parceiro estratégico</p>
                    <h3 className="development-builder-detail-name title-luxury">{builderName}</h3>
                  </div>
                </div>

                <p className="development-builder-detail-description text-card">{builderAbout}</p>

                {development.builder ? (
                  <>
                    <div className="development-builder-detail-stats">
                      <p className="development-builder-detail-stat text-card">
                        <span>Fundação</span>
                        <strong>{development.builder.foundedYear ?? "Não informado"}</strong>
                      </p>
                      <p className="development-builder-detail-stat text-card">
                        <span>Empreendimentos entregues</span>
                        <strong>{development.builder.deliveredDevelopmentsCount ?? "Não informado"}</strong>
                      </p>
                      <p className="development-builder-detail-stat text-card">
                        <span>Unidades entregues</span>
                        <strong>{development.builder.deliveredUnitsCount ?? "Não informado"}</strong>
                      </p>
                    </div>
                    {development.builder.slug ? (
                      <Link className="button button-ghost" href={`/construtoras/${development.builder.slug}`}>
                        Ver outros empreendimentos da construtora
                      </Link>
                    ) : null}
                  </>
                ) : (
                  <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                    Em breve vamos disponibilizar mais detalhes desta construtora.
                  </p>
                )}
              </article>
            ) : null}

            <article className="card" style={{ padding: 18 }}>
              <h2 className="title-luxury" style={{ marginTop: 0 }}>Localização do {development.title}</h2>
              <p className="text-card" style={{ marginTop: 0, color: "var(--text-muted)" }}>
                {development.locationText || `${development.city} • ${development.district}${development.neighborhood ? ` • ${development.neighborhood}` : ""}`}
              </p>

              {mapEmbedUrl && development.showMap ? (
                <div className="card property-map-card">
                  <iframe
                    title={`Mapa do empreendimento ${development.title}`}
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="property-map-card-footer">
                    <p>
                      {development.address || `${development.district}, ${development.city}`}
                    </p>
                    {mapOpenUrl ? (
                      <a href={mapOpenUrl} target="_blank" rel="noreferrer">
                        Abrir no Google Maps
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {Array.isArray(development.referencePoints) && development.referencePoints.length ? (
                <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                  {(development.referencePoints as Array<{ name?: string; distance?: string; type?: string }>).map((point, index) => (
                    <p key={`${point.name}-${index}`} className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
                      • {point.name} {point.distance ? `— ${point.distance}` : ""} {point.type ? `(${point.type})` : ""}
                    </p>
                  ))}
                </div>
              ) : null}
            </article>

            <article className="card" style={{ padding: 18 }}>
              <h2 className="title-luxury" style={{ marginTop: 0 }}>Atendimento com Pedro Soares</h2>
              <p className="text-card" style={{ marginTop: 0, color: "var(--text-muted)" }}>
                CRECI-TO 5861. Receba tabela atualizada, plantas disponíveis e análise do empreendimento com atendimento personalizado.
              </p>
              <a className="button button-whatsapp" href={buildWhatsAppUrl(buildDevelopmentMessage(development.title))} target="_blank" rel="noreferrer">
                Falar com Pedro Soares
              </a>
            </article>

            {development.faqs.length ? (
              <article className="card" style={{ padding: 18 }}>
                <h2 className="title-luxury" style={{ marginTop: 0 }}>FAQ</h2>
                <div className="property-faq-list">
                  {development.faqs.map((faq) => (
                    <details key={faq.id} className="property-faq-item">
                      <summary>{faq.question}</summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </article>
            ) : null}

            <article className="card" style={{ padding: 18 }}>
              <h2 className="title-luxury" style={{ marginTop: 0 }}>Gostou desse empreendimento?</h2>
              <p className="text-card" style={{ marginTop: 0, color: "var(--text-muted)" }}>
                Fale agora com Pedro Soares e receba tabela atualizada, plantas e condições de pagamento.
              </p>
              <a className="button button-whatsapp" href={buildWhatsAppUrl(buildDevelopmentMessage(development.title))} target="_blank" rel="noreferrer">
                Falar no WhatsApp
              </a>
            </article>
          </div>

          <DevelopmentInterestForm
            developmentId={development.id}
            developmentSlug={development.slug}
            developmentName={development.title}
            whatsappMessage={development.whatsappMessageTemplate || buildDevelopmentMessage(development.title)}
            tablePdfUrl={development.tablePdfUrl}
            unitTypes={development.unitTypes.map((unit) => ({ id: unit.id, name: unit.name }))}
          />
        </div>
      </div>
    </section>
  );
}

const tableHeadStyle: CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid #dbe4f0",
  color: "#64748b",
  fontSize: "var(--fs-12)"
};

const tableCellStyle: CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid #edf2f7",
  fontSize: "var(--fs-14)",
  verticalAlign: "top"
};
