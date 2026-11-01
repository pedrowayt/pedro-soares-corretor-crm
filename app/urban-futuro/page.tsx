import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, Check, Building2, MapPin, MessageCircle, MoveUpRight, Sparkles, Users } from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { TrackedWhatsAppLink } from "@/components/public/tracked-whatsapp-link";
import { UrbanFuturoLeadForm } from "@/components/public/urban-futuro-lead-form";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";
import styles from "./futuro.module.css";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/urban-futuro`;
const futuroMessage = "Olá, Pedro. Quero conhecer o Urban Futuro e receber a apresentação comercial.";
const whatsappUrl = buildWhatsAppUrl(futuroMessage);
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=ACSU+SO+20,+Avenida+Siqueira+Campos,+15,+Palmas+-+TO";

export const metadata: Metadata = {
  title: "Urban Futuro | Business office na 201 Sul de Palmas",
  description: "Conheça o Urban Futuro: empreendimento comercial entregue na Av. Teotônio Segurado, com salas corporativas, coworking, salas de reunião e infraestrutura completa.",
  keywords: ["Urban Futuro", "salas comerciais em Palmas", "business office Palmas", "sala comercial 201 Sul"],
  alternates: { canonical: pageUrl },
  openGraph: { type: "website", locale: "pt_BR", url: pageUrl, title: "Urban Futuro | O futuro dos seus negócios já é realidade", description: "Salas e espaços corporativos na Av. Teotônio Segurado, com arquitetura contemporânea e infraestrutura para negócios.", images: [{ url: `${siteUrl}/brand/urban-futuro/hero.jpg`, alt: "Fachada do Urban Futuro Business Office" }] },
  twitter: { card: "summary_large_image", title: "Urban Futuro | Business office em Palmas", description: "Conheça o Urban Futuro e receba a apresentação comercial atualizada.", images: [`${siteUrl}/brand/urban-futuro/hero.jpg`] }
};

const highlights = [["26,35 a 306,26 m²", "salas e espaços corporativos"], ["5", "elevadores"], ["201 Sul", "Av. Teotônio Segurado"], ["Entregue", "pronto para operar"]];
const gallery = [
  ["lobby-cafe.jpg", "Hall social e Café Futuro"],
  ["terrace.jpg", "Terraço Futuro"],
  ["meeting-rooms.jpg", "Salas de reunião compartilhadas"],
  ["architecture-room.jpg", "Sala com arquitetura contemporânea"],
  ["corporate-room.jpg", "Sala Corporate"],
  ["hero.jpg", "Fachada icônica na Av. Teotônio Segurado"]
];
const amenities = ["Coworking e salas de reunião compartilhadas", "Hall social com Café Futuro", "Terraço descoberto no 3º pavimento", "Jardim, praça e lounge", "5 elevadores para usuários e visitantes", "Gerador e infraestrutura de apoio", "Portaria e segurança 24 horas", "Energia solar e vista panorâmica"];
const typologies = [
  { image: "floor-typical.jpg", title: "Salas comerciais · 26,35 a 60,92 m²", text: "Configurações para profissionais e empresas que buscam endereço estratégico e estrutura pronta." },
  { image: "architecture-room.jpg", title: "Composição corporativa · 92,23 m²", text: "Ambiente pensado para integrar operação, atendimento e identidade profissional." },
  { image: "corporate-room.jpg", title: "Sala Corporate · 155,59 m²", text: "Espaço amplo para empresas que precisam de mais conforto, presença e flexibilidade." },
  { image: "corporate-floors.jpg", title: "Loja · até 306,26 m²", text: "Uma frente comercial para negócios que valorizam visibilidade e circulação urbana." }
];

export default function UrbanFuturoPage() {
  return <main className={styles.landing}>
    <LandingPageTracker landingPageSlug="urban-futuro" />
    <header className={styles.nav}>
      <a className={styles.brand} href="#inicio" aria-label="Urban Futuro"><span>URBAN</span><strong>FUTURO</strong></a>
      <nav aria-label="Navegação principal"><a href="#projeto">O projeto</a><a href="#tipologias">Espaços</a><a href="#galeria">Galeria</a><a href="#localizacao">Localização</a></nav>
      <TrackedWhatsAppLink className={styles.navCta} landingPageSlug="urban-futuro" messageTemplate={futuroMessage} href={whatsappUrl} target="_blank" rel="noreferrer">Falar com Pedro <MessageCircle size={15} /></TrackedWhatsAppLink>
    </header>

    <section className={styles.hero} id="inicio">
      <div className={styles.heroCopy}><p className={styles.eyebrow}><span /> Entregue · Plano Diretor Sul · Palmas</p><p className={styles.overline}>BUSINESS OFFICE NA AVENIDA MAIS ESTRATÉGICA</p><h1>O futuro dos seus negócios já é realidade.</h1><p className={styles.heroLede}>Salas e espaços corporativos no ponto mais valorizado da Av. Teotônio Segurado, com arquitetura contemporânea e infraestrutura para trabalhar melhor.</p><div className={styles.actions}><a className={styles.primaryButton} href="#atendimento">Conhecer o Urban Futuro <ArrowRight size={17} /></a><a className={styles.textLink} href="#projeto">Descobrir o projeto <ArrowDown size={15} /></a></div><div className={styles.heroFoot}><span><MapPin size={14} /> Palmas / TO</span><span>ACSU SO 20 · 201 Sul</span></div></div>
      <div className={styles.heroVisual}><Image src="/brand/urban-futuro/hero.jpg" alt="Fachada do Urban Futuro Business Office na Avenida Teotônio Segurado" fill priority quality={90} sizes="(max-width: 800px) 100vw, 54vw" /><div className={styles.heroOverlay} /><div className={styles.heroStamp}><span>BUSINESS OFFICE</span><strong>UF</strong><small>um novo marco para Palmas</small></div><div className={styles.heroCaption}>Apresentação oficial Urban Futuro</div></div>
    </section>

    <section className={styles.statStrip} aria-label="Resumo do empreendimento"><div className={styles.container}>{highlights.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

    <section className={`${styles.section} ${styles.paper}`} id="projeto"><div className={`${styles.container} ${styles.story}`}><div><p className={styles.kicker}>O projeto</p><h2>Um endereço para o trabalho ganhar futuro.</h2></div><div className={styles.storyCopy}><p>O Urban Futuro é um empreendimento comercial entregue na Av. Teotônio Segurado, em Palmas, criado para acolher empresas e profissionais com eficiência, conforto e funcionalidade.</p><p>Arquitetura icônica, paisagismo, espaços de convivência e salas de reunião compartilhadas formam uma base para negócios que querem estar no centro das oportunidades.</p><a className={styles.textLinkDark} href="#diferenciais">Ver os diferenciais <ArrowRight size={15} /></a></div></div></section>

    <section className={`${styles.section} ${styles.ink}`} id="diferenciais"><div className={styles.container}><div className={styles.heading}><p className={styles.kicker}>A experiência Urban Futuro</p><h2>Trabalhar com qualidade de vida.</h2><p>Uma estrutura comercial pensada para o cotidiano de empresas, profissionais e visitantes.</p></div><div className={styles.detailGrid}><article className={styles.detailCard}><Building2 size={22} /><h3>Presença urbana</h3><p>Fachada contemporânea e localização estratégica para posicionar seu negócio na cidade.</p></article><article className={styles.detailCard}><Users size={22} /><h3>Conexões para crescer</h3><p>Coworking, salas de reunião e áreas comuns que aproximam pessoas, ideias e negócios.</p></article><article className={styles.detailCard}><Sparkles size={22} /><h3>Infraestrutura completa</h3><p>Hall social, elevadores, gerador, portaria e segurança para uma operação mais fluida.</p></article></div></div></section>

    <section className={`${styles.section} ${styles.paper}`} id="tipologias"><div className={styles.container}><div className={styles.headingDark}><p className={styles.kicker}>Espaços corporativos</p><h2>Escolha o espaço que acompanha seu negócio.</h2><p>Conheça as configurações apresentadas no material oficial e receba a disponibilidade atualizada no atendimento.</p></div><div className={styles.planGrid}>{typologies.map((item) => <article className={styles.planCard} key={item.title}><Image src={`/brand/urban-futuro/${item.image}`} alt={`${item.title} no Urban Futuro`} width={1600} height={900} quality={90} sizes="(max-width: 700px) 100vw, 33vw" /><div><span>Espaço apresentado no folder</span><strong>{item.title}</strong><p>{item.text}</p><a href="#atendimento">Receber apresentação <ArrowRight size={14} /></a></div></article>)}</div></div></section>

    <section className={styles.amenitySection}><div className={styles.container}><div className={styles.amenityIntro}><p className={styles.kicker}>Estrutura</p><h2>Conforto que ajuda o negócio a acontecer.</h2><p>Ambientes e serviços extraídos da ficha do empreendimento e da apresentação oficial do Urban Futuro.</p></div><div className={styles.amenityGrid}>{amenities.map((item) => <span key={item}><Check size={15} />{item}</span>)}</div></div></section>

    <section className={styles.gallerySection} id="galeria"><div className={styles.container}><div className={styles.headingLight}><p className={styles.kicker}>Galeria</p><h2>Arquitetura para inspirar o futuro.</h2><p>Imagens extraídas da apresentação oficial e tratadas em alta resolução; perspectivas sujeitas às condições do material comercial.</p></div><div className={styles.galleryGrid}>{gallery.map(([src, alt], index) => <figure key={src} className={index === 0 || index === 4 ? styles.galleryFeature : ""}><Image src={`/brand/urban-futuro/${src}`} alt={alt} width={1600} height={900} quality={90} sizes="(max-width: 700px) 100vw, 50vw" /><figcaption>{alt}</figcaption></figure>)}</div></div></section>

    <section className={styles.location} id="localizacao"><div className={styles.locationPanel}><p className={styles.kicker}>Localização</p><h2>No ponto mais estratégico de Palmas.</h2><p>ACSU SO 20, Avenida Siqueira Campos, 15 · 201 Sul, com acesso direto à Av. Teotônio Segurado e proximidade da Praça dos Girassóis.</p><div className={styles.locationFacts}><div><strong>201 Sul</strong><span>Plano Diretor Sul</span></div><div><strong>Av. Teotônio Segurado</strong><span>endereço business</span></div><div><strong>Entregue</strong><span>pronto para operar</span></div></div><a className={styles.primaryButton} href={mapsUrl} target="_blank" rel="noreferrer">Abrir localização <MoveUpRight size={16} /></a></div><div className={styles.locationArt}><Image src="/brand/urban-futuro/location.jpg" alt="Mapa de localização do Urban Futuro na 201 Sul" fill quality={90} sizes="50vw" /><div className={styles.locationLabel}><MapPin size={26} /><span>Urban Futuro</span><small>201 Sul · Palmas/TO</small></div></div></section>

    <section className={styles.contact} id="atendimento"><div className={`${styles.container} ${styles.contactGrid}`}><div className={styles.contactCopy}><p className={styles.kicker}>Atendimento direto</p><h2>Seu próximo endereço comercial começa aqui.</h2><p>Eu apresento as salas, envio o material comercial e retorno com a disponibilidade mais recente para o perfil da sua empresa.</p><div className={styles.checkList}><span><Check size={16} /> Apresentação comercial</span><span><Check size={16} /> Plantas e configurações</span><span><Check size={16} /> Atendimento personalizado</span></div><div className={styles.broker}><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares, corretor de imóveis" width={64} height={76} quality={90} /><span><strong>Pedro Soares</strong><small>Corretor de imóveis · CRECI 5861-TO</small></span></div></div><UrbanFuturoLeadForm /></div></section>
    <footer className={styles.footer}><span>URBAN FUTURO · PALMAS / TO</span><a href="#inicio">Voltar ao início <ArrowDown size={14} /></a></footer>
  </main>;
}
