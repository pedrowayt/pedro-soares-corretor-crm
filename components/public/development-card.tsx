import Link from "next/link";
import { formatCurrencyBRL } from "@/lib/utils";

type DevelopmentCardProps = {
  slug: string;
  title: string;
  district: string;
  city: string;
  stage: string;
  deliveryDate?: Date | string | null;
  startingPrice?: number | null;
  imageUrl?: string;
};

export function DevelopmentCard({
  slug,
  title,
  district,
  city,
  stage,
  deliveryDate,
  startingPrice,
  imageUrl
}: DevelopmentCardProps) {
  const deliveryLabel = deliveryDate ? new Date(deliveryDate).toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" }) : "A definir";

  return (
    <article className="card" style={{ display: "grid", gridTemplateRows: "220px 1fr" }}>
      <div
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.55)), url(${imageUrl ?? "/brand/logo-light-bg.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div style={{ padding: 16, display: "grid", gap: 8 }}>
        <p className="badge" style={{ margin: 0 }}>
          {city} • {district}
        </p>
        <h3 className="title-luxury" style={{ margin: 0, fontSize: "1.3rem" }}>
          {title}
        </h3>
        <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
          Estágio: {stage} • Entrega: {deliveryLabel}
        </p>
        <p style={{ margin: 0, fontWeight: 700, color: "var(--sophistication-gold-300)" }}>
          A partir de {startingPrice ? formatCurrencyBRL(startingPrice) : "sob consulta"}
        </p>
        <Link href={`/lancamentos/${slug}`} className="button button-primary" style={{ width: "fit-content" }}>
          Ver empreendimento
        </Link>
      </div>
    </article>
  );
}
