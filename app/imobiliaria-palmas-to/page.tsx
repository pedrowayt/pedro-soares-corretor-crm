import type { Metadata } from "next";
import Link from "next/link";
import { TrackedWhatsAppLink } from "@/components/public/tracked-whatsapp-link";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();
const pageUrl = `${baseUrl}/imobiliaria-palmas-to`;

export const metadata: Metadata = {
  title: "Imobiliária em Palmas TO | Comprar, vender e investir",
  description:
    "Entenda como comprar, vender e investir em imóveis em Palmas TO: bairros, imóveis prontos, lançamentos, financiamento e leilões com orientação de Pedro Soares.",
  keywords: [
    "imobiliária Palmas TO",
    "imobiliária em Palmas",
    "corretor de imóveis Palmas",
    "comprar imóvel em Palmas",
    "lançamentos imobiliários Palmas",
    "imóveis na planta Palmas"
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: pageUrl,
    title: "Imobiliária em Palmas TO | Comprar, vender e investir",
    description:
      "Um guia completo para escolher imóveis, bairros, lançamentos e oportunidades em Palmas TO com atendimento consultivo."
  }
};

const whatsappUrl =
  "https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20entender%20as%20melhores%20op%C3%A7%C3%B5es%20de%20im%C3%B3veis%20em%20Palmas.";

const neighborhoodGuides = [
  {
    name: "Plano Diretor Sul",
    href: "/palmas-to/plano-diretor-sul/imoveis",
    description:
      "Uma região para comparar apartamentos, casas, condomínios e empreendimentos considerando acesso, rotina, serviços e potencial de valorização."
  },
  {
    name: "Plano Diretor Norte",
    href: "/palmas-to/plano-diretor-norte/imoveis",
    description:
      "Pode fazer sentido para quem busca outra relação entre localização, mobilidade, tipologia e orçamento. A escolha depende do objetivo da compra."
  },
  {
    name: "Orla da Graciosa",
    href: "/palmas-to/orla-da-graciosa/imoveis",
    description:
      "Uma localização associada à paisagem do lago e a projetos de padrão diferenciado. Vale analisar acesso, vista, condomínio e liquidez."
  },
  {
    name: "Centro de Palmas",
    href: "/palmas-to/centro/imoveis",
    description:
      "Uma alternativa para quem prioriza acesso a comércio, serviços e deslocamentos cotidianos, comparando estado do imóvel e custo total."
  },
  {
    name: "Taquaralto",
    href: "/palmas-to/taquaralto/imoveis",
    description:
      "Uma região para comparar infraestrutura, transporte, comércio, perfil de vizinhança e relação entre preço e uso."
  },
  {
    name: "Aureny",
    href: "/palmas-to/aureny/imoveis",
    description:
      "A decisão deve considerar rotina, acesso, tipologia, estado do imóvel, orçamento e o objetivo de morar ou investir."
  }
];

const purchaseSteps = [
  ["Definir o objetivo", "Morar, alugar, investir, comprar na planta ou buscar uma oportunidade de leilão exige critérios diferentes."],
  ["Escolher a localização", "Bairro, deslocamento, serviços, infraestrutura, vizinhança e perspectiva de uso pesam tanto quanto a metragem."],
  ["Comparar o custo total", "Além do preço, considere entrada, financiamento, impostos, registro, condomínio, reforma, manutenção e custos de mudança."],
  ["Conferir documentos", "A disponibilidade, a matrícula, os ônus, a situação do vendedor e as condições comerciais precisam ser confirmados antes de avançar."],
  ["Tomar a decisão com clareza", "A melhor oportunidade é aquela que combina com o momento financeiro, o objetivo e o nível de risco que você aceita." ]
] as const;

const faqItems = [
  {
    question: "O que uma imobiliária em Palmas TO pode fazer por mim?",
    answer:
      "O atendimento pode ajudar a organizar o objetivo de compra, filtrar imóveis, comparar bairros e condições, agendar visitas, reunir informações do imóvel e encaminhar as próximas etapas com mais clareza."
  },
  {
    question: "Qual é o melhor bairro para comprar imóvel em Palmas?",
    answer:
      "Não existe um único melhor bairro para todos. A escolha depende de rotina, orçamento, tipo de imóvel, acesso a serviços, objetivo de uso e perspectiva de liquidez. Por isso, a comparação deve começar pelo seu objetivo."
  },
  {
    question: "Vocês trabalham com imóveis na planta e lançamentos?",
    answer:
      "Sim. É possível comparar lançamentos, apartamentos na planta, terrenos e condomínios em Palmas e região, sempre conferindo as informações disponíveis do empreendimento, da incorporadora e das unidades."
  },
  {
    question: "Como funciona a orientação para financiamento?",
    answer:
      "A orientação começa pela compreensão do orçamento, da entrada e do perfil de compra. Depois, é possível organizar uma simulação e conferir quais condições precisam ser confirmadas com a instituição financeira."
  },
  {
    question: "Imóvel de leilão é sempre uma oportunidade?",
    answer:
      "Não. É necessário analisar edital, matrícula, ocupação, débitos, prazos, custos de arrematação, risco jurídico e estratégia de saída. O desconto aparente não substitui a análise do custo total."
  },
  {
    question: "Posso falar com o corretor antes de escolher um imóvel?",
    answer:
      "Sim. Uma conversa inicial ajuda a definir cidade, bairro, tipo de imóvel, faixa de investimento, prazo e objetivo antes de selecionar opções específicas."
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Imobiliária em Palmas TO | Comprar, vender e investir",
      description: metadata.description,
      inLanguage: "pt-BR",
      about: {
        "@type": "RealEstateAgent",
        name: "Pedro Soares",
        url: baseUrl,
        areaServed: {
          "@type": "City",
          name: "Palmas",
          containedInPlace: { "@type": "State", name: "Tocantins" }
        }
      }
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Imobiliária em Palmas TO", item: pageUrl }
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer }
      }))
    }
  ]
};

export default function ImobiliariaPalmasToPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <main>
        <section className="section" style={{ paddingBottom: 26 }}>
          <div className="container">
            <nav className="listing-breadcrumb" aria-label="Você está em">
              <Link href="/">Início</Link>
              <span aria-hidden="true">/</span>
              <span>Imobiliária em Palmas TO</span>
            </nav>
            <p className="wp-hero-eyebrow" style={{ marginBottom: 12 }}>
              Pedro Soares • Corretor de imóveis em Palmas TO
            </p>
            <h1 className="section-title" style={{ marginTop: 0 }}>
              Imobiliária em Palmas TO para comprar, vender e investir com mais clareza
            </h1>
            <p className="section-subtitle text-card" style={{ maxWidth: "82ch" }}>
              Encontrar um imóvel em Palmas não começa pelo anúncio mais chamativo. Começa por entender o objetivo,
              comparar regiões, calcular o custo total e conferir as informações que realmente influenciam a decisão.
              Este guia reúne os principais caminhos para comprar, vender ou investir com atendimento consultivo.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <Link href="/imoveis" className="button button-primary">
                Ver imóveis em Palmas
              </Link>
              <TrackedWhatsAppLink
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                landingPageSlug="imobiliaria-palmas-to"
                messageTemplate="Olá, Pedro. Quero entender as melhores opções de imóveis em Palmas."
                className="button button-whatsapp"
              >
                Falar com Pedro
              </TrackedWhatsAppLink>
            </div>
          </div>
        </section>

        <section className="section wp-soft-section" style={{ paddingTop: 30 }}>
          <div className="container">
            <div className="wp-section-head">
              <h2 className="section-title">Como escolher um imóvel em Palmas</h2>
              <p className="section-subtitle text-card">
                Uma boa decisão imobiliária combina intenção, localização, orçamento, documentação e horizonte de uso.
              </p>
            </div>
            <div className="grid-3" style={{ marginTop: 18 }}>
              {purchaseSteps.map(([title, description], index) => (
                <article key={title} className="card" style={{ padding: 18 }}>
                  <span className="badge text-card">0{index + 1}</span>
                  <h3 style={{ margin: "14px 0 8px" }}>{title}</h3>
                  <p className="text-card" style={{ margin: 0 }}>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 30 }}>
          <div className="container">
            <div className="wp-section-head">
              <h2 className="section-title">Bairros e regiões de Palmas: o que comparar</h2>
              <p className="section-subtitle text-card">
                A região certa depende do seu cotidiano e do seu objetivo. Em vez de procurar uma lista genérica de
                “melhores bairros”, compare critérios concretos para o imóvel que você quer comprar.
              </p>
            </div>
            <div className="grid-3" style={{ marginTop: 18 }}>
              {neighborhoodGuides.map((item) => (
                <article key={item.name} className="card" style={{ padding: 18 }}>
                  <h3 style={{ marginTop: 0 }}>{item.name}</h3>
                  <p className="text-card" style={{ marginBottom: 12 }}>{item.description}</p>
                  <Link href={item.href} className="button button-ghost">
                    Ver opções da região
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section wp-soft-section" style={{ paddingTop: 30 }}>
          <div className="container">
            <div className="wp-section-head">
              <h2 className="section-title">Quais tipos de oportunidade você encontra</h2>
              <p className="section-subtitle text-card">
                Cada modalidade exige uma análise diferente. O atendimento começa pelo que você pretende fazer com o
                imóvel, e não apenas pelo número de quartos.
              </p>
            </div>
            <div className="grid-3" style={{ marginTop: 18 }}>
              <article className="card" style={{ padding: 18 }}>
                <h3 style={{ marginTop: 0 }}>Imóveis prontos</h3>
                <p className="text-card">Casas, apartamentos e lotes para quem quer visitar, comparar estado, localização e possibilidade de uso.</p>
                <Link href="/imoveis/prontos" className="button button-ghost">Ver imóveis prontos</Link>
              </article>
              <article className="card" style={{ padding: 18 }}>
                <h3 style={{ marginTop: 0 }}>Lançamentos e planta</h3>
                <p className="text-card">Empreendimentos para comparar projeto, incorporadora, prazo, planta, condomínio e condições comerciais.</p>
                <Link href="/imoveis/na-planta" className="button button-ghost">Ver imóveis na planta</Link>
              </article>
              <article className="card" style={{ padding: 18 }}>
                <h3 style={{ marginTop: 0 }}>Leilões e investimento</h3>
                <p className="text-card">Oportunidades que pedem leitura do edital, matrícula, ocupação, riscos e custo total antes do lance.</p>
                <Link href="/imoveis/leilao" className="button button-ghost">Ver leilões</Link>
              </article>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 30 }}>
          <div className="container grid-3">
            <article className="card" style={{ padding: 20, gridColumn: "span 2" }}>
              <h2 className="section-title" style={{ marginTop: 0 }}>Financiamento: o que organizar antes da simulação</h2>
              <p className="text-card">
                Antes de escolher uma parcela, organize a entrada disponível, a renda familiar, o prazo desejado e os
                custos que ficam fora do financiamento. Também vale confirmar documentação, seguros, taxas, impostos e
                regras da instituição financeira. Uma simulação é um ponto de partida; a aprovação e as condições finais
                precisam ser confirmadas pelo banco.
              </p>
              <p className="text-card" style={{ marginBottom: 0 }}>
                Para lançamentos, compare ainda o fluxo de pagamento durante a obra, eventuais correções, entrega,
                condomínio projetado e o memorial descritivo. Para imóveis prontos, a visita e a conferência documental
                ajudam a evitar que uma boa aparência esconda custos futuros.
              </p>
            </article>
            <article className="card" style={{ padding: 20 }}>
              <h2 style={{ marginTop: 0 }}>Para quem vende</h2>
              <p className="text-card">Uma boa captação começa com preço coerente, documentação organizada, apresentação honesta e estratégia de divulgação.</p>
              <Link href="/venda-seu-imovel" className="button button-primary">Quero vender meu imóvel</Link>
            </article>
          </div>
        </section>

        <section className="section wp-soft-section" style={{ paddingTop: 30 }}>
          <div className="container">
            <h2 className="section-title">Perguntas frequentes sobre imóveis em Palmas</h2>
            <div className="property-faq-list" style={{ marginTop: 16 }}>
              {faqItems.map((item) => (
                <details key={item.question} className="property-faq-item">
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 30 }}>
          <div className="container card" style={{ padding: 24, textAlign: "center" }}>
            <p className="wp-hero-eyebrow">Próximo passo</p>
            <h2 className="section-title" style={{ marginTop: 8 }}>Quer comparar as opções certas para o seu momento?</h2>
            <p className="section-subtitle text-card" style={{ maxWidth: "70ch", margin: "0 auto" }}>
              Envie seu objetivo, faixa de investimento e região de interesse. A conversa começa sem compromisso e ajuda a
              transformar uma busca ampla em próximos passos práticos.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <TrackedWhatsAppLink
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                landingPageSlug="imobiliaria-palmas-to"
                messageTemplate="Olá, Pedro. Quero comparar opções de imóveis em Palmas."
                className="button button-whatsapp"
              >
                Conversar no WhatsApp
              </TrackedWhatsAppLink>
              <Link href="/contato" className="button button-ghost">Ver outras formas de contato</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
