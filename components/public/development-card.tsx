import Link from "next/link";
import { buildDevelopmentMessage, buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { formatCurrencyBRL } from "@/lib/utils";

type DevelopmentCardProps = {
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
  builderName?: string | null;
  imageUrl?: string;
};

function numberRangeLabel(from?: number | null, to?: number | null, suffix = "") {
  if (from && to) return `${from} a ${to}${suffix}`;
  if (from) return `${from}${suffix}`;
  if (to) return `${to}${suffix}`;
  return "-";
}

export function DevelopmentCard({
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
  builderName,
  imageUrl
}: DevelopmentCardProps) {
  const deliveryLabel = deliveryDate
    ? new Date(deliveryDate).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
    : "A definir";

  const whatsappUrl = buildWhatsAppUrl(buildDevelopmentMessage(title));

  return (
    <article className="card" style={{ display: "grid", gridTemplateRows: "230px 1fr" }}>
      <div
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(7,13,24,.15), rgba(7,13,24,.72)), url(${imageUrl ?? "/brand/logo-light-bg.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <span className="badge">{stageLabel}</span>
          <span className="badge">Entrega: {deliveryLabel}</span>
        </div>
      </div>

      <div style={{ padding: 14, display: "grid", gap: 8 }}>
        <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>
          {district} • {city}
        </p>

        <h3 className="title-luxury" style={{ margin: 0, fontSize: "var(--fs-20)", lineHeight: 1.2 }}>
          {title}
        </h3>

        <p style={{ margin: 0, color: "var(--sophistication-gold-500)", fontWeight: 700 }}>
          A partir de {startingPrice ? formatCurrencyBRL(startingPrice) : "Sob consulta"}
        </p>

        <p className="text-card" style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--fs-14)" }}>
          {numberRangeLabel(areaFromM2, areaToM2, " m²")} • {numberRangeLabel(bedroomsFrom, bedroomsTo, " quartos")} • {numberRangeLabel(suitesFrom, suitesTo, " suítes")} • {numberRangeLabel(parkingFrom, parkingTo, " vagas")}
        </p>

        <p className="text-card" style={{ margin: 0, color: "var(--text-muted)", fontSize: "var(--fs-14)" }}>
          Construtora: {builderName || "A confirmar"}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Link href={`/lancamentos/${slug}`} className="button button-primary" style={{ width: "100%" }}>
            Ver detalhes
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button button-whatsapp" style={{ width: "100%" }}>
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
