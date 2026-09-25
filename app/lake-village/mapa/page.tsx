import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, MapPinned, MessageCircle } from "lucide-react";
import { LakeVillageLeadForm } from "@/components/public/lake-village-lead-form";
import { LakeVillageLotMap } from "@/components/public/lake-village-lot-map";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Mapa do empreendimento | Lake Village Residences",
  description:
    "Consulte o mapa completo do Lake Village Residences, escolha a quadra ou o lote de seu interesse e reserve no dia do lançamento.",
  alternates: { canonical: `${siteUrl}/lake-village/mapa` },
  openGraph: {
    title: "Mapa do empreendimento | Lake Village Residences",
    description:
      "Veja todos os lotes do Lake Village Residences em alta qualidade e registre sua preferência para o lançamento.",
    type: "website",
    url: `${siteUrl}/lake-village/mapa`,
    images: [{ url: `${siteUrl}/brand/lake-village/atualizacao-2026-09/mapa-lotes-empreendimento.jpg` }]
  }
};

export default function LakeVillageMapPage() {
  return (
    <div className="lake-map-experience">
      <LandingPageTracker landingPageSlug="lake-village" />

      <header className="lake-map-experience-header">
        <div className="container lake-map-experience-header__inner">
          <Link href="/lake-village" className="lake-map-experience-brand" aria-label="Voltar para Lake Village Residences">
            <Image src="/brand/lake-village-logo.png" alt="Lake Village Residences" width={280} height={140} priority />
          </Link>
          <div className="lake-map-experience-header__actions">
            <Link href="/lake-village" className="lake-map-experience-back">Conhecer o empreendimento</Link>
            <a href="#cadastro" className="lake-button lake-button--gold">Escolher meu lote <ArrowRight size={16} /></a>
          </div>
        </div>
      </header>

      <main>
        <section className="lake-map-experience-hero">
          <Image
            src="/brand/lake-village/atualizacao-2026-09/foto-01-masterplan.jpg"
            alt="Vista aérea do masterplan do Lake Village Residences"
            fill
            priority
            sizes="100vw"
            className="lake-map-experience-hero__image"
          />
          <div className="lake-map-experience-hero__overlay" />
          <div className="container lake-map-experience-hero__content">
            <p className="lake-kicker">Lake Village Residences · Luzimangues/TO</p>
            <h1>Escolha o seu lote olhando o empreendimento inteiro.</h1>
            <p>
              Consulte a implantação completa, aproxime o mapa para ler quadras e lotes e registre sua preferência para receber atendimento no dia do lançamento.
            </p>
            <div className="lake-map-experience-hero__actions">
              <a href="#mapa-interativo" className="lake-button lake-button--gold">Abrir mapa de lotes <ArrowRight size={18} /></a>
              <a href="https://wa.me/5563984845101?text=Ol%C3%A1%2C%20Pedro.%20Quero%20escolher%20um%20lote%20no%20Lake%20Village%20Residences." target="_blank" rel="noreferrer" className="lake-button lake-button--outline"><MessageCircle size={17} /> Falar com Pedro</a>
            </div>
            <div className="lake-map-experience-stats" aria-label="Informações do empreendimento">
              <div><strong>1.353</strong><span>lotes</span></div>
              <div><strong>250–860 m²</strong><span>tamanhos indicados</span></div>
              <div><strong>4</strong><span>etapas</span></div>
            </div>
          </div>
        </section>

        <section id="mapa-interativo" className="lake-map-experience-map-section" aria-labelledby="lake-map-experience-map-title">
          <div className="container">
            <div className="lake-map-experience-section-heading">
              <div>
                <p className="lake-kicker lake-kicker--dark">Mapa do empreendimento</p>
                <h2 id="lake-map-experience-map-title">Veja todos os lotes com zoom e escolha sua referência.</h2>
              </div>
              <div>
                <p>O mapa original preserva os detalhes da implantação. Use o zoom do visualizador, navegue pelas áreas e anote a quadra e o lote que mais combinam com você.</p>
                <a className="lake-map-experience-pdf-link" href="/brand/lake-village/atualizacao-2026-09/mapa-lotes-empreendimento.pdf" target="_blank" rel="noreferrer">Abrir PDF completo <ExternalLink size={15} /></a>
              </div>
            </div>
            <LakeVillageLotMap />
          </div>
        </section>

        <section className="lake-map-experience-help" aria-label="Como escolher seu lote">
          <div className="container lake-map-experience-help__grid">
            <div>
              <p className="lake-kicker lake-kicker--dark"><MapPinned size={15} /> Como funciona</p>
              <h2>Escolha com calma. Eu confirmo os próximos passos.</h2>
            </div>
            <ol>
              <li><strong>01</strong><span>Abra o mapa e aproxime a região que chamou sua atenção.</span></li>
              <li><strong>02</strong><span>Anote a quadra e o número do lote de preferência.</span></li>
              <li><strong>03</strong><span>Envie seus dados para eu acompanhar sua escolha até o lançamento.</span></li>
            </ol>
          </div>
        </section>

        <section id="cadastro" className="lake-map-experience-form-section">
          <div className="container lake-map-experience-form-grid">
            <div className="lake-map-experience-form-copy">
              <p className="lake-kicker">Escolha seu lote</p>
              <h2>Registre a sua preferência para o dia do lançamento.</h2>
              <p>Preencha seus dados e, se já tiver escolhido, informe a quadra ou o lote. Os preços e as condições serão apresentados no lançamento.</p>
              <Link href="/lake-village" className="lake-lead-secondary-link">Voltar para a apresentação completa <ArrowRight size={15} /></Link>
            </div>
            <LakeVillageLeadForm variant="capture" />
          </div>
        </section>
      </main>
    </div>
  );
}
