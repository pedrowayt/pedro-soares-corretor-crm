-- Support a single CRM property being offered for sale and/or rent.
ALTER TABLE "Property" ADD COLUMN "salePrice" DECIMAL(14, 2);
ALTER TABLE "Property" ADD COLUMN "rentPrice" DECIMAL(14, 2);

-- Preserve the existing price as the primary commercial value.
UPDATE "Property"
SET "salePrice" = "price"
WHERE "purpose" IN ('VENDA', 'INVESTIMENTO')
  AND "salePrice" IS NULL;

UPDATE "Property"
SET "rentPrice" = "price"
WHERE "purpose" = 'LOCACAO'
  AND "rentPrice" IS NULL;

-- The Flamboyant Ville listing was supplied with both commercial conditions.
UPDATE "Property"
SET "salePrice" = 300000,
    "rentPrice" = 2300
WHERE "slug" = 'apartamento-flamboyant-ville-405-norte';

CREATE INDEX "Property_salePrice_idx" ON "Property"("salePrice");
CREATE INDEX "Property_rentPrice_idx" ON "Property"("rentPrice");
