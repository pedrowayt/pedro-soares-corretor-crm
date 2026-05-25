import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyEditor, type EditorMedia, type EditorProperty } from "@/components/crm/property-editor";
import { findCrmPropertyById } from "@/lib/data/crm-properties";
import { formatCurrencyBRL } from "@/lib/utils";

export default async function CrmImovelEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await findCrmPropertyById(id);

  if (!property) {
    notFound();
  }

  const media: EditorMedia[] = (property.media ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((item) => ({
      id: item.id,
      url: item.url,
      position: item.position,
      kind: String(item.kind)
    }));

  const editorProperty: EditorProperty = {
    id: property.id,
    title: property.title,
    slug: property.slug,
    type: property.type,
    purpose: property.purpose,
    status: property.status,
    price: Number(property.price),
    city: property.city,
    district: property.district,
    address: property.address ?? null,
    postalCode: property.postalCode ?? null,
    googleMapsUrl: property.googleMapsUrl ?? null,
    latitude: property.latitude ?? null,
    longitude: property.longitude ?? null,
    areaM2: property.areaM2 ?? null,
    bedrooms: property.bedrooms ?? null,
    suites: property.suites ?? null,
    bathrooms: property.bathrooms ?? null,
    parkingSpaces: property.parkingSpaces ?? null,
    description: property.description,
    features: property.features ?? [],
    legalNotes: property.legalNotes ?? null,
    internalNotes: property.internalNotes ?? null,
    commissionPct: property.commissionPct ?? null,
    marketAskingValue: property.marketAskingValue ?? null,
    marketEstimatedValue: property.marketEstimatedValue ?? null,
    marketOpportunity: property.marketOpportunity ?? null,
    marketComparableLinks: property.marketComparableLinks ?? [],
    marketLiquidityNotes: property.marketLiquidityNotes ?? null,
    isInvestorHighlight: property.isInvestorHighlight ?? false,
    isAuctionOpportunity: property.isAuctionOpportunity ?? false,
    media
  };

  return (
    <>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <Link href="/crm/imoveis" className="button button-ghost">← Voltar</Link>
        <Link href={`/imoveis/${property.slug}`} target="_blank" className="button button-ghost">
          Ver no site
        </Link>
      </div>

      <h1 className="section-title" style={{ marginTop: 0 }}>{property.title}</h1>
      <p className="section-subtitle" style={{ marginTop: 0 }}>
        {property.city} • {property.district} • {formatCurrencyBRL(Number(property.price))}
      </p>

      <div style={{ marginTop: 18 }}>
        <PropertyEditor property={editorProperty} />
      </div>
    </>
  );
}
