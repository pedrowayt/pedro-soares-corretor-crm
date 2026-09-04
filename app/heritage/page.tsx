import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, Building2, Compass, ExternalLink, Layers3, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { HeritageLeadForm } from "@/components/public/heritage-lead-form";
import { HeritageGallery } from "@/components/public/heritage-gallery";
import { HeritageEffects } from "@/components/public/heritage-effects";
import { HeritageNav } from "@/components/public/heritage-nav";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/heritage`;
const whatsappUrl = buildWhatsAppUrl("Olá, Pedro. Quero conhecer o Heritage Fama e receber a apresentação.");
const projectVideoPreviewUrl = "https://drive.google.com/file/d/17cYcdWOwya172Dsn9Y0PwGJb3YwEMwBS/preview";
const projectVideoDriveUrl = "https://drive.google.com/file/d/17cYcdWOwya172Dsn9Y0PwGJb3YwEMwBS/view?usp=drivesdk";

export const metadata: Metadata = {
  title: "Heritage Fama | Um legado à beira da Orla de Palmas",
  description: "Conheça o Heritage Fama, um marco residencial na orla de Palmas criado para unir qualidade, sofisticação e visão de futuro.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: pageUrl,
    title: "Heritage Fama | Um legado projetado para transformar",
    description: "Qualidade, sofisticação e propósito na orla de Palmas.",
    images: [{ url: `${siteUrl}/heritage/hero-project.png` }]
  }
};

const principles = [
  { icon: Building2, title: "Marco urbano", text: "Um projeto pensado para transformar a paisagem e elevar a experiência de viver na orla." },
  { icon: ShieldCheck, title: "Excelência comprovada", text: "Rigor, precisão e performance incorporados em cada etapa do projeto." },
  { icon: Sparkles, title: "Nobreza contemporânea", text: "Tradição e inovação reunidas em uma arquitetura feita para permanecer." },
  { icon: Layers3, title: "Visão de futuro", text: "Um valor que vai além do que se vê: aquilo que se constrói e se transmite." }
];

export default function HeritagePage() {
  return (
    <main className="heritage-landing">
      <HeritageEffects />
      <LandingPageTracker landingPageSlug="heritage-fama" />

      <section className="heritage-hero" id="inicio">
        <Image src="/heritage/hero-project.png" alt="Fachada do Heritage Fama" fill priority sizes="100vw" className="heritage-hero-image" />
        <div className="heritage-hero-overlay" />
        <HeritageNav />
        <div className="heritage-hero-content heritage-container">
          <div className="heritage-hero-copy" data-heritage-reveal>
            <p className="heritage-eyebrow"><span /> Orla de Palmas · Tocantins</p>
            <p className="heritage-overline">UM LEGADO PROJETADO PARA TRANSFORMAR</p>
            <h1>O futuro merece uma herança.</h1>
            <p className="heritage-hero-lede">Um marco residencial que nasce para permanecer: qualidade, sofisticação e propósito em cada detalhe.</p>
            <div className="heritage-hero-actions"><a href="#atendimento" className="heritage-button heritage-button--light">Quero conhecer <ArrowRight size={17} /></a><a href="#conceito" className="heritage-text-link">Descobrir o conceito <ArrowDown size={15} /></a></div>
          </div>
          <div className="heritage-hero-signature"><span>HERITAGE</span><small>FAMA · PORSCHE CONSULTING</small></div>
        </div>
        <span className="heritage-visual-note">Perspectiva ilustrativa do Heritage Fama</span>
      </section>

      <section className="heritage-intro-strip"><div className="heritage-container heritage-intro-grid" data-heritage-reveal><p>Qualidade que atravessa o tempo.</p><p>Um novo patamar de excelência e valorização para a orla de Palmas.</p><a href="#atendimento">Conheça o projeto <ArrowRight size={16} /></a></div></section>

      <section id="conceito" className="heritage-section heritage-section--paper"><div className="heritage-container heritage-story-grid"><div className="heritage-story-copy" data-heritage-reveal><p className="heritage-kicker">O conceito Heritage</p><h2>Mais do que um empreendimento. A materialização de um legado.</h2><p>Heritage nasce de um compromisso com aquilo que merece ser preservado, elevado e transmitido às próximas gerações.</p><p>Implantado na orla de Palmas, o projeto se ancora no que é perene e transforma não apenas a paisagem, mas a experiência de viver.</p><a className="heritage-text-link heritage-text-link--dark" href="#excelencia">Ver os princípios do projeto <ArrowRight size={16} /></a></div><div className="heritage-story-art heritage-story-art--photo" data-heritage-reveal><Image src="/heritage/hero-project.png" alt="Perspectiva da fachada do Heritage Fama" fill sizes="(max-width: 900px) 88vw, 52vw" className="heritage-story-image" /><div className="heritage-story-art-overlay" /><span>Fachada Heritage Fama · um legado que permanece</span></div></div></section>

      <section id="excelencia" className="heritage-section heritage-section--dark"><div className="heritage-container"><div className="heritage-section-heading" data-heritage-reveal><p className="heritage-kicker">O padrão por trás do projeto</p><h2>Luxo não é apenas percebido. É comprovado.</h2><p>A parceria com a Porsche Consulting traz ao mercado imobiliário a precisão, a eficiência e o alto padrão reconhecidos mundialmente.</p></div><div className="heritage-principles">{principles.map(({ icon: Icon, title, text }, index) => <article key={title} className="heritage-principle" data-heritage-reveal style={{ "--heritage-delay": `${index * 90}ms` } as React.CSSProperties}><Icon size={23} strokeWidth={1.35} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="heritage-gallery" data-heritage-reveal><div className="heritage-container"><div className="heritage-gallery-heading"><p className="heritage-kicker">Por dentro do Heritage</p><h2>Ambientes pensados para elevar o cotidiano.</h2><p>Arquitetura, bem-estar e cuidado aparecem nos espaços que fazem parte da experiência Heritage.</p></div><HeritageGallery /></div></section>

      <section id="video" className="heritage-video-section" data-heritage-reveal><div className="heritage-container heritage-video-grid"><div className="heritage-video-frame"><iframe title="Vídeo do Heritage Fama" src={projectVideoPreviewUrl} allow="autoplay; encrypted-media; fullscreen" allowFullScreen /><span className="heritage-video-badge">Vídeo do projeto</span></div><div className="heritage-video-copy"><p className="heritage-kicker">Uma visão em movimento</p><h2>Veja o Heritage ganhar forma.</h2><p>Uma apresentação visual para conhecer a arquitetura, a atmosfera e a experiência pensada para este novo marco de Palmas.</p><a href={projectVideoDriveUrl} target="_blank" rel="noreferrer" className="heritage-text-link heritage-text-link--dark">Abrir vídeo no Drive <ExternalLink size={16} /></a></div></div></section>

      <section id="localizacao" className="heritage-location"><div className="heritage-location-panel" data-heritage-reveal><p className="heritage-kicker">Uma presença que redefine o entorno</p><h2>A orla de Palmas como horizonte.</h2><p>Um endereço para viver a cidade de um novo jeito, em contato com a paisagem e conectado ao futuro do Tocantins.</p><div className="heritage-location-facts"><div><Compass size={20} /><span><strong>Orla de Palmas</strong><small>um marco urbano em formação</small></span></div><div><MapPin size={20} /><span><strong>Palmas · TO</strong><small>a capital como cenário</small></span></div></div><a href="#atendimento" className="heritage-button heritage-button--dark">Receber informações <ArrowRight size={16} /></a></div><div className="heritage-location-image" data-heritage-reveal><Image src="/heritage/hero-project.png" alt="Fachada do Heritage Fama na orla de Palmas" fill sizes="(max-width: 820px) 100vw, 55vw" className="heritage-location-image-source" /><div className="heritage-location-image-wash" /><span>Um novo horizonte para Palmas</span></div></section>

      <section id="atendimento" className="heritage-contact"><div className="heritage-container heritage-contact-grid"><div className="heritage-contact-copy" data-heritage-reveal><p className="heritage-kicker">Seu próximo capítulo</p><h2>Conheça o Heritage com clareza e exclusividade.</h2><p>Receba a apresentação completa, acompanhe as próximas informações e converse sobre o projeto com atendimento personalizado.</p><div className="heritage-broker"><Image src="/brand/pedro-portrait-1.png" alt="Pedro Soares, corretor de imóveis" width={380} height={380} quality={95} sizes="190px" className="heritage-broker-photo" /><div><strong>Pedro Soares</strong><small>Corretor de imóveis · CRECI 5861-TO</small><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Falar no WhatsApp</a></div></div></div><div data-heritage-reveal><HeritageLeadForm /></div></div></section>

      <footer className="heritage-footer"><div className="heritage-container heritage-footer-grid"><div><Image src="/heritage/logo-original.png" alt="Heritage Fama" width={160} height={200} className="heritage-footer-logo" /><p>Um legado projetado para transformar.</p></div><div><small>Heritage Fama · Orla de Palmas · Tocantins</small><small>Imagens meramente ilustrativas. Informações, materiais e condições deverão ser confirmados na apresentação comercial vigente.</small></div></div></footer>
      <a className="heritage-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar sobre o Heritage pelo WhatsApp"><MessageCircle size={19} /><span>Quero conhecer</span></a>
    </main>
  );
}
