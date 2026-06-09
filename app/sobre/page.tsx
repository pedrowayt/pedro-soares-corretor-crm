import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Sobre Pedro Soares | Corretor de Imóveis em Palmas TO",
  description:
    "Conheça Pedro Soares, corretor de imóveis em Palmas TO com atuação em imóveis residenciais, investimentos e leilões imobiliários.",
  alternates: {
    canonical: `${baseUrl}/sobre`
  },
  openGraph: {
    type: "profile",
    locale: "pt_BR",
    url: `${baseUrl}/sobre`,
    title: "Sobre Pedro Soares | Corretor de Imóveis em Palmas TO",
    description:
      "Atuação consultiva em compra, venda, investimentos e leilões imobiliários em Palmas TO."
  }
};

const INSTAGRAM_URL =
  "https://www.instagram.com/pedrosoarespmw?igsh=MXQ3ZTA2YW13ZjZmNQ%3D%3D&utm_source=qr";

const SPECIALTIES = [
  {
    title: "Análise documental",
    description:
      "Verificação completa de matrícula, ônus, certidões e regularidade do imóvel antes de qualquer negociação."
  },
  {
    title: "Análise jurídica do imóvel",
    description:
      "Leitura técnica de processos, penhoras, partilhas e inventários para reduzir risco e dar segurança ao comprador."
  },
  {
    title: "Especialista em leilões imobiliários",
    description:
      "Curadoria de oportunidades, leitura do edital, cálculo de margem e suporte completo do lance à imissão na posse."
  },
  {
    title: "Segurança total na transação",
    description:
      "Acompanhamento ponta a ponta — proposta, contrato, escritura e registro — com transparência em cada etapa."
  }
];

export default function SobrePage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre Pedro Soares"
        title="Corretor com visão comercial e técnica"
        subtitle="Atuação com imóveis tradicionais, oportunidades para investidores e leilões imobiliários."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container about-grid">
          <article className="card about-photo-card">
            <Image
              src="/brand/pedro-portrait-5.png"
              alt="Foto de Pedro Soares, corretor de imóveis CRECI 5861-TO"
              width={720}
              height={900}
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, 360px"
            />
            <div className="about-photo-meta">
              <strong>Pedro Soares</strong>
              <span>Corretor de Imóveis</span>
              <span>CRECI 5861-TO</span>
            </div>
          </article>

          <article className="card about-intro-card">
            <h2 style={{ marginTop: 0 }}>Quem é Pedro Soares</h2>
            <p className="section-subtitle">
              Atuo em Palmas/TO com uma abordagem orientada a dados, velocidade de atendimento e — acima de tudo —
              segurança na tomada de decisão. Cada imóvel passa por uma triagem técnica antes de chegar ao cliente:
              entendo o documento, leio o risco e só então apresento a oportunidade.
            </p>
            <p className="section-subtitle">
              Especialista em leilões imobiliários, oportunidades para investidores e imóveis residenciais
              prontos, atendo de quem está comprando o primeiro imóvel a quem busca margem em um portfólio.
            </p>
            <div className="about-actions">
              <a
                className="button button-primary"
                href="https://wa.me/5563984845101?text=Ol%C3%A1%2C%20Pedro!%20Quero%20falar%20com%20voc%C3%AA."
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar no WhatsApp
              </a>
              <a
                className="button button-ghost property-instagram-button"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir Instagram de Pedro Soares"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                Instagram
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section wp-soft-section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="wp-section-head">
            <h2 className="section-title">Especialidades</h2>
            <p className="section-subtitle text-card">
              Quatro pilares que estruturam cada negociação e dão tranquilidade pro comprador.
            </p>
          </div>

          <div className="about-specialties-grid">
            {SPECIALTIES.map((item) => (
              <article key={item.title} className="card about-specialty-card">
                <div className="about-specialty-icon" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
