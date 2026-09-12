import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Compass, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { PlantInterestForm } from "@/components/public/plant-interest-form";
import { TrackedWhatsAppLink } from "@/components/public/tracked-whatsapp-link";
import { publicLandingPages } from "@/lib/data/landing-pages";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";
import { getSiteUrl } from "@/lib/site-url";
import styles from "./na-planta.module.css";

const baseUrl = getSiteUrl();
const whatsappMessage = "Olá, Pedro. Quero conhecer imóveis na planta, lançamentos e condomínios em Palmas/TO.";
const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

const faqs = [
  {
    question: "O que são imóveis na planta?",
    answer: "São imóveis comercializados durante a fase de projeto, lançamento ou construção. A escolha deve considerar a planta, a localização, o cronograma e as condições apresentadas pela incorporadora."
  },
  {
    question: "Quais apartamentos na planta estão disponíveis em Palmas?",
    answer: "As opções mudam conforme cada empreendimento e a disponibilidade das unidades. Nesta página você encontra lançamentos selecionados e pode solicitar uma curadoria atualizada pelo WhatsApp ou formulário."
  },
  {
    question: "Vocês também trabalham com terrenos e condomínios em Palmas?",
    answer: "Sim. A curadoria pode incluir terrenos em condomínio, condomínios residenciais e opções para segunda residência, sempre de acordo com o objetivo de compra e a documentação disponível."
  },
  {
    question: "Imóvel na planta é uma boa opção para investir?",
    answer: "Pode fazer sentido para alguns perfis, mas a decisão depende de localização, prazo, liquidez, custo total e estratégia de uso. Eu ajudo a comparar esses pontos antes de avançar."
  },
  {
    question: "O atendimento é apenas em Palmas?",
    answer: "O foco é Palmas/TO, com atendimento para oportunidades no Tocantins. Fale comigo para explicar a cidade, o tipo de imóvel e o momento da compra."
  }
];

const featuredDevelopments = publicLandingPages.slice(0, 9);
const otherDevelopments = publicLandingPages.slice(9);

export const metadata: Metadata = {
  title: "Imóveis na Planta em Palmas | Lançamentos em Palmas/TO",
  description:
    "Encontre imóveis na planta, apartamentos na planta, lançamentos imobiliários, terrenos e condomínios em Palmas/TO e no Tocantins.",
  keywords: [
    "imóveis na planta em Palmas",
    "apartamentos na planta em Palmas",
    "lançamentos imobiliários em Palmas",
    "terrenos e condomínios em Palmas",
    "imóveis no Tocantins",
    "lançamentos em Palmas TO"
  ],
  alternates: { canonical: `${baseUrl}/imoveis/na-planta` },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/imoveis/na-planta`,
    title: "Imóveis na Planta em Palmas | Lançamentos em Palmas/TO",
    description: "Curadoria de lançamentos, apartamentos na planta, terrenos e condomínios em Palmas/TO.",
    images: [{ url: "/brand/home-search-showcase.PNG", alt: "Imóveis e lançamentos imobiliários em Palmas" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Imóveis na Planta em Palmas | Pedro Soares",
    description: "Lançamentos imobiliários, apartamentos na planta, terrenos e condomínios em Palmas/TO."
  }
};

export default function ImoveisNaPlantaPage() {
  const itemList = featuredDevelopments.map((development, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: development.title,
    url: `${baseUrl}${development.href}`
  }));

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Imóveis na Planta em Palmas",
      description: metadata.description,
      url: `${baseUrl}/imoveis/na-planta`,
      inLanguage: "pt-BR",
      about: { "@type": "Place", name: "Palmas, Tocantins" },
      mainEntity: { "@type": "ItemList", itemListElement: itemList }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Imóveis", item: `${baseUrl}/imoveis` },
        { "@type": "ListItem", position: 3, name: "Imóveis na planta", item: `${baseUrl}/imoveis/na-planta` }
      ]
    }
  ];

  return (
    <main className={styles.page}>
      <LandingPageTracker landingPageSlug="imoveis-na-planta" />
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Guia de lançamentos · Palmas e Tocantins</p>
              <h1 className={styles.heroTitle}>Imóveis na planta em Palmas para escolher com mais clareza</h1>
              <p className={styles.heroLead}>
                Encontre apartamentos na planta, lançamentos imobiliários, terrenos e condomínios em Palmas/TO com uma curadoria pensada para o seu objetivo: morar, investir ou encontrar o próximo endereço da sua família.
              </p>
              <div className={styles.heroActions}>
                <TrackedWhatsAppLink className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer" landingPageSlug="imoveis-na-planta" messageTemplate={whatsappMessage}><MessageCircle size={17} /> Falar no WhatsApp</TrackedWhatsAppLink>
                <Link className="button button-ghost" href="#lancamentos">Ver empreendimentos</Link>
              </div>
              <div className={styles.heroProof}><span>Curadoria local</span><span>Palmas/TO</span><span>CRECI 5861-TO</span></div>
            </div>
            <div className={styles.heroMedia}>
              <Image src="/brand/home-search-showcase.PNG" alt="Lançamentos e imóveis residenciais em Palmas" fill priority sizes="(max-width: 900px) 92vw, 52vw" />
              <div className={styles.heroMediaCaption}><span>Escolha seu próximo capítulo</span><strong>Palmas para morar, investir e viver.</strong></div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <nav className={styles.anchorNav} aria-label="Navegação desta página">
          <a href="#por-que">Por que comprar na planta</a><a href="#lancamentos">Lançamentos em Palmas</a><a href="#como-escolher">Como escolher</a><a href="#faq">Perguntas frequentes</a><a href="#atendimento">Falar com Pedro</a>
        </nav>
      </div>

      <section className={styles.section} id="por-que">
        <div className="container"><div className={styles.introGrid}>
          <div className={styles.copy}>
            <p className={styles.sectionEyebrow}>Uma decisão com mais contexto</p>
            <h2 className={styles.sectionTitle}>O melhor lançamento não é igual para todo mundo.</h2>
            <p>Comprar um imóvel na planta envolve olhar além da fachada: entender a região, o desenho da planta, o prazo, o uso que você fará do imóvel e o nível de segurança que precisa para decidir.</p>
            <p>Em Palmas, a busca pode passar por apartamentos próximos à orla, empreendimentos de alto padrão, studios para investir, terrenos em condomínio e projetos em diferentes momentos de lançamento. Eu organizo essas opções para você comparar com calma.</p>
          </div>
          <div className={styles.signalList}>
            <div className={styles.signal}><MapPin size={22} /><div><strong>Localização que combina com sua rotina</strong><span>Compare bairros, acessos, serviços e o entorno de cada projeto.</span></div></div>
            <div className={styles.signal}><Compass size={22} /><div><strong>Planta e projeto no centro da conversa</strong><span>Entenda tipologias, ambientes, implantação e o que realmente importa para seu uso.</span></div></div>
            <div className={styles.signal}><ShieldCheck size={22} /><div><strong>Compra acompanhada do início ao fim</strong><span>Receba informações atualizadas e orientação para avançar com mais segurança.</span></div></div>
          </div>
        </div></div>
      </section>

      <section className={`${styles.section} ${styles.sectionSoft}`}>
        <div className="container">
          <div className={styles.sectionHead}><p className={styles.sectionEyebrow}>Encontre pelo seu momento</p><h2 className={styles.sectionTitle}>Qual tipo de oportunidade você procura?</h2><p className={styles.sectionLead}>Comece pelo objetivo. A partir dele, fica mais simples filtrar localização, tipologia e estágio do empreendimento.</p></div>
          <div className={styles.audienceGrid}>
            <article className={styles.audienceCard}><Building2 size={22} /><h3>Apartamento na planta</h3><p>Studios, apartamentos e residenciais para quem quer planejar a mudança e escolher a planta com antecedência.</p></article>
            <article className={styles.audienceCard}><Compass size={22} /><h3>Lançamento imobiliário</h3><p>Projetos em destaque em Palmas, com arquitetura, lazer e localização para comparar em uma visão só.</p></article>
            <article className={styles.audienceCard}><MapPin size={22} /><h3>Terreno e condomínio</h3><p>Opções para construir, morar ou ter uma segunda residência em condomínios e regiões do Tocantins.</p></article>
          </div>
        </div>
      </section>

      <section className={styles.section} id="lancamentos">
        <div className="container">
          <div className={styles.sectionHead}><p className={styles.sectionEyebrow}>Seleção Pedro Soares</p><h2 className={styles.sectionTitle}>Lançamentos em Palmas e condomínios no Tocantins</h2><p className={styles.sectionLead}>Conheça os empreendimentos em destaque e acesse a página completa de cada projeto para ver informações, diferenciais e atendimento.</p></div>
          <div className={styles.developmentGrid}>
            {featuredDevelopments.map((development) => <article className={styles.developmentCard} key={development.slug}>
              <Link className={styles.developmentMedia} href={development.href} aria-label={`Conhecer ${development.title}`}><Image src={development.image} alt={development.title} fill sizes="(max-width: 620px) 92vw, (max-width: 900px) 45vw, 31vw" /><span className={styles.developmentBadge}>{development.status}</span></Link>
              <div className={styles.developmentBody}><p className={styles.developmentLocation}>{development.location}</p><h3>{development.title}</h3><p>{development.summary}</p><Link className={styles.developmentLink} href={development.href}>Conhecer empreendimento <ArrowRight size={15} /></Link></div>
            </article>)}
          </div>
          <div className={styles.allLaunches} aria-label="Outros empreendimentos relacionados"><span className={styles.sectionEyebrow}>Mais opções:</span>{otherDevelopments.map((development) => <Link key={development.slug} href={development.href}>{development.title}</Link>)}<Link href="/lancamentos">Ver todos os lançamentos <ArrowRight size={14} /></Link></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionSoft}`} id="como-escolher">
        <div className="container"><div className={styles.guideGrid}>
          <div className={styles.sectionHead}><p className={styles.sectionEyebrow}>Guia rápido de compra</p><h2 className={styles.sectionTitle}>Como escolher um imóvel na planta em Palmas?</h2><p className={styles.sectionLead}>Uma boa decisão nasce de perguntas objetivas e informações que façam sentido para o seu orçamento e o seu horizonte.</p><div className={styles.inlineActions} style={{ marginTop: 25 }}><TrackedWhatsAppLink className="button button-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" landingPageSlug="imoveis-na-planta" messageTemplate={whatsappMessage}><MessageCircle size={17} /> Tirar dúvidas no WhatsApp</TrackedWhatsAppLink></div></div>
          <div className={styles.stepsGrid}><article className={styles.stepCard}><span className={styles.stepNumber}>01</span><h3>Defina o objetivo</h3><p>Morar, investir, construir ou ter uma opção para o futuro? O objetivo muda o tipo de projeto que vale a pena comparar.</p></article><article className={styles.stepCard}><span className={styles.stepNumber}>02</span><h3>Compare o projeto</h3><p>Observe planta, localização, diferenciais, prazo e o conjunto de informações do empreendimento.</p></article><article className={styles.stepCard}><span className={styles.stepNumber}>03</span><h3>Converse antes de decidir</h3><p>Receba as condições atualizadas e esclareça os pontos que podem alterar sua escolha.</p></article></div>
        </div></div>
      </section>

      <section className={styles.section} id="faq"><div className="container"><div className={styles.sectionHead}><p className={styles.sectionEyebrow}>Dúvidas comuns</p><h2 className={styles.sectionTitle}>Perguntas frequentes sobre imóveis na planta</h2></div><div className={styles.faqGrid}>{faqs.map((faq) => <details className={styles.faqItem} key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></div></section>

      <section className={`${styles.section} ${styles.contact}`} id="atendimento"><div className="container"><div className={styles.contactGrid}>
        <div className={styles.contactCopy}><p className={styles.eyebrow}>Atendimento personalizado</p><h2 className={styles.contactTitle}>Vamos encontrar o lançamento certo para você?</h2><p className={styles.contactLead}>Envie seu perfil e eu retorno com opções de imóveis na planta, apartamentos, terrenos e condomínios em Palmas ou no Tocantins.</p><div className={styles.broker}><div className={styles.brokerPhoto}><Image src="/brand/pedro-portrait-5.png" alt="Pedro Soares, corretor de imóveis" fill sizes="65px" /></div><div><strong>Pedro Soares</strong><span>Corretor de imóveis · CRECI 5861-TO</span></div></div></div>
        <div className={styles.contactForm}><PlantInterestForm /></div>
      </div></div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="container"><div className={styles.ctaBar}><h2>Prefere falar agora?</h2><TrackedWhatsAppLink className="button button-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" landingPageSlug="imoveis-na-planta" messageTemplate={whatsappMessage}><MessageCircle size={17} /> Falar no WhatsApp</TrackedWhatsAppLink></div></div></section>
    </main>
  );
}
