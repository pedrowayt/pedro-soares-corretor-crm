import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, Check, Compass, Dumbbell, MapPin, MessageCircle, MoveUpRight, Sparkles, Waves } from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { TrackedWhatsAppLink } from "@/components/public/tracked-whatsapp-link";
import { UrbanHorizonteLeadForm } from "@/components/public/urban-horizonte-lead-form";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";
import styles from "./horizonte.module.css";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/urban-horizonte`;
const horizonteMessage = "Olá, Pedro. Quero conhecer o Urban Horizonte e receber a apresentação, plantas e condições.";
const whatsappUrl = buildWhatsAppUrl(horizonteMessage);
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Orla+14,+Palmas+-+TO";

export const metadata: Metadata = {
  title: "Urban Horizonte | Apartamentos na Orla 14 de Palmas",
  description: "Conheça o Urban Horizonte: apartamentos de 3, 4 e 5 suítes na Orla 14, com vista para o Lago de Palmas e projeto assinado por estúdios de renome nacional.",
  keywords: ["Urban Horizonte", "apartamentos na Orla 14", "apartamentos em Palmas", "Urban Design Palmas"],
  alternates: { canonical: pageUrl },
  openGraph: { type: "website", locale: "pt_BR", url: pageUrl, title: "Urban Horizonte | Um horizonte para viver", description: "Apartamentos de 3, 4 e 5 suítes na Orla 14, com vista para o Lago de Palmas.", images: [{ url: `${siteUrl}/brand/urban-horizonte/orla-view.jpg`, alt: "Vista da Orla 14 e do Lago de Palmas" }] },
  twitter: { card: "summary_large_image", title: "Urban Horizonte | Apartamentos em Palmas", description: "Conheça o Urban Horizonte e receba a apresentação atualizada.", images: [`${siteUrl}/brand/urban-horizonte/orla-view.jpg`] }
};

const highlights = [["156 a 316 m²", "áreas anunciadas"], ["3 a 5", "suítes"], ["Orla 14", "endereço"], ["Entregue", "pronto para morar"]];
const gallery = [
  ["orla-view.jpg", "Vista da Orla 14 e do Lago de Palmas"],
  ["lobby-design.jpg", "Lobby com mobiliário autoral"],
  ["party-room.jpg", "Salão de festas com vista para o lago"],
  ["gourmet.jpg", "Espaço gourmet"],
  ["pool.jpg", "Piscina com vista para o Lago de Palmas"],
  ["gym.jpg", "Academia com assinatura Flex Home"],
  ["kids.jpg", "Brinquedoteca"],
  ["barbecue.jpg", "Churrasqueira"],
  ["sports-court.jpg", "Quadra"]
];
const amenities = ["Piscina com vista para o Lago de Palmas", "Academia com assinatura Flex Home", "Salão de festas mobiliado e equipado", "Espaço gourmet integrado ou independente", "Brinquedoteca e playground", "Sala de jogos", "Churrasqueira", "Quadra esportiva", "Varanda gourmet", "Vista panorâmica", "Gerador", "Portaria e segurança 24h", "Redário e pista de caminhada", "Jardim, praça e lounge"];
const typologies = [
  { image: "plan-156.jpg", title: "3 suítes · 156 m²", text: "Planta flexível para personalização, elevador privativo e ambientes pensados para integrar a vida ao lago." },
  { image: "plan-202.jpg", title: "4 suítes · 202 m²", text: "Uma configuração generosa, com varanda gourmet e possibilidades de integração entre sala, cozinha e varanda." },
  { image: "plan-316.jpg", title: "5 suítes · 316 m²", text: "Penthouse com planta flexível, elevador privativo, pé-direito de 2,80 m e varanda ampliada." }
];

export default function UrbanHorizontePage() {
  return <main className={styles.landing}>
    <LandingPageTracker landingPageSlug="urban-horizonte" />
    <header className={styles.nav}>
      <a className={styles.brand} href="#inicio" aria-label="Urban Horizonte"><span>URBAN DESIGN</span><strong>HORIZONTE</strong></a>
      <nav aria-label="Navegação principal"><a href="#projeto">O projeto</a><a href="#tipologias">Tipologias</a><a href="#galeria">Galeria</a><a href="#localizacao">Localização</a></nav>
      <TrackedWhatsAppLink className={styles.navCta} landingPageSlug="urban-horizonte" messageTemplate={horizonteMessage} href={whatsappUrl} target="_blank" rel="noreferrer">Falar com Pedro <MessageCircle size={15} /></TrackedWhatsAppLink>
    </header>

    <section className={styles.hero} id="inicio">
      <div className={styles.heroCopy}><p className={styles.eyebrow}><span /> Entregue · Graciosa · Orla 14</p><p className={styles.overline}>PERTO DE ONDE A VIDA ACONTECE</p><h1>Um horizonte para viver.</h1><p className={styles.heroLede}>Apartamentos de 3, 4 e 5 suítes no endereço mais nobre da Orla de Palmas, com a vista permanente do Lago à sua frente.</p><div className={styles.actions}><a className={styles.primaryButton} href="#atendimento">Conhecer o Horizonte <ArrowRight size={17} /></a><a className={styles.textLink} href="#projeto">Descobrir o projeto <ArrowDown size={15} /></a></div><div className={styles.heroFoot}><span><MapPin size={14} /> Palmas / TO</span><span>Graciosa · Orla 14</span></div></div>
      <div className={styles.heroVisual}><Image src="/brand/urban-horizonte/orla-view.jpg" alt="Vista do Urban Horizonte para a Orla 14 e o Lago de Palmas" fill priority quality={90} sizes="(max-width: 800px) 100vw, 54vw" /><div className={styles.heroOverlay} /><div className={styles.heroStamp}><span>VISTA PERMANENTE DO LAGO</span><strong>H</strong><small>em todas as unidades</small></div><div className={styles.heroCaption}>Apresentação oficial Urban Design</div></div>
    </section>

    <section className={styles.statStrip} aria-label="Resumo do empreendimento"><div className={styles.container}>{highlights.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

    <section className={`${styles.section} ${styles.paper}`} id="projeto"><div className={`${styles.container} ${styles.story}`}><div><p className={styles.kicker}>O projeto</p><h2>O lago como parte da sua rotina.</h2></div><div className={styles.storyCopy}><p>O Horizonte Urban Design está na Graciosa, na Orla 14 de Palmas, próximo dos melhores restaurantes, escolas e conveniências da cidade.</p><p>Arquitetura orgânica, materiais naturais e varandas generosas criam uma conexão real com a natureza. O projeto é assinado por Roberto Carvalho, Sá Spessato e Miriam Coelho.</p><a className={styles.textLinkDark} href="#diferenciais">Ver os diferenciais <ArrowRight size={15} /></a></div></div></section>

    <section className={`${styles.section} ${styles.ink}`} id="diferenciais"><div className={styles.container}><div className={styles.heading}><p className={styles.kicker}>A experiência Horizonte</p><h2>Formas que fluem como a vida.</h2><p>Um projeto entregue, com ambientes comuns mobiliados e equipados e uma experiência residencial voltada para o lago.</p></div><div className={styles.detailGrid}><article className={styles.detailCard}><Waves size={22} /><h3>Vista que permanece</h3><p>A apresentação oficial destaca a vista permanente do Lago de Palmas em todas as unidades.</p></article><article className={styles.detailCard}><Sparkles size={22} /><h3>Design autoral</h3><p>Lobby, lazer e áreas comuns com mobiliário assinado por talentos como Sérgio Rodrigues e Jader Almeida.</p></article><article className={styles.detailCard}><Dumbbell size={22} /><h3>Bem-estar completo</h3><p>Academia com assinatura Flex Home, piscina, espaços lúdicos e ambientes para receber.</p></article></div></div></section>

    <section className={`${styles.section} ${styles.paper}`} id="tipologias"><div className={styles.container}><div className={styles.headingDark}><p className={styles.kicker}>Tipologias</p><h2>Plantas flexíveis para o seu momento.</h2><p>Conheça as tipologias apresentadas no material oficial e receba as plantas atualizadas no atendimento.</p></div><div className={styles.planGrid}>{typologies.map((item) => <article className={styles.planCard} key={item.title}><Image src={`/brand/urban-horizonte/${item.image}`} alt={`Planta ${item.title} do Urban Horizonte`} width={1600} height={900} quality={90} sizes="(max-width: 700px) 100vw, 33vw" /><div><span>Planta apresentada no folder</span><strong>{item.title}</strong><p>{item.text}</p><a href="#atendimento">Receber a planta <ArrowRight size={14} /></a></div></article>)}</div></div></section>

    <section className={styles.amenitySection}><div className={styles.container}><div className={styles.amenityIntro}><p className={styles.kicker}>Áreas comuns</p><h2>Conforto com o lago no cenário.</h2><p>Ambientes para celebrar, cuidar do corpo, brincar e desacelerar — organizados a partir da ficha e da apresentação oficial.</p></div><div className={styles.amenityGrid}>{amenities.map((item) => <span key={item}><Check size={15} />{item}</span>)}</div></div></section>

    <section className={styles.gallerySection} id="galeria"><div className={styles.container}><div className={styles.headingLight}><p className={styles.kicker}>Galeria</p><h2>Urban Design em cada detalhe.</h2><p>Imagens extraídas da apresentação oficial do Urban Horizonte e tratadas em alta resolução.</p></div><div className={styles.galleryGrid}>{gallery.map(([src, alt], index) => <figure key={src} className={index === 0 || index === 4 ? styles.galleryFeature : ""}><Image src={`/brand/urban-horizonte/${src}`} alt={alt} width={1600} height={900} quality={90} sizes="(max-width: 700px) 100vw, 50vw" /><figcaption>{alt}</figcaption></figure>)}</div></div></section>

    <section className={styles.location} id="localizacao"><div className={styles.locationPanel}><p className={styles.kicker}>Localização</p><h2>Na Orla 14, perto de onde a vida acontece.</h2><p>More na Graciosa, em Palmas/TO, com restaurantes, escolas, conveniências e a Praia da Graciosa aos seus pés.</p><div className={styles.locationFacts}><div><strong>Orla 14</strong><span>Graciosa · Palmas/TO</span></div><div><strong>Lago de Palmas</strong><span>vista permanente</span></div><div><strong>Entregue</strong><span>pronto para morar</span></div></div><a className={styles.primaryButton} href={mapsUrl} target="_blank" rel="noreferrer">Abrir localização <MoveUpRight size={16} /></a></div><div className={styles.locationArt}><Image src="/brand/urban-horizonte/location.jpg" alt="Orla 14 e o Lago de Palmas" fill quality={90} sizes="50vw" /><div className={styles.locationLabel}><Compass size={26} /><span>Urban Horizonte</span><small>Graciosa · Orla 14 · Palmas/TO</small></div></div></section>

    <section className={styles.contact} id="atendimento"><div className={`${styles.container} ${styles.contactGrid}`}><div className={styles.contactCopy}><p className={styles.kicker}>Atendimento direto</p><h2>Conheça o Horizonte com clareza.</h2><p>Eu apresento o projeto, envio as plantas e retorno com a disponibilidade mais recente para o seu perfil.</p><div className={styles.checkList}><span><Check size={16} /> Plantas atualizadas</span><span><Check size={16} /> Visita e localização</span><span><Check size={16} /> Atendimento personalizado</span></div><div className={styles.broker}><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares, corretor de imóveis" width={64} height={76} quality={90} /><span><strong>Pedro Soares</strong><small>Corretor de imóveis · CRECI 5861-TO</small></span></div></div><UrbanHorizonteLeadForm /></div></section>
    <footer className={styles.footer}><span>URBAN HORIZONTE · PALMAS / TO</span><a href="#inicio">Voltar ao início <ArrowDown size={14} /></a></footer>
  </main>;
}
