import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown, ArrowRight, Building2, Check, ExternalLink, MapPin,
  MoveUpRight, Play, ShieldCheck, Sparkles, Waves
} from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { UrbanHauteLeadForm } from "@/components/public/urban-haute-lead-form";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/urban-haute`;
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=ACSU+NO13,+Avenida+JK,+Lote+02,+Palmas+-+TO";
const capimRouteUrl = "https://www.google.com/maps/dir/?api=1&destination=Capim+Dourado+Shopping,+Palmas+-+TO";
const videoUrl = "https://drive.google.com/file/d/17_030rAo987-uYs0aDUoc9uNTv6XT5yw/preview";
const plantsPdfUrl = "https://drive.google.com/file/d/1sWUCn2dwBJh5nlnSS6QvP5oG1KEKcEr6/view";

export const metadata: Metadata = {
  title: "Urban Haute | Alta arquitetura em Palmas",
  description: "Urban Haute: um mixed-use com residências, penthouses, offices e boulevard gastronômico ao lado do Capim Dourado Shopping, em Palmas/TO.",
  keywords: ["Urban Haute", "apartamentos em Palmas", "penthouses Palmas", "salas comerciais Palmas", "Capim Dourado Shopping"],
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website", locale: "pt_BR", url: pageUrl,
    title: "Urban Haute | Uma nova maneira de viver, trabalhar e investir",
    description: "Residências, offices, penthouses e boulevard gastronômico em um novo ícone urbano de Palmas.",
    images: [{ url: `${siteUrl}/brand/urban-haute/social-23.png`, width: 2250, height: 4000, alt: "Perspectiva do Urban Haute" }]
  },
  twitter: { card: "summary_large_image", title: "Urban Haute | Alta arquitetura em Palmas", description: "Conheça o Urban Haute, ao lado do Capim Dourado Shopping.", images: [`${siteUrl}/brand/urban-haute/social-23.png`] }
};

const highlights = [
  ["245 m", "altura declarada no material comercial"],
  ["63", "pavimentos de uso misto"],
  ["2.600 m²", "pavimento de lazer"],
  ["12", "lojas no boulevard gastronômico"]
];

const products = [
  { name: "Residências", area: "38 a 86 m²", detail: "1, 2 e 3 quartos", floor: "18º ao 48º pavimento", image: "/brand/urban-haute/plants/page-15.jpg" },
  { name: "Penthouses", area: "125 a 203 m²", detail: "Plantas exclusivas", floor: "50º ao 58º pavimento", image: "/brand/urban-haute/plants/page-35.jpg" },
  { name: "Haute Offices", area: "36 a 80 m²", detail: "Salas e lajes corporativas", floor: "6º ao 17º pavimento", image: "/brand/urban-haute/plants/page-17.jpg" },
  { name: "Boulevard", area: "12 lojas", detail: "Gastronomia e serviços", floor: "Térreo", image: "/brand/urban-haute/plants/page-04.jpg" }
];

const typologies = [
  { label: "1 quarto", area: "38,63 m²", floors: "19º ao 28º", image: "/brand/urban-haute/plants/page-15.jpg" },
  { label: "2 quartos", area: "49,69 a 79,21 m²", floors: "19º ao 48º", image: "/brand/urban-haute/plants/page-20.jpg" },
  { label: "3 quartos", area: "84,34 e 86,69 m²", floors: "18º e 44º ao 48º", image: "/brand/urban-haute/plants/page-22.jpg" },
  { label: "Penthouse", area: "125,25 a 203,09 m²", floors: "50º ao 58º", image: "/brand/urban-haute/plants/page-35.jpg" }
];

const amenities = [
  [Waves, "Rooftop Wellness", "Piscina panorâmica coberta, academia com curadoria Flex, espaço mulher e massagem."],
  [Sparkles, "Lazer elevado", "Piscinas, quadras, salão de festas, playground, brinquedoteca e três espaços gourmet."],
  [Building2, "Infraestrutura corporativa", "Auditório, convenções, salas de reuniões, lobby exclusivo e ambientes de integração."],
  [ShieldCheck, "Um endereço completo", "Moradia, trabalho, lazer e gastronomia conectados em um único mixed-use."],
];

const gallery = [
  ["/brand/urban-haute/social-23.png", "Paisagismo contemporâneo e fachada"],
  ["/brand/urban-haute/social-04.png", "Piscina panorâmica coberta"],
  ["/brand/urban-haute/social-01.png", "Academia Flex"],
  ["/brand/urban-haute/social-02.png", "Sala de estar"],
  ["/brand/urban-haute/social-07.png", "Sala de reunião"],
  ["/brand/urban-haute/social-10.png", "Coworking"],
  ["/brand/urban-haute/social-05.png", "Salão de festas"],
  ["/brand/urban-haute/social-08.png", "Sala de convenções"]
];

const availabilityGroups = [
  { title: "Residenciais", count: "1, 2 e 3 quartos", note: "Consulte andares, orientação solar, vagas e condições." },
  { title: "Penthouses", count: "50º ao 58º pavimento", note: "Unidades de 125,25 a 203,09 m², conforme o projeto." },
  { title: "Offices", count: "36 a 80 m²", note: "Salas comerciais e possibilidades de integração de lajes." },
  { title: "Boulevard", count: "12 lojas no térreo", note: "Espaços para gastronomia e serviços de alto padrão." }
];

const schema = {
  "@context": "https://schema.org", "@type": "ApartmentComplex", name: "Urban Haute",
  description: "Empreendimento mixed-use com residências, offices, penthouses e boulevard gastronômico em Palmas/TO.", url: pageUrl,
  image: `${siteUrl}/brand/urban-haute/social-23.png`, address: { "@type": "PostalAddress", streetAddress: "ACSU NO13, Avenida JK, Lote 02", addressLocality: "Palmas", addressRegion: "TO", postalCode: "77001-080", addressCountry: "BR" },
  amenityFeature: ["Rooftop Wellness", "Piscina panorâmica coberta", "Academia", "Pavimento de lazer", "Boulevard gastronômico"]
};

export default function UrbanHautePage() {
  return (
    <main className="urban-haute-landing">
      <LandingPageTracker landingPageSlug="urban-haute" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="urban-haute-hero" id="inicio">
        <Image className="urban-haute-hero-image" src="/brand/urban-haute/social-23.png" alt="Perspectiva da fachada do Urban Haute em Palmas" fill priority sizes="100vw" />
        <div className="urban-haute-hero-overlay" />
        <header className="urban-haute-nav urban-haute-container">
          <a className="urban-haute-wordmark" href="#inicio" aria-label="Urban Haute"><small>URBAN</small><strong>HAUTE</strong><span>Alta arquitetura.</span></a>
          <Link className="urban-haute-home-link" href="/" aria-label="Voltar para o site principal">Pedro Soares · site principal</Link>
        </header>
        <div className="urban-haute-container urban-haute-hero-content">
          <p className="urban-haute-eyebrow"><span /> Lançamento · Palmas / TO</p>
          <p className="urban-haute-overline">UMA NOVA MANEIRA DE VIVER, TRABALHAR E INVESTIR</p>
          <h1>Um novo ícone urbano.</h1>
          <p className="urban-haute-hero-lede">Residências, escritórios, lazer e gastronomia em um endereço pensado para colocar tudo o que importa no seu horizonte.</p>
          <div className="urban-haute-hero-actions"><a className="urban-haute-button urban-haute-button--light" href="#disponibilidade">Conhecer unidades <ArrowRight size={17} /></a><a className="urban-haute-hero-link" href="#projeto">Descobrir o projeto <ArrowDown size={15} /></a></div>
          <div className="urban-haute-hero-bottom"><span><MapPin size={14} /> Ao lado do Capim Dourado Shopping</span><span>ACSU NO13 · Avenida JK · Lote 02</span></div>
        </div>
      </section>

      <section className="urban-haute-stat-strip" aria-label="Números do empreendimento"><div className="urban-haute-container urban-haute-stat-grid">{highlights.map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

      <section className="urban-haute-section urban-haute-section--paper" id="projeto"><div className="urban-haute-container urban-haute-story-grid"><div className="urban-haute-story-copy"><p className="urban-haute-kicker">O projeto</p><h2>Alta arquitetura para uma vida em movimento.</h2><p>O Urban Haute nasce como um mixed-use completo: um lugar para morar, trabalhar e viver experiências sem sair do endereço. Inspirado nos arranha-céus de Nova York, o projeto combina linhas autorais, interiores sofisticados e um novo jeito de ocupar a cidade.</p><p>Com residências, penthouses, offices e um boulevard gastronômico no térreo, o Haute transforma conveniência em parte da arquitetura.</p><a className="urban-haute-text-link" href="#experiencia">Conhecer os diferenciais <ArrowRight size={15} /></a></div><div className="urban-haute-story-image"><Image src="/brand/urban-haute/social-11.png" alt="Perspectiva do boulevard e da fachada do Urban Haute" fill sizes="(max-width: 900px) 100vw, 50vw" /><span>Arquitetura que se torna paisagem.</span></div></div></section>

      <section className="urban-haute-section urban-haute-section--ink" id="experiencia"><div className="urban-haute-container"><div className="urban-haute-section-heading"><p className="urban-haute-kicker">Uma experiência completa</p><h2>O seu próximo endereço também pode ser o seu próximo destino.</h2><p>Do primeiro café à vista do rooftop, cada camada do Urban Haute foi pensada para tornar o cotidiano mais fluido, elegante e conectado.</p></div><div className="urban-haute-feature-grid">{amenities.map(([Icon, title, text]) => { const FeatureIcon = Icon as typeof Waves; return <article className="urban-haute-feature-card" key={title as string}><FeatureIcon size={22} /><h3>{title as string}</h3><p>{text as string}</p></article>; })}</div></div></section>

      <section className="urban-haute-product-band"><div className="urban-haute-container"><div className="urban-haute-section-heading urban-haute-section-heading--dark"><p className="urban-haute-kicker">Um mixed-use completo</p><h2>Escolha a forma de viver o Haute.</h2><p>Produtos distintos, um mesmo endereço icônico. Receba a disponibilidade atualizada para a categoria que faz sentido para você.</p></div><div className="urban-haute-product-grid">{products.map((product) => <article className="urban-haute-product-card" key={product.name}><div className="urban-haute-product-image"><Image src={product.image} alt={`${product.name} no Urban Haute`} fill sizes="(max-width: 800px) 100vw, 25vw" /></div><div className="urban-haute-product-copy"><span>{product.floor}</span><h3>{product.name}</h3><strong>{product.area}</strong><p>{product.detail}</p><a href="#atendimento">Consultar disponibilidade <ArrowRight size={14} /></a></div></article>)}</div></div></section>

      <section className="urban-haute-video-section"><div className="urban-haute-container urban-haute-video-grid"><div className="urban-haute-video-copy"><p className="urban-haute-kicker">Vídeo conceito</p><h2>Veja o Urban Haute ganhar altura.</h2><p>Assista à apresentação oficial do conceito, da arquitetura e das experiências que formam esse novo marco de Palmas.</p><a className="urban-haute-button urban-haute-button--light" href={videoUrl.replace("/preview", "/view")} target="_blank" rel="noreferrer"><Play size={16} /> Abrir vídeo no Drive</a></div><div className="urban-haute-video-frame"><iframe title="Vídeo conceito do Urban Haute" src={videoUrl} allow="autoplay; fullscreen" loading="lazy" /><div><Play size={14} /> Vídeo conceito oficial do empreendimento</div></div></div></section>

      <section className="urban-haute-section urban-haute-section--paper" id="plantas"><div className="urban-haute-container"><div className="urban-haute-section-heading urban-haute-section-heading--split"><div><p className="urban-haute-kicker">Plantas e tipologias</p><h2>Espaços que se adaptam ao seu momento.</h2></div><div><p>As áreas e pavimentos abaixo foram extraídos do caderno de plantas e do material comercial do Urban Haute. Plantas, acabamentos e condições podem ser revisados conforme os documentos do empreendimento.</p><a className="urban-haute-text-link" href={plantsPdfUrl} target="_blank" rel="noreferrer">Abrir caderno completo <ExternalLink size={14} /></a></div></div><div className="urban-haute-typology-grid">{typologies.map((type) => <article className="urban-haute-typology-card" key={type.label}><div className="urban-haute-typology-image"><Image src={type.image} alt={`Planta Urban Haute ${type.label}`} fill sizes="(max-width: 800px) 100vw, 25vw" /></div><div><span>{type.floors}</span><h3>{type.label}</h3><strong>{type.area}</strong><a href="#atendimento">Quero esta planta <ArrowRight size={14} /></a></div></article>)}</div></div></section>

      <section className="urban-haute-availability" id="disponibilidade"><div className="urban-haute-container"><div className="urban-haute-section-heading"><p className="urban-haute-kicker">Disponibilidade</p><h2>Encontre a unidade certa para o seu plano.</h2><p>O estoque e as condições comerciais mudam. Selecione uma categoria e eu retorno com o quadro atualizado, orientação solar, vagas e valores.</p></div><div className="urban-haute-availability-grid">{availabilityGroups.map((group) => <article className="urban-haute-availability-card" key={group.title}><div className="urban-haute-availability-icon"><Building2 size={20} /></div><span>Disponibilidade sob consulta</span><h3>{group.title}</h3><strong>{group.count}</strong><p>{group.note}</p><a href="#atendimento">Consultar agora <ArrowRight size={14} /></a></article>)}</div><div className="urban-haute-floor-band"><div><MoveUpRight size={19} /><strong>Do térreo ao rooftop</strong><span>Um corte vertical que reúne lojas, offices, residências, lazer e penthouses.</span></div><a href="#atendimento">Receber a disponibilidade <ArrowRight size={15} /></a></div></div></section>

      <section className="urban-haute-gallery-band"><div className="urban-haute-container urban-haute-gallery-intro"><div><p className="urban-haute-kicker">Galeria</p><h2>Detalhes que fazem o cotidiano subir de nível.</h2><p>Imagens oficiais do material de divulgação do Urban Haute.</p></div><a className="urban-haute-button urban-haute-button--dark" href="#atendimento">Receber apresentação <ArrowRight size={16} /></a></div><div className="urban-haute-container urban-haute-gallery-grid">{gallery.map(([src, alt]) => <div className="urban-haute-gallery-image" key={src}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 50vw, 25vw" /></div>)}</div></section>

      <section className="urban-haute-location" id="localizacao"><div className="urban-haute-location-image"><Image src="/brand/urban-haute/social-13.png" alt="Urban Haute ao lado do Capim Dourado Shopping" fill sizes="(max-width: 900px) 100vw, 55vw" /></div><div className="urban-haute-location-copy"><p className="urban-haute-kicker"><MapPin size={15} /> Localização estratégica</p><h2>Em frente ao Capim Dourado. No centro do que Palmas vive.</h2><p>O Urban Haute está no ACSU NO13, Avenida JK, Lote 02, ao lado do Shopping Capim Dourado — um endereço que conecta compras, gastronomia, serviços, saúde, educação e lazer.</p><div className="urban-haute-location-facts"><div><strong>Ao lado</strong><span>do Capim Dourado Shopping</span></div><div><strong>Plano Diretor</strong><span>eixos estratégicos de Palmas</span></div><div><strong>245 m*</strong><span>altura declarada no material comercial</span></div></div><p className="urban-haute-location-note">*A altura e a posição em rankings são informações declaradas nos materiais do empreendimento e em divulgação pública; confirme a versão vigente com o incorporador.</p><div className="urban-haute-location-actions"><a className="urban-haute-button urban-haute-button--dark" href={mapsUrl} target="_blank" rel="noreferrer">Abrir localização <ExternalLink size={15} /></a><a className="urban-haute-text-link" href={capimRouteUrl} target="_blank" rel="noreferrer">Ver rota até o shopping <ArrowRight size={14} /></a></div></div></section>

      <section className="urban-haute-contact" id="atendimento"><div className="urban-haute-container urban-haute-contact-grid"><div className="urban-haute-contact-copy"><p className="urban-haute-kicker">Atendimento personalizado</p><h2>O próximo passo começa com uma conversa.</h2><p>Deixe seus dados e eu apresento o Urban Haute, as plantas e a disponibilidade mais recente para o seu perfil.</p><div className="urban-haute-contact-points"><span><Check size={16} /> Plantas e tipologias</span><span><Check size={16} /> Condições atualizadas</span><span><Check size={16} /> Atendimento direto com Pedro Soares</span></div><div className="urban-haute-broker"><div className="urban-haute-broker-avatar">PS</div><div><strong>Pedro Soares</strong><span>Corretor de imóveis · CRECI 5861-TO</span></div></div></div><UrbanHauteLeadForm /></div></section>

    </main>
  );
}
