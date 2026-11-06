"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Bath,
  BriefcaseBusiness,
  CarFront,
  Check,
  ExternalLink,
  Home,
  MapPin,
  Maximize2,
  MessageCircle,
  MoveRight,
  Ruler,
  Sparkles,
  Sun,
  Volume2,
  Waves,
  X,
  Zap
} from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { WhatsAppPropertyButton } from "@/components/public/whatsapp-property-button";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

const propertySlug = "casa-alto-padrao-praia-graciosa";

const gallery = [
  ["/brand/casa-alto-padrao-praia-graciosa/foto-01.jpg", "Fachada principal com paisagismo e iluminação cênica", "hero"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-02.jpg", "Garagem coberta e acesso principal", "wide"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-03.jpg", "Piscina com cascata e hidromassagem", "wide"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-04.jpg", "Sala integrada à área externa", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-05.jpg", "Cozinha gourmet com ilha e bancada", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-06.jpg", "Ambiente social com iluminação indireta", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-07.jpg", "Varanda gourmet integrada à piscina", "wide"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-08.jpg", "Banheiro com acabamento Travertino", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-09.jpg", "Suíte com iluminação embutida", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-10.jpg", "Ambiente íntimo com janela alta", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-11.jpg", "Circulação interna com iluminação pontual", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-12.jpg", "Fachada ao entardecer", "wide"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-13.jpg", "Suíte com acabamento contemporâneo", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-14.jpg", "Banheiro com bancada em pedra", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-15.jpg", "Quarto com piso em Travertino", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-16.jpg", "Banheiro com nicho iluminado", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-17.jpg", "Sala de estar e integração visual", "wide"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-18.jpg", "Ambiente social em perspectiva", "small"],
  ["/brand/casa-alto-padrao-praia-graciosa/foto-19.jpg", "Banheiro com duas duchas", "small"]
] as const;

const highlights = [
  [Ruler, "192,68 m² construídos", "Área construída em um terreno de 320 m²."],
  [Bath, "4 suítes + escritório", "Conforto para a rotina da família e para receber."],
  [Waves, "Piscina privativa", "Cascata, hidromassagem e aquecimento solar."],
  [Zap, "Casa inteligente", "Energia solar, automação por voz e som integrado."]
] as const;

const details = [
  "Terreno de 320 m² e área coberta total de 224,34 m²",
  "Sala com pé-direito alto e iluminação planejada",
  "Cozinha gourmet com acabamento premium",
  "Varanda gourmet integrada à área da piscina",
  "Paisagismo com irrigação automatizada",
  "Garagem coberta e preparação para câmeras",
  "Fachada com Pedra Atacama",
  "Porcelanato acetinado 90x90 Travertino",
  "Bancadas em São Gabriel Escovado",
  "Porta principal imponente em alumínio"
];

const mapEmbedUrl =
  "https://www.google.com/maps?q=Praia+da+Graciosa%2C+Palmas%2C+TO&output=embed";
const mapOpenUrl =
  "https://www.google.com/maps/search/?api=1&query=Praia+da+Graciosa+Palmas+TO";

const locationPoints = [
  {
    Icon: Waves,
    title: "Orla da Praia da Graciosa",
    description: "A residência está anunciada próxima à orla da Praia da Graciosa, em Palmas/TO.",
    link: mapOpenUrl,
    linkLabel: "Abrir referência no Google Maps"
  },
  {
    Icon: MapPin,
    title: "Localização aproximada",
    description: "O endereço completo deve ser confirmado diretamente com o corretor antes da visita.",
    link: mapOpenUrl,
    linkLabel: "Consultar rota até a região"
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
          propertySlug,
          landingPageSlug: propertySlug,
          sourcePage: window.location.pathname,
          message: `Interesse na casa nova de alto padrão próxima à Praia da Graciosa. Melhor período para contato: ${data.get("visitPeriod") ?? "A combinar"}.`,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      window.location.href = buildWhatsAppUrl(
        "Olá, Pedro! Gostei da casa nova de alto padrão próxima à Praia da Graciosa e quero saber mais."
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
        <h3>Conheça uma casa pensada para viver com sofisticação.</h3>
        <p>Deixe seus dados e fale diretamente com Pedro Soares pelo WhatsApp.</p>
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

export function CasaAltoPadraoLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeMenu = () => setMenuOpen(false);
  const whatsappMessage = "Olá, Pedro! Gostei da casa nova de alto padrão próxima à Praia da Graciosa e quero saber mais.";

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

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: "Casa nova de alto padrão próxima à Praia da Graciosa",
    description: "Residência moderna com 4 suítes, escritório, piscina, energia solar, automação residencial e acabamentos premium.",
    url: "https://www.pedrosoarescorretor.com.br/casa-alto-padrao-praia-graciosa",
    image: gallery.map(([src]) => `https://www.pedrosoarescorretor.com.br${src}`),
    offers: {
      "@type": "Offer",
      price: "1650000",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Palmas",
      addressRegion: "TO",
      addressCountry: "BR",
      streetAddress: "Região aproximada da Praia da Graciosa"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://www.pedrosoarescorretor.com.br/" },
      { "@type": "ListItem", position: 2, name: "Imóveis", item: "https://www.pedrosoarescorretor.com.br/imoveis/prontos" },
      { "@type": "ListItem", position: 3, name: "Casa próxima à Praia da Graciosa" }
    ]
  };

  return (
    <div className="residence-page">
      <LandingPageTracker landingPageSlug={propertySlug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="residence-header">
        <div className="residence-container residence-nav">
          <a className="residence-wordmark" href="#inicio" onClick={closeMenu}>
            <span>Pedro Soares</span>
            <small>Imóveis selecionados</small>
          </a>
          <nav className={menuOpen ? "residence-nav-links is-open" : "residence-nav-links"} aria-label="Navegação da casa">
            <a href="#a-casa" onClick={closeMenu}>A casa</a>
            <a href="#diferenciais" onClick={closeMenu}>Diferenciais</a>
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
          <Image src={gallery[0][0]} alt={gallery[0][1]} fill priority sizes="100vw" className="residence-hero-image" />
          <div className="residence-hero-overlay" />
          <div className="residence-container residence-hero-content">
            <div className="residence-hero-copy">
              <p className="residence-kicker residence-kicker--light"><span /> Próxima à Orla da Praia da Graciosa · Palmas/TO</p>
              <h1>Casa nova de alto padrão para viver com presença.</h1>
              <p className="residence-hero-lede">Arquitetura moderna, tecnologia e acabamento premium em uma residência com 4 suítes, piscina e integração entre os ambientes.</p>
              <div className="residence-hero-actions">
                <a href="#visita" className="residence-button residence-button--gold">Agendar visita <ArrowUpRight size={18} /></a>
                <WhatsAppPropertyButton propertySlug={propertySlug} message={whatsappMessage} className="residence-text-link" label="Falar no WhatsApp" />
                <a href="#galeria" className="residence-text-link">Ver galeria <MoveRight size={18} /></a>
              </div>
            </div>
            <div className="residence-hero-price"><span>Venda</span><strong>R$ 1.650.000</strong><small>Orla da Graciosa · Palmas/TO</small></div>
          </div>
          <a className="residence-scroll-cue" href="#a-casa"><span>Descubra</span><ArrowDown size={16} /></a>
        </section>

        <section className="residence-intro" id="a-casa">
          <div className="residence-container residence-intro-grid">
            <div><p className="residence-kicker">Um projeto contemporâneo</p><h2>Conforto, tecnologia e acabamento em uma casa pronta para impressionar.</h2></div>
            <div><p>Uma residência moderna, sofisticada e pensada para oferecer conforto, automação e excelente padrão de acabamento próxima à Orla da Praia da Graciosa.</p><p>A integração entre sala, cozinha gourmet, varanda e piscina cria uma área social fluida para viver a rotina e receber.</p></div>
          </div>
          <div className="residence-container residence-highlight-grid">
            {highlights.map(([Icon, title, text]) => <article key={title}><Icon size={22} /><strong>{title}</strong><p>{text}</p></article>)}
          </div>
        </section>

        <section className="residence-details">
          <div className="residence-container residence-details-grid">
            <div className="residence-details-photo"><Image src={gallery[2][0]} alt={gallery[2][1]} fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="residence-details-copy"><p className="residence-kicker">Acabamentos e funcionalidade</p><h2>Detalhes que elevam a experiência de morar.</h2><ul>{details.map((item) => <li key={item}><span><Check size={14} /></span>{item}</li>)}</ul><a href="#visita" className="residence-button residence-button--dark">Quero visitar este imóvel <MoveRight size={18} /></a></div>
          </div>
        </section>

        <section className="residence-condo" id="diferenciais">
          <div className="residence-container residence-condo-heading">
            <div><p className="residence-kicker">Diferenciais da residência</p><h2>Uma casa com tecnologia, lazer e materiais escolhidos.</h2></div>
            <p>Os dados abaixo refletem as informações fornecidas para o imóvel. Itens não informados, como endereço completo, vagas e banheiros, permanecem sob confirmação.</p>
          </div>
          <div className="residence-container residence-condo-content">
            <div className="residence-condo-copy">
              <div><strong>Automação residencial</strong><p>Comandos por voz para uma rotina mais prática e conectada.</p></div>
              <div><strong>Área de lazer integrada</strong><p>Piscina com cascata, hidromassagem e aquecimento solar junto à varanda gourmet.</p></div>
              <div><strong>Eficiência e segurança</strong><p>Energia solar instalada, irrigação automatizada e preparação para câmeras.</p></div>
            </div>
            <div className="residence-condo-note"><span>Casa nova · Palmas/TO</span><strong>Alto padrão em cada escolha.</strong><p>Fachada com Pedra Atacama, bancadas em São Gabriel Escovado, porcelanato Travertino e porta principal em alumínio.</p><a className="residence-text-link" href="#visita">Receber atendimento <MoveRight size={17} /></a></div>
          </div>
          <div className="residence-container residence-condo-amenities">
            <div className="residence-condo-amenities-heading"><p className="residence-kicker">Tecnologia e conforto</p><h3>Recursos que acompanham o jeito contemporâneo de morar.</h3></div>
            <ul><li><Sparkles size={15} /> Sala com pé-direito alto</li><li><BriefcaseBusiness size={15} /> Escritório</li><li><Sun size={15} /> Aquecimento solar</li><li><Zap size={15} /> Energia solar instalada</li><li><Volume2 size={15} /> Sistema de som integrado</li><li><CarFront size={15} /> Garagem coberta</li></ul>
          </div>
        </section>

        <section className="residence-location" id="localizacao">
          <div className="residence-container residence-location-heading">
            <div><p className="residence-kicker"><MapPin size={14} /> Localização</p><h2>Próxima à Orla da Praia da Graciosa.</h2></div>
            <p>A página apresenta a região aproximada informada para o imóvel. O endereço completo deve ser confirmado no atendimento antes do agendamento.</p>
          </div>
          <div className="residence-container residence-location-grid">
            <div className="residence-location-map-wrap">
              <div className="residence-location-map">
                <iframe title="Mapa aproximado da Praia da Graciosa em Palmas" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ display: "block", width: "100%", height: "100%", minHeight: 480, border: 0 }} />
                <div className="residence-location-map-badge"><MapPin size={16} /> Região aproximada</div>
              </div>
              <div className="residence-location-map-actions"><a className="residence-button residence-button--dark" href={mapOpenUrl} target="_blank" rel="noreferrer">Abrir no Google Maps <ExternalLink size={15} /></a><span>A rota e o tempo variam conforme o acesso e o trânsito.</span></div>
            </div>
            <div className="residence-location-points">
              {locationPoints.map(({ Icon, title, description, link, linkLabel }) => <article key={title}><div className="residence-location-point-icon"><Icon size={18} /></div><div><h3>{title}</h3><p>{description}</p><div className="residence-location-links"><a href={link} target="_blank" rel="noreferrer">{linkLabel} <ExternalLink size={13} /></a></div></div></article>)}
            </div>
          </div>
        </section>

        <section className="residence-gallery-section" id="galeria">
          <div className="residence-container"><div className="residence-section-heading"><div><p className="residence-kicker">Por todos os ângulos</p><h2>Veja a casa de perto.</h2></div><p>Fachada, área social, piscina, suítes e acabamentos registrados nas fotos do imóvel.</p></div><div className="residence-gallery">{gallery.map(([src, alt, size], index) => <figure className={`residence-gallery-${size}`} key={src}><button type="button" className="residence-gallery-trigger" onClick={() => setLightboxIndex(index)} aria-label={`Ampliar foto: ${alt}`}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 33vw" /><span className="residence-gallery-zoom"><Maximize2 size={17} /></span></button><figcaption>{alt}</figcaption></figure>)}</div></div>
        </section>

        <section className="residence-contact" id="visita">
          <div className="residence-container residence-contact-grid"><div className="residence-contact-copy"><p className="residence-kicker residence-kicker--gold">Próximo passo</p><h2>Agende uma visita e conheça todos os detalhes.</h2><p>Fale com Pedro Soares para confirmar disponibilidade, localização exata e o melhor horário para visitar.</p><div className="residence-broker"><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares" width={64} height={64} /><div><strong>Pedro Soares</strong><span>Corretor de imóveis · CRECI 5861-TO</span></div></div><p className="residence-contact-note"><Home size={18} /> Praia da Graciosa · Palmas/TO</p></div><VisitForm /></div>
        </section>
      </main>

      <footer className="residence-footer"><div className="residence-container"><span>Pedro Soares Imóveis</span><small>Atendimento personalizado em Palmas/TO · CRECI 5861-TO</small></div></footer>

      {lightboxIndex !== null ? (() => { const [src, alt] = gallery[lightboxIndex]; return <div className="residence-lightbox" role="dialog" aria-modal="true" aria-label={`Foto ampliada: ${alt}`} onClick={() => setLightboxIndex(null)}><div className="residence-lightbox-panel" onClick={(event) => event.stopPropagation()}><button type="button" className="residence-lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Fechar foto ampliada"><X size={22} /></button><div className="residence-lightbox-image"><Image src={src} alt={alt} fill sizes="(max-width: 900px) 94vw, 1200px" className="residence-lightbox-image-fit" /></div><p>{alt}</p></div></div>; })() : null}
    </div>
  );
}
