import type { Metadata } from "next";
import Image from "next/image";
import "./yacht.module.css";
import { ArrowDown, ArrowRight, Check, Dumbbell, ExternalLink, Home, MessageCircle, Play, Sparkles, Waves } from "lucide-react";
import { YachtLeadForm } from "@/components/public/yacht-lead-form";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const videoUrl = "https://drive.google.com/file/d/1pP6WpR5ODSb2sqwioJUc5hSYS0AGp-Xv/view";
const videoEmbedUrl = "https://drive.google.com/file/d/1pP6WpR5ODSb2sqwioJUc5hSYS0AGp-Xv/preview";
const whatsappUrl = buildWhatsAppUrl("Olá, Pedro. Quero conhecer o Yacht by Fama e receber a apresentação.");

export const metadata: Metadata = {
  title: "Yacht by Fama | A melhor oportunidade para rentabilizar na Orla de Palmas",
  description: "Conheça o Yacht by Fama: studios de 1 e 2 quartos na Orla 14, em Palmas, com lazer no rooftop, plantas inteligentes e foco em moradia e hospedagem.",
  alternates: { canonical: `${siteUrl}/yacht-fama` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${siteUrl}/yacht-fama`,
    title: "Yacht by Fama | Vista para o lago",
    description: "Studios de 1 e 2 quartos para morar ou investir na Orla 14 de Palmas.",
    images: [{ url: `${siteUrl}/yacht/facade.jpg` }]
  }
};

const amenities = [
  { icon: Waves, title: "Lazer no rooftop", text: "Piscina, hidromassagem, bar, cozinha e espaço gourmet com o lago como cenário." },
  { icon: Dumbbell, title: "Academia e convivência", text: "Ambientes desenhados para uma rotina completa, com bem-estar e encontros no mesmo endereço." },
  { icon: Sparkles, title: "Experiência premium", text: "Ambientes amplos e acabamentos superiores para gerar boas avaliações e mais reservas." },
  { icon: Home, title: "Tipologias inteligentes", text: "Apartamentos de 1 e 2 quartos para atender viajantes solo, famílias e diferentes perfis de uso." }
];

const marketFacts = [
  ["44,9%", "da população de Palmas mora de aluguel"],
  ["4.480", "estudantes de medicina ativos"],
  ["39,7%", "de crescimento do setor hoteleiro em cinco anos"],
  ["23,95%", "de valorização média anual em empreendimentos Fama na orla"]
];

const gallery = [
  ["/yacht/pool.jpg", "Piscina e hidromassagem", "Rooftop"],
  ["/yacht/gourmet.jpg", "Espaço gourmet", "Lazer"],
  ["/yacht/coworking.jpg", "Coworking", "Conveniência"],
  ["/yacht/restaurant.jpg", "Restaurante", "Experiência"]
];

export default function YachtFamaPage() {
  return (
    <main className="yacht-landing">
      <LandingPageTracker landingPageSlug="yacht-by-fama" />

      <section className="yacht-hero" id="inicio">
        <Image src="/yacht/facade.jpg" alt="Imagem 3D da fachada do Yacht by Fama" fill priority sizes="100vw" className="yacht-hero-image" />
        <div className="yacht-hero-shade" />
        <header className="yacht-nav yacht-container">
          <a href="#inicio" aria-label="Yacht by Fama"><Image src="/yacht/logo-02.png" alt="Yacht by Fama" width={185} height={131} className="yacht-logo" /></a>
          <nav aria-label="Navegação principal"><a href="#projeto">O projeto</a><a href="#experiencia">Experiência</a><a href="#plantas">Plantas</a><a href="#obras">Obras</a></nav>
          <a className="yacht-button yacht-button--outline yacht-nav-cta" href="#atendimento">Receber apresentação <ArrowRight size={15} /></a>
        </header>
        <div className="yacht-container yacht-hero-content">
          <div className="yacht-hero-copy">
            <p className="yacht-eyebrow"><span /> Orla 14 · Palmas, Tocantins</p>
            <p className="yacht-overline">A MELHOR OPORTUNIDADE PARA RENTABILIZAR NA ORLA DE PALMAS</p>
            <h1>Vista para o lago. <em>Valor</em> para o futuro.</h1>
            <p className="yacht-hero-lede">Studios de 1 e 2 quartos para morar ou investir em um endereço que combina turismo, negócios, educação e qualidade de vida.</p>
            <div className="yacht-hero-actions"><a className="yacht-button yacht-button--sand" href="#atendimento">Quero conhecer <ArrowRight size={17} /></a><a className="yacht-text-link yacht-text-link--light" href="#video"><Play size={15} fill="currentColor" /> Assistir ao vídeo</a></div>
          </div>
          <div className="yacht-hero-stamp"><span>YACHT</span><small>BY FAMA · PALMAS/TO</small></div>
        </div>
        <a className="yacht-scroll-cue" href="#video"><span>Descubra o projeto</span><ArrowDown size={17} /></a>
      </section>

      <section className="yacht-stat-strip"><div className="yacht-container yacht-stat-grid">{marketFacts.map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

      <section id="video" className="yacht-video-section"><div className="yacht-container yacht-video-grid"><div className="yacht-video-frame"><iframe title="Vídeo institucional do Yacht by Fama" src={videoEmbedUrl} allow="autoplay; encrypted-media; fullscreen" allowFullScreen /><a className="yacht-video-fallback" href={videoUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Abrir vídeo em nova janela</a></div><div className="yacht-video-copy"><p className="yacht-kicker">Yacht by Fama</p><h2>Um projeto que nasce com um propósito claro.</h2><p>Atender a demanda crescente por hospedagem e moradia em Palmas, gerando receita recorrente para investidores e uma experiência completa para quem vive a cidade.</p><p>Palmas recebe estudantes, turistas, empresários e pacientes de toda a região. O Yacht se posiciona no encontro desses fluxos, com tipologias pensadas para ocupação.</p><a className="yacht-text-link yacht-text-link--dark" href="#projeto">Conheça a lógica do projeto <ArrowRight size={16} /></a></div></div></section>

      <section id="projeto" className="yacht-section yacht-section--sand"><div className="yacht-container yacht-story-grid"><div className="yacht-story-copy"><p className="yacht-kicker">Onde demanda e localização se encontram</p><h2>Uma cidade planejada para crescer.</h2><p>O agronegócio fortalece a economia local, a educação gera demanda recorrente e o turismo de lazer e negócios movimenta a ocupação ao longo do ano.</p><p>Na Orla 14, a vida ganha ritmo leve: praias urbanas, restaurantes à beira-lago e o pôr do sol como parte do endereço.</p><div className="yacht-story-points"><span><Check size={15} /> Ponto turístico e polo gastronômico</span><span><Check size={15} /> Hospitais e instituições de ensino</span><span><Check size={15} /> Natureza, lazer e qualidade de vida</span></div><a className="yacht-button yacht-button--blue" href="#atendimento">Falar com um consultor <ArrowRight size={16} /></a></div><div className="yacht-story-image"><Image src="/yacht/facade.jpg" alt="Fachada do Yacht by Fama voltada para a paisagem da Orla 14" fill sizes="(max-width: 800px) 100vw, 48vw" /><span>Orla 14 · Palmas/TO</span></div></div></section>

      <section id="experiencia" className="yacht-section yacht-section--blue"><div className="yacht-container"><div className="yacht-section-heading"><p className="yacht-kicker">Uma experiência premium</p><h2>O que faz o Yacht ser desejado.</h2><p>Arquitetura, conveniência e lazer reunidos para morar bem, receber melhor e gerar boas avaliações.</p></div><div className="yacht-amenities-grid">{amenities.map(({ icon: Icon, title, text }) => <article className="yacht-amenity" key={title}><Icon size={24} strokeWidth={1.35} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="yacht-gallery-section"><div className="yacht-container yacht-gallery-heading"><div><p className="yacht-kicker">Por dentro da experiência</p><h2>Ambientes que valorizam o seu tempo.</h2></div><p>Imagens do projeto · perspectivas meramente ilustrativas</p></div><div className="yacht-container yacht-gallery-grid">{gallery.map(([src, alt, label]) => <figure key={src}><div><Image src={src} alt={`${alt} do Yacht by Fama`} fill sizes="(max-width: 700px) 100vw, 25vw" /></div><figcaption><span>{label}</span><strong>{alt}</strong></figcaption></figure>)}</div></section>

      <section id="plantas" className="yacht-section yacht-section--sand yacht-plans-section"><div className="yacht-container"><div className="yacht-section-heading yacht-section-heading--dark"><p className="yacht-kicker">Plantas do projeto</p><h2>Tipologias pensadas para ocupação.</h2><p>Apartamentos de 1 e 2 quartos que atendem viajantes solo e famílias, aumentando a ocupação e reduzindo vacância.</p></div><div className="yacht-plans-grid"><figure><div><Image src="/yacht/planta-tipo.png" alt="Planta do pavimento tipo e lazer no rooftop, página 17 do book Yacht by Fama" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><figcaption><strong>Pavimento tipo + rooftop</strong><span>Página 17 da apresentação</span></figcaption></figure><figure><div><Image src="/yacht/planta-academia.png" alt="Planta da academia e áreas de convivência, página 18 do book Yacht by Fama" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><figcaption><strong>Academia e áreas de convivência</strong><span>Página 18 da apresentação</span></figcaption></figure></div></div></section>

      <section id="obras" className="yacht-section yacht-section--dark"><div className="yacht-container yacht-works-grid"><div className="yacht-works-copy"><p className="yacht-kicker">O projeto já começou</p><h2>Obras iniciadas. Um novo capítulo em construção.</h2><p>Acompanhe os primeiros registros da obra do Yacht by Fama e veja o projeto sair do papel na Orla 14.</p><a className="yacht-text-link yacht-text-link--light" href="#atendimento">Receber atualizações da obra <ArrowRight size={16} /></a></div><div className="yacht-works-gallery"><div className="yacht-work-main"><Image src="/yacht/obra-01.jpg" alt="Registro vertical do início das obras do Yacht by Fama" fill sizes="(max-width: 800px) 100vw, 55vw" /></div><div className="yacht-work-small"><Image src="/yacht/obra-02.jpg" alt="Detalhe do início das obras do Yacht by Fama" fill sizes="(max-width: 800px) 50vw, 25vw" /></div><div className="yacht-work-small"><Image src="/yacht/obra-03.jpg" alt="Registro da construção do Yacht by Fama" fill sizes="(max-width: 800px) 50vw, 25vw" /></div></div></div></section>

      <section id="atendimento" className="yacht-contact"><div className="yacht-container yacht-contact-grid"><div className="yacht-contact-copy"><p className="yacht-kicker">Próximo passo</p><h2>Receba o Yacht em detalhes.</h2><p>Deixe seus dados para receber a apresentação completa, as plantas e as condições disponíveis do projeto.</p><div className="yacht-contact-broker"><span className="yacht-contact-broker-photo"><Image src="/yacht/corretor.png" alt="Pedro Soares, corretor de imóveis" fill sizes="65px" /></span><div><strong>Pedro Soares</strong><small>Corretor de imóveis · CRECI 5861-TO</small><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Falar no WhatsApp</a></div></div></div><YachtLeadForm /></div></section>

      <footer className="yacht-footer"><div className="yacht-container yacht-footer-grid"><Image src="/yacht/logo-02.png" alt="Yacht by Fama" width={155} height={110} /><div><p>Yacht by Fama · Orla 14 · Palmas/TO</p><small>Imagens meramente ilustrativas. Informações, materiais, valores e condições deverão ser confirmados na apresentação comercial vigente.</small></div></div></footer>
      <a className="yacht-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar sobre o Yacht pelo WhatsApp"><MessageCircle size={19} /><span>Quero conhecer</span></a>
    </main>
  );
}
