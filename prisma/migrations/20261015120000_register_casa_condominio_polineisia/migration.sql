INSERT INTO "Property" (
  "id", "slug", "title", "type", "purpose", "status", "price", "address",
  "city", "district", "googleMapsUrl", "areaM2", "landAreaM2", "bedrooms",
  "suites", "description", "features", "internalNotes", "publishedAt", "updatedAt"
)
VALUES (
  'property-casa-polineisia-2026',
  'casa-nova-condominio-polineisia-palmas',
  'Casa nova de alto padrão no Condomínio Polinésia',
  'CASA_EM_CONDOMINIO',
  'VENDA',
  'DISPONIVEL',
  3490000,
  'Condomínio Polinésia, Palmas - TO',
  'Palmas',
  'Condomínio Polinésia',
  'https://www.google.com/maps/search/?api=1&query=Condominio+Polinesia+Palmas+TO',
  290.76,
  972,
  4,
  4,
  'Casa nova de alto padrão no Condomínio Polinésia, em Palmas/TO, com arquitetura contemporânea, ambientes amplos, quatro suítes plenas, piscina com hidromassagem e estrutura completa de lazer.',
  ARRAY[
    '4 suítes plenas',
    'Suíte master com closet',
    'Sala com pé-direito duplo',
    'Porta pivotante',
    'Cozinha com churrasqueira',
    'Piscina com hidromassagem',
    'Quintal gramado',
    'Irrigação automatizada',
    'Energia solar',
    'Poço semiartesiano',
    'Porcelanato',
    'Iluminação em LED',
    'Esquadrias de alumínio'
  ],
  'Cadastro originado da landing Casa Nova no Condomínio Polinésia. Atendimento: Pedro Soares, CRECI 5861-TO.',
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title",
  "type" = EXCLUDED."type",
  "purpose" = EXCLUDED."purpose",
  "status" = EXCLUDED."status",
  "price" = EXCLUDED."price",
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
  "internalNotes" = EXCLUDED."internalNotes",
  "publishedAt" = EXCLUDED."publishedAt",
  "updatedAt" = NOW();

INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
VALUES
  ('media-casa-polineisia-01', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/1-Foto-1.jpg', 'hero', 0),
  ('media-casa-polineisia-02', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/2-Foto-2.jpg', 'gallery', 1),
  ('media-casa-polineisia-03', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/3-Foto-3.jpg', 'gallery', 2),
  ('media-casa-polineisia-04', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/4-Foto-4.jpg', 'gallery', 3),
  ('media-casa-polineisia-05', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/5-Foto-5.jpg', 'gallery', 4),
  ('media-casa-polineisia-06', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/6-Foto-6.jpg', 'gallery', 5),
  ('media-casa-polineisia-07', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/7-Foto-7.jpg', 'gallery', 6),
  ('media-casa-polineisia-08', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/8-Foto-8.jpg', 'gallery', 7),
  ('media-casa-polineisia-09', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/9-Foto-9.jpg', 'gallery', 8),
  ('media-casa-polineisia-10', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/10-Foto-10.jpg', 'gallery', 9),
  ('media-casa-polineisia-11', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/11-Foto-11.jpg', 'gallery', 10),
  ('media-casa-polineisia-12', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/12-Foto-12.jpg', 'gallery', 11),
  ('media-casa-polineisia-13', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/13-Foto-13.jpg', 'gallery', 12),
  ('media-casa-polineisia-14', 'property-casa-polineisia-2026', 'IMAGE', 'PRONTO', '/brand/casa-polineisia/14-Foto-14.jpg', 'gallery', 13)
ON CONFLICT ("id") DO UPDATE SET
  "propertyId" = EXCLUDED."propertyId",
  "kind" = EXCLUDED."kind",
  "status" = EXCLUDED."status",
  "url" = EXCLUDED."url",
  "variant" = EXCLUDED."variant",
  "position" = EXCLUDED."position";
