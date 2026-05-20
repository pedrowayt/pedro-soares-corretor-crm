import Link from "next/link";
import { DevelopmentForms } from "@/components/crm/development-forms";
import { listCrmDevelopments } from "@/lib/data/developments";
import { formatCurrencyBRL } from "@/lib/utils";

export default async function CrmEmpreendimentosPage() {
  const developments = await listCrmDevelopments();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Empreendimentos</h1>
      <p className="section-subtitle">
        Cadastro e publicação de lançamentos com controle editorial, tipologias, mídia e cronograma de obra.
      </p>

      <div className="grid-3" style={{ marginTop: 16, marginBottom: 20 }}>
        {developments.map((development) => (
          <article className="card" key={development.id} style={{ padding: 14 }}>
            <p className="badge">{development.status}</p>
            <h3 className="title-luxury" style={{ marginBottom: 8 }}>{development.title}</h3>
            <p className="text-card" style={{ margin: "4px 0", color: "var(--text-muted)" }}>
              {development.city} • {development.district}
            </p>
            <p style={{ margin: "4px 0", color: "var(--sophistication-gold-300)", fontWeight: 700 }}>
              A partir de {development.startingPriceNumber ? formatCurrencyBRL(development.startingPriceNumber) : "sob consulta"}
            </p>
            <p className="text-card" style={{ margin: "4px 0", color: "var(--text-muted)", fontSize: ".9rem" }}>
              Tipologias: {development.unitTypes.length} • Mídias: {development.media.length}
            </p>
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link className="button button-ghost" href={`/lancamentos/${development.slug}`} target="_blank">
                Preview público
              </Link>
            </div>
          </article>
        ))}
      </div>

      <DevelopmentForms
        developments={developments.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          status: item.status
        }))}
      />
    </>
  );
}
