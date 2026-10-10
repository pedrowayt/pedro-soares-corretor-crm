"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Bath,
  CarFront,
  Check,
  Home,
  ExternalLink,
  MapPin,
  Maximize2,
  MessageCircle,
  MoveRight,
  Plane,
  ShoppingCart,
  Sparkles,
  Store,
  Trophy,
  Waves,
  X,
  type LucideIcon
} from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

const gallery = [
  ["/brand/casa-mirante-do-lago/01-fachada.jpg", "Fachada contemporânea", "hero"],
  ["/brand/casa-mirante-do-lago/07-piscina.jpg", "Piscina e deck privativo", "wide"],
  ["/brand/casa-mirante-do-lago/10-area-gourmet.jpg", "Área gourmet integrada", "wide"],
  ["/brand/casa-mirante-do-lago/02-sala.jpg", "Sala com acabamento claro", "small"],
  ["/brand/casa-mirante-do-lago/06-cozinha.jpg", "Cozinha integrada", "small"],
  ["/brand/casa-mirante-do-lago/13-cozinha.jpg", "Bancadas em Quartzo Montblanc", "small"],
  ["/brand/casa-mirante-do-lago/05-quarto.jpg", "Suíte iluminada", "small"],
  ["/brand/casa-mirante-do-lago/08-banheiro.jpg", "Banheiro com acabamento premium", "small"],
  ["/brand/casa-mirante-do-lago/04-lavabo.jpg", "Lavabo com cuba dupla", "small"],
  ["/brand/casa-mirante-do-lago/12-banheiro-pedra.jpg", "Detalhes em pedra natural", "small"],
  ["/brand/casa-mirante-do-lago/09-piscina-angulo.jpg", "Piscina em outro ângulo", "wide"],
  ["/brand/casa-mirante-do-lago/11-area-externa.jpg", "Varanda e área externa", "wide"]
] as const;

const highlights = [
  [Sparkles, "237 m² construídos", "Projeto contemporâneo em um terreno de 420 m²."],
  [Bath, "1 master + 3 suítes", "Uma suíte master com closet e três suítes plenas."],
  [Waves, "Piscina privativa", "Área gourmet integrada para receber e aproveitar."],
  [CarFront, "4 vagas", "Garagem para a rotina da família e seus convidados."]
] as const;

const details = [
  "01 suíte master com closet + 03 suítes plenas",
  "Cozinha integrada com a área gourmet e a piscina",
  "05 banheiros",
  "Bancadas em Quartzo Montblanc",
  "Poço artesiano",
  "Área construída de 237,00 m²",
  "Área total de 420,00 m²",
  "04 vagas na garagem"
];

const condominiumGallery = [
  ["/brand/casa-mirante-do-lago/condominio-portaria.jpg", "Portaria do Condomínio Mirante do Lago", "large"],
  ["/brand/casa-mirante-do-lago/condominio-clube.webp", "Clube e área de lazer do condomínio", "wide"],
  ["/brand/casa-mirante-do-lago/condominio-lago.jpeg", "Orla e paisagem do lago", "wide"],
  ["/brand/casa-mirante-do-lago/condominio-piscinas.jpeg", "Piscinas e jardins do condomínio", "small"],
  ["/brand/casa-mirante-do-lago/condominio-entrada.jpeg", "Entrada e paisagismo do condomínio", "small"]
] as const;

const condominiumAmenities = [
  "Portaria e controle de acesso",
  "Segurança e monitoramento",
  "Clube e áreas de lazer",
  "Piscina para convivência",
  "Áreas verdes e paisagismo",
  "Espaços para caminhar e aproveitar ao ar livre",
  "Endereço residencial no Plano Diretor Sul"
];

const mapEmbedUrl =
  "https://www.google.com/maps?q=Condominio+Mirante+do+Lago%2C+ALC-SO+141A%2C+Palmas%2C+TO&output=embed";
const mapOpenUrl =
  "https://www.google.com/maps/search/?api=1&query=Condominio+Mirante+do+Lago%2C+ALC-SO+141A%2C+Palmas%2C+TO";

const locationPoints: Array<{
  Icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
  secondaryLink?: string;
  secondaryLinkLabel?: string;
  source?: string;
}> = [
  {
    Icon: ShoppingCart,
    title: "Mercados e atacarejos",
    description: "Assaí Atacadista e Atacadão são referências de compras na região sul de Palmas.",
    link: "https://www.google.com/maps/dir/?api=1&origin=Condominio+Mirante+do+Lago%2C+Palmas%2C+TO&destination=Assai+Atacadista%2C+Palmas%2C+TO",
    linkLabel: "Traçar rota até o Assaí",
    secondaryLink: "https://www.google.com/maps/dir/?api=1&origin=Condominio+Mirante+do+Lago%2C+Palmas%2C+TO&destination=Atacadao+1212+Sul%2C+Palmas%2C+TO",
    secondaryLinkLabel: "Traçar rota até o Atacadão"
  },
  {
    Icon: Plane,
    title: "Aeroporto de Palmas",
    description: "Aeroporto Internacional Brigadeiro Lysias Rodrigues, com acesso pela Avenida Teotônio Segurado.",
    link: "https://www.google.com/maps/dir/?api=1&origin=Condominio+Mirante+do+Lago%2C+Palmas%2C+TO&destination=Aeroporto+Brigadeiro+Lysias+Rodrigues%2C+Palmas%2C+TO",
    linkLabel: "Traçar rota até o aeroporto"
  },
  {
    Icon: Trophy,
    title: "Estádio Nilton Santos",
    description: "Equipamento esportivo e espaço de eventos no Plano Diretor Sul.",
    link: "https://www.google.com/maps/dir/?api=1&origin=Condominio+Mirante+do+Lago%2C+Palmas%2C+TO&destination=Estadio+Nilton+Santos%2C+Palmas%2C+TO",
    linkLabel: "Traçar rota até o estádio"
  },
  {
    Icon: Store,
    title: "Shopping Veredas do Lago",
    description: "Futuro shopping anunciado para o Plano Diretor Sul, com projeto de 120 lojas e alvará de construção divulgado pela Prefeitura.",
    link: "https://www.google.com/maps/search/?api=1&query=Shopping+Veredas+do+Lago%2C+Palmas%2C+TO",
    linkLabel: "Ver referência no mapa",
    source: "https://www.palmas.to.gov.br/core/noticias/eduardo-siqueira-campos-entrega-alvara-e-abre-caminho-para-construcao-de-novo-shopping-em-palmas/"
  },
  {
    Icon: Store,
    title: "Futura Havan",
    description: "Projeto anunciado para o eixo de expansão sul. Endereço definitivo, cronograma e operação ainda devem ser confirmados.",
    link: "https://www.google.com/maps/search/?api=1&query=Havan+Palmas+TO",
    linkLabel: "Pesquisar Havan em Palmas",
    source: "https://btsa.com.br/palmas-cresce-para-o-sul-novos-investimentos-transformam-a-regiao-e-marcam-a-chegada-do-arso-162/"
  }
] as const;

function VisitForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/public/leads/property-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          whatsapp: data.get("whatsapp"),
          email: data.get("email"),
          propertySlug: "casa-mirante-do-lago",
          landingPageSlug: "casa-mirante-do-lago",
          sourcePage: window.location.pathname,
          message: `Interesse na Casa Mirante do Lago, no Plano Diretor Sul. Quero marcar uma visita. Melhor período: ${data.get("visitPeriod") ?? "A combinar"}.`,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      window.location.href = buildWhatsAppUrl(
        "Olá, Pedro! Gostei da Casa Mirante do Lago e quero marcar uma visita."
      );
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível enviar agora.");
    }
  }

  return (
    <form className="residence-form" onSubmit={onSubmit}>
      <div className="residence-form-heading">
        <span className="residence-kicker">Agende sua visita</span>
        <h3>Conheça uma casa feita para viver bem.</h3>
        <p>Deixe seus dados e fale diretamente com o corretor pelo WhatsApp.</p>
      </div>
      <div className="residence-form-grid">
        <label>
          Nome
          <input name="name" placeholder="Como posso chamar você?" required minLength={3} />
        </label>
        <label>
          WhatsApp
          <input name="whatsapp" placeholder="(63) 99999-9999" required minLength={10} inputMode="tel" />
        </label>
        <label>
          E-mail <span>(opcional)</span>
          <input name="email" type="email" placeholder="voce@email.com" />
        </label>
        <label>
          Melhor período
          <select name="visitPeriod" defaultValue="A combinar">
            <option>Durante a manhã</option>
            <option>Durante a tarde</option>
            <option>Durante a noite</option>
            <option>A combinar</option>
          </select>
        </label>
      </div>
      <label className="residence-consent">
        <input name="lgpdConsent" type="checkbox" required />
        <span>Autorizo o contato de Pedro Soares sobre este imóvel e concordo com a política de privacidade.</span>
      </label>
      <button className="residence-button residence-button--gold" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando..." : "Quero marcar uma visita"}
        <MessageCircle size={18} />
      </button>
      {status === "error" ? <p className="residence-form-status" role="alert">{errorMessage}</p> : null}
    </form>
  );
}

export function MiranteLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [lightboxIndex]);

  return (
    <div className="residence-page">
      <LandingPageTracker landingPageSlug="casa-mirante-do-lago" />
      <header className="residence-header">
        <div className="residence-container residence-nav">
          <a className="residence-wordmark" href="#inicio" onClick={closeMenu}>
            <span>Pedro Soares</span>
            <small>Imóveis selecionados</small>
          </a>
          <nav className={menuOpen ? "residence-nav-links is-open" : "residence-nav-links"} aria-label="Navegação da casa">
            <a href="#a-casa" onClick={closeMenu}>A casa</a>
            <a href="#condominio" onClick={closeMenu}>O condomínio</a>
            <a href="#localizacao" onClick={closeMenu}>Localização</a>
            <a href="#galeria" onClick={closeMenu}>Galeria</a>
            <a href="#visita" onClick={closeMenu} className="residence-nav-cta">Agendar visita</a>
          </nav>
          <button className="residence-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
            {menuOpen ? <X /> : <ArrowDown />}
          </button>
        </div>
      </header>

      <main>
        <section className="residence-hero" id="inicio">
          <Image src="/brand/casa-mirante-do-lago/01-fachada.jpg" alt="Fachada da Casa Mirante do Lago" fill priority sizes="100vw" className="residence-hero-image" />
          <div className="residence-hero-overlay" />
          <div className="residence-container residence-hero-content">
            <div className="residence-hero-copy">
              <p className="residence-kicker residence-kicker--light"><span /> Condomínio Mirante do Lago · Palmas/TO</p>
              <h1>Arquitetura contemporânea para viver com leveza.</h1>
              <p className="residence-hero-lede">Uma casa nova, elegante e funcional no Plano Diretor Sul, com integração entre os ambientes sociais, piscina e acabamentos selecionados.</p>
              <div className="residence-hero-actions">
                <a href="#visita" className="residence-button residence-button--gold">Agendar visita <ArrowUpRight size={18} /></a>
                <a href="#galeria" className="residence-text-link">Ver galeria <MoveRight size={18} /></a>
              </div>
            </div>
            <div className="residence-hero-price"><span>Venda</span><strong>R$ 2.800.000</strong><small>Plano Diretor Sul · Palmas/TO</small></div>
          </div>
          <a className="residence-scroll-cue" href="#a-casa"><span>Descubra</span><ArrowDown size={16} /></a>
        </section>

        <section className="residence-intro" id="a-casa">
          <div className="residence-container residence-intro-grid">
            <div><p className="residence-kicker">Um projeto para viver bem</p><h2>Conforto, integração e acabamento em um só endereço.</h2></div>
            <div><p>A Casa Mirante do Lago foi pensada para quem valoriza ambientes bem resolvidos, iluminação natural e uma área social que convida a receber.</p><p>A cozinha integrada à área gourmet e à piscina aproxima a rotina dos melhores momentos de convivência.</p></div>
          </div>
          <div className="residence-container residence-highlight-grid">
            {highlights.map(([Icon, title, text]) => <article key={title}><Icon size={22} /><strong>{title}</strong><p>{text}</p></article>)}
          </div>
        </section>

        <section className="residence-details">
          <div className="residence-container residence-details-grid">
            <div className="residence-details-photo"><Image src="/brand/casa-mirante-do-lago/07-piscina.jpg" alt="Piscina e deck da Casa Mirante do Lago" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="residence-details-copy"><p className="residence-kicker">Acabamento e funcionalidade</p><h2>Detalhes que fazem a casa funcionar para a sua rotina.</h2><ul>{details.map((item) => <li key={item}><span><Check size={14} /></span>{item}</li>)}</ul><a href="#visita" className="residence-button residence-button--dark">Quero visitar este imóvel <MoveRight size={18} /></a></div>
          </div>
        </section>

        <section className="residence-condo" id="condominio">
          <div className="residence-container residence-condo-heading">
            <div><p className="residence-kicker">Além da casa</p><h2>O Condomínio Mirante do Lago complementa a experiência.</h2></div>
            <p>Um endereço residencial no Plano Diretor Sul, com portaria, controle de acesso, áreas de lazer e espaços para aproveitar Palmas com mais tranquilidade.</p>
          </div>
          <div className="residence-container residence-condo-content">
            <div className="residence-condo-copy">
              <div><strong>Segurança e tranquilidade</strong><p>Portaria, controle de acesso e monitoramento ajudam a criar uma rotina mais confortável para os moradores.</p></div>
              <div><strong>Lazer para a família</strong><p>O clube e as áreas de convivência ampliam as possibilidades de descanso, encontro e diversão sem sair do condomínio.</p></div>
              <div><strong>Natureza por perto</strong><p>A paisagem do lago e os espaços verdes convidam a caminhar, contemplar e viver mais ao ar livre.</p></div>
            </div>
            <div className="residence-condo-note"><span>Condomínio Mirante do Lago</span><strong>Um cenário especial para chamar de seu.</strong><p>Praia particular, clube, piscinas, quadras, academia e áreas verdes para aproveitar o endereço.</p><a className="residence-text-link" href="https://www.google.com/maps/search/?api=1&query=Condominio+Mirante+do+Lago%2C+Palmas%2C+TO" target="_blank" rel="noreferrer">Abrir localização no Google Maps <MoveRight size={17} /></a></div>
          </div>
          <div className="residence-container residence-condo-amenities">
            <div className="residence-condo-amenities-heading"><p className="residence-kicker">Condomínio</p><h3>Estrutura para morar, receber e aproveitar.</h3></div>
            <ul>{condominiumAmenities.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="residence-container residence-condo-gallery">
            {condominiumGallery.map(([src, alt, size]) => <figure className={`residence-condo-image residence-condo-image--${size}`} key={src}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" /><figcaption>{alt}</figcaption></figure>)}
          </div>
        </section>

        <section className="residence-location" id="localizacao">
          <div className="residence-container residence-location-heading">
            <div><p className="residence-kicker"><MapPin size={14} /> Localização</p><h2>Um endereço conectado ao sul de Palmas.</h2></div>
            <p>O Condomínio Mirante do Lago está na ALC-SO 141A, Avenida NS-15, no Plano Diretor Sul. Consulte a rota atualizada antes da visita.</p>
          </div>
          <div className="residence-container residence-location-grid">
            <div className="residence-location-map-wrap">
              <div className="residence-location-map">
                <Image src="/brand/casa-mirante-do-lago/mapa-localizacao.png" alt="Mapa de localização do Condomínio Mirante do Lago em Palmas" fill sizes="(max-width: 900px) 100vw, 55vw" />
                <div className="residence-location-map-badge"><MapPin size={16} /> Condomínio Mirante do Lago</div>
              </div>
              <div className="residence-location-map-actions">
                <a className="residence-button residence-button--dark" href={mapOpenUrl} target="_blank" rel="noreferrer">Abrir no Google Maps <ExternalLink size={15} /></a>
                <span>Mapa ilustrativo. A rota e o tempo variam conforme o acesso e o trânsito.</span>
              </div>
            </div>
            <div className="residence-location-points">
              {locationPoints.map(({ Icon, title, description, link, linkLabel, source, secondaryLink, secondaryLinkLabel }) => (
                <article key={title}>
                  <div className="residence-location-point-icon"><Icon size={18} /></div>
                  <div><h3>{title}</h3><p>{description}</p><div className="residence-location-links"><a href={link} target="_blank" rel="noreferrer">{linkLabel} <ExternalLink size={13} /></a>{secondaryLink ? <a href={secondaryLink} target="_blank" rel="noreferrer">{secondaryLinkLabel} <ExternalLink size={13} /></a> : null}{source ? <a href={source} target="_blank" rel="noreferrer">Fonte da informação <ExternalLink size={13} /></a> : null}</div></div>
                </article>
              ))}
            </div>
          </div>
          <div className="residence-container residence-location-embed">
            <iframe title="Mapa do Condomínio Mirante do Lago" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </section>

        <section className="residence-gallery-section" id="galeria">
          <div className="residence-container"><div className="residence-section-heading"><div><p className="residence-kicker">Por todos os ângulos</p><h2>Veja a casa de perto.</h2></div><p>Ambientes claros, linhas contemporâneas e detalhes que fazem a diferença no dia a dia.</p></div><div className="residence-gallery">{gallery.map(([src, alt, size], index) => <figure className={`residence-gallery-${size}`} key={src}><button type="button" className="residence-gallery-trigger" onClick={() => setLightboxIndex(index)} aria-label={`Ampliar foto: ${alt}`}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 33vw" /><span className="residence-gallery-zoom"><Maximize2 size={17} /></span></button><figcaption>{alt}</figcaption></figure>)}</div></div>
        </section>

        <section className="residence-contact" id="visita">
          <div className="residence-container residence-contact-grid"><div className="residence-contact-copy"><p className="residence-kicker residence-kicker--gold">Próximo passo</p><h2>Agende uma visita e sinta a experiência.</h2><p>Fale com Pedro Soares para conhecer todos os detalhes, tirar dúvidas e encontrar o melhor horário para você.</p><div className="residence-broker"><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares" width={64} height={64} /><div><strong>Pedro Soares</strong><span>Corretor de imóveis · CRECI 5861-TO</span></div></div><p className="residence-contact-note"><Home size={18} /> Condomínio Mirante do Lago · Plano Diretor Sul · Palmas/TO</p></div><VisitForm /></div>
        </section>
      </main>

      <footer className="residence-footer"><div className="residence-container"><span>Pedro Soares Imóveis</span><small>Atendimento personalizado em Palmas/TO · CRECI 5861-TO</small></div></footer>

      {lightboxIndex !== null ? (() => {
        const [src, alt] = gallery[lightboxIndex];
        return <div className="residence-lightbox" role="dialog" aria-modal="true" aria-label={`Foto ampliada: ${alt}`} onClick={() => setLightboxIndex(null)}><div className="residence-lightbox-panel" onClick={(event) => event.stopPropagation()}><button type="button" className="residence-lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Fechar foto ampliada"><X size={22} /></button><div className="residence-lightbox-image"><Image src={src} alt={alt} fill sizes="(max-width: 900px) 94vw, 1200px" className="residence-lightbox-image-fit" /></div><p>{alt}</p></div></div>;
      })() : null}
    </div>
  );
}
