-- Register the Urban Haute development and landing page for CRM attribution.
INSERT INTO "Development" (
  "id", "slug", "title", "summary", "description", "district", "city",
  "address", "developerName", "builderName", "stage", "areaFromM2", "areaToM2",
  "landAreaM2", "floorsCount", "elevatorsCount", "totalUnits", "amenities",
  "differentials", "locationText", "locationHighlights", "seoTitle", "seoDescription",
  "seoKeyword", "status", "isPublished", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'development-urban-haute',
  'urban-haute',
  'Urban Haute',
  'Empreendimento mixed-use com residências, penthouses, offices e boulevard gastronômico ao lado do Capim Dourado Shopping.',
  'Alta arquitetura, lazer elevado e infraestrutura corporativa em um novo ícone urbano de Palmas.',
  'Plano Diretor Norte',
  'Palmas',
  'ACSU NO13, Avenida JK, Lote 02',
  'Urban Incorporações LTDA',
  'Urban Palmas 011 Empreendimentos Imobiliários SPE LTDA',
  'PRE_LAUNCH',
  38.63,
  203.09,
  5137.48,
  63,
  8,
  390,
  ARRAY['Rooftop Wellness', 'Piscina panorâmica coberta', 'Pavimento de lazer com 2.600 m²', 'Boulevard gastronômico', 'Academia Flex'],
  ARRAY['Mixed-use completo', 'Ao lado do Capim Dourado Shopping', '245 m declarados no material comercial'],
  'ACSU NO13, Avenida JK, Lote 02, ao lado do Shopping Capim Dourado, em Palmas/TO.',
  'Capim Dourado Shopping, parques, gastronomia, escolas, academias e serviços de saúde no entorno.',
  'Urban Haute em Palmas | Residências, Offices e Penthouses',
  'Conheça o Urban Haute, mixed-use ao lado do Capim Dourado Shopping, com residências, penthouses, offices, lazer e boulevard gastronômico.',
  'Urban Haute Palmas',
  'PUBLISHED',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "updatedAt" = CURRENT_TIMESTAMP,
  "status" = 'PUBLISHED',
  "isPublished" = true;

INSERT INTO "LandingPage" (
  "id", "name", "slug", "publicPath", "type", "status", "formKey",
  "linkedDevelopmentId", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'landing-urban-haute',
  'Urban Haute',
  'urban-haute',
  '/urban-haute',
  'DEVELOPMENT',
  'PUBLISHED',
  'development-interest',
  (SELECT "id" FROM "Development" WHERE "slug" = 'urban-haute'),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "linkedDevelopmentId" = (SELECT "id" FROM "Development" WHERE "slug" = 'urban-haute'),
  "publicPath" = '/urban-haute',
  "status" = 'PUBLISHED';
