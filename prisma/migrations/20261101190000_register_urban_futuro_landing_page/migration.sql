-- Register Urban Futuro from the official Urban Vendas folder and memorial.
-- Prices remain intentionally empty and hidden from the public catalog.
INSERT INTO "Development" (
  "id", "slug", "title", "tagline", "summary", "description", "district", "city",
  "neighborhood", "address", "propertyType", "developerName", "builderName", "stage",
  "areaFromM2", "areaToM2", "bedroomsFrom", "bedroomsTo", "bathroomsFrom", "bathroomsTo",
  "parkingFrom", "parkingTo", "floorsCount", "totalUnits", "availableUnits", "startingPrice", "priceMax",
  "amenities", "differentials", "projectText", "apartmentsText", "locationText", "locationHighlights", "mapEmbedUrl",
  "whatsappMessageTemplate", "ctaPrimaryLabel", "ctaPrimaryUrl", "ctaSecondaryLabel", "ctaSecondaryUrl", "seoTitle",
  "seoDescription", "seoKeyword", "showPrice", "isPublished", "status", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'development-urban-futuro', 'urban-futuro', 'Urban Futuro', 'O futuro dos seus negócios já é realidade.',
  'Empreendimento comercial entregue na 201 Sul, com salas e espaços corporativos de 26,35 a 306,26 m².',
  'Um business office da Urban na Av. Teotônio Segurado, com arquitetura contemporânea, áreas comuns de convivência e infraestrutura pensada para empresas e profissionais.',
  'Plano Diretor Sul', 'Palmas', '201 Sul', 'ACSU SO 20 Avenida Siqueira Campos, 15',
  'SALA_COMERCIAL', 'Urban Incorporações LTDA', 'Urban Incorporações LTDA', 'DELIVERED',
  26.35, 306.26, NULL, NULL, 1, 2, 1, 1, 24, 179, 6, NULL, NULL,
  ARRAY['Coworking', 'Salas de reunião compartilhadas', 'Hall social e Café Futuro', 'Terraço descoberto no 3º pavimento', 'Jardim, praça e lounge', '5 elevadores', 'Gerador', 'Portaria e segurança 24h', 'Energia solar', 'Vista panorâmica'],
  ARRAY['Empreendimento comercial entregue', 'Av. Teotônio Segurado na 201 Sul', 'Arquitetura contemporânea e fachada icônica', 'Salas de reunião compartilhadas', '5 elevadores para usuários e visitantes', '182 vagas de garagem conforme memorial'],
  'O Urban Futuro é um business office entregue na Av. Teotônio Segurado, criado para acolher empresas e profissionais com eficiência, conforto e funcionalidade.',
  'Salas comerciais, espaços corporativos e loja com áreas anunciadas de 26,35 a 306,26 m², além de ambientes comuns para reuniões, convivência e apoio ao trabalho.',
  'ACSU SO 20, Avenida Siqueira Campos, 15, 201 Sul, Plano Diretor Sul de Palmas/TO.',
  'Endereço business na Av. Teotônio Segurado, próximo à Praça dos Girassóis, ao Palácio do Governo e aos principais eixos de Palmas.',
  'https://www.google.com/maps?q=ACSU+SO+20,+Avenida+Siqueira+Campos,+15,+Palmas+-+TO&output=embed',
  'Olá, Pedro. Quero conhecer o Urban Futuro e receber a apresentação comercial.', 'Quero conhecer o Urban Futuro', '/urban-futuro#atendimento',
  'Receber apresentação comercial', '/urban-futuro#tipologias', 'Urban Futuro na 201 Sul | Salas comerciais em Palmas',
  'Conheça o Urban Futuro: business office entregue na Av. Teotônio Segurado, com salas comerciais, coworking e salas de reunião.',
  'Urban Futuro Palmas', false, true, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title", "tagline" = EXCLUDED."tagline", "summary" = EXCLUDED."summary", "description" = EXCLUDED."description",
  "district" = EXCLUDED."district", "city" = EXCLUDED."city", "neighborhood" = EXCLUDED."neighborhood", "address" = EXCLUDED."address",
  "propertyType" = EXCLUDED."propertyType", "developerName" = EXCLUDED."developerName", "builderName" = EXCLUDED."builderName", "stage" = EXCLUDED."stage",
  "areaFromM2" = EXCLUDED."areaFromM2", "areaToM2" = EXCLUDED."areaToM2", "bedroomsFrom" = NULL, "bedroomsTo" = NULL,
  "bathroomsFrom" = EXCLUDED."bathroomsFrom", "bathroomsTo" = EXCLUDED."bathroomsTo", "parkingFrom" = EXCLUDED."parkingFrom", "parkingTo" = EXCLUDED."parkingTo",
  "floorsCount" = EXCLUDED."floorsCount", "totalUnits" = EXCLUDED."totalUnits", "availableUnits" = EXCLUDED."availableUnits", "startingPrice" = NULL, "priceMax" = NULL,
  "amenities" = EXCLUDED."amenities", "differentials" = EXCLUDED."differentials", "projectText" = EXCLUDED."projectText", "apartmentsText" = EXCLUDED."apartmentsText",
  "locationText" = EXCLUDED."locationText", "locationHighlights" = EXCLUDED."locationHighlights", "mapEmbedUrl" = EXCLUDED."mapEmbedUrl",
  "whatsappMessageTemplate" = EXCLUDED."whatsappMessageTemplate", "ctaPrimaryLabel" = EXCLUDED."ctaPrimaryLabel", "ctaPrimaryUrl" = EXCLUDED."ctaPrimaryUrl",
  "ctaSecondaryLabel" = EXCLUDED."ctaSecondaryLabel", "ctaSecondaryUrl" = EXCLUDED."ctaSecondaryUrl", "seoTitle" = EXCLUDED."seoTitle", "seoDescription" = EXCLUDED."seoDescription",
  "seoKeyword" = EXCLUDED."seoKeyword", "showPrice" = false, "isPublished" = true, "status" = 'PUBLISHED', "publishedAt" = COALESCE("Development"."publishedAt", CURRENT_TIMESTAMP), "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "LandingPage" (
  "id", "name", "slug", "publicPath", "type", "status", "formKey", "linkedDevelopmentId", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'landing-urban-futuro', 'Urban Futuro', 'urban-futuro', '/urban-futuro', 'DEVELOPMENT', 'PUBLISHED', 'development-interest', 'development-urban-futuro', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name", "publicPath" = '/urban-futuro', "type" = 'DEVELOPMENT', "status" = 'PUBLISHED', "formKey" = 'development-interest',
  "linkedDevelopmentId" = 'development-urban-futuro', "publishedAt" = COALESCE("LandingPage"."publishedAt", CURRENT_TIMESTAMP), "updatedAt" = CURRENT_TIMESTAMP;
