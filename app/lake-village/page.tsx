import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Building2, ExternalLink, Heart, MapPin, ShieldCheck } from "lucide-react";
import { LakeVillageLeadForm } from "@/components/public/lake-village-lead-form";
import { LakeVillageAudio } from "@/components/public/lake-village-audio";
import { LakeVillagePhotoLightbox } from "@/components/public/lake-village-photo-lightbox";
import { LakeVillageLotMap } from "@/components/public/lake-village-lot-map";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const lakeVillageMapsUrl = "https://maps.app.goo.gl/ELa5XH6aoP4qwpRWA";
const lakeVillageEmbedUrl = "https://www.google.com/maps?q=Lake+Village+Residences,+77.006,+046+-+Luzimangues,+Porto+Nacional+-+TO,+77500-000&t=k&output=embed";
const lakeVillageGallery = [
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-01-masterplan.jpg",
    alt: "Vista aérea do masterplan do Lake Village Residences ao pôr do sol",
    label: "Masterplan",
    caption: "A implantação do projeto, com áreas verdes, vias planejadas e espaços de convivência."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-02-village-pets.jpg",
    alt: "Espaço Village Pets com área gramada, árvores e cercamento",
    label: "Village Pets",
    caption: "Um espaço dedicado à convivência com os animais de estimação."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-03-tenis.jpg",
    alt: "Quadra coberta de tênis do Lake Village Residences",
    label: "Esporte",
    caption: "Quadra coberta para praticar esporte com mais conforto em qualquer horário."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-04-playground.jpg",
    alt: "Playground infantil com brinquedos coloridos e paisagismo",
    label: "Espaço Kids",
    caption: "Área de recreação infantil cercada por árvores e espaços abertos."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-05-monitoramento.jpg",
    alt: "Sala de monitoramento e segurança com telas de vigilância",
    label: "Monitoramento",
    caption: "Estrutura de monitoramento apresentada no material visual do projeto."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-06-lago.jpg",
    alt: "Vista aérea do resort, da praia e do lago junto ao Lake Village",
    label: "Orla e lago",
    caption: "A relação do projeto com o lago, a praia e os espaços de lazer."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-07-piscina.jpg",
    alt: "Piscina com espreguiçadeiras e palmeiras em área de lazer",
    label: "Piscina",
    caption: "Um cenário de descanso para viver os dias com clima de resort."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-08-portaria.jpg",
    alt: "Portaria de acesso do Lake Village ao entardecer",
    label: "Portaria",
    caption: "A chegada ao condomínio com acesso controlado e paisagismo."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-09-salao-jogos.jpg",
    alt: "Salão de jogos com mesas de sinuca e cartas",
    label: "Salão de jogos",
    caption: "Um ambiente interno para reunir amigos e família."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-11-yoga-lago.jpg",
    alt: "Espaço de yoga e meditação junto ao lago, cercado por palmeiras",
    label: "Yoga à beira-lago",
    caption: "Um espaço ao ar livre para bem-estar, movimento e contemplação."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-12-recarga-eletrica.jpg",
    alt: "Vagas com estações de recarga para veículos elétricos",
    label: "Mobilidade elétrica",
    caption: "Infraestrutura de recarga para acompanhar novos hábitos de mobilidade."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-13-village-malls.jpg",
    alt: "Entrada do Village Malls com praça, palmeiras e áreas de convivência",
    label: "Village Malls",
    caption: "Um ponto de encontro com arquitetura, serviços e convivência."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-14-academia.jpg",
    alt: "Academia envidraçada com esteiras e equipamentos de cardio",
    label: "Academia",
    caption: "Um ambiente de treino com vista para o paisagismo e o lago."
  },
  {
    src: "/brand/lake-village/atualizacao-2026-09/foto-10-localizacao.jpg",
    alt: "Mapa ilustrado da localização do Lake Village e dos pontos do entorno",
    label: "Localização",
    caption: "Material visual com portaria, Village School, Village Malls, acesso à TO-080, Resort Five Senses, Ponte Gov. José Wilson e Praia da Graciosa."
  }
] as const;

export const metadata: Metadata = {
  title: "Lake Village Residences | Vendas abertas em Luzimangues",
  description: "Vendas abertas no Lake Village Residences, condomínio fechado à beira do lago em Luzimangues, com lotes, lazer e atendimento de Pedro Soares.",
  alternates: { canonical: `${siteUrl}/lake-village` },
  openGraph: {
    title: "Lake Village Residences | Vendas abertas em Luzimangues",
    description: "Consulte lotes, estrutura, localização e condições do Lake Village Residences com atendimento direto de Pedro Soares.",
    type: "website",
    url: `${siteUrl}/lake-village`,
    images: [{ url: `${siteUrl}${lakeVillageGallery[0].src}` }]
  }
};

export default function LakeVillagePage() {
  return (
    <div className="lake-landing lake-landing--broker">
      <LandingPageTracker landingPageSlug="lake-village" />
      <section className="lake-hero">
        <Image
          src={lakeVillageGallery[0].src}
          alt={lakeVillageGallery[0].alt}
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
          <p className="lake-personal-brand">Pedro Soares · Atendimento imobiliário</p>
          <p className="lake-kicker">Vendas abertas · Lake Village Residences · Luzimangues/TO</p>
          <h1>Um endereço para viver o lago todos os dias.</h1>
          <p className="lake-hero-lede">
            As vendas estão abertas. Conheça os lotes e a proposta de um condomínio fechado à beira-lago, com natureza, lazer e espaços pensados para toda a família.
          </p>
          <div className="lake-hero-actions">
            <a className="lake-button lake-button--gold" href="#cadastro">
              Quero receber informações <ArrowRight size={18} />
            </a>
            <a className="lake-button lake-button--outline" href="#localizacao">
              Ver localização
            </a>
          </div>
          <p className="lake-developer-line">Vendas abertas · Imagens ilustrativas · Disponibilidade e condições mediante consulta.</p>
        </div>
        <a className="lake-scroll-cue" href="#sobre" aria-label="Conheça a página de atendimento">
          <span>Conheça o projeto</span>
          <ArrowDown size={18} />
        </a>
      </section>

      <section className="lake-broker-notice" aria-label="Aviso sobre as informações">
        <div className="container">
          <strong>Vendas abertas</strong>
          <p>Esta é uma página de atendimento de Pedro Soares. As vendas do Lake Village estão abertas; lotes, disponibilidade, valores e condições comerciais devem ser confirmados no atendimento.</p>
        </div>
      </section>

      <section className="lake-facts-strip" aria-label="Destaques do Lake Village">
        <div className="container lake-facts-grid lake-facts-grid--broker">
          <div><strong>Vendas abertas</strong><span>Consulte lotes e condições</span></div>
          <div><strong>250 a 860 m²</strong><span>Tamanhos indicados no mapa</span></div>
          <div><strong>1.353 lotes</strong><span>Implantação do empreendimento</span></div>
        </div>
      </section>

      <section id="sobre" className="lake-section lake-section--light">
        <div className="container lake-intro-grid">
          <div>
            <p className="lake-kicker lake-kicker--dark">Lake Village Residences</p>
            <h2>Uma vida mais perto da água, do verde e das pessoas.</h2>
            <p>
              O Lake Village Residences é um projeto localizado em Luzimangues, às margens do lago de Palmas. A proposta combina a tranquilidade de um condomínio fechado com áreas de lazer, convivência e contato com a natureza.
            </p>
            <p>
              No material visual, o entorno aparece conectado à TO-080, ao Resort Five Senses, à Ponte Gov. José Wilson e à Praia da Graciosa. Com as vendas abertas, eu confirmo os lotes, valores, condições e disponibilidade no atendimento.
            </p>
            <a className="lake-text-link" href="#cadastro">Cadastrar meu interesse <ArrowRight size={16} /></a>
          </div>
          <div className="lake-broker-card">
            <div className="lake-broker-photo">
              <Image src="/brand/pedro-portrait-3.png" alt="Pedro Soares, corretor de imóveis" fill sizes="(max-width: 800px) 100vw, 420px" />
            </div>
            <div className="lake-broker-copy">
              <p className="lake-kicker">Atendimento personalizado</p>
              <h3>Fale comigo sobre o Lake Village.</h3>
              <p>Eu apresento os lotes e materiais disponíveis, esclareço suas dúvidas e acompanho os próximos passos da compra.</p>
              <span>Pedro Soares · CRECI 5861-TO</span>
            </div>
          </div>
        </div>
      </section>

      <section className="lake-project-section lake-project-section--paper">
        <div className="container lake-project-grid">
          <LakeVillagePhotoLightbox
            src={lakeVillageGallery[0].src}
            alt={lakeVillageGallery[0].alt}
            label="Vista geral do projeto"
            caption={lakeVillageGallery[0].caption}
          >
            <div className="lake-project-image">
              <Image src={lakeVillageGallery[0].src} alt={lakeVillageGallery[0].alt} fill sizes="(max-width: 860px) 100vw, 55vw" />
              <span>Masterplan, áreas verdes e espaços de convivência.</span>
            </div>
          </LakeVillagePhotoLightbox>
          <div className="lake-project-copy">
            <p className="lake-kicker lake-kicker--dark">Receba o material certo</p>
            <h2>O projeto começa pela experiência.</h2>
            <p>As novas imagens mostram uma proposta completa: chegada com portaria, espaços para crianças e pets, esporte, lazer junto ao lago e ambientes para reunir a família. Ao deixar seu contato, eu apresento o material disponível e confirmo os detalhes comerciais.</p>
            <div className="lake-safe-card-grid">
              <article className="lake-safe-card"><Building2 size={19} /><strong>Convivência</strong><span>Espaços para família, crianças, pets e amigos.</span></article>
              <article className="lake-safe-card"><MapPin size={19} /><strong>Localização</strong><span>Luzimangues, perto dos principais pontos destacados no mapa.</span></article>
              <article className="lake-safe-card"><ShieldCheck size={19} /><strong>Atendimento</strong><span>Converse diretamente antes de tomar uma decisão.</span></article>
            </div>
            <a className="lake-text-link" href="#cadastro">Quero conversar sobre o projeto <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <section className="lake-section lake-section--deep">
        <div className="container">
          <div className="lake-section-heading">
            <p className="lake-kicker">Estrutura e lazer</p>
            <h2>Do primeiro mergulho ao fim de tarde com os amigos.</h2>
            <p>O Lake Village reúne cenários para desacelerar, praticar esporte, cuidar do corpo, brincar e aproveitar o lago. As imagens são ilustrativas e representam a proposta apresentada nos materiais recebidos.</p>
          </div>
          <div className="lake-feature-split lake-feature-split--broker">
            <LakeVillagePhotoLightbox
              src={lakeVillageGallery[5].src}
              alt={lakeVillageGallery[5].alt}
              label={lakeVillageGallery[5].label}
              caption={lakeVillageGallery[5].caption}
            >
              <div className="lake-feature-image">
                <Image src={lakeVillageGallery[5].src} alt={lakeVillageGallery[5].alt} fill sizes="(max-width: 860px) 100vw, 58vw" />
              </div>
            </LakeVillagePhotoLightbox>
            <div className="lake-feature-copy">
              <span>Orla e lazer</span>
              <h3>Um cenário para morar, descansar e compartilhar.</h3>
              <p>Conheça a proposta visual do lago, da piscina, da praia e dos ambientes de convivência antes de conversar sobre disponibilidade.</p>
            </div>
          </div>
          <div className="lake-amenities-cta lake-amenities-cta--broker">
            <p>Quer consultar lotes, valores e condições?</p>
            <a className="lake-text-link lake-text-link--light" href="#cadastro">Falar sobre disponibilidade <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <section className="lake-section lake-gallery-section" aria-labelledby="lake-gallery-heading">
        <div className="container">
          <div className="lake-gallery-heading">
            <div>
              <p className="lake-kicker lake-kicker--dark">Galeria atualizada</p>
              <h2 id="lake-gallery-heading">Uma visão mais completa do Lake Village.</h2>
            </div>
            <p>Explore as 14 imagens recebidas: masterplan, lazer, segurança, bem-estar, mobilidade, convivência e localização. Clique em qualquer foto para ampliar.</p>
          </div>
          <div className="lake-gallery-grid lake-gallery-grid--updated">
            {lakeVillageGallery.map((photo) => (
              <LakeVillagePhotoLightbox key={photo.src} src={photo.src} alt={photo.alt} label={photo.label} caption={photo.caption}>
                <figure className="lake-gallery-card">
                  <div className="lake-gallery-image">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 620px) 100vw, (max-width: 860px) 50vw, 33vw" />
                  </div>
                  <figcaption>
                    <span>{photo.label}</span>
                    <strong>{photo.caption}</strong>
                  </figcaption>
                </figure>
              </LakeVillagePhotoLightbox>
            ))}
          </div>
        </div>
      </section>

      <section id="mapa-lotes" className="lake-section lake-lot-map-section" aria-labelledby="lake-lot-map-heading">
        <div className="container">
          <div className="lake-section-heading lake-section-heading--dark">
            <p className="lake-kicker lake-kicker--dark">Mapa do empreendimento</p>
            <h2 id="lake-lot-map-heading">Escolha seu lote olhando o projeto inteiro.</h2>
            <p>Veja a implantação completa do Lake Village com todos os lotes visíveis e amplie para conferir quadras, referências e áreas de lazer.</p>
          </div>
          <LakeVillageLotMap />
        </div>
      </section>

      <section id="localizacao" className="lake-section lake-location lake-location--map">
        <div className="lake-location-copy">
          <p className="lake-kicker lake-kicker--dark"><MapPin size={15} /> Luzimangues · Porto Nacional/TO</p>
          <h2>À beira do lago, perto de Palmas.</h2>
          <p>O Lake Village está em Luzimangues, Porto Nacional/TO, às margens do lago de Palmas. O mapa do material recebido destaca a portaria, o Village School, o Village Malls, o acesso à TO-080, o Resort Five Senses, a Ponte Gov. José Wilson e a Praia da Graciosa.</p>
          <p className="lake-location-note">A imagem de localização é ilustrativa. Consulte a rota e confirme distâncias, acessos e referências no atendimento.</p>
          <div className="lake-location-actions">
            <a className="lake-button lake-button--deep" href={lakeVillageMapsUrl} target="_blank" rel="noreferrer">
              Ver localização <ExternalLink size={16} />
            </a>
            <a className="lake-text-link" href="#cadastro">Falar com Pedro <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="lake-map-card">
          <iframe title="Mapa da localização informada para o Lake Village Residences" src={lakeVillageEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="lake-map-caption"><MapPin size={15} /><span>Localização informada para o Lake Village Residences · Luzimangues, Porto Nacional/TO</span></div>
        </div>
      </section>

      <section id="cadastro" className="lake-section lake-lead-section">
        <div className="container lake-lead-grid">
          <div className="lake-lead-copy">
            <p className="lake-kicker">Cadastro de interesse</p>
            <h2>Consulte lotes e condições do Lake Village.</h2>
            <p>Deixe seus dados e eu entrarei em contato para entender o que você procura, confirmar a disponibilidade e enviar os materiais comerciais vigentes.</p>
            <div className="lake-lead-points">
              <span><ShieldCheck size={17} /> Atendimento direto com Pedro Soares</span>
              <span><Building2 size={17} /> Lotes conforme disponibilidade</span>
              <span><Heart size={17} /> Orientação para morar ou investir</span>
            </div>
            <Link href="/lake-village/pre-cadastro" className="lake-lead-secondary-link">Prefere fazer um cadastro completo? <ArrowRight size={15} /></Link>
          </div>
          <LakeVillageLeadForm />
        </div>
      </section>

      <section className="lake-final-cta">
        <div className="container">
          <p className="lake-kicker">Lake Village Residences</p>
          <h2>As vendas estão abertas. Escolha seu lote e fale comigo.</h2>
          <a className="lake-button lake-button--gold" href="#mapa-lotes">Ver mapa de lotes <ArrowRight size={18} /></a>
        </div>
      </section>
    </div>
  );
}
