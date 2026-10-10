-- Register the Caribe Resort house in the public property catalogue and its campaign landing.
INSERT INTO "Property" (
  "id", "slug", "title", "type", "purpose", "status", "price",
  "city", "district", "areaM2", "landAreaM2", "livingRooms", "suites",
  "description", "features", "marketComparableLinks", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'property-casa-caribe-resort',
  'casa-condominio-caribe-resort',
  'Casa no Condomínio Caribe Resort',
  'CASA_EM_CONDOMINIO',
  'VENDA',
  'DISPONIVEL',
  2400000,
  'Palmas',
  'Condomínio Caribe Resort',
  240,
  600,
  2,
  4,
  'Casa contemporânea no Condomínio Caribe Resort, em Palmas/TO, com 600 m² de terreno, 240 m² de área construída, 4 suítes, ambientes integrados, piscina e energia solar.',
  ARRAY[
    '4 suítes',
    'Lavabo',
    'Sala de estar e sala home',
    'Varanda gourmet integrada',
    'Cozinha com planejados sob bancadas',
    'Área de serviço e depósito',
    'Piscina com banheiro de apoio',
    'Garagem espaçosa',
    'Energia solar'
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
  "livingRooms" = EXCLUDED."livingRooms",
  "suites" = EXCLUDED."suites",
  "description" = EXCLUDED."description",
  "features" = EXCLUDED."features",
  "marketComparableLinks" = EXCLUDED."marketComparableLinks",
  "publishedAt" = COALESCE("Property"."publishedAt", CURRENT_TIMESTAMP),
  "updatedAt" = CURRENT_TIMESTAMP;

WITH property AS (
  SELECT "id" FROM "Property" WHERE "slug" = 'casa-condominio-caribe-resort'
)
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, media.variant, media.position
FROM property
CROSS JOIN (VALUES
  ('property-casa-caribe-resort-media-01', '/brand/caribe-resort/1-Foto-1.jpg', 'hero', 0),
  ('property-casa-caribe-resort-media-02', '/brand/caribe-resort/2-Foto-2.jpg', 'gallery', 1),
  ('property-casa-caribe-resort-media-03', '/brand/caribe-resort/3-Foto-3.jpg', 'gallery', 2),
  ('property-casa-caribe-resort-media-04', '/brand/caribe-resort/4-Foto-4.jpg', 'gallery', 3),
  ('property-casa-caribe-resort-media-05', '/brand/caribe-resort/5-Foto-5.jpg', 'gallery', 4),
  ('property-casa-caribe-resort-media-06', '/brand/caribe-resort/6-Foto-6.jpg', 'gallery', 5),
  ('property-casa-caribe-resort-media-07', '/brand/caribe-resort/7-Foto-7.jpg', 'gallery', 6),
  ('property-casa-caribe-resort-media-08', '/brand/caribe-resort/8-Foto-8.jpg', 'gallery', 7),
  ('property-casa-caribe-resort-media-09', '/brand/caribe-resort/9-Foto-9.jpg', 'gallery', 8)
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
  'landing-casa-condominio-caribe',
  'Casa no Condomínio Caribe Resort',
  'casa-condominio-caribe',
  '/casa-condominio-caribe',
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
