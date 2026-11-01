import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Compass,
  Layers3,
  MapPin,
  MessageCircle,
  MoveUpRight,
  Sparkles
} from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { TrackedWhatsAppLink } from "@/components/public/tracked-whatsapp-link";
import { UrbanAtrioLeadForm } from "@/components/public/urban-atrio-lead-form";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";
import styles from "./atrio.module.css";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/urban-atrio`;
const atrioMessage = "Olá, Pedro. Quero conhecer o Urban Átrio e receber a apresentação, plantas e condições.";
const whatsappUrl = buildWhatsAppUrl(atrioMessage);
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Quadra+ACSU+SE20,+Avenida+Siqueira+Campos,+17,+Palmas+-+TO";

export const metadata: Metadata = {
  title: "Urban Átrio | Apartamentos em obras no Plano Diretor Sul",
  description: "Conheça o Urban Átrio: empreendimento residencial em obras, com plantas de 37 a 115 m², penthouses, 1 a 3 suítes e entrega prevista para 2027 em Palmas/TO.",
  keywords: ["Urban Átrio", "apartamentos em Palmas", "lançamento Plano Diretor Sul", "imóveis Urban Palmas"],
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: pageUrl,
    title: "Urban Átrio | A próxima fase de Palmas começa aqui",
    description: "Apartamentos de 1 a 3 quartos em obras no Plano Diretor Sul, com entrega prevista para 2027.",
    images: [{ url: `${siteUrl}/brand/urban-atrio/hero.jpg`, alt: "Piscina do Urban Átrio" }]
  },
  twitter: { card: "summary_large_image", title: "Urban Átrio | Apartamentos em Palmas", description: "Conheça o Urban Átrio e receba as plantas atualizadas.", images: [`${siteUrl}/brand/urban-atrio/hero.jpg`] }
};

const highlights = [
  ["37 a 115 m²", "plantas residenciais"],
  ["1 a 3", "suítes"],
  ["2.200 m²", "lazer resort"],
  ["2027", "entrega prevista"]
];

const typologies = [
  { title: "1 suíte e plantas compactas", area: "a partir de 37 m²", text: "Uma configuração objetiva para viver a cidade com praticidade e personalização." },
  { title: "Apartamentos de 2 suítes", area: "70 a 87 m²", text: "Plantas para equilibrar rotina, conforto e flexibilidade." },
  { title: "3 suítes e penthouses", area: "115 m² + penthouses", text: "Mais espaço para receber, trabalhar e construir novos momentos." }
];

const details = [
  { icon: Layers3, title: "Lazer em escala resort", text: "São 2.200 m² de lazer, com piscina aquecida com raia de 25 m, deck molhado, módulo infantil e piscina exclusiva do Gourmet Club." },
  { icon: Sparkles, title: "Plantas mais versáteis", text: "O projeto foi concebido com menos vigas para facilitar a personalização das plantas, reunindo apartamentos de 1 a 3 suítes e penthouses." },
  { icon: Compass, title: "Morar, trabalhar e receber", text: "Coworking, sala de reuniões, lavanderia, Gourmet Lounge, academia Flex Home e salão de festas de 236 m² complementam a experiência." }
];

export default function UrbanAtrioPage() {
  return (
    <main className={styles.landing}>
      <LandingPageTracker landingPageSlug="urban-atrio" />
      <header className={styles.nav}>
        <a className={styles.brand} href="#inicio" aria-label="Urban Átrio">
          <span>URBAN</span>
          <strong>ÁTRIO</strong>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#projeto">O projeto</a>
          <a href="#tipologias">Tipologias</a>
          <a href="#localizacao">Localização</a>
        </nav>
        <TrackedWhatsAppLink className={styles.navCta} landingPageSlug="urban-atrio" messageTemplate={atrioMessage} href={whatsappUrl} target="_blank" rel="noreferrer">
          Falar com Pedro <MessageCircle size={15} />
        </TrackedWhatsAppLink>
      </header>

      <section className={styles.hero} id="inicio">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span /> Em obras · Plano Diretor Sul</p>
          <p className={styles.overline}>A PRÓXIMA FASE DE PALMAS COMEÇA AQUI</p>
          <h1>Um novo jeito de ocupar a cidade.</h1>
          <p className={styles.heroLede}>O Urban Átrio reúne apartamentos de 1 a 3 quartos em um endereço que acompanha o movimento de Palmas.</p>
          <div className={styles.actions}>
            <a className={styles.primaryButton} href="#atendimento">Conhecer o Átrio <ArrowRight size={17} /></a>
            <a className={styles.textLink} href="#projeto">Descobrir o projeto <ArrowDown size={15} /></a>
          </div>
          <div className={styles.heroFoot}><span><MapPin size={14} /> Palmas / TO</span><span>ACSU SE20 · Avenida Siqueira Campos, 17</span></div>
        </div>
        <div className={styles.heroArt} aria-label="Piscina do Urban Átrio">
          <Image className={styles.heroImage} src="/brand/urban-atrio/hero.jpg" alt="Piscina aquecida com raia do Urban Átrio" fill priority sizes="(max-width: 850px) 100vw, 54vw" />
          <div className={styles.heroShade} />
          <div className={styles.artGrid} />
          <div className={styles.artFrame}><span>ÁTRIO</span><strong>2027</strong><small>um projeto para a próxima fase</small></div>
          <div className={styles.artOrb} />
          <div className={styles.artCaption}>Piscina aquecida · perspectiva ilustrada</div>
        </div>
      </section>

      <section className={styles.statStrip} aria-label="Resumo do empreendimento">
        <div className={styles.container}>{highlights.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      </section>

      <section className={`${styles.section} ${styles.paper}`} id="projeto">
        <div className={`${styles.container} ${styles.story}`}>
          <div><p className={styles.kicker}>O projeto</p><h2>Arquitetura para acompanhar o seu movimento.</h2></div>
          <div className={styles.storyCopy}><p>O Urban Átrio traz o conceito de arquitetura mundial para a localização mais pulsante de Palmas. Um empreendimento residencial em obras, pensado para conectar moradia, mobilidade e a energia de uma região que continua crescendo.</p><p>Com plantas de 37 a 115 m², penthouses e opções de 1 a 3 suítes, o projeto combina flexibilidade de personalização com uma área de lazer estilo resort.</p><a className={styles.textLinkDark} href="#tipologias">Explorar tipologias <ArrowRight size={15} /></a></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.ink}`}>
        <div className={styles.container}>
          <div className={styles.heading}><p className={styles.kicker}>Por que o Átrio</p><h2>Um endereço que abre novas possibilidades.</h2><p>Informações organizadas a partir da ficha do Urban Vendas e apresentadas sem exposição de valores.</p></div>
          <div className={styles.detailGrid}>{details.map(({ icon: Icon, title, text }) => <article key={title} className={styles.detailCard}><Icon size={22} /><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.paper}`} aria-label="Imagens oficiais do Urban Átrio">
        <div className={styles.container}>
          <div className={styles.headingDark}><p className={styles.kicker}>Por dentro do Átrio</p><h2>Ambientes pensados para cada ritmo.</h2><p>Perspectivas ilustradas extraídas da apresentação oficial do empreendimento. Consulte a versão vigente dos materiais no atendimento.</p></div>
          <div className={styles.galleryGrid}>
            <figure className={`${styles.galleryCard} ${styles.galleryCardWide}`}><Image src="/brand/urban-atrio/entrada.jpg" alt="Praça de entrada do Urban Átrio" fill sizes="(max-width: 850px) 90vw, 58vw" /><figcaption>Praça de entrada</figcaption></figure>
            <figure className={styles.galleryCard}><Image src="/brand/urban-atrio/lobby.jpg" alt="Lobby do Urban Átrio" fill sizes="(max-width: 850px) 90vw, 38vw" /><figcaption>Lobby</figcaption></figure>
            <figure className={styles.galleryCard}><Image src="/brand/urban-atrio/academia.jpg" alt="Academia do Urban Átrio" fill sizes="(max-width: 850px) 90vw, 38vw" /><figcaption>Academia Flex Home</figcaption></figure>
            <figure className={`${styles.galleryCard} ${styles.galleryCardWide}`}><Image src="/brand/urban-atrio/gourmet-club.jpg" alt="Gourmet Club com piscina do Urban Átrio" fill sizes="(max-width: 850px) 90vw, 58vw" /><figcaption>Gourmet Club com piscina</figcaption></figure>
          </div>
          <div className={styles.planFeature}><figure className={styles.planImage}><Image src="/brand/urban-atrio/planta-115.jpg" alt="Planta de referência do apartamento final 01 com 115 metros quadrados e 3 suítes" fill sizes="(max-width: 850px) 90vw, 48vw" /><figcaption>Planta de referência · Final 01</figcaption></figure><div className={styles.planCopy}><p className={styles.kicker}>Plantas</p><h3>Personalização começa no desenho.</h3><p>O folder oficial apresenta plantas de 1, 2 e 3 suítes, além de penthouses. Esta é uma referência de 115 m²; layouts, finais e disponibilidade devem ser confirmados no atendimento.</p><a className={styles.textLinkDark} href="#atendimento">Receber as plantas <ArrowRight size={15} /></a></div></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.paper}`} id="tipologias">
        <div className={styles.container}><div className={styles.headingDark}><p className={styles.kicker}>Tipologias</p><h2>O espaço certo para a sua próxima fase.</h2><p>As áreas e a disponibilidade podem ser atualizadas durante a obra. Receba a versão vigente das plantas no atendimento.</p></div><div className={styles.typeGrid}>{typologies.map((type) => <article className={styles.typeCard} key={type.title}><span>Urban Átrio</span><strong>{type.area}</strong><h3>{type.title}</h3><p>{type.text}</p><a href="#atendimento">Quero conhecer <ArrowRight size={14} /></a></article>)}</div></div>
      </section>

      <section className={styles.progress}>
        <div className={`${styles.container} ${styles.progressGrid}`}><div><p className={styles.kicker}>Momento do empreendimento</p><h2>Em obras, com horizonte para 2027.</h2><p>O Urban Átrio está em construção. Fale comigo para receber o estágio atualizado, as plantas disponíveis e a orientação adequada para o seu perfil.</p></div><div className={styles.timeline}><div><span>Agora</span><strong>Em obras</strong><small>acompanhamento do projeto</small></div><div><span>08/2027</span><strong>Entrega prevista</strong><small>confirme a versão vigente</small></div><div><span>Seu próximo passo</span><strong>Atendimento personalizado</strong><small>plantas e condições atualizadas</small></div></div></div>
      </section>

      <section className={styles.location} id="localizacao"><div className={styles.locationPanel}><p className={styles.kicker}>Localização</p><h2>Plano Diretor Sul, perto do que vem pela frente.</h2><p>O Urban Átrio está na Quadra ACSU SE20, Avenida Siqueira Campos, 17, em Palmas/TO. Consulte a localização e converse comigo sobre o entorno.</p><div className={styles.locationFacts}><div><strong>ACSU SE20</strong><span>Quadra do empreendimento</span></div><div><strong>Palmas / TO</strong><span>Plano Diretor Sul</span></div><div><strong>2027</strong><span>entrega prevista</span></div></div><a className={styles.primaryButton} href={mapsUrl} target="_blank" rel="noreferrer">Abrir localização <MoveUpRight size={16} /></a></div><div className={styles.locationArt}><div><MapPin size={28} /><span>Urban Átrio</span><small>Quadra ACSU SE20</small></div></div></section>

      <section className={styles.contact} id="atendimento"><div className={`${styles.container} ${styles.contactGrid}`}><div className={styles.contactCopy}><p className={styles.kicker}>Atendimento direto</p><h2>Conheça o Urban Átrio com clareza.</h2><p>Eu apresento o projeto, explico as tipologias e retorno com a disponibilidade mais recente, sem compromisso.</p><div className={styles.checkList}><span><Check size={16} /> Plantas atualizadas</span><span><Check size={16} /> Estágio da obra</span><span><Check size={16} /> Atendimento personalizado</span></div><div className={styles.broker}><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares, corretor de imóveis" width={64} height={76} /><span><strong>Pedro Soares</strong><small>Corretor de imóveis · CRECI 5861-TO</small></span></div></div><UrbanAtrioLeadForm /></div></section>
      <footer className={styles.footer}><span>URBAN ÁTRIO · PALMAS / TO</span><a href="#inicio">Voltar ao início <ArrowDown size={14} /></a></footer>
    </main>
  );
}
