import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  Droplets,
  MapPin,
  MessageCircle,
  Sparkles,
  Waves
} from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { MaestriaLeadForm } from "@/components/public/maestria-lead-form";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/maestria`;
const whatsappUrl = buildWhatsAppUrl("Olá, Pedro. Quero conhecer o Maestria Urban Design e receber a apresentação, plantas e condições.");

export const metadata: Metadata = {
  title: "Maestria Urban Design | A vista lapidada à perfeição",
  description:
    "Conheça o Maestria Urban Design: apartamentos de 129 a 147 m², arquitetura autoral e vista definitiva para o Lago de Palmas.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: pageUrl,
    title: "Maestria Urban Design | A vista lapidada à perfeição",
    description: "Um autêntico Urban Design à beira do Lago de Palmas, com lazer completo e arquitetura autoral.",
    images: [{ url: `${siteUrl}/brand/maestria/projeto-arquitetonico.png` }]
  }
};

const highlights = [
  { value: "129 a 147 m²", label: "apartamentos" },
  { value: "Vista definitiva", label: "para o Lago de Palmas" },
  { value: "Orla 14", label: "localização rara" },
  { value: "25 m", label: "piscina com raia" }
];

const features = [
  { icon: Building2, title: "Arquitetura autoral", text: "Uma torre em formato de L, desenhada para aproveitar a vista diagonal do lago em todas as unidades." },
  { icon: Sparkles, title: "Curadoria Urban Design", text: "Mobiliários selecionados, materiais de primeira e interiores assinados por grandes nomes." },
  { icon: Droplets, title: "Praça das Fontes", text: "Água, sombra e encontros em um espaço que transforma o lazer em memória." },
  { icon: Waves, title: "Lazer fluido", text: "Piscinas, spa, academia, salão, pub, gourmet e ambientes para viver o seu ritmo." }
];

const amenities = [
  "Elevador privativo para todas as unidades",
  "Persianas integradas preparadas para automação",
  "Churrasqueira a carvão com exaustor",
  "Ponto para ar-condicionado K7 na sala e varandas",
  "Varandas sem pé-direito triplo",
  "Preparação para aquecimento dos chuveiros a gás"
];

const maestriaFloorplans = [
  { src: "/brand/maestria/foto-1.jpg", title: "Final 02 · varanda aberta", area: "132,86 m²", detail: "3 suítes · apartamento final 02" },
  { src: "/brand/maestria/foto-2.jpg", title: "Final 02 · varanda integrada", area: "132,86 m²", detail: "3 suítes · apartamento final 02" },
  { src: "/brand/maestria/foto-3.jpg", title: "Final 03-B", area: "129,22 m²", detail: "3 suítes · varanda aberta" },
  { src: "/brand/maestria/foto-4.jpg", title: "Final 03-A · varanda integrada", area: "146,40 m²", detail: "3 suítes · imagem comercial de 147 m²" },
  { src: "/brand/maestria/foto-5.jpg", title: "Final 03-A · varanda aberta", area: "146,40 m²", detail: "3 suítes · imagem comercial de 147 m²" },
  { src: "/brand/maestria/foto-6.jpg", title: "Final 01-A", area: "144,24 m²", detail: "3 suítes · imagem comercial de 144 m²" },
  { src: "/brand/maestria/foto-7.jpg", title: "Final 01-B", area: "140,40 m²", detail: "3 suítes · imagem comercial de 140 m²" }
];

const maestriaUnitFloors = [33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4].map((floor) => ({
  floor,
  finalLetter: [31, 30, 19, 18, 11, 10, 7].includes(floor) ? "B" : "A"
}));

export default function MaestriaPage() {
  return (
    <div className="maestria-landing">
      <LandingPageTracker landingPageSlug="maestria-urban-design" />
      <section className="maestria-hero" id="inicio">
        <div className="maestria-hero-panel">
          <header className="maestria-nav">
            <a href="#inicio" className="maestria-lockup" aria-label="Maestria Urban Design">
              <span className="maestria-mark">✦</span>
              <span><strong>MAESTRIA</strong><small>URBAN DESIGN</small></span>
            </a>
            <nav aria-label="Navegação principal">
              <a href="#projeto">O projeto</a>
              <a href="#localizacao">Localização</a>
              <a href="#experiencia">Experiência</a>
              <a href="#plantas">Plantas</a>
              <a href="#unidades">Unidades</a>
            </nav>
            <a className="maestria-button maestria-button--outline maestria-button--small" href="#atendimento">Falar com Pedro</a>
          </header>
          <div className="maestria-hero-copy">
            <p className="maestria-eyebrow"><span /> Orla 14 · Palmas / TO</p>
            <p className="maestria-overline">A VISTA LAPIDADA À PERFEIÇÃO</p>
            <h1>O raro encontra o seu lugar.</h1>
            <p className="maestria-hero-lede">Um autêntico Urban Design para quem deseja viver a paisagem mais bonita de Palmas com maestria em cada detalhe.</p>
            <div className="maestria-hero-actions">
              <a className="maestria-button maestria-button--gold" href="#atendimento">Quero conhecer <ArrowRight size={17} /></a>
              <a className="maestria-hero-link" href="#projeto">Descobrir o projeto <ArrowDown size={15} /></a>
            </div>
          </div>
          <div className="maestria-hero-signature">Urban<br /><span>pronto para viver. pronto para você.</span></div>
        </div>
        <div className="maestria-hero-image-wrap">
          <Image src="/brand/maestria/projeto-arquitetonico.png" alt="Perspectiva arquitetônica do Maestria Urban Design" fill priority sizes="(max-width: 800px) 100vw, 52vw" className="maestria-hero-image" />
          <span className="maestria-image-caption">Perspectiva ilustrada da fachada</span>
        </div>
      </section>

      <section className="maestria-stat-strip" aria-label="Resumo do empreendimento">
        <div className="maestria-container maestria-stat-grid">
          {highlights.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
        </div>
      </section>

      <section id="projeto" className="maestria-section maestria-section--paper">
        <div className="maestria-container maestria-story-grid">
          <div className="maestria-story-copy">
            <p className="maestria-kicker">Uma obra uníssona</p>
            <h2>Vista definitiva para o lago em todas as unidades.</h2>
            <p>Se a maestria vem da prática, da dedicação e da obsessão pelo raro, o Maestria é o ponto alto da arte de criar projetos que aproveitam ao máximo a vista para o Lago de Palmas.</p>
            <p>A torre em formato de L foi estrategicamente posicionada para entregar uma perspectiva única do maior cartão-postal da capital — com volumes cúbicos, varandas acolhedoras e terraços com pé-direito triplo.</p>
            <a className="maestria-text-link" href="#experiencia">Conhecer a experiência <ArrowRight size={16} /></a>
          </div>
          <div className="maestria-story-image">
            <Image src="/brand/maestria/galeria-maestria.png" alt="Galeria Maestria com iluminação intimista e vegetação tropical" fill sizes="(max-width: 900px) 100vw, 48vw" />
            <span>Galeria Maestria · uma experiência multissensorial</span>
          </div>
        </div>
      </section>

      <section id="localizacao" className="maestria-location-section" aria-labelledby="maestria-location-title">
        <div className="maestria-container maestria-location-grid">
          <div className="maestria-location-image">
            <Image src="/brand/maestria/orla-14.jpg" alt="Vista aérea da Orla 14 de Palmas, às margens do Lago de Palmas" fill sizes="(max-width: 900px) 90vw, 58vw" />
            <span>Orla 14 · Palmas / TO</span>
          </div>
          <div className="maestria-location-copy">
            <p className="maestria-kicker">Uma localização rara</p>
            <h2 id="maestria-location-title">Viver na Orla 14 é ter o lago como horizonte.</h2>
            <p>O Maestria nasce em um dos endereços mais desejados de Palmas: entre a cidade, a natureza e a paisagem definitiva do Lago de Palmas.</p>
            <div className="maestria-location-facts">
              <div><strong>Orla 14</strong><span>Endereço do Maestria</span></div>
              <div><strong>Lago de Palmas</strong><span>Vista permanente</span></div>
              <div><strong>Palmas / TO</strong><span>Capital em movimento</span></div>
            </div>
            <a className="maestria-button maestria-button--wine" href="#atendimento">Conhecer o endereço <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <section id="experiencia" className="maestria-section maestria-section--wine">
        <div className="maestria-container">
          <div className="maestria-section-heading">
            <p className="maestria-kicker">Padrão Urban</p>
            <h2>Um jeito mais raro de morar.</h2>
            <p>Localização, arquitetura, acabamento e inovação unidos para criar uma experiência que permanece.</p>
          </div>
          <div className="maestria-feature-grid">
            {features.map(({ icon: Icon, title, text }) => <article key={title} className="maestria-feature-card"><Icon size={22} strokeWidth={1.4} /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="maestria-gallery-band">
        <div className="maestria-container maestria-gallery-grid">
          <div className="maestria-gallery-intro"><p className="maestria-kicker">O espetáculo dos encontros</p><h2>Água, verde e tempo para viver bem.</h2><p>A Praça das Fontes cria um novo ponto de encontro: dias quentes, noites mágicas e histórias que começam no quintal de casa.</p></div>
          <div className="maestria-gallery-image"><Image src="/brand/maestria/praca-das-fontes.png" alt="Praça das Fontes do Maestria Urban Design" fill sizes="(max-width: 800px) 100vw, 56vw" /></div>
        </div>
      </section>

      <section id="plantas" className="maestria-section maestria-section--paper">
        <div className="maestria-container maestria-plan-grid">
          <div>
            <p className="maestria-kicker">Lapidado sob medida</p>
            <h2>Seu espaço, seu estilo de vida.</h2>
            <p className="maestria-muted-copy">Plantas de 129 a 147 m² com ambientes integrados, varanda gourmet e soluções pensadas para o conforto de todos os dias.</p>
            <div className="maestria-amenities">{amenities.map((item) => <span key={item}><Check size={15} />{item}</span>)}</div>
          </div>
          <div className="maestria-plan-card"><span className="maestria-plan-number">129 <small>a</small> 147</span><span className="maestria-plan-unit">m²</span><div className="maestria-plan-rule" /><p>Apartamentos com varanda aberta ou integrada, suíte master e o cuidado Urban em todos os detalhes.</p><a className="maestria-text-link" href="#atendimento">Receber plantas <ArrowRight size={16} /></a></div>
        </div>
        <div className="maestria-container maestria-floorplans-block">
          <div className="maestria-floorplans-heading">
            <p className="maestria-kicker">Plantas disponíveis</p>
            <p>Veja as configurações dos finais e amplie cada imagem para consultar os ambientes e medidas.</p>
          </div>
          <div className="maestria-floorplans-grid">
            {maestriaFloorplans.map((plan) => (
              <article className="maestria-floorplan-card" key={plan.src}>
                <a href={plan.src} target="_blank" rel="noreferrer" className="maestria-floorplan-image" aria-label={`Ampliar planta ${plan.title}`}>
                  <Image src={plan.src} alt={`Planta ${plan.title} do Maestria Urban Design`} fill sizes="(max-width: 680px) 90vw, (max-width: 1000px) 45vw, 30vw" />
                  <span>Ampliar planta ↗</span>
                </a>
                <div className="maestria-floorplan-copy">
                  <div><strong>{plan.title}</strong><b>{plan.area}</b></div>
                  <small>{plan.detail}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="unidades" className="maestria-units-section" aria-labelledby="maestria-units-title">
        <div className="maestria-container">
          <div className="maestria-section-heading maestria-section-heading--units">
            <p className="maestria-kicker">Espelho de unidades</p>
            <h2 id="maestria-units-title">Escolha o seu andar.</h2>
            <p>São 90 apartamentos distribuídos do 4º ao 33º pavimento. Consulte a disponibilidade, o valor e a condição atualizada de cada unidade no atendimento.</p>
          </div>
          <div className="maestria-units-reference">
            <div className="maestria-reference-image">
              <Image src="/brand/maestria/espelho-de-vendas.jpg" alt="Espelho de vendas do Maestria Urban Design" fill sizes="(max-width: 760px) 90vw, 260px" />
            </div>
            <div>
              <p className="maestria-kicker">Referência comercial</p>
              <strong>Espelho de vendas</strong>
              <span>Finais, áreas privativas e pavimentos conforme material enviado.</span>
              <a href="/brand/maestria/espelho-de-vendas.jpg" target="_blank" rel="noreferrer">Abrir imagem original <ArrowRight size={15} /></a>
            </div>
          </div>
          <div className="maestria-units-table-wrap">
            <table className="maestria-units-table">
              <thead>
                <tr><th>Pav.</th><th>Final 03</th><th>Final 02</th><th>Final 01</th><th>Status</th></tr>
              </thead>
              <tbody>
                {maestriaUnitFloors.map(({ floor, finalLetter }) => {
                  const final03Area = finalLetter === "B" ? "129,22 m²" : "146,40 m²";
                  const final01Area = finalLetter === "B" ? "140,40 m²" : "144,24 m²";
                  return (
                    <tr key={floor}>
                      <td className="maestria-units-floor">{floor}º</td>
                      <td><strong>{floor}03 {finalLetter}</strong><small>{final03Area}</small></td>
                      <td><strong>{floor}02</strong><small>{finalLetter === "B" ? "136,41 m²" : "132,86 m²"}</small></td>
                      <td><strong>{floor}01 {finalLetter}</strong><small>{final01Area}</small></td>
                      <td><span className="maestria-unit-status">Consulte</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="atendimento" className="maestria-contact-section">
        <div className="maestria-container maestria-contact-grid">
          <div className="maestria-contact-copy"><p className="maestria-kicker">Seu próximo capítulo</p><h2>Conheça o Maestria com quem entende o seu momento.</h2><p>Eu apresento o projeto, explico as plantas e ajudo você a avaliar as condições com calma e clareza.</p><div className="maestria-broker-mini"><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares, corretor de imóveis" width={86} height={112} /><span><strong>Pedro Soares</strong><small>Corretor de imóveis · CRECI 5861-TO</small><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Falar no WhatsApp</a></span></div></div>
          <MaestriaLeadForm />
        </div>
      </section>

      <footer className="maestria-footer"><div className="maestria-container"><div className="maestria-lockup"><span className="maestria-mark">✦</span><span><strong>MAESTRIA</strong><small>URBAN DESIGN</small></span></div><p>Um dos últimos terrenos à beira do Lago de Palmas.</p><small>Imagens meramente ilustrativas. O projeto, materiais e acabamentos poderão sofrer alterações conforme projetos e memoriais.</small></div></footer>
      <a className="maestria-whatsapp-float" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar sobre o Maestria Urban Design pelo WhatsApp"><MessageCircle size={19} /><span>Quero conhecer</span></a>
    </div>
  );
}
