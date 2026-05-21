import { BuilderForms } from "@/components/crm/builder-forms";
import { listCrmBuilders } from "@/lib/data/developments";

export default async function CrmConstrutorasPage() {
  const builders = await listCrmBuilders({ includeArchived: true });

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>
        Construtoras
      </h1>
      <p className="section-subtitle">
        Cadastre, edite e vincule construtoras aos empreendimentos para exibição pública e organização comercial.
      </p>

      <div style={{ marginTop: 18 }}>
        <BuilderForms
          builders={builders.map((item) => ({
            ...item,
            archivedAt: item.archivedAt ?? null
          }))}
        />
      </div>
    </>
  );
}
