"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Bath,
  BedDouble,
  CarFront,
  Check,
  ExternalLink,
  Home,
  MapPin,
  Maximize2,
  MessageCircle,
  MoveRight,
  Ruler,
  Sun,
  Waves,
  X
} from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

const landingSlug = "casa-terrea-mirante-do-lago";
const propertySlug = "casa-terrea-mirante-do-lago";
const mapUrl =
  "https://www.google.com/maps/search/?api=1&query=Condominio+Mirante+do+Lago%2C+Palmas%2C+TO";
const mapEmbedUrl =
  "https://www.google.com/maps?q=Condominio+Mirante+do+Lago%2C+Palmas%2C+TO&output=embed";

const gallery = [
  ["/brand/casa-terrea-mirante-do-lago/fotos/18-fachada.jpg", "Fachada da casa térrea", "hero"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/14-cozinha-piscina.jpg", "Cozinha integrada à área externa", "wide"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/12-estar-jantar.jpg", "Sala de estar e jantar com pé-direito duplo", "wide"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/15-cozinha-ilha.jpg", "Cozinha planejada com ilha", "small"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/16-area-gourmet.jpg", "Área gourmet com churrasqueira", "small"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/17-piscina.jpg", "Piscina com hidromassagem separada", "wide"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/04-quarto-painel.jpg", "Suíte com painel planejado", "small"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/05-quarto-painel-2.jpg", "Suíte com marcenaria e iluminação em LED", "small"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/06-closet.jpg", "Closet da suíte master", "wide"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/07-closet-2.jpg", "Marcenaria planejada no closet", "small"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/08-banheiro-master.jpg", "Banheiro da suíte master com banheira", "wide"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/01-quarto.jpg", "Quarto com janela ampla", "small"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/02-quarto-espelho.jpg", "Quarto com armário espelhado", "small"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/03-banheiro.jpg", "Banheiro com bancada planejada", "small"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/09-circulacao.jpg", "Circulação com armários planejados", "small"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/10-quarto-2.jpg", "Quarto com armário planejado", "small"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/11-quarto-3.jpg", "Suíte com cabeceira estofada", "small"],
  ["/brand/casa-terrea-mirante-do-lago/fotos/13-cozinha.jpg", "Cozinha com marcenaria completa", "wide"]
] as const;

const highlights = [
  [Ruler, "210 m² construídos", "Ambientes integrados em uma casa térrea bem resolvida."],
  [Home, "Terreno de 420 m²", "Espaço para jardins, lazer e convivência ao ar livre."],
  [BedDouble, "3 suítes", "Suíte master com closet e banheira de hidromassagem."],
  [Waves, "Piscina + hidromassagem", "Área externa privativa para relaxar e receber."]
] as const;

const details = [
  "Sala de estar com pé-direito duplo integrada à cozinha",
  "Lavabo",
  "03 suítes, sendo a master com closet e banheira de hidromassagem",
  "Área de serviço e banheiro de serviço",
  "Varanda gourmet integrada à piscina",
  "Piscina com hidromassagem separada",
  "Iluminação em LED",
  "Espaço para jardins",
  "02 vagas de garagem cobertas e 02 descobertas",
  "Móveis planejados em todos os ambientes"
];

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
          landingPageSlug: landingSlug,
          sourcePage: window.location.pathname,
          message: `Interesse na Casa Térrea Mirante do Lago. Melhor período para visita: ${data.get("visitPeriod") ?? "A combinar"}.`,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      window.location.href = buildWhatsAppUrl(
        "Olá, Pedro! Tenho interesse na Casa Térrea do Condomínio Mirante do Lago e quero agendar uma visita."
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
        <h3>Conheça a casa pessoalmente.</h3>
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

export function CasaTerreaMiranteLanding() {
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
      <LandingPageTracker landingPageSlug={landingSlug} />
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
          <Image src="/brand/casa-terrea-mirante-do-lago/fotos/18-fachada.jpg" alt="Fachada da casa térrea no Condomínio Mirante do Lago" fill priority sizes="100vw" className="residence-hero-image" />
          <div className="residence-hero-overlay" />
          <div className="residence-container residence-hero-content">
            <div className="residence-hero-copy">
              <p className="residence-kicker residence-kicker--light"><span /> Condomínio Mirante do Lago · Palmas/TO</p>
              <h1>Casa térrea para viver com conforto no Mirante do Lago.</h1>
              <p className="residence-hero-lede">Uma residência de 210 m² em terreno de 420 m², com três suítes, ambientes integrados, móveis planejados e uma área externa feita para aproveitar.</p>
              <div className="residence-hero-actions">
                <a href="#visita" className="residence-button residence-button--gold">Agendar visita <ArrowUpRight size={18} /></a>
                <a href="#galeria" className="residence-text-link">Ver galeria <MoveRight size={18} /></a>
              </div>
            </div>
            <div className="residence-hero-price"><span>Venda</span><strong>R$ 2.390.000</strong><small>Casa térrea · Mirante do Lago</small></div>
          </div>
          <a className="residence-scroll-cue" href="#a-casa"><span>Descubra</span><ArrowDown size={16} /></a>
        </section>

        <section className="residence-intro" id="a-casa">
          <div className="residence-container residence-intro-grid">
            <div><p className="residence-kicker">Uma casa para viver bem</p><h2>Amplitude, praticidade e lazer em um só endereço.</h2></div>
            <div><p>Esta casa térrea combina uma área social generosa com a praticidade de ter todos os ambientes no mesmo nível.</p><p>O pé-direito duplo, a cozinha integrada, a varanda gourmet e a piscina com hidromassagem criam uma extensão natural para os encontros da família.</p></div>
          </div>
          <div className="residence-container residence-highlight-grid">
            {highlights.map(([Icon, title, text]) => <article key={title}><Icon size={22} /><strong>{title}</strong><p>{text}</p></article>)}
          </div>
        </section>

        <section className="residence-details">
          <div className="residence-container residence-details-grid">
            <div className="residence-details-photo"><Image src="/brand/casa-terrea-mirante-do-lago/fotos/17-piscina.jpg" alt="Piscina com hidromassagem separada e área externa" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="residence-details-copy"><p className="residence-kicker">Detalhes do imóvel</p><h2>Uma casa pronta para acompanhar a sua rotina.</h2><ul>{details.map((item) => <li key={item}><span><Check size={14} /></span>{item}</li>)}</ul><a href="#visita" className="residence-button residence-button--dark">Quero visitar este imóvel <MoveRight size={18} /></a></div>
          </div>
        </section>

        <section className="residence-condo" id="condominio">
          <div className="residence-container residence-condo-heading">
            <div><p className="residence-kicker">O endereço</p><h2>O Condomínio Mirante do Lago como cenário para a sua casa.</h2></div>
            <p>Uma oportunidade para morar em uma casa térrea dentro de condomínio, com o conforto de uma residência completa e a praticidade de um endereço planejado em Palmas.</p>
          </div>
          <div className="residence-container residence-condo-facts">
            <div className="residence-condo-fact"><strong>420 m²</strong><span>Terreno</span></div>
            <div className="residence-condo-fact"><strong>210 m²</strong><span>Área construída</span></div>
            <div className="residence-condo-fact"><strong>3 suítes</strong><span>Conforto para a família</span></div>
          </div>
          <div className="residence-container residence-condo-content">
            <div className="residence-condo-copy">
              <div><strong>Casa térrea</strong><p>Fluxo confortável entre sala, cozinha, suítes e área externa, sem escadas na rotina.</p></div>
              <div><strong>Condomínio fechado</strong><p>Um endereço residencial planejado em Palmas, com portaria, controle de acesso e espaços de convivência.</p></div>
              <div><strong>Área externa</strong><p>Varanda gourmet, piscina com hidromassagem separada e espaço para jardins.</p></div>
            </div>
            <div className="residence-condo-note"><span>Mirante do Lago · Palmas/TO</span><strong>Seu próximo endereço pode estar aqui.</strong><p>Confira condições de pagamento, disponibilidade e agende uma visita acompanhada.</p><a className="residence-text-link" href={mapUrl} target="_blank" rel="noreferrer">Abrir localização no Google Maps <ExternalLink size={15} /></a></div>
          </div>
          <div className="residence-container residence-condo-amenities">
            <div className="residence-condo-amenities-heading"><p className="residence-kicker">Em destaque</p><h3>Uma planta pensada para morar e receber.</h3></div>
            <ul><li><Sun size={14} /> Iluminação em LED</li><li><Waves size={14} /> Piscina com hidromassagem separada</li><li><Bath size={14} /> Suíte master com banheira</li><li><CarFront size={14} /> 2 vagas cobertas + 2 descobertas</li><li><Home size={14} /> Área de serviço e banheiro de serviço</li><li><BedDouble size={14} /> Móveis planejados em todos os ambientes</li></ul>
          </div>
        </section>

        <section className="residence-location" id="localizacao">
          <div className="residence-container residence-location-heading">
            <div><p className="residence-kicker"><MapPin size={14} /> Localização</p><h2>Condomínio Mirante do Lago, em Palmas/TO.</h2></div>
            <p>Consulte a rota atualizada no Google Maps e fale com Pedro Soares para combinar a visita ao imóvel.</p>
          </div>
          <div className="residence-container residence-location-grid">
            <div className="residence-location-map-wrap"><div className="residence-location-map"><Image src="/brand/casa-mirante-do-lago/mapa-localizacao.png" alt="Mapa de localização do Condomínio Mirante do Lago em Palmas" fill sizes="(max-width: 900px) 100vw, 55vw" /><div className="residence-location-map-badge"><MapPin size={16} /> Condomínio Mirante do Lago</div></div><div className="residence-location-map-actions"><a className="residence-button residence-button--dark" href={mapUrl} target="_blank" rel="noreferrer">Abrir no Google Maps <ExternalLink size={15} /></a><span>Mapa ilustrativo. A rota e o tempo variam conforme o acesso e o trânsito.</span></div></div>
            <div className="residence-location-points"><article><div className="residence-location-point-icon"><Home size={18} /></div><div><h3>Casa em condomínio</h3><p>Uma residência térrea com 420 m² de terreno e 210 m² construídos.</p></div></article><article><div className="residence-location-point-icon"><MapPin size={18} /></div><div><h3>Visita acompanhada</h3><p>Envie seus dados para receber atendimento sobre condições e disponibilidade.</p><div className="residence-location-links"><a href="#visita">Agendar visita <MoveRight size={13} /></a></div></div></article></div>
          </div>
          <div className="residence-container residence-location-embed"><iframe title="Mapa do Condomínio Mirante do Lago" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
        </section>

        <section className="residence-gallery-section" id="galeria">
          <div className="residence-container"><div className="residence-section-heading"><div><p className="residence-kicker">Por todos os ângulos</p><h2>Veja a casa de perto.</h2></div><p>Ambientes planejados, cozinha integrada, suítes, banheira e a área externa com piscina e hidromassagem.</p></div><div className="residence-gallery">{gallery.map(([src, alt, size], index) => <figure className={`residence-gallery-${size}`} key={src}><a className="residence-gallery-trigger" href={src} target="_blank" rel="noreferrer" onClick={(event) => { event.preventDefault(); setLightboxIndex(index); }} aria-label={`Abrir foto ampliada: ${alt}`}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 33vw" /><span className="residence-gallery-zoom"><Maximize2 size={17} /></span></a><figcaption>{alt}</figcaption></figure>)}</div></div>
        </section>

        <section className="residence-contact" id="visita">
          <div className="residence-container residence-contact-grid"><div className="residence-contact-copy"><p className="residence-kicker residence-kicker--gold">Próximo passo</p><h2>Agende uma visita e veja se esta casa é para você.</h2><p>Receba atendimento sobre o imóvel, o fluxo de pagamento e os próximos horários disponíveis.</p><div className="residence-broker"><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares" width={64} height={64} /><div><strong>Pedro Soares</strong><span>Corretor de imóveis · CRECI 5861-TO</span></div></div><p className="residence-contact-note"><Home size={18} /> Condomínio Mirante do Lago · Palmas/TO</p></div><VisitForm /></div>
        </section>
      </main>

      {lightboxIndex !== null ? (() => { const [src, alt] = gallery[lightboxIndex]; return <div className="residence-lightbox" role="dialog" aria-modal="true" aria-label={`Foto ampliada: ${alt}`} onClick={() => setLightboxIndex(null)}><div className="residence-lightbox-panel" onClick={(event) => event.stopPropagation()}><button type="button" className="residence-lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Fechar foto ampliada"><X size={22} /></button><div className="residence-lightbox-image"><Image src={src} alt={alt} fill sizes="(max-width: 900px) 94vw, 1200px" className="residence-lightbox-image-fit" /></div><p>{alt}</p></div></div>; })() : null}
    </div>
  );
}
