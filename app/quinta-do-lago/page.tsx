import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check, Clock3, Dumbbell, ExternalLink, FileText, Globe2, Heart, Leaf, MapPin, MessageCircle, Route, ShieldCheck, Waves } from "lucide-react";
import { QuintaDoLagoLeadForm } from "@/components/public/quinta-do-lago-lead-form";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const heroImage = "/brand/quinta-do-lago/fotos/quiosques.jpeg";
const destinationImage = "/brand/quinta-do-lago/fotos/bares-de-praia.jpeg";
const lifestyleImage = "/brand/quinta-do-lago/fotos/academia.jpeg";
const curationImage = "/brand/quinta-do-lago/fotos/pier.jpeg";
const mapUrl = "https://maps.app.goo.gl/rPkuKojMAe2Bnjh98?g_st=ic";
const mapEmbedUrl = "https://www.google.com/maps?q=Condom%C3%ADnio+de+Ch%C3%A1caras+Quinta+do+Lago%2C+Condominio+Ecol%C3%B3gico+Portal+da+Serra+do+Carmo%2C+Miracema+do+Tocantins+-+TO&output=embed";
const plantUrl = "https://drive.google.com/file/d/1o6Qt3m0cYhKAQZkUDQA0n-PFbjvnafDr/view?usp=drivesdk";
const lotMapUrl = "https://cidadeviva.imb.br/quintadolago/";

export const metadata: Metadata = {
  title: "Quinta do Lago | Condomínio de Chácaras",
  description:
    "Conheça o Quinta do Lago, condomínio de chácaras do Recanto Santa Luzia, pensado para viver a natureza, reunir a família e aproveitar cada momento.",
  alternates: { canonical: `${siteUrl}/quinta-do-lago` },
  openGraph: {
    title: "Quinta do Lago | Um novo jeito de viver a natureza",
    description: "Condomínio de chácaras com lago, lazer, esporte, família e infraestrutura completa.",
    type: "website",
    url: `${siteUrl}/quinta-do-lago`,
    images: [{ url: heroImage }]
  }
};

const experiences = [
  { icon: Leaf, title: "Natureza e água", text: "O lago é o grande protagonista para descansar, contemplar e desacelerar." },
  { icon: Waves, title: "Lazer e convivência", text: "Quiosques, churrasqueiras, salão de festas e bares de praia para aproveitar juntos." },
  { icon: Dumbbell, title: "Esporte e bem-estar", text: "Campo de society, quadras de areia, academia, pista de cooper e parque ecológico." },
  { icon: Heart, title: "Família e pets", text: "Parque infantil, Pet Place e espaços para todos viverem melhor." }
];

const gallery = [
  { src: "/brand/quinta-do-lago/fotos/bares-de-praia.jpeg", alt: "Bar de praia à beira do lago", label: "Bares de praia" },
  { src: "/brand/quinta-do-lago/fotos/pier.jpeg", alt: "Píer junto ao lago e à área verde", label: "Píeres e lago" },
  { src: "/brand/quinta-do-lago/fotos/parque-ecologico.jpeg", alt: "Parque ecológico com árvores e luz natural", label: "Parque ecológico" },
  { src: "/brand/quinta-do-lago/fotos/academia.jpeg", alt: "Academia envidraçada com vista para a natureza", label: "Academia" },
  { src: "/brand/quinta-do-lago/fotos/parque-infantil.jpeg", alt: "Parque infantil ao ar livre", label: "Parque infantil" },
  { src: "/brand/quinta-do-lago/fotos/quiosques.jpeg", alt: "Quiosques de palha em meio à natureza", label: "Quiosques" }
];

const whatsappUrl = buildWhatsAppUrl(
  "Olá, Pedro. Tenho interesse em conhecer o Quinta do Lago, condomínio de chácaras. Gostaria de receber a apresentação e as condições disponíveis."
);

export default function QuintaDoLagoPage() {
  return (
    <div className="qdl-landing">
      <header className="qdl-header">
        <a className="qdl-wordmark" href="#inicio" aria-label="Quinta do Lago — início">
          <Image src="/brand/quinta-do-lago/logo-horizontal.jpg" alt="Quinta do Lago" width={176} height={118} priority className="qdl-header-logo" />
        </a>
        <nav className="qdl-nav" aria-label="Navegação da página">
          <a href="#conceito">O conceito</a>
          <a href="#experiencias">Experiências</a>
          <a href="#lotes">Lotes</a>
          <a href="#vivencias">Vivências</a>
          <a href="#localizacao">Localização</a>
          <a href="#curadoria">Curadoria</a>
        </nav>
          <a className="qdl-header-cta" href="#contato">Quero conhecer o projeto <ArrowRight size={15} /></a>
      </header>

      <div>
        <section id="inicio" className="qdl-hero">
          <Image src={heroImage} alt="Quiosques à beira do lago do Quinta do Lago" fill priority quality={90} sizes="100vw" className="qdl-hero-image" />
          <div className="qdl-hero-shade" />
          <div className="qdl-hero-content qdl-container">
            <p className="qdl-eyebrow">Recanto Santa Luzia · Tocantins</p>
            <h1>Um novo jeito de viver a natureza.</h1>
            <p className="qdl-hero-copy">Um condomínio de chácaras pensado para desacelerar, reunir quem você ama e aproveitar cada momento.</p>
            <div className="qdl-hero-actions">
              <a className="qdl-button qdl-button--light" href="#contato">Receber apresentação <ArrowRight size={17} /></a>
              <a className="qdl-button qdl-button--ghost" href="#conceito">Conhecer o conceito</a>
            </div>
          </div>
          <div className="qdl-hero-bottom qdl-container">
            <span>Condomínio de chácaras</span>
            <span className="qdl-hero-line" />
            <span>Natureza · lazer · tranquilidade</span>
          </div>
        </section>

        <section id="conceito" className="qdl-section qdl-destination">
          <div className="qdl-container qdl-destination-grid">
            <div className="qdl-destination-copy">
              <p className="qdl-eyebrow qdl-eyebrow--olive">Bem-vindo ao Quinta do Lago</p>
              <Image src="/brand/quinta-do-lago/logo-dourado.jpg" alt="Quinta do Lago" width={175} height={117} className="qdl-gold-logo" />
              <h2>Mais do que uma chácara, um estilo de vida.</h2>
              <p>A vida moderna passa rápido demais. Entre trabalho, compromissos e rotina, o tempo parece escapar.</p>
              <p>O Quinta do Lago nasce como um convite para desacelerar e viver momentos de verdade, cercado pela natureza, tranquilidade e liberdade.</p>
              <a className="qdl-text-link" href="#contato">Quero receber a apresentação <ArrowRight size={16} /></a>
            </div>
            <div className="qdl-destination-media">
              <Image src={destinationImage} alt="Bar de praia à beira do lago do Quinta do Lago" fill quality={90} sizes="(max-width: 800px) 92vw, 48vw" />
              <div className="qdl-image-label"><MapPin size={14} /> Recanto Santa Luzia · TO</div>
            </div>
          </div>
        </section>

        <section id="experiencias" className="qdl-section qdl-experiences">
          <div className="qdl-container">
            <div className="qdl-section-intro">
              <p className="qdl-eyebrow">Tudo o que você encontra</p>
              <h2>O privilégio de escolher como o seu dia acontece.</h2>
            </div>
            <div className="qdl-experience-grid">
              {experiences.map(({ icon: Icon, title, text }) => (
                <article className="qdl-experience-card" key={title}>
                  <Icon size={22} strokeWidth={1.4} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="qdl-editorial">
          <div className="qdl-editorial-image">
            <Image src={lifestyleImage} alt="Academia envidraçada com vista para o lago e a natureza" fill quality={90} sizes="(max-width: 800px) 100vw, 50vw" />
          </div>
          <div className="qdl-editorial-copy">
            <p className="qdl-eyebrow qdl-eyebrow--olive">O coração do Quinta do Lago</p>
            <h2>O lago é o grande protagonista.</h2>
            <p>Um ambiente perfeito para descanso, lazer e contemplação. Aqui, cada fim de semana pode se transformar em uma experiência inesquecível.</p>
            <div className="qdl-check-list">
              <span><Check size={15} /> Quiosques de palha e churrasqueiras</span>
              <span><Check size={15} /> Bares de praia e salão de festas</span>
              <span><Check size={15} /> Espaços para aproveitar em família</span>
            </div>
            <a className="qdl-button qdl-button--olive" href="#contato">Conhecer as condições <ArrowRight size={17} /></a>
          </div>
        </section>

        <section id="lotes" className="qdl-lots">
          <div className="qdl-container">
            <div className="qdl-section-intro qdl-lots-intro">
              <div>
                <p className="qdl-eyebrow qdl-eyebrow--olive"><FileText size={15} /> Planta e lotes</p>
                <h2>Escolha o espaço que combina com a sua forma de viver.</h2>
              </div>
              <p>Consulte a implantação do Quinta do Lago e veja a posição das chácaras, ruas, áreas verdes e espaços de lazer. A metragem varia conforme a unidade.</p>
            </div>

            <div className="qdl-lots-grid">
              <div className="qdl-plant-card">
                <iframe title="Mapa interativo de lotes do Quinta do Lago" src={lotMapUrl} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
                <div className="qdl-plant-caption">
                  <span><MapPin size={16} /> Clique nos lotes e use o zoom para ver metragem, valor e pagamento</span>
                  <a href={lotMapUrl} target="_blank" rel="noreferrer">Abrir mapa completo <ExternalLink size={14} /></a>
                </div>
              </div>

              <aside className="qdl-lot-panel">
                <p className="qdl-eyebrow">Informações da implantação</p>
                <h3>Veja primeiro. Escolha com calma.</h3>
                <div className="qdl-lot-facts">
                  <div><strong>1.100 m²</strong><span>Metragem predominante indicada na planta</span></div>
                  <div><strong>Áreas especiais</strong><span>Há chácaras maiores e formatos diferenciados</span></div>
                  <div><strong>Valor atualizado</strong><span>Consulte preço e disponibilidade de cada unidade</span></div>
                </div>
                <a className="qdl-plant-link" href={plantUrl} target="_blank" rel="noreferrer"><FileText size={17} /><span><strong>Planta urbanística geral</strong><small>Documento enviado · 04 de fevereiro de 2026</small></span><ExternalLink size={15} /></a>
                <p className="qdl-lot-note">O mapa interativo carrega os detalhes publicados de cada lote — metragem, valor, entrada e forma de pagamento. Confirme as condições com a tabela comercial vigente.</p>
                <a className="qdl-button qdl-button--olive" href="#contato">Quero consultar um lote <ArrowRight size={16} /></a>
              </aside>
            </div>
          </div>
        </section>

        <section id="vivencias" className="qdl-gallery">
          <div className="qdl-container">
            <div className="qdl-section-intro qdl-gallery-intro">
              <div>
                <p className="qdl-eyebrow qdl-eyebrow--olive">Por dentro do Quinta do Lago</p>
                <h2>Espaços pensados para aproveitar o tempo.</h2>
              </div>
              <p>Uma seleção de imagens dos ambientes de lazer, convivência e contato com a natureza que fazem parte do projeto.</p>
            </div>
            <div className="qdl-gallery-grid">
              {gallery.map((item, index) => (
                <figure className={`qdl-gallery-item qdl-gallery-item--${index + 1}`} key={item.src}>
                  <Image src={item.src} alt={item.alt} fill sizes="(max-width: 620px) 90vw, (max-width: 900px) 45vw, 30vw" />
                  <figcaption>{item.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="localizacao" className="qdl-location">
          <div className="qdl-location-copy">
            <p className="qdl-eyebrow qdl-eyebrow--olive"><MapPin size={15} /> Localização</p>
            <h2>Natureza perto de Palmas.</h2>
            <p>O Quinta do Lago está localizado em Miracema do Tocantins, na região do Condomínio Ecológico Portal da Serra do Carmo e do Recanto Santa Luzia.</p>
            <p>Do ponto indicado no mapa até Palmas, o trajeto de carro é de aproximadamente 69,8 km, com duração estimada de 1h20 pela TO-348.</p>
            <div className="qdl-location-facts" aria-label="Distância e tempo até Palmas">
              <div><Route size={19} /><strong>69,8 km</strong><span>até Palmas, aproximadamente</span></div>
              <div><Clock3 size={19} /><strong>1h20</strong><span>de carro, como referência</span></div>
            </div>
            <p className="qdl-location-note">Distância e tempo podem variar conforme o ponto de saída, a rota escolhida e as condições do trânsito.</p>
            <a className="qdl-button qdl-button--olive" href={mapUrl} target="_blank" rel="noreferrer">Abrir localização <ExternalLink size={16} /></a>
          </div>
          <div className="qdl-map-card">
            <iframe title="Mapa da localização do Quinta do Lago" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <div className="qdl-map-caption"><MapPin size={15} /><span>Quinta do Lago · Miracema do Tocantins/TO</span></div>
          </div>
        </section>

        <section id="curadoria" className="qdl-section qdl-curation">
          <div className="qdl-container qdl-curation-grid">
            <div className="qdl-curation-media">
              <Image src={curationImage} alt="Píer junto ao lago e à área verde do condomínio" fill quality={90} sizes="(max-width: 800px) 92vw, 42vw" />
              <div className="qdl-floating-note"><Globe2 size={17} /><span>Condomínio planejado<br /><strong>para chegar e aproveitar</strong></span></div>
            </div>
            <div className="qdl-curation-copy">
              <p className="qdl-eyebrow qdl-eyebrow--olive">Família + infraestrutura</p>
              <h2>Um espaço para viver sem preocupações.</h2>
              <p>Enquanto as crianças brincam, você vive o momento. Com asfalto, energia, água, segurança e duas portarias de acesso, tudo fica pronto para você chegar e aproveitar.</p>
              <div className="qdl-service-points">
                <div><ShieldCheck size={19} /><span><strong>Infraestrutura completa</strong><small>Asfalto, energia, água e segurança.</small></span></div>
                <div><MessageCircle size={19} /><span><strong>Família e pets</strong><small>Parque infantil e Pet Place para todos.</small></span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="qdl-broker-section">
          <div className="qdl-container qdl-broker-card">
            <div className="qdl-broker-photo"><Image src="/brand/pedro-portrait-3.png" alt="Pedro Soares, corretor de imóveis" fill sizes="(max-width: 800px) 100vw, 350px" /></div>
            <div className="qdl-broker-copy">
              <p className="qdl-eyebrow">Atendimento personalizado</p>
              <h2>Conheça o Quinta do Lago comigo.</h2>
              <p>Eu vou apresentar o projeto, as áreas de lazer, a infraestrutura e as condições disponíveis para você escolher com tranquilidade.</p>
              <span>Pedro Soares · CRECI 5861-TO</span>
              <a className="qdl-button qdl-button--light" href="#contato">Falar com o corretor <ArrowRight size={17} /></a>
            </div>
          </div>
        </section>

        <section id="contato" className="qdl-contact">
          <div className="qdl-container qdl-contact-grid">
            <div className="qdl-contact-copy">
              <p className="qdl-eyebrow">Primeiro passo</p>
              <h2>Conte o que você procura.</h2>
              <p>Receba a apresentação do condomínio, conheça as áreas de lazer e entenda as condições disponíveis para o seu momento.</p>
              <div className="qdl-contact-assurance"><ShieldCheck size={17} /> Seus dados serão usados apenas para este atendimento.</div>
            </div>
            <QuintaDoLagoLeadForm />
          </div>
        </section>
      </div>

      <footer className="qdl-footer">
        <div className="qdl-container qdl-footer-inner">
          <a className="qdl-wordmark qdl-wordmark--footer" href="#inicio"><span>QUINTA</span><small>DO LAGO</small></a>
          <p>Condomínio de Chácaras · Recanto Santa Luzia/TO</p>
          <span>Pedro Soares · CRECI 5861-TO</span>
        </div>
        <div className="qdl-container qdl-footer-legal">Material de apresentação do Condomínio de Chácaras Recanto Santa Luzia (Quinta do Lago), em Miracema do Tocantins/TO. Imagens ilustrativas. Consulte condições, disponibilidade e documentação atualizadas.</div>
      </footer>

      <a className="qdl-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar com Pedro Soares pelo WhatsApp">
        <MessageCircle size={20} /><span>Fale comigo</span>
      </a>
    </div>
  );
}
