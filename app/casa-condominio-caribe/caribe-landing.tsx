"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Bath,
  Check,
  House,
  MessageCircle,
  MoveRight,
  Ruler,
  Sun,
  Waves,
  X
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";

const gallery = [
  ["/brand/caribe-resort/casa-fachada-hero.jpg", "Fachada contemporânea", "hero"],
  ["/brand/caribe-resort/4-Foto-4.jpg", "Piscina e jardim privativo", "wide"],
  ["/brand/caribe-resort/7-Foto-7.jpg", "Deck e área externa", "wide"],
  ["/brand/caribe-resort/2-Foto-2.jpg", "Cozinha planejada", "small"],
  ["/brand/caribe-resort/5-Foto-5.jpg", "Sala home", "small"],
  ["/brand/caribe-resort/8-Foto-8.jpg", "Ambiente iluminado", "small"],
  ["/brand/caribe-resort/6-Foto-6.jpg", "Banheiro de suíte", "small"],
  ["/brand/caribe-resort/9-Foto-9.jpg", "Acabamentos do banheiro", "small"],
  ["/brand/caribe-resort/3-Foto-3.jpg", "Lavabo", "small"]
] as const;

const condominiumGallery = [
  ["/brand/caribe-residence/condominio/1-Foto-1.jpg", "Vista aérea da área de lazer", "large"],
  ["/brand/caribe-residence/condominio/2-Foto-2.jpg", "Paisagem do lago ao entardecer", "small"],
  ["/brand/caribe-residence/condominio/3-Foto-3.jpg", "Piscinas e áreas verdes", "small"],
  ["/brand/caribe-residence/condominio/4-Foto-4.jpg", "Estrutura esportiva e recreativa", "wide"],
  ["/brand/caribe-residence/condominio/5-Foto-5.jpg", "Caminhos e acesso à água", "wide"]
] as const;

const features = [
  [Bath, "4 suítes", "Privacidade e conforto para toda a família."],
  [Waves, "Piscina privativa", "Lazer em casa com banheiro de apoio."],
  [Sun, "Energia solar", "Mais eficiência para a rotina da sua casa."],
  [House, "Condomínio Caribe Resort", "Um endereço exclusivo em Palmas/TO."]
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
          propertySlug: "casa-condominio-caribe-resort",
          landingPageSlug: "casa-condominio-caribe",
          sourcePage: window.location.pathname,
          message: `Interesse na casa do Condomínio Caribe Resort. Quero marcar uma visita. Melhor período: ${data.get("visitPeriod") ?? "A combinar"}.`,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      const whatsappMessage =
        "Olá, Pedro! Gostei da casa no Condomínio Caribe Resort e quero marcar uma visita.";
      window.location.href = buildWhatsAppUrl(whatsappMessage);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível enviar agora.");
    }
  }

  return (
    <form className="caribe-form" onSubmit={onSubmit}>
      <div className="caribe-form-heading">
        <span className="caribe-kicker">Agende sua visita</span>
        <h3>Veja de perto o seu próximo lar.</h3>
        <p>Preencha seus dados. Depois do envio, você será direcionado ao WhatsApp do corretor.</p>
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
export function CaribeLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="caribe-page">
      <LandingPageTracker landingPageSlug="casa-condominio-caribe" />
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
          <Image src="/brand/caribe-resort/casa-fachada-hero.jpg" alt="Fachada da casa no Condomínio Caribe Resort" fill priority sizes="100vw" unoptimized className="caribe-hero-image" />
          <div className="caribe-hero-overlay" />
          <div className="caribe-container caribe-hero-content">
            <div className="caribe-hero-copy">
              <p className="caribe-kicker caribe-kicker--light"><span /> Condomínio Caribe Resort · Palmas/TO</p>
              <h1>Elegância para viver todos os dias.</h1>
              <p className="caribe-hero-lede">Uma casa completa, luminosa e acolhedora, criada para unir privacidade, lazer e bem-estar em um dos melhores residenciais da região.</p>
              <div className="caribe-hero-actions">
                <a href="#visita" className="caribe-button caribe-button--gold">Quero conhecer <ArrowUpRight size={18} /></a>
                <a href="#galeria" className="caribe-text-link">Explorar a casa <MoveRight size={18} /></a>
              </div>
            </div>
            <div className="caribe-hero-price"><span>Venda</span><strong>R$ 2.400.000</strong><small>600 m² de terreno · 240 m² construídos</small></div>
          </div>
          <a className="caribe-scroll-cue" href="#a-casa"><span>Descubra</span><ArrowDown size={16} /></a>
        </section>

        <section className="caribe-intro" id="a-casa">
          <div className="caribe-container caribe-intro-grid">
            <div><p className="caribe-kicker">Um endereço para chamar de seu</p><h2>Um lar completo, com a leveza que a sua rotina merece.</h2></div>
            <div><p>Imagine chegar em casa e encontrar ambientes integrados, acabamentos elegantes e uma área externa feita para aproveitar Palmas com calma.</p><p>Entre a sala de estar, a sala home, a varanda gourmet e a piscina, cada espaço foi pensado para receber bem e viver melhor.</p></div>
          </div>
          <div className="caribe-container caribe-feature-grid">
            {features.map(([Icon, title, text]) => <article key={title}><Icon size={22} /><strong>{title}</strong><p>{text}</p></article>)}
          </div>
        </section>

        <section className="caribe-details">
          <div className="caribe-container caribe-details-grid">
            <div className="caribe-details-photo"><Image src="/brand/caribe-resort/7-Foto-7.jpg" alt="Piscina e deck da casa" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="caribe-details-copy"><p className="caribe-kicker">Arquitetura que acolhe</p><h2>Espaços que acompanham o seu jeito de viver.</h2><ul>{["Sala de estar e sala home", "Varanda gourmet integrada", "Cozinha com planejados sob bancadas", "Área de serviço e depósito", "Garagem espaçosa", "Piscina com banheiro de apoio"].map((item) => <li key={item}><span><Check size={14} /></span>{item}</li>)}</ul><a href="#visita" className="caribe-button caribe-button--dark">Quero visitar este imóvel <MoveRight size={18} /></a></div>
          </div>
        </section>

        <section className="caribe-condo" id="condominio">
          <div className="caribe-container caribe-condo-heading">
            <div><p className="caribe-kicker">Além da casa</p><h2>Um residencial que amplia a experiência de morar.</h2></div>
            <p>O Caribe Residence & Resort combina natureza, água e espaços de convivência para que os momentos de descanso, lazer e bem-estar façam parte da rotina.</p>
          </div>
          <div className="caribe-container caribe-condo-content">
            <div className="caribe-condo-copy">
              <div><strong>Natureza ao redor</strong><p>Paisagismo, áreas verdes e caminhos tranquilos criam uma atmosfera acolhedora para viver com mais contato com o entorno.</p></div>
              <div><strong>Lazer para aproveitar</strong><p>As imagens mostram piscinas, áreas de convivência e uma estrutura esportiva e recreativa pensada para diferentes momentos da família.</p></div>
              <div><strong>Água e contemplação</strong><p>O residencial também valoriza a paisagem da água, com decks e pontos de contemplação para aproveitar o nascer e o pôr do sol.</p></div>
            </div>
            <div className="caribe-condo-note"><span>Caribe Residence & Resort</span><strong>Seu endereço com mais possibilidades.</strong><p>Uma casa especial dentro de um cenário que convida a viver ao ar livre.</p></div>
          </div>
          <div className="caribe-container caribe-condo-gallery">
            {condominiumGallery.map(([src, alt, size]) => <figure className={`caribe-condo-image caribe-condo-image--${size}`} key={src}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" /><figcaption>{alt}</figcaption></figure>)}
          </div>
        </section>

        <section className="caribe-gallery-section" id="galeria">
          <div className="caribe-container"><div className="caribe-section-heading"><div><p className="caribe-kicker">Por todos os ângulos</p><h2>Conheça cada detalhe.</h2></div><p>Uma seleção de imagens para você sentir a atmosfera da casa antes de fazer a visita.</p></div><div className="caribe-gallery">{gallery.map(([src, alt, size]) => <figure className={`caribe-gallery-trigger caribe-gallery-${size}`} key={src}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 33vw" /><figcaption>{alt}</figcaption></figure>)}</div></div>
        </section>

        <section className="caribe-contact" id="visita">
          <div className="caribe-container caribe-contact-grid"><div className="caribe-contact-copy"><p className="caribe-kicker caribe-kicker--gold">Próximo passo</p><h2>Seu novo capítulo pode começar com uma visita.</h2><p>Fale diretamente com Pedro Soares para conhecer a casa, tirar dúvidas e encontrar o melhor horário para você.</p><div className="caribe-broker"><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares" width={64} height={64} /><div><strong>Pedro Soares</strong><span>Corretor de imóveis · CRECI 5861-TO</span></div></div><p className="caribe-contact-note"><Ruler size={18} /> 600 m² de terreno · 240 m² de área construída</p></div><VisitForm /></div>
        </section>
      </main>

      <footer className="caribe-footer"><div className="caribe-container"><span>Pedro Soares Imóveis</span><small>Atendimento personalizado em Palmas/TO · CRECI 5861-TO</small></div></footer>
    </div>
  );
}
