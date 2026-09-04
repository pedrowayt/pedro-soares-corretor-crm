import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, Check, ExternalLink, MapPin, MessageCircle, Play, Sparkles } from "lucide-react";
import { TerracoUrbanLeadForm } from "@/components/public/terraco-urban-lead-form";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";
import "./terraco.module.css";

const siteUrl = getSiteUrl();
const heroImage = "/terraco-urban/comercial-2.png";
const videoConceptUrl = "https://drive.google.com/file/d/1hg_UyFj-VZIu9gTKqw-v0lXBudnb61wK/view";
const videoConceptEmbedUrl = "https://drive.google.com/file/d/1hg_UyFj-VZIu9gTKqw-v0lXBudnb61wK/preview";
const videoFloorsUrl = "https://drive.google.com/file/d/1tQWrrv9xQsPqx_Qzl9En821iWO0pKP06/view";
const videoFloorsEmbedUrl = "https://drive.google.com/file/d/1tQWrrv9xQsPqx_Qzl9En821iWO0pKP06/preview";
const presentationUrl = "https://drive.google.com/file/d/13TqY_gppgf6H7dzOKqBcyl4e_gJEeEmo/view";
const plantsUrl = "https://drive.google.com/file/d/11s_2WScQdqMNy1-xx3BnMFKL8pz3Yf8k/view";
const mapsUrl = "https://www.google.com/maps/search/Orla+14+Quadra+34+Palmas+TO";
const whatsappUrl = buildWhatsAppUrl("Olá, Pedro. Quero conhecer o Terraço Urban e receber a apresentação.");

export const metadata: Metadata = {
  title: "Terraço Urban | Pronto para morar na Orla de Palmas",
  description: "Conheça o Terraço Urban: apartamentos de 3 quartos e 3 ou 4 suítes, lazer resort e vista para o Lago de Palmas, na Orla 14.",
  alternates: { canonical: `${siteUrl}/terraco-urban` },
  openGraph: { type: "website", locale: "pt_BR", url: `${siteUrl}/terraco-urban`, title: "Terraço Urban | Pronto para sonhar alto e morar hoje", description: "Um particular de frente para o cartão-postal de Palmas, pronto para morar na Orla 14.", images: [{ url: `${siteUrl}${heroImage}` }] }
};

const gallery = [
  { src: "/terraco-urban/comercial-1.png", label: "Lazer", title: "Piscina com vista para o Lago", text: "Um resort particular para viver Palmas com mais leveza." },
  { src: "/terraco-urban/comercial-2.png", label: "Arquitetura", title: "Um marco na Orla 14", text: "Linhas contemporâneas e presença urbana." },
  { src: "/terraco-urban/comercial-3.png", label: "Pronto", title: "Pronto para morar", text: "Seu próximo capítulo já tem endereço." }
];

const amenities = [
  "Piscina com borda infinita, deck molhado e raia de 25 m",
  "Piscina infantil, bangalôs e deck seco",
  "Academia, quadra de esportes e pista de corrida",
  "Brinquedoteca, playground e salão de jogos",
  "Espaços gourmet, churrasqueiras e redário",
  "Pet place, coworking e bike share",
  "Rooftop com dois espaços gourmet integráveis",
  "Vaga para carro elétrico, guarda-volumes e ferramentas compartilhadas"
];

const locationFacts = [["1 km", "do maior shopping de Palmas"], ["Orla 14", "o cartão-postal da cidade"], ["2.200 m²", "de área de lazer"], ["366 m²", "de rooftop para celebrar"]];
const plans = [
  { area: "94,30 m²", title: "3 quartos com suíte", text: "Sala integrada, terraço e ambientes pensados para a rotina." },
  { area: "113,51 m²", title: "3 suítes plenas", text: "Mais privacidade, grandes esquadrias e vista para a natureza." },
  { area: "149,29 m²", title: "4 quartos", text: "Sala estendida e espaços generosos para viver e receber." }
];

function DriveVideo({ title, src, fallback }: { title: string; src: string; fallback: string }) {
  return <div className="terraco-video-frame"><iframe title={title} src={src} loading="lazy" allow="autoplay; encrypted-media; fullscreen" allowFullScreen /><a className="terraco-video-fallback" href={fallback} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Abrir vídeo</a></div>;
}

export default function TerracoUrbanPage() {
  return (
    <main className="terraco-landing">
      <LandingPageTracker landingPageSlug="terraco-urban" />
      <section className="terraco-hero" id="inicio">
        <div className="terraco-hero-panel">
          <header className="terraco-nav terraco-container"><a href="#inicio" className="terraco-wordmark" aria-label="Terraço Urban"><span>Terraço</span><small>urban</small></a><nav aria-label="Navegação principal"><a href="#projeto">O projeto</a><a href="#lazer">Lazer</a><a href="#plantas">Plantas</a><a href="#atendimento">Atendimento</a></nav><a className="terraco-button terraco-button--outline terraco-nav-cta" href="#atendimento">Falar com Pedro <ArrowRight size={15} /></a></header>
          <div className="terraco-hero-copy terraco-container"><p className="terraco-eyebrow"><span /> Orla 14 · Palmas, Tocantins</p><p className="terraco-overline">PRONTO PARA SONHAR ALTO E MORAR HOJE</p><h1>Um particular de frente para o Lago.</h1><p className="terraco-hero-lede">Apartamentos amplos, lazer resort e a experiência de viver na melhor quadra da Orla de Palmas.</p><div className="terraco-hero-actions"><a className="terraco-button terraco-button--coral" href="#atendimento">Quero conhecer <ArrowRight size={17} /></a><a className="terraco-text-link terraco-text-link--light" href="#videos"><Play size={15} fill="currentColor" /> Assistir aos vídeos</a></div></div>
          <a className="terraco-scroll-cue" href="#projeto"><span>Descubra o projeto</span><ArrowDown size={17} /></a>
        </div>
        <div className="terraco-hero-image-wrap"><Image src={heroImage} alt="Fachada do Terraço Urban na Orla de Palmas" fill priority sizes="(max-width: 820px) 100vw, 50vw" className="terraco-hero-image" /><span className="terraco-hero-badge">Terraço<br /><small>urban</small></span></div>
      </section>

      <section className="terraco-stat-strip" aria-label="Resumo do empreendimento"><div className="terraco-container terraco-stat-grid">{[["Pronto", "para morar"], ["2.200 m²", "de lazer resort"], ["Orla 14", "Palmas / TO"], ["3 opções", "de plantas"]].map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

      <section id="projeto" className="terraco-section terraco-section--paper"><div className="terraco-container terraco-story-grid"><div className="terraco-story-copy"><p className="terraco-kicker">O projeto</p><h2>Integração, amplitude e a paisagem do Lago.</h2><p>O Terraço Urban traz uma planta que privilegia a integração de espaços, com grandes esquadrias que conectam a sala da sua casa à vista e terraços que ampliam a sensação de liberdade.</p><p>Na Orla 14, você tem a natureza como cenário e a praticidade de estar perto do shopping, de restaurantes, da pista de cooper e do deck para o Lago.</p><div className="terraco-story-points"><span><Check size={15} /> Pronto para morar</span><span><Check size={15} /> Endereço consolidado na Orla</span><span><Check size={15} /> Padrão de acabamento Urban</span></div><a className="terraco-text-link terraco-text-link--dark" href={presentationUrl} target="_blank" rel="noreferrer">Ver apresentação completa <ExternalLink size={15} /></a></div><div className="terraco-story-image"><Image src="/terraco-urban/comercial-1.png" alt="Piscina do Terraço Urban com vista para o Lago" fill sizes="(max-width: 820px) 100vw, 48vw" /><span><Sparkles size={15} /> Vista para o Lago de Palmas</span></div></div></section>

      <section className="terraco-location"><div className="terraco-container"><div className="terraco-section-heading terraco-section-heading--light"><p className="terraco-kicker">Um endereço que transforma a rotina</p><h2>O melhor da Orla está na sua porta.</h2><p>Orla 14, Quadra 34, Lote 02-A, Avenida Orla · Palmas/TO.</p></div><div className="terraco-location-facts">{locationFacts.map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div><div className="terraco-location-bottom"><span><MapPin size={17} /> Orla 14 · Palmas, Tocantins</span><a href={mapsUrl} target="_blank" rel="noreferrer">Abrir no mapa <ExternalLink size={14} /></a></div></div></section>

      <section id="videos" className="terraco-video-section"><div className="terraco-container"><div className="terraco-section-heading"><p className="terraco-kicker">Veja o Terraço Urban</p><h2>O projeto em movimento.</h2><p>Assista aos dois vídeos do empreendimento e sinta a arquitetura, a vista e os ambientes antes de marcar sua visita.</p></div><div className="terraco-videos-grid"><article><DriveVideo title="Vídeo conceito do Terraço Urban" src={videoConceptEmbedUrl} fallback={videoConceptUrl} /><div className="terraco-video-caption"><span>Vídeo conceito</span><strong>Um novo jeito de morar na Orla.</strong></div></article><article><DriveVideo title="Vídeo dos andares do Terraço Urban" src={videoFloorsEmbedUrl} fallback={videoFloorsUrl} /><div className="terraco-video-caption"><span>Vídeo dos andares</span><strong>Conheça as possibilidades do seu apartamento.</strong></div></article></div></div></section>

      <section id="lazer" className="terraco-section terraco-section--blue"><div className="terraco-container"><div className="terraco-section-heading"><p className="terraco-kicker">Uma área de lazer resort</p><h2>2.200 m² para viver melhor.</h2><p>Do primeiro mergulho ao encontro no rooftop, cada ambiente foi desenhado para o seu estilo de vida.</p></div><div className="terraco-amenities-grid">{amenities.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div></div></section>

      <section className="terraco-gallery-section"><div className="terraco-container terraco-gallery-heading"><div><p className="terraco-kicker">Por dentro da experiência</p><h2>Pronto para se apaixonar.</h2></div><p>Imagens do empreendimento · informações sujeitas à confirmação comercial</p></div><div className="terraco-container terraco-gallery-grid">{gallery.map((item) => <figure key={item.src}><div><Image src={item.src} alt={item.title} fill sizes="(max-width: 700px) 100vw, 33vw" /></div><figcaption><span>{item.label}</span><strong>{item.title}</strong><small>{item.text}</small></figcaption></figure>)}</div></section>

      <section id="plantas" className="terraco-section terraco-section--sand"><div className="terraco-container"><div className="terraco-section-heading terraco-section-heading--dark"><p className="terraco-kicker">Plantas do projeto</p><h2>O seu espaço, do seu jeito.</h2><p>Três formatos para diferentes momentos: todos com integração, terraço e a qualidade de entrega Urban.</p></div><div className="terraco-plans-grid">{plans.map((plan) => <article key={plan.area}><span>{plan.area}</span><h3>{plan.title}</h3><p>{plan.text}</p><a className="terraco-text-link terraco-text-link--dark" href={plantsUrl} target="_blank" rel="noreferrer">Ver caderno de plantas <ExternalLink size={14} /></a></article>)}</div></div></section>

      <section id="atendimento" className="terraco-contact"><div className="terraco-container terraco-contact-grid"><div className="terraco-contact-copy"><p className="terraco-kicker">Próximo passo</p><h2>Seu lugar na Orla pode começar agora.</h2><p>Deixe seus dados para receber a apresentação completa, as plantas e as condições disponíveis do Terraço Urban.</p><div className="terraco-contact-broker"><span className="terraco-contact-broker-photo"><Image src="/yacht/corretor.png" alt="Pedro Soares, corretor de imóveis" fill sizes="65px" /></span><div><strong>Pedro Soares</strong><small>Corretor de imóveis · CRECI 5861-TO</small><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Falar no WhatsApp</a></div></div></div><TerracoUrbanLeadForm /></div></section>

      <footer className="terraco-footer"><div className="terraco-container terraco-footer-grid"><div className="terraco-wordmark"><span>Terraço</span><small>urban</small></div><div><p>Terraço Urban · Orla 14 · Palmas/TO</p><small>Material de uso exclusivo para treinamento de corretores. Imagens, informações, valores e condições devem ser confirmados na apresentação comercial vigente. RI-1.482.</small></div></div></footer>
      <a className="terraco-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar sobre o Terraço Urban pelo WhatsApp"><MessageCircle size={19} /><span>Quero conhecer</span></a>
    </main>
  );
}
