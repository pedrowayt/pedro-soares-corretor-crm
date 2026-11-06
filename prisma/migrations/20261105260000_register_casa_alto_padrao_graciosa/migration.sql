-- Register a new high-standard house near Praia da Graciosa with its supplied gallery.
INSERT INTO "Property" (
  "id", "slug", "title", "type", "purpose", "status", "price", "salePrice",
  "address", "city", "district", "googleMapsUrl", "areaM2", "landAreaM2",
  "bedrooms", "suites", "description", "features", "marketComparableLinks",
  "internalNotes", "publishedAt", "createdAt", "updatedAt"
)
VALUES (
  'property-casa-alto-padrao-praia-graciosa',
  'casa-alto-padrao-praia-graciosa',
  'Casa nova de alto padrão próxima à Praia da Graciosa',
  'CASA',
  'VENDA',
  'DISPONIVEL',
  1650000,
  1650000,
  NULL,
  'Palmas',
  'Orla da Graciosa',
  'https://www.google.com/maps/search/?api=1&query=Praia+da+Graciosa+Palmas+TO',
  192.68,
  320,
  4,
  4,
  'Casa nova de alto padrão próxima à Orla da Praia da Graciosa, em Palmas/TO. A residência possui 192,68 m² de área construída, 224,34 m² de área coberta total e terreno de 320 m², com arquitetura moderna, tecnologia e acabamentos premium. Conta com 4 suítes, escritório, sala com pé-direito alto, cozinha gourmet, varanda integrada, piscina com cascata, hidromassagem e aquecimento solar, energia solar instalada, automação residencial por comandos de voz, sistema de som integrado, paisagismo com irrigação automatizada e garagem coberta.',
  ARRAY[
    'Terreno de 320 m²',
    '192,68 m² de área construída',
    '224,34 m² de área coberta total',
    '4 suítes',
    'Escritório',
    'Sala com pé-direito alto',
    'Cozinha gourmet com acabamento premium',
    'Varanda gourmet integrada',
    'Piscina com cascata e hidromassagem',
    'Aquecimento solar',
    'Energia solar instalada',
    'Automação residencial com comandos por voz',
    'Sistema de som integrado',
    'Paisagismo e irrigação automatizada',
    'Garagem coberta',
    'Fachada com Pedra Atacama',
    'Bancadas em São Gabriel Escovado',
    'Porcelanato acetinado 90x90 Travertino',
    'Porta principal em alumínio',
    'Preparação para sistema de câmeras'
  ],
  ARRAY[]::text[],
  'Cadastro baseado nas informações enviadas. Confirmar endereço exato, quantidade de vagas, número de banheiros, condomínio e IPTU antes da divulgação detalhada.',
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
  "salePrice" = EXCLUDED."salePrice",
  "address" = EXCLUDED."address",
  "city" = EXCLUDED."city",
  "district" = EXCLUDED."district",
  "googleMapsUrl" = EXCLUDED."googleMapsUrl",
  "areaM2" = EXCLUDED."areaM2",
  "landAreaM2" = EXCLUDED."landAreaM2",
  "bedrooms" = EXCLUDED."bedrooms",
  "suites" = EXCLUDED."suites",
  "description" = EXCLUDED."description",
  "features" = EXCLUDED."features",
  "marketComparableLinks" = EXCLUDED."marketComparableLinks",
  "internalNotes" = EXCLUDED."internalNotes",
  "publishedAt" = COALESCE("Property"."publishedAt", CURRENT_TIMESTAMP),
  "updatedAt" = CURRENT_TIMESTAMP;

WITH property AS (
  SELECT "id" FROM "Property" WHERE "slug" = 'casa-alto-padrao-praia-graciosa'
)
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, media.variant, media.position
FROM property
CROSS JOIN (VALUES
  ('property-casa-alto-padrao-praia-graciosa-media-01', '/brand/casa-alto-padrao-praia-graciosa/foto-01.jpg', 'hero', 0),
  ('property-casa-alto-padrao-praia-graciosa-media-02', '/brand/casa-alto-padrao-praia-graciosa/foto-02.jpg', 'gallery', 1),
  ('property-casa-alto-padrao-praia-graciosa-media-03', '/brand/casa-alto-padrao-praia-graciosa/foto-03.jpg', 'gallery', 2),
  ('property-casa-alto-padrao-praia-graciosa-media-04', '/brand/casa-alto-padrao-praia-graciosa/foto-04.jpg', 'gallery', 3),
  ('property-casa-alto-padrao-praia-graciosa-media-05', '/brand/casa-alto-padrao-praia-graciosa/foto-05.jpg', 'gallery', 4),
  ('property-casa-alto-padrao-praia-graciosa-media-06', '/brand/casa-alto-padrao-praia-graciosa/foto-06.jpg', 'gallery', 5),
  ('property-casa-alto-padrao-praia-graciosa-media-07', '/brand/casa-alto-padrao-praia-graciosa/foto-07.jpg', 'gallery', 6),
  ('property-casa-alto-padrao-praia-graciosa-media-08', '/brand/casa-alto-padrao-praia-graciosa/foto-08.jpg', 'gallery', 7),
  ('property-casa-alto-padrao-praia-graciosa-media-09', '/brand/casa-alto-padrao-praia-graciosa/foto-09.jpg', 'gallery', 8),
  ('property-casa-alto-padrao-praia-graciosa-media-10', '/brand/casa-alto-padrao-praia-graciosa/foto-10.jpg', 'gallery', 9),
  ('property-casa-alto-padrao-praia-graciosa-media-11', '/brand/casa-alto-padrao-praia-graciosa/foto-11.jpg', 'gallery', 10),
  ('property-casa-alto-padrao-praia-graciosa-media-12', '/brand/casa-alto-padrao-praia-graciosa/foto-12.jpg', 'gallery', 11),
  ('property-casa-alto-padrao-praia-graciosa-media-13', '/brand/casa-alto-padrao-praia-graciosa/foto-13.jpg', 'gallery', 12),
  ('property-casa-alto-padrao-praia-graciosa-media-14', '/brand/casa-alto-padrao-praia-graciosa/foto-14.jpg', 'gallery', 13),
  ('property-casa-alto-padrao-praia-graciosa-media-15', '/brand/casa-alto-padrao-praia-graciosa/foto-15.jpg', 'gallery', 14),
  ('property-casa-alto-padrao-praia-graciosa-media-16', '/brand/casa-alto-padrao-praia-graciosa/foto-16.jpg', 'gallery', 15),
  ('property-casa-alto-padrao-praia-graciosa-media-17', '/brand/casa-alto-padrao-praia-graciosa/foto-17.jpg', 'gallery', 16),
  ('property-casa-alto-padrao-praia-graciosa-media-18', '/brand/casa-alto-padrao-praia-graciosa/foto-18.jpg', 'gallery', 17),
  ('property-casa-alto-padrao-praia-graciosa-media-19', '/brand/casa-alto-padrao-praia-graciosa/foto-19.jpg', 'gallery', 18)
) AS media(id, url, variant, position)
ON CONFLICT ("id") DO UPDATE SET
  "propertyId" = EXCLUDED."propertyId",
  "kind" = EXCLUDED."kind",
  "status" = EXCLUDED."status",
  "url" = EXCLUDED."url",
  "variant" = EXCLUDED."variant",
  "position" = EXCLUDED."position";
