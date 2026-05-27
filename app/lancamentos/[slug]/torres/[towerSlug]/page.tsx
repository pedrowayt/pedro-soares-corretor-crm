import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, Bed, Building2, Calendar, Car, MessageCircle, Ruler } from "lucide-react";
import { DevelopmentGallery } from "@/components/public/development-gallery";
import { DevelopmentHeroSlider } from "@/components/public/development-hero-slider";
import { DevelopmentInterestForm } from "@/components/public/development-interest-form";
import { getPublicDevelopmentTowerBySlug } from "@/lib/data/developments";
import { getDevelopmentAmenityIcon } from "@/lib/icons/development";
import { buildDevelopmentMessage, buildDevelopmentUnitMessage, buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { formatCurrencyBRL } from "@/lib/utils";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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

const unitStatusLabels: Record<string, string> = {
  DISPONIVEL: "Disponível",
  RESERVADA: "Reservada",
  VENDIDA: "Vendida",
  BLOQUEADA: "Bloqueada"
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; towerSlug: string }>;
}): Promise<Metadata> {
  const { slug, towerSlug } = await params;
  const data = await getPublicDevelopmentTowerBySlug(slug, towerSlug);

  if (!data) return { title: "Torre não encontrada" };

  const { development, tower, media } = data;
  const title = `${tower.name} do ${development.title} | ${development.city}`;
  const description =
    tower.description ||
    `Conheça plantas, fotos, ficha técnica e disponibilidade da ${tower.name} no ${development.title}.`;
  const ogImage =
    media.find((item) => item.kind === "HERO" || item.category === "HERO")?.url ||
    media[0]?.url ||
    development.media[0]?.url;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/lancamentos/${development.slug}/torres/${tower.slug || tower.id}`
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/lancamentos/${development.slug}/torres/${tower.slug || tower.id}`,
      images: ogImage ? [{ url: ogImage }] : undefined
    }
  };
}

export default async function DevelopmentTowerPage({
  params
}: {
  params: Promise<{ slug: string; towerSlug: string }>;
}) {
  const { slug, towerSlug } = await params;
  const data = await getPublicDevelopmentTowerBySlug(slug, towerSlug);

  if (!data) notFound();

  const { development, tower, unitTypes, units, media, amenityItems } = data;
  const heroSlides = media
    .filter((item) => item.kind === "HERO" || item.category === "HERO")
    .map((item) => ({
      id: item.id,
      url: item.url,
      alt: item.title || `${tower.name} - ${development.title}`,
      caption: item.caption || null
    }));
  const normalizedHeroSlides =
    heroSlides.length > 0
      ? heroSlides
      : media
          .filter((item) => item.kind !== "PDF")
          .slice(0, 5)
          .map((item) => ({
            id: item.id,
            url: item.url,
            alt: item.title || `${tower.name} - ${development.title}`,
            caption: item.caption || null
          }));
  const heroSlideIds = new Set(normalizedHeroSlides.map((item) => item.id));
  const gallery = media.filter((item) => item.kind !== "PDF" && !heroSlideIds.has(item.id));
  const areas = unitTypes
    .map((unit) => unit.areaPrivateM2Number ?? unit.areaFromM2Number ?? unit.areaTotalM2Number ?? unit.areaToM2Number)
    .filter((value): value is number => typeof value === "number");
  const bedrooms = unitTypes
    .map((unit) => unit.bedrooms)
    .filter((value): value is number => typeof value === "number");
  const parking = unitTypes
    .map((unit) => unit.parkingSpaces)
    .filter((value): value is number => typeof value === "number");
  const prices = unitTypes
    .map((unit) => unit.initialPriceNumber ?? unit.priceFromNumber)
    .filter((value): value is number => typeof value === "number");
  const highlightedAmenityItems = amenityItems.filter((item) => item.isHighlighted);
  const leisureItems = highlightedAmenityItems.filter((item) => item.type === "LAZER");
  const differentialItems = highlightedAmenityItems.filter((item) => item.type === "DIFERENCIAL");

  return (
    <section className="section property-detail-page" style={{ paddingTop: 0 }}>
      <div className="development-hero-fullbleed">
        <div className="development-hero-slider-shell">
          <DevelopmentHeroSlider slides={normalizedHeroSlides} />
        </div>
      </div>

      <div className="container">
        <div className="card development-hero-info-card" style={{ overflow: "hidden", marginBottom: 16 }}>
          <div className="development-hero-info no-builder">
            <div className="development-hero-info-main">
              <span className="badge" style={{ width: "fit-content" }}>{development.title}</span>
              <h1 className="section-title title-luxury" style={{ margin: 0 }}>{tower.name}</h1>
              <p className="text-card" style={{ margin: 0, color: "var(--text-muted)", maxWidth: 860 }}>
                {tower.description || development.summary}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="badge">{development.city} • {development.district}</span>
                {tower.propertyType ? <span className="badge">{tower.propertyType}</span> : null}
                <span className="badge">Entrega: {formatMonthYear(tower.deliveryDate || development.deliveryDate)}</span>
              </div>

              <div className="development-quick-facts">
                <div className="development-quick-fact">
                  <span className="development-quick-fact-label">A partir de</span>
                  <strong className="development-quick-fact-value">
                    {prices.length ? formatCurrencyBRL(Math.min(...prices)) : "Sob consulta"}
                  </strong>
                </div>
                <div className="development-quick-fact">
                  <span className="development-quick-fact-label">Área</span>
                  <strong className="development-quick-fact-value">
                    {areas.length ? numberRange(Math.min(...areas), Math.max(...areas), " m²") : "-"}
                  </strong>
                </div>
                <div className="development-quick-fact">
                  <span className="development-quick-fact-label">Quartos</span>
                  <strong className="development-quick-fact-value">
                    {bedrooms.length ? numberRange(Math.min(...bedrooms), Math.max(...bedrooms), "") : "-"}
                  </strong>
                </div>
                <div className="development-quick-fact">
                  <span className="development-quick-fact-label">Vagas</span>
                  <strong className="development-quick-fact-value">
                    {parking.length ? numberRange(Math.min(...parking), Math.max(...parking), "") : "-"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="development-toc" aria-label="Seções da torre">
          <span className="development-toc-label">Navegar</span>
          <a href="#ficha">Ficha técnica</a>
          {leisureItems.length ? <a href="#lazer">Lazer</a> : null}
          <a href="#plantas">Plantas</a>
          {units.length ? <a href="#disponibilidade">Disponibilidade</a> : null}
          {differentialItems.length ? <a href="#diferenciais">Diferenciais</a> : null}
          {gallery.length ? <a href="#galeria">Galeria</a> : null}
          <a href="#atendimento">Atendimento</a>
        </nav>

        <div className="development-layout">
          <div style={{ display: "grid", gap: 16 }}>
            <article id="ficha" className="development-section development-section--feature">
              <span className="development-section-eyebrow">Ficha técnica da torre</span>
              <h2 className="development-section-title">Dados da {tower.name}</h2>
              <div className="development-stats-grid">
                {tower.floorsCount ? <p className="property-summary-grid-item"><Building2 size={16} /> {tower.floorsCount} pavimentos</p> : null}
                {tower.elevatorsCount ? <p className="property-summary-grid-item">{tower.elevatorsCount} elevador{tower.elevatorsCount > 1 ? "es" : ""}</p> : null}
                {tower.totalUnits ? <p className="property-summary-grid-item">Unidades: {tower.totalUnits}</p> : null}
                {tower.availableUnits ? <p className="property-summary-grid-item">Disponíveis: {tower.availableUnits}</p> : null}
                <p className="property-summary-grid-item"><Calendar size={16} /> Entrega: {formatMonthYear(tower.deliveryDate || development.deliveryDate)}</p>
                {tower.incorporationRegistry ? <p className="property-summary-grid-item">Registro: {tower.incorporationRegistry}</p> : null}
              </div>
              <div className="development-section-actions">
                <Link className="button button-ghost" href={`/lancamentos/${development.slug}`}>
                  Voltar ao empreendimento
                </Link>
                <a className="button button-whatsapp" href={buildWhatsAppUrl(`Olá, Pedro. Quero informações sobre a ${tower.name} do empreendimento ${development.title}.`)} target="_blank" rel="noreferrer">
                  <MessageCircle size={17} /> Falar no WhatsApp
                </a>
              </div>
            </article>

            {leisureItems.length ? (
              <article id="lazer" className="development-section development-section--quiet">
                <h2 className="development-section-title">Lazer e serviços da {tower.name}</h2>
                <div className="development-stats-grid">
                  {leisureItems.map((item) => {
                    const Icon = getDevelopmentAmenityIcon(item.icon, `${item.label} ${item.description ?? ""}`);
                    return (
                      <div key={item.id} className="property-summary-grid-item" style={{ alignItems: "flex-start" }}>
                        <Icon size={16} />
                        <span style={{ display: "grid", gap: 2 }}>
                          <strong style={{ fontWeight: 700 }}>{item.label}</strong>
                          {item.description ? <small style={{ color: "var(--text-muted)" }}>{item.description}</small> : null}
                          {!item.towerId ? <small style={{ color: "var(--text-muted)" }}>Disponível no complexo</small> : null}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            ) : null}

            <article id="plantas" className="development-section development-section--feature">
              <span className="development-section-eyebrow">Plantas da torre</span>
              <h2 className="development-section-title">Plantas disponíveis na {tower.name}</h2>
              <div className="development-unit-grid">
                {unitTypes.map((unit) => {
                  const unitMedia = media.find((item) => item.unitTypeId === unit.id);
                  const previewUrl = unit.imageUrl || unitMedia?.url || null;
                  return (
                    <div key={unit.id} className="development-unit-card">
                      {previewUrl ? (
                        <div style={{ position: "relative", aspectRatio: "16 / 10", borderRadius: 8, overflow: "hidden", marginBottom: 10, background: "#eef2f7" }}>
                          <Image src={previewUrl} alt={unit.name} fill sizes="(max-width: 768px) 100vw, 360px" style={{ objectFit: "cover" }} />
                        </div>
                      ) : null}
                      <div className="development-unit-card-header">
                        <strong>{unit.name}</strong>
                        <span className={`development-unit-status development-unit-status--${unit.isAvailable ? "disponivel" : "bloqueada"}`}>
                          {unit.isAvailable ? "Disponível" : "Indisponível"}
                        </span>
                      </div>
                      <p className="development-unit-card-specs">
                        <span><Ruler size={14} /> {numberRange(unit.areaPrivateM2Number ?? unit.areaFromM2Number, unit.areaTotalM2Number ?? unit.areaToM2Number, " m²")}</span>
                        <span><Bed size={14} /> {unit.bedrooms ?? "-"}</span>
                        {unit.suites ? <span>{unit.suites} suíte{unit.suites > 1 ? "s" : ""}</span> : null}
                        {unit.bathrooms ? <span><Bath size={14} /> {unit.bathrooms}</span> : null}
                        {unit.parkingSpaces ? <span><Car size={14} /> {unit.parkingSpaces}</span> : null}
                      </p>
                      <p className="development-unit-card-price">
                        {unit.initialPriceNumber
                          ? `A partir de ${formatCurrencyBRL(unit.initialPriceNumber)}`
                          : unit.priceFromNumber
                            ? `A partir de ${formatCurrencyBRL(unit.priceFromNumber)}`
                            : "Preço sob consulta"}
                      </p>
                      {unit.description ? <p className="development-unit-card-description">{unit.description}</p> : null}
                      <a className="button button-whatsapp" href={buildWhatsAppUrl(buildDevelopmentUnitMessage(development.title, `${tower.name} - ${unit.name}`))} target="_blank" rel="noreferrer" style={{ marginTop: "auto" }}>
                        Tenho interesse
                      </a>
                    </div>
                  );
                })}
              </div>
            </article>

            {units.length ? (
              <article id="disponibilidade" className="development-section development-section--feature">
                <span className="development-section-eyebrow">Disponibilidade da torre</span>
                <h2 className="development-section-title">Unidades da {tower.name}</h2>
                <div className="development-table-scroll">
                  <table className="development-table">
                    <thead>
                      <tr>
                        <th>Unidade</th>
                        <th>Planta</th>
                        <th>Andar</th>
                        <th>Área</th>
                        <th>Status</th>
                        <th>Valor</th>
                        <th>Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {units.map((unit) => {
                        const statusKey = unit.status.toLowerCase();
                        const unitInterestLabel = [tower.name, unit.label, unit.unitTypeName].filter(Boolean).join(" - ");
                        return (
                          <tr key={unit.id}>
                            <td data-label="Unidade">{unit.label}</td>
                            <td data-label="Planta">{unit.unitTypeName ?? "-"}</td>
                            <td data-label="Andar">{unit.floor ?? "-"}</td>
                            <td data-label="Área">{unit.areaPrivateM2Number ? `${unit.areaPrivateM2Number} m²` : "-"}</td>
                            <td data-label="Status">
                              <span className={`development-unit-status development-unit-status--${statusKey}`}>
                                {unitStatusLabels[unit.status] ?? unit.status}
                              </span>
                            </td>
                            <td data-label="Valor">{unit.priceNumber ? formatCurrencyBRL(unit.priceNumber) : "Sob consulta"}</td>
                            <td>
                              <a className="button button-ghost" href={buildWhatsAppUrl(buildDevelopmentUnitMessage(development.title, unitInterestLabel))} target="_blank" rel="noreferrer">
                                Contatar
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </article>
            ) : null}

            {differentialItems.length ? (
              <article id="diferenciais" className="development-section development-section--quiet">
                <h2 className="development-section-title">Diferenciais da {tower.name}</h2>
                <div className="development-stats-grid">
                  {differentialItems.map((item) => {
                    const Icon = getDevelopmentAmenityIcon(item.icon, `${item.label} ${item.description ?? ""}`);
                    return (
                      <div key={item.id} className="property-summary-grid-item" style={{ alignItems: "flex-start" }}>
                        <Icon size={16} />
                        <span style={{ display: "grid", gap: 2 }}>
                          <strong style={{ fontWeight: 700 }}>{item.label}</strong>
                          {item.description ? <small style={{ color: "var(--text-muted)" }}>{item.description}</small> : null}
                          {!item.towerId ? <small style={{ color: "var(--text-muted)" }}>Diferencial do complexo</small> : null}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            ) : null}

            {gallery.length ? (
              <article id="galeria" className="development-section">
                <h2 className="development-section-title">Galeria da {tower.name}</h2>
                <DevelopmentGallery
                  developmentTitle={`${tower.name} - ${development.title}`}
                  items={gallery.map((item) => ({
                    id: item.id,
                    url: item.url,
                    title: item.title ?? null,
                    caption: item.caption ?? null
                  }))}
                />
              </article>
            ) : null}

            <DevelopmentInterestForm
              developmentId={development.id}
              developmentSlug={development.slug}
              developmentName={`${development.title} - ${tower.name}`}
              whatsappMessage={`Olá, Pedro. Quero informações sobre a ${tower.name} do empreendimento ${development.title}.`}
              tablePdfUrl={development.tablePdfUrl}
              unitTypes={unitTypes.map((unit) => ({
                id: unit.id,
                name: `${tower.name} • ${unit.name}`
              }))}
              units={units.map((unit) => ({
                id: unit.id,
                unitTypeId: unit.unitTypeId,
                label: unit.label,
                displayName: [tower.name, unit.label, unit.unitTypeName].filter(Boolean).join(" • ")
              }))}
            />
          </div>
        </div>
      </div>

      <div className="development-mobile-cta" aria-hidden="false">
        <a
          className="button button-whatsapp development-mobile-cta-button"
          href={buildWhatsAppUrl(buildDevelopmentMessage(`${development.title} - ${tower.name}`))}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={18} /> Falar no WhatsApp
        </a>
      </div>
    </section>
  );
}
