import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, Check, Compass, Leaf, MapPin, MessageCircle, MoveUpRight, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { TrackedWhatsAppLink } from "@/components/public/tracked-whatsapp-link";
import { UrbanRaroLeadForm } from "@/components/public/urban-raro-lead-form";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";
import styles from "./raro.module.css";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/urban-raro`;
const raroMessage = "Olá, Pedro. Quero conhecer o Urban Raro e receber a apresentação, plantas e condições.";
const whatsappUrl = buildWhatsAppUrl(raroMessage);
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Quadra+ARSE+41+Alameda+1,+06,+Palmas+-+TO";

export const metadata: Metadata = {
  title: "Urban Raro | Apartamentos em frente ao Parque Cesamar",
  description: "Conheça o Urban Raro: apenas 16 apartamentos-casa em frente ao Parque Cesamar, com plantas de 3 e 4 quartos, piscina privativa e arquitetura autoral.",
  keywords: ["Urban Raro", "apartamentos em Palmas", "Parque Cesamar", "Urban Design Palmas"],
  alternates: { canonical: pageUrl },
  openGraph: { type: "website", locale: "pt_BR", url: pageUrl, title: "Urban Raro | Raro por dentro e por fora", description: "Apartamentos-casa em frente ao Parque Cesamar, com piscina privativa e apenas 16 unidades.", images: [{ url: `${siteUrl}/brand/urban-raro/park-pool.jpg`, alt: "Urban Raro em frente ao Parque Cesamar" }] },
  twitter: { card: "summary_large_image", title: "Urban Raro | Apartamentos em Palmas", description: "Conheça o Urban Raro e receba as plantas atualizadas.", images: [`${siteUrl}/brand/urban-raro/park-pool.jpg`] }
};

const highlights = [["253 a 423 m²", "áreas anunciadas"], ["3 a 4", "quartos"], ["16", "apartamentos-casa"], ["Pronto", "para morar"]];
const gallery = [
  ["park-pool.jpg", "Vista para o Parque Cesamar"], ["exterior.jpg", "Arquitetura autoral"], ["lobby.jpg", "Lobby Urban Design"], ["gourmet.jpg", "Espaço gourmet"], ["piscina.jpg", "Piscina da área comum"], ["academia.jpg", "Academia com assinatura"], ["salao-festas.jpg", "Salão de festas"], ["living-varanda.jpg", "Integração entre living e varanda"], ["suite-master.jpg", "Suíte master"]
];
const amenities = ["Piscina comum aquecida", "Espaço gourmet com churrasqueira", "Brinquedoteca e playground", "Academia", "Salão de festas", "Delivery room", "Usina solar nas áreas comuns", "Reuso de águas pluviais", "Gerador para áreas comuns e elevadores", "Ponto para recarga de carros híbridos e elétricos", "Portaria remota preparada", "Espaços entregues mobiliados e equipados"];
const differentials = [
  { icon: Leaf, title: "Um mar verde como horizonte", text: "O Raro está em frente ao Parque Cesamar, trazendo brisa, frescor e uma vista definitiva para a rotina." },
  { icon: Waves, title: "Piscina privativa na varanda", text: "As plantas apresentadas no folder valorizam a integração entre living, varanda e a experiência de estar em casa." },
  { icon: ShieldCheck, title: "Privacidade em cada andar", text: "São apenas 16 apartamentos-casa, com uma unidade por andar nas 15 pavimentações tipo e cobertura duplex." }
];

export default function UrbanRaroPage() {
  return <main className={styles.landing}>
    <LandingPageTracker landingPageSlug="urban-raro" />
    <header className={styles.nav}>
      <a className={styles.brand} href="#inicio" aria-label="Urban Raro"><span>URBAN DESIGN</span><strong>RARO</strong></a>
      <nav aria-label="Navegação principal"><a href="#projeto">O projeto</a><a href="#plantas">Plantas</a><a href="#galeria">Galeria</a><a href="#localizacao">Localização</a></nav>
      <TrackedWhatsAppLink className={styles.navCta} landingPageSlug="urban-raro" messageTemplate={raroMessage} href={whatsappUrl} target="_blank" rel="noreferrer">Falar com Pedro <MessageCircle size={15} /></TrackedWhatsAppLink>
    </header>

    <section className={styles.hero} id="inicio">
      <div className={styles.heroCopy}><p className={styles.eyebrow}><span /> Entregue · Plano Diretor Sul</p><p className={styles.overline}>RARO POR DENTRO E POR FORA</p><h1>O verde como horizonte.</h1><p className={styles.heroLede}>Apartamentos-casa em frente ao Parque Cesamar, com arquitetura autoral, piscina privativa e uma escala rara de privacidade.</p><div className={styles.actions}><a className={styles.primaryButton} href="#atendimento">Conhecer o Raro <ArrowRight size={17} /></a><a className={styles.textLink} href="#projeto">Descobrir o projeto <ArrowDown size={15} /></a></div><div className={styles.heroFoot}><span><MapPin size={14} /> Palmas / TO</span><span>ARSE 41 · Alameda 1, 06</span></div></div>
      <div className={styles.heroVisual}><Image src="/brand/urban-raro/park-pool.jpg" alt="Vista do Urban Raro para o Parque Cesamar" fill priority quality={90} sizes="(max-width: 800px) 100vw, 54vw" /><div className={styles.heroOverlay} /><div className={styles.heroStamp}><span>16 APARTAMENTOS-CASA</span><strong>RARO</strong><small>em frente ao Parque Cesamar</small></div><div className={styles.heroCaption}>Folder oficial Urban Design · imagem de apresentação</div></div>
    </section>

    <section className={styles.statStrip} aria-label="Resumo do empreendimento"><div className={styles.container}>{highlights.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

    <section className={`${styles.section} ${styles.paper}`} id="projeto"><div className={`${styles.container} ${styles.story}`}><div><p className={styles.kicker}>O projeto</p><h2>Um apartamento-casa com o Parque Cesamar à frente.</h2></div><div className={styles.storyCopy}><p>O Urban Raro foi desenhado para quem procura uma relação mais próxima com a paisagem, sem abrir mão de uma arquitetura autoral e de uma experiência residencial completa.</p><p>Com apenas 16 apartamentos-casa e uma unidade por andar, o projeto combina privacidade, ambientes generosos e a possibilidade de personalizar a planta para a realidade de cada família.</p><a className={styles.textLinkDark} href="#diferenciais">Ver os diferenciais <ArrowRight size={15} /></a></div></div></section>

    <section className={`${styles.section} ${styles.ink}`} id="diferenciais"><div className={styles.container}><div className={styles.heading}><p className={styles.kicker}>A experiência Raro</p><h2>O essencial ganha uma nova escala.</h2><p>Informações organizadas a partir do folder e da ficha do Urban Vendas, sem exposição de valores.</p></div><div className={styles.detailGrid}>{differentials.map(({ icon: Icon, title, text }) => <article key={title} className={styles.detailCard}><Icon size={22} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className={`${styles.section} ${styles.paper}`} id="plantas"><div className={styles.container}><div className={styles.headingDark}><p className={styles.kicker}>Plantas</p><h2>Espaços para viver do seu jeito.</h2><p>O folder apresenta plantas flexíveis, com piscina privativa, churrasqueira a carvão na varanda e esquadrias das suítes preparadas para automação.</p></div><div className={styles.planGrid}><article className={styles.planCard}><Image src="/brand/urban-raro/planta-quatro-suites.jpg" alt="Planta do apartamento Urban Raro com quatro suítes" width={1600} height={900} quality={90} sizes="(max-width: 700px) 100vw, 50vw" /><div><span>Planta apresentada no folder</span><strong>4 suítes plenas</strong><p>Com piscina privativa, varanda gourmet e possibilidade de personalização.</p><a href="#atendimento">Receber esta planta <ArrowRight size={14} /></a></div></article><article className={styles.planCard}><Image src="/brand/urban-raro/planta-tres-suites.jpg" alt="Planta personalizada do apartamento Urban Raro com três suítes" width={1600} height={900} quality={90} sizes="(max-width: 700px) 100vw, 50vw" /><div><span>Planta personalizada</span><strong>3 suítes plenas</strong><p>Uma configuração com living ampliado e soluções para diferentes estilos de vida.</p><a href="#atendimento">Quero conhecer <ArrowRight size={14} /></a></div></article></div></div></section>

    <section className={styles.amenitySection}><div className={styles.container}><div className={styles.amenityIntro}><p className={styles.kicker}>Diferenciais exclusivos</p><h2>Conforto pensado nos detalhes.</h2><p>Das áreas comuns entregues mobiliadas e equipadas às soluções de energia, segurança e praticidade do dia a dia.</p></div><div className={styles.amenityGrid}>{amenities.map((item) => <span key={item}><Check size={15} />{item}</span>)}</div></div></section>

    <section className={styles.gallerySection} id="galeria"><div className={styles.container}><div className={styles.headingLight}><p className={styles.kicker}>Galeria</p><h2>Urban Design em cada ambiente.</h2><p>Imagens extraídas da apresentação oficial do Urban Raro.</p></div><div className={styles.galleryGrid}>{gallery.map(([src, alt], index) => <figure key={src} className={index === 0 || index === 7 ? styles.galleryFeature : ""}><Image src={`/brand/urban-raro/${src}`} alt={alt} width={1600} height={900} quality={90} sizes="(max-width: 700px) 100vw, 50vw" /><figcaption>{alt}</figcaption></figure>)}</div></div></section>

    <section className={styles.location} id="localizacao"><div className={styles.locationPanel}><p className={styles.kicker}>Localização</p><h2>Em frente ao Parque Cesamar.</h2><p>O Urban Raro está na Quadra ARSE 41 Alameda 1, 06, no Plano Diretor Sul de Palmas/TO.</p><div className={styles.locationFacts}><div><strong>ARSE 41</strong><span>Quadra do empreendimento</span></div><div><strong>Plano Diretor Sul</strong><span>Palmas / TO</span></div><div><strong>Parque Cesamar</strong><span>vista definitiva</span></div></div><a className={styles.primaryButton} href={mapsUrl} target="_blank" rel="noreferrer">Abrir localização <MoveUpRight size={16} /></a></div><div className={styles.locationArt}><Image src="/brand/urban-raro/exterior.jpg" alt="Fachada do Urban Raro" fill quality={90} sizes="50vw" /><div className={styles.locationLabel}><Compass size={26} /><span>Urban Raro</span><small>Quadra ARSE 41 · Palmas/TO</small></div></div></section>

    <section className={styles.contact} id="atendimento"><div className={`${styles.container} ${styles.contactGrid}`}><div className={styles.contactCopy}><p className={styles.kicker}>Atendimento direto</p><h2>Conheça o Urban Raro com clareza.</h2><p>Eu apresento o projeto, envio as plantas e retorno com a disponibilidade mais recente para o seu perfil.</p><div className={styles.checkList}><span><Check size={16} /> Plantas atualizadas</span><span><Check size={16} /> Visita e localização</span><span><Check size={16} /> Atendimento personalizado</span></div><div className={styles.broker}><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares, corretor de imóveis" width={64} height={76} quality={90} /><span><strong>Pedro Soares</strong><small>Corretor de imóveis · CRECI 5861-TO</small></span></div></div><UrbanRaroLeadForm /></div></section>
    <footer className={styles.footer}><span>URBAN RARO · PALMAS / TO</span><a href="#inicio">Voltar ao início <ArrowDown size={14} /></a></footer>
  </main>;
}
