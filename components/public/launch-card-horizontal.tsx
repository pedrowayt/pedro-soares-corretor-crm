import Link from "next/link";
import { formatCurrencyBRL } from "@/lib/utils";

type Props = {
  href: string;
  title: string;
  city: string;
  district: string;
  category: string;
  status: string;
  summary: string;
  imageUrl?: string;
  startingPrice?: number | null;
  bedroomsFrom?: number | null;
  areaFromM2?: number | null;
};

export function LaunchCardHorizontal({
  href,
  title,
  city,
  district,
  category,
  status,
  summary,
  imageUrl,
  startingPrice,
  bedroomsFrom,
  areaFromM2
}: Props) {
  const specs = [
    bedroomsFrom ? `${bedroomsFrom}+ quartos` : null,
    areaFromM2 ? `${areaFromM2} m²` : null
  ].filter(Boolean);

  return (
    <article className="property-list-card property-list-card--launch">
      <Link href={href} className="property-list-card-media" aria-label={`Conhecer ${title}`}>
        <span
          className="property-list-card-image"
          style={{ backgroundImage: `url(${imageUrl ?? "/brand/logo-light-bg.png"})` }}
          role="img"
          aria-label={title}
        />
        <span className="badge property-list-card-status">{status}</span>
      </Link>

      <div className="property-list-card-body">
        <div className="property-list-card-head">
          <p className="property-list-card-tags">
            <span className="badge">Lançamento</span>
            <span className="badge">{category}</span>
          </p>
          <h3 className="property-list-card-title">
            <Link href={href}>{title}</Link>
          </h3>
          <p className="property-list-card-location">
            {district}, {city}
          </p>
          {specs.length ? <p className="property-list-card-extra">{specs.join(" · ")}</p> : null}
          <p className="property-list-card-extra">{summary}</p>
        </div>

        <div className="property-list-card-foot">
          <div>
            <p className="property-list-card-price-label">{startingPrice ? "A partir de" : "Condições"}</p>
            <p className="property-list-card-price">
              {startingPrice ? formatCurrencyBRL(startingPrice) : "Sob consulta"}
            </p>
          </div>
          <Link href={href} className="button button-primary">
            Conhecer lançamento
          </Link>
        </div>
      </div>
    </article>
  );
}
