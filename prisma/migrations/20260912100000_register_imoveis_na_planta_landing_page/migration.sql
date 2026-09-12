-- Register the SEO hub for plant launches and generic development-interest capture.
INSERT INTO "LandingPage" (
  "id", "name", "slug", "publicPath", "type", "status", "formKey",
  "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'landing-imoveis-na-planta',
  'Imóveis na Planta em Palmas',
  'imoveis-na-planta',
  '/imoveis/na-planta',
  'CAMPAIGN',
  'PUBLISHED',
  'development-interest',
  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "publicPath" = '/imoveis/na-planta', "status" = 'PUBLISHED',
  "formKey" = 'development-interest', "updatedAt" = CURRENT_TIMESTAMP;
