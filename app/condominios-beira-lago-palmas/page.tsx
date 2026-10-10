import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, MapPinned, Navigation, ShieldCheck, Waves } from "lucide-react";
import { LakeCondominiumsGuideForm } from "@/components/public/lake-condominiums-guide-form";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();
const pageUrl = `${baseUrl}/condominios-beira-lago-palmas`;
const origin = "Praça dos Girassóis, Palmas - TO";

type Condo = {
  name: string;
  group: string;
  region: string;
  status: string;
  summary: string;
  lots: string;
  landPrice: string;
  homePrice: string;
  highlight: string;
  mapQuery: string;
  distances: [string, string, string, string];
  caution: string;
  image?: string;
  imageAlt?: string;
  imageSource?: string;
  imageSourceUrl?: string;
};

const distancesHeaders = ["Praça dos Girassóis", "Capim Dourado Shopping", "UFT Palmas", "Aeroporto"];

const condos: Condo[] = [
  {
    name: "Polinésia Residence & Resort",
    group: "Consolidado",
    region: "Costa Dourada · Região norte",
    status: "Casas e terrenos",
    summary: "Residências de grande porte, lotes amplos e uma infraestrutura náutica diferenciada.",
    lots: "1.200–1.833 m² na amostra",
    landPrice: "R$ 750 mil",
    homePrice: "R$ 2,5 milhões",
    highlight: "Marina, garagem para barcos, praia, píeres e lazer completo.",
    mapQuery: "Polinésia Residence & Resort, Palmas - TO",
    distances: ["≈ 10 km", "≈ 7 km", "≈ 9 km", "≈ 24 km"],
    caution: "A Prefeitura registra lotes a partir de 450 m²; os anúncios consultados tinham metragem maior.",
    image: "/brand/condominios-beira-lago/polinesia-entrada.jpg",
    imageAlt: "Entrada do Polinésia Residence & Resort em Palmas",
    imageSource: "Imagem pública: anúncio OLX",
    imageSourceUrl: "https://to.olx.com.br/tocantins/terrenos/lote-exclusivo-condominio-polinesia-1452054017"
  },
  {
    name: "Caribe Residence",
    group: "Consolidado",
    region: "Costa Dourada · Região norte",
    status: "Casas e terrenos",
    summary: "Perfil de resort com lotes amplos, marina e variedade maior de casas anunciadas.",
    lots: "Principalmente 600–720 m²",
    landPrice: "R$ 490 mil",
    homePrice: "R$ 1,5 milhão*",
    highlight: "Orla, praia particular, marina molhada, garagem náutica e clube.",
    mapQuery: "Caribe Residence & Resort, Palmas - TO",
    distances: ["≈ 11 km", "≈ 8 km", "≈ 10 km", "≈ 25 km"],
    caution: "O anúncio de R$ 1,5 milhão tinha lote de 277 m², fora do padrão principal observado.",
    image: "/brand/condominios-beira-lago/caribe-residence.jpg",
    imageAlt: "Orla e caminho interno do Caribe Residence & Resort",
    imageSource: "Imagem pública: Hire Capital",
    imageSourceUrl: "https://www.hirecapital.com.br/case/caribe-residencial-resort/"
  },
  {
    name: "Caribe Golf & Spa",
    group: "Consolidado",
    region: "Costa Dourada · Região norte",
    status: "Casas e terrenos",
    summary: "Empreendimento com campo de golfe, acesso ao lago e proposta de alto padrão mais específica.",
    lots: "Principalmente 600–724 m²",
    landPrice: "R$ 450 mil quitado",
    homePrice: "R$ 2,3 milhões",
    highlight: "Campo de golfe, putting green, marina, píer e lazer de clube.",
    mapQuery: "Caribe Golf & Spa, Palmas - TO",
    distances: ["≈ 11 km", "≈ 8 km", "≈ 10 km", "≈ 25 km"],
    caution: "Ágio e saldo de financiamento precisam ser somados; o valor do ágio não é o custo total.",
    image: "/brand/condominios-beira-lago/caribe-golf.jpg",
    imageAlt: "Campo de golfe do Caribe Golf & Spa em Palmas",
    imageSource: "Imagem institucional: LN Urbanismo",
    imageSourceUrl: "https://lnurbanismo.com.br/empreendimentos/caribe-golf-and-spa"
  },
  {
    name: "Tahiti Residence Resort",
    group: "Em implantação",
    region: "Costa Dourada · Região norte",
    status: "Terrenos",
    summary: "Projeto de lazer e natureza com terrenos menores e preço de entrada inferior aos consolidados.",
    lots: "415–700 m² no projeto",
    landPrice: "R$ 250 mil",
    homePrice: "Não localizada",
    highlight: "Orla, áreas verdes, clube, praia, esporte, trilhas e píer anunciados.",
    mapQuery: "Tahiti Residence Resort, Palmas - TO",
    distances: ["≈ 13 km", "≈ 10 km", "≈ 12 km", "≈ 26 km"],
    caution: "Confirme instalações entregues, liberação para construir e obrigações de pagamento.",
    image: "/brand/condominios-beira-lago/tahiti-aerea.jpg",
    imageAlt: "Vista aérea de lotes e acesso ao lago no Tahiti Residence & Resort",
    imageSource: "Imagem pública: anúncio OLX",
    imageSourceUrl: "https://to.olx.com.br/tocantins/terrenos/lote-a-venda-no-condominio-tahiti-residence-resort-palmas-to-1447038508"
  },
  {
    name: "Mirante do Lago",
    group: "Consolidado",
    region: "ALC-SO 141 · Região sul",
    status: "Casas e terrenos",
    summary: "Perfil familiar, lotes mais padronizados e acesso à água com manutenção potencialmente mais simples.",
    lots: "Principalmente 397–450 m²",
    landPrice: "R$ 675 mil",
    homePrice: "R$ 1,6 milhão",
    highlight: "Praia particular, clube, piscinas, quadras, academia e áreas verdes.",
    mapQuery: "Condomínio Mirante do Lago, Palmas - TO",
    distances: ["≈ 9 km", "≈ 13 km", "≈ 11 km", "≈ 13 km"],
    caution: "O preço do lote por m² é elevado; compare o custo total de construção.",
    image: "/brand/condominios-beira-lago/mirante-do-lago.jpg",
    imageAlt: "Portaria do Condomínio Mirante do Lago em Palmas",
    imageSource: "Imagem pública: Arquitetura IR",
    imageSourceUrl: "https://www.arquiteturair.com.br/portfolio/mirante-do-lago"
  },
  {
    name: "Palmas Lake",
    group: "Lançamento vertical",
    region: "Avenida JK · Entrada da ponte",
    status: "Apartamentos e lofts",
    summary: "Complexo de uso misto com torres residenciais, lofts, Mall, Beach Club e marina.",
    lots: "Não se aplica",
    landPrice: "Não se aplica",
    homePrice: "Tabela sob consulta",
    highlight: "Mais de 4.400 m² de lazer projetado, praia, marina, torres e serviços.",
    mapQuery: "Palmas Lake, Avenida Juscelino Kubitschek, Palmas - TO",
    distances: ["≈ 5,5 km", "≈ 4 km", "≈ 7 km", "≈ 20 km"],
    caution: "Preço, disponibilidade, cronograma e condições comerciais devem ser confirmados com a incorporadora.",
    image: "/brand/palmas-lake/palmas-lake-overview.jpg",
    imageAlt: "Vista do complexo Palmas Lake e do Lago de Palmas",
    imageSource: "Imagem institucional: material Palmas Lake",
    imageSourceUrl: "/palmas-lake"
  }
];

function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function mapsDirectionsUrl(query: string) {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(query)}`;
}

export const metadata: Metadata = {
  title: "Condomínios beira-lago em Palmas | Guia de preços e localização",
  description:
    "Compare condomínios fechados com acesso ao Lago de Palmas: lotes, casas, infraestrutura, localização, distâncias e cuidados para comprar.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "article",
    locale: "pt_BR",
    url: pageUrl,
    title: "Condomínios beira-lago em Palmas | Guia de preços e localização",
    description: "Um guia comparativo de Polinésia, Caribe, Tahiti, Mirante do Lago e Palmas Lake.",
    images: [{ url: "/brand/palmas-lake/palmas-lake-overview.jpg", width: 1600, height: 900, alt: "Vista do Lago de Palmas e do complexo Palmas Lake" }]
  }
};

const faqs = [
  ["Qual é o condomínio beira-lago mais indicado para lotes grandes?", "Na amostra analisada, o Polinésia se destaca pelas metragens maiores, principalmente acima de 1.200 m². A disponibilidade e o preço precisam ser confirmados lote a lote."],
  ["Qual condomínio tem o menor preço de terreno anunciado?", "O menor anúncio encontrado foi no Tahiti, em torno de R$ 250 mil para um lote de aproximadamente 418 m². Trata-se de oferta pública, não de tabela oficial ou garantia de disponibilidade."],
  ["Palmas Lake é um condomínio de casas?", "Não. O Palmas Lake é um complexo vertical e de uso misto, com apartamentos, lofts, espaços corporativos, Mall, Beach Club e marina."],
  ["As distâncias da tabela são exatas?", "Não. São estimativas de referência para comparação entre regiões. A rota, o ponto exato dentro do condomínio e as condições de trânsito podem alterar a distância e o tempo no Google Maps."]
];

const guideStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      headline: "Condomínios fechados com acesso ao Lago de Palmas",
      description: "Guia comparativo de seis empreendimentos com lotes, casas, apartamentos, localização e preços anunciados.",
      datePublished: "2026-10-09",
      dateModified: "2026-10-09",
      author: { "@type": "Person", name: "Pedro Soares", url: baseUrl },
      publisher: { "@type": "Organization", name: "Pedro Soares Corretor de Imóveis", url: baseUrl },
      mainEntityOfPage: pageUrl
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: baseUrl },
        { "@type": "ListItem", position: 2, name: "Condomínios beira-lago em Palmas", item: pageUrl }
      ]
    },
    {
      "@type": "ItemList",
      name: "Condomínios com acesso ao Lago de Palmas",
      itemListElement: condos.map((condo, index) => ({ "@type": "ListItem", position: index + 1, name: condo.name, url: `${pageUrl}#${condo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` }))
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } }))
    }
  ]
};

export default function LakeCondominiumsGuidePage() {
  return (
    <div className="lake-guide-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideStructuredData) }} />

      <section className="lake-guide-hero">
        <Image src="/brand/palmas-lake/palmas-lake-overview.jpg" alt="Vista do Lago de Palmas e do complexo Palmas Lake" fill priority sizes="100vw" className="lake-guide-hero-image" />
        <div className="lake-guide-hero-overlay" />
        <div className="container lake-guide-hero-content">
          <div className="lake-guide-hero-copy">
            <p className="lake-guide-eyebrow"><Waves size={16} /> Pesquisa de mercado · Palmas/TO</p>
            <h1>Condomínios fechados com acesso ao Lago de Palmas</h1>
            <p className="lake-guide-hero-lede">Um guia para comparar lotes, casas, apartamentos, infraestrutura, localização e valores anunciados nos principais empreendimentos beira-lago.</p>
            <div className="lake-guide-hero-actions">
              <a className="button button-primary" href="#comparativo">Ver comparação <ArrowRight size={17} /></a>
              <a className="lake-guide-hero-link" href="#localizacao">Ver localizações e distâncias <Navigation size={16} /></a>
            </div>
            <p className="lake-guide-hero-updated">Atualizado em 9 de outubro de 2026 · por Pedro Soares, CRECI 5861-TO</p>
          </div>
          <div className="lake-guide-broker-card">
            <Image src="/brand/pedro-portrait-3.png" alt="Pedro Soares, corretor de imóveis em Palmas" width={420} height={520} />
            <div><strong>Pedro Soares</strong><span>Corretor de imóveis em Palmas</span><small>Atendimento para compra, construção e investimento.</small></div>
          </div>
        </div>
      </section>

      <main>
        <section className="lake-guide-intro section">
          <div className="container lake-guide-intro-grid">
            <div><p className="lake-guide-kicker">Como usar este guia</p><h2>O lago muda a forma de morar — e também muda a análise do imóvel.</h2></div>
            <div><p>Esta pesquisa reúne seis empreendimentos com propostas diferentes: casas em lotes amplos, condomínios familiares, projetos em implantação e um complexo vertical de altíssimo padrão.</p><p>Os preços são ofertas públicas encontradas na pesquisa. Não são avaliações oficiais, negócios fechados ou garantia de disponibilidade.</p></div>
          </div>
        </section>

        <section className="lake-guide-comparison section" id="comparativo">
          <div className="container">
            <div className="lake-guide-section-heading"><div><p className="lake-guide-kicker">Visão geral</p><h2>Compare os seis empreendimentos</h2></div><p>Use os valores como referência inicial e confirme documentação, posição do lote, padrão construtivo, saldo devedor e condições atuais antes de decidir.</p></div>
            <div className="lake-guide-table-wrap"><table className="lake-guide-table"><caption className="sr-only">Comparativo de lotes, casas e apartamentos nos condomínios com acesso ao Lago de Palmas</caption><thead><tr><th>Empreendimento</th><th>Perfil</th><th>Lotes encontrados</th><th>Terreno menor anúncio</th><th>Casa ou unidade</th></tr></thead><tbody>{condos.map((condo) => <tr key={condo.name}><th scope="row"><a href={`#${condo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{condo.name}</a><span>{condo.region}</span></th><td>{condo.group}</td><td>{condo.lots}</td><td>{condo.landPrice}</td><td>{condo.homePrice}</td></tr>)}</tbody></table></div>
          </div>
        </section>

        <section className="lake-guide-cards section" id="empreendimentos">
          <div className="container"><div className="lake-guide-section-heading"><div><p className="lake-guide-kicker">Análise por empreendimento</p><h2>O diferencial de cada endereço</h2></div><p>Condomínio fechado, acesso à água e padrão de imóvel não significam a mesma coisa. A comparação precisa respeitar o perfil de cada projeto.</p></div><div className="lake-guide-card-grid">{condos.map((condo) => { const id = condo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"); return <article className="lake-guide-condo-card" id={id} key={condo.name}>{condo.image ? <figure className="lake-guide-condo-image"><Image src={condo.image} alt={condo.imageAlt ?? condo.name} fill sizes="(max-width: 900px) 100vw, 50vw" /><figcaption>{condo.imageSourceUrl?.startsWith("/") ? <Link href={condo.imageSourceUrl}>{condo.imageSource}</Link> : <a href={condo.imageSourceUrl} target="_blank" rel="noreferrer">{condo.imageSource}</a>}</figcaption></figure> : <div className="lake-guide-condo-image lake-guide-condo-image--missing"><MapPinned size={26} /><span>Foto pública identificável não localizada nesta pesquisa.</span></div>}<div className="lake-guide-condo-card-head"><div><span className="lake-guide-badge">{condo.group}</span><h3>{condo.name}</h3><p>{condo.region}</p></div><MapPinned size={24} /></div><p className="lake-guide-condo-summary">{condo.summary}</p><dl className="lake-guide-specs"><div><dt>Lotes</dt><dd>{condo.lots}</dd></div><div><dt>Terreno anunciado</dt><dd>{condo.landPrice}</dd></div><div><dt>Casa/unidade</dt><dd>{condo.homePrice}</dd></div></dl><p className="lake-guide-highlight"><Waves size={17} /> {condo.highlight}</p><p className="lake-guide-caution"><ShieldCheck size={16} /> {condo.caution}</p><div className="lake-guide-card-actions"><a href={mapsSearchUrl(condo.mapQuery)} target="_blank" rel="noreferrer"><MapPinned size={15} /> Abrir no Google Maps</a><a href={mapsDirectionsUrl(condo.mapQuery)} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Traçar rota desde a Praça</a></div></article>; })}</div></div>
        </section>

        <section className="lake-guide-location section" id="localizacao">
          <div className="container">
            <div className="lake-guide-location-heading"><div><p className="lake-guide-kicker">Localização</p><h2>Onde ficam e como chegar</h2></div><p>As distâncias abaixo são estimativas de referência, arredondadas para comparação. O Google Maps deve ser consultado para a rota atual, portaria correta e tempo de deslocamento.</p></div>
            <div className="lake-guide-map-note"><MapPinned size={24} /><div><strong>Abra cada empreendimento no Google Maps</strong><span>Os botões da seção anterior usam o nome do empreendimento como destino e oferecem busca e rota a partir da Praça dos Girassóis.</span></div><a href={mapsSearchUrl("Condomínios beira-lago Palmas TO")} target="_blank" rel="noreferrer">Mapa geral <ExternalLink size={15} /></a></div>
            <div className="lake-guide-distance-wrap"><table className="lake-guide-distance-table"><caption>Distâncias aproximadas de referência em relação a pontos de Palmas</caption><thead><tr><th>Empreendimento</th>{distancesHeaders.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{condos.map((condo) => <tr key={condo.name}><th scope="row">{condo.name}</th>{condo.distances.map((distance, index) => <td key={`${condo.name}-${index}`}>{distance}</td>)}</tr>)}</tbody></table></div>
            <p className="lake-guide-distance-footnote">* Distâncias estimadas para orientação editorial. A localização exata dentro de cada condomínio, o acesso utilizado e a rota selecionada podem alterar os números.</p>
          </div>
        </section>

        <section className="lake-guide-choose section">
          <div className="container"><div className="lake-guide-section-heading"><div><p className="lake-guide-kicker">Leitura imobiliária</p><h2>Qual perfil combina com cada condomínio?</h2></div></div><div className="lake-guide-choose-grid"><article><strong>Grandes terrenos</strong><p>Polinésia, para projetos com jardins, lazer privativo e arquitetura personalizada.</p></article><article><strong>Marina e variedade de casas</strong><p>Caribe Residence, para quem busca estrutura de resort e diferentes faixas de imóveis prontos.</p></article><article><strong>Golfe e público específico</strong><p>Caribe Golf & Spa, com campo de golfe como diferencial de posicionamento.</p></article><article><strong>Entrada menor em implantação</strong><p>Tahiti, desde que o comprador aceite analisar maturação, entrega e regras de construção.</p></article><article><strong>Terrenos mais padronizados</strong><p>Mirante do Lago, com perfil familiar e manutenção potencialmente mais simples.</p></article><article><strong>Altíssimo padrão vertical</strong><p>Palmas Lake, para apartamentos, lofts e serviços integrados, não para construir uma casa.</p></article></div></div>
        </section>

        <section className="lake-guide-form-section section" id="atendimento"><div className="container lake-guide-form-grid-wrap"><div className="lake-guide-form-copy"><p className="lake-guide-kicker">Próxima etapa</p><h2>Quer comparar oportunidades disponíveis hoje?</h2><p>Me diga se você procura terreno, casa pronta ou apartamento. Eu posso separar opções por condomínio, orçamento, metragem e objetivo de compra.</p><ul><li><ShieldCheck size={17} /> Seleção individual por perfil</li><li><ShieldCheck size={17} /> Informações comerciais atualizadas</li><li><ShieldCheck size={17} /> Atendimento direto pelo WhatsApp</li></ul></div><LakeCondominiumsGuideForm /></div></section>

        <section className="lake-guide-method section"><div className="container lake-guide-method-grid"><div><p className="lake-guide-kicker">Metodologia</p><h2>Como esta pesquisa deve ser interpretada</h2></div><div><p>O levantamento considera anúncios públicos, materiais institucionais e referências documentais consultadas em 9 de outubro de 2026. Anúncios podem sair do ar, mudar de valor ou representar ágio, saldo devedor, unidade específica ou condição promocional.</p><p>Antes de comprar, confirme matrícula, convenção, infraestrutura entregue, taxas, saldo de financiamento, regras de construção, acesso à água e situação da incorporação.</p><p>As imagens dos cards são referências públicas atribuídas às fontes indicadas nas legendas. Elas não representam necessariamente a condição atual do condomínio e devem ser substituídas por material autorizado caso o titular solicite.</p><p className="lake-guide-sources"><strong>Fontes de referência:</strong> <a href="https://www.palmas.to.gov.br/wp-content/uploads/2024/01/Produto-2-Diagnostico-estrategico-a-area-e-das-atividades-turisticas-volume-1.pdf" target="_blank" rel="noreferrer">diagnóstico turístico da Prefeitura</a> e <a href="https://www.lnurbanismo.com.br/empreendimentos/caribe-residence-and-resort" target="_blank" rel="noreferrer">material institucional do Caribe Residence</a>.</p></div></div></section>

        <section className="lake-guide-faq section" id="perguntas"><div className="container"><p className="lake-guide-kicker">Perguntas frequentes</p><h2>Antes de escolher seu endereço</h2><div className="lake-guide-faq-grid">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
      </main>
    </div>
  );
}
