-- Register the Mirante do Lago house in the public property catalogue and its campaign landing.
INSERT INTO "Property" (
  "id", "slug", "title", "type", "purpose", "status", "price",
  "city", "district", "areaM2", "landAreaM2", "bedrooms", "livingRooms",
  "suites", "bathrooms", "parkingSpaces", "description", "features",
  "marketComparableLinks", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'property-casa-mirante-do-lago',
  'casa-mirante-do-lago',
  'Casa Mirante do Lago',
  'CASA_EM_CONDOMINIO',
  'VENDA',
  'DISPONIVEL',
  2800000,
  'Palmas',
  'Condomínio Mirante do Lago',
  237,
  420,
  4,
  2,
  4,
  5,
  4,
  'Casa Mirante do Lago no Plano Diretor Sul, em Palmas/TO, com 237 m² construídos, 420 m² de terreno, 1 suíte master com closet, 3 suítes plenas, piscina, área gourmet integrada e poço artesiano.',
  ARRAY[
    '1 suíte master com closet',
    '3 suítes plenas',
    '5 banheiros',
    '4 vagas na garagem',
    'Cozinha integrada com área gourmet e piscina',
    'Poço artesiano',
    'Bancadas em Quartzo Montblanc',
    'Condomínio Mirante do Lago'
  ],
  ARRAY[]::text[],
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title",
  "type" = EXCLUDED."type",
  "purpose" = EXCLUDED."purpose",
  "status" = EXCLUDED."status",
  "price" = EXCLUDED."price",
  "city" = EXCLUDED."city",
  "district" = EXCLUDED."district",
  "areaM2" = EXCLUDED."areaM2",
  "landAreaM2" = EXCLUDED."landAreaM2",
  "bedrooms" = EXCLUDED."bedrooms",
  "livingRooms" = EXCLUDED."livingRooms",
  "suites" = EXCLUDED."suites",
  "bathrooms" = EXCLUDED."bathrooms",
  "parkingSpaces" = EXCLUDED."parkingSpaces",
  "description" = EXCLUDED."description",
  "features" = EXCLUDED."features",
  "marketComparableLinks" = EXCLUDED."marketComparableLinks",
  "publishedAt" = COALESCE("Property"."publishedAt", CURRENT_TIMESTAMP),
  "updatedAt" = CURRENT_TIMESTAMP;

WITH property AS (
  SELECT "id" FROM "Property" WHERE "slug" = 'casa-mirante-do-lago'
)
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, media.variant, media.position
FROM property
CROSS JOIN (VALUES
  ('property-casa-mirante-do-lago-media-01', '/brand/casa-mirante-do-lago/01-fachada.jpg', 'hero', 0),
  ('property-casa-mirante-do-lago-media-02', '/brand/casa-mirante-do-lago/02-sala.jpg', 'gallery', 1),
  ('property-casa-mirante-do-lago-media-03', '/brand/casa-mirante-do-lago/03-corredor.jpg', 'gallery', 2),
  ('property-casa-mirante-do-lago-media-04', '/brand/casa-mirante-do-lago/04-lavabo.jpg', 'gallery', 3),
  ('property-casa-mirante-do-lago-media-05', '/brand/casa-mirante-do-lago/05-quarto.jpg', 'gallery', 4),
  ('property-casa-mirante-do-lago-media-06', '/brand/casa-mirante-do-lago/06-cozinha.jpg', 'gallery', 5),
  ('property-casa-mirante-do-lago-media-07', '/brand/casa-mirante-do-lago/07-piscina.jpg', 'gallery', 6),
  ('property-casa-mirante-do-lago-media-08', '/brand/casa-mirante-do-lago/08-banheiro.jpg', 'gallery', 7),
  ('property-casa-mirante-do-lago-media-09', '/brand/casa-mirante-do-lago/09-piscina-angulo.jpg', 'gallery', 8),
  ('property-casa-mirante-do-lago-media-10', '/brand/casa-mirante-do-lago/10-area-gourmet.jpg', 'gallery', 9),
  ('property-casa-mirante-do-lago-media-11', '/brand/casa-mirante-do-lago/11-area-externa.jpg', 'gallery', 10),
  ('property-casa-mirante-do-lago-media-12', '/brand/casa-mirante-do-lago/12-banheiro-pedra.jpg', 'gallery', 11),
  ('property-casa-mirante-do-lago-media-13', '/brand/casa-mirante-do-lago/13-cozinha.jpg', 'gallery', 12)
) AS media(id, url, variant, position)
ON CONFLICT ("id") DO UPDATE SET
  "propertyId" = EXCLUDED."propertyId",
  "kind" = EXCLUDED."kind",
  "status" = EXCLUDED."status",
  "url" = EXCLUDED."url",
  "variant" = EXCLUDED."variant",
  "position" = EXCLUDED."position";

INSERT INTO "LandingPage" (
  "id", "name", "slug", "publicPath", "type", "status", "formKey",
  "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'landing-casa-mirante-do-lago',
  'Casa Mirante do Lago',
  'casa-mirante-do-lago',
  '/casa-mirante-do-lago',
  'CAMPAIGN',
  'PUBLISHED',
  'property-interest',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "publicPath" = EXCLUDED."publicPath",
  "type" = EXCLUDED."type",
  "status" = EXCLUDED."status",
  "formKey" = EXCLUDED."formKey",
  "publishedAt" = COALESCE("LandingPage"."publishedAt", CURRENT_TIMESTAMP),
  "updatedAt" = CURRENT_TIMESTAMP;
