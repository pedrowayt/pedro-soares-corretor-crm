import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowRight, BadgeCheck, Building2, CalendarDays, Clock3, CreditCard, Dumbbell, ExternalLink, Heart, Landmark, MapPin, Route, Ruler, ShieldCheck, TreePine, Users, Waves } from "lucide-react";
import { LakeVillageLeadForm } from "@/components/public/lake-village-lead-form";
import { LakeVillageAudio } from "@/components/public/lake-village-audio";
import { LakeVillagePhotoLightbox } from "@/components/public/lake-village-photo-lightbox";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

const lakeVillageMapsUrl = "https://maps.app.goo.gl/ELa5XH6aoP4qwpRWA";
const capimDouradoRouteUrl = "https://www.google.com/maps/dir/Lake+Village+Residences,+Luzimangues,+Porto+Nacional+-+TO/Capim+Dourado+Shopping,+Palmas+-+TO";
const lakeVillageEmbedUrl = "https://www.google.com/maps?q=Lake+Village+Residences,+77.006,+046+-+Luzimangues,+Porto+Nacional+-+TO,+77500-000&t=k&output=embed";

export const metadata: Metadata = {
  title: "Lake Village Residences | Beira-lago é seu novo endereço",
  description:
    "Conheça os lotes de 250 m² a 860 m², a Etapa 1 com 441 lotes, o clube-resort e as condições do Lake Village Residences com Pedro Soares.",
  alternates: { canonical: `${siteUrl}/lake-village` },
  openGraph: {
    title: "Lake Village Residences | Beira-lago é seu novo endereço",
    description: "Receba valores, disponibilidade e condições da Etapa 1 do Lake Village Residences.",
    type: "website",
    url: `${siteUrl}/lake-village`,
    images: [{ url: `${siteUrl}/brand/lake-village/aerea.jpg` }]
  }
};

const amenityGroups = [
  {
    icon: Waves,
    number: "01",
    eyebrow: "Clube-resort à beira-lago",
    title: "O coração do bairro nasce na Etapa 1.",
    text: "Um clube para transformar os dias comuns em uma experiência de férias, com lazer, gastronomia e bem-estar a poucos passos de casa.",
    items: ["Salão de festas", "Restaurante", "Academia em dois pavimentos", "Rooftop", "Deck de piscina de 2.013 m²", "SPA e sauna", "Salão de jogos", "8 poolhouses"]
  },
  {
    icon: Dumbbell,
    number: "02",
    eyebrow: "Complexo esportivo",
    title: "Esporte o ano inteiro, protegido do sol.",
    text: "Estrutura para quem gosta de se movimentar, competir, brincar e fazer do condomínio uma extensão da própria rotina.",
    items: ["Tênis coberto", "Beach tennis coberta", "Campo society", "Quadra poliesportiva", "Basquete", "Pickleball"]
  },
  {
    icon: Heart,
    number: "03",
    eyebrow: "Quadras descobertas e futmesa",
    title: "Fim de tarde para compartilhar.",
    text: "A vida ao ar livre ganha espaço com quadras, jogos e pontos de encontro para estar junto em todos os ritmos.",
    items: ["4 quadras de beach tennis e vôlei", "Futmesa", "2 quiosques com churrasqueira"]
  },
  {
    icon: Users,
    number: "04",
    eyebrow: "Espaço Pet",
    title: "Um bairro que acolhe a família inteira.",
    text: "Uma área temática integrada ao corredor verde para que os animais também tenham liberdade, cuidado e novos caminhos para explorar.",
    items: ["Espaço Pet", "Corredor verde", "Áreas abertas de convivência"]
  },
  {
    icon: Building2,
    number: "05",
    eyebrow: "Espaço Kids",
    title: "Infância com espaço para acontecer.",
    text: "Recreação infantil dentro do condomínio, com paisagismo desenhado para brincar, descobrir e criar memórias com autonomia.",
    items: ["Espaço Kids", "Recreação infantil", "Paisagismo integrado"]
  },
  {
    icon: TreePine,
    number: "06",
    eyebrow: "Orla, píer e ciclovia",
    title: "650 metros para viver o lago de perto.",
    text: "Calçadão integrado à ciclovia, estação de bicicletas, espaço zen, yoga e um píer de madeira para contemplar cada pôr do sol.",
    items: ["650 m de orla", "Píer de madeira", "Ciclovia", "Estação de bicicletas", "Espaço zen", "Yoga"]
  },
  {
    icon: Landmark,
    number: "07",
    eyebrow: "Bloco administrativo",
    title: "Praticidade no próprio bairro.",
    text: "Sala de reuniões e atendimento ao morador dentro do condomínio para resolver o dia a dia sem abrir mão da tranquilidade.",
    items: ["Sala de reuniões", "Atendimento aos moradores", "Bloco administrativo"]
  },
  {
    icon: ShieldCheck,
    number: "08",
    eyebrow: "Guarita e acesso controlado",
    title: "Segurança que se percebe sem aparecer.",
    text: "Uma chegada organizada, monitorada e preparada para receber moradores e visitantes com conforto desde o primeiro momento.",
    items: ["11 pistas de acesso", "Vão coberto", "Automação", "Monitoramento"]
  }
];

export default function LakeVillagePage() {
  return (
    <div className="lake-landing">
      <LandingPageTracker landingPageSlug="lake-village" />
      <section className="lake-hero">
        <Image
          src="/brand/lake-village/clube.jpg"
          alt="Clube-resort do Lake Village Residences ao entardecer"
          fill
          priority
          sizes="100vw"
          className="lake-hero-image"
        />
        <div className="lake-hero-overlay" />
        <LakeVillageAudio />
        <div className="container lake-hero-content">
          <Image
            className="lake-brand-lockup"
            src="/brand/lake-village-logo.png"
            alt="Lake Village Residences"
            width={460}
            height={230}
            priority
          />
          <p className="lake-kicker">Empreendimento · Lote em condomínio · Vendas abertas · Etapa 1 em comercialização</p>
          <h1>Beira-lago é seu novo endereço.</h1>
          <p className="lake-hero-lede">
            Receba a apresentação, a tabela de valores e a disponibilidade dos lotes à beira do Lago de Palmas.
          </p>
          <div className="lake-hero-actions">
            <a className="lake-button lake-button--gold" href="#cadastro">
              Receber valores e disponibilidade <ArrowRight size={18} />
            </a>
            <a className="lake-button lake-button--outline" href="#cadastro">
              Receber informações no WhatsApp
            </a>
          </div>
          <p className="lake-developer-line">Um produto Nova Bairros Planejados</p>
        </div>
        <a className="lake-scroll-cue" href="#experiencia" aria-label="Conheça o empreendimento">
          <span>Conheça o projeto</span>
          <ArrowDown size={18} />
        </a>
      </section>

      <section className="lake-facts-strip" aria-label="Números do Lake Village">
        <div className="container lake-facts-grid">
          <div><strong>650 m</strong><span>de orla privativa</span></div>
          <div><strong>1.349</strong><span>lotes residenciais</span></div>
          <div><strong>731.766,95 m²</strong><span>de área total</span></div>
          <div><strong>8</strong><span>áreas de convivência</span></div>
        </div>
      </section>

      <section id="experiencia" className="lake-section lake-section--light">
        <div className="container lake-intro-grid">
          <div>
            <p className="lake-kicker lake-kicker--dark">Uma nova maneira de viver</p>
            <h2>O lugar onde a vida que você deseja já começa a acontecer.</h2>
            <p>
              O Lake Village é um condomínio fechado às margens do lago de Palmas, em Luzimangues, ao lado do Five Senses Resort e a aproximadamente 15 minutos do Shopping Capim Dourado.
            </p>
            <p>
              Um projeto para quem valoriza segurança, exclusividade, conforto e a tranquilidade de ter uma orla privativa como parte da rotina.
            </p>
            <a className="lake-text-link" href="#cadastro">Receber apresentação completa <ArrowRight size={16} /></a>
          </div>
          <div className="lake-broker-card">
            <div className="lake-broker-photo">
              <Image src="/brand/pedro-portrait-3.png" alt="Pedro Soares, corretor de imóveis" fill sizes="(max-width: 800px) 100vw, 420px" />
            </div>
            <div className="lake-broker-copy">
              <p className="lake-kicker">Atendimento personalizado</p>
              <h3>Conheça o Lake Village comigo.</h3>
              <p>Eu vou apresentar as opções disponíveis e ajudar você a encontrar o melhor caminho para morar ou investir.</p>
              <span>Pedro Soares · CRECI 5861-TO</span>
            </div>
          </div>
        </div>
      </section>

      <section className="lake-project-section lake-project-section--paper">
        <div className="container lake-project-grid">
          <LakeVillagePhotoLightbox
            src="/brand/lake-village/aerea.jpg"
            alt="Vista aérea do Lake Village Residences, sua orla e o Lago de Palmas"
            label="Vista aérea do empreendimento"
            caption="Uma gleba à beira-lago que não se repete."
          >
            <div className="lake-project-image">
              <Image
                src="/brand/lake-village/aerea.jpg"
                alt="Vista aérea do Lake Village Residences, sua orla e o Lago de Palmas"
                fill
                sizes="(max-width: 860px) 100vw, 55vw"
              />
              <span>Uma gleba à beira-lago que não se repete.</span>
            </div>
          </LakeVillagePhotoLightbox>
          <div className="lake-project-copy">
            <p className="lake-kicker lake-kicker--dark">O projeto em escala</p>
            <h2>O lago define o traçado. A vida define o ritmo.</h2>
            <p>
              São lotes de <strong>250 m² a 860 m²</strong>, distribuídos em um bairro planejado para aproximar as casas da água, do verde e de uma estrutura completa de convivência.
            </p>
            <div className="lake-project-facts">
              <div><Ruler size={18} /><strong>250 a 860 m²</strong><span>tamanhos de lotes</span></div>
              <div><CalendarDays size={18} /><strong>Etapa 1</strong><span>441 lotes nas quadras 01 a 21</span></div>
            </div>
            <a className="lake-text-link" href="#cadastro">Conhecer a Etapa 1 <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <section id="estrutura" className="lake-section lake-section--deep">
        <div className="container">
          <div className="lake-section-heading">
            <p className="lake-kicker">8 áreas de convivência</p>
            <h2>O quintal pode ser uma orla e a vizinhança, um clube.</h2>
            <p>O clube-resort à beira-lago é o coração do bairro e já está previsto na Etapa 1, junto com uma estrutura pensada para todas as idades.</p>
          </div>
          <div className="lake-feature-split">
            <LakeVillagePhotoLightbox
              src="/brand/lake-village/clube.jpg"
              alt="Clube-resort do Lake Village Residences ao entardecer"
              label="Clube-resort à beira-lago"
              caption="O coração do empreendimento nasce junto com os primeiros lotes."
            >
              <div className="lake-feature-image">
                <Image
                  src="/brand/lake-village/clube.jpg"
                  alt="Clube-resort do Lake Village Residences ao entardecer"
                  fill
                  sizes="(max-width: 860px) 100vw, 58vw"
                />
              </div>
            </LakeVillagePhotoLightbox>
            <div className="lake-feature-copy">
              <span>Clube-resort · entregue na Etapa 1</span>
              <h3>O coração do empreendimento nasce junto com os primeiros lotes.</h3>
              <p>Salão de festas, restaurante, academia em dois pavimentos, rooftop, deck de piscina de 2.013 m², SPA, sauna, salão de jogos e 8 poolhouses.</p>
            </div>
          </div>
          <div className="lake-amenities-grid" aria-label="Estrutura e lazer previstos para o Lake Village">
            {amenityGroups.map(({ icon: Icon, number, eyebrow, title, text, items }) => (
              <article className="lake-amenity-card" key={title}>
                <span className="lake-amenity-number">{number}</span>
                <Icon size={23} strokeWidth={1.5} />
                <p className="lake-amenity-eyebrow">{eyebrow}</p>
                <h3>{title}</h3>
                <p>{text}</p>
                <ul className="lake-amenity-list">
                  {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
          <div className="lake-amenities-cta">
            <p>Um novo endereço para morar, investir e aproveitar a vida com mais presença.</p>
            <a className="lake-text-link lake-text-link--light" href="#cadastro">Quero receber a apresentação completa <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <section className="lake-section lake-gallery-section lake-gallery-section--visuals">
        <div className="container">
          <div className="lake-gallery-heading">
            <div>
              <p className="lake-kicker lake-kicker--dark">Um convite para viver bem</p>
              <h2>Um endereço que começa pela experiência.</h2>
            </div>
            <p>Uma orla privativa, um clube-resort e um masterplan pensado para viver a paisagem — não apenas olhar para ela.</p>
          </div>
          <div className="lake-media-grid">
            <figure className="lake-gallery-card lake-gallery-card--wide">
              <LakeVillagePhotoLightbox
                src="/brand/lake-village/orla.jpg"
                alt="Orla, clube-resort, praia e píer do Lake Village"
                label="Orla privativa, praia e píer"
                caption="650 metros para caminhar, pedalar e desacelerar."
              >
                <div className="lake-gallery-image">
                  <Image
                    src="/brand/lake-village/orla.jpg"
                    alt="Orla, clube-resort, praia e píer do Lake Village"
                    fill
                    sizes="(max-width: 860px) 100vw, 50vw"
                  />
                </div>
              </LakeVillagePhotoLightbox>
              <figcaption>
                <span>Orla privativa</span>
                <strong>650 metros para caminhar, pedalar e desacelerar.</strong>
              </figcaption>
            </figure>
            <figure className="lake-gallery-card">
              <LakeVillagePhotoLightbox
                src="/brand/lake-village/masterplan.jpg"
                alt="Masterplan do Lake Village Residences"
                label="Masterplan do Lake Village"
                caption="Um bairro desenhado ao redor do lago."
              >
                <div className="lake-gallery-image">
                  <Image
                    src="/brand/lake-village/masterplan.jpg"
                    alt="Masterplan do Lake Village Residences"
                    fill
                    sizes="(max-width: 860px) 100vw, 25vw"
                  />
                </div>
              </LakeVillagePhotoLightbox>
              <figcaption>
                <span>Masterplan</span>
                <strong>Um bairro desenhado ao redor do lago.</strong>
              </figcaption>
            </figure>
            <figure className="lake-gallery-card">
              <LakeVillagePhotoLightbox
                src="/brand/lake-village/lotes-planta.jpg"
                alt="Implantação dos lotes do Lake Village Residences"
                label="Implantação dos lotes"
                caption="Etapa 1 · quadras 01 a 21."
              >
                <div className="lake-gallery-image">
                  <Image
                    src="/brand/lake-village/lotes-planta.jpg"
                    alt="Implantação dos lotes do Lake Village Residences"
                    fill
                    sizes="(max-width: 860px) 100vw, 25vw"
                  />
                </div>
              </LakeVillagePhotoLightbox>
              <figcaption>
                <span>Etapa 1</span>
                <strong>441 lotes nas quadras 01 a 21.</strong>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="etapas" className="lake-stage-section">
        <div className="container lake-stage-grid">
          <div className="lake-stage-copy">
            <p className="lake-kicker lake-kicker--dark">Em comercialização</p>
            <h2>Etapa 1, à beira do lago.</h2>
            <p>São <strong>441 lotes</strong> nas quadras 01 a 21, na porção junto à orla. É a etapa que já prevê a guarita com acesso controlado, o bloco administrativo, o Espaço Kids e, principalmente, o clube-resort completo.</p>
            <p>Quem compra agora não espera as fases seguintes para viver o coração do bairro: ele nasce junto com as primeiras casas.</p>
            <a className="lake-button lake-button--deep" href="#cadastro">Receber simulação <ArrowRight size={16} /></a>
          </div>
          <LakeVillagePhotoLightbox
            src="/brand/lake-village/lotes-planta.jpg"
            alt="Planta aérea dos lotes e áreas de convivência da Etapa 1"
            label="Planta dos lotes da Etapa 1"
            caption="Etapa 1 · quadras 01 a 21."
          >
            <div className="lake-stage-image">
              <Image
                src="/brand/lake-village/lotes-planta.jpg"
                alt="Planta aérea dos lotes e áreas de convivência da Etapa 1"
                fill
                sizes="(max-width: 860px) 100vw, 52vw"
              />
              <span>Etapa 1 · quadras 01 a 21</span>
            </div>
          </LakeVillagePhotoLightbox>
        </div>
      </section>

      <section id="aquisicao" className="lake-acquisition-section">
        <div className="container">
          <div className="lake-section-heading lake-section-heading--light">
            <p className="lake-kicker">Formas de aquisição</p>
            <h2>Seu lote à beira-lago em até 180 meses.</h2>
            <p>Condições comerciais para a Etapa 1, com atendimento direto e orientação para encontrar o lote que faz sentido para o seu momento.</p>
          </div>
          <div className="lake-acquisition-grid">
            <article><CreditCard size={22} /><span>Até 180 meses</span><h3>Plano exclusivo em 180x</h3><p>Parcelamento próprio para tornar o endereço à beira-lago mais acessível ao planejamento da sua família.</p></article>
            <article><BadgeCheck size={22} /><span>Primeira etapa</span><h3>441 lotes na Etapa 1</h3><p>Uma oportunidade de escolher na fase que concentra a orla, o clube-resort e os principais equipamentos.</p></article>
            <article><ShieldCheck size={22} /><span>Direto com a loteadora</span><h3>Processo desburocratizado</h3><p>A aprovação é feita diretamente com a loteadora, conforme as condições comerciais vigentes.</p></article>
          </div>
          <a className="lake-text-link lake-text-link--light" href="#cadastro">Receber condições e disponibilidade <ArrowRight size={16} /></a>
        </div>
      </section>

      <section id="autoria" className="lake-authorship-section">
        <div className="container">
          <div className="lake-section-heading lake-section-heading--dark">
            <p className="lake-kicker lake-kicker--dark">Projeto com autoria</p>
            <h2>Cada decisão tem nome, assinatura e responsabilidade técnica.</h2>
            <p>O lago define o traçado, o paisagismo e o ritmo da vida dentro do bairro.</p>
          </div>
          <div className="lake-authorship-grid">
            <article><Landmark size={24} /><span>Arquitetura e Urbanismo</span><h3>Alisson Miguel</h3><p>Arquiteto e urbanista formado pela UFT, CAU A97721-7, responsável técnico pelo projeto e pelo memorial descritivo do Lake Village.</p></article>
            <article><TreePine size={24} /><span>Paisagismo</span><h3>Míriam Coelho</h3><p>Projeto paisagístico direcionado ao clima do Tocantins, à orla e aos corredores verdes, com foco em sombra, conforto térmico e convivência.</p></article>
          </div>
        </div>
      </section>

      <section className="lake-developer-section">
        <div className="container lake-developer-grid">
          <div>
            <p className="lake-kicker lake-kicker--dark">A urbanizadora</p>
            <h2>O Lake Village é um produto Nova Bairros.</h2>
            <p>Uma urbanizadora com 15 anos de trajetória, mais de 50 mil clientes atendidos e mais de 28 bairros lançados em 6 estados e no Distrito Federal.</p>
          </div>
          <div className="lake-developer-stats">
            <div><strong>15</strong><span>anos de trajetória</span></div>
            <div><strong>+50 mil</strong><span>clientes atendidos</span></div>
            <div><strong>+28</strong><span>bairros lançados</span></div>
            <div><strong>6 estados</strong><span>e o Distrito Federal</span></div>
          </div>
        </div>
      </section>

      <section id="localizacao" className="lake-section lake-location lake-location--map">
        <div className="lake-location-copy">
          <p className="lake-kicker lake-kicker--dark"><MapPin size={15} /> Luzimangues · Palmas/TO</p>
          <h2>À beira do lago, perto da cidade.</h2>
          <p>O Lake Village fica em Luzimangues, às margens do lago de Palmas, em uma localização que combina natureza, tranquilidade e acesso prático à capital.</p>
          <p>O projeto fica a aproximadamente 15 minutos do Shopping Capim Dourado e do Palácio Araguaia, ao lado do Five Senses Resort.</p>
          <div className="lake-location-facts" aria-label="Referências de acesso">
            <div>
              <Route size={19} />
              <strong>15 min</strong>
              <span>até o Shopping Capim Dourado</span>
            </div>
            <div>
              <Clock3 size={19} />
              <strong>15 min</strong>
              <span>até o Palácio Araguaia</span>
            </div>
          </div>
          <p className="lake-location-note">Tempo aproximado divulgado para referência; pode variar conforme o ponto de saída e as condições do trânsito.</p>
          <div className="lake-location-actions">
            <a className="lake-button lake-button--deep" href={lakeVillageMapsUrl} target="_blank" rel="noreferrer">
              Ver localização <ExternalLink size={16} />
            </a>
            <a className="lake-text-link" href={capimDouradoRouteUrl} target="_blank" rel="noreferrer">
              Ver rota até o shopping <ArrowRight size={16} />
            </a>
          </div>
        </div>
        <div className="lake-map-card">
          <iframe
            title="Mapa em visão de satélite da localização do Lake Village Residences"
            src={lakeVillageEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="lake-map-caption">
            <MapPin size={15} />
            <span>Lake Village Residences · 77.006, 046 · Luzimangues, Porto Nacional/TO</span>
          </div>
        </div>
      </section>

      <section className="lake-technical-section">
        <div className="container lake-technical-grid">
          <div>
            <p className="lake-kicker lake-kicker--dark">Ficha técnica</p>
            <h2>Um projeto registrado para você comprar com clareza.</h2>
            <p>Consulte a documentação e receba a apresentação completa com o atendimento de Pedro Soares.</p>
          </div>
          <dl className="lake-technical-list">
            <div><dt>Área total</dt><dd>731.766,95 m²</dd></div>
            <div><dt>Lotes residenciais</dt><dd>1.349</dd></div>
            <div><dt>Matrícula</dt><dd>2.460 · R.3-2460</dd></div>
            <div><dt>Registro</dt><dd>14/04/2026</dd></div>
            <div><dt>Decreto municipal</dt><dd>1.424/2025</dd></div>
            <div><dt>Empreendimento</dt><dd>Santa Helena Doze Empreendimentos Imobiliários SPE Ltda.</dd></div>
          </dl>
        </div>
      </section>

      <section id="cadastro" className="lake-section lake-lead-section">
        <div className="container lake-lead-grid">
          <div className="lake-lead-copy">
            <p className="lake-kicker">Vendas abertas · Etapa 1</p>
            <h2>Receba valores, disponibilidade e a apresentação completa.</h2>
            <p>Deixe seus dados e eu entrarei em contato para apresentar os lotes de 250 m² a 860 m², as plantas e as condições de aquisição.</p>
            <div className="lake-lead-points">
              <span><ShieldCheck size={17} /> Atendimento direto com Pedro Soares</span>
              <span><Building2 size={17} /> Plantas e condições atualizadas</span>
              <span><Heart size={17} /> Orientação para morar ou investir</span>
            </div>
          </div>
          <LakeVillageLeadForm />
        </div>
      </section>

      <section className="lake-final-cta">
        <div className="container">
          <Image
            className="lake-final-logo"
            src="/brand/lake-village-logo.png"
            alt="Lake Village Residences"
            width={360}
            height={180}
          />
          <p className="lake-kicker">Lake Village Residences</p>
          <h2>O Lake Village abre as portas para o seu próximo capítulo.</h2>
          <a className="lake-button lake-button--gold" href="#cadastro">Entrar na lista de interesse <ArrowRight size={18} /></a>
        </div>
      </section>

    </div>
  );
}
