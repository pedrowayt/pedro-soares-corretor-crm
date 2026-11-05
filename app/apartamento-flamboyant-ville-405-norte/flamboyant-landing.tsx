"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Bath,
  Check,
  CircleParking,
  Fuel,
  HeartPulse,
  Home,
  MapPin,
  MessageCircle,
  Pill,
  Ruler,
  ShieldCheck,
  Sparkles,
  ShoppingBasket,
  Store,
  Waves,
  X
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

const propertySlug = "apartamento-flamboyant-ville-405-norte";
const landingPageSlug = propertySlug;
const heroImage = "/brand/apartamento-flamboyant-ville-405-norte/hero-sala.jpg";

const gallery = [
  ["/brand/apartamento-flamboyant-ville-405-norte/hero-sala.jpg", "Sala com painel planejado, iluminação e ar-condicionado", "hero"],
  ["/brand/apartamento-flamboyant-ville-405-norte/1-Foto-1.jpg", "Cozinha com armários planejados, cooktop e micro-ondas", "wide"],
  ["/brand/apartamento-flamboyant-ville-405-norte/10-Foto-10.jpg", "Piscinas do Residencial Flamboyant Ville", "wide"],
  ["/brand/apartamento-flamboyant-ville-405-norte/7-Foto-7.jpg", "Sala integrada à varanda", "small"],
  ["/brand/apartamento-flamboyant-ville-405-norte/2-Foto-2.jpg", "Cozinha planejada com área de serviço ao fundo", "small"],
  ["/brand/apartamento-flamboyant-ville-405-norte/3-Foto-3.jpg", "Bancada e marcenaria da cozinha", "small"],
  ["/brand/apartamento-flamboyant-ville-405-norte/4-Foto-4.jpg", "Varanda com tela de proteção e boa iluminação", "small"],
  ["/brand/apartamento-flamboyant-ville-405-norte/5-Foto-5.jpg", "Quarto climatizado com janela ampla", "small"],
  ["/brand/apartamento-flamboyant-ville-405-norte/6-Foto-6.jpg", "Segundo quarto com janela e ar-condicionado", "small"],
  ["/brand/apartamento-flamboyant-ville-405-norte/9-Foto-9.jpg", "Espaço com churrasqueira junto à piscina", "small"],
  ["/brand/apartamento-flamboyant-ville-405-norte/11-area-externa-entrada.jpg", "Acesso e entrada do Residencial Flamboyant Ville", "wide"],
  ["/brand/apartamento-flamboyant-ville-405-norte/12-area-externa-quadra.jpg", "Quadra esportiva do condomínio", "wide"],
  ["/brand/apartamento-flamboyant-ville-405-norte/13-area-externa-churrasqueira.jpg", "Área de churrasqueira e piscina", "small"],
  ["/brand/apartamento-flamboyant-ville-405-norte/14-area-externa-piscina.jpg", "Piscina e deck da área de lazer", "small"],
  ["/brand/apartamento-flamboyant-ville-405-norte/15-area-externa-acesso.jpg", "Circulação e acesso à área comum", "small"],
  ["/brand/apartamento-flamboyant-ville-405-norte/16-area-externa-piscina-deck.jpg", "Piscina, deck e espreguiçadeiras", "small"],
  ["/brand/apartamento-flamboyant-ville-405-norte/17-area-externa-jardins.jpg", "Jardins e caminhos internos do condomínio", "small"]
] as const;

const highlights = [
  [Ruler, "58 m² privativos", "Planta funcional e bem distribuída."],
  [Home, "2 quartos", "Um deles climatizado."],
  [Sparkles, "Armários planejados", "Cozinha e sala com marcenaria."],
  [CircleParking, "1 vaga", "Garagem para o dia a dia."],
  [Waves, "Lazer no condomínio", "Piscina, churrasqueira e salão de festas."],
  [ShieldCheck, "Portaria 24h", "Mais praticidade e segurança." ]
] as const;

const routePoints = [
  {
    name: "Capim Dourado Shopping",
    detail: "Compras, alimentação e serviços",
    href: "https://www.google.com/maps/dir/?api=1&origin=Residencial+Flamboyant+Ville+405+Norte+Palmas+TO&destination=Capim+Dourado+Shopping+Palmas+TO"
  },
  {
    name: "UFT — Campus Palmas",
    detail: "Universidade Federal do Tocantins",
    href: "https://www.google.com/maps/dir/?api=1&origin=Residencial+Flamboyant+Ville+405+Norte+Palmas+TO&destination=UFT+Campus+Palmas+TO"
  },
  {
    name: "Orla da Graciosa",
    detail: "Lago, caminhada e lazer ao ar livre",
    href: "https://www.google.com/maps/dir/?api=1&origin=Residencial+Flamboyant+Ville+405+Norte+Palmas+TO&destination=Orla+da+Graciosa+Palmas+TO"
  },
  {
    name: "Praça dos Girassóis",
    detail: "Centro cívico e cartão-postal de Palmas",
    href: "https://www.google.com/maps/dir/?api=1&origin=Residencial+Flamboyant+Ville+405+Norte+Palmas+TO&destination=Pra%C3%A7a+dos+Girass%C3%B3is+Palmas+TO"
  }
] as const;

const nearbyPoints = [
  [Store, "Mercados e supermercados", "Buscar opções próximas à 405 Norte", "mercados+pr%C3%B3ximos+%C3%A0+405+Norte+Palmas+TO"],
  [Pill, "Farmácias", "Encontrar farmácias no entorno", "farm%C3%A1cias+pr%C3%B3ximas+%C3%A0+405+Norte+Palmas+TO"],
  [HeartPulse, "Postos de saúde", "Unidades de saúde da região", "posto+de+sa%C3%BAde+pr%C3%B3ximo+%C3%A0+405+Norte+Palmas+TO"],
  [Fuel, "Postos de combustível", "Serviços para a rotina", "posto+de+combust%C3%ADvel+pr%C3%B3ximo+%C3%A0+405+Norte+Palmas+TO"],
  [ShoppingBasket, "Feiras", "Feiras e comércio local", "feiras+pr%C3%B3ximas+%C3%A0+405+Norte+Palmas+TO"]
] as const;

function InterestForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const whatsappUrl = buildWhatsAppUrl("Olá, Pedro! Tenho interesse no apartamento do Residencial Flamboyant Ville, na 405 Norte.");

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
          sourcePage: "/apartamento-flamboyant-ville-405-norte",
          landingPageSlug,
          propertySlug,
          message: `Interesse no apartamento Flamboyant Ville. Modalidade: ${data.get("purpose") ?? "A combinar"}. Melhor período: ${data.get("visitPeriod") ?? "A combinar"}.`,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível enviar agora.");
    }
  }

  return (
    <form className="flamboyant-form" onSubmit={onSubmit}>
      <div className="flamboyant-form-heading">
        <span className="flamboyant-kicker">Fale com Pedro</span>
        <h3>Quer conhecer este apartamento?</h3>
        <p>Envie seus dados para receber informações e combinar uma visita.</p>
      </div>
      <div className="flamboyant-form-grid">
        <label>Nome<input name="name" placeholder="Seu nome" required minLength={3} /></label>
        <label>WhatsApp<input name="whatsapp" placeholder="(63) 99999-9999" required minLength={10} inputMode="tel" /></label>
        <label>E-mail <span>(opcional)</span><input name="email" type="email" placeholder="voce@email.com" /></label>
        <label>Interesse<select name="purpose" defaultValue="Compra ou locação"><option>Compra</option><option>Locação</option><option>Compra ou locação</option></select></label>
        <label>Melhor período<select name="visitPeriod" defaultValue="A combinar"><option>Durante a manhã</option><option>Durante a tarde</option><option>A combinar</option></select></label>
      </div>
      <label className="flamboyant-consent"><input name="lgpdConsent" type="checkbox" required /><span>Autorizo o contato sobre este imóvel e concordo com a política de privacidade.</span></label>
      <button className="flamboyant-button flamboyant-button--coral" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando..." : status === "success" ? "Interesse recebido" : "Quero agendar uma visita"}<MessageCircle size={18} />
      </button>
      {status === "success" ? <p className="flamboyant-form-status flamboyant-form-status--success" role="status">Cadastro realizado. Se preferir, <a href={whatsappUrl} target="_blank" rel="noreferrer">fale pelo WhatsApp</a>.</p> : null}
      {status === "error" ? <p className="flamboyant-form-status flamboyant-form-status--error" role="alert">{errorMessage}</p> : null}
    </form>
  );
}

export function FlamboyantLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const whatsappUrl = buildWhatsAppUrl("Olá, Pedro! Gostaria de saber mais sobre o apartamento do Residencial Flamboyant Ville.");

  return (
    <div className="flamboyant-page">
      <header className="flamboyant-header">
        <div className="flamboyant-container flamboyant-nav">
          <a className="flamboyant-wordmark" href="#inicio" onClick={closeMenu}><span>Pedro Soares</span><small>Imóveis selecionados</small></a>
          <nav className={menuOpen ? "flamboyant-nav-links is-open" : "flamboyant-nav-links"} aria-label="Navegação do imóvel">
            <a href="#apartamento" onClick={closeMenu}>Apartamento</a><a href="#condominio" onClick={closeMenu}>Condomínio</a><a href="#galeria" onClick={closeMenu}>Fotos</a><a href="#localizacao" onClick={closeMenu}>Localização</a><a className="flamboyant-nav-cta" href="#atendimento" onClick={closeMenu}>Agendar visita</a>
          </nav>
          <button className="flamboyant-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>{menuOpen ? <X /> : <ArrowDown />}</button>
        </div>
      </header>

      <main>
        <section className="flamboyant-hero" id="inicio">
          <Image src={heroImage} alt="Sala com painel planejado no Residencial Flamboyant Ville" fill priority sizes="100vw" className="flamboyant-hero-image" />
          <div className="flamboyant-hero-overlay" />
          <div className="flamboyant-container flamboyant-hero-content">
            <div className="flamboyant-hero-copy"><p className="flamboyant-kicker flamboyant-kicker--light"><span /> Residencial Flamboyant Ville · Palmas/TO</p><h1>Seu próximo endereço na 405 Norte.</h1><p className="flamboyant-hero-lede">Apartamento com 2 quartos, ambientes planejados e lazer para viver com praticidade em Palmas.</p><div className="flamboyant-hero-actions"><a href="#atendimento" className="flamboyant-button flamboyant-button--coral">Quero conhecer <ArrowUpRight size={18} /></a><a href="#galeria" className="flamboyant-text-link">Ver fotos <ArrowDown size={17} /></a></div></div>
            <div className="flamboyant-hero-meta"><span>Venda ou locação</span><strong>R$ 300.000</strong><small>Locação: R$ 2.300/mês · 58 m² privativos</small></div>
          </div>
          <a className="flamboyant-scroll-cue" href="#apartamento"><span>Descubra</span><ArrowDown size={16} /></a>
        </section>

        <section className="flamboyant-gallery-section" id="galeria"><div className="flamboyant-container"><div className="flamboyant-section-heading"><div><p className="flamboyant-kicker flamboyant-kicker--light">Fotos reais do imóvel e do condomínio</p><h2>Veja cada ambiente e a área externa.</h2></div><p>Clique em qualquer imagem para abrir o arquivo original em uma nova aba.</p></div><div className="flamboyant-gallery">{gallery.map(([src, alt, size]) => <a className={`flamboyant-gallery-${size}`} href={src} target="_blank" rel="noreferrer" key={src}><figure><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 33vw" /><figcaption>{alt}</figcaption></figure></a>)}</div></div></section>

        <section className="flamboyant-intro" id="apartamento"><div className="flamboyant-container flamboyant-intro-grid"><div><p className="flamboyant-kicker">Descrição do imóvel</p><h2>Conforto, praticidade e uma localização que facilita a rotina.</h2></div><div><p>No Residencial Flamboyant Ville, este apartamento de 58 m² reúne sala espaçosa, varanda integrada, cozinha planejada e dois quartos bem iluminados.</p><p>O imóvel fica no 4º andar e não possui elevador no condomínio. A unidade tem 1 vaga de garagem.</p></div></div><div className="flamboyant-container flamboyant-highlight-grid">{highlights.map(([Icon, title, text]) => <article key={title}><Icon size={22} /><strong>{title}</strong><p>{text}</p></article>)}</div></section>

        <section className="flamboyant-details"><div className="flamboyant-container flamboyant-details-grid"><div className="flamboyant-details-photo"><Image src="/brand/apartamento-flamboyant-ville-405-norte/1-Foto-1.jpg" alt="Cozinha planejada do apartamento" fill sizes="(max-width: 900px) 100vw, 50vw" /></div><div className="flamboyant-details-copy"><p className="flamboyant-kicker">Detalhes do imóvel</p><h2>Uma planta funcional, pronta para receber você.</h2><ul>{["2 quartos amplos, sendo 1 climatizado", "Sala com painel planejado e ar-condicionado", "Varanda aconchegante integrada à sala", "Banheiro social com acabamento moderno", "Cozinha com armários, cooktop e micro-ondas", "Área de serviço e piso em porcelanato", "4º andar, com boa ventilação e privacidade", "Condomínio sem elevador"].map((item) => <li key={item}><span><Check size={14} /></span>{item}</li>)}</ul></div></div></section>

        <section className="flamboyant-condominium" id="condominio"><div className="flamboyant-container flamboyant-condominium-grid"><div><p className="flamboyant-kicker">Estrutura do condomínio</p><h2>Mais possibilidades para aproveitar o dia.</h2><p>O Residencial Flamboyant Ville conta com estrutura de lazer e comodidades para a família, em uma localização prática na 405 Norte.</p><div className="flamboyant-amenities"><span><Waves size={18} /> Piscina</span><span><Sparkles size={18} /> Salão de festas</span><span><Home size={18} /> Playground</span><span><ShieldCheck size={18} /> Portaria 24 horas</span><span><CircleParking size={18} /> Churrasqueira</span><span><ArrowUpRight size={18} /> Quadra esportiva</span></div></div><a className="flamboyant-condo-photo" href="/brand/apartamento-flamboyant-ville-405-norte/10-Foto-10.jpg" target="_blank" rel="noreferrer"><Image src="/brand/apartamento-flamboyant-ville-405-norte/10-Foto-10.jpg" alt="Piscinas do Residencial Flamboyant Ville" fill sizes="(max-width: 900px) 100vw, 46vw" /><span>Abrir foto da área de lazer <ArrowUpRight size={16} /></span></a></div></section>

        <section className="flamboyant-location" id="localizacao"><div className="flamboyant-container"><div className="flamboyant-location-grid"><div className="flamboyant-location-map"><iframe title="Mapa do Residencial Flamboyant Ville na 405 Norte em Palmas" src="https://www.google.com/maps?q=Residencial+Flamboyant+Ville+405+Norte+Palmas+TO&output=embed" loading="lazy" /><a className="flamboyant-map-link" href="https://www.google.com/maps/search/?api=1&query=Residencial+Flamboyant+Ville+405+Norte+Palmas+TO" target="_blank" rel="noreferrer">Abrir o condomínio no Google Maps <ArrowUpRight size={16} /></a></div><div className="flamboyant-location-copy"><p className="flamboyant-kicker">Localização e entorno</p><h2>405 Norte, com serviços e pontos de referência ao redor.</h2><p>O Residencial Flamboyant Ville fica na 405 Norte, próximo ao Supermercado Quartetto e com acesso prático a comércio, serviços, universidades e lazer em Palmas.</p><p className="flamboyant-location-note"><MapPin size={17} /> As rotas abaixo são abertas no Google Maps para você conferir o caminho atualizado.</p></div></div><div className="flamboyant-location-routes"><div className="flamboyant-location-heading"><div><p className="flamboyant-kicker">Mapas e rotas</p><h3>Principais pontos de Palmas</h3></div><span>Saindo do Residencial Flamboyant Ville</span></div><div className="flamboyant-route-grid">{routePoints.map((point) => <a className="flamboyant-route-card" href={point.href} target="_blank" rel="noreferrer" key={point.name}><MapPin size={19} /><span><strong>{point.name}</strong><small>{point.detail}</small></span><ArrowUpRight size={16} /></a>)}</div></div><div className="flamboyant-nearby"><div className="flamboyant-location-heading"><div><p className="flamboyant-kicker">Vida prática</p><h3>O que você encontra no entorno</h3></div><span>Buscas locais atualizadas pelo mapa</span></div><div className="flamboyant-nearby-grid">{nearbyPoints.map(([Icon, name, detail, query]) => <a className="flamboyant-nearby-card" href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer" key={name}><Icon size={20} /><span><strong>{name}</strong><small>{detail}</small></span><ArrowUpRight size={16} /></a>)}</div></div><p className="flamboyant-location-disclaimer">A disponibilidade, distância e horário de funcionamento dos serviços podem mudar. Confirme a opção escolhida no Google Maps antes da visita ou da mudança.</p></div></section>

        <section className="flamboyant-contact" id="atendimento"><div className="flamboyant-container flamboyant-contact-grid"><div className="flamboyant-contact-copy"><p className="flamboyant-kicker">Próximo passo</p><h2>Escolha: comprar ou alugar.</h2><p>Converse com Pedro Soares para tirar dúvidas, confirmar condições e agendar uma visita ao apartamento.</p><div className="flamboyant-price-box"><div><span>Venda</span><strong>R$ 300.000</strong></div><div><span>Locação</span><strong>R$ 2.300/mês</strong></div></div><a className="flamboyant-button flamboyant-button--dark" href={whatsappUrl} target="_blank" rel="noreferrer">Falar pelo WhatsApp <MessageCircle size={18} /></a></div><InterestForm /></div></section>
      </main>
      <footer className="flamboyant-footer"><div className="flamboyant-container"><span>Pedro Soares Imóveis</span><small>Atendimento em Palmas/TO · CRECI 5861-TO</small></div></footer>
    </div>
  );
}
