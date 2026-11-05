-- Register the Flamboyant Ville apartment, its supplied photos, and campaign landing.
INSERT INTO "Property" (
  "id", "slug", "title", "type", "purpose", "status", "price", "address",
  "city", "district", "googleMapsUrl", "areaM2", "bedrooms", "livingRooms",
  "bathrooms", "parkingSpaces", "floorNumber", "description", "features",
  "marketComparableLinks", "internalNotes", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'property-apartamento-flamboyant-ville-405-norte',
  'apartamento-flamboyant-ville-405-norte',
  'Apartamento no Residencial Flamboyant Ville · 405 Norte',
  'APARTAMENTO',
  'VENDA',
  'DISPONIVEL',
  300000,
  'Residencial Flamboyant Ville, 405 Norte, Palmas - TO',
  'Palmas',
  '405 Norte',
  'https://www.google.com/maps/search/?api=1&query=Residencial+Flamboyant+Ville+405+Norte+Palmas+TO',
  58,
  2,
  1,
  1,
  1,
  4,
  'Apartamento à venda e para locação no Residencial Flamboyant Ville, 405 Norte, Palmas/TO. São 58 m² de área privativa, 2 quartos, sala com painel planejado, varanda integrada, cozinha planejada, 1 vaga e lazer no condomínio. Venda por R$ 300.000. Também disponível para locação por R$ 2.300/mês, sob consulta de condições.',
  ARRAY[
    '58 m² de área privativa',
    '2 quartos, sendo 1 climatizado',
    'Sala com painel planejado e ar-condicionado',
    'Varanda integrada à sala',
    'Banheiro social',
    'Cozinha com armários, cooktop e micro-ondas',
    'Área de serviço',
    'Piso em porcelanato',
    '1 vaga de garagem',
    '4º andar',
    'Condomínio sem elevador',
    'Piscina, salão de festas, churrasqueira, playground e quadra esportiva',
    'Portaria 24 horas'
  ],
  ARRAY[]::text[],
  'Também disponível para locação por R$ 2.300/mês. Confirmar disponibilidade, encargos e condições diretamente com o responsável pelo atendimento.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title", "type" = EXCLUDED."type", "purpose" = EXCLUDED."purpose",
  "status" = EXCLUDED."status", "price" = EXCLUDED."price", "address" = EXCLUDED."address",
  "city" = EXCLUDED."city", "district" = EXCLUDED."district", "googleMapsUrl" = EXCLUDED."googleMapsUrl",
  "areaM2" = EXCLUDED."areaM2", "bedrooms" = EXCLUDED."bedrooms", "livingRooms" = EXCLUDED."livingRooms",
  "bathrooms" = EXCLUDED."bathrooms", "parkingSpaces" = EXCLUDED."parkingSpaces", "floorNumber" = EXCLUDED."floorNumber",
  "description" = EXCLUDED."description", "features" = EXCLUDED."features", "marketComparableLinks" = EXCLUDED."marketComparableLinks",
  "internalNotes" = EXCLUDED."internalNotes", "publishedAt" = COALESCE("Property"."publishedAt", CURRENT_TIMESTAMP), "updatedAt" = CURRENT_TIMESTAMP;

WITH property AS (SELECT "id" FROM "Property" WHERE "slug" = 'apartamento-flamboyant-ville-405-norte')
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, media.variant, media.position
FROM property
CROSS JOIN (VALUES
  ('property-apartamento-flamboyant-ville-media-01', '/brand/apartamento-flamboyant-ville-405-norte/8-Foto-8.jpg', 'hero', 0),
  ('property-apartamento-flamboyant-ville-media-02', '/brand/apartamento-flamboyant-ville-405-norte/1-Foto-1.jpg', 'gallery', 1),
  ('property-apartamento-flamboyant-ville-media-03', '/brand/apartamento-flamboyant-ville-405-norte/2-Foto-2.jpg', 'gallery', 2),
  ('property-apartamento-flamboyant-ville-media-04', '/brand/apartamento-flamboyant-ville-405-norte/3-Foto-3.jpg', 'gallery', 3),
  ('property-apartamento-flamboyant-ville-media-05', '/brand/apartamento-flamboyant-ville-405-norte/4-Foto-4.jpg', 'gallery', 4),
  ('property-apartamento-flamboyant-ville-media-06', '/brand/apartamento-flamboyant-ville-405-norte/5-Foto-5.jpg', 'gallery', 5),
  ('property-apartamento-flamboyant-ville-media-07', '/brand/apartamento-flamboyant-ville-405-norte/6-Foto-6.jpg', 'gallery', 6),
  ('property-apartamento-flamboyant-ville-media-08', '/brand/apartamento-flamboyant-ville-405-norte/7-Foto-7.jpg', 'gallery', 7),
  ('property-apartamento-flamboyant-ville-media-09', '/brand/apartamento-flamboyant-ville-405-norte/9-Foto-9.jpg', 'gallery', 8),
  ('property-apartamento-flamboyant-ville-media-10', '/brand/apartamento-flamboyant-ville-405-norte/10-Foto-10.jpg', 'gallery', 9)
) AS media(id, url, variant, position)
ON CONFLICT ("id") DO UPDATE SET
  "propertyId" = EXCLUDED."propertyId", "kind" = EXCLUDED."kind", "status" = EXCLUDED."status",
  "url" = EXCLUDED."url", "variant" = EXCLUDED."variant", "position" = EXCLUDED."position";

INSERT INTO "LandingPage" (
  "id", "name", "slug", "publicPath", "type", "status", "formKey", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'landing-apartamento-flamboyant-ville-405-norte',
  'Apartamento Flamboyant Ville · 405 Norte',
  'apartamento-flamboyant-ville-405-norte',
  '/apartamento-flamboyant-ville-405-norte',
  'CAMPAIGN',
  'PUBLISHED',
  'property-interest',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name", "publicPath" = EXCLUDED."publicPath", "type" = EXCLUDED."type",
  "status" = EXCLUDED."status", "formKey" = EXCLUDED."formKey",
  "publishedAt" = COALESCE("LandingPage"."publishedAt", CURRENT_TIMESTAMP), "updatedAt" = CURRENT_TIMESTAMP;
