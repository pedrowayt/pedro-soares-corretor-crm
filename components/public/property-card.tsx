import Link from "next/link";
import { PropertySpecs } from "@/components/public/property-specs";
import { formatCurrencyBRL } from "@/lib/utils";

type PropertyCardProps = {
  slug: string;
  title: string;
  city: string;
  district: string;
  price: number;
  imageUrl?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaM2?: number | null;
  parkingSpaces?: number | null;
  status?: string | null;
};

const STATUS_BADGE: Record<string, { label: string; tone: string }> = {
  VENDIDO: { label: "Vendido", tone: "tone-sold" },
  RESERVADO: { label: "Reservado", tone: "tone-reserved" },
  ALUGADO: { label: "Alugado", tone: "tone-rented" }
};

export function PropertyCard({
  slug,
  title,
  city,
  district,
  price,
  imageUrl,
  bedrooms,
  bathrooms,
  areaM2,
  parkingSpaces,
  status
}: PropertyCardProps) {
  const statusBadge = status ? STATUS_BADGE[status] : undefined;
  const isSold = status === "VENDIDO";

  return (
    <article className={`card property-listing-card ${isSold ? "is-sold" : ""}`}>
      <div className="property-listing-media-wrap">
        <div
          className="property-listing-media"
          style={{
            backgroundImage: `url(${imageUrl ?? "/brand/logo-light-bg.png"})`
          }}
        />
        {statusBadge ? (
          <span className={`badge badge-${statusBadge.tone} property-listing-status`}>
            {statusBadge.label}
          </span>
        ) : null}
      </div>
      <div style={{ padding: 16 }}>
        <p className="badge" style={{ margin: 0 }}>
          {city} • {district}
        </p>
        <h3 className="title-luxury" style={{ margin: "12px 0 8px", fontSize: "var(--fs-20)" }}>
          {title}
        </h3>
        <p style={{ margin: 0, color: "var(--sophistication-gold-300)", fontWeight: 700 }}>{formatCurrencyBRL(price)}</p>
        <PropertySpecs
          bedrooms={bedrooms}
          bathrooms={bathrooms}
          parkingSpaces={parkingSpaces}
          areaM2={areaM2}
        />
        <Link
          href={`/imoveis/${slug}`}
          className={isSold ? "button button-ghost" : "button button-primary"}
        >
          {isSold ? "Ver imóvel vendido" : "Ver imóvel"}
        </Link>
      </div>
    </article>
  );
}
