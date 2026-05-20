import { SeoListingMode, SeoPageStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const hasDatabase = Boolean(process.env.DATABASE_URL);

export type SeoFaqItem = {
  question: string;
  answer: string;
};

export type SeoLandingPageView = {
  id: string;
  name: string;
  path: string;
  city: string;
  district: string | null;
  listingMode: SeoListingMode;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: SeoFaqItem[];
  status: SeoPageStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SeoLandingPageUpsertInput = {
  name: string;
  path: string;
  city: string;
  district?: string | null;
  listingMode: SeoListingMode;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: SeoFaqItem[];
  status: SeoPageStatus;
};

const defaultFaqs: SeoFaqItem[] = [
  {
    question: "Como escolher o imóvel ideal em Palmas?",
    answer:
      "Avalie localização, objetivo (morar ou investir), faixa de preço e potencial de valorização. Eu te ajudo a comparar as melhores opções."
  },
  {
    question: "Vocês ajudam com financiamento?",
    answer:
      "Sim. Posso orientar a simulação de financiamento e o melhor caminho para aprovação com bancos parceiros."
  },
  {
    question: "É possível agendar visita rapidamente?",
    answer: "Sim. Pelo WhatsApp você já agenda visita e recebe detalhes atualizados do imóvel."
  }
];

type DefaultSeoSeed = Omit<SeoLandingPageView, "id" | "createdAt" | "updatedAt">;

const now = new Date();

const globalForSeoPages = globalThis as unknown as {
  seoPagesMemory?: SeoLandingPageView[];
};

const defaultSeoPages: DefaultSeoSeed[] = [
  {
    name: "Imóveis na Planta em Palmas TO",
    path: "/palmas-to/imoveis-na-planta",
    city: "Palmas",
    district: null,
    listingMode: SeoListingMode.PLANTA,
    title: "Imóveis na Planta em Palmas TO | Pedro Soares",
    description:
      "Encontre imóveis na planta em Palmas TO com atendimento especializado, análise de localização e suporte completo para compra segura.",
    h1: "Imóveis na Planta em Palmas TO",
    intro:
      "Seleção de lançamentos em Palmas com foco em localização, potencial de valorização e condições comerciais para morar ou investir com mais segurança.",
    keywords: [
      "imoveis na planta em palmas to",
      "lancamentos em palmas tocantins",
      "apartamentos na planta palmas",
      "pedro soares corretor palmas"
    ],
    faqs: defaultFaqs,
    status: SeoPageStatus.PUBLISHED,
    publishedAt: now
  },
  {
    name: "Imóveis no Plano Diretor Sul",
    path: "/palmas-to/plano-diretor-sul/imoveis",
    city: "Palmas",
    district: "Plano Diretor Sul",
    listingMode: SeoListingMode.TODOS,
    title: "Imóveis no Plano Diretor Sul em Palmas TO | Pedro Soares",
    description:
      "Veja imóveis no Plano Diretor Sul em Palmas TO para morar ou investir, com atendimento direto e curadoria por perfil de compra.",
    h1: "Imóveis no Plano Diretor Sul",
    intro:
      "O Plano Diretor Sul reúne opções residenciais e oportunidades com boa liquidez. Compare imóveis por faixa de preço, tipo e objetivo.",
    keywords: [
      "imoveis plano diretor sul",
      "casas plano diretor sul palmas",
      "apartamentos plano diretor sul",
      "corretor palmas tocantins"
    ],
    faqs: defaultFaqs,
    status: SeoPageStatus.PUBLISHED,
    publishedAt: now
  },
  {
    name: "Imóveis na Orla da Graciosa",
    path: "/palmas-to/orla-da-graciosa/imoveis",
    city: "Palmas",
    district: "Graciosa",
    listingMode: SeoListingMode.TODOS,
    title: "Imóveis na Orla da Graciosa em Palmas TO | Pedro Soares",
    description:
      "Descubra imóveis na Orla da Graciosa em Palmas com visão estratégica de valorização, estilo de vida e potencial de investimento.",
    h1: "Imóveis na Orla da Graciosa",
    intro:
      "A Orla da Graciosa é uma das regiões mais desejadas de Palmas. Avalie imóveis com foco em localização premium e potencial de valorização.",
    keywords: [
      "imoveis orla da graciosa",
      "imoveis graciosa palmas",
      "apartamentos orla palmas",
      "casas orla da graciosa"
    ],
    faqs: defaultFaqs,
    status: SeoPageStatus.PUBLISHED,
    publishedAt: now
  },
  {
    name: "Imóveis de Leilão em Palmas TO",
    path: "/palmas-to/imoveis-leilao",
    city: "Palmas",
    district: null,
    listingMode: SeoListingMode.LEILAO,
    title: "Imóveis de Leilão em Palmas TO | Pedro Soares",
    description:
      "Oportunidades de imóveis de leilão em Palmas TO com orientação completa sobre edital, risco documental e potencial de lucro.",
    h1: "Imóveis de Leilão em Palmas TO",
    intro:
      "Página dedicada a oportunidades de leilão em Palmas com suporte consultivo para análise de risco e estratégia de entrada.",
    keywords: [
      "imoveis leilao palmas",
      "leilao judicial palmas tocantins",
      "oportunidades imoveis leilao",
      "especialista leilao imobiliario"
    ],
    faqs: defaultFaqs,
    status: SeoPageStatus.PUBLISHED,
    publishedAt: now
  },
  {
    name: "Imóveis Prontos em Palmas TO",
    path: "/palmas-to/imoveis-prontos",
    city: "Palmas",
    district: null,
    listingMode: SeoListingMode.PRONTOS,
    title: "Imóveis Prontos em Palmas TO | Pedro Soares",
    description:
      "Confira imóveis prontos em Palmas TO para compra e moradia com atendimento direto e seleção por bairro, preço e perfil.",
    h1: "Imóveis Prontos em Palmas TO",
    intro:
      "Encontre imóveis prontos para morar em diferentes bairros de Palmas, com opções residenciais e comerciais.",
    keywords: [
      "imoveis prontos em palmas",
      "casas prontas palmas to",
      "apartamentos prontos palmas",
      "comprar imovel palmas"
    ],
    faqs: defaultFaqs,
    status: SeoPageStatus.PUBLISHED,
    publishedAt: now
  },
  {
    name: "Imóveis no Plano Diretor Norte",
    path: "/palmas-to/plano-diretor-norte/imoveis",
    city: "Palmas",
    district: "Plano Diretor Norte",
    listingMode: SeoListingMode.TODOS,
    title: "Imóveis no Plano Diretor Norte em Palmas TO | Pedro Soares",
    description:
      "Veja imóveis no Plano Diretor Norte em Palmas TO com análise comercial e suporte completo para compra ou investimento.",
    h1: "Imóveis no Plano Diretor Norte",
    intro:
      "Região estratégica de Palmas, com boa infraestrutura e variedade de imóveis para diferentes perfis de cliente.",
    keywords: [
      "imoveis plano diretor norte",
      "apartamento plano diretor norte palmas",
      "casa plano diretor norte",
      "imobiliaria palmas to"
    ],
    faqs: defaultFaqs,
    status: SeoPageStatus.PUBLISHED,
    publishedAt: now
  },
  {
    name: "Imóveis em Taquaralto",
    path: "/palmas-to/taquaralto/imoveis",
    city: "Palmas",
    district: "Taquaralto",
    listingMode: SeoListingMode.TODOS,
    title: "Imóveis em Taquaralto em Palmas TO | Pedro Soares",
    description:
      "Encontre imóveis em Taquaralto, Palmas TO, com opções para morar, investir e análise de custo-benefício por região.",
    h1: "Imóveis em Taquaralto",
    intro:
      "Taquaralto concentra oportunidades com boa relação entre preço e localização. Compare imóveis com atendimento personalizado.",
    keywords: [
      "imoveis em taquaralto",
      "casas taquaralto palmas",
      "apartamentos taquaralto",
      "imoveis palmas tocantins"
    ],
    faqs: defaultFaqs,
    status: SeoPageStatus.PUBLISHED,
    publishedAt: now
  },
  {
    name: "Imóveis no Aureny",
    path: "/palmas-to/aureny/imoveis",
    city: "Palmas",
    district: "Aureny",
    listingMode: SeoListingMode.TODOS,
    title: "Imóveis no Aureny em Palmas TO | Pedro Soares",
    description:
      "Confira imóveis no Aureny em Palmas TO com suporte para encontrar boas oportunidades de compra e investimento.",
    h1: "Imóveis no Aureny",
    intro:
      "A região do Aureny oferece opções residenciais para diferentes perfis e orçamento, com potencial de valorização local.",
    keywords: ["imoveis no aureny", "casas aureny palmas", "apartamentos aureny", "imoveis palmas"],
    faqs: defaultFaqs,
    status: SeoPageStatus.PUBLISHED,
    publishedAt: now
  },
  {
    name: "Imóveis no Centro de Palmas",
    path: "/palmas-to/centro/imoveis",
    city: "Palmas",
    district: "Centro",
    listingMode: SeoListingMode.TODOS,
    title: "Imóveis no Centro de Palmas TO | Pedro Soares",
    description:
      "Veja imóveis no Centro de Palmas TO com praticidade de localização e atendimento consultivo para compra ou locação.",
    h1: "Imóveis no Centro de Palmas",
    intro:
      "O Centro de Palmas reúne imóveis com acesso facilitado a comércio e serviços. Ideal para quem busca praticidade no dia a dia.",
    keywords: ["imoveis centro de palmas", "apartamentos centro palmas", "casas centro palmas", "imoveis tocantins"],
    faqs: defaultFaqs,
    status: SeoPageStatus.PUBLISHED,
    publishedAt: now
  }
];

function normalizePath(path: string) {
  if (!path.startsWith("/")) return `/${path}`.toLowerCase();
  return path.toLowerCase();
}

function parseFaqs(value: unknown): SeoFaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const question = "question" in item ? String((item as { question?: unknown }).question ?? "").trim() : "";
      const answer = "answer" in item ? String((item as { answer?: unknown }).answer ?? "").trim() : "";
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((item): item is SeoFaqItem => Boolean(item));
}

function fromDefault(item: DefaultSeoSeed, index: number): SeoLandingPageView {
  return {
    id: `default-seo-${index + 1}`,
    ...item,
    path: normalizePath(item.path),
    createdAt: now,
    updatedAt: now
  };
}

function getMemoryPages() {
  if (!globalForSeoPages.seoPagesMemory) {
    globalForSeoPages.seoPagesMemory = defaultSeoPages.map(fromDefault);
  }

  return globalForSeoPages.seoPagesMemory;
}

function sanitizeUpsertInput(input: SeoLandingPageUpsertInput) {
  return {
    ...input,
    path: normalizePath(input.path),
    city: input.city.trim(),
    district: input.district?.trim() ? input.district.trim() : null,
    keywords: input.keywords.map((item) => item.trim().toLowerCase()).filter(Boolean),
    faqs: input.faqs.map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim()
    }))
  };
}

function normalizeDbPage(page: {
  id: string;
  name: string;
  path: string;
  city: string;
  district: string | null;
  listingMode: SeoListingMode;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: unknown;
  status: SeoPageStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...page,
    path: normalizePath(page.path),
    faqs: parseFaqs(page.faqs)
  } satisfies SeoLandingPageView;
}

export async function listCrmSeoLandingPages() {
  if (!hasDatabase) return getMemoryPages();

  try {
    const pages = await prisma.seoLandingPage.findMany({
      orderBy: [{ updatedAt: "desc" }]
    });

    if (!pages.length) return getMemoryPages();
    return pages.map(normalizeDbPage);
  } catch {
    return getMemoryPages();
  }
}

export async function listPublishedSeoLandingPages() {
  if (!hasDatabase) {
    return getMemoryPages().filter((item) => item.status === SeoPageStatus.PUBLISHED);
  }

  try {
    const pages = await prisma.seoLandingPage.findMany({
      where: { status: SeoPageStatus.PUBLISHED },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }]
    });

    if (!pages.length) {
      return getMemoryPages().filter((item) => item.status === SeoPageStatus.PUBLISHED);
    }

    return pages.map(normalizeDbPage);
  } catch {
    return getMemoryPages().filter((item) => item.status === SeoPageStatus.PUBLISHED);
  }
}

export async function getPublishedSeoLandingPageByPath(path: string) {
  const normalizedPath = normalizePath(path);

  if (!hasDatabase) {
    return getMemoryPages().find((item) => item.path === normalizedPath) ?? null;
  }

  try {
    const page = await prisma.seoLandingPage.findFirst({
      where: {
        path: normalizedPath,
        status: SeoPageStatus.PUBLISHED
      }
    });

    if (!page) {
      return getMemoryPages().find((item) => item.path === normalizedPath) ?? null;
    }

    return normalizeDbPage(page);
  } catch {
    return getMemoryPages().find((item) => item.path === normalizedPath) ?? null;
  }
}

export function createSeoLandingPageInMemory(input: SeoLandingPageUpsertInput) {
  const payload = sanitizeUpsertInput(input);
  const pages = getMemoryPages();

  const created: SeoLandingPageView = {
    id: `memory-seo-${Date.now()}`,
    ...payload,
    publishedAt: payload.status === SeoPageStatus.PUBLISHED ? new Date() : null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const existingIndex = pages.findIndex((item) => item.path === created.path);
  if (existingIndex >= 0) {
    pages.splice(existingIndex, 1, {
      ...pages[existingIndex],
      ...created,
      id: pages[existingIndex].id
    });
    return pages[existingIndex];
  }

  pages.unshift(created);
  return created;
}

export function updateSeoLandingPageInMemory(id: string, input: Partial<SeoLandingPageUpsertInput>) {
  const pages = getMemoryPages();
  const index = pages.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const current = pages[index];
  const next = {
    ...current,
    ...input,
    path: input.path ? normalizePath(input.path) : current.path,
    city: input.city ? input.city.trim() : current.city,
    district:
      input.district !== undefined
        ? input.district?.trim()
          ? input.district.trim()
          : null
        : current.district,
    keywords: input.keywords
      ? input.keywords.map((item) => item.trim().toLowerCase()).filter(Boolean)
      : current.keywords,
    faqs: input.faqs
      ? input.faqs.map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim()
        }))
      : current.faqs,
    publishedAt:
      input.status === SeoPageStatus.PUBLISHED
        ? current.publishedAt ?? new Date()
        : input.status === SeoPageStatus.DRAFT
          ? null
          : current.publishedAt,
    updatedAt: new Date()
  } satisfies SeoLandingPageView;

  pages[index] = next;
  return next;
}
