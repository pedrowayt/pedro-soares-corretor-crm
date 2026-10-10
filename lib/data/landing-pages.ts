import type { PropertyType } from "@prisma/client";

export type PublicLandingPage = {
  slug: string;
  href: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  image: string;
  status: string;
  /** Optional catalog classification used by the unified public search. */
  propertyTypes?: PropertyType[];
};

// Atalho editorial para proprietários. Ele aparece em uma faixa própria na
// home, fora do catálogo de lançamentos e empreendimentos.
export const exclusiveManagementLanding: PublicLandingPage = {
  slug: "gestao-exclusiva",
  href: "/gestao-exclusiva",
  title: "Gestão Exclusiva de Venda",
  category: "Serviço para proprietários",
  location: "Palmas/TO",
  summary: "Venda seu imóvel com estratégia, divulgação profissional e um único responsável pela negociação.",
  image: "/brand/pedro-portrait-3.png",
  status: "Atendimento personalizado"
};

// Catálogo editorial central das landing pages de lançamentos.
// Serviços para proprietários ficam fora deste array para não serem misturados
// à seção de empreendimentos da home nem à página /lancamentos.
export const publicLandingPages: PublicLandingPage[] = [
  {
    slug: "urban-haute",
    href: "/urban-haute",
    title: "Urban Haute",
    category: "Mixed-use de alta arquitetura",
    location: "ACSU NO13 · Palmas/TO",
    summary: "Residências, penthouses, offices e boulevard gastronômico ao lado do Capim Dourado Shopping.",
    image: "/brand/urban-haute/social-23.png",
    status: "Lançamento",
    propertyTypes: ["APARTAMENTO", "COMERCIAL"]
  },
  {
    slug: "comodoro-by-fama",
    href: "/comodoro",
    title: "Comodoro by Fama",
    category: "Residencial de alto padrão",
    location: "Orla 14 · Palmas/TO",
    summary: "Uma honraria na Orla 14, com arquitetura autoral, lazer completo e a paisagem do Lago de Palmas como horizonte.",
    image: "/brand/comodoro/site/fachada.webp",
    status: "Lançamento",
    propertyTypes: ["APARTAMENTO"]
  },
  {
    slug: "you-by-fama",
    href: "/you",
    title: "YOU by Fama",
    category: "Residencial contemporâneo",
    location: "Região da Orla · Palmas/TO",
    summary: "Arquitetura contemporânea, vista para o lago, lazer, bem-estar e conveniência para viver a Orla do seu jeito.",
    image: "/brand/you/optimized/render-exterior.jpg",
    status: "Lançamento",
    propertyTypes: ["APARTAMENTO"]
  },
  {
    slug: "heritage-fama",
    href: "/heritage",
    title: "Heritage Fama",
    category: "Residencial de alto padrão",
    location: "Orla de Palmas · Palmas/TO",
    summary: "Um legado projetado para transformar a orla de Palmas, com qualidade, sofisticação e propósito.",
    image: "/heritage/hero-project.png",
    status: "Lançamento",
    propertyTypes: ["APARTAMENTO"]
  },
  {
    slug: "maestria",
    href: "/maestria",
    title: "Maestria Urban Design",
    category: "Apartamentos de alto padrão",
    location: "Orla 14 · Palmas/TO",
    summary: "Arquitetura autoral, lazer completo e vista definitiva para o Lago de Palmas em todas as unidades.",
    image: "/brand/maestria/projeto-arquitetonico.png",
    status: "Lançamento",
    propertyTypes: ["APARTAMENTO"]
  },
  {
    slug: "like-210",
    href: "/like-210",
    title: "LIKE 210",
    category: "Studios e apartamentos",
    location: "210 Sul · Palmas/TO",
    summary: "Studios e apartamentos em frente ao IFTO, com rooftop, lazer completo e localização estratégica.",
    image: "/like-210/facade.jpg",
    status: "Lançamento",
    propertyTypes: ["APARTAMENTO", "FLAT"]
  },
  {
    slug: "lake-village",
    href: "/lake-village",
    title: "Lake Village Residences",
    category: "Lote em condomínio",
    location: "Luzimangues · Porto Nacional/TO",
    summary: "Condomínio fechado à beira do lago em Luzimangues, com lazer, convivência e proposta para morar, investir ou ter uma segunda residência.",
    image: "/brand/lake-village/atualizacao-2026-09/foto-01-masterplan.jpg",
    status: "Lançamento em breve",
    propertyTypes: ["LOTE_EM_CONDOMINIO"]
  },
  {
    slug: "quinta-do-lago",
    href: "/quinta-do-lago",
    title: "Quinta do Lago",
    category: "Condomínio de chácaras",
    location: "Recanto Santa Luzia · Miracema do Tocantins/TO",
    summary: "Condomínio de chácaras com lago, lazer, esporte, família e infraestrutura completa.",
    image: "/brand/quinta-do-lago/fotos/quiosques.jpeg",
    status: "Atendimento personalizado",
    propertyTypes: ["CHACARA_EM_CONDOMINIO"]
  },
  {
    slug: "acordes",
    href: "/acordes",
    title: "Acordes Tower by Tewal",
    category: "Studios e 2 suítes",
    location: "Orla 14 · Palmas/TO",
    summary: "Um empreendimento contemporâneo com studios, apartamentos de 2 suítes, lazer elevado e vocação para morar ou investir.",
    image: "/brand/acordes/fachada-3.webp",
    status: "Lançamento",
    propertyTypes: ["APARTAMENTO", "FLAT"]
  },
  {
    slug: "cinnamon-studio",
    href: "/cinnamon-studio",
    title: "Cinnamon Studio",
    category: "Studios inteligentes",
    location: "Orla da Graciosa · Palmas/TO",
    summary: "Studios de padrão hoteleiro na Orla 14, com estrutura de serviços, tecnologia e proposta para quem vive em movimento.",
    image: "/brand/cinnamon/hero.webp",
    status: "Pré-cadastro",
    propertyTypes: ["APARTAMENTO", "FLAT"]
  },
  {
    slug: "lake-sky",
    href: "/palmas-lake/lake-sky",
    title: "Lake Sky",
    category: "Residencial · 2032",
    location: "Palmas Lake · Palmas/TO",
    summary: "Coberturas duplex e mansões suspensas com vista permanente para o lago de Palmas.",
    image: "/brand/palmas-lake/sky.jpg",
    status: "Lançamento Palmas Lake",
    propertyTypes: ["COBERTURA"]
  },
  {
    slug: "lake-garden",
    href: "/palmas-lake/lake-garden",
    title: "Lake Garden",
    category: "Residencial · 2032",
    location: "Palmas Lake · Palmas/TO",
    summary: "Residências amplas, paisagismo exuberante e a tranquilidade de morar de frente para o lago.",
    image: "/brand/palmas-lake/garden.jpg",
    status: "Lançamento Palmas Lake",
    propertyTypes: ["APARTAMENTO"]
  },
  {
    slug: "lake-park",
    href: "/palmas-lake/lake-park",
    title: "Lake Park",
    category: "Residencial · 2032",
    location: "Palmas Lake · Palmas/TO",
    summary: "Plantas amplas, living integrado e um ponto de entrada especial entre as torres residenciais do complexo.",
    image: "/brand/palmas-lake/park.jpg",
    status: "Lançamento Palmas Lake",
    propertyTypes: ["APARTAMENTO"]
  },
  {
    slug: "lake-loft",
    href: "/palmas-lake/lake-loft",
    title: "Lake Loft",
    category: "Multifuncional · 2029",
    location: "Palmas Lake · Palmas/TO",
    summary: "Lofts compactos e inteligentes preparados para morar, hospedar ou investir.",
    image: "/brand/palmas-lake/loft.jpg",
    status: "Lançamento Palmas Lake",
    propertyTypes: ["APARTAMENTO", "FLAT"]
  },
  {
    slug: "lake-office",
    href: "/palmas-lake/lake-office",
    title: "Lake Office",
    category: "Business center · 2029",
    location: "Palmas Lake · Palmas/TO",
    summary: "Salas e lajes corporativas conectadas ao Lake Mall, à marina e ao ritmo da orla.",
    image: "/brand/palmas-lake/office.jpg",
    status: "Lançamento Palmas Lake",
    propertyTypes: ["SALA", "COMERCIAL"]
  },
  {
    slug: "lake-mall",
    href: "/palmas-lake/lake-mall",
    title: "Lake Mall",
    category: "Shopping conceito · 2029",
    location: "Palmas Lake · Palmas/TO",
    summary: "Gastronomia, serviços e encontros com a água como paisagem, integrados à Marina e às torres do complexo.",
    image: "/brand/palmas-lake/mall.jpg",
    status: "Lançamento Palmas Lake",
    propertyTypes: ["LOJA", "COMERCIAL"]
  },
  {
    slug: "yacht-by-fama",
    href: "/yacht-fama",
    title: "Yacht by Fama",
    category: "Studios e apartamentos",
    location: "Orla 14 · Palmas/TO",
    summary: "Studios e apartamentos de 1 e 2 quartos para morar ou investir, com lazer no rooftop e vocação para hospedagem.",
    image: "/yacht/facade.jpg",
    status: "Lançamento",
    propertyTypes: ["APARTAMENTO", "FLAT"]
  },
  {
    slug: "terraco-urban",
    href: "/terraco-urban",
    title: "Terraço Urban",
    category: "Apartamentos prontos para morar",
    location: "Orla 14 · Palmas/TO",
    summary: "Apartamentos amplos, lazer resort e vista para o Lago de Palmas em um endereço pronto para morar.",
    image: "/terraco-urban/comercial-2.png",
    status: "Pronto para morar",
    propertyTypes: ["APARTAMENTO"]
  },
  {
    slug: "casa-mirante-do-lago",
    href: "/casa-mirante-do-lago",
    title: "Casa Mirante do Lago",
    category: "Casa em condomínio de alto padrão",
    location: "Plano Diretor Sul · Palmas/TO",
    summary: "Casa contemporânea com 237 m² construídos, 4 suítes, piscina e área gourmet integrada no Condomínio Mirante do Lago.",
    image: "/brand/casa-mirante-do-lago/01-fachada.jpg",
    status: "À venda",
    propertyTypes: ["CASA_EM_CONDOMINIO"]
  },
  {
    slug: "casa-terrea-mirante-do-lago",
    href: "/casa-terrea-mirante-do-lago",
    title: "Casa Térrea Mirante do Lago",
    category: "Casa térrea em condomínio de alto padrão",
    location: "Condomínio Mirante do Lago · Palmas/TO",
    summary: "Casa térrea com 210 m² construídos, terreno de 420 m², 3 suítes, piscina com hidromassagem, varanda gourmet e móveis planejados.",
    image: "/brand/casa-terrea-mirante-do-lago/fotos/18-fachada.jpg",
    status: "À venda",
    propertyTypes: ["CASA_EM_CONDOMINIO"]
  },
  {
    slug: "casa-mirante-do-lago-235m2",
    href: "/casa-mirante-do-lago-235m2",
    title: "Casa Térrea Mirante do Lago · 235 m²",
    category: "Casa térrea em condomínio de alto padrão",
    location: "Condomínio Mirante do Lago · Palmas/TO",
    summary: "Casa térrea com 235 m² construídos, terreno de 420 m², 3 suítes, piscina aquecida, energia solar e móveis planejados.",
    image: "/brand/casa-mirante-do-lago-235m2/16-entrada.jpg",
    status: "À venda",
    propertyTypes: ["CASA_EM_CONDOMINIO"]
  }
];
