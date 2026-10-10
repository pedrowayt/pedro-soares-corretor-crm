-- Add the new kitchen and gourmet veranda photos to the Casa Nova catalogue record.
DELETE FROM "PropertyMedia"
WHERE "propertyId" = (SELECT "id" FROM "Property" WHERE "slug" = 'casa-nova-caribe-residence-resort')
  AND "url" IN (
    '/brand/casa-nova-caribe/interiores/7-Foto-7.jpg',
    '/brand/casa-nova-caribe/interiores/8-Foto-8.jpg',
    '/brand/casa-nova-caribe/interiores/9-Foto-9.jpg',
    '/brand/casa-nova-caribe/interiores/10-Foto-10.jpg'
  );

WITH property AS (
  SELECT "id" FROM "Property" WHERE "slug" = 'casa-nova-caribe-residence-resort'
)
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, 'gallery', media.position
FROM property
CROSS JOIN (VALUES
  ('property-casa-nova-caribe-residence-gourmet-media-11', '/brand/casa-nova-caribe/interiores/11-Foto-11.jpg', 20),
  ('property-casa-nova-caribe-residence-gourmet-media-12', '/brand/casa-nova-caribe/interiores/12-Foto-12.jpg', 21),
  ('property-casa-nova-caribe-residence-gourmet-media-13', '/brand/casa-nova-caribe/interiores/13-Foto-13.jpg', 22),
  ('property-casa-nova-caribe-residence-gourmet-media-14', '/brand/casa-nova-caribe/interiores/14-Foto-14.jpg', 23),
  ('property-casa-nova-caribe-residence-gourmet-media-15', '/brand/casa-nova-caribe/interiores/15-Foto-15.jpg', 24),
  ('property-casa-nova-caribe-residence-gourmet-media-16', '/brand/casa-nova-caribe/interiores/16-Foto-16.jpg', 25)
) AS media(id, url, position)
ON CONFLICT ("id") DO UPDATE SET
  "propertyId" = EXCLUDED."propertyId",
  "kind" = EXCLUDED."kind",
  "status" = EXCLUDED."status",
  "url" = EXCLUDED."url",
  "variant" = EXCLUDED."variant",
  "position" = EXCLUDED."position";
