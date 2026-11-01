-- Register Urban Horizonte from the official Urban Vendas source.
-- Commercial values remain intentionally empty and hidden from the public catalog.
INSERT INTO "Development" (
  "id", "slug", "title", "tagline", "summary", "description", "district", "city",
  "neighborhood", "address", "propertyType", "developerName", "builderName", "stage",
  "areaFromM2", "areaToM2", "bedroomsFrom", "bedroomsTo", "suitesFrom", "suitesTo",
  "bathroomsFrom", "bathroomsTo", "parkingFrom", "parkingTo", "floorsCount", "totalUnits",
  "availableUnits", "startingPrice", "priceMax", "amenities", "differentials", "projectText",
  "apartmentsText", "locationText", "locationHighlights", "mapEmbedUrl", "whatsappMessageTemplate",
  "ctaPrimaryLabel", "ctaPrimaryUrl", "ctaSecondaryLabel", "ctaSecondaryUrl", "seoTitle",
  "seoDescription", "seoKeyword", "showPrice", "isPublished", "status", "publishedAt",
  "createdAt", "updatedAt"
)
VALUES (
  'development-urban-horizonte', 'urban-horizonte', 'Urban Horizonte', 'Um horizonte para viver.',
  'Empreendimento entregue na Graciosa, na Orla 14 de Palmas, com vista permanente para o Lago e apartamentos de 3 a 5 suítes.',
  'Um projeto de arquitetura orgânica, materiais naturais e áreas comuns com mobiliário autoral, assinado por estúdios de renome nacional.',
  'Graciosa - Orla 14', 'Palmas', 'Orla 14', 'Orla 14, Palmas/TO', 'APARTAMENTO',
  'Urban Incorporações LTDA', 'Urban Incorporações LTDA', 'DELIVERED', 156, 316, 3, 5, 3, 5, 5, 7, 3, 4,
  NULL, NULL, 5, NULL, NULL,
  ARRAY['Piscina com vista para o Lago de Palmas', 'Academia com assinatura Flex Home', 'Salão de festas mobiliado e equipado', 'Espaço gourmet integrado ou independente', 'Brinquedoteca e playground', 'Sala de jogos', 'Churrasqueira', 'Quadra esportiva', 'Varanda gourmet', 'Vista panorâmica', 'Gerador', 'Portaria e segurança 24h', 'Redário e pista de caminhada', 'Jardim, praça e lounge'],
  ARRAY['Vista permanente do Lago de Palmas em todas as unidades', 'Empreendimento entregue na Orla 14', 'Arquitetura orgânica com materiais naturais', 'Projeto assinado por Roberto Carvalho, Sá Spessato e Miriam Coelho', 'Mobiliário autoral nas áreas comuns e de lazer', 'Plantas flexíveis para personalização', 'Elevador privativo', 'Academia com assinatura Flex Home'],
  'O Urban Horizonte está no endereço mais nobre da Orla de Palmas, com a vista permanente do Lago em todas as unidades. Formas orgânicas, materiais naturais e varandas generosas criam conexão real com a natureza.',
  'Apartamentos de 3, 4 e 5 suítes, com áreas anunciadas de 156, 202 e 316 m², plantas flexíveis, elevador privativo e varanda gourmet.',
  'Graciosa - Orla 14, em Palmas/TO, próximo dos melhores restaurantes, escolas, conveniências e da Praia da Graciosa.',
  'More no endereço mais nobre da Orla de Palmas, com o Lago de Palmas e a beleza da Praia da Graciosa aos seus pés.',
  'https://www.google.com/maps?q=Orla+14,+Palmas+-+TO&output=embed',
  'Olá, Pedro. Quero conhecer o Urban Horizonte e receber a apresentação, plantas e condições.',
  'Quero conhecer o Urban Horizonte', '/urban-horizonte#atendimento', 'Receber apresentação e plantas', '/urban-horizonte#tipologias',
  'Urban Horizonte na Orla 14 | Apartamentos em Palmas',
  'Conheça o Urban Horizonte: apartamentos de 3, 4 e 5 suítes na Graciosa, com vista para o Lago de Palmas, áreas comuns completas e projeto autoral.',
  'Urban Horizonte Palmas', false, true, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title", "tagline" = EXCLUDED."tagline", "summary" = EXCLUDED."summary", "description" = EXCLUDED."description",
  "district" = EXCLUDED."district", "city" = EXCLUDED."city", "neighborhood" = EXCLUDED."neighborhood", "address" = EXCLUDED."address",
  "propertyType" = EXCLUDED."propertyType", "developerName" = EXCLUDED."developerName", "builderName" = EXCLUDED."builderName", "stage" = EXCLUDED."stage",
  "areaFromM2" = EXCLUDED."areaFromM2", "areaToM2" = EXCLUDED."areaToM2", "bedroomsFrom" = EXCLUDED."bedroomsFrom", "bedroomsTo" = EXCLUDED."bedroomsTo",
  "suitesFrom" = EXCLUDED."suitesFrom", "suitesTo" = EXCLUDED."suitesTo", "bathroomsFrom" = EXCLUDED."bathroomsFrom", "bathroomsTo" = EXCLUDED."bathroomsTo",
  "parkingFrom" = EXCLUDED."parkingFrom", "parkingTo" = EXCLUDED."parkingTo", "floorsCount" = EXCLUDED."floorsCount", "totalUnits" = EXCLUDED."totalUnits",
  "availableUnits" = EXCLUDED."availableUnits", "startingPrice" = NULL, "priceMax" = NULL, "amenities" = EXCLUDED."amenities", "differentials" = EXCLUDED."differentials",
  "projectText" = EXCLUDED."projectText", "apartmentsText" = EXCLUDED."apartmentsText", "locationText" = EXCLUDED."locationText", "locationHighlights" = EXCLUDED."locationHighlights",
  "mapEmbedUrl" = EXCLUDED."mapEmbedUrl", "whatsappMessageTemplate" = EXCLUDED."whatsappMessageTemplate", "ctaPrimaryLabel" = EXCLUDED."ctaPrimaryLabel", "ctaPrimaryUrl" = EXCLUDED."ctaPrimaryUrl",
  "ctaSecondaryLabel" = EXCLUDED."ctaSecondaryLabel", "ctaSecondaryUrl" = EXCLUDED."ctaSecondaryUrl", "seoTitle" = EXCLUDED."seoTitle", "seoDescription" = EXCLUDED."seoDescription",
  "seoKeyword" = EXCLUDED."seoKeyword", "showPrice" = false, "isPublished" = true, "status" = 'PUBLISHED', "publishedAt" = COALESCE("Development"."publishedAt", CURRENT_TIMESTAMP), "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "LandingPage" (
  "id", "name", "slug", "publicPath", "type", "status", "formKey", "linkedDevelopmentId", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'landing-urban-horizonte', 'Urban Horizonte', 'urban-horizonte', '/urban-horizonte', 'DEVELOPMENT', 'PUBLISHED', 'development-interest', 'development-urban-horizonte', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name", "publicPath" = '/urban-horizonte', "type" = 'DEVELOPMENT', "status" = 'PUBLISHED', "formKey" = 'development-interest',
  "linkedDevelopmentId" = 'development-urban-horizonte', "publishedAt" = COALESCE("LandingPage"."publishedAt", CURRENT_TIMESTAMP), "updatedAt" = CURRENT_TIMESTAMP;
