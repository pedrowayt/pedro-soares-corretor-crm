import { listPublicProperties } from "@/lib/data/properties";
import { buildPortalFeedXml } from "@/lib/feeds/portal-feed";

export const revalidate = 1800; // 30 min

export async function GET() {
  const properties = await listPublicProperties();

  const xml = buildPortalFeedXml(
    properties.map((property) => ({
      id: property.id,
      slug: property.slug,
      title: property.title,
      description: property.description,
      type: property.type,
      purpose: property.purpose,
      price: property.priceValue,
      city: property.city,
      district: property.district,
      address: property.address,
      postalCode: property.postalCode,
      latitude: property.latitude ? Number(property.latitude) : null,
      longitude: property.longitude ? Number(property.longitude) : null,
      areaM2: property.areaM2Value,
      landAreaM2: property.landAreaM2Value,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      suites: property.suites,
      parkingSpaces: property.parkingSpaces,
      features: property.features ?? [],
      media: (property.media ?? []).map((media) => ({ url: media.url })),
      updatedAt:
        (property as { updatedAt?: Date | string | null }).updatedAt ?? new Date()
    }))
  );

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=1800"
    }
  });
}
