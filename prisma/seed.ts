import {
  DevelopmentPublicationStatus,
  DevelopmentStage,
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
      suites: 3,
      bathrooms: 5,
      parkingSpaces: 2,
      areaM2: 320,
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
      stage: DevelopmentStage.CONSTRUCTION,
      deliveryDate: new Date("2028-08-30T00:00:00.000Z"),
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
