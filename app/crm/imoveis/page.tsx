import { PropertyListManager, type PropertyListItem } from "@/components/crm/property-list-manager";
import { listCrmProperties } from "@/lib/data/crm-properties";

export default async function CrmImoveisPage() {
  const properties = await listCrmProperties();
  const propertyItems: PropertyListItem[] = properties.map((property) => {
    const media = (property.media ?? []).slice().sort((a, b) => a.position - b.position);
    const owner = property.owner as { name?: string; phone?: string } | null | undefined;

    return {
      id: property.id,
      title: property.title,
      slug: property.slug,
      status: String(property.status),
      purpose: String(property.purpose),
      type: String(property.type),
      price: Number(property.price),
      city: property.city,
      district: property.district,
      landAreaM2: property.landAreaM2 ?? null,
      bedrooms: property.bedrooms ?? null,
      livingRooms: property.livingRooms ?? null,
      suites: property.suites ?? null,
      bathrooms: property.bathrooms ?? null,
      parkingSpaces: property.parkingSpaces ?? null,
      ownerName: owner?.name ?? null,
      ownerPhone: owner?.phone ?? null,
      thumbnailUrl: media[0]?.url ?? null
    };
  });

  return <PropertyListManager properties={propertyItems} />;
}
