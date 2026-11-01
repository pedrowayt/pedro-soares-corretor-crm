import {
  DevelopmentPropertyType,
  DevelopmentPublicationStatus,
  DevelopmentStage,
  DevelopmentUnitCategory,
  LandingPageStatus,
  LandingPageType,
  PrismaClient,
  LeadIntent,
  LeadSource,
  LeadStage,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
  Role
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "pedro@pedrosoares.com.br" },
    update: {},
    create: {
      name: "Pedro Soares",
      email: "pedro@pedrosoares.com.br",
      phone: "+55 63 99999-0000",
      role: Role.ADMIN,
      creci: "CRECI-TO 00000"
    }
  });

  const owner = await prisma.owner.upsert({
    where: { id: "owner-palmas-jardins" },
    update: {},
    create: {
      id: "owner-palmas-jardins",
      name: "Mariana Costa",
      phone: "+55 63 99123-5678",
      city: "Palmas",
      district: "Plano Diretor Sul"
    }
  });

  const property = await prisma.property.upsert({
    where: { slug: "casa-condominio-alto-padrao-plano-diretor-sul" },
    update: {},
    create: {
      slug: "casa-condominio-alto-padrao-plano-diretor-sul",
      title: "Casa em condomínio de alto padrão",
      type: PropertyType.CASA,
      purpose: PropertyPurpose.VENDA,
      status: PropertyStatus.DISPONIVEL,
      price: 1850000,
      city: "Palmas",
      district: "Plano Diretor Sul",
      bedrooms: 4,
      livingRooms: 2,
      suites: 3,
      bathrooms: 5,
      parkingSpaces: 2,
      areaM2: 320,
      landAreaM2: 450,
      description: "Casa moderna com acabamento premium, área gourmet e localização estratégica para valorização.",
      features: ["Piscina", "Energia solar", "Área gourmet", "Condomínio fechado"],
      ownerId: owner.id,
      isInvestorHighlight: true,
      marketAskingValue: 1850000,
      marketEstimatedValue: 1980000,
      marketOpportunity: 130000,
      marketComparableLinks: [
        "https://example.com/comparavel-1",
        "https://example.com/comparavel-2"
      ],
      marketLiquidityNotes: "Região com liquidez alta para imóveis de alto padrão."
    }
  });

  await prisma.propertyMedia.createMany({
    data: [
      {
        propertyId: property.id,
        kind: "IMAGE",
        status: "PRONTO",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        variant: "hero",
        position: 1
      },
      {
        propertyId: property.id,
        kind: "IMAGE",
        status: "PRONTO",
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
        variant: "gallery",
        position: 2
      }
    ],
    skipDuplicates: true
  });

  await prisma.investorOpportunity.upsert({
    where: { propertyId: property.id },
    update: {},
    create: {
      propertyId: property.id,
      status: "ATIVA",
      marketValue: 1980000,
      entryValue: 1850000,
      estimatedRoiPct: 17.5,
      legalRiskSummary: "Baixo risco documental.",
      documentaryRisk: "BAIXO",
      liquidityRating: 8,
      notes: "Oportunidade para revenda em até 24 meses."
    }
  });

  const development = await prisma.development.upsert({
    where: { slug: "acqua-design-residence" },
    update: {},
    create: {
      slug: "acqua-design-residence",
      title: "Acqua Design Residence",
      tagline: "Alto padrão na planta no Plano Diretor Sul",
      summary: "Empreendimento com assinatura contemporânea, lazer completo e localização estratégica.",
      description:
        "Projeto residencial com plantas inteligentes de 2 e 3 suítes, área de lazer premium e fácil acesso aos principais eixos comerciais de Palmas.",
      district: "Plano Diretor Sul",
      neighborhood: "ARSO 42",
      city: "Palmas",
      developerName: "Acqua Urbanismo",
      builderName: "Construtora Atlântica",
      stage: DevelopmentStage.ADVANCED_STRUCTURE,
      deliveryDate: new Date("2028-08-30T00:00:00.000Z"),
      constructionProgressPct: 62,
      appreciationPotential: "MEDIO",
      buyerProfile: "Compradores que buscam obra avançada e prazo menor até a entrega",
      opportunityText:
        "Com a estrutura avançada, o empreendimento já apresenta maior materialidade e tende a transmitir mais segurança ao comprador. O potencial de valorização ainda pode existir, mas deve ser analisado junto com estoque, localização e condições de mercado.",
      showInvestmentPotentialBlock: true,
      startingPrice: 690000,
      areaFromM2: 78,
      areaToM2: 142,
      bedroomsFrom: 2,
      bedroomsTo: 3,
      parkingFrom: 1,
      parkingTo: 2,
      totalUnits: 120,
      availableUnits: 38,
      amenities: [
        "Piscina com raia",
        "Academia equipada",
        "Coworking",
        "Espaço gourmet",
        "Brinquedoteca",
        "Pet place"
      ],
      differentials: [
        "Fachada assinada",
        "Infra para carregador elétrico",
        "Varanda gourmet integrada",
        "Gestão condominial inteligente"
      ],
      regionLiquidityNotes:
        "Região com demanda constante por unidades compactas e padrão médio/alto, favorecendo liquidez e valorização.",
      mapEmbedUrl: "https://maps.google.com/?q=Plano+Diretor+Sul+Palmas+TO",
      tablePdfUrl: "https://example.com/acqua-design-tabela.pdf",
      whatsappMessageTemplate: "Olá, quero receber a tabela atualizada do Acqua Design Residence.",
      ctaPrimaryLabel: "Falar com especialista",
      ctaPrimaryUrl: "https://wa.me/5563999999999",
      ctaSecondaryLabel: "Receber tabela PDF",
      ctaSecondaryUrl: "/lancamentos/acqua-design-residence",
      seoTitle: "Acqua Design Residence em Palmas | Apartamentos na Planta",
      seoDescription:
        "Conheça o Acqua Design Residence no Plano Diretor Sul, Palmas. Plantas de 78 a 142m², lazer completo e condições especiais de lançamento.",
      seoOgImageUrl: "https://images.unsplash.com/photo-1460317442991-0ec209397118",
      status: DevelopmentPublicationStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });

  await prisma.developmentUnitType.upsert({
    where: { id: "dev-unittype-78" },
    update: {},
    create: {
      id: "dev-unittype-78",
      developmentId: development.id,
      name: "Tipo 78m²",
      bedrooms: 2,
      suites: 1,
      bathrooms: 2,
      parkingSpaces: 1,
      areaFromM2: 78,
      areaToM2: 82,
      priceFrom: 690000,
      priceTo: 760000,
      availableUnits: 17,
      totalUnits: 52,
      description: "Planta funcional para casal ou investidor de renda.",
      position: 1
    }
  });

  await prisma.developmentUnitType.upsert({
    where: { id: "dev-unittype-112" },
    update: {},
    create: {
      id: "dev-unittype-112",
      developmentId: development.id,
      name: "Tipo 112m²",
      bedrooms: 3,
      suites: 2,
      bathrooms: 3,
      parkingSpaces: 2,
      areaFromM2: 108,
      areaToM2: 116,
      priceFrom: 890000,
      priceTo: 1030000,
      availableUnits: 14,
      totalUnits: 44,
      description: "Planta família com varanda estendida e home office.",
      position: 2
    }
  });

  await prisma.developmentMedia.upsert({
    where: { id: "dev-media-hero-1" },
    update: {},
    create: {
      id: "dev-media-hero-1",
      developmentId: development.id,
      kind: "HERO",
      status: "PRONTO",
      url: "https://images.unsplash.com/photo-1460317442991-0ec209397118",
      title: "Perspectiva noturna",
      position: 1
    }
  });

  await prisma.developmentMedia.upsert({
    where: { id: "dev-media-gallery-1" },
    update: {},
    create: {
      id: "dev-media-gallery-1",
      developmentId: development.id,
      kind: "GALLERY",
      status: "PRONTO",
      url: "https://images.unsplash.com/photo-1600607687644-c7f34b5e7885",
      title: "Fachada principal",
      position: 2
    }
  });

  await prisma.developmentMedia.upsert({
    where: { id: "dev-media-floorplan-1" },
    update: {},
    create: {
      id: "dev-media-floorplan-1",
      developmentId: development.id,
      kind: "FLOORPLAN",
      status: "PRONTO",
      url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
      title: "Planta tipo 78m²",
      position: 1
    }
  });

  await prisma.developmentMilestone.upsert({
    where: { id: "dev-milestone-1" },
    update: {},
    create: {
      id: "dev-milestone-1",
      developmentId: development.id,
      title: "Fundação concluída",
      description: "Blocos A e B finalizados.",
      status: "COMPLETED",
      progressPct: 100,
      actualDate: new Date("2026-11-20T00:00:00.000Z"),
      position: 1
    }
  });

  await prisma.developmentMilestone.upsert({
    where: { id: "dev-milestone-2" },
    update: {},
    create: {
      id: "dev-milestone-2",
      developmentId: development.id,
      title: "Estrutura do 12º pavimento",
      description: "Avanço médio conforme cronograma.",
      status: "IN_PROGRESS",
      progressPct: 62,
      targetDate: new Date("2027-06-10T00:00:00.000Z"),
      position: 2
    }
  });

  await prisma.developmentFaq.upsert({
    where: { id: "dev-faq-1" },
    update: {},
    create: {
      id: "dev-faq-1",
      developmentId: development.id,
      question: "Aceita financiamento bancário?",
      answer: "Sim, com enquadramento conforme política de crédito do banco e evolução da obra.",
      position: 1
    }
  });

  await prisma.developmentFaq.upsert({
    where: { id: "dev-faq-2" },
    update: {},
    create: {
      id: "dev-faq-2",
      developmentId: development.id,
      question: "Existe condição especial para investidor?",
      answer: "Sim. Temos fluxos de pagamento com entrada parcelada e condições diferenciadas em lotes selecionados.",
      position: 2
    }
  });

  await prisma.lead.upsert({
    where: { id: "lead-demo-site-1" },
    update: {},
    create: {
      id: "lead-demo-site-1",
      name: "Carlos Almeida",
      phone: "+55 63 99222-3344",
      email: "carlos.almeida@email.com",
      source: LeadSource.SITE,
      intent: LeadIntent.COMPRAR,
      stage: LeadStage.QUALIFICADO,
      desiredType: PropertyType.CASA,
      desiredPurpose: PropertyPurpose.VENDA,
      budgetMin: 1200000,
      budgetMax: 2000000,
      desiredCity: "Palmas",
      desiredDistrict: "Plano Diretor Sul",
      ownerUserId: admin.id,
      linkedPropertyId: property.id,
      notes: "Busca casa em condomínio para mudança em 3 meses.",
      lgpdConsentAt: new Date()
    }
  });

  await prisma.lead.upsert({
    where: { id: "lead-dev-site-1" },
    update: {},
    create: {
      id: "lead-dev-site-1",
      name: "Fernanda Ribeiro",
      phone: "+55 63 99888-4411",
      email: "fernanda.ribeiro@email.com",
      source: LeadSource.SITE,
      intent: LeadIntent.COMPRAR,
      stage: LeadStage.PRIMEIRO_CONTATO,
      desiredPurpose: PropertyPurpose.LANCAMENTO,
      desiredCity: "Palmas",
      desiredDistrict: "Plano Diretor Sul",
      ownerUserId: admin.id,
      linkedDevelopmentId: development.id,
      notes: "Solicitou tabela e fluxo de pagamento do lançamento.",
      lgpdConsentAt: new Date()
    }
  });

  await prisma.portalPublication.upsert({
    where: {
      propertyId_portalName: {
        propertyId: property.id,
        portalName: "Portal Piloto"
      }
    },
    update: {},
    create: {
      propertyId: property.id,
      portalName: "Portal Piloto",
      status: "PENDENTE"
    }
  });

  const urbanHaute = await prisma.development.upsert({
    where: { slug: "urban-haute" },
    update: {},
    create: {
      slug: "urban-haute",
      title: "Urban Haute",
      tagline: "Uma nova maneira de viver, trabalhar e investir.",
      summary: "Empreendimento mixed-use com residências, penthouses, offices e boulevard gastronômico ao lado do Capim Dourado Shopping.",
      description: "Alta arquitetura, lazer elevado e infraestrutura corporativa em um novo ícone urbano de Palmas.",
      district: "Plano Diretor Norte",
      neighborhood: "ACSU NO13",
      city: "Palmas",
      address: "ACSU NO13, Avenida JK, Lote 02",
      postalCode: "77001-080",
      propertyType: DevelopmentPropertyType.COMPLEXO,
      developerName: "Urban Incorporações LTDA",
      builderName: "Urban Palmas 011 Empreendimentos Imobiliários SPE LTDA",
      stage: DevelopmentStage.PRE_LAUNCH,
      areaFromM2: 38.63,
      areaToM2: 203.09,
      landAreaM2: 5137.48,
      floorsCount: 63,
      elevatorsCount: 8,
      totalUnits: 390,
      availableUnits: null,
      amenities: ["Rooftop Wellness", "Piscina panorâmica coberta", "Pavimento de lazer com 2.600 m²", "Boulevard gastronômico", "Academia Flex", "Quadras esportivas"],
      differentials: ["245 m declarados no material comercial", "Mixed-use completo", "Ao lado do Capim Dourado Shopping", "Arquitetura de Roberto Carvalho"],
      projectText: "Inspirado nos arranha-céus de Nova York, o Urban Haute integra moradia, negócios, lazer e gastronomia.",
      apartmentsText: "Residências de 1, 2 e 3 quartos, penthouses de 125,25 a 203,09 m² e offices de 36 a 80 m².",
      locationText: "ACSU NO13, Avenida JK, Lote 02, ao lado do Shopping Capim Dourado, em Palmas/TO.",
      locationHighlights: "Capim Dourado Shopping, parques, gastronomia, escolas, academias e serviços de saúde no entorno.",
      mapEmbedUrl: "https://www.google.com/maps?q=ACSU+NO13,+Avenida+JK,+Lote+02,+Palmas+-+TO&output=embed",
      tablePdfUrl: null,
      whatsappMessageTemplate: "Olá, Pedro. Quero conhecer o Urban Haute e receber a apresentação.",
      ctaPrimaryLabel: "Consultar disponibilidade",
      ctaPrimaryUrl: "/urban-haute#atendimento",
      ctaSecondaryLabel: "Ver plantas",
      ctaSecondaryUrl: "/urban-haute#plantas",
      seoTitle: "Urban Haute em Palmas | Residências, Offices e Penthouses",
      seoDescription: "Conheça o Urban Haute, mixed-use ao lado do Capim Dourado Shopping, com residências, penthouses, offices, lazer e boulevard gastronômico.",
      seoKeyword: "Urban Haute Palmas",
      showPrice: false,
      isPublished: true,
      status: DevelopmentPublicationStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });

  for (const unitType of [
    { id: "urban-haute-unit-1q", name: "Residência 1 quarto · 38,63 m²", unitCategory: DevelopmentUnitCategory.UM_QUARTO, bedrooms: 1, areaFromM2: 38.63, areaToM2: 39.61, description: "Tipo 01 · 19º ao 28º pavimento." },
    { id: "urban-haute-unit-2q", name: "Residência 2 quartos · 49,69 a 79,21 m²", unitCategory: DevelopmentUnitCategory.DOIS_QUARTOS, bedrooms: 2, areaFromM2: 49.69, areaToM2: 79.21, description: "Tipos 01, 02 e 03 · 18º ao 48º pavimento." },
    { id: "urban-haute-unit-3q", name: "Residência 3 quartos · 84,34 a 86,69 m²", unitCategory: DevelopmentUnitCategory.TRES_QUARTOS, bedrooms: 3, areaFromM2: 84.34, areaToM2: 86.69, description: "Tipo 03 · 18º e 44º ao 48º pavimento." },
    { id: "urban-haute-penthouse", name: "Penthouse · 125,25 a 203,09 m²", unitCategory: DevelopmentUnitCategory.COBERTURA, bedrooms: 3, areaFromM2: 125.25, areaToM2: 203.09, description: "Unidades 5001 a 5802 · 50º ao 58º pavimento." },
    { id: "urban-haute-office", name: "Haute Offices · 36 a 80 m²", unitCategory: DevelopmentUnitCategory.SALA_COMERCIAL, areaFromM2: 36, areaToM2: 80, description: "Salas comerciais e lajes corporativas · 6º ao 17º pavimento." }
  ]) {
    const { id, ...unitData } = unitType;
    await prisma.developmentUnitType.upsert({
      where: { id },
      update: { developmentId: urbanHaute.id, ...unitData },
      create: { id, developmentId: urbanHaute.id, position: 1, isAvailable: true, ...unitData }
    });
  }

  await prisma.landingPage.upsert({
    where: { slug: "urban-haute" },
    update: { linkedDevelopmentId: urbanHaute.id, status: LandingPageStatus.PUBLISHED, publicPath: "/urban-haute" },
    create: {
      name: "Urban Haute",
      slug: "urban-haute",
      publicPath: "/urban-haute",
      type: LandingPageType.DEVELOPMENT,
      status: LandingPageStatus.PUBLISHED,
      formKey: "development-interest",
      linkedDevelopmentId: urbanHaute.id,
      publishedAt: new Date()
    }
  });

  const maestriaUrban = await prisma.development.upsert({
    where: { slug: "maestria-urban-design" },
    update: {
      title: "Maestria Urban Design",
      tagline: "A vista lapidada à perfeição.",
      summary: "Apartamentos de 3 suítes na Orla 14, com arquitetura autoral, lazer completo e vista definitiva para o Lago de Palmas.",
      description: "Um empreendimento residencial em obras da Urban Design, com torre em formato de L, plantas amplas e uma experiência de lazer criada para valorizar a paisagem do lago.",
      district: "Graciosa - Orla 14",
      city: "Palmas",
      neighborhood: "Orla 14",
      address: "Quadra Orla 14 Avenida Orla, 03",
      propertyType: DevelopmentPropertyType.APARTAMENTO,
      developerName: "Urban Incorporações LTDA",
      builderName: "Urban Incorporações LTDA",
      stage: DevelopmentStage.CONSTRUCTION,
      deliveryDate: new Date("2028-08-31T00:00:00.000Z"),
      constructionProgressPct: 64,
      areaFromM2: 129.22,
      areaToM2: 146.40,
      bedroomsFrom: 3,
      bedroomsTo: 3,
      suitesFrom: 3,
      suitesTo: 3,
      bathroomsFrom: 4,
      bathroomsTo: 5,
      parkingFrom: 3,
      parkingTo: 4,
      elevatorsCount: 4,
      floorsCount: 33,
      totalUnits: 90,
      availableUnits: 32,
      startingPrice: null,
      priceMax: null,
      amenities: [
        "Elevador privativo para todas as unidades",
        "Persianas integradas preparadas para automação",
        "Churrasqueira a carvão com exaustor",
        "Ponto para ar-condicionado K7 na sala e varandas",
        "Varandas sem pé-direito triplo",
        "Preparação para aquecimento dos chuveiros a gás",
        "Praça das Fontes",
        "Piscinas, spa, academia, salão, pub e espaços gourmet"
      ],
      differentials: [
        "Vista definitiva para o Lago de Palmas",
        "Torre em formato de L",
        "Arquitetura autoral Urban Design",
        "Orla 14 em Palmas",
        "Entrega prevista para 2028"
      ],
      projectText: "A torre em formato de L foi posicionada para aproveitar a vista diagonal do lago em todas as unidades, com volumes cúbicos, varandas acolhedoras e terraços com pé-direito triplo.",
      apartmentsText: "Plantas de 129,22 m² a 146,40 m², todas com 3 suítes, varanda aberta ou integrada e soluções pensadas para diferentes estilos de vida.",
      locationText: "Quadra Orla 14 Avenida Orla, 03, Palmas/TO.",
      locationHighlights: "Orla 14, Lago de Palmas e a conexão entre cidade, natureza e lazer ao ar livre.",
      mapEmbedUrl: "https://www.google.com/maps?q=Quadra+Orla+14+Avenida+Orla,+03,+Palmas+-+TO&output=embed",
      whatsappMessageTemplate: "Olá, Pedro. Quero conhecer o Maestria Urban Design e receber a apresentação, plantas e condições.",
      ctaPrimaryLabel: "Quero conhecer o Maestria",
      ctaPrimaryUrl: "/maestria#atendimento",
      ctaSecondaryLabel: "Receber apresentação e plantas",
      ctaSecondaryUrl: "/maestria#plantas",
      seoTitle: "Maestria Urban Design na Orla 14 | Apartamentos em Palmas",
      seoDescription: "Conheça o Maestria Urban Design na Orla 14 de Palmas: apartamentos de 3 suítes, arquitetura autoral, lazer completo e vista definitiva para o Lago.",
      seoKeyword: "Maestria Urban Design Palmas",
      showPrice: false,
      isPublished: true,
      status: DevelopmentPublicationStatus.PUBLISHED,
      publishedAt: new Date()
    },
    create: {
      slug: "maestria-urban-design",
      title: "Maestria Urban Design",
      tagline: "A vista lapidada à perfeição.",
      summary: "Apartamentos de 3 suítes na Orla 14, com arquitetura autoral, lazer completo e vista definitiva para o Lago de Palmas.",
      description: "Um empreendimento residencial em obras da Urban Design, com torre em formato de L, plantas amplas e uma experiência de lazer criada para valorizar a paisagem do lago.",
      district: "Graciosa - Orla 14",
      city: "Palmas",
      neighborhood: "Orla 14",
      address: "Quadra Orla 14 Avenida Orla, 03",
      propertyType: DevelopmentPropertyType.APARTAMENTO,
      developerName: "Urban Incorporações LTDA",
      builderName: "Urban Incorporações LTDA",
      stage: DevelopmentStage.CONSTRUCTION,
      deliveryDate: new Date("2028-08-31T00:00:00.000Z"),
      constructionProgressPct: 64,
      areaFromM2: 129.22,
      areaToM2: 146.40,
      bedroomsFrom: 3,
      bedroomsTo: 3,
      suitesFrom: 3,
      suitesTo: 3,
      bathroomsFrom: 4,
      bathroomsTo: 5,
      parkingFrom: 3,
      parkingTo: 4,
      elevatorsCount: 4,
      floorsCount: 33,
      totalUnits: 90,
      availableUnits: 32,
      amenities: [
        "Elevador privativo para todas as unidades",
        "Persianas integradas preparadas para automação",
        "Churrasqueira a carvão com exaustor",
        "Ponto para ar-condicionado K7 na sala e varandas",
        "Varandas sem pé-direito triplo",
        "Preparação para aquecimento dos chuveiros a gás",
        "Praça das Fontes",
        "Piscinas, spa, academia, salão, pub e espaços gourmet"
      ],
      differentials: [
        "Vista definitiva para o Lago de Palmas",
        "Torre em formato de L",
        "Arquitetura autoral Urban Design",
        "Orla 14 em Palmas",
        "Entrega prevista para 2028"
      ],
      projectText: "A torre em formato de L foi posicionada para aproveitar a vista diagonal do lago em todas as unidades, com volumes cúbicos, varandas acolhedoras e terraços com pé-direito triplo.",
      apartmentsText: "Plantas de 129,22 m² a 146,40 m², todas com 3 suítes, varanda aberta ou integrada e soluções pensadas para diferentes estilos de vida.",
      locationText: "Quadra Orla 14 Avenida Orla, 03, Palmas/TO.",
      locationHighlights: "Orla 14, Lago de Palmas e a conexão entre cidade, natureza e lazer ao ar livre.",
      mapEmbedUrl: "https://www.google.com/maps?q=Quadra+Orla+14+Avenida+Orla,+03,+Palmas+-+TO&output=embed",
      whatsappMessageTemplate: "Olá, Pedro. Quero conhecer o Maestria Urban Design e receber a apresentação, plantas e condições.",
      ctaPrimaryLabel: "Quero conhecer o Maestria",
      ctaPrimaryUrl: "/maestria#atendimento",
      ctaSecondaryLabel: "Receber apresentação e plantas",
      ctaSecondaryUrl: "/maestria#plantas",
      seoTitle: "Maestria Urban Design na Orla 14 | Apartamentos em Palmas",
      seoDescription: "Conheça o Maestria Urban Design na Orla 14 de Palmas: apartamentos de 3 suítes, arquitetura autoral, lazer completo e vista definitiva para o Lago.",
      seoKeyword: "Maestria Urban Design Palmas",
      showPrice: false,
      isPublished: true,
      status: DevelopmentPublicationStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });

  await prisma.landingPage.upsert({
    where: { slug: "maestria-urban-design" },
    update: {
      name: "Maestria Urban Design",
      publicPath: "/maestria",
      type: LandingPageType.DEVELOPMENT,
      status: LandingPageStatus.PUBLISHED,
      formKey: "development-interest",
      linkedDevelopmentId: maestriaUrban.id,
      publishedAt: new Date()
    },
    create: {
      name: "Maestria Urban Design",
      slug: "maestria-urban-design",
      publicPath: "/maestria",
      type: LandingPageType.DEVELOPMENT,
      status: LandingPageStatus.PUBLISHED,
      formKey: "development-interest",
      linkedDevelopmentId: maestriaUrban.id,
      publishedAt: new Date()
    }
  });


  await prisma.landingPage.upsert({
    where: { slug: "lake-village" },
    update: {
      name: "Lake Village · Pré-cadastro",
      publicPath: "/lake-village",
      type: LandingPageType.CAPTURE,
      status: LandingPageStatus.PUBLISHED,
      formKey: "development-interest",
      publishedAt: new Date()
    },
    create: {
      name: "Lake Village · Pré-cadastro",
      slug: "lake-village",
      publicPath: "/lake-village",
      type: LandingPageType.CAPTURE,
      status: LandingPageStatus.PUBLISHED,
      formKey: "development-interest",
      publishedAt: new Date()
    }
  });

  console.log("Seed concluído com sucesso.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  const urbanFuturoData = {
    title: "Urban Futuro",
    tagline: "O futuro dos seus negócios já é realidade.",
    summary: "Empreendimento comercial entregue na 201 Sul, com salas e espaços corporativos de 26,35 a 306,26 m².",
    description: "Um business office da Urban na Av. Teotônio Segurado, com arquitetura contemporânea, áreas comuns de convivência e infraestrutura pensada para empresas e profissionais.",
    district: "Plano Diretor Sul",
    city: "Palmas",
    neighborhood: "201 Sul",
    address: "ACSU SO 20 Avenida Siqueira Campos, 15",
    propertyType: DevelopmentPropertyType.SALA_COMERCIAL,
    developerName: "Urban Incorporações LTDA",
    builderName: "Urban Incorporações LTDA",
    stage: DevelopmentStage.DELIVERED,
    areaFromM2: 26.35,
    areaToM2: 306.26,
    bedroomsFrom: null,
    bedroomsTo: null,
    bathroomsFrom: 1,
    bathroomsTo: 2,
    parkingFrom: 1,
    parkingTo: 1,
    floorsCount: 24,
    totalUnits: 179,
    availableUnits: 6,
    startingPrice: null,
    priceMax: null,
    amenities: [
      "Coworking",
      "Salas de reunião compartilhadas",
      "Hall social e Café Futuro",
      "Terraço descoberto no 3º pavimento",
      "Jardim, praça e lounge",
      "5 elevadores",
      "Gerador",
      "Portaria e segurança 24h",
      "Energia solar",
      "Vista panorâmica"
    ],
    differentials: [
      "Empreendimento comercial entregue",
      "Av. Teotônio Segurado na 201 Sul",
      "Arquitetura contemporânea e fachada icônica",
      "Salas de reunião compartilhadas",
      "5 elevadores para usuários e visitantes",
      "182 vagas de garagem conforme memorial"
    ],
    projectText: "O Urban Futuro é um business office entregue na Av. Teotônio Segurado, criado para acolher empresas e profissionais com eficiência, conforto e funcionalidade.",
    apartmentsText: "Salas comerciais, espaços corporativos e loja com áreas anunciadas de 26,35 a 306,26 m², além de ambientes comuns para reuniões, convivência e apoio ao trabalho.",
    locationText: "ACSU SO 20, Avenida Siqueira Campos, 15, 201 Sul, Plano Diretor Sul de Palmas/TO.",
    locationHighlights: "Endereço business na Av. Teotônio Segurado, próximo à Praça dos Girassóis, ao Palácio do Governo e aos principais eixos de Palmas.",
    mapEmbedUrl: "https://www.google.com/maps?q=ACSU+SO+20,+Avenida+Siqueira+Campos,+15,+Palmas+-+TO&output=embed",
    tablePdfUrl: null,
    whatsappMessageTemplate: "Olá, Pedro. Quero conhecer o Urban Futuro e receber a apresentação comercial.",
    ctaPrimaryLabel: "Quero conhecer o Urban Futuro",
    ctaPrimaryUrl: "/urban-futuro#atendimento",
    ctaSecondaryLabel: "Receber apresentação comercial",
    ctaSecondaryUrl: "/urban-futuro#tipologias",
    seoTitle: "Urban Futuro na 201 Sul | Salas comerciais em Palmas",
    seoDescription: "Conheça o Urban Futuro: business office entregue na Av. Teotônio Segurado, com salas comerciais, coworking e salas de reunião.",
    seoKeyword: "Urban Futuro Palmas",
    showPrice: false,
    isPublished: true,
    status: DevelopmentPublicationStatus.PUBLISHED,
    publishedAt: new Date()
  };

  const urbanFuturo = await prisma.development.upsert({
    where: { slug: "urban-futuro" },
    update: urbanFuturoData,
    create: { slug: "urban-futuro", ...urbanFuturoData }
  });

  await prisma.landingPage.upsert({
    where: { slug: "urban-futuro" },
    update: {
      name: "Urban Futuro",
      publicPath: "/urban-futuro",
      type: LandingPageType.DEVELOPMENT,
      status: LandingPageStatus.PUBLISHED,
      formKey: "development-interest",
      linkedDevelopmentId: urbanFuturo.id,
      publishedAt: new Date()
    },
    create: {
      name: "Urban Futuro",
      slug: "urban-futuro",
      publicPath: "/urban-futuro",
      type: LandingPageType.DEVELOPMENT,
      status: LandingPageStatus.PUBLISHED,
      formKey: "development-interest",
      linkedDevelopmentId: urbanFuturo.id,
      publishedAt: new Date()
