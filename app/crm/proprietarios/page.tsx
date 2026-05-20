import { listOwners } from "@/lib/data/crm";

export default async function CrmProprietariosPage() {
  const owners = await listOwners();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Proprietários</h1>
      <p className="section-subtitle">Base de proprietários para captação, documentação e relacionamento.</p>

      <div style={{ marginTop: 16 }} className="grid-3">
        {owners.map((owner) => (
          <article className="card" key={owner.id} style={{ padding: 14 }}>
            <h3 style={{ marginTop: 0 }}>{owner.name}</h3>
            <p style={{ margin: "6px 0", color: "var(--text-muted)" }}>{owner.phone}</p>
            <p style={{ margin: "6px 0", color: "var(--text-muted)" }}>
              {owner.city ?? "-"} • {owner.district ?? "-"}
            </p>
            <p className="badge">{owner.properties.length} imóvel(is)</p>
          </article>
        ))}
      </div>
    </>
  );
}
