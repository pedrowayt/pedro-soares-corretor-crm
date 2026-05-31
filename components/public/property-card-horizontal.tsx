import Link from "next/link";
import { PropertySpecs } from "@/components/public/property-specs";
import { formatCurrencyBRL } from "@/lib/utils";

type Props = {
  slug: string;
  title: string;
  city: string;
  district: string;
  price: number;
  imageUrl?: string;
  type?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  suites?: number | null;
  livingRooms?: number | null;
  areaM2?: number | null;
  landAreaM2?: number | null;
  frontMeters?: number | null;
  backMeters?: number | null;
  sideLeftMeters?: number | null;
  sideRightMeters?: number | null;
  ceilingHeightM?: number | null;
  floorNumber?: number | null;
  floorCount?: number | null;
  unitCount?: number | null;
  parkingSpaces?: number | null;
  status?: string | null;
  purposeLabel?: string;
  typeLabel?: string;
};

const STATUS_BADGE: Record<string, { label: string; tone: string }> = {
  VENDIDO: { label: "Vendido", tone: "tone-sold" },
  RESERVADO: { label: "Reservado", tone: "tone-reserved" },
  ALUGADO: { label: "Alugado", tone: "tone-rented" }
};

export function PropertyCardHorizontal({
  slug,
  title,
  city,
  district,
  price,
  imageUrl,
  type,
  bedrooms,
  bathrooms,
  suites,
  livingRooms,
  areaM2,
  landAreaM2,
  frontMeters,
  backMeters,
  sideLeftMeters,
  sideRightMeters,
  ceilingHeightM,
  floorNumber,
  floorCount,
  unitCount,
  parkingSpaces,
  status,
  purposeLabel,
  typeLabel
}: Props) {
  const statusBadge = status ? STATUS_BADGE[status] : undefined;
  const isSold = status === "VENDIDO";
  const href = `/imoveis/${slug}`;

  return (
    <article className={`property-list-card${isSold ? " is-sold" : ""}`}>
      <Link href={href} className="property-list-card-media" aria-label={`Ver ${title}`}>
        <span
          className="property-list-card-image"
          style={{ backgroundImage: `url(${imageUrl ?? "/brand/logo-light-bg.png"})` }}
          role="img"
          aria-label={title}
        />
        {statusBadge ? (
          <span className={`badge badge-${statusBadge.tone} property-list-card-status`}>
            {statusBadge.label}
          </span>
        ) : null}
      </Link>

      <div className="property-list-card-body">
        <div className="property-list-card-head">
          {purposeLabel || typeLabel ? (
            <p className="property-list-card-tags">
              {purposeLabel ? <span className="badge">{purposeLabel}</span> : null}
              {typeLabel ? <span className="badge">{typeLabel}</span> : null}
            </p>
          ) : null}
          <h3 className="property-list-card-title">
            <Link href={href}>{title}</Link>
          </h3>
          <p className="property-list-card-location">
            {district}, {city}
          </p>
          <PropertySpecs
            type={type}
            bedrooms={bedrooms}
            bathrooms={bathrooms}
            suites={suites}
            livingRooms={livingRooms}
            parkingSpaces={parkingSpaces}
            areaM2={areaM2}
            landAreaM2={landAreaM2}
            frontMeters={frontMeters}
            backMeters={backMeters}
            sideLeftMeters={sideLeftMeters}
            sideRightMeters={sideRightMeters}
            ceilingHeightM={ceilingHeightM}
            floorNumber={floorNumber}
            floorCount={floorCount}
            unitCount={unitCount}
            compact
          />
        </div>

        <div className="property-list-card-foot">
          <div>
            <p className="property-list-card-price">{formatCurrencyBRL(price)}</p>
          </div>
          <Link
            href={href}
            className={isSold ? "button button-ghost" : "button button-primary"}
          >
            {isSold ? "Ver vendido" : "Ver imóvel"}
          </Link>
        </div>
      </div>
    </article>
  );
}
