import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, Baby, Bike, Building2, Check, Dumbbell, ExternalLink, Heart, MapPin, MessageCircle, PartyPopper, PawPrint, Waves, Wine } from "lucide-react";
import { ComodoroLeadForm } from "@/components/public/comodoro-lead-form";
import { ComodoroGallery } from "@/components/public/comodoro-gallery";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/comodoro`;
const whatsappUrl = buildWhatsAppUrl("Olá, Pedro. Quero conhecer o Comodoro by Fama e receber a apresentação, plantas e condições.");
const projectFolderUrl = "https://drive.google.com/drive/folders/15c4MQnnXU43ucaT84pmIEgUzoTfl4Xia";
const videoUrls = [
  "https://drive.google.com/file/d/1Xyd5O7imtxzRyUCd_FdWQdwElNMVusdj/view?usp=drivesdk",
  "https://drive.google.com/file/d/1f37KcpjtdpsCWqEqWd55C2UsB-f6QMNN/view?usp=drivesdk"
];

export const metadata: Metadata = {
  title: "Comodoro by Fama | Uma honraria na Orla 14",
  description: "Conheça o Comodoro by Fama: apartamentos de 210,37 m² e penthouses de 323,93 m², lazer completo e a paisagem do Lago de Palmas.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: pageUrl,
    title: "Comodoro by Fama | Uma honraria na Orla 14",
    description: "Um projeto orgulhosamente tocantinense na Praia da Graciosa, com vista para o Lago de Palmas.",
    images: [{ url: `${siteUrl}/brand/comodoro/comodoro-01.png` }]
  }
};

const highlights = [
  { value: "210,37 m²", label: "apartamento · 3 suítes" },
  { value: "323,93 m²", label: "penthouses" },
  { value: "Orla 14", label: "Praia da Graciosa" },
  { value: "Vista lago", label: "Palmas · Tocantins" }
];

const amenities = [
  { icon: Waves, title: "Lago dentro e fora", text: "Piscinas adulto e infantil, espelhos d’água e borda infinita evocam o Rio Tocantins, o Lago de Palmas e os fervedouros do Jalapão." },
  { icon: Dumbbell, title: "Academia da cidade", text: "Academia projetada com consultoria exclusiva da Hiit, uma marca genuinamente tocantinense." },
  { icon: Bike, title: "Beach Arena", text: "Quadra inspirada nas dunas do Jalapão para esportes de areia, com bicicletário e ferramentaria para pequenos reparos." },
  { icon: Heart, title: "Wellness", text: "Sauna outdoor, Beauty Center e Espaço Wellness para renovar as energias e cuidar do corpo e da mente." },
  { icon: PartyPopper, title: "Celebrações", text: "Salão de festas, Fama VIP Lounge, varanda de jogos, Wine Bar, Lounge, Espaço Gourmet e churrasqueiras." },
  { icon: PawPrint, title: "Comodidade real", text: "Empório by Fama, Espaço Storage para compras online e Espaço Pet para cuidar de toda a família." },
  { icon: Baby, title: "Infância bem cuidada", text: "Brinquedoteca com fauna tocantinense, arte exclusiva da artista Bromou e playground multifuncional." },
  { icon: Building2, title: "Gabinete Fama", text: "Um espaço intimista anexo ao hall para receber convidados e fazer reuniões rápidas com privacidade." }
];

const values = ["Excelência", "Inovação", "Valorização das pessoas", "Cordialidade", "Integridade", "Diversidade", "Sustentabilidade"];

const comodoroGallery = [
  { src: "/brand/comodoro/gallery/acesso.webp", label: "Acesso principal", caption: "Uma chegada à altura do endereço." },
  { src: "/brand/comodoro/gallery/area-de-lazer.webp", label: "Área de lazer", caption: "O Lago de Palmas como cenário." },
  { src: "/brand/comodoro/gallery/piscina-adulto.webp", label: "Piscina adulto", caption: "Dias de descanso com vista aberta." },
  { src: "/brand/comodoro/gallery/pisinca-infantil.webp", label: "Piscina infantil", caption: "Diversão para os pequenos." },
  { src: "/brand/comodoro/gallery/playground-externo.webp", label: "Playground externo", caption: "Infância cercada de natureza." },
  { src: "/brand/comodoro/gallery/playground.webp", label: "Playground", caption: "Brincar também faz parte da rotina." },
  { src: "/brand/comodoro/gallery/brinqudoteca.webp", label: "Brinquedoteca", caption: "Um universo lúdico inspirado no Tocantins." },
  { src: "/brand/comodoro/gallery/academia.webp", label: "Academia", caption: "Movimento com uma vista extraordinária." },
  { src: "/brand/comodoro/gallery/espaco-fitness.webp", label: "Espaço fitness", caption: "Bem-estar pensado em todos os detalhes." },
  { src: "/brand/comodoro/gallery/beauty-center.webp", label: "Beauty Center", caption: "Cuidado e beleza sem sair de casa." },
  { src: "/brand/comodoro/gallery/sauna-outdoor.webp", label: "Sauna outdoor", caption: "Pausa, água e tranquilidade." },
  { src: "/brand/comodoro/gallery/lobby-subsolo.webp", label: "Lobby subsolo", caption: "Uma experiência acolhedora desde a chegada." },
  { src: "/brand/comodoro/gallery/salao-de-festa.webp", label: "Salão de festa", caption: "Receber bem é uma arte." },
  { src: "/brand/comodoro/gallery/salao-de-festas.webp", label: "Salão de festas", caption: "Celebrações com o horizonte ao fundo." },
  { src: "/brand/comodoro/gallery/varanda-de-jogos.webp", label: "Varanda de jogos", caption: "Tempo livre com personalidade." },
  { src: "/brand/comodoro/gallery/vista-apartamento.webp", label: "Vista do apartamento", caption: "A paisagem que transforma a rotina." },
] as const;

export default function ComodoroPage() {
  return (
    <div className="comodoro-landing">
      <LandingPageTracker landingPageSlug="comodoro-by-fama" />
      <section className="comodoro-hero" id="inicio">
        <div className="comodoro-hero-panel">
          <header className="comodoro-nav">
            <a href="#inicio" className="comodoro-logo" aria-label="Comodoro by Fama"><Image src="/brand/comodoro/logo-comodoro-atualizada.png" alt="Comodoro by Fama" width={235} height={103} priority /></a>
            <nav aria-label="Navegação principal"><a href="#projeto">O projeto</a><a href="#experiencia">Experiência</a><a href="#plantas">Plantas</a><a href="#atendimento">Atendimento</a></nav>
            <a className="comodoro-button comodoro-button--outline comodoro-button--small" href="#atendimento">Falar com Pedro</a>
          </header>
          <div className="comodoro-hero-copy">
            <p className="comodoro-eyebrow"><span /> Orla 14 · Palmas / TO</p>
            <p className="comodoro-overline">O grande palco da sua homenagem</p>
            <h1>Mais que um empreendimento.<br /><em>Uma honraria.</em></h1>
            <p className="comodoro-hero-lede">Exclusivamente para você, que já venceu todas as etapas da vida, apresentamos a recompensa: o privilégio de viver na Orla de Palmas.</p>
            <div className="comodoro-hero-actions"><a className="comodoro-button comodoro-button--sand" href="#atendimento">Quero conhecer <ArrowRight size={17} /></a><a className="comodoro-hero-link" href="#projeto">Descobrir o projeto <ArrowDown size={15} /></a></div>
          </div>
          <div className="comodoro-hero-signature">By Fama <span>Orgulho de ser tocantinense</span></div>
        </div>
        <div className="comodoro-hero-visual"><Image src="/brand/comodoro/site/fachada.webp" alt="Fachada do Comodoro by Fama ao pôr do sol" fill priority sizes="1600px" quality={95} className="comodoro-hero-image" /><div className="comodoro-hero-wash" /><span className="comodoro-image-caption">Fachada · Comodoro by Fama</span></div>
      </section>

      <section className="comodoro-stat-strip" aria-label="Resumo do empreendimento"><div className="comodoro-container comodoro-stat-grid">{highlights.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div></section>

      <section id="projeto" className="comodoro-section comodoro-section--paper"><div className="comodoro-container comodoro-story-grid"><div className="comodoro-story-copy"><p className="comodoro-kicker">Uma homenagem ao nosso lugar</p><h2>O Tocantins inteiro aqui dentro.</h2><p>Comodoro é mais que um empreendimento. É uma honraria. Uma homenagem ao nosso Estado, à nossa cidade e aos desbravadores que fizeram e fazem a prosperidade deste local.</p><p>Inspirada na leveza do mundo náutico palmense e na beleza da Orla 14, a Fama criou um projeto único, que ressalta em cada detalhe os aspectos da cultura tocantinense.</p><a className="comodoro-text-link" href="#localizacao">Conhecer a localização <ArrowRight size={16} /></a></div><div className="comodoro-story-image"><Image src="/brand/comodoro/site/living.webp" alt="Living de apartamento do Comodoro by Fama com vista para o lago" fill sizes="(max-width: 900px) 100vw, 48vw" /><span>Living com a paisagem do Lago de Palmas</span></div></div></section>

      <section id="localizacao" className="comodoro-location"><div className="comodoro-container comodoro-location-grid"><div><p className="comodoro-kicker">Um terreno que valoriza o projeto</p><h2>O endereço mais desejado de Palmas.</h2><p>Na Praia da Graciosa, o Comodoro ocupa uma posição privilegiada: perto do que a cidade oferece, com silêncio, tranquilidade e a melhor vista para o Lago de Palmas.</p><div className="comodoro-location-facts"><div><MapPin size={19} /><span><strong>Orla 14</strong><small>Praia da Graciosa · Palmas/TO</small></span></div><div><Waves size={19} /><span><strong>Vista para o lago</strong><small>O cartão-postal como horizonte</small></span></div></div><a className="comodoro-button comodoro-button--dark" href="https://www.google.com/maps/search/Orla+14+Palmas+TO" target="_blank" rel="noreferrer">Ver localização <ExternalLink size={16} /></a></div><div className="comodoro-location-quote"><span>“</span><p>Um projeto orgulhosamente feito por tocantinenses, pensando nos tocantinenses — sejam eles de nascimento ou de coração.</p><small>Comodoro by Fama</small></div></div></section>

      <section id="experiencia" className="comodoro-section comodoro-section--dark"><div className="comodoro-container"><div className="comodoro-section-heading"><p className="comodoro-kicker">O lago lá fora. O Tocantins inteiro aqui dentro.</p><h2>Cada detalhe enaltece o nosso Estado.</h2><p>Uma extensa área de lazer combina água, natureza, esporte, celebração e comodidade para uma vida cheia de vitórias.</p></div><div className="comodoro-feature-grid">{amenities.map(({ icon: Icon, title, text }) => <article className="comodoro-feature-card" key={title}><Icon size={23} strokeWidth={1.45} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="comodoro-gallery"><div className="comodoro-container"><div className="comodoro-section-heading comodoro-section-heading--gallery"><p className="comodoro-kicker">Ambientes Comodoro</p><h2>O alto padrão mora nos detalhes.</h2><p>Perspectivas oficiais, imagens dos ambientes e plantas do projeto reunidas para você explorar cada possibilidade de viver bem.</p></div><ComodoroGallery items={comodoroGallery} /></div></section>

      <section className="comodoro-media-band"><div className="comodoro-container comodoro-media-grid"><div className="comodoro-media-copy"><p className="comodoro-kicker">Veja o projeto</p><h2>Uma ideia que ganha vida em cada ambiente.</h2><p>Assista aos registros enviados do Comodoro e sinta a atmosfera de um projeto criado para quem valoriza cada conquista.</p><div className="comodoro-video-links">{videoUrls.map((url, index) => <a href={url} target="_blank" rel="noreferrer" key={url}><span className="comodoro-play">▶</span><span><strong>Vídeo do Comodoro {index + 1}</strong><small>Assistir no Google Drive <ExternalLink size={13} /></small></span></a>)}</div></div><div className="comodoro-media-image"><Image src="/brand/comodoro/site/storage.webp" alt="Espaço Storage do Comodoro by Fama" fill sizes="(max-width: 800px) 100vw, 52vw" /></div></div></section>

      <section id="plantas" className="comodoro-section comodoro-section--paper"><div className="comodoro-container comodoro-plans-grid"><div><p className="comodoro-kicker">Por dentro</p><h2>Espaços à altura da sua história.</h2><p className="comodoro-muted-copy">A obsessão da Fama por construir um produto de qualidade se traduz em duas opções generosas de planta, pensadas para oferecer conforto e privacidade.</p><div className="comodoro-check-list"><span><Check size={16} /> Apartamentos no pavimento tipo</span><span><Check size={16} /> 3 suítes</span><span><Check size={16} /> Penthouses exclusivas</span><span><Check size={16} /> Acabamentos de alto padrão</span></div></div><div className="comodoro-plan-cards"><article><span className="comodoro-plan-number">210,37</span><small>m²</small><h3>Apartamento</h3><p>3 suítes · pavimento tipo</p></article><article><span className="comodoro-plan-number">323,93</span><small>m²</small><h3>Penthouse</h3><p>Espaço, privacidade e uma nova forma de contemplar o lago</p></article></div></div></section>

      <section className="comodoro-fama"><div className="comodoro-container comodoro-fama-grid"><div><Image src="/brand/comodoro/fama-branco.png" alt="Fama Empreendimentos" width={265} height={92} className="comodoro-fama-logo" /><p className="comodoro-kicker">Da nossa família para sua família</p><h2>Construir projetos de vida é o nosso compromisso.</h2></div><div><p>A Fama é uma empresa familiar atuante no mercado de incorporação e construção, com foco em apartamentos e imóveis comerciais de alto padrão de qualidade.</p><p>Com necessidades em constante evolução, a marca empreende soluções inovadoras, valorizando a qualidade de vida das pessoas e a preservação do meio ambiente.</p><div className="comodoro-values">{values.map((value) => <span key={value}>{value}</span>)}</div></div></div></section>

      <section id="atendimento" className="comodoro-contact"><div className="comodoro-container comodoro-contact-grid"><div className="comodoro-contact-copy"><p className="comodoro-kicker">Seu próximo capítulo</p><h2>O Comodoro é para você.</h2><p>Se você valoriza a comodidade, a exclusividade e a beleza de viver na Orla de Palmas, eu apresento o projeto, explico as plantas e ajudo você a avaliar tudo com calma.</p><div className="comodoro-broker"><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares, corretor de imóveis" width={78} height={100} /><span><strong>Pedro Soares</strong><small>Corretor de imóveis · CRECI 5861-TO</small><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Falar no WhatsApp</a></span></div></div><ComodoroLeadForm /></div></section>

      <footer className="comodoro-footer"><div className="comodoro-container comodoro-footer-grid"><div><Image src="/brand/comodoro/logo-comodoro-atualizada.png" alt="Comodoro by Fama" width={190} height={83} /><p>O grande palco da sua homenagem.</p></div><div><a href={projectFolderUrl} target="_blank" rel="noreferrer">Ver materiais do projeto <ExternalLink size={14} /></a><small>Comodoro by Fama · Orla 14 · Palmas/TO</small><small>Imagens meramente ilustrativas. Projeto, materiais, acabamentos e condições deverão ser confirmados na apresentação comercial vigente.</small></div></div></footer>
      <a className="comodoro-whatsapp-float" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar sobre o Comodoro by Fama pelo WhatsApp"><MessageCircle size={19} /><span>Quero conhecer</span></a>
    </div>
  );
}
