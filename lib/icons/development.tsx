import {
  Baby,
  BadgeDollarSign,
  Bath,
  Bed,
  BedDouble,
  Building2,
  Calendar,
  Car,
  Cctv,
  CircleDollarSign,
  CircleParking,
  Cog,
  Dumbbell,
  Flame,
  Gamepad2,
  HardHat,
  Helicopter,
  Home,
  Laptop,
  Leaf,
  MapPin,
  Martini,
  Package,
  PartyPopper,
  PawPrint,
  PlugZap,
  Sailboat,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  ShipWheel,
  Smile,
  Trees,
  Umbrella,
  Utensils,
  WashingMachine,
  Wifi,
  Waves
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const propertyInfoIconMap = {
  area: Ruler,
  bedrooms: Bed,
  suites: BedDouble,
  bathrooms: Bath,
  parkingSpaces: Car,
  location: MapPin,
  stage: Building2,
  price: CircleDollarSign,
  deliveryDate: Calendar,
  builder: HardHat,
  development: Home,
  priceRange: BadgeDollarSign
};

type DevelopmentIconOption = {
  value: string;
  label: string;
  Icon: LucideIcon;
  keywords: string[];
};

function normalizeIconText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export const developmentAmenityIconOptions = [
  { value: "shield", label: "Segurança", Icon: ShieldCheck, keywords: ["segurança", "seguranca", "portaria", "eclusa", "controle de acesso"] },
  { value: "cctv", label: "Câmeras", Icon: Cctv, keywords: ["câmera", "camera", "monitoramento", "cftv"] },
  { value: "automation", label: "Tecnologia", Icon: Cog, keywords: ["tecnologia", "automação", "automacao", "inovação", "inovacao", "sistema"] },
  { value: "wifi", label: "Conectividade", Icon: Wifi, keywords: ["wifi", "internet", "conectividade"] },
  { value: "ev", label: "Carro elétrico", Icon: PlugZap, keywords: ["carro elétrico", "carro eletrico", "veículo elétrico", "veiculo eletrico", "recarga", "carga"] },
  { value: "parking", label: "Estacionamento", Icon: CircleParking, keywords: ["estacionamento", "vaga", "garagem", "rotativo"] },
  { value: "pool", label: "Piscina", Icon: Waves, keywords: ["piscina", "borda infinita", "raia"] },
  { value: "fitness", label: "Fitness", Icon: Dumbbell, keywords: ["fitness", "academia", "musculação", "musculacao"] },
  { value: "party", label: "Salão de festas", Icon: PartyPopper, keywords: ["salão de festas", "salao de festas", "festas", "eventos"] },
  { value: "gourmet", label: "Gourmet", Icon: Utensils, keywords: ["gourmet", "churrasqueira", "gastronomia"] },
  { value: "kids", label: "Kids", Icon: Baby, keywords: ["kids", "brinquedoteca", "infantil", "playground"] },
  { value: "games", label: "Jogos", Icon: Gamepad2, keywords: ["jogos", "game", "arcade"] },
  { value: "pet", label: "Pet", Icon: PawPrint, keywords: ["pet", "pet place", "pet care"] },
  { value: "market", label: "Market", Icon: ShoppingCart, keywords: ["market", "mercado", "mini mercado", "conveniência", "conveniencia"] },
  { value: "laundry", label: "Lavanderia", Icon: WashingMachine, keywords: ["lavanderia", "lavanderia compartilhada"] },
  { value: "rooftop", label: "Rooftop", Icon: Building2, keywords: ["rooftop", "terraço", "terraco", "sky lounge"] },
  { value: "landscape", label: "Paisagismo", Icon: Trees, keywords: ["paisagismo", "jardim", "verde", "arborizado"] },
  { value: "beach", label: "Beach club", Icon: Umbrella, keywords: ["beach club", "praia", "clube", "beach"] },
  { value: "marina", label: "Marina", Icon: Sailboat, keywords: ["marina", "embarcação", "embarcacao", "barco"] },
  { value: "nautical", label: "Náutico", Icon: ShipWheel, keywords: ["náutico", "nautico", "lago", "pier"] },
  { value: "helipad", label: "Heliponto", Icon: Helicopter, keywords: ["heliponto", "helicóptero", "helicoptero"] },
  { value: "cocktail", label: "Lounge", Icon: Martini, keywords: ["lounge", "bar", "social"] },
  { value: "sustainable", label: "Sustentável", Icon: Leaf, keywords: ["sustentável", "sustentavel", "solar", "eficiência", "eficiencia"] },
  { value: "default", label: "Destaque", Icon: ShieldCheck, keywords: ["destaque", "diferencial"] }
] satisfies DevelopmentIconOption[];

export const developmentAmenityIconMap = Object.fromEntries(
  developmentAmenityIconOptions.map((item) => [item.value, item.Icon])
) as Record<string, LucideIcon>;

export function getDevelopmentAmenityIcon(icon: string | null | undefined, label = "") {
  if (icon && developmentAmenityIconMap[icon]) return developmentAmenityIconMap[icon];

  const normalizedLabel = normalizeIconText(label);
  const matched = developmentAmenityIconOptions.find((option) =>
    option.keywords.some((keyword) => normalizedLabel.includes(normalizeIconText(keyword)))
  );

  return matched?.Icon ?? ShieldCheck;
}

export const amenityIconMap: Record<string, LucideIcon> = {
  "piscina": Waves,
  "academia": Dumbbell,
  "espaço gourmet": Utensils,
  "espaco gourmet": Utensils,
  "salão de festas": PartyPopper,
  "salao de festas": PartyPopper,
  "brinquedoteca": Baby,
  "playground": Smile,
  "coworking": Laptop,
  "pet place": PawPrint,
  "espaço pet": PawPrint,
  "espaco pet": PawPrint,
  "churrasqueira": Flame,
  "espaço delivery": Package,
  "espaco delivery": Package,
  "mini mercado": ShoppingCart,
  "market": ShoppingCart,
  "lavanderia": WashingMachine,
  "sala de jogos": Gamepad2,
  "sauna": Waves,
  "quadra": ShieldCheck,
  "rooftop": Building2,
  "beach tennis": ShieldCheck,
  "beach club": Umbrella,
  "marina": Sailboat,
  "sustentável": Leaf,
  "sustentavel": Leaf
};

export const featureIconMap: Record<string, LucideIcon> = {
  "vista para o lago": Waves,
  "perto da marina": MapPin,
  "perto da praia": MapPin,
  "perto do shopping": ShoppingCart,
  "alto padrão": Building2,
  "alto padrao": Building2,
  "arquitetura": Building2,
  "tecnologia": Cog,
  "automação": Cog,
  "automacao": Cog,
  "segurança": ShieldCheck,
  "seguranca": ShieldCheck,
  "portaria": ShieldCheck,
  "carro elétrico": PlugZap,
  "carro eletrico": PlugZap,
  "estacionamento": CircleParking,
  "garagem": Car,
  "heliponto": Helicopter,
  "região em valorização": CircleDollarSign,
  "regiao em valorizacao": CircleDollarSign,
  "patrimônio de afetação": ShieldCheck,
  "patrimonio de afetacao": ShieldCheck,
  "registro de incorporação": ShieldCheck,
  "registro de incorporacao": ShieldCheck,
  "construtora renomada": HardHat,
  "entrada facilitada": BadgeDollarSign,
  "financiamento": CircleDollarSign,
  "poucas unidades": Home
};
