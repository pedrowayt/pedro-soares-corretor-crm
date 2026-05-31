import type { PropertyType } from "@prisma/client";

/* -------------------------------------------------------------------------- */
/* Field catalogues                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Decimal/measurement inputs rendered as regular number boxes.
 * Each id must match a column on Property AND on the wizard FormState.
 */
export const DIMENSION_FIELDS = {
  areaM2: { label: "Área (m²)", placeholder: "180", step: "0.01" },
  landAreaM2: { label: "Terreno (m²)", placeholder: "360", step: "0.01" },
  frontMeters: { label: "Frente (m)", placeholder: "15", step: "0.01" },
  backMeters: { label: "Fundo (m)", placeholder: "15", step: "0.01" },
  sideLeftMeters: { label: "Lateral esquerda (m)", placeholder: "30", step: "0.01" },
  sideRightMeters: { label: "Lateral direita (m)", placeholder: "30", step: "0.01" },
  ceilingHeightM: { label: "Pé-direito (m)", placeholder: "4", step: "0.01" }
} as const;

export type DimensionFieldId = keyof typeof DIMENSION_FIELDS;

/**
 * Integer counters rendered as NumberStepper widgets.
 */
export const COUNTER_FIELDS = {
  bedrooms: "Quartos",
  livingRooms: "Salas",
  suites: "Suítes",
  bathrooms: "Banheiros",
  parkingSpaces: "Vagas",
  floorNumber: "Andar",
  floorCount: "Total de andares",
  unitCount: "Unidades"
} as const;

export type CounterFieldId = keyof typeof COUNTER_FIELDS;

/* -------------------------------------------------------------------------- */
/* Feature groups                                                              */
/* -------------------------------------------------------------------------- */

export type FeatureGroup = {
  id: string;
  title: string;
  icon: string;
  presets: ReadonlyArray<string>;
};

const HOUSE_GROUPS: FeatureGroup[] = [
  {
    id: "house-leisure",
    title: "Lazer e área externa",
    icon: "🏡",
    presets: ["Piscina", "Área gourmet", "Churrasqueira", "Quintal", "Jardim", "Espaço pet"]
  },
  {
    id: "house-condo",
    title: "Condomínio e segurança",
    icon: "🔒",
    presets: ["Condomínio fechado", "Portaria 24h", "Câmeras", "Salão de festas", "Playground"]
  },
  {
    id: "house-comfort",
    title: "Conforto",
    icon: "⚙️",
    presets: [
      "Mobiliado",
      "Energia solar",
      "Ar-condicionado",
      "Aquecedor solar",
      "Cozinha planejada",
      "Garagem coberta"
    ]
  },
  {
    id: "house-docs",
    title: "Documentação",
    icon: "📑",
    presets: [
      "Escriturado",
      "Registrado",
      "IPTU em dia",
      "Financiável",
      "Aceita financiamento",
      "Aceita permuta"
    ]
  },
  {
    id: "house-extras",
    title: "Diferenciais",
    icon: "⭐",
    presets: [
      "Vista panorâmica",
      "Próximo a escolas",
      "Próximo ao centro",
      "Recém-reformado",
      "Pronta para morar"
    ]
  }
];

const APARTMENT_GROUPS: FeatureGroup[] = [
  {
    id: "apt-building",
    title: "Edifício",
    icon: "🛗",
    presets: [
      "Elevador",
      "Portaria 24h",
      "Câmeras",
      "Salão de festas",
      "Espaço gourmet condomínio",
      "Salão de jogos",
      "Brinquedoteca"
    ]
  },
  {
    id: "apt-leisure",
    title: "Lazer do condomínio",
    icon: "🏋️",
    presets: ["Academia", "Piscina", "Quadra", "Sauna", "Spa", "Playground", "Espaço pet"]
  },
  {
    id: "apt-unit",
    title: "Unidade",
    icon: "🌅",
    presets: [
      "Varanda",
      "Varanda gourmet",
      "Sacada",
      "Mobiliado",
      "Reformado",
      "Ar-condicionado",
      "Cozinha planejada"
    ]
  },
  {
    id: "apt-docs",
    title: "Documentação",
    icon: "📑",
    presets: [
      "Escriturado",
      "Registrado",
      "IPTU em dia",
      "Financiável",
      "Aceita financiamento",
      "Aceita permuta"
    ]
  },
  {
    id: "apt-extras",
    title: "Diferenciais",
    icon: "⭐",
    presets: [
      "Vista panorâmica",
      "Vista para o lago",
      "Sol da manhã",
      "Sol da tarde",
      "Cobertura"
    ]
  }
];

const LAND_GROUPS: FeatureGroup[] = [
  {
    id: "land-topo",
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
    id: "land-docs",
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
    id: "land-infra",
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
    id: "land-zoning",
    title: "Zoneamento e uso",
    icon: "🏘️",
    presets: ["Residencial", "Comercial", "Misto", "Industrial", "Rural"]
  },
  {
    id: "land-extras",
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

const RURAL_GROUPS: FeatureGroup[] = [
  {
    id: "rural-water",
    title: "Recursos hídricos",
    icon: "💧",
    presets: ["Poço artesiano", "Nascente", "Rio", "Açude", "Lago"]
  },
  {
    id: "rural-vegetation",
    title: "Vegetação e uso",
    icon: "🌳",
    presets: [
      "Mata nativa",
      "Pastagem",
      "Plantação ativa",
      "Eucalipto",
      "Reflorestamento",
      "Frutíferas"
    ]
  },
  {
    id: "rural-structure",
    title: "Estrutura",
    icon: "🚜",
    presets: [
      "Sede principal",
      "Casa de caseiro",
      "Galpão",
      "Curral",
      "Energia elétrica",
      "Estrada de acesso"
    ]
  },
  {
    id: "rural-docs",
    title: "Documentação",
    icon: "📑",
    presets: [
      "Escriturado",
      "Registrado",
      "Reserva legal averbada",
      "Georreferenciado",
      "CCIR em dia",
      "ITR em dia"
    ]
  },
  {
    id: "rural-extras",
    title: "Diferenciais",
    icon: "⭐",
    presets: [
      "Topografia plana",
      "Acesso por asfalto",
      "Próximo à cidade",
      "Pronta para produzir"
    ]
  }
];

const COMMERCIAL_GROUPS: FeatureGroup[] = [
  {
    id: "com-structure",
    title: "Estrutura",
    icon: "🏢",
    presets: [
      "Ar-condicionado central",
      "Recepção",
      "Sala de espera",
      "Depósito",
      "Copa/cozinha",
      "Banheiros completos",
      "Vitrine",
      "Mezanino"
    ]
  },
  {
    id: "com-location",
    title: "Localização",
    icon: "🚪",
    presets: [
      "Térreo",
      "Esquina",
      "Frente para avenida",
      "Em shopping",
      "Em galeria",
      "Alto fluxo de pessoas"
    ]
  },
  {
    id: "com-infra",
    title: "Infraestrutura",
    icon: "🔌",
    presets: [
      "Energia trifásica",
      "Internet/fibra",
      "Gerador",
      "Câmeras",
      "Sistema de alarme",
      "Carga e descarga"
    ]
  },
  {
    id: "com-docs",
    title: "Documentação",
    icon: "📑",
    presets: [
      "Escriturado",
      "Habite-se",
      "IPTU em dia",
      "Alvará comercial",
      "Financiável",
      "Aceita permuta"
    ]
  },
  {
    id: "com-extras",
    title: "Diferenciais",
    icon: "⭐",
    presets: [
      "Estacionamento amplo",
      "Próximo ao centro",
      "Próximo ao transporte",
      "Vitrine para rua"
    ]
  }
];

const BUILDING_GROUPS: FeatureGroup[] = [
  {
    id: "bld-structure",
    title: "Estrutura",
    icon: "🛗",
    presets: [
      "Elevadores",
      "Hall recepção",
      "Portaria 24h",
      "Garagem subsolo",
      "Sistema de incêndio",
      "Gerador"
    ]
  },
  {
    id: "bld-common",
    title: "Áreas comuns",
    icon: "🏢",
    presets: ["Salão de festas", "Coworking", "Lavanderia coletiva", "Bicicletário", "Academia"]
  },
  {
    id: "bld-docs",
    title: "Documentação",
    icon: "📑",
    presets: [
      "Escriturado",
      "Habite-se",
      "IPTU em dia",
      "Convenção registrada",
      "Financiável"
    ]
  },
  {
    id: "bld-extras",
    title: "Diferenciais",
    icon: "⭐",
    presets: [
      "Recém-construído",
      "Reformado",
      "Localização privilegiada",
      "Próximo ao transporte"
    ]
  }
];

/* -------------------------------------------------------------------------- */
/* Categories                                                                  */
/* -------------------------------------------------------------------------- */

export type PropertyCategory = {
  id: string;
  label: string;
  icon: string;
  /** Types that resolve to this category. The first category that lists a type wins. */
  types: ReadonlyArray<PropertyType>;
  /** Dimension inputs to render (in order). */
  dimensions: ReadonlyArray<DimensionFieldId>;
  /** Counter steppers to render (in order). */
  counters: ReadonlyArray<CounterFieldId>;
  /** Grouped chip presets shown on the Características step. */
  groups: ReadonlyArray<FeatureGroup>;
  /** Optional hint shown at the top of the Características step. */
  hint?: string;
};

export const PROPERTY_CATEGORIES: ReadonlyArray<PropertyCategory> = [
  {
    id: "house",
    label: "Residencial — Casa",
    icon: "🏠",
    types: ["CASA", "CASA_EM_CONDOMINIO", "CASA_GEMINADA", "SOBRADO"],
    dimensions: ["areaM2", "landAreaM2"],
    counters: ["bedrooms", "suites", "bathrooms", "livingRooms", "parkingSpaces"],
    groups: HOUSE_GROUPS,
    hint: "Descreva metragem, cômodos, lazer e diferenciais. Quanto mais completo, melhor a busca para compradores."
  },
  {
    id: "apartment",
    label: "Residencial — Apartamento",
    icon: "🏢",
    types: ["APARTAMENTO", "AREA_PRIVATIVA", "COBERTURA", "FLAT"],
    dimensions: ["areaM2"],
    counters: ["bedrooms", "suites", "bathrooms", "livingRooms", "parkingSpaces", "floorNumber"],
    groups: APARTMENT_GROUPS,
    hint: "Inclua andar, varanda, lazer do condomínio e itens da unidade — são os critérios mais filtrados na busca por apto."
  },
  {
    id: "land",
    label: "Terreno",
    icon: "📐",
    types: ["LOTE", "LOTE_EM_CONDOMINIO"],
    dimensions: ["areaM2", "frontMeters", "backMeters", "sideLeftMeters", "sideRightMeters"],
    counters: [],
    groups: LAND_GROUPS,
    hint: "Adicione dimensões, topografia, documentação e infraestrutura — assim o comprador vê tudo que importa em um terreno."
  },
  {
    id: "rural",
    label: "Rural",
    icon: "🌾",
    types: ["CHACARA", "CHACARA_EM_CONDOMINIO", "FAZENDA", "RURAL"],
    dimensions: ["areaM2", "landAreaM2"],
    counters: ["bedrooms", "bathrooms", "parkingSpaces"],
    groups: RURAL_GROUPS,
    hint: "Inclua área da sede e do terreno, recursos hídricos, vegetação, estrutura produtiva e documentação rural."
  },
  {
    id: "commercial",
    label: "Comercial",
    icon: "🏪",
    types: ["COMERCIAL", "LOJA", "SALA", "GALPAO"],
    dimensions: ["areaM2", "ceilingHeightM"],
    counters: ["bathrooms", "parkingSpaces"],
    groups: COMMERCIAL_GROUPS,
    hint: "Foque em área útil, pé-direito, estrutura e localização — o comprador comercial olha esses pontos antes de qualquer coisa."
  },
  {
    id: "building",
    label: "Prédio",
    icon: "🏨",
    types: ["PREDIO"],
    dimensions: ["areaM2", "landAreaM2"],
    counters: ["floorCount", "unitCount", "parkingSpaces"],
    groups: BUILDING_GROUPS,
    hint: "Capture quantidade de andares e unidades, áreas comuns e documentação do empreendimento."
  }
];

const TYPE_TO_CATEGORY = new Map<PropertyType, PropertyCategory>();
for (const category of PROPERTY_CATEGORIES) {
  for (const type of category.types) {
    if (!TYPE_TO_CATEGORY.has(type)) {
      TYPE_TO_CATEGORY.set(type, category);
    }
  }
}

const DEFAULT_CATEGORY = PROPERTY_CATEGORIES[0];

export function getPropertyCategory(type: PropertyType | string | null | undefined): PropertyCategory {
  if (!type) return DEFAULT_CATEGORY;
  return TYPE_TO_CATEGORY.get(type as PropertyType) ?? DEFAULT_CATEGORY;
}

/** Flat list of every preset across every category — for "is this a custom feature?" checks. */
export const ALL_FEATURE_PRESETS: ReadonlyArray<string> = Array.from(
  new Set(PROPERTY_CATEGORIES.flatMap((category) => category.groups.flatMap((group) => group.presets)))
);

/**
 * Buckets a feature list into the groups of a specific category, plus a trailing
 * "Outros" bucket for anything that doesn't match a preset. Used by the public
 * detail page.
 */
export function groupFeaturesForCategory(
  features: ReadonlyArray<string>,
  category: PropertyCategory
): Array<{ id: string; title: string; icon: string; items: string[] }> {
  const buckets = category.groups.map((group) => ({
    id: group.id,
    title: group.title,
    icon: group.icon,
    items: [] as string[]
  }));
  const others: string[] = [];

  for (const feature of features) {
    const groupIndex = category.groups.findIndex((group) =>
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
