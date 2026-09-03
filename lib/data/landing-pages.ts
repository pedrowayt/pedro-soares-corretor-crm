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

// Catálogo editorial para landing pages de captação que ainda não possuem
// ficha completa no catálogo de empreendimentos do CRM.
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
    category: "Imóveis de luxo",
    location: "Recanto Santa Luzia · Miracema do Tocantins/TO",
    summary: "Condomínio de chácaras com lago, lazer, esporte, família e infraestrutura completa.",
    image: "/brand/quinta-do-lago/revista/hero-lago.jpg",
    status: "Atendimento personalizado"
  }
];
