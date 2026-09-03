export type PublicLandingPage = {
  slug: string;
  href: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  image: string;
  status: string;
};

// Catálogo editorial central das landing pages de captação.
// A home consome todos os itens deste array e cria os cards automaticamente.
export const publicLandingPages: PublicLandingPage[] = [
  {
    slug: "like-210",
    href: "/like-210",
    title: "LIKE 210",
    category: "Studios e apartamentos",
    location: "210 Sul · Palmas/TO",
    summary: "Studios e apartamentos em frente ao IFTO, com rooftop, lazer completo e localização estratégica.",
    image: "/like-210/facade.jpg",
    status: "Lançamento"
  },
  {
    slug: "lake-village",
    href: "/lake-village",
    title: "Lake Village Residences",
    category: "Lote em condomínio",
    location: "Luzimangues · Porto Nacional/TO",
    summary: "Condomínio fechado à beira do lago de Palmas, para morar, investir ou ter uma segunda residência.",
    image: "/brand/lake-village-cover.png",
    status: "Pré-cadastro aberto"
  },
  {
    slug: "quinta-do-lago",
    href: "/quinta-do-lago",
    title: "Quinta do Lago",
    category: "Condomínio de chácaras",
    location: "Recanto Santa Luzia · Miracema do Tocantins/TO",
    summary: "Condomínio de chácaras com lago, lazer, esporte, família e infraestrutura completa.",
    image: "/brand/quinta-do-lago/fotos/quiosques.jpeg",
    status: "Atendimento personalizado"
  },
  {
    slug: "acordes",
    href: "/acordes",
    title: "Acordes Tower by Tewal",
    category: "Studios e 2 suítes",
    location: "Orla 14 · Palmas/TO",
    summary: "Um empreendimento contemporâneo com studios, apartamentos de 2 suítes, lazer elevado e vocação para morar ou investir.",
    image: "/brand/acordes/fachada-3.webp",
    status: "Lançamento"
  },
  {
    slug: "lake-sky",
    href: "/palmas-lake/lake-sky",
    title: "Lake Sky",
    category: "Residencial · 2032",
    location: "Palmas Lake · Palmas/TO",
    summary: "Coberturas duplex e mansões suspensas com vista permanente para o lago de Palmas.",
    image: "/brand/palmas-lake/sky.jpg",
    status: "Lançamento Palmas Lake"
  },
  {
    slug: "lake-garden",
    href: "/palmas-lake/lake-garden",
    title: "Lake Garden",
    category: "Residencial · 2032",
    location: "Palmas Lake · Palmas/TO",
    summary: "Residências amplas, paisagismo exuberante e a tranquilidade de morar de frente para o lago.",
    image: "/brand/palmas-lake/garden.jpg",
    status: "Lançamento Palmas Lake"
  },
  {
    slug: "lake-park",
    href: "/palmas-lake/lake-park",
    title: "Lake Park",
    category: "Residencial · 2032",
    location: "Palmas Lake · Palmas/TO",
    summary: "Plantas amplas, living integrado e um ponto de entrada especial entre as torres residenciais do complexo.",
    image: "/brand/palmas-lake/park.jpg",
    status: "Lançamento Palmas Lake"
  },
  {
    slug: "lake-loft",
    href: "/palmas-lake/lake-loft",
    title: "Lake Loft",
    category: "Multifuncional · 2029",
    location: "Palmas Lake · Palmas/TO",
    summary: "Lofts compactos e inteligentes preparados para morar, hospedar ou investir.",
    image: "/brand/palmas-lake/loft.jpg",
    status: "Lançamento Palmas Lake"
  },
  {
    slug: "lake-office",
    href: "/palmas-lake/lake-office",
    title: "Lake Office",
    category: "Business center · 2029",
    location: "Palmas Lake · Palmas/TO",
    summary: "Salas e lajes corporativas conectadas ao Lake Mall, à marina e ao ritmo da orla.",
    image: "/brand/palmas-lake/office.jpg",
    status: "Lançamento Palmas Lake"
  },
  {
    slug: "lake-mall",
    href: "/palmas-lake/lake-mall",
    title: "Lake Mall",
    category: "Shopping conceito · 2029",
    location: "Palmas Lake · Palmas/TO",
    summary: "Gastronomia, serviços e encontros com a água como paisagem, integrados à Marina e às torres do complexo.",
    image: "/brand/palmas-lake/mall.jpg",
    status: "Lançamento Palmas Lake"
  }
];
