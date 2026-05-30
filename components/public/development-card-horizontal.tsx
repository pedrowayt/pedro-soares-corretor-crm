import Link from "next/link";
import { Bath, BedDouble, Building2, Car, Maximize } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/utils";

type Props = {
  slug: string;
  title: string;
  district: string;
  city: string;
  stageLabel: string;
  deliveryDate?: Date | string | null;
  startingPrice?: number | null;
  areaFromM2?: number | null;
  areaToM2?: number | null;
  bedroomsFrom?: number | null;
  bedroomsTo?: number | null;
  suitesFrom?: number | null;
  suitesTo?: number | null;
  parkingFrom?: number | null;
  parkingTo?: number | null;
  bathroomsFrom?: number | null;
  bathroomsTo?: number | null;
  builderName?: string | null;
  imageUrl?: string;
};

function range(from?: number | null, to?: number | null) {
  if (from && to && from !== to) return `${from} a ${to}`;
  if (from) return `${from}`;
  if (to) return `${to}`;
  return null;
}

function areaRange(from?: number | null, to?: number | null) {
  if (from && to && from !== to) return `${from} – ${to} m²`;
  if (from) return `${from} m²`;
  if (to) return `${to} m²`;
  return null;
}

export function DevelopmentCardHorizontal({
  slug,
  title,
  district,
  city,
  stageLabel,
  deliveryDate,
  startingPrice,
  areaFromM2,
  areaToM2,
  bedroomsFrom,
  bedroomsTo,
  suitesFrom,
  suitesTo,
  parkingFrom,
  parkingTo,
  bathroomsFrom,
  bathroomsTo,
  builderName,
  imageUrl
}: Props) {
  const deliveryLabel = deliveryDate
    ? new Date(deliveryDate).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
    : "Entrega a definir";

  const href = `/lancamentos/${slug}`;

  const bedroomsLabel = range(bedroomsFrom, bedroomsTo);
  const bathroomsLabel = range(bathroomsFrom, bathroomsTo);
  const parkingLabel = range(parkingFrom, parkingTo);
  const areaLabel = areaRange(areaFromM2, areaToM2);
  const suitesLabel = range(suitesFrom, suitesTo);

  const specs: Array<{ key: string; icon: React.ReactNode; label: string; title: string }> = [];
  if (bedroomsLabel)
    specs.push({
      key: "bedrooms",
      icon: <BedDouble aria-hidden="true" />,
      label: bedroomsLabel,
      title: `${bedroomsLabel} quartos`
    });
  if (bathroomsLabel)
    specs.push({
      key: "bathrooms",
      icon: <Bath aria-hidden="true" />,
      label: bathroomsLabel,
      title: `${bathroomsLabel} banheiros`
    });
  if (parkingLabel)
    specs.push({
      key: "parking",
      icon: <Car aria-hidden="true" />,
      label: parkingLabel,
      title: `${parkingLabel} vagas`
    });
  if (areaLabel)
    specs.push({
      key: "area",
      icon: <Maximize aria-hidden="true" />,
      label: areaLabel,
      title: `${areaLabel} de área`
    });

  return (
    <article className="property-list-card">
      <Link href={href} className="property-list-card-media" aria-label={`Ver ${title}`}>
        <span
          className="property-list-card-image"
          style={{ backgroundImage: `url(${imageUrl ?? "/brand/logo-light-bg.png"})` }}
          role="img"
          aria-label={title}
        />
        <span className="badge property-list-card-status">{stageLabel}</span>
      </Link>

      <div className="property-list-card-body">
        <div className="property-list-card-head">
          <p className="property-list-card-tags">
            <span className="badge">{deliveryLabel}</span>
            {builderName ? (
              <span className="property-list-card-builder">
                <Building2 aria-hidden="true" /> {builderName}
              </span>
            ) : null}
          </p>
          <h3 className="property-list-card-title">
            <Link href={href}>{title}</Link>
          </h3>
          <p className="property-list-card-location">
            {district}, {city}
          </p>
          {specs.length ? (
            <ul
              className="property-specs property-specs-compact"
              aria-label="Características do empreendimento"
            >
              {specs.map((item) => (
                <li key={item.key} title={item.title}>
                  <span className="property-specs-icon">{item.icon}</span>
                  <span className="property-specs-value">{item.label}</span>
                  <span className="sr-only">{item.title}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {suitesLabel ? (
            <p className="property-list-card-extra">{suitesLabel} suítes</p>
          ) : null}
        </div>

        <div className="property-list-card-foot">
          <div>
            <p className="property-list-card-price-label">A partir de</p>
            <p className="property-list-card-price">
              {startingPrice ? formatCurrencyBRL(startingPrice) : "Sob consulta"}
            </p>
          </div>
          <Link href={href} className="button button-primary">
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
