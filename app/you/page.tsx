import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Building2, Coffee, Dumbbell, Leaf, MapPin, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { YouLeadForm } from "@/components/public/you-lead-form";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const asset = (name: string) => `/brand/you/optimized/${name}`;

export const metadata: Metadata = {
  title: "YOU by Fama | Um novo jeito de viver a Orla",
  description: "Conheça o YOU by Fama, um projeto contemporâneo na região da Orla de Palmas, com arquitetura, lazer e conveniência.",
  alternates: { canonical: `${siteUrl}/you` },
  openGraph: {
    title: "YOU by Fama | Um novo jeito de viver a Orla",
    description: "Um projeto contemporâneo na região da Orla de Palmas, com arquitetura, lazer e conveniência.",
    type: "website",
    url: `${siteUrl}/you`,
    images: [{ url: `${siteUrl}${asset("render-exterior.jpg")}` }]
  }
};

const highlights = [
  { value: "Orla de Palmas", label: "um endereço conectado à paisagem" },
  { value: "Vista para o lago", label: "a cidade como parte da experiência" },
  { value: "Lazer e bem-estar", label: "ambientes para viver no seu ritmo" },
  { value: "YOU Market", label: "conveniência a poucos passos" }
];

const experiences = [
  { icon: Waves, title: "Paisagem", text: "A presença do lago e do horizonte inspira uma rotina mais leve, com espaços que valorizam a vista." },
  { icon: Dumbbell, title: "Bem-estar", text: "Ambientes para cuidar do corpo, desacelerar e aproveitar melhor o tempo dentro de casa." },
  { icon: Coffee, title: "Conveniência", text: "Serviços e facilidades pensados para deixar o dia mais simples, sem abrir mão do design." },
  { icon: Leaf, title: "Natureza", text: "Vegetação, luz e arquitetura contemporânea se encontram em uma experiência urbana mais humana." }
];

const gallery = [
  { src: "render-exterior.jpg", alt: "Render da fachada do YOU by Fama", title: "Arquitetura que se destaca" },
  { src: "ita00104.webp", alt: "Ambiente com vista para o lago ao pôr do sol", title: "O lago como paisagem" },
  { src: "lobby.jpg", alt: "Render do lobby do YOU by Fama", title: "Chegar também é uma experiência" },
  { src: "ita00099.webp", alt: "Sala de yoga com vista para o lago", title: "Espaços para respirar" },
  { src: "ita00106.webp", alt: "Espaço infantil colorido do empreendimento", title: "Para todas as fases" },
  { src: "ita00121.webp", alt: "YOU Market dentro do empreendimento", title: "Conveniência no seu caminho" }
];

export default function YouPage() {
  return (
    <div className="you-landing">
      <LandingPageTracker landingPageSlug="you-by-fama" />

      <section className="you-hero">
        <div className="you-hero-copy">
          <div className="you-nav">
            <Link href="/" className="you-wordmark-link" aria-label="Voltar para Pedro Soares Imóveis">Pedro Soares <span>imóveis</span></Link>
            <a className="you-nav-cta" href="#cadastro">Quero conhecer <ArrowRight size={15} /></a>
          </div>
          <div className="you-hero-main">
            <Image src={asset("logo-blue.png")} alt="YOU by Fama" width={420} height={310} priority className="you-logo" />
            <p className="you-eyebrow"><span /> Região da Orla · Palmas/TO</p>
            <h1>Um novo jeito de viver a Orla.</h1>
            <p className="you-hero-lede">Arquitetura contemporânea, vista para o lago e uma rotina com mais possibilidades — no endereço que combina com você.</p>
            <div className="you-hero-actions">
              <a className="you-button you-button--blue" href="#experiencia">Descobrir o projeto <ArrowRight size={17} /></a>
              <a className="you-text-link" href="#cadastro">Receber apresentação <ArrowRight size={15} /></a>
            </div>
          </div>
          <div className="you-hero-foot"><span>By Fama</span><span>Exclusividade, design e bem-estar</span></div>
        </div>
        <div className="you-hero-image">
          <Image src={asset("render-exterior.jpg")} alt="Fachada do YOU by Fama cercada por vegetação" fill priority sizes="(max-width: 900px) 100vw, 58vw" />
          <div className="you-image-tag"><Sparkles size={14} /> Um projeto para chamar de seu</div>
        </div>
        <a className="you-scroll-cue" href="#experiencia" aria-label="Conheça o projeto"><span>Conheça</span><ArrowDown size={17} /></a>
      </section>

      <section className="you-highlight-strip" aria-label="Destaques do projeto"><div className="you-container you-highlight-grid">{highlights.map((item) => <div key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>

      <section id="experiencia" className="you-section you-section--light">
        <div className="you-container you-intro-grid">
          <div className="you-intro-copy"><p className="you-kicker">Mais do que um endereço</p><h2>O seu espaço para viver tudo o que a cidade oferece.</h2><p>O YOU by Fama nasce na região da Orla de Palmas com uma proposta que aproxima moradia, lazer, conveniência e a paisagem do lago.</p><p>Um projeto feito para quem quer estar perto do que importa — com liberdade para construir a própria rotina.</p><a className="you-text-link you-text-link--dark" href="#galeria">Ver ambientes <ArrowRight size={15} /></a></div>
          <div className="you-intro-visual"><Image src={asset("conceito.webp")} alt="Imagem-conceito do logo YOU by Fama entre folhas tropicais" fill sizes="(max-width: 900px) 100vw, 44vw" /><div className="you-visual-caption">YOU by Fama<br /><span>O seu jeito de viver</span></div></div>
        </div>
      </section>

      <section className="you-section you-section--dark"><div className="you-container"><div className="you-section-heading"><p className="you-kicker">Uma experiência completa</p><h2>Feito para acompanhar o seu ritmo.</h2><p>Do primeiro café ao fim de semana, cada ambiente foi pensado para tornar a vida mais gostosa e prática.</p></div><div className="you-experience-grid">{experiences.map(({ icon: Icon, title, text }) => <article className="you-experience-card" key={title}><Icon size={23} strokeWidth={1.5} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section id="galeria" className="you-gallery-section"><div className="you-container"><div className="you-gallery-heading"><div><p className="you-kicker">Por dentro do YOU</p><h2>Detalhes que fazem você se reconhecer.</h2></div><p>Conheça alguns dos ambientes e imagens que traduzem a atmosfera do projeto.</p></div><div className="you-gallery-grid">{gallery.map((item, index) => <figure className={`you-gallery-card you-gallery-card--${index + 1}`} key={item.src}><div><Image src={asset(item.src)} alt={item.alt} fill sizes={index === 0 ? "(max-width: 800px) 100vw, 58vw" : "(max-width: 800px) 50vw, 28vw"} /></div><figcaption><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong></figcaption></figure>)}</div></div></section>

      <section className="you-video-section"><div className="you-container you-video-grid"><div className="you-video-copy"><p className="you-kicker">Veja o projeto</p><h2>Uma ideia que ganha forma.</h2><p>Assista à apresentação do YOU by Fama e imagine como pode ser o seu próximo capítulo na região da Orla.</p><a className="you-button you-button--blue" href="#cadastro">Quero receber detalhes <ArrowRight size={17} /></a><a className="you-text-link" href="/brand/you/apresentacao-you.pdf" target="_blank" rel="noreferrer">Abrir apresentação completa <ArrowRight size={15} /></a></div><div className="you-video-frame"><video controls playsInline preload="metadata" poster={asset("conceito.jpg")}><source src="/brand/you/apresentacao-you.mp4" type="video/mp4" />Seu navegador não suporta vídeo.</video><span>Apresentação YOU by Fama</span></div></div></section>

      <section className="you-location-section"><div className="you-container you-location-grid"><div className="you-location-image"><Image src={asset("ita00104.webp")} alt="Vista do lago ao pôr do sol" fill sizes="(max-width: 800px) 100vw, 55vw" /></div><div className="you-location-copy"><p className="you-kicker">Região da Orla</p><h2>Quando a cidade encontra o seu horizonte.</h2><p>O YOU by Fama está inserido em uma das regiões mais desejadas de Palmas, onde a paisagem do lago, a vida urbana e a arquitetura se encontram.</p><div className="you-location-fact"><MapPin size={18} /><div><strong>Palmas, Tocantins</strong><span>Consulte localização, plantas e condições atualizadas.</span></div></div><a className="you-button you-button--dark" href="#cadastro">Falar com um especialista <ArrowRight size={17} /></a></div></div></section>

      <section id="cadastro" className="you-contact-section"><div className="you-container you-contact-grid"><div className="you-contact-copy"><Image src={asset("logo-blue.png")} alt="YOU by Fama" width={300} height={220} className="you-contact-logo" /><p className="you-kicker">Lista de interesse</p><h2>O seu próximo endereço pode começar agora.</h2><p>Deixe seus dados e eu apresentarei o projeto, as plantas e as condições disponíveis para você.</p><div className="you-contact-points"><span><ShieldCheck size={17} /> Atendimento direto com Pedro Soares</span><span><Building2 size={17} /> Informações e materiais atualizados</span><span><Sparkles size={17} /> Orientação para morar ou investir</span></div></div><YouLeadForm /></div></section>

      <footer className="you-footer"><div className="you-container"><Image src={asset("logo-blue.png")} alt="YOU by Fama" width={165} height={123} /><p>Um novo jeito de viver a Orla.</p><small>Material de apresentação sujeito a alterações. Consulte disponibilidade, plantas e condições atualizadas com Pedro Soares · CRECI 5861-TO.</small></div></footer>
    </div>
  );
}
