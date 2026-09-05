import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check, ChevronDown, CircleDollarSign, Handshake, Megaphone, Network, ShieldCheck, Target, Users, Video } from "lucide-react";
import { ExclusiveManagementLeadForm, ExclusiveManagementWhatsAppButton } from "@/components/public/exclusive-management-form";
import { LandingPageTracker } from "@/components/public/landing-page-tracker";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/gestao-exclusiva`;

export const metadata: Metadata = {
  title: "Gestão Exclusiva para vender seu imóvel em Palmas | Pedro Soares",
  description: "Venda seu imóvel em Palmas com estratégia, divulgação profissional, visitas organizadas e um único responsável pela negociação.",
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: pageUrl,
    title: "Venda seu imóvel com estratégia e um único responsável",
    description: "Conheça a Gestão Exclusiva de Venda de Pedro Soares, corretor de imóveis em Palmas/TO.",
    images: [{ url: `${siteUrl}/brand/pedro-portrait-3.png` }]
  }
};

const principles = [
  { icon: Target, title: "Estratégia", text: "Preço, posicionamento e canais escolhidos para o perfil do seu imóvel." },
  { icon: ShieldCheck, title: "Segurança", text: "Informações organizadas, visitas autorizadas e propostas mais claras." },
  { icon: Network, title: "Alcance", text: "Uma rede de parceiros, compradores, portais e divulgação digital." },
  { icon: Handshake, title: "Condução", text: "Um responsável central para acompanhar a negociação até a conclusão." }
];

const steps = [
  ["01", "Análise do imóvel", "Entendemos localização, características, documentação, prazo e perfil provável do comprador."],
  ["02", "Plano de venda", "Definimos posicionamento, preço de divulgação, argumentos e canais mais adequados."],
  ["03", "Material profissional", "Organizamos fotos, vídeos, descrição, diferenciais e condições em uma comunicação única."],
  ["04", "Distribuição", "O imóvel chega à rede de parceiros, investidores, portais, redes sociais e campanhas."],
  ["05", "Negociação", "Você recebe informações organizadas sobre interessados, visitas e propostas para decidir com clareza."]
];

const channels = [
  [Megaphone, "Site e redes sociais", "Apresentação clara, conteúdo direcionado e divulgação para compradores e investidores."],
  [Video, "Fotos e vídeos", "Material alinhado para que o imóvel seja percebido com valor e consistência."],
  [Users, "Parceiros e imobiliárias", "Corretores com compradores podem participar por parceria, sem criar uma nova gestão para você."],
  [CircleDollarSign, "Base e campanhas", "Relacionamento comercial e mídia paga quando o perfil do imóvel justificar o investimento."]
];

const faqs = [
  ["Vou ficar impedido de vender meu próprio imóvel?", "As condições da exclusividade ficam previstas no contrato firmado entre as partes. Tudo é apresentado antes para que você saiba exatamente como funcionará a relação."],
  ["Outros corretores poderão trabalhar o imóvel?", "Sim. A parceria é bem-vinda. O corretor apresenta o comprador e a negociação continua organizada por meio de um responsável central."],
  ["Quem define o preço?", "Você tem a decisão final. Eu apresento uma análise comercial e recomendo um posicionamento coerente com o mercado e com o objetivo da venda."],
  ["Preciso aceitar uma proposta?", "Não. Toda proposta é submetida a você, que decide livremente se deseja aceitar, recusar ou fazer uma contraproposta."],
  ["Como serão realizadas as visitas?", "As visitas são previamente organizadas e realizadas conforme o seu conhecimento, autorização e disponibilidade."],
  ["Como receberei informações sobre a venda?", "Você poderá acompanhar interessados, visitas, propostas e o andamento da estratégia de comercialização."]
];

export default function GestaoExclusivaPage() {
  return (
    <div className="exclusive-landing">
      <LandingPageTracker landingPageSlug="gestao-exclusiva" />

      <section className="exclusive-hero">
        <div className="exclusive-shell exclusive-hero__grid">
          <div className="exclusive-hero__copy">
            <span className="exclusive-kicker">Gestão Exclusiva de Venda · Palmas/TO</span>
            <h1>Seu imóvel merece uma estratégia, não apenas um anúncio.</h1>
            <p className="exclusive-hero__lede">Um único responsável pela venda. Uma rede inteira trabalhando pelo seu imóvel.</p>
            <p className="exclusive-hero__text">Organizo a divulgação, os interessados, as visitas e as propostas para que você tenha alcance sem perder clareza e controle.</p>
            <div className="exclusive-hero__actions">
              <a className="exclusive-button exclusive-button--gold" href="#conversa">Quero avaliar meu imóvel <ArrowRight size={17} /></a>
              <a className="exclusive-text-link" href="#como-funciona">Entender como funciona <ArrowRight size={15} /></a>
            </div>
            <p className="exclusive-signature">Pedro Soares <span>Corretor de Imóveis · CRECI 5861-TO</span></p>
          </div>
          <div className="exclusive-hero__portrait">
            <div className="exclusive-hero__halo" />
            <Image src="/brand/pedro-portrait-3.png" alt="Pedro Soares, corretor de imóveis" fill priority sizes="(max-width: 800px) 74vw, 460px" />
            <span className="exclusive-hero__stamp">01<br /><small>gestão<br />centralizada</small></span>
          </div>
        </div>
      </section>

      <section className="exclusive-proof">
        <div className="exclusive-shell exclusive-proof__grid">
          <p><strong>Um imóvel.</strong><br />Um preço oficial.</p>
          <p><strong>Uma comunicação.</strong><br />Uma estratégia.</p>
          <p><strong>Um responsável.</strong><br />Mais alcance.</p>
        </div>
      </section>

      <section className="exclusive-section exclusive-section--light" id="por-que">
        <div className="exclusive-shell">
          <div className="exclusive-section-heading">
            <span className="exclusive-kicker">Por que trabalhar com exclusividade?</span>
            <h2>Menos ruído para você. Mais consistência para a venda.</h2>
            <p>Quando vários anúncios circulam sem uma gestão central, podem aparecer preços, fotos, informações e propostas diferentes. A gestão exclusiva cria uma única estratégia comercial para o imóvel.</p>
          </div>
          <div className="exclusive-principles">
            {principles.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={24} strokeWidth={1.5} /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="exclusive-section exclusive-section--ink">
        <div className="exclusive-shell exclusive-network-grid">
          <div>
            <span className="exclusive-kicker">A exclusividade está na gestão</span>
            <h2>O alcance continua aberto.</h2>
            <p>O imóvel não fica restrito apenas aos meus clientes. Trabalho com corretores parceiros, imobiliárias, investidores, portais, redes sociais, campanhas e indicações.</p>
            <p className="exclusive-highlight">Se outro corretor tiver um comprador interessado, ele pode apresentar o cliente e participar da negociação por parceria.</p>
            <a className="exclusive-text-link exclusive-text-link--light" href="#conversa">Conhecer o modelo <ArrowRight size={15} /></a>
          </div>
          <div className="exclusive-network-diagram" aria-label="Fluxo da gestão exclusiva">
            <div className="exclusive-node exclusive-node--owner">Proprietário</div>
            <div className="exclusive-node exclusive-node--manager">Pedro Soares<br /><small>gestão da venda</small></div>
            <div className="exclusive-network-branches"><span>Parceiros</span><span>Portais</span><span>Investidores</span><span>Campanhas</span><span>Indicações</span></div>
            <div className="exclusive-node exclusive-node--buyers">Potenciais compradores</div>
          </div>
        </div>
      </section>

      <section className="exclusive-section exclusive-section--cream" id="como-funciona">
        <div className="exclusive-shell">
          <div className="exclusive-section-heading exclusive-section-heading--split"><div><span className="exclusive-kicker">Como funciona</span><h2>Da análise à negociação, cada etapa tem um propósito.</h2></div><p>Não basta publicar algumas fotos e esperar. O trabalho começa antes do anúncio e continua até a decisão final do proprietário.</p></div>
          <div className="exclusive-steps">{steps.map(([number, title, text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="exclusive-section exclusive-section--light">
        <div className="exclusive-shell">
          <div className="exclusive-section-heading"><span className="exclusive-kicker">Divulgação profissional</span><h2>Uma rede inteira trabalhando pelo seu imóvel.</h2><p>Os canais são escolhidos de acordo com o perfil da propriedade e com a estratégia definida.</p></div>
          <div className="exclusive-channels">{channels.map(([Icon, title, text]) => <article key={title as string}><Icon size={23} strokeWidth={1.5} /><h3>{title as string}</h3><p>{text as string}</p></article>)}</div>
        </div>
      </section>

      <section className="exclusive-compare">
        <div className="exclusive-shell">
          <div className="exclusive-section-heading"><span className="exclusive-kicker">A diferença está na condução</span><h2>Anunciar é colocar no mercado. Gerir é conduzir a venda.</h2></div>
          <div className="exclusive-compare__table"><div className="exclusive-compare__head"><span>Modelo pulverizado</span><span>Gestão exclusiva</span></div>{[["Vários anúncios e preços possíveis", "Um preço e uma comunicação oficiais"], ["Contatos e visitas sem uma central", "Interessados e visitas organizados"], ["Propostas chegando de várias formas", "Propostas estruturadas para sua análise"], ["O proprietário administra as relações", "Um responsável acompanha o processo"]].map(([traditional, exclusive]) => <div className="exclusive-compare__row" key={traditional}><p><span className="exclusive-x">×</span>{traditional}</p><p><Check size={17} />{exclusive}</p></div>)}</div>
        </div>
      </section>

      <section className="exclusive-section exclusive-section--light">
        <div className="exclusive-shell exclusive-control-grid"><div><span className="exclusive-kicker">Você mantém o controle</span><h2>Exclusividade não significa perder autonomia.</h2></div><div><p>As principais decisões continuam sendo suas: aceitar ou não uma proposta, definir condições, autorizar visitas e decidir quando concluir a venda.</p><p>Meu papel é levar informação, organização, estratégia e condução profissional para que você decida melhor.</p></div></div>
      </section>

      <section className="exclusive-section exclusive-section--cream">
        <div className="exclusive-shell exclusive-fit-grid"><div><span className="exclusive-kicker">Para quem valoriza organização</span><h2>Um modelo para quem quer vender com mais clareza.</h2></div><ul>{["Não quer administrar vários corretores", "Valoriza segurança e transparência", "Quer controlar melhor visitas e propostas", "Deseja ampliar a divulgação sem perder o comando", "Tem uma casa, apartamento, terreno, área rural ou imóvel comercial"].map((item) => <li key={item}><Check size={17} />{item}</li>)}</ul></div>
      </section>

      <section className="exclusive-section exclusive-section--light exclusive-faq"><div className="exclusive-shell"><div className="exclusive-section-heading"><span className="exclusive-kicker">Perguntas frequentes</span><h2>Antes de decidir, tenha clareza sobre o modelo.</h2></div><div className="exclusive-faq__list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="exclusive-contact" id="conversa">
        <div className="exclusive-shell exclusive-contact__grid"><div className="exclusive-contact__copy"><span className="exclusive-kicker">Vamos conversar sobre o seu imóvel?</span><h2>Seu patrimônio merece uma venda bem conduzida.</h2><p>Envie as primeiras informações e eu retorno para entender o imóvel, o momento e a estratégia mais adequada.</p><div className="exclusive-contact__identity"><Image src="/brand/pedro-portrait-3.png" alt="Pedro Soares" width={72} height={72} /><span><strong>Pedro Soares</strong><small>Corretor de Imóveis · CRECI 5861-TO</small><ExclusiveManagementWhatsAppButton className="exclusive-contact__whatsapp" compact>Falar no WhatsApp</ExclusiveManagementWhatsAppButton></span></div></div><ExclusiveManagementLeadForm /></div>
      </section>

      <footer className="exclusive-footer"><div className="exclusive-shell"><p><strong>Gestão Exclusiva de Venda</strong> · Pedro Soares · CRECI 5861-TO</p><small>A contratação, o prazo e as condições da exclusividade serão definidos em contrato entre as partes. As informações desta página têm caráter explicativo e não substituem a análise do imóvel nem a apresentação contratual.</small></div></footer>
    </div>
  );
}
