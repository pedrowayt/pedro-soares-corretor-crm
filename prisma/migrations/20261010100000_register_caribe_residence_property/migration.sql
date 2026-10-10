-- Register the second Caribe Residence & Resort house in the public catalogue and its campaign landing.
INSERT INTO "Property" (
  "id", "slug", "title", "type", "purpose", "status", "price",
  "city", "district", "suites", "parkingSpaces", "description",
  "features", "marketComparableLinks", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'property-casa-caribe-residence',
  'casa-caribe-residence-resort',
  'Casa no Caribe Residence & Resort',
  'CASA_EM_CONDOMINIO',
  'VENDA',
  'DISPONIVEL',
  2600000,
  'Palmas',
  'Caribe Residence & Resort',
  4,
  3,
  'Casa contemporânea no Caribe Residence & Resort, em Palmas/TO, com 4 suítes plenas, sendo 2 com closet, pé-direito duplo, espaço gourmet completo e piscina com cascata.',
  ARRAY[
    '4 suítes plenas, sendo 2 com closet',
    'Pé-direito duplo',
    'Espaço gourmet completo',
    'Piscina com cascata',
    'Lavabo e banheiro social de apoio',
    '2 despensas',
    '3 vagas cobertas',
    'Esquadrias em alumínio de alta qualidade',
    'Acabamentos com pedra portuguesa e iluminação em LED',
    'Poço semi artesiano'
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
  "suites" = EXCLUDED."suites",
  "parkingSpaces" = EXCLUDED."parkingSpaces",
  "description" = EXCLUDED."description",
  "features" = EXCLUDED."features",
  "marketComparableLinks" = EXCLUDED."marketComparableLinks",
  "publishedAt" = COALESCE("Property"."publishedAt", CURRENT_TIMESTAMP),
  "updatedAt" = CURRENT_TIMESTAMP;

WITH property AS (
  SELECT "id" FROM "Property" WHERE "slug" = 'casa-caribe-residence-resort'
)
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, media.variant, media.position
FROM property
CROSS JOIN (VALUES
  ('property-casa-caribe-residence-media-01', '/brand/caribe-residence/1-Foto-1.jpg', 'hero', 0),
  ('property-casa-caribe-residence-media-02', '/brand/caribe-residence/2-Foto-2.jpg', 'gallery', 1),
  ('property-casa-caribe-residence-media-03', '/brand/caribe-residence/3-Foto-3.jpg', 'gallery', 2),
  ('property-casa-caribe-residence-media-04', '/brand/caribe-residence/4-Foto-4.jpg', 'gallery', 3),
  ('property-casa-caribe-residence-media-05', '/brand/caribe-residence/5-Foto-5.jpg', 'gallery', 4),
  ('property-casa-caribe-residence-media-06', '/brand/caribe-residence/6-Foto-6.jpg', 'gallery', 5),
  ('property-casa-caribe-residence-media-07', '/brand/caribe-residence/7-Foto-7.jpg', 'gallery', 6),
  ('property-casa-caribe-residence-media-08', '/brand/caribe-residence/8-Foto-8.jpg', 'gallery', 7),
  ('property-casa-caribe-residence-media-09', '/brand/caribe-residence/9-Foto-9.jpg', 'gallery', 8),
  ('property-casa-caribe-residence-media-10', '/brand/caribe-residence/10-Foto-10.jpg', 'gallery', 9),
  ('property-casa-caribe-residence-media-11', '/brand/caribe-residence/11-Foto-11.jpg', 'gallery', 10),
  ('property-casa-caribe-residence-media-12', '/brand/caribe-residence/12-Foto-12.jpg', 'gallery', 11)
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
  'landing-casa-caribe-residence',
  'Casa no Caribe Residence & Resort',
  'casa-caribe-residence',
  '/casa-caribe-residence',
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
