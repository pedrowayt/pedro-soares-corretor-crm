-- Sync Urban Haute with the current Urban Vendas source snapshot.
-- Prices remain intentionally empty and hidden from the public catalog.
UPDATE "Development"
SET
  "title" = 'Urban Haute',
  "district" = 'Plano Diretor Norte',
  "city" = 'Palmas',
  "neighborhood" = 'ACSU NO13',
  "address" = 'Quadra AE NO13, Avenida Juscelino Kubitschek, 02',
  "stage" = 'PRE_LAUNCH',
  "deliveryDate" = '2030-12-30T00:00:00.000Z',
  "areaFromM2" = 36.41,
  "areaToM2" = 194.04,
  "bedroomsFrom" = 0,
  "bedroomsTo" = 3,
  "bathroomsFrom" = 1,
  "bathroomsTo" = 5,
  "parkingFrom" = 1,
  "parkingTo" = 2,
  "totalUnits" = 376,
  "availableUnits" = 99,
  "apartmentsText" = 'Residências de 1, 2 e 3 quartos, penthouses e offices com áreas anunciadas de 36,41 a 194,04 m².',
  "locationText" = 'Quadra AE NO13, Avenida Juscelino Kubitschek, 02, ao lado do Shopping Capim Dourado, em Palmas/TO.',
  "mapEmbedUrl" = 'https://www.google.com/maps?q=Quadra+AE+NO13,+Avenida+Juscelino+Kubitschek,+02,+Palmas+-+TO&output=embed',
  "showPrice" = false,
  "isPublished" = true,
  "status" = 'PUBLISHED',
  "publishedAt" = COALESCE("publishedAt", CURRENT_TIMESTAMP),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'urban-haute';

UPDATE "DevelopmentUnitType"
SET
  "name" = 'Penthouse · 125,25 a 194,04 m²',
  "areaToM2" = 194.04,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'urban-haute-penthouse';

UPDATE "DevelopmentUnitType"
SET
  "name" = 'Haute Offices · 36,41 a 80 m²',
  "areaFromM2" = 36.41,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'urban-haute-office';

UPDATE "LandingPage"
SET
  "name" = 'Urban Haute',
  "type" = 'DEVELOPMENT',
  "status" = 'PUBLISHED',
  "formKey" = 'development-interest',
  "linkedDevelopmentId" = (SELECT "id" FROM "Development" WHERE "slug" = 'urban-haute'),
  "publicPath" = '/urban-haute',
  "publishedAt" = COALESCE("publishedAt", CURRENT_TIMESTAMP),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'urban-haute';
