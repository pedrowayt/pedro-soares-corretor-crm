"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Bath,
  Check,
  House,
  Leaf,
  MessageCircle,
  Ruler,
  ShieldCheck,
  Sun,
  Waves,
  X
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

const propertySlug = "casa-nova-condominio-polineisia-palmas";

const gallery = [
  ["/brand/casa-polineisia/1-Foto-1.jpg", "Fachada contemporânea da residência", "hero"],
  ["/brand/casa-polineisia/3-Foto-3.jpg", "Piscina privativa com deck de madeira", "wide"],
  ["/brand/casa-polineisia/10-Foto-10.jpg", "Piscina com hidromassagem e integração à casa", "wide"],
  ["/brand/casa-polineisia/7-Foto-7.jpg", "Fachada iluminada ao entardecer", "small"],
  ["/brand/casa-polineisia/2-Foto-2.jpg", "Garagem coberta com forro amadeirado", "small"],
  ["/brand/casa-polineisia/5-Foto-5.jpg", "Área externa da piscina", "small"],
  ["/brand/casa-polineisia/6-Foto-6.jpg", "Garagem e acesso lateral", "small"],
  ["/brand/casa-polineisia/9-Foto-9.jpg", "Detalhes da arquitetura e paisagismo", "small"],
  ["/brand/casa-polineisia/8-Foto-8.jpg", "Iluminação da área coberta", "small"],
  ["/brand/casa-polineisia/4-Foto-4.jpg", "Piscina ao pôr do sol", "small"],
  ["/brand/casa-polineisia/11-Foto-11.jpg", "Sala integrada com iluminação linear", "small"],
  ["/brand/casa-polineisia/12-Foto-12.jpg", "Esquadria ampla com vista para o jardim", "small"],
  ["/brand/casa-polineisia/13-Foto-13.jpg", "Cozinha com bancada iluminada", "small"],
  ["/brand/casa-polineisia/14-Foto-14.jpg", "Área de lazer vista ao entardecer", "small"]
] as const;

const condominiumGallery = [
  {
    src: "/brand/casa-polineisia/condominio-piscina.jpg",
    alt: "Piscina e deck da área comum do Residencial Polinésia",
    label: "Clube e piscinas",
    source: "https://to.olx.com.br/tocantins/terrenos/vende-se-no-condominio-polinesia-com-acesso-ao-lago-de-palmas-to-1494636853"
  },
  {
    src: "/brand/casa-polineisia/condominio-areas-verdes.jpg",
    alt: "Áreas verdes e caminhos arborizados do Residencial Polinésia",
    label: "Áreas verdes",
    source: "https://to.olx.com.br/tocantins/terrenos/lote-em-condominio-no-bairro-polinesia-residence-e-resort-palmas-1408326068"
  },
  {
    src: "/brand/casa-polineisia/condominio-placa.jpg",
    alt: "Identificação do Residencial Polinésia em área ajardinada",
    label: "Identidade do residencial",
    source: "https://to.olx.com.br/tocantins/terrenos/vende-se-no-condominio-polinesia-com-acesso-ao-lago-de-palmas-to-1494636853"
  },
  {
    src: "/brand/casa-polineisia/condominio-portaria.jpg",
    alt: "Portaria do Residencial Polinésia",
    label: "Portaria e acesso",
    source: "https://to.olx.com.br/tocantins/terrenos/lote-em-condominio-no-bairro-polinesia-residence-e-resort-palmas-1408326068"
  },
  {
    src: "/brand/casa-polineisia/condominio-pier.jpg",
    alt: "Píer e acesso ao Lago de Palmas",
    label: "Orla e lazer náutico",
    source: "https://to.olx.com.br/tocantins/terrenos/lote-em-condominio-no-bairro-polinesia-residence-e-resort-palmas-1408326068"
  }
] as const;

const locationPoints = [
  ["Capim Dourado Shopping", "≈ 7 km", "https://www.google.com/maps/dir/?api=1&origin=Condominio+Polinesia+Palmas+TO&destination=Capim+Dourado+Shopping+Palmas+TO"],
  ["Palmas Shopping", "≈ 10 km", "https://www.google.com/maps/dir/?api=1&origin=Condominio+Polinesia+Palmas+TO&destination=Palmas+Shopping+Palmas+TO"],
  ["Av. Teotônio Segurado", "≈ 5 km", "https://www.google.com/maps/dir/?api=1&origin=Condominio+Polinesia+Palmas+TO&destination=Avenida+Teotonio+Segurado+Palmas+TO"],
  ["Av. JK / Praça dos Girassóis", "≈ 10 km", "https://www.google.com/maps/dir/?api=1&origin=Condominio+Polinesia+Palmas+TO&destination=Praca+dos+Girassois+Palmas+TO"],
  ["UFT — Campus Palmas", "≈ 9 km", "https://www.google.com/maps/dir/?api=1&origin=Condominio+Polinesia+Palmas+TO&destination=UFT+Campus+Palmas+TO"],
  ["Aeroporto de Palmas", "≈ 24 km", "https://www.google.com/maps/dir/?api=1&origin=Condominio+Polinesia+Palmas+TO&destination=Aeroporto+Brigadeiro+Lysias+Rodrigues+Palmas+TO"]
] as const;

const features = [
  [Ruler, "972 m² de terreno", "Amplo espaço para viver com privacidade."],
  [House, "290,76 m² construídos", "Projeto contemporâneo e ambientes generosos."],
  [Bath, "4 suítes plenas", "Uma suíte master com closet para mais conforto."],
  [Waves, "Piscina com hidro", "Lazer privativo integrado ao quintal."],
  [Sun, "Energia solar", "Eficiência e economia para a rotina."],
  [ShieldCheck, "Condomínio Polinésia", "Segurança e tranquilidade em Palmas/TO."]
] as const;

function VisitForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const whatsappUrl = buildWhatsAppUrl(
    "Olá, Pedro! Tenho interesse na casa nova do Condomínio Polinésia e quero agendar uma visita."
  );

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
          message: `Interesse na casa nova do Condomínio Polinésia. Melhor período para visita: ${data.get("visitPeriod") ?? "A combinar"}.`,
          propertySlug,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível enviar agora.");
    }
  }

  return (
    <form className="polinesia-form" onSubmit={onSubmit}>
      <div className="polinesia-form-heading">
        <span className="polinesia-kicker">Agende sua visita</span>
        <h3>Conheça a casa que combina design e bem-estar.</h3>
        <p>Deixe seus dados. Pedro Soares retorna para combinar o melhor horário.</p>
      </div>
      <div className="polinesia-form-grid">
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
      <label className="polinesia-consent">
        <input name="lgpdConsent" type="checkbox" required />
        <span>Autorizo o contato de Pedro Soares sobre este imóvel e concordo com a política de privacidade.</span>
      </label>
      <button className="polinesia-button polinesia-button--terracotta" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando..." : status === "success" ? "Interesse recebido" : "Quero agendar uma visita"}
        <MessageCircle size={18} />
      </button>
      {status === "success" ? (
        <p className="polinesia-form-status polinesia-form-status--success" role="status">
          Cadastro realizado. Se preferir, <a href={whatsappUrl} target="_blank" rel="noreferrer">fale agora pelo WhatsApp</a>.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="polinesia-form-status polinesia-form-status--error" role="alert">{errorMessage}</p>
      ) : null}
    </form>
  );
}

export function PolinesiaLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="polinesia-page">
      <header className="polinesia-header">
        <div className="polinesia-container polinesia-nav">
          <a className="polinesia-wordmark" href="#inicio" onClick={closeMenu}>
            <span>Pedro Soares</span>
            <small>Imóveis selecionados</small>
          </a>
          <nav className={menuOpen ? "polinesia-nav-links is-open" : "polinesia-nav-links"} aria-label="Navegação da casa">
            <a href="#a-casa" onClick={closeMenu}>A casa</a>
            <a href="#condominio" onClick={closeMenu}>O condomínio</a>
            <a href="#galeria" onClick={closeMenu}>Galeria</a>
            <a href="#localizacao" onClick={closeMenu}>Localização</a>
            <a href="#visita" onClick={closeMenu} className="polinesia-nav-cta">Agendar visita</a>
          </nav>
          <button className="polinesia-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
            {menuOpen ? <X /> : <ArrowDown />}
          </button>
        </div>
      </header>

      <main>
        <section className="polinesia-hero" id="inicio">
          <Image src="/brand/casa-polineisia/1-Foto-1.jpg" alt="Fachada da casa nova no Condomínio Polinésia" fill priority sizes="100vw" className="polinesia-hero-image" />
          <div className="polinesia-hero-overlay" />
          <div className="polinesia-container polinesia-hero-content">
            <div className="polinesia-hero-copy">
              <p className="polinesia-kicker polinesia-kicker--light"><span /> Condomínio Polinésia · Palmas/TO</p>
              <h1>Arquitetura para viver o extraordinário.</h1>
              <p className="polinesia-hero-lede">Uma casa nova de alto padrão, com linhas contemporâneas, ambientes amplos e lazer privativo para viver Palmas com mais conforto.</p>
              <div className="polinesia-hero-actions">
                <a href="#visita" className="polinesia-button polinesia-button--terracotta">Quero conhecer <ArrowUpRight size={18} /></a>
                <a href="#galeria" className="polinesia-text-link">Explorar a casa <ArrowDown size={17} /></a>
              </div>
            </div>
            <div className="polinesia-hero-meta"><span>Casa nova</span><strong>R$ 3.490.000</strong><small>972 m² de terreno · 290,76 m² construídos</small></div>
          </div>
          <a className="polinesia-scroll-cue" href="#a-casa"><span>Descubra</span><ArrowDown size={16} /></a>
        </section>

        <section className="polinesia-intro" id="a-casa">
          <div className="polinesia-container polinesia-intro-grid">
            <div><p className="polinesia-kicker">Uma casa para chamar de sua</p><h2>Imponência na chegada. Leveza em cada ambiente.</h2></div>
            <div><p>No Condomínio Polinésia, esta residência combina a força da arquitetura contemporânea com a intimidade de um quintal feito para os melhores momentos da família.</p><p>Da sala com pé-direito duplo à piscina com hidromassagem, cada escolha valoriza a luz natural, a integração e a qualidade de vida.</p></div>
          </div>
          <div className="polinesia-container polinesia-feature-grid">
            {features.map(([Icon, title, text]) => <article key={title}><Icon size={22} /><strong>{title}</strong><p>{text}</p></article>)}
          </div>
        </section>

        <section className="polinesia-condominium" id="condominio">
          <div className="polinesia-container">
            <div className="polinesia-section-heading polinesia-section-heading--ink">
              <div><p className="polinesia-kicker">O condomínio</p><h2>Polinésia Residence &amp; Resort.</h2></div>
              <p>Um endereço residencial na Região Dourada de Palmas, com natureza, acesso ao Lago de Palmas e estrutura para transformar o cotidiano em experiência.</p>
            </div>
            <div className="polinesia-condominium-intro">
              <div className="polinesia-condominium-copy">
                <p>A Prefeitura de Palmas identifica o Residencial Polinésia no Plano Diretor Norte, com lotes a partir de 450 m² e vocação para moradia de alto padrão. Entre os diferenciais públicos associados ao empreendimento estão clube, garagem náutica, praia particular e segurança 24 horas.</p>
                <p>Referências imobiliárias públicas também descrevem áreas de lazer com piscinas, sauna, academia, quadras esportivas, campo, espaço kids, trilhas e áreas verdes. A disponibilidade e as regras de uso devem ser confirmadas com a administração do condomínio.</p>
                <div className="polinesia-condominium-tags"><span>Clube residencial</span><span>Lago de Palmas</span><span>Marina e píer</span><span>Segurança 24h</span></div>
                <a className="polinesia-text-link polinesia-text-link--ink" href="https://www.palmas.to.gov.br/wp-content/uploads/2024/01/Produto-2-Diagnostico-estrategico-a-area-e-das-atividades-turisticas-volume-1.pdf" target="_blank" rel="noreferrer">Consultar referência pública da Prefeitura <ArrowUpRight size={16} /></a>
              </div>
              <div className="polinesia-condominium-grid">
                {condominiumGallery.map((item) => <a key={item.src} href={item.source} target="_blank" rel="noreferrer" className="polinesia-condominium-photo"><Image src={item.src} alt={item.alt} fill sizes="(max-width: 800px) 50vw, 25vw" /><span>{item.label}</span></a>)}
              </div>
            </div>
            <p className="polinesia-source-note">Imagens públicas de referência da infraestrutura do residencial. Fonte das imagens: anúncios públicos consultados no OLX; confirme autorização de uso, atualizações e regras diretamente com a administração.</p>
          </div>
        </section>

        <section className="polinesia-details">
          <div className="polinesia-container polinesia-details-grid">
            <div className="polinesia-details-photo"><Image src="/brand/casa-polineisia/10-Foto-10.jpg" alt="Piscina com hidromassagem integrada à área social" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
            <div className="polinesia-details-copy"><p className="polinesia-kicker">Detalhes do imóvel</p><h2>Um projeto que foi pensado para receber bem.</h2><ul>{["Sala imponente com pé-direito duplo", "Porta pivotante e acabamentos em porcelanato", "Cozinha funcional com churrasqueira", "4 suítes plenas, sendo 1 master com closet", "Banheiro social, lavabo, serviço e despensa", "Esquadrias de alumínio e iluminação em LED"].map((item) => <li key={item}><span><Check size={14} /></span>{item}</li>)}</ul><a href="#visita" className="polinesia-button polinesia-button--ink">Quero visitar este imóvel <ArrowUpRight size={18} /></a></div>
          </div>
        </section>

        <section className="polinesia-lifestyle">
          <div className="polinesia-container polinesia-lifestyle-grid"><div><p className="polinesia-kicker">Lazer privativo</p><h2>Seu quintal, seu ritmo.</h2></div><div><p>Uma área externa generosa para desacelerar, receber amigos e aproveitar o clima de Palmas.</p><div className="polinesia-lifestyle-points"><span><Waves size={18} /> Piscina com hidromassagem</span><span><Leaf size={18} /> Quintal gramado e irrigação automatizada</span><span><Sun size={18} /> Energia solar e poço semiartesiano</span></div></div></div>
        </section>

        <section className="polinesia-location" id="localizacao">
          <div className="polinesia-container polinesia-location-grid">
            <div className="polinesia-location-map"><iframe title="Mapa da localização do Condomínio Polinésia em Palmas" src="https://www.openstreetmap.org/export/embed.html?bbox=-48.38%2C-10.16%2C-48.34%2C-10.12&layer=mapnik&marker=-10.14093%2C-48.35711" loading="lazy" /></div>
            <div className="polinesia-location-copy"><p className="polinesia-kicker">Localização e entorno</p><h2>Entre o lago, a cidade e os principais eixos de Palmas.</h2><p>O Residencial Polinésia fica no Plano Diretor Norte, na Região Dourada, com acesso pela área do Lago de Palmas. Use os links abaixo para abrir a rota atualizada no Google Maps.</p><div className="polinesia-location-list">{locationPoints.map(([name, distance, url]) => <a key={name} href={url} target="_blank" rel="noreferrer"><span>{name}</span><strong>{distance}</strong><ArrowUpRight size={16} /></a>)}</div><small>Distâncias aproximadas de referência, arredondadas para orientação editorial. O acesso utilizado, a portaria e a rota escolhida podem alterar os números.</small></div>
          </div>
        </section>

        <section className="polinesia-gallery-section" id="galeria">
          <div className="polinesia-container"><div className="polinesia-section-heading"><div><p className="polinesia-kicker polinesia-kicker--light">Por todos os ângulos</p><h2>Conheça cada detalhe.</h2></div><p>Fotos reais da residência para você sentir a atmosfera antes de fazer a visita. Clique em qualquer imagem para abrir o arquivo original.</p></div><div className="polinesia-gallery">{gallery.map(([src, alt, size]) => <a className={`polinesia-gallery-${size}`} href={src} target="_blank" rel="noreferrer" key={src}><figure><Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 33vw" /><figcaption>{alt}</figcaption></figure></a>)}</div></div>
        </section>

        <section className="polinesia-contact" id="visita">
          <div className="polinesia-container polinesia-contact-grid"><div className="polinesia-contact-copy"><p className="polinesia-kicker polinesia-kicker--terracotta">Próximo passo</p><h2>Uma casa assim merece ser vivida de perto.</h2><p>Agende sua visita ao Condomínio Polinésia e conheça pessoalmente a arquitetura, os acabamentos e a área de lazer.</p><div className="polinesia-broker"><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares" width={64} height={64} /><div><strong>Pedro Soares</strong><span>Corretor de imóveis · CRECI 5861-TO</span></div></div><p className="polinesia-contact-note"><House size={18} /> Condomínio Polinésia · Palmas/TO</p></div><VisitForm /></div>
        </section>
      </main>

      <footer className="polinesia-footer"><div className="polinesia-container"><span>Pedro Soares Imóveis</span><small>Atendimento personalizado em Palmas/TO · CRECI 5861-TO</small></div></footer>
    </div>
  );
}
