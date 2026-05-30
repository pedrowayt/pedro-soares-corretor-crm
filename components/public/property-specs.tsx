import { Bath, BedDouble, Car, Maximize } from "lucide-react";

type Props = {
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaM2?: number | null;
  parkingSpaces?: number | null;
  compact?: boolean;
  className?: string;
};

function formatArea(value: number) {
  if (Number.isInteger(value)) return value.toString();
  return value
    .toLocaleString("pt-BR", { maximumFractionDigits: 1 })
    .replace(",0", "");
}

/**
 * Compact icon row showing the headline property specs (quartos, banheiros,
 * vagas, área). Items with falsy values are hidden so cards stay clean.
 */
export function PropertySpecs({
  bedrooms,
  bathrooms,
  areaM2,
  parkingSpaces,
  compact,
  className
}: Props) {
  const items: Array<{ key: string; icon: React.ReactNode; label: string; title: string }> = [];

  if (bedrooms && bedrooms > 0) {
    items.push({
      key: "bedrooms",
      icon: <BedDouble aria-hidden="true" />,
      label: `${bedrooms}`,
      title: `${bedrooms} ${bedrooms === 1 ? "quarto" : "quartos"}`
    });
  }

  if (bathrooms && bathrooms > 0) {
    items.push({
      key: "bathrooms",
      icon: <Bath aria-hidden="true" />,
      label: `${bathrooms}`,
      title: `${bathrooms} ${bathrooms === 1 ? "banheiro" : "banheiros"}`
    });
  }

  if (parkingSpaces && parkingSpaces > 0) {
    items.push({
      key: "parking",
      icon: <Car aria-hidden="true" />,
      label: `${parkingSpaces}`,
      title: `${parkingSpaces} ${parkingSpaces === 1 ? "vaga" : "vagas"}`
    });
  }

  if (areaM2 && areaM2 > 0) {
    items.push({
      key: "area",
      icon: <Maximize aria-hidden="true" />,
      label: `${formatArea(areaM2)} m²`,
      title: `${formatArea(areaM2)} m² de área`
    });
  }

  if (!items.length) return null;

  return (
    <ul
      className={`property-specs${compact ? " property-specs-compact" : ""}${className ? ` ${className}` : ""}`}
      aria-label="Características do imóvel"
    >
      {items.map((item) => (
        <li key={item.key} title={item.title}>
          <span className="property-specs-icon">{item.icon}</span>
          <span className="property-specs-value">{item.label}</span>
          <span className="sr-only">{item.title}</span>
        </li>
      ))}
    </ul>
  );
}
