-- Link dedicated property landing pages to their CRM Property records.
ALTER TABLE "LandingPage" ADD COLUMN "linkedPropertyId" TEXT;

CREATE INDEX "LandingPage_linkedPropertyId_idx" ON "LandingPage"("linkedPropertyId");

ALTER TABLE "LandingPage"
ADD CONSTRAINT "LandingPage_linkedPropertyId_fkey"
FOREIGN KEY ("linkedPropertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE "LandingPage" AS landing
SET "linkedPropertyId" = property."id"
FROM "Property" AS property
WHERE landing."linkedPropertyId" IS NULL
  AND (
    (landing."publicPath" = '/casa-condominio-caribe' AND property."slug" = 'casa-condominio-caribe-resort')
    OR (landing."publicPath" = '/casa-caribe-residence' AND property."slug" = 'casa-caribe-residence-resort')
    OR (landing."publicPath" = '/casa-nova-caribe-residence' AND property."slug" = 'casa-nova-caribe-residence-resort')
    OR (landing."publicPath" = '/casa-mirante-do-lago' AND property."slug" = 'casa-mirante-do-lago')
    OR (landing."publicPath" = '/casa-terrea-mirante-do-lago' AND property."slug" = 'casa-terrea-mirante-do-lago')
    OR (landing."publicPath" = '/casa-mirante-do-lago-235m2' AND property."slug" = 'casa-mirante-do-lago-235m2')
    OR (landing."publicPath" = '/casa-condominio-polineisia' AND property."slug" = 'casa-nova-condominio-polineisia-palmas')
    OR (landing."publicPath" = '/apartamento-flamboyant-ville-405-norte' AND property."slug" = 'apartamento-flamboyant-ville-405-norte')
  );
