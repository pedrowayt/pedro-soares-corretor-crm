import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { publicLandingPages } from "@/lib/data/landing-pages";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Lançamentos e empreendimentos em Palmas | Pedro Soares",
  description:
    "Conheça lançamentos, pré-cadastros e empreendimentos imobiliários em Palmas e região, com atendimento direto de Pedro Soares.",
  alternates: { canonical: `${baseUrl}/empreendimentos` },
  keywords: [
    "empreendimentos em Palmas",
    "lançamentos imobiliários em Palmas",
    "lotes em condomínio em Luzimangues",
    "condomínio à beira do lago"
  ]
};

export default function EmpreendimentosPage() {
  return (
    <main className="section listing-page">
      <div className="container">
        <nav className="listing-breadcrumb" aria-label="Você está em">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link href="/imoveis">Imóveis</Link>
          <span aria-hidden="true">/</span>
          <span>Empreendimentos</span>
        </nav>

        <div className="listing-page-head">
          <div>
            <p className="wp-hero-eyebrow">Morar · investir · escolher o próximo endereço</p>
            <h1 className="listing-page-title">Lançamentos e empreendimentos</h1>
            <p className="listing-page-subtitle">
              Explore projetos por tipo de produto e perfil de compra. Cada página foi preparada para você receber os detalhes diretamente.
            </p>
          </div>
          <Link href="/lancamentos" className="button button-ghost">
            Ver catálogo completo
          </Link>
        </div>

        <section aria-labelledby="empreendimentos-destaque">
          <div className="wp-section-head" style={{ marginBottom: 16 }}>
            <h2 id="empreendimentos-destaque" className="section-title">Em destaque</h2>
            <p className="section-subtitle text-card">Empreendimentos com atendimento e captação de interesse.</p>
          </div>

          <div className="wp-property-grid wp-property-grid-3">
            {publicLandingPages.map((landing) => (
              <article key={landing.slug} className="wp-property-card">
                <div className="wp-property-media" style={{ position: "relative", minHeight: 220 }}>
                  <Image src={landing.image} alt={landing.title} fill priority sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7, 13, 24, 0.05), rgba(7, 13, 24, 0.78))" }} />
                  <div style={{ position: "absolute", inset: "auto 16px 16px", color: "white" }}>
                    <span className="badge">{landing.status}</span>
                    <p style={{ margin: "10px 0 0", fontWeight: 700 }}>{landing.category}</p>
                  </div>
                </div>
                <div className="wp-property-body">
                  <p className="text-card" style={{ margin: 0, color: "var(--text-muted)" }}>{landing.location}</p>
                  <h2 style={{ margin: 0 }}>{landing.title}</h2>
                  <p className="section-subtitle text-card">{landing.summary}</p>
                  <Link href={landing.href} className="button button-primary" style={{ width: "100%" }}>
                    Conhecer empreendimento
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section wp-soft-section" style={{ marginTop: 32, padding: 24 }} aria-labelledby="como-encontrar">
          <h2 id="como-encontrar" className="section-title">Como você quer comprar?</h2>
          <p className="section-subtitle text-card">No catálogo, filtre por apartamento, casa, lote ou lote em condomínio.</p>
          <div className="wp-type-switches" style={{ marginTop: 16 }}>
            <Link href="/lancamentos?propertyType=APARTAMENTO" className="wp-type-chip">Apartamentos</Link>
            <Link href="/lancamentos?propertyType=CASA" className="wp-type-chip">Casas</Link>
            <Link href="/lancamentos?propertyType=LOTE_EM_CONDOMINIO" className="wp-type-chip">Lotes em condomínio</Link>
            <Link href="/lancamentos?propertyType=COMPLEXO" className="wp-type-chip">Complexos</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
