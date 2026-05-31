import type { PropertyType } from "@prisma/client";

/**
 * Property types where the wizard and the public detail page should use the
 * land-specific UI (dimensions, topography chips, etc.) instead of the regular
 * residential layout (quartos, suítes, vagas, ...).
 */
export const LAND_PROPERTY_TYPES: ReadonlyArray<PropertyType> = ["LOTE", "LOTE_EM_CONDOMINIO"];

export function isLandPropertyType(type: PropertyType | string | null | undefined): boolean {
  if (!type) return false;
  return (LAND_PROPERTY_TYPES as ReadonlyArray<string>).includes(type);
}

export type LandFeatureGroup = {
  id: string;
  title: string;
  icon: string;
  presets: ReadonlyArray<string>;
};

export const LAND_FEATURE_GROUPS: ReadonlyArray<LandFeatureGroup> = [
  {
    id: "topografia",
    title: "Características do terreno",
    icon: "🏗️",
    presets: [
      "Plano",
      "Semi-plano",
      "Aclive",
      "Declive",
      "Murado",
      "Cercado",
      "Limpo",
      "Com árvores",
      "Com construção antiga"
    ]
  },
  {
    id: "documentacao",
    title: "Documentação",
    icon: "📑",
    presets: [
      "Matrícula individualizada",
      "Escriturado",
      "Registrado",
      "IPTU em dia",
      "Financiável",
      "Aceita financiamento"
    ]
  },
  {
    id: "infraestrutura",
    title: "Infraestrutura",
    icon: "⚡",
    presets: [
      "Água encanada",
      "Energia elétrica",
      "Rede de esgoto",
      "Asfalto",
      "Iluminação pública",
      "Internet/fibra óptica"
    ]
  },
  {
    id: "zoneamento",
    title: "Zoneamento e uso",
    icon: "🏘️",
    presets: ["Residencial", "Comercial", "Misto", "Industrial", "Rural"]
  },
  {
    id: "diferenciais",
    title: "Diferenciais",
    icon: "⭐",
    presets: [
      "Esquina",
      "Frente para avenida",
      "Frente para lago ou área verde",
      "Condomínio fechado",
      "Alto potencial de valorização",
      "Excelente para investimento",
      "Próximo ao centro"
    ]
  }
];

/** Flat list of every preset across all land groups, useful for "is custom?" checks. */
export const LAND_FEATURE_PRESETS: ReadonlyArray<string> = LAND_FEATURE_GROUPS.flatMap(
  (group) => group.presets
);

/**
 * Buckets a feature list into the land groups (in declaration order) plus a
 * trailing "Outros" bucket for anything that doesn't match a preset. Useful for
 * the public detail page when rendering a lot's features.
 */
export function groupLandFeatures(
  features: ReadonlyArray<string>
): Array<{ id: string; title: string; icon: string; items: string[] }> {
  const buckets = LAND_FEATURE_GROUPS.map((group) => ({
    id: group.id,
    title: group.title,
    icon: group.icon,
    items: [] as string[]
  }));
  const others: string[] = [];

  for (const feature of features) {
    const groupIndex = LAND_FEATURE_GROUPS.findIndex((group) =>
      (group.presets as ReadonlyArray<string>).includes(feature)
    );
    if (groupIndex >= 0) {
      buckets[groupIndex].items.push(feature);
    } else {
      others.push(feature);
    }
  }

  const result = buckets.filter((bucket) => bucket.items.length > 0);
  if (others.length) {
    result.push({ id: "outros", title: "Outros", icon: "✨", items: others });
  }
  return result;
}
