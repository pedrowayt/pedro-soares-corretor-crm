import Link from "next/link";
import { PropertyForms } from "@/components/crm/property-forms";
import { listCrmProperties } from "@/lib/data/crm-properties";
import { formatCurrencyBRL } from "@/lib/utils";

export default async function CrmImoveisPage() {
  const properties = await listCrmProperties();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Imóveis</h1>
      <p className="section-subtitle">Gestão de carteira, status comercial e avaliação mercadológica simplificada.</p>

      <div style={{ marginTop: 16, marginBottom: 20 }} className="grid-3">
        {properties.map((property) => (
          <article className="card" key={property.id} style={{ padding: 14 }}>
            <p className="badge">{property.status}</p>
            <h3>{property.title}</h3>
            <p style={{ margin: "6px 0", color: "var(--sophistication-gold-300)", fontWeight: 700 }}>
              {formatCurrencyBRL(Number(property.price))}
            </p>
            <p style={{ margin: "6px 0", color: "var(--text-muted)" }}>
              {property.city} • {property.district}
            </p>
            <p style={{ margin: "6px 0", color: "var(--text-muted)", fontSize: "var(--fs-14)" }}>
              Proprietário: {(property.owner as { name?: string } | null | undefined)?.name ?? "Não vinculado"}
            </p>
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="button button-ghost" href={`/imoveis/${property.slug}`} target="_blank">
                Ver no site
              </Link>
            </div>
          </article>
        ))}
      </div>

      <PropertyForms
        properties={properties.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          type: item.type,
          purpose: item.purpose,
          status: item.status,
          city: item.city,
          district: item.district,
          price: Number(item.price),
          address: item.address ?? null,
          googleMapsUrl: item.googleMapsUrl ?? null
        }))}
      />
    </>
  );
}
