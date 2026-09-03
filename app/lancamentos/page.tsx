import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { publicLandingPages } from "@/lib/data/landing-pages";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Lançamentos em destaque | Pedro Soares",
  description:
    "Conheça as landing pages dos lançamentos imobiliários apresentados por Pedro Soares em Palmas e região.",
  alternates: { canonical: `${baseUrl}/lancamentos` }
};

export default function LancamentosPage() {
  return (
    <main className="section listing-page">
      <div className="container">
        <nav className="listing-breadcrumb" aria-label="Você está em">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <span>Lançamentos</span>
        </nav>

        <div className="listing-page-head">
          <div>
            <p className="wp-hero-eyebrow">Campanhas selecionadas</p>
            <h1 className="listing-page-title">Lançamentos em destaque</h1>
            <p className="listing-page-subtitle">
              Conheça cada campanha em sua página especial e fale diretamente com Pedro Soares.
            </p>
          </div>
        </div>

        {publicLandingPages.length ? (
          <div className="wp-property-grid wp-property-grid-3">
            {publicLandingPages.map((landing) => (
              <article key={landing.slug} className="wp-property-card">
                <div className="wp-property-media" style={{ position: "relative", minHeight: 220 }}>
                  <Image
                    src={landing.image}
                    alt={landing.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
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
                    Conhecer lançamento
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="crm-panel">
            <p className="crm-panel__empty">Nenhum lançamento em destaque no momento.</p>
          </section>
        )}
      </div>
    </main>
  );
}
