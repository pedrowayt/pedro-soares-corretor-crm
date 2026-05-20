import Image from "next/image";
import { PageHero } from "@/components/ui/page-hero";

export default function SobrePage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre Pedro Soares"
        title="Corretor com visão comercial e técnica"
        subtitle="Atuação com imóveis tradicionais, oportunidades para investidores e leilões imobiliários." 
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid-3">
          <article className="card" style={{ padding: 18, gridColumn: "span 2" }}>
            <h2 style={{ marginTop: 0 }}>História e especialidade</h2>
            <p className="section-subtitle">
              Pedro Soares atua em Palmas/TO com abordagem orientada a dados, velocidade de atendimento e segurança na tomada de decisão.
            </p>
            <p className="section-subtitle">
              CRECI: <strong>5861-TO</strong>
            </p>
            <p className="section-subtitle">
              Diferenciais: análise de liquidez por bairro, filtro de risco documental e acompanhamento por funil até fechamento.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <a className="button button-ghost" href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a className="button button-ghost" href="https://linkedin.com" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </article>
          <article className="card" style={{ padding: 0, overflow: "hidden" }}>
            <Image
              src="/brand/logo-light-bg.png"
              alt="Marca Pedro Soares"
              width={1365}
              height={768}
              style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 360 }}
            />
          </article>
        </div>
      </section>
    </>
  );
}
