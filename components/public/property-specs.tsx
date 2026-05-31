import {
  ArrowUpFromLine,
  Bath,
  Bed,
  BedDouble,
  Car,
  DoorOpen,
  LandPlot,
  Layers,
  Maximize,
  Ruler,
  Sofa
} from "lucide-react";
import type { ReactNode } from "react";
import { getPropertyCategory } from "@/lib/property-categories";
import type { CounterFieldId, DimensionFieldId } from "@/lib/property-categories";

type Props = {
  type?: string | null;
  bedrooms?: number | null;
  livingRooms?: number | null;
  bathrooms?: number | null;
  suites?: number | null;
  parkingSpaces?: number | null;
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
  compact?: boolean;
  className?: string;
  /** Cap on the number of icons rendered (default 4). */
  maxItems?: number;
};

function formatArea(value: number) {
  if (Number.isInteger(value)) return value.toString();
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 1 }).replace(",0", "");
}

function formatMetersValue(value: number) {
  if (Number.isInteger(value)) return `${value} m`;
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 }).replace(",0", "")} m`;
}

const COUNTER_ICONS: Record<CounterFieldId, ReactNode> = {
  bedrooms: <BedDouble aria-hidden="true" />,
  livingRooms: <Sofa aria-hidden="true" />,
  suites: <Bed aria-hidden="true" />,
  bathrooms: <Bath aria-hidden="true" />,
  parkingSpaces: <Car aria-hidden="true" />,
  floorNumber: <ArrowUpFromLine aria-hidden="true" />,
  floorCount: <Layers aria-hidden="true" />,
  unitCount: <DoorOpen aria-hidden="true" />
};

const COUNTER_NAMES: Record<CounterFieldId, { singular: string; plural: string }> = {
  bedrooms: { singular: "quarto", plural: "quartos" },
  livingRooms: { singular: "sala", plural: "salas" },
  suites: { singular: "suíte", plural: "suítes" },
  bathrooms: { singular: "banheiro", plural: "banheiros" },
  parkingSpaces: { singular: "vaga", plural: "vagas" },
  floorNumber: { singular: "andar", plural: "andar" },
  floorCount: { singular: "andar", plural: "andares" },
  unitCount: { singular: "unidade", plural: "unidades" }
};

const DIMENSION_LABELS: Record<DimensionFieldId, string> = {
  areaM2: "área",
  landAreaM2: "de terreno",
  frontMeters: "de frente",
  backMeters: "de fundo",
  sideLeftMeters: "lateral esquerda",
  sideRightMeters: "lateral direita",
  ceilingHeightM: "de pé-direito"
};

const DIMENSION_ICONS: Record<DimensionFieldId, ReactNode> = {
  areaM2: <Maximize aria-hidden="true" />,
  landAreaM2: <LandPlot aria-hidden="true" />,
  frontMeters: <LandPlot aria-hidden="true" />,
  backMeters: <LandPlot aria-hidden="true" />,
  sideLeftMeters: <LandPlot aria-hidden="true" />,
  sideRightMeters: <LandPlot aria-hidden="true" />,
  ceilingHeightM: <Ruler aria-hidden="true" />
};

type SpecItem = { key: string; icon: ReactNode; label: string; title: string };

/**
 * Compact icon row showing the headline property specs. The fields shown
 * follow the property category (Casa/Apartamento/Terreno/Rural/Comercial/Prédio)
 * — only items with a real value get rendered, capped at `maxItems` (4 by
 * default).
 */
export function PropertySpecs({
  type,
  bedrooms,
  livingRooms,
  bathrooms,
  suites,
  parkingSpaces,
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
  compact,
  className,
  maxItems = 4
}: Props) {
  const category = getPropertyCategory(type ?? null);

  const dimensionValues: Record<DimensionFieldId, number | null | undefined> = {
    areaM2,
    landAreaM2,
    frontMeters,
    backMeters,
    sideLeftMeters,
    sideRightMeters,
    ceilingHeightM
  };

  const counterValues: Record<CounterFieldId, number | null | undefined> = {
    bedrooms,
    livingRooms,
    suites,
    bathrooms,
    parkingSpaces,
    floorNumber,
    floorCount,
    unitCount
  };

  const items: SpecItem[] = [];

  for (const id of category.counters) {
    const raw = counterValues[id];
    if (raw && raw > 0) {
      const name = COUNTER_NAMES[id];
      items.push({
        key: `c-${id}`,
        icon: COUNTER_ICONS[id],
        label: `${raw}`,
        title: `${raw} ${raw === 1 ? name.singular : name.plural}`
      });
    }
  }

  for (const id of category.dimensions) {
    const raw = dimensionValues[id];
    if (raw && raw > 0) {
      const isArea = id === "areaM2" || id === "landAreaM2";
      const label = isArea ? `${formatArea(raw)} m²` : formatMetersValue(raw);
      items.push({
        key: `d-${id}`,
        icon: DIMENSION_ICONS[id],
        label,
        title: `${label} ${DIMENSION_LABELS[id]}`
      });
    }
  }

  const trimmed = items.slice(0, maxItems);
  if (!trimmed.length) return null;

  return (
    <ul
      className={`property-specs${compact ? " property-specs-compact" : ""}${className ? ` ${className}` : ""}`}
      aria-label="Características do imóvel"
    >
      {trimmed.map((item) => (
        <li key={item.key} title={item.title}>
          <span className="property-specs-icon">{item.icon}</span>
          <span className="property-specs-value">{item.label}</span>
          <span className="sr-only">{item.title}</span>
        </li>
      ))}
    </ul>
  );
}
