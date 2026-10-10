"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Bath,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MapPin,
  MessageCircle,
  MoveRight,
  Ruler,
  Sparkles,
  Waves,
  X
} from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

const gallery = [
  ["/brand/casa-nova-caribe/1-Foto-1.jpg", "Fachada contemporânea ao entardecer", "hero"],
  ["/brand/casa-nova-caribe/7-Foto-7.jpg", "Piscina, cascata e deck em porcelanato", "wide"],
  ["/brand/casa-nova-caribe/10-Foto-10.jpg", "Área externa integrada ao jardim", "wide"],
  ["/brand/casa-nova-caribe/2-Foto-2.jpg", "Fachada e garagem", "small"],
  ["/brand/casa-nova-caribe/3-Foto-3.jpg", "Garagem com iluminação arquitetural", "small"],
  ["/brand/casa-nova-caribe/4-Foto-4.jpg", "Fachada com iluminação cênica", "small"],
  ["/brand/casa-nova-caribe/5-Foto-5.jpg", "Linhas contemporâneas do projeto", "small"],
  ["/brand/casa-nova-caribe/6-Foto-6.jpg", "Varanda gourmet", "small"],
  ["/brand/casa-nova-caribe/8-Foto-8.jpg", "Piscina e paisagismo", "small"],
  ["/brand/casa-nova-caribe/9-Foto-9.jpg", "Cozinha e bancada", "small"]
] as const;

const interiorGallery = [
  ["/brand/casa-nova-caribe/interiores/1-Foto-1.jpg", "Banheiro com bancada, iluminação e nichos", "hero"],
  ["/brand/casa-nova-caribe/interiores/2-Foto-2.jpg", "Banheiro com bancada dupla", "small"],
  ["/brand/casa-nova-caribe/interiores/3-Foto-3.jpg", "Banheiro com iluminação indireta", "small"],
  ["/brand/casa-nova-caribe/interiores/4-Foto-4.jpg", "Escritório com trilho de iluminação", "small"],
  ["/brand/casa-nova-caribe/interiores/5-Foto-5.jpg", "Banheiro com cuba esculpida e parede em pedra natural", "small"],
  ["/brand/casa-nova-caribe/interiores/6-Foto-6.jpg", "Cozinha integrada à área externa", "small"],
  ["/brand/casa-nova-caribe/interiores/11-Foto-11.jpg", "Cozinha planejada com ilha central", "wide"],
  ["/brand/casa-nova-caribe/interiores/12-Foto-12.jpg", "Bancada da varanda gourmet", "wide"],
  ["/brand/casa-nova-caribe/interiores/13-Foto-13.jpg", "Varanda gourmet integrada ao jardim", "small"],
  ["/brand/casa-nova-caribe/interiores/14-Foto-14.jpg", "Varanda gourmet com iluminação cênica", "small"],
  ["/brand/casa-nova-caribe/interiores/15-Foto-15.jpg", "Área gourmet ao entardecer", "small"],
  ["/brand/casa-nova-caribe/interiores/16-Foto-16.jpg", "Varanda gourmet com churrasqueira e TV", "small"]
] as const;

const condominiumGallery = [
  ["/brand/caribe-residence/condominio/1-Foto-1.jpg", "Vista da área de lazer do Caribe Residence", "large"],
  ["/brand/caribe-residence/condominio/2-Foto-2.jpg", "Paisagem do lago ao entardecer", "small"],
  ["/brand/caribe-residence/condominio/3-Foto-3.jpg", "Clube, piscinas e áreas verdes", "small"],
  ["/brand/caribe-residence/condominio/4-Foto-4.jpg", "Estrutura esportiva e recreativa", "wide"],
  ["/brand/caribe-residence/condominio/5-Foto-5.jpg", "Caminhos e acesso à água", "wide"]
] as const;

const highlights = [
  [Bath, "3 suítes plenas", "Conforto e privacidade para a família."],
  [Ruler, "243 m² construídos", "Uma planta equilibrada em lote de 609,76 m²."],
  [Waves, "Piscina com cascata", "Área externa pronta para viver e receber."],
  [Sparkles, "Projeto QUBUS", "Arquitetura contemporânea com iluminação cênica."]
] as const;

const houseDetails = [
  "3 suítes plenas",
  "Cozinha e varanda gourmet",
  "Sala de estar e sala de jantar",
  "Escritório com lavabo",
  "Área de serviço e lavatório interno",
  "Banheiro social",
  "Garagem e circulação",
  "Piscina com cascata e ducha externa",
  "Deck em porcelanato e paisagismo",
  "Churrasqueira e ponto para irrigação",
  "Pontos para energia solar e carro elétrico",
  "Preparação para poço semiartesiano",
  "Ponto para banheira na suíte master"
];

const condominiumFacts = [
  ["Clube", "estrutura de lazer e convivência"],
  ["Marina", "conexão com o Lago de Palmas"],
  ["600 m²+", "lotes residenciais a partir desta área"]
] as const;

const condominiumMapUrl =
  "https://www.google.com/maps/search/?api=1&query=Caribe+Residence+%26+Resort%2C+Palmas%2C+TO";
const condominiumSourceUrl = "https://www.lnurbanismo.com.br/empreendimentos/caribe-residence-and-resort";

type GalleryItem = readonly [string, string, string];

function LightboxGallery({
  items,
  variant = "gallery"
}: {
  items: readonly GalleryItem[];
  variant?: "gallery" | "condo";
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isCondo = variant === "condo";
  const gridClass = isCondo ? "caribe-condo-gallery" : "caribe-gallery";

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current === null ? 0 : (current - 1 + items.length) % items.length));
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current === null ? 0 : (current + 1) % items.length));
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, items.length]);

  const activeItem = activeIndex === null ? null : items[activeIndex];

  return (
    <>
      <div className={gridClass}>
        {items.map(([src, alt, size], index) => (
          <button
            className={`${isCondo ? "caribe-condo-image" : "caribe-gallery"}-${size} ${isCondo ? "caribe-condo-image" : "caribe-gallery-trigger"}`}
            key={src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Ampliar foto: ${alt}`}
          >
            <Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" />
            <span className="caribe-gallery-zoom" aria-hidden="true"><Maximize2 size={17} /></span>
            <span className={isCondo ? "caribe-condo-image-caption" : "caribe-gallery-caption"}>{alt}</span>
          </button>
        ))}
      </div>

      {activeItem ? (
        <div
          className="caribe-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização ampliada: ${activeItem[1]}`}
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setActiveIndex(null);
          }}
        >
          <div className="caribe-lightbox-panel">
            <div className="caribe-lightbox-toolbar">
              <span>Casa Nova · Caribe Residence</span>
              <button type="button" onClick={() => setActiveIndex(null)} aria-label="Fechar visualização ampliada">
                <X size={22} />
              </button>
            </div>
            <div className="caribe-lightbox-image-wrap">
              <Image src={activeItem[0]} alt={activeItem[1]} fill sizes="100vw" className="caribe-lightbox-image" priority />
              <button
                type="button"
                className="caribe-lightbox-arrow caribe-lightbox-arrow--left"
                onClick={() => setActiveIndex((current) => (current === null ? 0 : (current - 1 + items.length) % items.length))}
                aria-label="Foto anterior"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                type="button"
                className="caribe-lightbox-arrow caribe-lightbox-arrow--right"
                onClick={() => setActiveIndex((current) => (current === null ? 0 : (current + 1) % items.length))}
                aria-label="Próxima foto"
              >
                <ChevronRight size={28} />
              </button>
            </div>
            <div className="caribe-lightbox-caption">
              <p>{activeItem[1]}</p>
              <small>{(activeIndex ?? 0) + 1} / {items.length}</small>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

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
          propertySlug: "casa-nova-caribe-residence-resort",
          landingPageSlug: "casa-nova-caribe-residence",
          sourcePage: window.location.pathname,
          message: `Interesse na Casa Nova - Caribe Residence Condomínio Resort. Projeto QUBUS Arquitetura. Melhor período para visita: ${data.get("visitPeriod") ?? "A combinar"}.`,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      window.location.href = buildWhatsAppUrl(
        "Olá, Pedro! Gostei da Casa Nova no Caribe Residence e quero marcar uma visita."
      );
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível enviar agora.");
    }
  }

  return (
    <form className="caribe-form" onSubmit={onSubmit}>
      <div className="caribe-form-heading">
        <span className="caribe-kicker">Agende sua visita</span>
        <h3>Conheça a casa nova de perto.</h3>
        <p>Deixe seus dados. O atendimento segue para o WhatsApp do corretor.</p>
      </div>
      <div className="caribe-form-grid">
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
      <label className="caribe-consent">
        <input name="lgpdConsent" type="checkbox" required />
        <span>Autorizo o contato de Pedro Soares sobre este imóvel e concordo com a política de privacidade.</span>
      </label>
      <button className="caribe-button caribe-button--gold" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando..." : "Quero marcar uma visita"}
        <MessageCircle size={18} />
      </button>
      {status === "error" ? (
        <p className="caribe-form-status caribe-form-status--error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}

export function CasaNovaCaribeLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="caribe-page">
      <LandingPageTracker landingPageSlug="casa-nova-caribe-residence" />
      <header className="caribe-header">
        <div className="caribe-container caribe-nav">
          <a className="caribe-wordmark" href="#inicio" onClick={closeMenu}>
            <span>Pedro Soares</span>
            <small>Imóveis selecionados</small>
          </a>
          <nav className={menuOpen ? "caribe-nav-links is-open" : "caribe-nav-links"} aria-label="Navegação da casa">
            <a href="#a-casa" onClick={closeMenu}>A casa</a>
            <a href="#condominio" onClick={closeMenu}>O condomínio</a>
            <a href="#galeria" onClick={closeMenu}>Galeria</a>
            <a href="#visita" onClick={closeMenu} className="caribe-nav-cta">Agendar visita</a>
          </nav>
          <button className="caribe-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
            {menuOpen ? <X /> : <ArrowDown />}
          </button>
        </div>
      </header>

      <main>
        <section className="caribe-hero" id="inicio">
          <Image src="/brand/casa-nova-caribe/1-Foto-1.jpg" alt="Fachada da casa nova no Caribe Residence Condomínio Resort" fill priority sizes="100vw" className="caribe-hero-image" />
          <div className="caribe-hero-overlay" />
          <div className="caribe-container caribe-hero-content">
            <div className="caribe-hero-copy">
              <p className="caribe-kicker caribe-kicker--light"><span /> Casa Nova · Caribe Residence · Palmas/TO</p>
              <h1>Arquitetura contemporânea para viver o Caribe.</h1>
              <p className="caribe-hero-lede">Uma residência nova, elegante e funcional, com 3 suítes plenas, piscina e ambientes pensados para receber bem.</p>
              <div className="caribe-hero-actions">
                <a href="#visita" className="caribe-button caribe-button--gold">Quero conhecer <ArrowUpRight size={18} /></a>
                <a href="#galeria" className="caribe-text-link">Explorar a casa <MoveRight size={18} /></a>
              </div>
            </div>
            <div className="caribe-hero-price"><span>Venda</span><strong>R$ 2.650.000</strong><small>609,76 m² de lote · 243 m² construídos</small></div>
          </div>
          <a className="caribe-scroll-cue" href="#a-casa"><span>Descubra</span><ArrowDown size={16} /></a>
        </section>

        <section className="caribe-intro" id="a-casa">
          <div className="caribe-container caribe-intro-grid">
            <div><p className="caribe-kicker">Casa Nova · QUBUS Arquitetura</p><h2>Um projeto com presença, conforto e espaço para a vida acontecer.</h2></div>
            <div><p>Com 243 m² de área construída em um lote de 609,76 m², esta casa organiza os ambientes sociais e íntimos com fluidez.</p><p>A ocupação de 39,85% preserva área externa para piscina, deck, paisagismo e momentos ao ar livre dentro do Caribe Residence Condomínio Resort.</p></div>
          </div>
          <div className="caribe-container caribe-feature-grid">
            {highlights.map(([Icon, title, text]) => <article key={title}><Icon size={22} /><strong>{title}</strong><p>{text}</p></article>)}
          </div>
        </section>

        <section className="caribe-details">
          <div className="caribe-container caribe-details-grid">
            <div className="caribe-details-photo"><Image src="/brand/casa-nova-caribe/7-Foto-7.jpg" alt="Piscina com cascata e deck da casa" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="caribe-details-copy"><p className="caribe-kicker">Planta e complementares</p><h2>Detalhes que deixam a rotina mais leve.</h2><ul>{houseDetails.map((item) => <li key={item}><span><Check size={14} /></span>{item}</li>)}</ul><a href="#visita" className="caribe-button caribe-button--dark">Quero visitar este imóvel <MoveRight size={18} /></a></div>
          </div>
        </section>

        <section className="caribe-condo" id="condominio">
          <div className="caribe-container caribe-condo-heading">
            <div><p className="caribe-kicker">Além da casa</p><h2>O condomínio amplia a experiência de morar.</h2></div>
            <p>O Caribe Residence & Resort reúne clube, marina, áreas verdes e conexão com o Lago de Palmas, em um endereço pensado para segurança, lazer e qualidade de vida.</p>
          </div>
          <div className="caribe-container caribe-feature-grid">
            {condominiumFacts.map(([value, label]) => <article key={value}><strong>{value}</strong><p>{label}</p></article>)}
          </div>
          <div className="caribe-container caribe-condo-content">
            <div className="caribe-condo-copy">
              <div><strong>Clube e convivência</strong><p>Estrutura de lazer para aproveitar os dias em família e receber amigos.</p></div>
              <div><strong>Marina e lago</strong><p>O empreendimento é conectado ao Lago de Palmas, com marina e espaços de contemplação.</p></div>
              <div><strong>Orla arborizada</strong><p>Lotes planos, paisagismo e contato com a natureza em uma região de expansão de Palmas.</p></div>
            </div>
            <div className="caribe-condo-note"><span>Caribe Residence Condomínio Resort</span><strong>Um endereço para viver ao ar livre.</strong><p>Av. Ilhas Virgens, Quadra 01 · Costa Dourada · Palmas/TO</p><a href={condominiumMapUrl} target="_blank" rel="noreferrer" className="caribe-button caribe-button--gold"><MapPin size={16} /> Abrir no Google Maps</a></div>
          </div>
          <div className="caribe-container">
            <LightboxGallery items={condominiumGallery} variant="condo" />
          </div>
          <div className="caribe-container caribe-condo-source"><small>Informações institucionais: <a href={condominiumSourceUrl} target="_blank" rel="noreferrer">LN Urbanismo — Caribe Residence & Resort</a>.</small></div>
        </section>

        <section className="caribe-gallery-section" id="galeria">
          <div className="caribe-container"><div className="caribe-section-heading"><div><p className="caribe-kicker">Por todos os ângulos</p><h2>Conheça a Casa Nova.</h2></div><p>Toque ou clique em qualquer foto para abrir a visualização ampliada.</p></div><LightboxGallery items={gallery} /></div>
        </section>

        <section className="caribe-gallery-section" aria-labelledby="interiores-title">
          <div className="caribe-container"><div className="caribe-section-heading"><div><p className="caribe-kicker">Por dentro</p><h2 id="interiores-title">Interiores e acabamentos.</h2></div><p>Banheiros, escritório e cozinha identificados corretamente. Toque ou clique para ampliar.</p></div><LightboxGallery items={interiorGallery} /></div>
        </section>

        <section className="caribe-contact" id="visita">
          <div className="caribe-container caribe-contact-grid"><div className="caribe-contact-copy"><p className="caribe-kicker caribe-kicker--gold">Próximo passo</p><h2>Seu novo capítulo pode começar com uma visita.</h2><p>Fale diretamente com Pedro Soares para conhecer a casa, tirar dúvidas e avaliar este projeto no Caribe Residence.</p><div className="caribe-broker"><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares" width={64} height={64} /><div><strong>Pedro Soares</strong><span>Corretor de imóveis · CRECI 5861-TO</span></div></div><p className="caribe-contact-note"><Ruler size={18} /> 609,76 m² de lote · 243 m² construídos · 3 suítes</p></div><VisitForm /></div>
        </section>
      </main>

      <footer className="caribe-footer"><div className="caribe-container"><span>Pedro Soares Imóveis</span><small>Atendimento personalizado em Palmas/TO · CRECI 5861-TO</small></div></footer>
    </div>
  );
}
