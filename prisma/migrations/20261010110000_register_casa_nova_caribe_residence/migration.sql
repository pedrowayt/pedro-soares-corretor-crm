-- Register the new Casa Nova offer and its campaign landing in the public catalogue and CRM.
INSERT INTO "Property" (
  "id", "slug", "title", "type", "purpose", "status", "price",
  "city", "district", "areaM2", "landAreaM2", "livingRooms", "suites",
  "description", "features", "marketComparableLinks", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'property-casa-nova-caribe-residence',
  'casa-nova-caribe-residence-resort',
  'Casa Nova - Caribe Residence Condomínio Resort',
  'CASA_EM_CONDOMINIO',
  'VENDA',
  'DISPONIVEL',
  2650000,
  'Palmas',
  'Caribe Residence Condomínio Resort',
  243,
  609.76,
  2,
  3,
  'Casa nova no Caribe Residence Condomínio Resort, em Palmas/TO, com projeto QUBUS Arquitetura, lote de 609,76 m², 243 m² construídos e ocupação do terreno de 39,85%.',
  ARRAY[
    '3 suítes plenas',
    'Cozinha e varanda gourmet',
    'Sala de estar e sala de jantar',
    'Escritório com lavabo',
    'Piscina com cascata e ducha externa',
    'Deck em porcelanato e paisagismo',
    'Churrasqueira',
    'Ponto para energia solar',
    'Ponto para energia de carro elétrico',
    'Preparação para poço semiartesiano',
    'Ponto para banheira na suíte master'
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
  SELECT "id" FROM "Property" WHERE "slug" = 'casa-nova-caribe-residence-resort'
)
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, media.variant, media.position
FROM property
CROSS JOIN (VALUES
  ('property-casa-nova-caribe-residence-media-01', '/brand/casa-nova-caribe/1-Foto-1.jpg', 'hero', 0),
  ('property-casa-nova-caribe-residence-media-02', '/brand/casa-nova-caribe/2-Foto-2.jpg', 'gallery', 1),
  ('property-casa-nova-caribe-residence-media-03', '/brand/casa-nova-caribe/3-Foto-3.jpg', 'gallery', 2),
  ('property-casa-nova-caribe-residence-media-04', '/brand/casa-nova-caribe/4-Foto-4.jpg', 'gallery', 3),
  ('property-casa-nova-caribe-residence-media-05', '/brand/casa-nova-caribe/5-Foto-5.jpg', 'gallery', 4),
  ('property-casa-nova-caribe-residence-media-06', '/brand/casa-nova-caribe/6-Foto-6.jpg', 'gallery', 5),
  ('property-casa-nova-caribe-residence-media-07', '/brand/casa-nova-caribe/7-Foto-7.jpg', 'gallery', 6),
  ('property-casa-nova-caribe-residence-media-08', '/brand/casa-nova-caribe/8-Foto-8.jpg', 'gallery', 7),
  ('property-casa-nova-caribe-residence-media-09', '/brand/casa-nova-caribe/9-Foto-9.jpg', 'gallery', 8),
  ('property-casa-nova-caribe-residence-media-10', '/brand/casa-nova-caribe/10-Foto-10.jpg', 'gallery', 9)
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
  'landing-casa-nova-caribe-residence',
  'Casa Nova - Caribe Residence Condomínio Resort',
  'casa-nova-caribe-residence',
  '/casa-nova-caribe-residence',
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
