import { PageHero } from "@/components/ui/page-hero";
import { listPublicProperties } from "@/lib/data/properties";
import { formatCurrencyBRL } from "@/lib/utils";

export default async function InvestidoresPage() {
  const opportunities = (await listPublicProperties()).filter(
    (property) => property.isInvestorHighlight || property.investorOpportunity
  );

  return (
    <>
      <PageHero
        eyebrow="Área de Investidores"
        title="Oportunidades com análise de margem e liquidez"
        subtitle="Aqui você enxerga valor de entrada, valor de mercado, ROI estimado e risco documental." 
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid-3">
          {opportunities.map((property) => {
            const investor = property.investorOpportunity;
            return (
              <article className="card" key={property.id} style={{ padding: 16 }}>
                <p className="badge">{property.district}</p>
                <h3>{property.title}</h3>
                <p style={{ margin: "6px 0", color: "var(--text-muted)" }}>
                  Entrada: {formatCurrencyBRL(investor?.entryValue ? Number(investor.entryValue) : property.priceValue)}
                </p>
                <p style={{ margin: "6px 0", color: "var(--text-muted)" }}>
                  Mercado: {formatCurrencyBRL(investor?.marketValue ? Number(investor.marketValue) : property.priceValue)}
                </p>
                <p style={{ margin: "6px 0", color: "var(--sophistication-gold-300)", fontWeight: 700 }}>
                  ROI estimado: {investor?.estimatedRoiPct ? `${investor.estimatedRoiPct.toString()}%` : "N/A"}
                </p>
                <p style={{ color: "var(--text-muted)" }}>
                  Risco jurídico/documental: {investor?.documentaryRisk ?? "Em análise"}
                </p>
                <a className="button button-primary" href={`/imoveis/${property.slug}`}>
                  Quero analisar esse imóvel
                </a>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
