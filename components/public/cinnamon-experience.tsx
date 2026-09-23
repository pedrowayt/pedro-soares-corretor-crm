"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleAlert,
  Coffee,
  Dumbbell,
  KeyRound,
  MapPin,
  Menu,
  Monitor,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";

const gallery = [
  ["/brand/cinnamon/studio-01.webp", "Cozinha integrada", "01"],
  ["/brand/cinnamon/studio-02.webp", "Estar e dormir", "02"],
  ["/brand/cinnamon/studio-03.webp", "Home office", "03"],
  ["/brand/cinnamon/studio-04.webp", "Banheiro", "04"],
  ["/brand/cinnamon/studio-05.webp", "Sacada", "05"]
] as const;

const serviceGroups = [
  {
    icon: KeyRound,
    number: "01",
    title: "Chegar e receber",
    items: ["Recepção 24 horas", "Concierge", "Manobrista", "Guarda-volumes"]
  },
  {
    icon: Monitor,
    number: "02",
    title: "Trabalhar melhor",
    items: ["Coworking", "Cabines acústicas", "Salas de reunião", "Estúdio de podcast"]
  },
  {
    icon: Dumbbell,
    number: "03",
    title: "Cuidar do ritmo",
    items: ["Academia e pilates", "Piscina", "Sauna", "Jardim sensorial"]
  },
  {
    icon: Coffee,
    number: "04",
    title: "Resolver o dia",
    items: ["Mercado autônomo 24h", "Lavanderia", "Storage", "Pet place"]
  }
] as const;

function CinnamonWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`cinnamon-wordmark ${className}`} aria-label="Cinnamon Studio">
      <strong>CINNAMON</strong>
      <small>STUDIO</small>
    </span>
  );
}

function InterestForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/public/leads/development-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          whatsapp: data.get("whatsapp"),
          email: data.get("email"),
          developmentSlug: "cinnamon-studio",
          message: `Interesse no Cinnamon Studio. Perfil: ${data.get("interest") ?? "Ainda estou avaliando"}.`,
          lgpdConsent: data.get("lgpdConsent") === "on"
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Não foi possível registrar seu interesse.");
      }
      form.reset();
      setStatus("success");
      setMessage("Seu interesse foi registrado. Vou retornar com o material do Cinnamon Studio.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar agora. Tente novamente.");
    }
  }

  return (
    <form className="cinnamon-lead-form" onSubmit={onSubmit}>
      <div className="cinnamon-form-grid">
        <label>
          Nome completo
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
          Quero conhecer
          <select name="interest" defaultValue="Ainda estou avaliando">
            <option>O projeto</option>
            <option>A planta e os ambientes</option>
            <option>A estrutura e os serviços</option>
            <option>Condições comerciais</option>
            <option>Ainda estou avaliando</option>
          </select>
        </label>
      </div>
      <label className="cinnamon-consent">
        <input type="checkbox" name="lgpdConsent" required />
        <span>Autorizo o contato de Pedro Soares sobre o Cinnamon Studio e concordo com a política de privacidade.</span>
      </label>
      <button className="cinnamon-button cinnamon-button-light" type="submit">
        Receber o material <ArrowRight size={16} />
      </button>
      {status !== "idle" ? (
        <p className={`cinnamon-form-status cinnamon-form-status--${status}`} role="status" aria-live="polite">
          {status === "success" ? <Check size={17} /> : null}
          {message}
        </p>
      ) : null}
    </form>
  );
}

export function CinnamonExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="cinnamon-page site-shell">
      <LandingPageTracker landingPageSlug="cinnamon-studio" />
      <header className="cinnamon-header">
        <a href="#inicio" className="cinnamon-header-brand" onClick={closeMenu} aria-label="Cinnamon Studio, início">
          <CinnamonWordmark />
        </a>
        <nav className={`cinnamon-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegação do Cinnamon Studio">
          <a href="#projeto" onClick={closeMenu}>O projeto</a>
          <a href="#studio" onClick={closeMenu}>O studio</a>
          <a href="#estrutura" onClick={closeMenu}>Estrutura</a>
          <a href="#contato" onClick={closeMenu}>Contato</a>
        </nav>
        <div className="cinnamon-header-actions">
          <a className="cinnamon-header-cta" href="#contato">Receber material <ArrowRight size={14} /></a>
          <button className="cinnamon-menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main>
        <section className="cinnamon-hero" id="inicio">
          <Image src="/brand/cinnamon/hero.webp" alt="Fachada do Cinnamon Studio ao entardecer" fill priority sizes="100vw" className="cinnamon-hero-image" />
          <div className="cinnamon-hero-shade" />
          <div className="cinnamon-hero-content">
            <p className="cinnamon-eyebrow cinnamon-eyebrow-light">Pré-cadastro e material do projeto</p>
            <h1>Seu espaço.<br /><em>Seu ritmo.</em></h1>
            <p className="cinnamon-hero-copy">Studios inteligentes para quem vive em movimento, na Orla de Palmas.</p>
            <a href="#projeto" className="cinnamon-button cinnamon-button-light">Conhecer o projeto <ArrowDown size={16} /></a>
          </div>
          <div className="cinnamon-hero-meta"><span>Cinnamon Studio</span><span>Orla de Palmas · TO</span><span>01 / 05</span></div>
        </section>

        <section className="cinnamon-intro cinnamon-section-pad" id="projeto">
          <div className="cinnamon-kicker"><span>01</span><i /> O projeto</div>
          <div className="cinnamon-intro-grid">
            <div>
              <p className="cinnamon-eyebrow">Um espaço para quem vive em movimento</p>
              <h2>Carregar menos.<br /><em>Viver mais.</em></h2>
            </div>
            <div className="cinnamon-copy">
              <p>Primeiro, o lago. Depois, a torre — e, dentro dela, um studio que resolve a vida inteira. Um endereço pensado para morar, trabalhar, receber e encontrar um ritmo mais leve.</p>
              <p>O Cinnamon Studio combina inteligência espacial, arquitetura contemporânea e uma estrutura de serviços que acompanha o seu dia.</p>
              <a href="#studio" className="cinnamon-text-link">Ver o studio <ArrowRight size={15} /></a>
            </div>
          </div>
          <div className="cinnamon-stat-strip" aria-label="Dados do projeto">
            <div><strong>29,92</strong><span>m² privativos</span></div>
            <div><strong>7,48</strong><span>m² de sacada</span></div>
            <div><strong>510</strong><span>studios em torre única</span></div>
            <div><strong>Orla</strong><span>Palmas · TO</span></div>
          </div>
        </section>

        <section className="cinnamon-dark-statement"><div><Sparkles size={19} strokeWidth={1.2} /><p>Uma nova forma de ocupar o tempo.<br /><em>Um novo jeito de ocupar a cidade.</em></p></div></section>

        <section className="cinnamon-studio-section cinnamon-section-pad" id="studio">
          <div className="cinnamon-kicker"><span>02</span><i /> O studio</div>
          <div className="cinnamon-section-heading"><div><p className="cinnamon-eyebrow">Inteligência espacial</p><h2>Cada metro,<br /><em>uma função.</em></h2></div><p>Studio único de 22,44 m², com sacada de 7,48 m². Ambientes integrados para o dia começar, trabalhar, descansar e recomeçar.</p></div>
          <div className="cinnamon-gallery">{gallery.map(([src, alt, number], index) => <figure className={`cinnamon-gallery-card cinnamon-gallery-card-${index + 1}`} key={src}><Image src={src} alt={alt} fill sizes="(max-width: 760px) 50vw, 33vw" /><figcaption><span>{number}</span>{alt}</figcaption></figure>)}</div>
        </section>

        <section className="cinnamon-plan-section"><div className="cinnamon-plan-image"><Image src="/brand/cinnamon/planta.webp" alt="Planta humanizada do studio Cinnamon" fill sizes="(max-width: 900px) 100vw, 54vw" /></div><div className="cinnamon-plan-copy"><p className="cinnamon-eyebrow">A planta</p><h2>Um ambiente integrado para <em>render mais.</em></h2><p>Cozinha em linha, área de estar e dormir, home office, banheiro compacto e uma sacada aberta para a paisagem.</p><ul><li><Check size={15} /> Cozinha integrada</li><li><Check size={15} /> Estar e dormir no mesmo campo de visão</li><li><Check size={15} /> Home office para a rotina flexível</li><li><Check size={15} /> Sacada de 7,48 m²</li></ul><span className="cinnamon-illustrative">Imagem meramente ilustrativa.</span></div></section>

        <section className="cinnamon-structure cinnamon-section-pad" id="estrutura">
          <div className="cinnamon-kicker"><span>03</span><i /> Estrutura e serviços</div>
          <div className="cinnamon-section-heading"><div><p className="cinnamon-eyebrow">Mais do que um endereço</p><h2>O prédio acompanha<br /><em>o seu ritmo.</em></h2></div><p>Serviços pensados para hospedar melhor, trabalhar com autonomia e resolver o cotidiano com menos deslocamento.</p></div>
          <div className="cinnamon-service-grid">{serviceGroups.map(({ icon: Icon, number, title, items }) => <article key={title}><div className="cinnamon-service-top"><span>{number}</span><Icon size={21} strokeWidth={1.3} /></div><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
          <div className="cinnamon-service-note"><CircleAlert size={17} /><p>Itens de infraestrutura fazem parte do projeto. Serviços operados por concessionários dependem de contratos e terão cronograma divulgado antes da entrega.</p></div>
        </section>

        <section className="cinnamon-location"><div className="cinnamon-location-image"><Image src="/brand/cinnamon/acesso.webp" alt="Acesso principal do Cinnamon Studio" fill sizes="(max-width: 900px) 100vw, 50vw" /></div><div className="cinnamon-location-copy"><div className="cinnamon-kicker"><span>04</span><i /> O endereço</div><p className="cinnamon-eyebrow">A cidade perto. A pressa longe.</p><h2>Orla de<br /><em>Palmas.</em></h2><p>Um projeto na região da Orla da Graciosa, com o lago, a cidade e a rotina de trabalho no mesmo horizonte.</p><div className="cinnamon-location-tag"><MapPin size={17} strokeWidth={1.4} /><span>Q Orla 14 · Graciosa · Palmas/TO</span></div></div></section>

        <section className="cinnamon-truth cinnamon-section-pad"><div className="cinnamon-kicker cinnamon-kicker-light"><span>05</span><i /> Transparência do projeto</div><div className="cinnamon-truth-grid"><div><p className="cinnamon-eyebrow cinnamon-eyebrow-light">Informação clara antes da decisão</p><h2>O que este material<br /><em>não vai te dizer.</em></h2></div><div className="cinnamon-truth-copy"><p>O estudo de operação ainda está sendo contratado. Por isso, não anunciamos rendimento, valorização futura, recompra ou rentabilidade garantida.</p><div className="cinnamon-truth-list"><span><ShieldCheck size={17} /> Memorial de incorporação ainda não registrado.</span><span><ShieldCheck size={17} /> Vagas de garagem disponibilizadas por locação, não incluídas na unidade.</span><span><ShieldCheck size={17} /> Imagens e plantas meramente ilustrativas.</span></div></div></div></section>

        <section className="cinnamon-contact cinnamon-section-pad" id="contato"><div className="cinnamon-kicker cinnamon-kicker-light"><span>06</span><i /> Primeiro contato</div><div className="cinnamon-contact-grid"><div className="cinnamon-contact-copy"><p className="cinnamon-eyebrow cinnamon-eyebrow-light">Receba uma apresentação personalizada</p><h2>Seu espaço<br /><em>começa aqui.</em></h2><p>Deixe seus dados e receba o material do Cinnamon Studio para conhecer o projeto com calma.</p><div className="cinnamon-trust"><ShieldCheck size={18} /> Atendimento direto com Pedro Soares · CRECI 5861-TO</div></div><div className="cinnamon-contact-form-wrap"><InterestForm /></div></div></section>
      </main>

      <footer className="cinnamon-footer"><CinnamonWordmark /><div>Studios inteligentes para quem vive em movimento.</div><a href="#inicio" aria-label="Voltar ao início">Voltar ao início <ArrowRight size={14} /></a><p>Incorporação: Smart Studios SPE Ltda · CNPJ 68.632.814/0001-82 · Imagens meramente ilustrativas. Memorial de incorporação não registrado — não há oferta, reserva ou venda de unidades.</p></footer>
    </div>
  );
}
