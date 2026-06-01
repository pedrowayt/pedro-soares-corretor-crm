import { listOwners } from "@/lib/data/crm";

export default async function CrmProprietariosPage() {
  const owners = await listOwners();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Proprietários</h1>
      <p className="section-subtitle">Base de proprietários para captação, documentação e relacionamento.</p>

      <ul className="crm-summary-grid" aria-label="Proprietários">
        {owners.map((owner) => {
          const count = owner.properties.length;
          return (
            <li className="crm-summary-card" key={owner.id}>
              <header className="crm-summary-card__head">
                <strong className="crm-summary-card__title">{owner.name}</strong>
                <span className="crm-summary-card__pill">
                  {count} {count === 1 ? "imóvel" : "imóveis"}
                </span>
              </header>
              <dl className="crm-summary-card__fields">
                <div>
                  <dt>Contato</dt>
                  <dd>{owner.phone}</dd>
                </div>
                <div>
                  <dt>Região</dt>
                  <dd>
                    {owner.city ?? "-"}
                    {owner.district ? ` · ${owner.district}` : ""}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </>
  );
}
