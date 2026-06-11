import { OwnerManager, type OwnerListItem } from "@/components/crm/owner-manager";
import { listOwners } from "@/lib/data/crm";

export default async function CrmProprietariosPage() {
  const owners = await listOwners();
  const ownerItems: OwnerListItem[] = owners.map((owner) => ({
    id: owner.id,
    name: owner.name,
    phone: owner.phone,
    email: owner.email,
    city: owner.city,
    district: owner.district,
    address: owner.address,
    notes: owner.notes,
    createdAt: owner.createdAt.toISOString(),
    updatedAt: owner.updatedAt.toISOString(),
    leadsCount: owner.leads.length,
    properties: owner.properties.map((property) => ({
      id: property.id,
      title: property.title,
      slug: property.slug,
      purpose: String(property.purpose),
      status: String(property.status),
      price: Number(property.price),
      city: property.city,
      district: property.district,
      updatedAt: property.updatedAt.toISOString()
    }))
  }));

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Proprietários</h1>
      <p className="section-subtitle">
        Base de proprietários para captação, documentação, relacionamento e vínculo com imóveis.
      </p>

      <OwnerManager owners={ownerItems} />
    </>
  );
}
