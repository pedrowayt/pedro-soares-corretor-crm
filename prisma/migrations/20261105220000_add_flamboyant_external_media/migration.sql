-- Add the supplied external-area photos to the existing Flamboyant Ville property.
WITH property AS (
  SELECT "id" FROM "Property" WHERE "slug" = 'apartamento-flamboyant-ville-405-norte'
)
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, media.variant, media.position
FROM property
CROSS JOIN (VALUES
  ('property-apartamento-flamboyant-ville-media-11', '/brand/apartamento-flamboyant-ville-405-norte/11-area-externa-entrada.jpg', 'gallery', 10),
  ('property-apartamento-flamboyant-ville-media-12', '/brand/apartamento-flamboyant-ville-405-norte/12-area-externa-quadra.jpg', 'gallery', 11),
  ('property-apartamento-flamboyant-ville-media-13', '/brand/apartamento-flamboyant-ville-405-norte/13-area-externa-churrasqueira.jpg', 'gallery', 12),
  ('property-apartamento-flamboyant-ville-media-14', '/brand/apartamento-flamboyant-ville-405-norte/14-area-externa-piscina.jpg', 'gallery', 13),
  ('property-apartamento-flamboyant-ville-media-15', '/brand/apartamento-flamboyant-ville-405-norte/15-area-externa-acesso.jpg', 'gallery', 14),
  ('property-apartamento-flamboyant-ville-media-16', '/brand/apartamento-flamboyant-ville-405-norte/16-area-externa-piscina-deck.jpg', 'gallery', 15),
  ('property-apartamento-flamboyant-ville-media-17', '/brand/apartamento-flamboyant-ville-405-norte/17-area-externa-jardins.jpg', 'gallery', 16)
) AS media(id, url, variant, position)
ON CONFLICT ("id") DO UPDATE SET
  "propertyId" = EXCLUDED."propertyId",
  "kind" = EXCLUDED."kind",
  "status" = EXCLUDED."status",
  "url" = EXCLUDED."url",
  "variant" = EXCLUDED."variant",
  "position" = EXCLUDED."position";
