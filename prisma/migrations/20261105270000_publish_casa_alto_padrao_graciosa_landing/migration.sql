-- Publish and link the dedicated landing page for the high-standard house near Praia da Graciosa.
INSERT INTO "LandingPage" (
  "id", "name", "slug", "publicPath", "type", "status", "formKey",
  "publishedAt", "createdAt", "updatedAt", "linkedPropertyId"
)
SELECT
  'landing-casa-alto-padrao-praia-graciosa',
  'Casa nova de alto padrão · Praia da Graciosa',
  'casa-alto-padrao-praia-graciosa',
  '/casa-alto-padrao-praia-graciosa',
  'CAMPAIGN',
  'PUBLISHED',
  'property-interest',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  property."id"
FROM "Property" AS property
WHERE property."slug" = 'casa-alto-padrao-praia-graciosa'
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "publicPath" = EXCLUDED."publicPath",
  "type" = EXCLUDED."type",
  "status" = EXCLUDED."status",
  "formKey" = EXCLUDED."formKey",
  "linkedPropertyId" = EXCLUDED."linkedPropertyId",
  "publishedAt" = COALESCE("LandingPage"."publishedAt", CURRENT_TIMESTAMP),
  "updatedAt" = CURRENT_TIMESTAMP;
