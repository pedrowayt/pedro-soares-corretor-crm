import type { Metadata } from "next";
import Link from "next/link";
import { TrackedWhatsAppLink } from "@/components/public/tracked-whatsapp-link";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();
const pageUrl = `${baseUrl}/loteamentos-palmas-to`;

export const metadata: Metadata = {
  title: "Loteamentos em Palmas TO | Como escolher um lote com segurança",
  description:
    "Guia completo para avaliar loteamentos em Palmas TO: localização, infraestrutura, matrícula, documentação, financiamento, custos e cuidados antes de comprar.",
  keywords: [
    "loteamentos em Palmas TO",
    "lotes em Palmas",
    "comprar lote em Palmas",
    "financiamento de terreno",
    "documentação de lote",
    "loteamento aberto ou condomínio"
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "article",
    locale: "pt_BR",
    url: pageUrl,
    title: "Loteamentos em Palmas TO | Como escolher um lote com segurança",
    description:
      "Um guia prático para comparar localização, infraestrutura, documentação, financiamento e custos antes de comprar um lote em Palmas."
  }
};

const whatsappUrl =
  "https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20entender%20as%20op%C3%A7%C3%B5es%20de%20lotes%20e%20loteamentos%20em%20Palmas.";

const decisionCriteria = [
  {
    title: "Localização e rotina",
    description:
      "Observe acesso ao trabalho, escolas, comércio, saúde, transporte e vias principais. Um lote barato pode deixar de ser uma boa escolha quando o deslocamento pesa todos os dias."
  },
  {
    title: "Infraestrutura entregue",
    description:
      "Confirme o que existe hoje e o que está apenas previsto: pavimentação, drenagem, iluminação, água, esgoto, energia, áreas públicas e acesso."
  },
  {
    title: "Matrícula e registro",
    description:
      "A matrícula individualizada, a titularidade e a ausência de impedimentos precisam ser conferidas antes de qualquer sinal ou compromisso."
  },
  {
    title: "Uso permitido",
    description:
      "Verifique o zoneamento, os recuos, o tamanho mínimo da construção, a finalidade do lote e as regras urbanísticas aplicáveis à região."
  },
  {
    title: "Custo total",
    description:
      "Além da parcela, considere entrada, escritura, registro, ITBI quando aplicável, taxas, condomínio, projeto, terraplenagem, muro e construção."
  },
  {
    title: "Liquidez e horizonte",
    description:
      "Quem compra para investir precisa comparar procura, acesso, ocupação do entorno e facilidade de revenda — sem tratar valorização futura como garantia."
  },
  {
    title: "Cuidados antes de fechar",
    description:
      "Não pague sinal nem assine por impulso. Organize documentos, dúvidas, responsabilidades, prazos, correções, multas e condições de saída do contrato."
  }
] as const;

const documentChecklist = [
  ["Matrícula atualizada", "Confirme proprietário, descrição do lote, área, confrontações, ônus e averbações."],
  ["Aprovação e registro", "Verifique a aprovação do parcelamento e o registro do loteamento no cartório competente."],
  ["Certidões e situação do vendedor", "A análise pode incluir certidões do imóvel, do vendedor e eventuais débitos, conforme a operação."],
  ["Contrato e memorial", "Leia condições de pagamento, correção, multas, prazo, infraestrutura prometida e responsabilidades."],
  ["Regras urbanísticas", "Confirme zoneamento, uso permitido, recuos, área construída e exigências municipais antes de projetar."],
  ["Visita ao local", "Compare o material comercial com a realidade: acesso, topografia, vizinhança, obras e infraestrutura existente."]
] as const;

const financingSteps = [
  "Defina quanto pode dar de entrada sem comprometer sua reserva.",
  "Separe a parcela do terreno dos custos de documentação e construção.",
  "Confirme se o banco financia aquela modalidade, localização e situação registral.",
  "Compare prazo, correção, juros, seguros, tarifas e regras de aprovação.",
  "Peça uma simulação por escrito e valide as condições antes de assinar."
] as const;

const faqItems = [
  {
    question: "O que devo verificar antes de comprar um lote em Palmas?",
    answer:
      "Comece pela matrícula atualizada, titularidade, registro do loteamento, infraestrutura existente, regras de uso, custos totais e condições do contrato. A visita ao local e a conferência documental são etapas diferentes e necessárias."
  },
  {
    question: "Qual é a diferença entre loteamento aberto e condomínio fechado?",
    answer:
      "No loteamento aberto, as vias e áreas públicas seguem o regime previsto para o parcelamento e o acesso não funciona como o de um condomínio fechado. No condomínio, existem áreas e regras internas próprias, com despesas e responsabilidades comuns. O caso concreto deve ser confirmado na documentação e na legislação aplicável."
  },
  {
    question: "É possível financiar um terreno em Palmas?",
    answer:
      "Pode ser possível, mas depende da instituição, do perfil do comprador, da situação do terreno, da documentação e da modalidade de crédito. A aprovação não deve ser presumida antes da análise do banco."
  },
  {
    question: "Comprar lote é sempre um bom investimento?",
    answer:
      "Não. O resultado depende de localização, preço de entrada, documentação, infraestrutura, prazo, liquidez, custos e objetivo. Um lote pode ser adequado para construir e não ser adequado para revender rapidamente."
  },
  {
    question: "Como saber se um loteamento está regularizado?",
    answer:
      "Solicite a documentação do empreendimento e confirme o registro do parcelamento no cartório competente, além das aprovações e informações municipais pertinentes. Em uma compra concreta, vale buscar orientação jurídica e documental independente."
  },
  {
    question: "Posso escolher um lote apenas pelo preço?",
    answer:
      "O preço é apenas um dos critérios. Compare localização, topografia, infraestrutura, documentação, custos para construir, regras do empreendimento e facilidade de uso ou revenda."
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      url: pageUrl,
      headline: "Loteamentos em Palmas TO: como escolher um lote com segurança",
      description: metadata.description,
      inLanguage: "pt-BR",
      author: { "@type": "Person", name: "Pedro Soares" },
      publisher: { "@type": "RealEstateAgent", name: "Pedro Soares", url: baseUrl },
      about: {
        "@type": "Place",
        name: "Palmas",
        address: { "@type": "PostalAddress", addressLocality: "Palmas", addressRegion: "TO", addressCountry: "BR" }
      }
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Loteamentos em Palmas TO", item: pageUrl }
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

export default function LoteamentosPalmasToPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <main>
        <section className="section" style={{ paddingBottom: 28 }}>
          <div className="container">
            <nav className="listing-breadcrumb" aria-label="Você está em">
              <Link href="/">Início</Link>
              <span aria-hidden="true">/</span>
              <Link href="/imobiliaria-palmas-to">Imobiliária em Palmas TO</Link>
              <span aria-hidden="true">/</span>
              <span>Loteamentos em Palmas TO</span>
            </nav>
            <p className="wp-hero-eyebrow" style={{ marginBottom: 12 }}>
              Guia de compra • Palmas e região
            </p>
            <h1 className="section-title" style={{ marginTop: 0 }}>
              Loteamentos em Palmas TO: como escolher um lote com segurança
            </h1>
            <p className="section-subtitle text-card" style={{ maxWidth: "84ch" }}>
              Comprar um lote pode ser o começo de uma casa, uma construção para renda ou uma decisão de investimento.
              Mas a escolha não deve partir apenas do preço ou da imagem do empreendimento. É preciso entender localização,
              infraestrutura, documentação, financiamento e o custo de transformar o terreno em um projeto viável.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <TrackedWhatsAppLink
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                landingPageSlug="loteamentos-palmas-to"
                messageTemplate="Olá, Pedro. Quero entender as opções de lotes e loteamentos em Palmas."
                className="button button-whatsapp"
              >
                Conversar sobre lotes
              </TrackedWhatsAppLink>
              <Link href="/imoveis/prontos" className="button button-primary">
                Ver imóveis disponíveis
              </Link>
            </div>
          </div>
        </section>

        <section className="section wp-soft-section" style={{ paddingTop: 30 }}>
          <div className="container">
            <div className="wp-section-head">
              <h2 className="section-title">A pergunta certa antes de procurar um lote</h2>
              <p className="section-subtitle text-card">
                O melhor lote depende do que você pretende fazer com ele. Definir o objetivo evita comparar opções com
                critérios diferentes e ajuda a perceber custos que não aparecem no anúncio.
              </p>
            </div>
            <div className="grid-3" style={{ marginTop: 18 }}>
              <article className="card" style={{ padding: 18 }}>
                <span className="badge text-card">01</span>
                <h3 style={{ margin: "14px 0 8px" }}>Construir para morar</h3>
                <p className="text-card" style={{ margin: 0 }}>
                  Pense na rotina, no tamanho da casa, na topografia, na orientação solar, no acesso e na infraestrutura que precisa estar pronta.
                </p>
              </article>
              <article className="card" style={{ padding: 18 }}>
                <span className="badge text-card">02</span>
                <h3 style={{ margin: "14px 0 8px" }}>Construir para renda</h3>
                <p className="text-card" style={{ margin: 0 }}>
                  Avalie demanda local, tipologia possível, custo da obra, prazo até a entrega e capacidade de locação do entorno.
                </p>
              </article>
              <article className="card" style={{ padding: 18 }}>
                <span className="badge text-card">03</span>
                <h3 style={{ margin: "14px 0 8px" }}>Investir no longo prazo</h3>
                <p className="text-card" style={{ margin: 0 }}>
                  Compare preço, documentação, acesso, ocupação e liquidez. Valorização é uma possibilidade, nunca uma promessa automática.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 30 }}>
          <div className="container">
            <div className="wp-section-head">
              <h2 className="section-title">Sete critérios para analisar loteamentos em Palmas</h2>
              <p className="section-subtitle text-card">
                Uma visita ajuda a enxergar o local, mas a decisão precisa combinar observação, documentos e contas. Use estes critérios como roteiro de comparação.
              </p>
            </div>
            <div className="grid-3" style={{ marginTop: 18 }}>
              {decisionCriteria.map((item, index) => (
                <article key={item.title} className="card" style={{ padding: 18 }}>
                  <span className="badge text-card">0{index + 1}</span>
                  <h3 style={{ margin: "14px 0 8px" }}>{item.title}</h3>
                  <p className="text-card" style={{ margin: 0 }}>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section wp-soft-section" style={{ paddingTop: 30 }}>
          <div className="container">
            <div className="wp-section-head">
              <h2 className="section-title">Documentação e matrícula: o que conferir</h2>
              <p className="section-subtitle text-card">
                Material de venda, contrato, matrícula e situação urbanística respondem perguntas diferentes. Não trate uma apresentação comercial como substituta da conferência documental.
              </p>
            </div>
            <div className="grid-3" style={{ marginTop: 18 }}>
              {documentChecklist.map(([title, description]) => (
                <article key={title} className="card" style={{ padding: 18 }}>
                  <h3 style={{ marginTop: 0 }}>{title}</h3>
                  <p className="text-card" style={{ margin: 0 }}>{description}</p>
                </article>
              ))}
            </div>
            <div className="card" style={{ padding: 20, marginTop: 18, borderLeft: "4px solid var(--sophistication-gold-500)" }}>
              <strong>Importante:</strong>{" "}
              <span className="text-card">
                em uma compra concreta, a análise do caso pode exigir corretor, advogado, engenheiro, cartório e órgão municipal. Este guia organiza perguntas, mas não substitui a conferência profissional dos documentos.
              </span>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 30 }}>
          <div className="container grid-3">
            <article className="card" style={{ padding: 20, gridColumn: "span 2" }}>
              <h2 className="section-title" style={{ marginTop: 0 }}>Financiamento de terreno: organize antes de simular</h2>
              <p className="text-card">
                O financiamento de um terreno não deve ser analisado como se fosse apenas uma parcela. A instituição pode considerar o perfil do comprador, a localização, a documentação, o valor de entrada e a modalidade de crédito. Se a intenção é construir, separe o fluxo do terreno do orçamento da obra.
              </p>
              <ol className="text-card" style={{ display: "grid", gap: 9, paddingLeft: 22, marginBottom: 0 }}>
                {financingSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </article>
            <article className="card" style={{ padding: 20 }}>
              <h2 style={{ marginTop: 0 }}>Custos que entram na conta</h2>
              <p className="text-card" style={{ marginBottom: 0 }}>
                Entrada, parcelas, correção, escritura, registro, impostos quando aplicáveis, projeto, terraplenagem, muro, ligações, construção e manutenção podem mudar completamente o orçamento.
              </p>
            </article>
          </div>
        </section>

        <section className="section wp-soft-section" style={{ paddingTop: 30 }}>
          <div className="container">
            <h2 className="section-title">Loteamento aberto ou condomínio fechado?</h2>
            <p className="section-subtitle text-card">
              Os nomes podem parecer próximos no anúncio, mas o regime jurídico, as áreas comuns, as regras de acesso e as despesas são diferentes. A documentação do empreendimento deve orientar a comparação.
            </p>
            <div className="grid-3" style={{ marginTop: 18 }}>
              <article className="card" style={{ padding: 20 }}>
                <h3 style={{ marginTop: 0 }}>Loteamento aberto</h3>
                <p className="text-card" style={{ margin: 0 }}>
                  As vias e áreas públicas seguem o regime do parcelamento aprovado. Compare acesso, manutenção urbana, serviços disponíveis e o que está efetivamente entregue.
                </p>
              </article>
              <article className="card" style={{ padding: 20 }}>
                <h3 style={{ marginTop: 0 }}>Condomínio fechado</h3>
                <p className="text-card" style={{ margin: 0 }}>
                  Há regras internas, áreas e despesas comuns próprias. Verifique convenção, taxa, administração, controle de acesso e obrigações do proprietário.
                </p>
              </article>
              <article className="card" style={{ padding: 20 }}>
                <h3 style={{ marginTop: 0 }}>O que comparar</h3>
                <p className="text-card" style={{ margin: 0 }}>
                  Regime do empreendimento, matrícula, infraestrutura, custos recorrentes, liberdade construtiva, segurança, acesso e perfil de uso.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 30 }}>
          <div className="container grid-3">
            <article className="card" style={{ padding: 20 }}>
              <h2 style={{ marginTop: 0 }}>Localização e valorização</h2>
              <p className="text-card" style={{ marginBottom: 0 }}>
                Procure sinais concretos: conexão viária, ocupação do entorno, serviços, obras públicas confirmadas, procura por moradia e facilidade de acesso. Evite decidir apenas por frases como “área que vai valorizar”.
              </p>
            </article>
            <article className="card" style={{ padding: 20, gridColumn: "span 2" }}>
              <h2 className="section-title" style={{ marginTop: 0 }}>Checklist para a visita</h2>
              <ul className="text-card" style={{ display: "grid", gap: 8, paddingLeft: 22, margin: 0 }}>
                <li>Visite em horários diferentes e observe acesso, ruído, drenagem e vizinhança.</li>
                <li>Confira a topografia do lote e o impacto sobre fundação, aterro e escoamento.</li>
                <li>Peça a planta, a quadra, o lote, as medidas e a orientação para comparar com o local.</li>
                <li>Separe o que já existe do que está previsto e pergunte quem é responsável por cada entrega.</li>
                <li>Registre dúvidas e documentos antes de fazer qualquer pagamento ou assinatura.</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section wp-soft-section" style={{ paddingTop: 30 }}>
          <div className="container">
            <h2 className="section-title">Perguntas frequentes sobre lotes em Palmas</h2>
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
            <h2 className="section-title" style={{ marginTop: 8 }}>Quer comparar lotes e loteamentos com mais contexto?</h2>
            <p className="section-subtitle text-card" style={{ maxWidth: "72ch", margin: "0 auto" }}>
              Envie a região de interesse, o objetivo da compra e a faixa de investimento. A conversa ajuda a separar o que é oportunidade adequada do que ainda precisa de conferência.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
              <TrackedWhatsAppLink
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                landingPageSlug="loteamentos-palmas-to"
                messageTemplate="Olá, Pedro. Quero comparar lotes e loteamentos em Palmas."
                className="button button-whatsapp"
              >
                Falar sobre uma oportunidade
              </TrackedWhatsAppLink>
              <Link href="/imobiliaria-palmas-to" className="button button-ghost">
                Voltar ao guia de imóveis em Palmas
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
