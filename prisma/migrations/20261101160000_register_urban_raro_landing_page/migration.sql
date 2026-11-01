-- Register the Urban Raro landing page and CRM development from the official Urban Vendas source.
-- Prices remain intentionally empty and hidden from the public catalog.
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
  'development-urban-raro',
  'urban-raro',
  'Urban Raro',
  'Raro por dentro e por fora.',
  'Empreendimento entregue da Urban Design em frente ao Parque Cesamar, com apenas 16 apartamentos-casa.',
  'Um projeto residencial de arquitetura autoral, com piscina privativa na varanda, plantas flexíveis e uma escala rara de privacidade no Plano Diretor Sul.',
  'Plano Diretor Sul', 'Palmas', 'ARSE 41', 'Quadra ARSE 41 Alameda 1, 06',
  'APARTAMENTO', 'Urban Incorporações LTDA', 'Urban Incorporações LTDA', 'DELIVERED',
  253, 423, 3, 4, 3, 4, 3, 6, 3, 4, 18, 16, 1, NULL, NULL,
  ARRAY['Piscina comum aquecida', 'Espaço gourmet com churrasqueira', 'Brinquedoteca e playground', 'Academia', 'Salão de festas', 'Delivery room', 'Usina solar nas áreas comuns', 'Reuso de águas pluviais', 'Gerador para áreas comuns e elevadores', 'Ponto para recarga de carros híbridos e elétricos', 'Portaria remota preparada', 'Espaços entregues mobiliados e equipados'],
  ARRAY['Em frente ao Parque Cesamar', 'Apenas 16 apartamentos-casa', 'Uma unidade por andar', 'Piscina privativa na varanda', 'Planta flexível para personalização', 'Arquitetura autoral Urban Design', 'Usina solar para as áreas comuns', 'Reuso de águas pluviais', 'Gerador para áreas comuns e elevadores privativos', 'Preparado para portaria remota'],
  'O Urban Raro redefine o alto padrão com arquitetura autoral e imersão na natureza. Em frente ao Parque Cesamar, o projeto valoriza a vista definitiva, a privacidade e a possibilidade de viver com mais espaço e identidade.',
  'Plantas de 3 e 4 quartos, com piscina privativa na varanda, churrasqueira a carvão, esquadrias das suítes preparadas para automação e planta flexível para personalização.',
  'Quadra ARSE 41 Alameda 1, 06, no Plano Diretor Sul de Palmas/TO.',
  'Em frente ao Parque Cesamar, com vista definitiva para o mar verde e conexão com uma das áreas mais agradáveis de Palmas.',
  'https://www.google.com/maps?q=Quadra+ARSE+41+Alameda+1,+06,+Palmas+-+TO&output=embed',
  'Olá, Pedro. Quero conhecer o Urban Raro e receber a apresentação, plantas e condições.',
  'Quero conhecer o Urban Raro', '/urban-raro#atendimento', 'Receber apresentação e plantas', '/urban-raro#plantas',
  'Urban Raro em frente ao Parque Cesamar | Apartamentos em Palmas',
  'Conheça o Urban Raro: apenas 16 apartamentos-casa em frente ao Parque Cesamar, com plantas de 3 e 4 quartos, piscina privativa e arquitetura autoral.',
  'Urban Raro Palmas', false, true, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
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
  'landing-urban-raro', 'Urban Raro', 'urban-raro', '/urban-raro', 'DEVELOPMENT', 'PUBLISHED', 'development-interest', 'development-urban-raro', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name", "publicPath" = '/urban-raro', "type" = 'DEVELOPMENT', "status" = 'PUBLISHED', "formKey" = 'development-interest',
  "linkedDevelopmentId" = 'development-urban-raro', "publishedAt" = COALESCE("LandingPage"."publishedAt", CURRENT_TIMESTAMP), "updatedAt" = CURRENT_TIMESTAMP;
