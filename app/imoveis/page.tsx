import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { publicLandingPages } from "@/lib/data/landing-pages";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();
const pageTitle = "Imóveis em Palmas TO | Lançamentos e casas";
const pageDescription =
  "Encontre imóveis em Palmas TO: lançamentos, casas em condomínio, imóveis prontos e na planta. Compare bairros e fale com Pedro Soares.";
const whatsappUrl =
  "https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20encontrar%20um%20im%C3%B3vel%20em%20Palmas.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "imóveis em Palmas TO",
    "lançamentos em Palmas",
    "casas em condomínio em Palmas",
    "imóveis na planta em Palmas",
    "imóveis prontos Palmas",
    "casas à venda em Palmas",
    "apartamentos em Palmas",
    "imobiliária em Palmas TO"
  ],
  alternates: {
    canonical: `${baseUrl}/imoveis`
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${baseUrl}/imoveis`,
    title: pageTitle,
    description: pageDescription,
    images: [{ url: "/brand/home-search-showcase.PNG", alt: "Imóveis e lançamentos em Palmas TO" }]
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription
  }
};

const discoveryCards = [
  {
    href: "/lancamentos",
    eyebrow: "Novos projetos",
    title: "Lançamentos em destaque",
    description: "Compare localização, plantas, lazer e condições comerciais de empreendimentos selecionados.",
    cta: "Conhecer lançamentos"
  },
  {
    href: "/casas-em-condominio",
    eyebrow: "Morar com mais espaço",
    title: "Casas em condomínio",
    description: "Casas selecionadas no Caribe, Mirante do Lago e outros condomínios de Palmas.",
    cta: "Ver casas em condomínio"
  },
  {
    href: "/imoveis/prontos",
    eyebrow: "Compra ou locação",
    title: "Imóveis prontos",
    description: "Casas, apartamentos, lotes e imóveis comerciais para visitar e decidir com mais clareza.",
    cta: "Buscar imóveis prontos"
  },
  {
    href: "/imoveis/na-planta",
    eyebrow: "Planejamento",
    title: "Imóveis na planta",
    description: "Entenda os projetos, etapas, plantas e pontos de atenção antes de escolher.",
    cta: "Ver imóveis na planta"
  },
  {
    href: "/imoveis/prontos?purpose=INVESTIMENTO",
    eyebrow: "Análise de oportunidade",
    title: "Investir em imóveis",
    description: "Oportunidades para comparar localização, liquidez, uso, renda e cenário de negociação.",
    cta: "Ver oportunidades"
  },
  {
    href: "/imoveis/leilao",
    eyebrow: "Compra com diligência",
    title: "Imóveis de leilão",
    description: "Leia edital, matrícula, ocupação e custo total antes de considerar qualquer lance.",
    cta: "Conhecer leilões"
  }
] as const;

const featuredLaunchSlugs = ["urban-haute", "comodoro-by-fama", "like-210", "lake-village"] as const;
const featuredLaunches = featuredLaunchSlugs
  .map((slug) => publicLandingPages.find((landing) => landing.slug === slug))
  .filter((landing): landing is (typeof publicLandingPages)[number] => Boolean(landing));

const featuredHouses = [
  {
    href: "/casa-condominio-caribe",
    title: "Casa no Condomínio Caribe Resort",
    location: "Condomínio Caribe Resort · Palmas/TO",
    description: "Casa contemporânea com 600 m² de terreno, 240 m² construídos, 4 suítes, piscina e energia solar.",
    image: "/brand/caribe-resort/casa-fachada-hero.jpg",
    details: "240 m² construídos · 4 suítes"
  },
  {
    href: "/casa-caribe-residence",
    title: "Casa no Caribe Residence & Resort",
    location: "Caribe Residence & Resort · Palmas/TO",
    description: "Casa contemporânea com 4 suítes plenas, pé-direito duplo, espaço gourmet e piscina com cascata.",
    image: "/brand/caribe-residence/6-Foto-6.jpg",
    details: "4 suítes · espaço gourmet · piscina"
  }
] as const;

const regionalLinks = [
  { href: "/palmas-to/plano-diretor-sul/imoveis", label: "Plano Diretor Sul" },
  { href: "/palmas-to/plano-diretor-norte/imoveis", label: "Plano Diretor Norte" },
  { href: "/palmas-to/orla-da-graciosa/imoveis", label: "Orla da Graciosa" },
  { href: "/palmas-to/taquaralto/imoveis", label: "Taquaralto" },
  { href: "/palmas-to/aureny/imoveis", label: "Aureny" },
  { href: "/palmas-to/centro/imoveis", label: "Centro de Palmas" }
];

const faqItems = [
  {
    question: "Quais tipos de imóveis posso encontrar em Palmas?",
    answer:
      "A curadoria reúne imóveis prontos, lançamentos, apartamentos na planta, casas em condomínio, lotes, imóveis comerciais e oportunidades de leilão, conforme disponibilidade e objetivo de compra."
  },
  {
    question: "Onde encontrar lançamentos imobiliários em Palmas?",
    answer:
      "Os lançamentos estão organizados em páginas próprias com informações de localização, tipologia, plantas, lazer e atendimento. Consulte a seleção de lançamentos em destaque e solicite disponibilidade atualizada."
  },
  {
    question: "Existem casas em condomínio à venda em Palmas?",
    answer:
      "Sim. A seleção de casas em condomínio inclui opções no Caribe Residence, Caribe Resort e outros condomínios selecionados. A disponibilidade, os valores e as condições devem ser confirmados no atendimento."
  },
  {
    question: "Como escolher um imóvel em Palmas?",
    answer:
      "Comece pelo objetivo de uso, região, tipologia e orçamento. Depois compare localização, área, condomínio, documentação, financiamento, custos recorrentes e possibilidade de visita antes de fazer uma proposta."
  },
  {
    question: "Posso falar com o corretor antes de escolher um imóvel?",
    answer:
      "Sim. Uma conversa inicial ajuda a filtrar bairros, tipo de imóvel, faixa de valor, prazo e finalidade para apresentar opções mais coerentes com o seu momento."
  }
];

export default function ImoveisPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: `${baseUrl}/imoveis`,
    inLanguage: "pt-BR",
    about: { "@type": "Place", name: "Palmas, Tocantins" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [...featuredLaunches, ...featuredHouses].map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: `${baseUrl}${item.href}`,
        image: `${baseUrl}${item.image}`
      }))
    }
  };

  const schemas = [
    collectionSchema,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Imóveis em Palmas TO", item: `${baseUrl}/imoveis` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer }
      }))
    }
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <main className="imoveis-hub">
        <section className="imoveis-hub-hero section">
          <div className="container">
            <nav className="listing-breadcrumb" aria-label="Você está em">
              <Link href="/">Início</Link>
              <span aria-hidden="true">/</span>
              <span>Imóveis</span>
            </nav>

            <div className="imoveis-hub-hero-grid">
              <div className="imoveis-hub-hero-copy">
                <p className="wp-hero-eyebrow">Curadoria imobiliária em Palmas/TO</p>
                <h1 className="section-title">Imóveis em Palmas TO</h1>
                <p className="section-subtitle text-card">
                  Do lançamento à casa pronta: encontre a oportunidade que combina com o seu momento, compare o que
                  importa e conte com atendimento direto para avançar com segurança.
                </p>
                <div className="imoveis-hub-actions">
                  <Link href="/imoveis/prontos" className="button button-primary">
                    Ver imóveis disponíveis
                  </Link>
                  <a href={whatsappUrl} className="button button-ghost" target="_blank" rel="noreferrer">
                    Falar com Pedro
                  </a>
                </div>
              </div>
              <div className="imoveis-hub-hero-note" aria-label="Como posso ajudar">
                <p className="wp-section-eyebrow">Como posso ajudar</p>
                <h2>Uma escolha imobiliária começa pela pergunta certa.</h2>
                <p>
                  Você está procurando para morar, investir, alugar ou encontrar um lançamento? A partir disso, eu
                  filtro localização, tipologia, orçamento e o nível de informação que você precisa.
                </p>
                <div className="imoveis-hub-note-links">
                  <Link href="/imobiliaria-palmas-to">Guia para escolher em Palmas</Link>
                  <Link href="/condominios-beira-lago-palmas">Guia de condomínios beira-lago</Link>
                </div>
              </div>
            </div>

            <div className="imoveis-hub-chips" aria-label="Atalhos de busca">
              {[
                ["/lancamentos", "Lançamentos"],
                ["/casas-em-condominio", "Casas em condomínio"],
                ["/imoveis/prontos", "Imóveis prontos"],
                ["/imoveis/na-planta", "Na planta"],
                ["/imoveis/prontos?purpose=INVESTIMENTO", "Investir"]
              ].map(([href, label]) => (
                <Link key={href} href={href} className="wp-type-chip">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section imoveis-hub-section" aria-labelledby="imoveis-hub-discovery-title">
          <div className="container">
            <div className="wp-section-head">
              <p className="wp-section-eyebrow">Escolha sua busca</p>
              <h2 id="imoveis-hub-discovery-title" className="section-title">Encontre o caminho certo para o seu imóvel.</h2>
              <p className="section-subtitle text-card">
                Cada categoria reúne informações e oportunidades diferentes para você começar a pesquisa sem perder
                tempo.
              </p>
            </div>
            <div className="imoveis-hub-discovery-grid">
              {discoveryCards.map((card) => (
                <article key={card.href} className="imoveis-hub-discovery-card">
                  <p className="wp-section-eyebrow">{card.eyebrow}</p>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <Link href={card.href}>{card.cta} <span aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section imoveis-hub-featured" aria-labelledby="imoveis-hub-launches-title">
          <div className="container">
            <div className="imoveis-hub-section-heading">
              <div>
                <p className="wp-section-eyebrow">Novos empreendimentos</p>
                <h2 id="imoveis-hub-launches-title" className="section-title">Lançamentos em destaque</h2>
                <p className="section-subtitle text-card">Projetos para morar ou investir, com apresentação individual e atendimento direto.</p>
              </div>
              <Link href="/lancamentos" className="button button-ghost">Ver todos os lançamentos</Link>
            </div>
            <div className="imoveis-hub-featured-grid">
              {featuredLaunches.map((landing) => (
                <Link key={landing.slug} href={landing.href} className="imoveis-hub-image-card" aria-label={`Conhecer ${landing.title}`}>
                  <div className="imoveis-hub-image-card-media">
                    <Image
                      src={landing.image}
                      alt={`${landing.title} em ${landing.location}`}
                      fill
                      sizes="(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      className="imoveis-hub-card-image"
                    />
                    <div className="imoveis-hub-card-overlay" />
                    <span className="badge">{landing.status}</span>
                    <div className="imoveis-hub-image-card-content">
                      <p>{landing.location}</p>
                      <h3>{landing.title}</h3>
                    </div>
                  </div>
                  <div className="imoveis-hub-image-card-body">
                    <p>{landing.category}</p>
                    <span>Conhecer projeto →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section imoveis-hub-section" aria-labelledby="imoveis-hub-houses-title">
          <div className="container">
            <div className="imoveis-hub-section-heading">
              <div>
                <p className="wp-section-eyebrow">Morar com mais privacidade</p>
                <h2 id="imoveis-hub-houses-title" className="section-title">Casas em condomínio</h2>
                <p className="section-subtitle text-card">Veja casas selecionadas e conheça também os condomínios onde elas estão inseridas.</p>
              </div>
              <Link href="/casas-em-condominio" className="button button-ghost">Ver casas em condomínio</Link>
            </div>
            <div className="imoveis-hub-house-grid">
              {featuredHouses.map((house) => (
                <article key={house.href} className="imoveis-hub-house-card">
                  <div className="imoveis-hub-house-media">
                    <Image
                      src={house.image}
                      alt={`${house.title} em ${house.location}`}
                      fill
                      sizes="(max-width: 900px) 100vw, 45vw"
                      className="imoveis-hub-card-image"
                    />
                  </div>
                  <div className="imoveis-hub-house-body">
                    <p className="wp-section-eyebrow">{house.location}</p>
                    <h3>{house.title}</h3>
                    <p className="imoveis-hub-house-details">{house.details}</p>
                    <p>{house.description}</p>
                    <Link href={house.href} className="button button-primary">Ver detalhes da casa</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section imoveis-hub-soft" aria-labelledby="imoveis-hub-guide-title">
          <div className="container imoveis-hub-guide-grid">
            <div>
              <p className="wp-section-eyebrow">Informação para decidir</p>
              <h2 id="imoveis-hub-guide-title" className="section-title">Localização, documentação e cenário também entram na conta.</h2>
              <p className="section-subtitle text-card">
                Antes de visitar ou fazer uma proposta, vale entender o bairro, o perfil do empreendimento, os custos
                do condomínio, a documentação e a possibilidade de financiamento.
              </p>
            </div>
            <div className="imoveis-hub-guide-links">
              <Link href="/imobiliaria-palmas-to">Como escolher um imóvel em Palmas <span>→</span></Link>
              <Link href="/loteamentos-palmas-to">Guia de loteamentos e condomínios <span>→</span></Link>
              <Link href="/investimentos-em-palmas">Investimentos imobiliários em Palmas <span>→</span></Link>
              <Link href="/condominios-beira-lago-palmas">Condomínios beira-lago em Palmas <span>→</span></Link>
            </div>
          </div>
        </section>

        <section className="section imoveis-hub-section imoveis-hub-regions" aria-labelledby="imoveis-hub-regions-title">
          <div className="container">
            <div className="wp-section-head">
              <p className="wp-section-eyebrow">Explore por localização</p>
              <h2 id="imoveis-hub-regions-title" className="section-title">Regiões de Palmas</h2>
              <p className="section-subtitle text-card">Acesse buscas locais para comparar o que existe em cada parte da cidade.</p>
            </div>
            <div className="wp-type-switches imoveis-hub-region-links">
              {regionalLinks.map((item) => (
                <Link key={item.href} href={item.href} className="wp-type-chip">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section imoveis-hub-faq" aria-labelledby="imoveis-hub-faq-title">
          <div className="container">
            <div className="wp-section-head">
              <p className="wp-section-eyebrow">Perguntas frequentes</p>
              <h2 id="imoveis-hub-faq-title" className="section-title">Dúvidas sobre imóveis em Palmas</h2>
              <p className="section-subtitle text-card">Informações rápidas para orientar sua próxima busca.</p>
            </div>
            <div className="imoveis-hub-faq-list">
              {faqItems.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section imoveis-hub-cta">
          <div className="container">
            <p className="wp-section-eyebrow">Atendimento direto</p>
            <h2 className="section-title">Ainda não sabe por onde começar?</h2>
            <p className="section-subtitle text-card">Me conte o que você procura e eu organizo as opções mais coerentes para o seu momento.</p>
            <a href={whatsappUrl} className="button button-primary" target="_blank" rel="noreferrer">Conversar pelo WhatsApp</a>
          </div>
        </section>
      </main>
    </>
  );
}
