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
    id: "mock-casa-nova-caribe-residence",
    slug: "casa-nova-caribe-residence-resort",
    title: "Casa Nova - Caribe Residence Condomínio Resort",
    type: PropertyType.CASA_EM_CONDOMINIO,
    purpose: PropertyPurpose.VENDA,
    status: PropertyStatus.DISPONIVEL,
    price: 2650000,
    address: null,
    city: "Palmas",
    district: "Caribe Residence Condomínio Resort",
    postalCode: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Caribe+Residence+%26+Resort%2C+Palmas%2C+TO",
    latitude: null,
    longitude: null,
    bedrooms: null,
    livingRooms: 2,
    bathrooms: null,
    suites: 3,
    parkingSpaces: null,
    areaM2: 243,
    landAreaM2: 609.76,
    isInvestorHighlight: false,
    isAuctionOpportunity: false,
    description:
      "Casa nova no Caribe Residence Condomínio Resort, em Palmas/TO, com projeto QUBUS Arquitetura, 609,76 m² de lote, 243 m² construídos, 3 suítes plenas, piscina e varanda gourmet.",
    features: [
      "3 suítes plenas",
      "Projeto QUBUS Arquitetura",
      "Varanda gourmet e churrasqueira",
      "Piscina com cascata e ducha externa",
      "Deck em porcelanato e paisagismo",
      "Ponto para energia solar",
      "Ponto para energia de carro elétrico",
      "Preparação para poço semiartesiano"
    ],
    media: [
      ...Array.from({ length: 10 }, (_, index) => {
        const number = index + 1;
        return {
          id: `mock-casa-nova-caribe-media-${number}`,
          kind: "IMAGE",
          url: `/brand/casa-nova-caribe/${number}-Foto-${number}.jpg`,
          position: index
        };
      }),
      ...Array.from({ length: 10 }, (_, index) => {
        const number = index + 1;
        return {
          id: `mock-casa-nova-caribe-interior-media-${number}`,
          kind: "IMAGE",
          url: `/brand/casa-nova-caribe/interiores/${number}-Foto-${number}.jpg`,
          position: index + 10
        };
      })
    ]
  },
  {
    id: "mock-caribe-residence",
    slug: "casa-caribe-residence-resort",
    title: "Casa no Caribe Residence & Resort",
    type: PropertyType.CASA_EM_CONDOMINIO,
    purpose: PropertyPurpose.VENDA,
    status: PropertyStatus.DISPONIVEL,
    price: 2600000,
    address: null,
    city: "Palmas",
    district: "Caribe Residence & Resort",
    postalCode: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Caribe+Residence+Resort%2C+Palmas%2C+TO",
    latitude: null,
    longitude: null,
    bedrooms: null,
    livingRooms: null,
    bathrooms: null,
    suites: 4,
    parkingSpaces: 3,
    areaM2: null,
    landAreaM2: null,
    isInvestorHighlight: false,
    isAuctionOpportunity: false,
    description:
      "Casa contemporânea no Caribe Residence & Resort, em Palmas/TO, com 4 suítes plenas, sendo 2 com closet, pé-direito duplo, espaço gourmet completo e piscina com cascata.",
    features: [
      "4 suítes plenas, sendo 2 com closet",
      "Pé-direito duplo",
      "Espaço gourmet completo",
      "Piscina com cascata",
      "Lavabo e banheiro social de apoio",
      "2 despensas",
      "3 vagas cobertas",
      "Esquadrias em alumínio de alta qualidade",
      "Acabamentos com pedra portuguesa e iluminação em LED",
      "Poço semi artesiano"
    ],
    media: Array.from({ length: 12 }, (_, index) => {
      const number = index + 1;
      return {
        id: `mock-caribe-residence-media-${number}`,
        kind: "IMAGE",
        url: `/brand/caribe-residence/${number}-Foto-${number}.jpg`,
        position: index
      };
    })
  },
  {
    id: "mock-caribe-resort",
    slug: "casa-condominio-caribe-resort",
    title: "Casa no Condomínio Caribe Resort",
    type: PropertyType.CASA_EM_CONDOMINIO,
    purpose: PropertyPurpose.VENDA,
    status: PropertyStatus.DISPONIVEL,
    price: 2400000,
    address: null,
    city: "Palmas",
    district: "Condomínio Caribe Resort",
    postalCode: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Condominio+Caribe+Resort%2C+Palmas%2C+TO",
    latitude: null,
    longitude: null,
    bedrooms: null,
    livingRooms: 2,
    bathrooms: null,
    suites: 4,
    parkingSpaces: null,
    areaM2: 240,
    landAreaM2: 600,
    isInvestorHighlight: false,
    isAuctionOpportunity: false,
    description:
      "Casa contemporânea no Condomínio Caribe Resort, em Palmas/TO, com 600 m² de terreno, 240 m² de área construída, 4 suítes, ambientes integrados, piscina e energia solar.",
    features: [
      "4 suítes",
      "Lavabo",
      "Sala de estar e sala home",
      "Varanda gourmet integrada",
      "Cozinha com planejados sob bancadas",
      "Área de serviço e depósito",
      "Piscina com banheiro de apoio",
      "Garagem espaçosa",
      "Energia solar"
    ],
    media: [1, 2, 4, 7, 5, 8, 6, 9, 3].map((number, index) => ({
      id: `mock-caribe-media-${number}`,
      kind: "IMAGE",
      url: `/brand/caribe-resort/${number}-Foto-${number}.jpg`,
      position: index
    }))
  },
  {
    id: "mock-casa-mirante-do-lago",
    slug: "casa-mirante-do-lago",
    title: "Casa Mirante do Lago",
    type: PropertyType.CASA_EM_CONDOMINIO,
    purpose: PropertyPurpose.VENDA,
    status: PropertyStatus.DISPONIVEL,
    price: 2800000,
    address: null,
    city: "Palmas",
    district: "Condomínio Mirante do Lago",
    postalCode: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Condominio+Mirante+do+Lago%2C+Palmas%2C+TO",
    latitude: null,
    longitude: null,
    bedrooms: 4,
    livingRooms: 2,
    bathrooms: 5,
    suites: 4,
    parkingSpaces: 4,
    areaM2: 237,
    landAreaM2: 420,
    isInvestorHighlight: false,
    isAuctionOpportunity: false,
    description:
      "Casa Mirante do Lago no Plano Diretor Sul, em Palmas/TO, com 237 m² construídos, 420 m² de terreno, 1 suíte master com closet, 3 suítes plenas, piscina, área gourmet integrada e poço artesiano.",
    features: [
      "1 suíte master com closet",
      "3 suítes plenas",
      "5 banheiros",
      "4 vagas na garagem",
      "Cozinha integrada com área gourmet e piscina",
      "Poço artesiano",
      "Bancadas em Quartzo Montblanc",
      "Condomínio Mirante do Lago"
    ],
    media: [
      "01-fachada.jpg",
      "02-sala.jpg",
      "03-corredor.jpg",
      "04-lavabo.jpg",
      "05-quarto.jpg",
      "06-cozinha.jpg",
      "07-piscina.jpg",
      "08-banheiro.jpg",
      "09-piscina-angulo.jpg",
      "10-area-gourmet.jpg",
      "11-area-externa.jpg",
      "12-banheiro-pedra.jpg",
      "13-cozinha.jpg"
    ].map((fileName, index) => ({
      id: `mock-casa-mirante-do-lago-media-${index + 1}`,
      kind: "IMAGE",
      url: `/brand/casa-mirante-do-lago/${fileName}`,
      position: index
    }))
  },
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
    livingRooms: 2,
    bathrooms: 5,
    suites: 3,
    parkingSpaces: 2,
    areaM2: 320,
    landAreaM2: 450,
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
