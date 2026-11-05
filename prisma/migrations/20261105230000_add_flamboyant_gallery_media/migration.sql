-- Add the two supplied gallery photos to the Flamboyant Ville property.
WITH property AS (
  SELECT "id" FROM "Property" WHERE "slug" = 'apartamento-flamboyant-ville-405-norte'
)
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, media.variant, media.position
FROM property
CROSS JOIN (VALUES
  ('property-apartamento-flamboyant-ville-media-18', '/brand/apartamento-flamboyant-ville-405-norte/18-salao-de-festas.jpg', 'gallery', 17),
  ('property-apartamento-flamboyant-ville-media-19', '/brand/apartamento-flamboyant-ville-405-norte/19-entrada-condominio.jpg', 'gallery', 18)
) AS media(id, url, variant, position)
ON CONFLICT ("id") DO UPDATE SET
  "propertyId" = EXCLUDED."propertyId",
  "kind" = EXCLUDED."kind",
  "status" = EXCLUDED."status",
  "url" = EXCLUDED."url",
  "variant" = EXCLUDED."variant",
  "position" = EXCLUDED."position";
