import Link from "next/link";
import { formatCurrencyBRL } from "@/lib/utils";

type PropertyCardProps = {
  slug: string;
  title: string;
  city: string;
  district: string;
  price: number;
  imageUrl?: string;
  bedrooms?: number | null;
  areaM2?: number | null;
};

export function PropertyCard({
  slug,
  title,
  city,
  district,
  price,
  imageUrl,
  bedrooms,
  areaM2
}: PropertyCardProps) {
  return (
    <article className="card">
      <div
        style={{
          aspectRatio: "16 / 10",
          backgroundImage: `url(${imageUrl ?? "/brand/logo-light-bg.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div style={{ padding: 16 }}>
        <p className="badge" style={{ margin: 0 }}>
          {city} • {district}
        </p>
        <h3 className="title-luxury" style={{ margin: "12px 0 8px", fontSize: "var(--fs-20)" }}>
          {title}
        </h3>
        <p style={{ margin: 0, color: "var(--sophistication-gold-300)", fontWeight: 700 }}>{formatCurrencyBRL(price)}</p>
        <p style={{ margin: "8px 0 14px", color: "var(--text-muted)", fontSize: "var(--fs-14)" }}>
          {bedrooms ? `${bedrooms} quartos` : "-"} • {areaM2 ? `${areaM2} m²` : "-"}
        </p>
        <Link href={`/imoveis/${slug}`} className="button button-primary">
          Ver imóvel
        </Link>
      </div>
    </article>
  );
}
