import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Building2, Dumbbell, Heart, MapPin, ShieldCheck, Waves } from "lucide-react";
import { LakeVillageLeadForm } from "@/components/public/lake-village-lead-form";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Lake Village Residences | Beira-lago é seu novo endereço",
  description:
    "Cadastre-se para receber a apresentação, plantas, valores e condições do Lake Village Residences com atendimento personalizado de Pedro Soares.",
  alternates: { canonical: `${siteUrl}/lake-village` },
  openGraph: {
    title: "Lake Village Residences | Beira-lago é seu novo endereço",
    description: "Receba em primeira mão plantas, valores e condições do Lake Village Residences.",
    type: "website",
    url: `${siteUrl}/lake-village`,
    images: [{ url: `${siteUrl}/brand/lake-village-cover.png` }]
  }
};

const amenities = [
  { icon: Waves, title: "Praia e píer", text: "Morar perto da praia é ter um pôr do sol só seu, todos os dias." },
  { icon: Dumbbell, title: "Esporte e bem-estar", text: "Academia, beach tennis, yoga e espaços para viver no seu ritmo." },
  { icon: Heart, title: "Convivência", text: "Ambientes pensados para receber, celebrar e estar perto de quem importa." },
  { icon: ShieldCheck, title: "Segurança", text: "Segurança e conforto para a sua família em um ambiente reservado." },
  { icon: Building2, title: "Comodidade", text: "Mais praticidade para a rotina, com serviços e espaços a poucos passos de casa." },
  { icon: Waves, title: "Natureza", text: "Um projeto pensado para integrar arquitetura, paisagem e qualidade de vida." }
];

export default function LakeVillagePage() {
  const whatsappUrl = buildWhatsAppUrl("Olá, Pedro. Quero conhecer o Lake Village Residences.");

  return (
    <div className="lake-landing">
      <section className="lake-hero">
        <Image
          src="/brand/lake-village-cover.png"
          alt="Lake Village Residences à beira do lago"
          fill
          priority
          sizes="100vw"
          className="lake-hero-image"
        />
        <div className="lake-hero-overlay" />
        <div className="container lake-hero-content">
          <p className="lake-kicker">Pré-cadastro aberto</p>
          <h1>Beira-lago é seu novo endereço.</h1>
          <p className="lake-hero-lede">
            Cadastre-se para receber em primeira mão a apresentação, as plantas, os valores e as condições do Lake Village Residences.
          </p>
          <div className="lake-hero-actions">
            <a className="lake-button lake-button--gold" href="#cadastro">
              Quero conhecer <ArrowRight size={18} />
            </a>
            <a className="lake-button lake-button--outline" href={whatsappUrl} target="_blank" rel="noreferrer">
              Falar no WhatsApp
            </a>
          </div>
          <p className="lake-developer-line">Um produto Nova Bairros Planejados</p>
        </div>
        <a className="lake-scroll-cue" href="#experiencia" aria-label="Conheça o empreendimento">
          <span>Conheça o projeto</span>
          <ArrowDown size={18} />
        </a>
      </section>

      <section id="experiencia" className="lake-section lake-section--light">
        <div className="container lake-intro-grid">
          <div>
            <p className="lake-kicker lake-kicker--dark">Uma nova maneira de viver</p>
            <h2>O lugar onde a vida que você deseja já começa a acontecer.</h2>
            <p>
              O Lake Village é um condomínio fechado às margens do lago de Palmas, no Distrito de Luzimangues, a cinco minutos do Shopping Capim Dourado e ao lado do Five Senses Resort.
            </p>
            <p>
              Um projeto para quem valoriza segurança, exclusividade, conforto e a tranquilidade de estar perto da natureza.
            </p>
            <a className="lake-text-link" href="#cadastro">Receber apresentação completa <ArrowRight size={16} /></a>
          </div>
          <div className="lake-broker-card">
            <div className="lake-broker-photo">
              <Image src="/brand/pedro-portrait-3.png" alt="Pedro Soares, corretor de imóveis" fill sizes="(max-width: 800px) 100vw, 420px" />
            </div>
            <div className="lake-broker-copy">
              <p className="lake-kicker">Atendimento personalizado</p>
              <h3>Conheça o Lake Village comigo.</h3>
              <p>Eu vou apresentar as opções disponíveis e ajudar você a encontrar o melhor caminho para morar ou investir.</p>
              <span>Pedro Soares · CRECI 5861-TO</span>
            </div>
          </div>
        </div>
      </section>

      <section className="lake-section lake-section--deep">
        <div className="container">
          <div className="lake-section-heading">
            <p className="lake-kicker">A experiência Lake Village</p>
            <h2>Um condomínio onde desacelerar também faz parte da rotina.</h2>
            <p>Arquitetura, paisagem e qualidade de vida em um endereço pensado para um novo capítulo.</p>
          </div>
          <div className="lake-amenities-grid">
            {amenities.map(({ icon: Icon, title, text }) => (
              <article className="lake-amenity-card" key={title}>
                <Icon size={23} strokeWidth={1.5} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lake-section lake-location">
        <div className="lake-location-image">
          <Image src="/brand/pedro-portrait-2.png" alt="Experiência de chegada ao Lake Village" fill sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
        <div className="lake-location-copy">
          <p className="lake-kicker lake-kicker--dark"><MapPin size={15} /> Luzimangues · Palmas/TO</p>
          <h2>Um endereço que aproxima você do que importa.</h2>
          <p>Às margens do lago de Palmas, com acesso conveniente ao Shopping Capim Dourado e ao Five Senses Resort.</p>
          <Link className="lake-text-link" href="#cadastro">Quero saber mais sobre a localização <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section id="cadastro" className="lake-section lake-lead-section">
        <div className="container lake-lead-grid">
          <div className="lake-lead-copy">
            <p className="lake-kicker">Lista de interesse</p>
            <h2>Receba os detalhes antes de todo mundo.</h2>
            <p>Deixe seus dados e eu entrarei em contato para apresentar o empreendimento, as plantas e os valores disponíveis.</p>
            <div className="lake-lead-points">
              <span><ShieldCheck size={17} /> Atendimento direto com Pedro Soares</span>
              <span><Building2 size={17} /> Plantas e condições atualizadas</span>
              <span><Heart size={17} /> Orientação para morar ou investir</span>
            </div>
          </div>
          <LakeVillageLeadForm />
        </div>
      </section>

      <section className="lake-final-cta">
        <div className="container">
          <p className="lake-kicker">Lake Village Residences</p>
          <h2>O Lake Village abre as portas para o seu próximo capítulo.</h2>
          <a className="lake-button lake-button--gold" href="#cadastro">Entrar na lista de interesse <ArrowRight size={18} /></a>
        </div>
      </section>
    </div>
  );
}
