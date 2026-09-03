import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, Building2, Clock3, Dumbbell, ExternalLink, Heart, MapPin, Route, ShieldCheck, Waves } from "lucide-react";
import { LakeVillageLeadForm } from "@/components/public/lake-village-lead-form";
import { LakeVillageAudio } from "@/components/public/lake-village-audio";
import { LakeVillageWhatsAppBubble } from "@/components/public/lake-village-whatsapp-bubble";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

const lakeVillageMapsUrl = "https://maps.app.goo.gl/ELa5XH6aoP4qwpRWA";
const capimDouradoRouteUrl = "https://www.google.com/maps/dir/Lake+Village+Residences,+Luzimangues,+Porto+Nacional+-+TO/Capim+Dourado+Shopping,+Palmas+-+TO";
const lakeVillageEmbedUrl = "https://www.google.com/maps?q=Lake+Village+Residences,+77.006,+046+-+Luzimangues,+Porto+Nacional+-+TO,+77500-000&t=k&output=embed";

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
    images: [{ url: `${siteUrl}/brand/lake-village-lake-view.png` }]
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
  return (
    <div className="lake-landing">
      <section className="lake-hero">
        <Image
          src="/brand/lake-village-lake-view.png"
          alt="Lake Village Residences à beira do lago"
          fill
          priority
          sizes="100vw"
          className="lake-hero-image"
        />
        <div className="lake-hero-overlay" />
        <LakeVillageAudio />
        <div className="container lake-hero-content">
          <Image
            className="lake-brand-lockup"
            src="/brand/lake-village-logo.png"
            alt="Lake Village Residences"
            width={460}
            height={230}
            priority
          />
          <p className="lake-kicker">Empreendimento · Lote em condomínio · Pré-cadastro aberto</p>
          <h1>Beira-lago é seu novo endereço.</h1>
          <p className="lake-hero-lede">
            Cadastre-se para receber em primeira mão a apresentação, as plantas, os valores e as condições do Lake Village Residences.
          </p>
          <div className="lake-hero-actions">
            <a className="lake-button lake-button--gold" href="#cadastro">
              Quero conhecer <ArrowRight size={18} />
            </a>
            <a className="lake-button lake-button--outline" href="#cadastro">
              Receber informações no WhatsApp
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

      <section id="localizacao" className="lake-section lake-location lake-location--map">
        <div className="lake-location-copy">
          <p className="lake-kicker lake-kicker--dark"><MapPin size={15} /> Luzimangues · Palmas/TO</p>
          <h2>À beira do lago, perto da cidade.</h2>
          <p>O Lake Village fica em Luzimangues, às margens do lago de Palmas, em uma localização que combina natureza, tranquilidade e acesso prático à capital.</p>
          <p>Do empreendimento ao Capim Dourado Shopping são aproximadamente 15,7 km, com trajeto estimado em 27 minutos de carro pela TO-080.</p>
          <div className="lake-location-facts" aria-label="Referências de acesso">
            <div>
              <Route size={19} />
              <strong>15,7 km</strong>
              <span>até o Capim Dourado Shopping</span>
            </div>
            <div>
              <Clock3 size={19} />
              <strong>27 min</strong>
              <span>de carro, como referência</span>
            </div>
          </div>
          <p className="lake-location-note">A distância e o tempo podem variar conforme o ponto de saída e as condições do trânsito.</p>
          <div className="lake-location-actions">
            <a className="lake-button lake-button--deep" href={lakeVillageMapsUrl} target="_blank" rel="noreferrer">
              Ver localização <ExternalLink size={16} />
            </a>
            <a className="lake-text-link" href={capimDouradoRouteUrl} target="_blank" rel="noreferrer">
              Ver rota até o shopping <ArrowRight size={16} />
            </a>
          </div>
        </div>
        <div className="lake-map-card">
          <iframe
            title="Mapa em visão de satélite da localização do Lake Village Residences"
            src={lakeVillageEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="lake-map-caption">
            <MapPin size={15} />
            <span>Lake Village Residences · 77.006, 046 · Luzimangues, Porto Nacional/TO</span>
          </div>
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
          <Image
            className="lake-final-logo"
            src="/brand/lake-village-logo.png"
            alt="Lake Village Residences"
            width={360}
            height={180}
          />
          <p className="lake-kicker">Lake Village Residences</p>
          <h2>O Lake Village abre as portas para o seu próximo capítulo.</h2>
          <a className="lake-button lake-button--gold" href="#cadastro">Entrar na lista de interesse <ArrowRight size={18} /></a>
        </div>
      </section>

      <LakeVillageWhatsAppBubble />
    </div>
  );
}
