-- Use the facade as the first public catalogue image for Casa no Caribe Residence & Resort.
WITH property AS (
  SELECT "id" FROM "Property" WHERE "slug" = 'casa-caribe-residence-resort'
), ordered_media AS (
  SELECT *
  FROM (VALUES
    ('/brand/caribe-residence/6-Foto-6.jpg', 'hero', 0),
    ('/brand/caribe-residence/1-Foto-1.jpg', 'gallery', 1),
    ('/brand/caribe-residence/4-Foto-4.jpg', 'gallery', 2),
    ('/brand/caribe-residence/5-Foto-5.jpg', 'gallery', 3),
    ('/brand/caribe-residence/2-Foto-2.jpg', 'gallery', 4),
    ('/brand/caribe-residence/3-Foto-3.jpg', 'gallery', 5),
    ('/brand/caribe-residence/12-Foto-12.jpg', 'gallery', 6),
    ('/brand/caribe-residence/8-Foto-8.jpg', 'gallery', 7),
    ('/brand/caribe-residence/7-Foto-7.jpg', 'gallery', 8),
    ('/brand/caribe-residence/9-Foto-9.jpg', 'gallery', 9),
    ('/brand/caribe-residence/11-Foto-11.jpg', 'gallery', 10),
    ('/brand/caribe-residence/10-Foto-10.jpg', 'gallery', 11)
  ) AS media(url, variant, position)
)
UPDATE "PropertyMedia" AS property_media
SET
  "variant" = ordered_media.variant,
  "position" = ordered_media.position
FROM property, ordered_media
WHERE property_media."propertyId" = property."id"
  AND property_media."url" = ordered_media.url;
