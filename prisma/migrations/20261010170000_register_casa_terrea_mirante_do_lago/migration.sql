-- Register the new single-storey Mirante do Lago house and its campaign landing.
INSERT INTO "Property" (
  "id", "slug", "title", "type", "purpose", "status", "price",
  "city", "district", "areaM2", "landAreaM2", "bedrooms", "livingRooms",
  "suites", "bathrooms", "parkingSpaces", "description", "features",
  "marketComparableLinks", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'property-casa-terrea-mirante-do-lago',
  'casa-terrea-mirante-do-lago',
  'Casa Térrea Mirante do Lago',
  'CASA_EM_CONDOMINIO',
  'VENDA',
  'DISPONIVEL',
  2390000,
  'Palmas',
  'Condomínio Mirante do Lago',
  210,
  420,
  3,
  2,
  3,
  NULL,
  2,
  'Casa térrea localizada no Condomínio Mirante do Lago, em Palmas/TO, com 210 m² construídos, terreno de 420 m², 3 suítes, piscina com hidromassagem separada, varanda gourmet, iluminação em LED e móveis planejados em todos os ambientes. Valor de R$ 2.390.000.',
  ARRAY[
    'Sala de estar com pé-direito duplo integrada à cozinha',
    'Lavabo',
    '3 suítes, sendo a master com closet e banheira de hidromassagem',
    'Área de serviço e banheiro de serviço',
    'Varanda gourmet integrada à piscina',
    'Piscina com hidromassagem separada',
    'Iluminação em LED',
    'Espaço para jardins',
    '2 vagas de garagem cobertas e 2 descobertas',
    'Móveis planejados em todos os ambientes'
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
  SELECT "id" FROM "Property" WHERE "slug" = 'casa-terrea-mirante-do-lago'
)
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, media.variant, media.position
FROM property
CROSS JOIN (VALUES
  ('property-casa-terrea-mirante-do-lago-media-01', '/brand/casa-terrea-mirante-do-lago/fotos/18-fachada.jpg', 'hero', 0),
  ('property-casa-terrea-mirante-do-lago-media-02', '/brand/casa-terrea-mirante-do-lago/fotos/14-cozinha-piscina.jpg', 'gallery', 1),
  ('property-casa-terrea-mirante-do-lago-media-03', '/brand/casa-terrea-mirante-do-lago/fotos/12-estar-jantar.jpg', 'gallery', 2),
  ('property-casa-terrea-mirante-do-lago-media-04', '/brand/casa-terrea-mirante-do-lago/fotos/15-cozinha-ilha.jpg', 'gallery', 3),
  ('property-casa-terrea-mirante-do-lago-media-05', '/brand/casa-terrea-mirante-do-lago/fotos/16-area-gourmet.jpg', 'gallery', 4),
  ('property-casa-terrea-mirante-do-lago-media-06', '/brand/casa-terrea-mirante-do-lago/fotos/17-piscina.jpg', 'gallery', 5),
  ('property-casa-terrea-mirante-do-lago-media-07', '/brand/casa-terrea-mirante-do-lago/fotos/04-quarto-painel.jpg', 'gallery', 6),
  ('property-casa-terrea-mirante-do-lago-media-08', '/brand/casa-terrea-mirante-do-lago/fotos/05-quarto-painel-2.jpg', 'gallery', 7),
  ('property-casa-terrea-mirante-do-lago-media-09', '/brand/casa-terrea-mirante-do-lago/fotos/06-closet.jpg', 'gallery', 8),
  ('property-casa-terrea-mirante-do-lago-media-10', '/brand/casa-terrea-mirante-do-lago/fotos/07-closet-2.jpg', 'gallery', 9),
  ('property-casa-terrea-mirante-do-lago-media-11', '/brand/casa-terrea-mirante-do-lago/fotos/08-banheiro-master.jpg', 'gallery', 10),
  ('property-casa-terrea-mirante-do-lago-media-12', '/brand/casa-terrea-mirante-do-lago/fotos/01-quarto.jpg', 'gallery', 11),
  ('property-casa-terrea-mirante-do-lago-media-13', '/brand/casa-terrea-mirante-do-lago/fotos/02-quarto-espelho.jpg', 'gallery', 12),
  ('property-casa-terrea-mirante-do-lago-media-14', '/brand/casa-terrea-mirante-do-lago/fotos/03-banheiro.jpg', 'gallery', 13),
  ('property-casa-terrea-mirante-do-lago-media-15', '/brand/casa-terrea-mirante-do-lago/fotos/09-circulacao.jpg', 'gallery', 14),
  ('property-casa-terrea-mirante-do-lago-media-16', '/brand/casa-terrea-mirante-do-lago/fotos/10-quarto-2.jpg', 'gallery', 15),
  ('property-casa-terrea-mirante-do-lago-media-17', '/brand/casa-terrea-mirante-do-lago/fotos/11-quarto-3.jpg', 'gallery', 16),
  ('property-casa-terrea-mirante-do-lago-media-18', '/brand/casa-terrea-mirante-do-lago/fotos/13-cozinha.jpg', 'gallery', 17)
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
  'landing-casa-terrea-mirante-do-lago',
  'Casa Térrea Mirante do Lago',
  'casa-terrea-mirante-do-lago',
  '/casa-terrea-mirante-do-lago',
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
