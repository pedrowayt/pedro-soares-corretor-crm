import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  ExternalLink,
  KeyRound,
  MapPin,
  MessageCircle,
  Sparkles,
  Waves
} from "lucide-react";
import { AcordesLeadForm } from "@/components/public/acordes-lead-form";
import { AcordesWhatsAppBubble } from "@/components/public/acordes-whatsapp-bubble";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const developmentName = "Acordes Tower by Tewal";
const heroImage = "/brand/acordes/fachada-3.webp";

export const metadata: Metadata = {
  title: "Acordes Tower by Tewal | Orla 14, Palmas",
  description:
    "Studios e apartamentos de 2 suítes na Orla 14, em Palmas. Conheça o Acordes Tower by Tewal e receba plantas, valores e condições.",
  alternates: { canonical: `${siteUrl}/acordes` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${siteUrl}/acordes`,
    title: "Acordes Tower by Tewal | Um novo acorde para a vida na Orla 14",
    description: "Um produto contemporâneo para morar, investir e viver Palmas de um jeito diferente.",
    images: [{ url: `${siteUrl}${heroImage}` }]
  }
};

const gallery = [
  { src: "/brand/acordes/rooftop-piscina.webp", title: "Piscina com borda infinita", text: "Adulto, infantil e spa integrado.", className: "acordes-gallery-card--large" },
  { src: "/brand/acordes/rooftop.webp", title: "Rooftop", text: "Um ponto alto para desacelerar." },
  { src: "/brand/acordes/rooftop-gourmet.webp", title: "Espaço gourmet", text: "Vista para o lago e encontros que ficam." },
  { src: "/brand/acordes/academia.webp", title: "Academia", text: "Treino completo sem sair de casa." },
  { src: "/brand/acordes/coworking.webp", title: "Coworking", text: "Trabalho e rotina em sintonia." },
  { src: "/brand/acordes/coworking-02.webp", title: "Sala de reuniões", text: "Para encontros profissionais." },
  { src: "/brand/acordes/sala-reuniao.webp", title: "Convivência", text: "Ambientes para receber bem." },
  { src: "/brand/acordes/lavanderia.webp", title: "Lavanderia", text: "Máquinas inclusas e mais praticidade." }
];

const locationFacts = [
  ["120 m", "da Orla 14"],
  ["3 min", "do Shopping"],
  ["3 min", "da UFT"],
  ["2 min", "da Unitins"],
  ["5 min", "da Praça dos Girassóis"]
];

const amenities = [
  "9 lojas no mall comercial",
  "4 elevadores",
  "150 vagas de garagem",
  "Lockers de delivery",
  "Pet shower",
  "Ponto de recarga para carro elétrico",
  "Medidores individuais",
  "Administração profissional"
];

function WhatsAppLink({ children, className = "acordes-button acordes-button--outline" }: { children: React.ReactNode; className?: string }) {
  return (
    <a className={className} href={buildWhatsAppUrl(`Olá, Pedro. Quero conhecer o ${developmentName}.`)} target="_blank" rel="noreferrer">
      <MessageCircle size={17} /> {children}
    </a>
  );
}

export default function AcordesPage() {
  return (
    <div className="acordes-landing">
      <section className="acordes-hero">
        <Image src={heroImage} alt="Fachada do Acordes Tower by Tewal" fill priority sizes="100vw" className="acordes-hero-image" />
        <div className="acordes-hero-wash" />
        <header className="acordes-nav container">
          <a href="#inicio" className="acordes-wordmark" aria-label="Acordes Tower by Tewal">ACORDES<span>•</span></a>
          <nav aria-label="Navegação principal">
            <a href="#conceito">O projeto</a>
            <a href="#experiencia">Lazer</a>
            <a href="#tipologias">Plantas</a>
            <a href="#atendimento">Atendimento</a>
          </nav>
          <WhatsAppLink className="acordes-button acordes-button--nav">Falar com Pedro</WhatsAppLink>
        </header>

        <div id="inicio" className="container acordes-hero-content">
          <div className="acordes-hero-copy">
            <p className="acordes-eyebrow"><span /> Lançamento · Orla 14 · Palmas/TO</p>
            <p className="acordes-byline">TOWER <span>by</span> TEWAL</p>
            <h1>Um novo acorde para a vida na Orla 14.</h1>
            <p className="acordes-hero-lede">Uma combinação de espaços que vibram em sintonia com você: studios, apartamentos de 2 suítes e uma experiência completa para morar ou investir.</p>
            <div className="acordes-hero-actions">
              <a className="acordes-button acordes-button--gold" href="#atendimento">Quero conhecer <ArrowRight size={18} /></a>
              <a className="acordes-hero-text-link" href="#conceito">Descobrir o projeto <ArrowDown size={16} /></a>
            </div>
          </div>
          <div className="acordes-hero-note">
            <span>01 / 08</span>
            <strong>Viver na Orla 14 é estar no ritmo de Palmas.</strong>
            <small>Imagem ilustrativa do projeto</small>
          </div>
        </div>
      </section>

      <section className="acordes-stat-strip" aria-label="Resumo do empreendimento">
        <div className="container acordes-stat-grid">
          <div><strong>300</strong><span>unidades</span></div>
          <div><strong>29</strong><span>pavimentos</span></div>
          <div><strong>25,35 a 29,78 m²</strong><span>studios</span></div>
          <div><strong>56,11 a 61,49 m²</strong><span>apartamentos de 2 suítes</span></div>
          <div><strong>Mar/2030</strong><span>entrega prevista</span></div>
        </div>
      </section>

      <section id="conceito" className="acordes-section acordes-section--paper">
        <div className="container acordes-concept-grid">
          <div className="acordes-concept-copy">
            <p className="acordes-kicker">O conceito</p>
            <h2>O encontro entre arquitetura, cidade e um jeito mais inteligente de viver.</h2>
            <p>Um acorde nasce do encontro entre notas distintas. No palco da cidade, surge uma composição criada para o seu ritmo: um endereço contemporâneo, conectado à Orla 14 e pronto para acompanhar a vida que acontece agora.</p>
            <p>O Acordes combina unidades compactas e funcionais, lazer elevado, serviços no térreo e espaços pensados para quem quer estar perto de tudo - inclusive das melhores oportunidades de Palmas.</p>
            <a className="acordes-text-link" href="#tipologias">Escolher minha tipologia <ArrowRight size={16} /></a>
          </div>
          <div className="acordes-concept-image">
            <Image src="/brand/acordes/vista-por-do-sol.webp" alt="Vista do pôr do sol a partir do Acordes" fill sizes="(max-width: 900px) 100vw, 48vw" />
            <span className="acordes-image-caption"><Sparkles size={15} /> Vista para o Lago e a Serra</span>
          </div>
        </div>
      </section>

      <section className="acordes-section acordes-section--ink">
        <div className="container">
          <div className="acordes-section-heading acordes-section-heading--light">
            <p className="acordes-kicker">Uma localização que acontece</p>
            <h2>No coração da Orla 14.</h2>
            <p>O Acordes está a 120 metros da Orla, em uma região que reúne lazer, serviços, negócios e novas possibilidades para Palmas.</p>
          </div>
          <div className="acordes-location-facts">
            {locationFacts.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
          <div className="acordes-location-bottom">
            <div className="acordes-location-address"><MapPin size={18} /><span>Orla 14 · Palmas, Tocantins</span></div>
            <a href="https://www.google.com/maps/search/Orla+14+Palmas+TO" target="_blank" rel="noreferrer" className="acordes-text-link acordes-text-link--light">Abrir no mapa <ExternalLink size={15} /></a>
          </div>
        </div>
      </section>

      <section id="experiencia" className="acordes-section acordes-section--paper acordes-experience">
        <div className="container">
          <div className="acordes-section-heading">
            <p className="acordes-kicker">A experiência Acordes</p>
            <h2>Espaços que acompanham o seu ritmo.</h2>
            <p>Do trabalho ao descanso, tudo foi pensado para você viver mais dentro e fora do apartamento.</p>
          </div>
          <div className="acordes-gallery-grid">
            {gallery.map((item) => (
              <article className={`acordes-gallery-card ${item.className ?? ""}`} key={item.src}>
                <Image src={item.src} alt={item.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw" />
                <div className="acordes-gallery-overlay"><strong>{item.title}</strong><span>{item.text}</span></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tipologias" className="acordes-section acordes-section--sand">
        <div className="container">
          <div className="acordes-section-heading">
            <p className="acordes-kicker">Seu espaço, seu acorde</p>
            <h2>Plantas para diferentes momentos da vida.</h2>
            <p>Escolha o formato que melhor traduz seu objetivo. As áreas abaixo seguem o material técnico do empreendimento.</p>
          </div>
          <div className="acordes-typology-grid">
            <article className="acordes-typology-card acordes-typology-card--featured">
              <div className="acordes-typology-top"><span className="acordes-typology-number">01</span><span>Vista para a cidade</span></div>
              <h3>Studios</h3>
              <strong>25,35 a 29,78 m²</strong>
              <p>Compactos, funcionais e conectados à demanda de locação de curta ou longa temporada.</p>
              <ul><li><Check size={15} /> Tipos B1 e B2</li><li><Check size={15} /> 5º ao 18º pavimento</li><li><Check size={15} /> Vista para o Lago ou Serra</li></ul>
              <WhatsAppLink className="acordes-button acordes-button--dark">Receber plantas</WhatsAppLink>
            </article>
            <article className="acordes-typology-card">
              <div className="acordes-typology-top"><span className="acordes-typology-number">02</span><span>Vista privilegiada</span></div>
              <h3>2 suítes</h3>
              <strong>56,11 a 61,49 m²</strong>
              <p>Mais amplitude, sacada e vista para o Lago em plantas premium para morar ou investir.</p>
              <ul><li><Check size={15} /> Tipos A1, A2, A3 e A4</li><li><Check size={15} /> 19º ao 27º pavimento</li><li><Check size={15} /> Sacada de até 11,57 m²</li></ul>
              <WhatsAppLink className="acordes-button acordes-button--outline-dark">Conhecer 2 suítes</WhatsAppLink>
            </article>
          </div>
        </div>
      </section>

      <section className="acordes-section acordes-section--paper acordes-investment">
        <div className="container acordes-investment-grid">
          <div>
            <p className="acordes-kicker">Para morar. Para investir.</p>
            <h2>Um produto preparado para a dinâmica de Palmas.</h2>
            <p>O Acordes foi concebido para operação de locação de curta ou longa temporada, com forte demanda de hóspedes corporativos, do agro e turistas.</p>
            <p>Além da localização, a administração profissional, os serviços integrados e as plantas versáteis ajudam a construir uma experiência mais simples para quem investe.</p>
          </div>
          <div className="acordes-investment-points">
            <div><KeyRound size={20} /><span><strong>Operação inteligente</strong><small>Preparação para alta rotatividade e baixo custo operacional.</small></span></div>
            <div><Building2 size={20} /><span><strong>Produto de alta liquidez</strong><small>Studios compactos e localização estratégica.</small></span></div>
            <div><Waves size={20} /><span><strong>Lazer elevado</strong><small>Rooftop com piscina, spa, academia e vista para o lago.</small></span></div>
            <div><Sparkles size={20} /><span><strong>Construtora sólida</strong><small>Tewal: 25 anos contribuindo para o desenvolvimento do Tocantins.</small></span></div>
          </div>
        </div>
      </section>

      <section className="acordes-section acordes-section--ink acordes-amenities">
        <div className="container">
          <div className="acordes-section-heading acordes-section-heading--light">
            <p className="acordes-kicker">Mais detalhes do projeto</p>
            <h2>Funcionalidade em cada escolha.</h2>
          </div>
          <div className="acordes-amenities-grid">{amenities.map((item) => <span key={item}><Check size={16} />{item}</span>)}</div>
        </div>
      </section>

      <section id="atendimento" className="acordes-section acordes-section--sand acordes-contact-section">
        <div className="container acordes-contact-grid">
          <div className="acordes-broker-card">
            <div className="acordes-broker-photo"><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares, corretor de imóveis" fill sizes="(max-width: 800px) 100vw, 360px" /></div>
            <div className="acordes-broker-copy"><p className="acordes-kicker">Atendimento personalizado</p><h3>Vamos encontrar o seu melhor acorde.</h3><p>Eu apresento as plantas, explico as condições e ajudo você a avaliar se o Acordes faz sentido para morar ou investir.</p><strong>Pedro Soares</strong><span>CRECI 5861-TO</span></div>
          </div>
          <div className="acordes-contact-copy">
            <p className="acordes-kicker">Lista de interesse</p>
            <h2>Receba a apresentação completa.</h2>
            <p>Deixe seus dados para receber plantas, disponibilidade e condições atualizadas do Acordes Tower by Tewal.</p>
            <AcordesLeadForm />
          </div>
        </div>
      </section>

      <footer className="acordes-footer">
        <div className="container acordes-footer-grid"><div><a href="#inicio" className="acordes-wordmark">ACORDES<span>•</span></a><p>Um produto Tewal · Orla 14 · Palmas/TO</p></div><div><p>Acordes Tower by Tewal, registrado sob o nº 2.806-R04-176.556 no Cartório de Registro de Imóveis de Palmas/TO.</p><small>Imagens meramente ilustrativas. A entrega seguirá os projetos finais aprovados e os respectivos memoriais descritivos.</small></div></div>
      </footer>
      <AcordesWhatsAppBubble />
    </div>
  );
}
