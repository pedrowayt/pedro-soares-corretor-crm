-- Register the 235 m² Mirante do Lago house and its campaign landing.
INSERT INTO "Property" (
  "id", "slug", "title", "type", "purpose", "status", "price",
  "city", "district", "areaM2", "landAreaM2", "bedrooms", "livingRooms",
  "suites", "bathrooms", "parkingSpaces", "description", "features",
  "marketComparableLinks", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'property-casa-mirante-do-lago-235m2',
  'casa-mirante-do-lago-235m2',
  'Casa Térrea Mirante do Lago · 235 m²',
  'CASA_EM_CONDOMINIO',
  'VENDA',
  'DISPONIVEL',
  2700000,
  'Palmas',
  'Condomínio Mirante do Lago',
  235,
  420,
  3,
  2,
  3,
  NULL,
  2,
  'Casa térrea localizada no Condomínio Mirante do Lago, em Palmas/TO, com 235 m² construídos, terreno de 420 m², 3 suítes, suíte master com closet, piscina aquecida, energia solar, cozinha gourmet, depósito e móveis planejados em todos os ambientes internos. Valor de R$ 2.700.000.',
  ARRAY[
    'Sala ampla de estar e jantar',
    'Lavabo',
    'Cozinha individual gourmet ampla',
    '3 suítes, sendo a master com closet',
    'Varanda de estar com piscina aquecida',
    'Energia solar',
    'Área de serviço',
    'Depósito',
    '2 vagas de garagem cobertas',
    'Móveis planejados em todos os ambientes internos'
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
  SELECT "id" FROM "Property" WHERE "slug" = 'casa-mirante-do-lago-235m2'
)
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, media.variant, media.position
FROM property
CROSS JOIN (VALUES
  ('property-casa-mirante-do-lago-235m2-media-01', '/brand/casa-mirante-do-lago-235m2/16-entrada.jpg', 'hero', 0),
  ('property-casa-mirante-do-lago-235m2-media-02', '/brand/casa-mirante-do-lago-235m2/12-varanda.jpg', 'gallery', 1),
  ('property-casa-mirante-do-lago-235m2-media-03', '/brand/casa-mirante-do-lago-235m2/13-piscina.jpg', 'gallery', 2),
  ('property-casa-mirante-do-lago-235m2-media-04', '/brand/casa-mirante-do-lago-235m2/06-sala-estar.jpg', 'gallery', 3),
  ('property-casa-mirante-do-lago-235m2-media-05', '/brand/casa-mirante-do-lago-235m2/07-sala-jantar.jpg', 'gallery', 4),
  ('property-casa-mirante-do-lago-235m2-media-06', '/brand/casa-mirante-do-lago-235m2/08-sala.jpg', 'gallery', 5),
  ('property-casa-mirante-do-lago-235m2-media-07', '/brand/casa-mirante-do-lago-235m2/11-cozinha-gourmet.jpg', 'gallery', 6),
  ('property-casa-mirante-do-lago-235m2-media-08', '/brand/casa-mirante-do-lago-235m2/10-cozinha-marcenaria.jpg', 'gallery', 7),
  ('property-casa-mirante-do-lago-235m2-media-09', '/brand/casa-mirante-do-lago-235m2/09-cozinha.jpg', 'gallery', 8),
  ('property-casa-mirante-do-lago-235m2-media-10', '/brand/casa-mirante-do-lago-235m2/01-suite-master.jpg', 'gallery', 9),
  ('property-casa-mirante-do-lago-235m2-media-11', '/brand/casa-mirante-do-lago-235m2/03-closet.jpg', 'gallery', 10),
  ('property-casa-mirante-do-lago-235m2-media-12', '/brand/casa-mirante-do-lago-235m2/02-banheiro-suite.jpg', 'gallery', 11),
  ('property-casa-mirante-do-lago-235m2-media-13', '/brand/casa-mirante-do-lago-235m2/04-banheiro.jpg', 'gallery', 12),
  ('property-casa-mirante-do-lago-235m2-media-14', '/brand/casa-mirante-do-lago-235m2/05-quarto.jpg', 'gallery', 13),
  ('property-casa-mirante-do-lago-235m2-media-15', '/brand/casa-mirante-do-lago-235m2/15-quarto-planejado.jpg', 'gallery', 14),
  ('property-casa-mirante-do-lago-235m2-media-16', '/brand/casa-mirante-do-lago-235m2/14-lavabo.jpg', 'gallery', 15)
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
  'landing-casa-mirante-do-lago-235m2',
  'Casa Térrea Mirante do Lago · 235 m²',
  'casa-mirante-do-lago-235m2',
  '/casa-mirante-do-lago-235m2',
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
