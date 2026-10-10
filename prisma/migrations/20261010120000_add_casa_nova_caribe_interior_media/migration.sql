-- Add the new interior and finish photos to the Casa Nova catalogue record.
WITH property AS (
  SELECT "id" FROM "Property" WHERE "slug" = 'casa-nova-caribe-residence-resort'
)
INSERT INTO "PropertyMedia" ("id", "propertyId", "kind", "status", "url", "variant", "position")
SELECT media.id, property."id", 'IMAGE', 'PRONTO', media.url, 'gallery', media.position
FROM property
CROSS JOIN (VALUES
  ('property-casa-nova-caribe-residence-interior-media-01', '/brand/casa-nova-caribe/interiores/1-Foto-1.jpg', 10),
  ('property-casa-nova-caribe-residence-interior-media-02', '/brand/casa-nova-caribe/interiores/2-Foto-2.jpg', 11),
  ('property-casa-nova-caribe-residence-interior-media-03', '/brand/casa-nova-caribe/interiores/3-Foto-3.jpg', 12),
  ('property-casa-nova-caribe-residence-interior-media-04', '/brand/casa-nova-caribe/interiores/4-Foto-4.jpg', 13),
  ('property-casa-nova-caribe-residence-interior-media-05', '/brand/casa-nova-caribe/interiores/5-Foto-5.jpg', 14),
  ('property-casa-nova-caribe-residence-interior-media-06', '/brand/casa-nova-caribe/interiores/6-Foto-6.jpg', 15),
  ('property-casa-nova-caribe-residence-interior-media-07', '/brand/casa-nova-caribe/interiores/7-Foto-7.jpg', 16),
  ('property-casa-nova-caribe-residence-interior-media-08', '/brand/casa-nova-caribe/interiores/8-Foto-8.jpg', 17),
  ('property-casa-nova-caribe-residence-interior-media-09', '/brand/casa-nova-caribe/interiores/9-Foto-9.jpg', 18),
  ('property-casa-nova-caribe-residence-interior-media-10', '/brand/casa-nova-caribe/interiores/10-Foto-10.jpg', 19)
) AS media(id, url, position)
ON CONFLICT ("id") DO UPDATE SET
  "propertyId" = EXCLUDED."propertyId",
  "kind" = EXCLUDED."kind",
  "status" = EXCLUDED."status",
  "url" = EXCLUDED."url",
  "variant" = EXCLUDED."variant",
  "position" = EXCLUDED."position";
