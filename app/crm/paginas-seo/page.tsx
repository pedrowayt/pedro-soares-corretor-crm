import { SeoPagesForms } from "@/components/crm/seo-pages-forms";
import { listCrmSeoLandingPages } from "@/lib/data/seo-landing-pages";

export default async function CrmPaginasSeoPage() {
  const pages = await listCrmSeoLandingPages();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>
        Páginas SEO
      </h1>
      <p className="section-subtitle">
        Gerencie páginas estratégicas por cidade, bairro e intenção de busca para fortalecer tráfego orgânico e geração de leads.
      </p>

      <div className="grid-3" style={{ marginTop: 16, marginBottom: 20 }}>
        {pages.map((page) => (
          <article className="card" key={page.id} style={{ padding: 14 }}>
            <p className="badge">{page.status}</p>
            <h3 className="title-luxury" style={{ marginBottom: 8 }}>
              {page.name}
            </h3>
            <p className="text-card" style={{ margin: "4px 0", color: "var(--text-muted)" }}>
              {page.path}
            </p>
            <p className="text-card" style={{ margin: "4px 0", color: "var(--text-muted)", fontSize: ".9rem" }}>
              Cidade: {page.city} {page.district ? `• Bairro: ${page.district}` : ""}
            </p>
            <p className="text-card" style={{ margin: "4px 0", color: "var(--text-muted)", fontSize: ".9rem" }}>
              Modo: {page.listingMode}
            </p>
          </article>
        ))}
      </div>

      <SeoPagesForms pages={pages} />
    </>
  );
}
