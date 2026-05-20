-- Add Google Maps link field for public property details
ALTER TABLE "Property"
ADD COLUMN "googleMapsUrl" TEXT;
