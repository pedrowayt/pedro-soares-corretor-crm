import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { LakeVillageLeadForm } from "@/components/public/lake-village-lead-form";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Pré-cadastro Lake Village | Pedro Soares",
  description: "Faça seu pré-cadastro de interesse no Lake Village Residences e receba as informações disponíveis com atendimento de Pedro Soares.",
  alternates: { canonical: `${siteUrl}/lake-village/pre-cadastro` },
  openGraph: {
    title: "Pré-cadastro Lake Village | Pedro Soares",
    description: "Registre seu interesse no Lake Village Residences e receba atendimento individual.",
    type: "website",
    url: `${siteUrl}/lake-village/pre-cadastro`,
    images: [{ url: `${siteUrl}/brand/lake-village/aerea.jpg` }]
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
          <span>Lake Village Residences · Pré-cadastro</span>
        </div>
      </header>

      <main>
        <section className="lake-pre-cadastro-hero">
          <Image
            src="/brand/lake-village/aerea.jpg"
            alt="Vista do Lake Village Residences e da paisagem à beira do lago"
            fill
            priority
            sizes="100vw"
            className="lake-pre-cadastro-hero__image"
          />
          <div className="lake-pre-cadastro-hero__overlay" />
          <div className="container lake-pre-cadastro-hero__content">
            <p className="lake-personal-brand">Atendimento Pedro Soares · CRECI 5861-TO</p>
            <p className="lake-kicker">Pré-cadastro de interesse</p>
            <h1>Deixe seu perfil. Eu preparo o próximo passo.</h1>
            <p>Conte um pouco sobre o que você procura no Lake Village Residences. Assim, consigo enviar os materiais disponíveis e conduzir a conversa de forma mais objetiva.</p>
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
              <p>O pré-cadastro não é reserva nem proposta de compra. Ele me ajuda a entender seu momento para apresentar somente informações confirmadas e relevantes.</p>
              <Link href="/politica-de-privacidade" className="lake-text-link">Conhecer a política de privacidade</Link>
            </div>
            <LakeVillageLeadForm variant="capture" />
          </div>
        </section>
      </main>
    </div>
  );
}
