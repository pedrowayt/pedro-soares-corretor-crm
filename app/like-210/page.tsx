import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  Bike,
  BriefcaseBusiness,
  Building2,
  Check,
  Clock3,
  Coffee,
  Dumbbell,
  ExternalLink,
  MapPin,
  MessageCircle,
  PawPrint,
  Route,
  Sparkles,
  Waves
} from "lucide-react";
import { Like210LeadForm } from "@/components/public/like-210-lead-form";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/like-210`;
const heroImage = "/like-210/facade.jpg";
const whatsappUrl = buildWhatsAppUrl("Olá, Pedro. Quero conhecer o LIKE 210 e receber a apresentação.");
const like210MapsUrl = "https://maps.app.goo.gl/rd2NzJiLNYHU3dG97";
const like210Coordinates = "-10.197196,-48.312549";
const like210MapEmbedUrl = `https://www.google.com/maps?q=${like210Coordinates}&z=14&output=embed`;

export const metadata: Metadata = {
  title: "LIKE 210 | Um novo jeito de viver Palmas",
  description:
    "Studios e apartamentos de 1 e 2 quartos em frente ao IFTO, com lazer completo, rooftop e localização estratégica em Palmas/TO.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: pageUrl,
    title: "LIKE 210 | Conectado ao presente. Preparado para o futuro.",
    description:
      "Em frente ao IFTO, o LIKE 210 reúne arquitetura contemporânea, mobilidade e espaços para viver e investir melhor.",
    images: [{ url: `${siteUrl}${heroImage}` }]
  }
};

const locationFacts = [
  ["2 min", "do Open Mall"],
  ["5 min", "do Parque Cesamar"],
  ["11 min", "do Hospital do Amor"],
  ["17 min", "do Estádio Nilton Santos"],
  ["27 min", "do aeroporto"]
];

const palmasRoutes = [
  { name: "Praça dos Girassóis", context: "Centro de Palmas" },
  { name: "Capim Dourado Shopping", context: "Plano Diretor Norte" },
  { name: "Parque Cesamar", context: "Plano Diretor Sul" },
  { name: "Praia da Graciosa", context: "Orla de Palmas" },
  { name: "Aeroporto de Palmas", context: "Brigadeiro Lysias Rodrigues" }
].map((point) => ({
  ...point,
  url: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${point.name}, Palmas - TO`)}&destination=${like210Coordinates}`
}));

const amenities = [
  { icon: Waves, title: "Rooftop & piscina", text: "No alto da 210, a cidade vira cenário para desacelerar." },
  { icon: BriefcaseBusiness, title: "Espaço creator", text: "Um ambiente para criar, trabalhar e compartilhar ideias." },
  { icon: Dumbbell, title: "Academia", text: "Movimento e bem-estar acompanhando o seu ritmo." },
  { icon: Coffee, title: "Cafeteria", text: "Pequenas pausas, bons cafés e grandes momentos." },
  { icon: PawPrint, title: "Pet place", text: "Conforto e cuidado também para quem faz parte da família." },
  { icon: Bike, title: "Bicicletário", text: "Mais praticidade para acompanhar a vida em movimento." }
];

const gallery = [
  { src: "/like-210/rooftop.jpg", title: "Like Lounge", text: "Convivência com vista para a cidade", className: "like210-gallery-card--tall" },
  { src: "/like-210/flat-02.jpg", title: "Um espaço que funciona", text: "Planta pensada para o seu dia" },
  { src: "/like-210/implantation.jpg", title: "Conectado à cidade", text: "Em frente ao IFTO" }
];

function Like210WhatsAppLink({ children, className = "like210-button like210-button--outline" }: { children: React.ReactNode; className?: string }) {
  return (
    <a className={className} href={whatsappUrl} target="_blank" rel="noreferrer">
      <MessageCircle size={17} /> {children}
    </a>
  );
}

export default function Like210Page() {
  return (
    <div className="like210-landing">
      <LandingPageTracker landingPageSlug="like-210" />
      <section className="like210-hero" id="inicio">
        <Image src={heroImage} alt="Imagem da fachada do empreendimento LIKE 210" fill priority sizes="100vw" className="like210-hero-image" />
        <div className="like210-hero-overlay" />
        <header className="like210-nav container">
          <a href="#inicio" className="like210-brand" aria-label="LIKE 210">
            <span>LIKE</span><strong>210</strong>
          </a>
          <nav aria-label="Navegação principal">
            <a href="#projeto">O projeto</a>
            <a href="#localizacao">Localização</a>
            <a href="#experiencia">Experiência</a>
            <a href="#plantas">Plantas</a>
            <a href="#atendimento">Atendimento</a>
          </nav>
          <Like210WhatsAppLink className="like210-button like210-button--nav">Falar com Pedro</Like210WhatsAppLink>
        </header>

        <div className="container like210-hero-content">
          <div className="like210-hero-copy">
            <p className="like210-eyebrow"><span /> Lançamento · Palmas / TO</p>
            <p className="like210-overline">CONECTADO AO PRESENTE</p>
            <h1>Um novo jeito de viver a cidade.</h1>
            <p className="like210-hero-lede">Studios e apartamentos em frente ao IFTO, com lazer completo, mobilidade e espaços que acompanham o seu ritmo.</p>
            <div className="like210-hero-actions">
              <a className="like210-button like210-button--copper" href="#atendimento">Quero conhecer <ArrowRight size={18} /></a>
              <a className="like210-hero-link" href="#projeto">Descobrir o projeto <ArrowDown size={15} /></a>
            </div>
          </div>
          <div className="like210-hero-card">
            <span>EM FRENTE AO IFTO</span>
            <strong>Onde morar bem e investir deixam de ser escolhas diferentes.</strong>
            <small>Imagem ilustrativa do projeto</small>
          </div>
        </div>
      </section>

      <section className="like210-stat-strip" aria-label="Resumo do empreendimento">
        <div className="container like210-stat-grid">
          <div><strong>27,03 m²</strong><span>studio</span></div>
          <div><strong>41,97 m²</strong><span>apartamento</span></div>
          <div><strong>1 e 2</strong><span>quartos</span></div>
          <div><strong>Lazer</strong><span>completo</span></div>
          <div><strong>1 bloco</strong><span>2 elevadores</span></div>
        </div>
      </section>

      <section id="projeto" className="like210-section like210-section--paper">
        <div className="container like210-intro-grid">
          <div className="like210-intro-copy">
            <p className="like210-kicker">O projeto</p>
            <h2>Uma escolha inteligente para a vida que acontece agora.</h2>
            <p>Alguns empreendimentos acompanham o crescimento da cidade. O LIKE 210 faz parte dele: reúne arquitetura contemporânea, localização estratégica e soluções que tornam a rotina mais leve.</p>
            <p>Cada metro quadrado foi pensado para entregar eficiência sem abrir mão da experiência — para morar, investir e seguir em frente.</p>
            <a className="like210-text-link" href="#experiencia">Conhecer a experiência <ArrowRight size={16} /></a>
          </div>
          <div className="like210-intro-image">
            <Image src="/like-210/rooftop.jpg" alt="Like Lounge no rooftop do empreendimento" fill sizes="(max-width: 900px) 100vw, 48vw" />
            <span><Sparkles size={14} /> Like Lounge</span>
          </div>
        </div>
      </section>

      <section className="like210-section like210-section--ink" id="localizacao">
        <div className="container">
          <div className="like210-section-heading like210-section-heading--light">
            <p className="like210-kicker">Uma localização que facilita</p>
            <h2>Em frente ao IFTO. Perto do que importa.</h2>
            <p>Na Avenida NS-05, o LIKE 210 coloca você no caminho do trabalho, do estudo, do lazer e das melhores conexões de Palmas.</p>
          </div>
          <div className="like210-location-facts">
            {locationFacts.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
          <div className="like210-location-bottom">
            <span><MapPin size={17} /> Avenida NS-05 · Palmas, Tocantins</span>
            <a href={like210MapsUrl} target="_blank" rel="noreferrer">Abrir no mapa <ExternalLink size={14} /></a>
          </div>
          <div className="like210-map-block">
            <div className="like210-map-frame">
              <iframe
                title="Mapa da localização do empreendimento LIKE 210 em Palmas"
                src={like210MapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="like210-map-caption">
                <MapPin size={15} />
                <span>LIKE 210 · Avenida NS-05 · Palmas/TO</span>
                <a href={like210MapsUrl} target="_blank" rel="noreferrer" aria-label="Abrir a localização do LIKE 210 no Google Maps">
                  Ver no Google Maps <ExternalLink size={13} />
                </a>
              </div>
            </div>
            <div className="like210-routes-panel">
              <div className="like210-routes-heading">
                <p className="like210-kicker">Rotas rápidas</p>
                <h3>Saindo dos principais pontos de Palmas.</h3>
                <p>Escolha um ponto de partida e veja o caminho até o LIKE 210.</p>
              </div>
              <div className="like210-routes-grid">
                {palmasRoutes.map((point) => (
                  <article className="like210-route-card" key={point.name}>
                    <div>
                      <span><Clock3 size={14} /> Rota até o LIKE 210</span>
                      <strong>{point.name}</strong>
                      <small>{point.context}</small>
                    </div>
                    <a href={point.url} target="_blank" rel="noreferrer" aria-label={`Traçar rota de ${point.name} até o LIKE 210`}>
                      <Route size={15} /> Traçar rota
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experiencia" className="like210-section like210-section--sand">
        <div className="container">
          <div className="like210-section-heading">
            <p className="like210-kicker">A experiência LIKE 210</p>
            <h2>Mais possibilidades dentro da sua rotina.</h2>
            <p>Do primeiro café ao último mergulho do dia, os espaços foram pensados para acompanhar a vida de quem faz acontecer.</p>
          </div>
          <div className="like210-amenities-grid">
            {amenities.map(({ icon: Icon, title, text }) => (
              <article key={title} className="like210-amenity-card">
                <Icon size={21} strokeWidth={1.5} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="like210-gallery-section">
        <div className="container">
          <div className="like210-gallery-grid">
            {gallery.map((item) => (
              <article key={item.title} className={`like210-gallery-card ${item.className ?? ""}`}>
                <Image src={item.src} alt={item.title} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                <div><strong>{item.title}</strong><span>{item.text}</span></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="plantas" className="like210-section like210-section--paper">
        <div className="container">
          <div className="like210-section-heading">
            <p className="like210-kicker">Seu espaço, seu momento</p>
            <h2>Plantas que se adaptam ao seu plano.</h2>
            <p>Escolha o formato que mais combina com o seu objetivo. Receba plantas e detalhes técnicos diretamente no atendimento.</p>
          </div>
          <div className="like210-typology-grid">
            <article className="like210-typology-card like210-typology-card--featured">
              <div className="like210-typology-top"><span>TIPO 01</span><span>27,03 m²</span></div>
              <Building2 size={25} />
              <h3>Studio</h3>
              <p>Conforto e praticidade na medida certa, para morar bem ou construir uma escolha inteligente de investimento.</p>
              <ul><li><Check size={15} /> Ambiente integrado</li><li><Check size={15} /> Varanda</li><li><Check size={15} /> Solução compacta e funcional</li></ul>
              <a className="like210-button like210-button--copper" href="#atendimento">Receber planta <ArrowRight size={16} /></a>
            </article>
            <article className="like210-typology-card">
              <div className="like210-typology-top"><span>TIPO 02</span><span>41,97 m²</span></div>
              <Building2 size={25} />
              <h3>Apartamento</h3>
              <p>Mais espaço para viver cada fase com liberdade, funcionalidade e a localização que a cidade pede.</p>
              <ul><li><Check size={15} /> Ambientes bem resolvidos</li><li><Check size={15} /> Varanda</li><li><Check size={15} /> 1 ou 2 quartos</li></ul>
              <a className="like210-button like210-button--dark" href="#atendimento">Receber planta <ArrowRight size={16} /></a>
            </article>
          </div>
        </div>
      </section>

      <section id="atendimento" className="like210-contact-section">
        <div className="container like210-contact-grid">
          <div className="like210-contact-copy">
            <p className="like210-kicker">Próximo passo</p>
            <h2>Quer ver se o LIKE 210 combina com você?</h2>
            <p>Me conte o que você busca. Eu envio a apresentação, as plantas e as informações do projeto para você avaliar com calma.</p>
            <div className="like210-contact-note"><MessageCircle size={19} /><span>Atendimento direto pelo WhatsApp<br /><strong>(63) 98484-5101</strong></span></div>
          </div>
          <div className="like210-form-panel"><Like210LeadForm /></div>
        </div>
      </section>

      <footer className="like210-footer">
        <div className="container like210-footer-grid">
          <div><a href="#inicio" className="like210-brand like210-brand--footer"><span>LIKE</span><strong>210</strong></a><p>Conectado ao presente. Preparado para o futuro.</p></div>
          <div><Image src="/like-210/logo-white.png" alt="Rodes Engenharia" width={178} height={46} className="like210-rodes-logo" /><small>Genuinamente tocantinense. Engenharia que constrói confiança.</small></div>
          <small>Registro de incorporação INC-Nº 2.061-R11-80.887. Imagens meramente ilustrativas por se tratar de bem a ser construído. Consulte o memorial de incorporação com nossa equipe comercial.</small>
        </div>
      </footer>

      <a className="like210-whatsapp-float" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar sobre o LIKE 210 pelo WhatsApp"><MessageCircle size={20} /><span>Quero conhecer</span></a>
    </div>
  );
}
