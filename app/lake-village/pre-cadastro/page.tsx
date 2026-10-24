import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { LakeVillageLeadForm } from "@/components/public/lake-village-lead-form";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Lake Village Residences | Lotes à venda | Pedro Soares",
  description: "Informe seu interesse no Lake Village Residences e consulte lotes disponíveis, preços e condições com Pedro Soares.",
  alternates: { canonical: `${siteUrl}/lake-village/pre-cadastro` },
  openGraph: {
    title: "Lake Village Residences | Lotes à venda | Pedro Soares",
    description: "Consulte a disponibilidade e as condições atuais dos lotes do Lake Village Residences.",
    type: "website",
    url: `${siteUrl}/lake-village/pre-cadastro`,
    images: [{ url: `${siteUrl}/brand/lake-village/atualizacao-2026-09/foto-01-masterplan.jpg` }]
  }
};

export default function LakeVillagePreCadastroPage() {
  return (
    <div className="lake-landing lake-pre-cadastro-page">
      <LandingPageTracker landingPageSlug="lake-village" />
      <header className="lake-pre-cadastro-header">
        <div className="container lake-pre-cadastro-header__inner">
          <Link href="/lake-village" className="lake-pre-cadastro-back">
            <ArrowLeft size={16} aria-hidden="true" /> Voltar para a apresentação
          </Link>
          <span>Lake Village Residences · Lotes à venda</span>
        </div>
      </header>

      <main>
        <section className="lake-pre-cadastro-hero">
          <Image
            src="/brand/lake-village/atualizacao-2026-09/foto-01-masterplan.jpg"
            alt="Vista aérea do masterplan do Lake Village Residences ao pôr do sol"
            fill
            priority
            sizes="100vw"
            className="lake-pre-cadastro-hero__image"
          />
          <div className="lake-pre-cadastro-hero__overlay" />
          <div className="container lake-pre-cadastro-hero__content">
            <p className="lake-personal-brand">Atendimento Pedro Soares · CRECI 5861-TO</p>
            <p className="lake-kicker">Lotes à venda · Cadastro de interesse</p>
            <h1>Consulte seu lote no Lake Village.</h1>
            <p>Conte um pouco sobre o que você procura no Lake Village Residences. Eu consulto os lotes disponíveis na Etapa 1 e apresento as condições que correspondem ao seu interesse.</p>
            <div className="lake-pre-cadastro-points">
              <span><CheckCircle2 size={17} aria-hidden="true" /> Atendimento individual</span>
              <span><ShieldCheck size={17} aria-hidden="true" /> Seus dados tratados com cuidado</span>
              <span><MessageCircle size={17} aria-hidden="true" /> Retorno pelo canal que você escolher</span>
            </div>
          </div>
        </section>

        <section className="lake-pre-cadastro-form-section">
          <div className="container lake-pre-cadastro-form-grid">
            <div className="lake-pre-cadastro-form-copy">
              <p className="lake-kicker lake-kicker--dark">Cadastro de interesse</p>
              <h2>Vamos começar pela sua realidade.</h2>
              <p>Este cadastro não é reserva nem proposta de compra. Ele registra seu interesse para que eu consulte a disponibilidade e apresente os preços e as condições atuais. A escolha do lote depende de confirmação no atendimento.</p>
              <Link href="/politica-de-privacidade" className="lake-text-link">Conhecer a política de privacidade</Link>
            </div>
            <LakeVillageLeadForm variant="capture" />
          </div>
        </section>
      </main>
    </div>
  );
}
