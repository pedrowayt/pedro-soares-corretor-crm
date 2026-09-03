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
  }
];
