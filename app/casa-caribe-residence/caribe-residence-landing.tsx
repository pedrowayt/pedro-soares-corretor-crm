"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Bath,
  CarFront,
  Check,
  Home,
  MessageCircle,
  MoveRight,
  Sparkles,
  Waves,
  X
} from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

const gallery = [
  ["/brand/caribe-residence/6-Foto-6.jpg", "Fachada contemporânea", "hero"],
  ["/brand/caribe-residence/1-Foto-1.jpg", "Piscina com cascata", "wide"],
  ["/brand/caribe-residence/4-Foto-4.jpg", "Espaço gourmet", "wide"],
  ["/brand/caribe-residence/5-Foto-5.jpg", "Sala com pé-direito duplo", "small"],
  ["/brand/caribe-residence/2-Foto-2.jpg", "Área gourmet integrada", "small"],
  ["/brand/caribe-residence/3-Foto-3.jpg", "Ambiente social", "small"],
  ["/brand/caribe-residence/12-Foto-12.jpg", "Suíte iluminada", "small"],
  ["/brand/caribe-residence/8-Foto-8.jpg", "Quarto confortável", "small"],
  ["/brand/caribe-residence/7-Foto-7.jpg", "Banheiro da suíte", "small"],
  ["/brand/caribe-residence/9-Foto-9.jpg", "Acabamentos do banheiro", "small"],
  ["/brand/caribe-residence/11-Foto-11.jpg", "Banheiro com cuba dupla", "small"],
  ["/brand/caribe-residence/10-Foto-10.jpg", "Piscina ao entardecer", "wide"]
] as const;

const highlights = [
  [Sparkles, "Pé-direito duplo", "Amplitude e imponência desde a chegada."],
  [Bath, "4 suítes plenas", "Duas suítes contam com closet."],
  [Waves, "Piscina com cascata", "Lazer privativo para aproveitar todos os dias."],
  [CarFront, "3 vagas cobertas", "Praticidade e segurança para a família."]
] as const;

const details = [
  "4 suítes plenas, sendo 2 com closet",
  "Espaço gourmet completo para receber com elegância",
  "Lavabo e banheiro social de apoio",
  "2 despensas",
  "Esquadrias em alumínio de alta qualidade",
  "Acabamentos com pedra portuguesa e iluminação em LED",
  "Poço semi artesiano"
];

const condominiumGallery = [
  ["/brand/caribe-residence/condominio/1-Foto-1.jpg", "Vista aérea da área de lazer", "large"],
  ["/brand/caribe-residence/condominio/2-Foto-2.jpg", "Paisagem do lago ao entardecer", "small"],
  ["/brand/caribe-residence/condominio/3-Foto-3.jpg", "Piscinas e áreas verdes", "small"],
  ["/brand/caribe-residence/condominio/4-Foto-4.jpg", "Estrutura esportiva e recreativa", "wide"],
  ["/brand/caribe-residence/condominio/5-Foto-5.jpg", "Caminhos e acesso à água", "wide"]
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
          propertySlug: "casa-caribe-residence-resort",
          landingPageSlug: "casa-caribe-residence",
          sourcePage: window.location.pathname,
          message: `Interesse na casa do Caribe Residence & Resort. Gostei da casa e quero marcar uma visita. Melhor período: ${data.get("visitPeriod") ?? "A combinar"}.`,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      window.location.href = buildWhatsAppUrl(
        "Olá, Pedro! Gostei da casa no Caribe Residence & Resort e quero marcar uma visita."
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
        <h3>Conheça uma casa feita para impressionar.</h3>
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
      {status === "error" ? (
        <p className="residence-form-status" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}

export function CaribeResidenceLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="residence-page">
      <LandingPageTracker landingPageSlug="casa-caribe-residence" />
      <header className="residence-header">
        <div className="residence-container residence-nav">
          <a className="residence-wordmark" href="#inicio" onClick={closeMenu}>
            <span>Pedro Soares</span>
            <small>Imóveis selecionados</small>
          </a>
          <nav className={menuOpen ? "residence-nav-links is-open" : "residence-nav-links"} aria-label="Navegação da casa">
            <a href="#a-casa" onClick={closeMenu}>A casa</a>
            <a href="#condominio" onClick={closeMenu}>O condomínio</a>
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
          <Image src="/brand/caribe-resort/1-Foto-1.jpg" alt="Fachada da casa no Caribe Residence & Resort" fill priority sizes="100vw" className="residence-hero-image" />
          <div className="residence-hero-overlay" />
          <div className="residence-container residence-hero-content">
            <div className="residence-hero-copy">
              <p className="residence-kicker residence-kicker--light"><span /> Caribe Residence & Resort · Palmas/TO</p>
              <h1>Presença marcante. Conforto em cada detalhe.</h1>
              <p className="residence-hero-lede">Uma casa contemporânea para quem valoriza arquitetura, acabamento e momentos especiais ao lado de quem ama.</p>
              <div className="residence-hero-actions">
                <a href="#visita" className="residence-button residence-button--gold">Agendar visita <ArrowUpRight size={18} /></a>
                <a href="#galeria" className="residence-text-link">Ver galeria <MoveRight size={18} /></a>
              </div>
            </div>
            <div className="residence-hero-price"><span>Venda</span><strong>R$ 2.600.000</strong><small>Caribe Residence & Resort · Palmas/TO</small></div>
          </div>
          <a className="residence-scroll-cue" href="#a-casa"><span>Descubra</span><ArrowDown size={16} /></a>
        </section>

        <section className="residence-intro" id="a-casa">
          <div className="residence-container residence-intro-grid">
            <div><p className="residence-kicker">Um projeto para viver bem</p><h2>Elegância, amplitude e lazer em um só endereço.</h2></div>
            <div><p>O pé-direito duplo valoriza a entrada e amplia a experiência dos ambientes. A integração entre sala, cozinha e espaço gourmet convida a receber com naturalidade.</p><p>Na área externa, a piscina com cascata transforma os dias comuns em momentos de descanso e celebração.</p></div>
          </div>
          <div className="residence-container residence-highlight-grid">
            {highlights.map(([Icon, title, text]) => <article key={title}><Icon size={22} /><strong>{title}</strong><p>{text}</p></article>)}
          </div>
        </section>

        <section className="residence-details">
          <div className="residence-container residence-details-grid">
            <div className="residence-details-photo"><Image src="/brand/caribe-residence/1-Foto-1.jpg" alt="Piscina com cascata da casa" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="residence-details-copy"><p className="residence-kicker">Acabamento e funcionalidade</p><h2>Uma casa pensada para receber e permanecer.</h2><ul>{details.map((item) => <li key={item}><span><Check size={14} /></span>{item}</li>)}</ul><a href="#visita" className="residence-button residence-button--dark">Quero visitar este imóvel <MoveRight size={18} /></a></div>
          </div>
        </section>

        <section className="residence-condo" id="condominio">
          <div className="residence-container residence-condo-heading">
            <div><p className="residence-kicker">Além da casa</p><h2>Um residencial que amplia a experiência de morar.</h2></div>
            <p>O Caribe Residence & Resort combina natureza, água e espaços de convivência para que os momentos de descanso, lazer e bem-estar façam parte da rotina.</p>
          </div>
          <div className="residence-container residence-condo-content">
            <div className="residence-condo-copy">
              <div><strong>Natureza ao redor</strong><p>Paisagismo, áreas verdes e caminhos tranquilos criam uma atmosfera acolhedora para viver com mais contato com o entorno.</p></div>
              <div><strong>Lazer para aproveitar</strong><p>As imagens mostram piscinas, áreas de convivência e uma estrutura esportiva e recreativa pensada para diferentes momentos da família.</p></div>
              <div><strong>Água e contemplação</strong><p>O residencial também valoriza a paisagem da água, com decks e pontos de contemplação para aproveitar o nascer e o pôr do sol.</p></div>
            </div>
            <div className="residence-condo-note"><span>Caribe Residence & Resort</span><strong>Seu endereço com mais possibilidades.</strong><p>Uma casa especial dentro de um cenário que convida a viver ao ar livre.</p></div>
          </div>
          <div className="residence-container residence-condo-gallery">
            {condominiumGallery.map(([src, alt, size]) => <figure className={`residence-condo-image residence-condo-image--${size}`} key={src}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" /><figcaption>{alt}</figcaption></figure>)}
          </div>
        </section>

        <section className="residence-gallery-section" id="galeria">
          <div className="residence-container"><div className="residence-section-heading"><div><p className="residence-kicker">Por todos os ângulos</p><h2>Veja a casa de perto.</h2></div><p>Ambientes claros, linhas contemporâneas e detalhes que fazem a diferença no dia a dia.</p></div><div className="residence-gallery">{gallery.map(([src, alt, size]) => <figure className={`residence-gallery-${size}`} key={src}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 33vw" /><figcaption>{alt}</figcaption></figure>)}</div></div>
        </section>

        <section className="residence-contact" id="visita">
          <div className="residence-container residence-contact-grid"><div className="residence-contact-copy"><p className="residence-kicker residence-kicker--gold">Próximo passo</p><h2>Agende uma visita e sinta a experiência.</h2><p>Fale com Pedro Soares para conhecer todos os detalhes, tirar dúvidas e encontrar o melhor horário para você.</p><div className="residence-broker"><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares" width={64} height={64} /><div><strong>Pedro Soares</strong><span>Corretor de imóveis · CRECI 5861-TO</span></div></div><p className="residence-contact-note"><Home size={18} /> Caribe Residence & Resort · Palmas/TO</p></div><VisitForm /></div>
        </section>
      </main>

      <footer className="residence-footer"><div className="residence-container"><span>Pedro Soares Imóveis</span><small>Atendimento personalizado em Palmas/TO · CRECI 5861-TO</small></div></footer>
    </div>
  );
}
