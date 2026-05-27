import {
  DevelopmentAmenityType,
  DevelopmentPropertyType,
  DevelopmentPublicationStatus,
  DevelopmentStage,
  PropertyPurpose,
  PropertyStatus,
  PropertyType
} from "@prisma/client";

export const mockProperties = [
  {
    id: "mock-1",
    slug: "casa-condominio-alto-padrao-plano-diretor-sul",
    title: "Casa em condomínio de alto padrão",
    type: PropertyType.CASA,
    purpose: PropertyPurpose.VENDA,
    status: PropertyStatus.DISPONIVEL,
    price: 1850000,
    address: "Quadra 204 Sul, Alameda 5",
    city: "Palmas",
    district: "Plano Diretor Sul",
    postalCode: "77020-018",
    googleMapsUrl: "https://www.google.com/maps?q=Plano+Diretor+Sul+Palmas+TO&output=embed",
    latitude: null,
    longitude: null,
    bedrooms: 4,
    bathrooms: 5,
    suites: 3,
    parkingSpaces: 2,
    areaM2: 320,
    isInvestorHighlight: true,
    isAuctionOpportunity: false,
    description:
      "Casa moderna com acabamento premium, área gourmet e excelente potencial de valorização.",
    features: ["Piscina", "Área gourmet", "Condomínio fechado", "Energia solar"],
    media: [
      {
        id: "mock-media-1",
        kind: "IMAGE",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
      },
      {
        id: "mock-media-2",
        kind: "IMAGE",
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
      }
    ]
  }
] as const;

export const mockDevelopments = [
  {
    id: "mock-dev-1",
    slug: "acqua-design-residence",
    title: "Acqua Design Residence",
    tagline: "Alto padrão na planta no Plano Diretor Sul",
    summary: "Empreendimento com assinatura contemporânea e lazer completo em Palmas.",
    description:
      "Projeto na planta com tipologias de 2 e 3 quartos, infraestrutura moderna e fácil acesso aos principais polos da cidade.",
    district: "Plano Diretor Sul",
    neighborhood: "ARSO 42",
    city: "Palmas",
    address: "Quadra ARSO 42, Alameda 12",
    postalCode: "77015-450",
    propertyType: DevelopmentPropertyType.COMPLEXO,
    developerName: "Acqua Urbanismo",
    builderName: "Construtora Atlântica",
    stage: DevelopmentStage.ADVANCED_STRUCTURE,
    status: DevelopmentPublicationStatus.PUBLISHED,
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
    availableUnits: 38,
    totalUnits: 120,
    deliveryDate: new Date("2028-08-30T00:00:00.000Z"),
    amenities: ["Piscina com raia", "Academia", "Coworking", "Espaço gourmet"],
    differentials: ["Fachada assinada", "Infra para carregador elétrico", "Varanda gourmet integrada"],
    amenityItems: [
      {
        id: "mock-dev-amenity-security",
        developmentId: "mock-dev-1",
        towerId: null,
        towerName: null,
        type: DevelopmentAmenityType.DIFERENCIAL,
        label: "Segurança 24 horas",
        description: "Portaria e eclusas para pedestres e veículos.",
        icon: "shield",
        isHighlighted: true,
        position: 0,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z")
      },
      {
        id: "mock-dev-amenity-pool",
        developmentId: "mock-dev-1",
        towerId: null,
        towerName: null,
        type: DevelopmentAmenityType.LAZER,
        label: "Piscina com borda infinita",
        description: "Piscina posicionada de frente para o lago.",
        icon: "pool",
        isHighlighted: true,
        position: 1,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z")
      },
      {
        id: "mock-dev-amenity-fitness",
        developmentId: "mock-dev-1",
        towerId: "mock-dev-tower-a",
        towerName: "Torre A Residencial",
        type: DevelopmentAmenityType.LAZER,
        label: "Fitness exclusivo por torre",
        description: "Academia de alto padrão vinculada à torre residencial.",
        icon: "fitness",
        isHighlighted: true,
        position: 2,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z")
      },
      {
        id: "mock-dev-amenity-market",
        developmentId: "mock-dev-1",
        towerId: "mock-dev-tower-comercial",
        towerName: "Torre Comercial",
        type: DevelopmentAmenityType.DIFERENCIAL,
        label: "Market na Torre Comercial",
        description: "Conveniência de apoio para moradores, visitantes e operação comercial.",
        icon: "market",
        isHighlighted: true,
        position: 3,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z")
      }
    ],
    mapEmbedUrl: "https://maps.google.com/?q=Plano+Diretor+Sul+Palmas+TO",
    tablePdfUrl: "https://example.com/acqua-design-tabela.pdf",
    whatsappMessageTemplate: "Olá, quero receber a tabela atualizada do Acqua Design Residence.",
    seoTitle: "Acqua Design Residence em Palmas | Apartamentos na Planta",
    seoDescription:
      "Conheça o Acqua Design Residence no Plano Diretor Sul, Palmas. Plantas de 78 a 142m² com lazer completo.",
    seoOgImageUrl: "https://images.unsplash.com/photo-1460317442991-0ec209397118",
    ctaPrimaryLabel: "Falar com especialista",
    ctaPrimaryUrl: "https://wa.me/5563984845101",
    ctaSecondaryLabel: "Receber tabela PDF",
    ctaSecondaryUrl: "/lancamentos/acqua-design-residence",
    towers: [
      {
        id: "mock-dev-tower-a",
        developmentId: "mock-dev-1",
        name: "Torre A Residencial",
        slug: "torre-a-residencial",
        propertyType: DevelopmentPropertyType.APARTAMENTO,
        description: "Torre residencial com plantas de 2 e 3 quartos e acesso direto ao lazer central.",
        floorsCount: 28,
        elevatorsCount: 3,
        totalUnits: 96,
        availableUnits: 31,
        deliveryDate: new Date("2028-08-30T00:00:00.000Z"),
        incorporationRegistry: null,
        position: 0,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z")
      },
      {
        id: "mock-dev-tower-comercial",
        developmentId: "mock-dev-1",
        name: "Torre Comercial",
        slug: "torre-comercial",
        propertyType: DevelopmentPropertyType.SALA_COMERCIAL,
        description: "Bloco comercial com salas compactas para serviços, consultórios e operação de bairro.",
        floorsCount: 12,
        elevatorsCount: 2,
        totalUnits: 36,
        availableUnits: 7,
        deliveryDate: new Date("2028-08-30T00:00:00.000Z"),
        incorporationRegistry: null,
        position: 1,
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z")
      }
    ],
    media: [
      {
        id: "mock-dev-media-hero",
        kind: "HERO",
        url: "https://images.unsplash.com/photo-1460317442991-0ec209397118",
        title: "Perspectiva noturna",
        category: "HERO",
        caption: null,
        isPrimary: true,
        position: 0,
        towerId: null,
        unitTypeId: null
      },
      {
        id: "mock-dev-media-gallery",
        kind: "GALLERY",
        url: "https://images.unsplash.com/photo-1600607687644-c7f34b5e7885",
        title: "Fachada principal",
        category: "FACHADA",
        caption: null,
        isPrimary: false,
        position: 1,
        towerId: "mock-dev-tower-a",
        unitTypeId: null
      },
      {
        id: "mock-dev-media-floor",
        kind: "FLOORPLAN",
        url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
        title: "Planta tipo 78m²",
        category: "PLANTA",
        caption: null,
        isPrimary: false,
        position: 2,
        towerId: "mock-dev-tower-a",
        unitTypeId: "mock-dev-unit-78"
      }
    ],
    unitTypes: [
      {
        id: "mock-dev-unit-78",
        towerId: "mock-dev-tower-a",
        towerName: "Torre A Residencial",
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
        imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
        description: "Planta funcional para casal ou investidor."
      },
      {
        id: "mock-dev-unit-112",
        towerId: "mock-dev-tower-a",
        towerName: "Torre A Residencial",
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
        description: "Planta família com varanda estendida."
      },
      {
        id: "mock-dev-unit-comercial-34",
        towerId: "mock-dev-tower-comercial",
        towerName: "Torre Comercial",
        name: "Sala comercial 34m²",
        bedrooms: 0,
        suites: 0,
        bathrooms: 1,
        parkingSpaces: 1,
        areaFromM2: 34,
        areaToM2: 39,
        priceFrom: 420000,
        priceTo: 510000,
        availableUnits: 7,
        totalUnits: 36,
        description: "Sala compacta para operação comercial, consultório ou escritório."
      }
    ],
    milestones: [
      {
        id: "mock-dev-m1",
        title: "Fundação concluída",
        description: "Blocos A e B finalizados.",
        status: "COMPLETED",
        progressPct: 100
      },
      {
        id: "mock-dev-m2",
        title: "Estrutura do 12º pavimento",
        description: "Avanço conforme cronograma.",
        status: "IN_PROGRESS",
        progressPct: 62
      }
    ],
    faqs: [
      {
        id: "mock-dev-faq-1",
        question: "Aceita financiamento bancário?",
        answer: "Sim, conforme política de crédito e estágio da obra."
      },
      {
        id: "mock-dev-faq-2",
        question: "Tem condição para investidor?",
        answer: "Sim, com fluxo diferenciado em unidades selecionadas."
      }
    ]
  }
] as const;
