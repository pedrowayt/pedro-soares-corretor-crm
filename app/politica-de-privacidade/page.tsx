import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const baseUrl = getSiteUrl();
const LAST_UPDATED = "30 de maio de 2026";

export const metadata: Metadata = {
  title: "Política de Privacidade | Pedro Soares Imóveis",
  description:
    "Como Pedro Soares Imóveis coleta, usa e protege dados pessoais de visitantes, clientes e leads, em conformidade com a LGPD.",
  alternates: { canonical: `${baseUrl}/politica-de-privacidade` }
};

export default function PoliticaPrivacidadePage() {
  return (
    <section className="section">
      <div className="container legal-page" style={{ maxWidth: 880 }}>
        <p className="legal-eyebrow">Documento legal</p>
        <h1 className="section-title" style={{ marginTop: 0 }}>
          Política de Privacidade
        </h1>
        <p className="legal-meta">Última atualização: {LAST_UPDATED}</p>

        <article className="legal-article">
          <p>
            Esta Política de Privacidade descreve como <strong>Pedro Soares — Corretor de Imóveis (CRECI 5861-TO)</strong>{" "}
            (&ldquo;<strong>Pedro Soares Imóveis</strong>&rdquo;, &ldquo;nós&rdquo;) trata os dados pessoais que você
            compartilha ao navegar em <code>{baseUrl}</code>, preencher formulários, conversar pelo WhatsApp ou
            interagir com nossos canais. Está em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).
          </p>

          <h2>1. Controlador e Encarregado</h2>
          <p>
            <strong>Controlador:</strong> Pedro Soares — Corretor de Imóveis. CRECI 5861-TO. Palmas, Tocantins.
            <br />
            <strong>Encarregado pelo tratamento de dados (DPO):</strong> Pedro Soares.
            <br />
            <strong>Contato LGPD:</strong>{" "}
            <a href="https://wa.me/5563984845101" target="_blank" rel="noopener noreferrer">
              WhatsApp (63) 98484-5101
            </a>{" "}
            ou <a href="mailto:pedro@pedrosoares.com.br">pedro@pedrosoares.com.br</a>.
          </p>

          <h2>2. Dados que coletamos</h2>
          <h3>2.1 Dados fornecidos por você</h3>
          <ul>
            <li>
              <strong>Formulários de interesse / venda:</strong> nome, telefone/WhatsApp, e-mail, mensagem, imóvel ou
              empreendimento de interesse, bairro/cidade, faixa de preço.
            </li>
            <li>
              <strong>Cadastro para anunciar imóvel:</strong> além dos itens acima, dados sobre o imóvel ofertado
              (endereço, fotos, condições) e documentos quando pertinente.
            </li>
            <li>
              <strong>Newsletter do blog:</strong> e-mail.
            </li>
          </ul>
          <h3>2.2 Dados coletados automaticamente</h3>
          <ul>
            <li>
              <strong>Navegação:</strong> páginas acessadas, tempo de leitura, origem do tráfego (referrer), termos de
              busca internos, dispositivo e navegador, idioma.
            </li>
            <li>
              <strong>Endereço IP:</strong> usado pelos serviços de hospedagem e analytics; no Google Analytics o IP é
              anonimizado antes de ser armazenado (<code>anonymize_ip</code>).
            </li>
            <li>
              <strong>Cookies:</strong> ver{" "}
              <Link href="/politica-de-cookies">Política de Cookies</Link>.
            </li>
          </ul>

          <h2>3. Para que usamos seus dados</h2>
          <ul>
            <li>Responder ao seu contato e qualificar oportunidades de compra, locação ou investimento.</li>
            <li>Enviar opções de imóveis e lançamentos compatíveis com o seu interesse.</li>
            <li>Acompanhar a jornada de atendimento (CRM interno).</li>
            <li>Operar o blog, a newsletter e medir engajamento de forma agregada.</li>
            <li>Cumprir obrigações legais e regulatórias (CRECI, contratos, fiscal).</li>
            <li>Prevenir fraude, abuso e violações dos termos.</li>
          </ul>

          <h2>4. Bases legais (LGPD art. 7º e 11)</h2>
          <ul>
            <li>
              <strong>Consentimento</strong> — newsletter, cookies de marketing e analítico, comunicações promocionais.
            </li>
            <li>
              <strong>Execução de contrato ou procedimentos preliminares</strong> — atendimento comercial, propostas,
              visitas, intermediação de compra/venda/locação.
            </li>
            <li>
              <strong>Legítimo interesse</strong> — segurança do site, prevenção a fraude, melhoria do produto e
              relacionamento com leads que já demonstraram interesse explícito.
            </li>
            <li>
              <strong>Obrigação legal</strong> — emissão de notas, registros do CRECI, dever de guarda.
            </li>
          </ul>

          <h2>5. Compartilhamento com terceiros</h2>
          <p>
            Não vendemos seus dados. Compartilhamos apenas com parceiros necessários para operar o serviço, sob
            contratos de tratamento de dados (operadores) ou quando exigido por lei:
          </p>
          <ul>
            <li>
              <strong>Google LLC</strong> — Google Analytics 4 e Google Tag Manager para métricas anônimas de uso.
            </li>
            <li>
              <strong>Meta Platforms</strong> — Meta Pixel (Facebook/Instagram), quando ativado, para remarketing
              social.
            </li>
            <li>
              <strong>Cloudflare</strong> — entrega e otimização de imagens (Cloudflare Images / Stream).
            </li>
            <li>
              <strong>Railway / GitHub</strong> — infraestrutura de hospedagem e versionamento.
            </li>
            <li>
              <strong>OpenAI</strong> — geração de rascunhos editoriais para o blog. Conteúdo de leads não é enviado.
            </li>
            <li>
              <strong>WhatsApp / Meta Business</strong> — envio e recepção de mensagens via WhatsApp Business API.
            </li>
            <li>
              <strong>Autoridades competentes</strong> — quando houver ordem judicial ou exigência legal.
            </li>
          </ul>

          <h2>6. Transferência internacional</h2>
          <p>
            Alguns parceiros listados acima processam dados fora do Brasil (principalmente Estados Unidos). Sempre que
            isso ocorrer, exigimos cláusulas contratuais adequadas e mecanismos previstos no art. 33 da LGPD para
            garantir nível de proteção equivalente.
          </p>

          <h2>7. Retenção</h2>
          <ul>
            <li>
              <strong>Leads ativos</strong>: enquanto durar o relacionamento comercial + até 5 anos após o último
              contato, para histórico e atendimento futuro.
            </li>
            <li>
              <strong>Documentos contratuais</strong>: pelo prazo legal aplicável (mínimo 5 anos).
            </li>
            <li>
              <strong>Dados de navegação (analytics)</strong>: 14 meses no Google Analytics 4.
            </li>
            <li>
              <strong>Consentimento de cookies</strong>: 180 dias, renovado a cada visita confirmada.
            </li>
            <li>
              <strong>Inscritos na newsletter</strong>: até a sua solicitação de cancelamento.
            </li>
          </ul>

          <h2>8. Direitos do titular</h2>
          <p>Em qualquer momento você pode solicitar gratuitamente:</p>
          <ul>
            <li>Confirmação da existência de tratamento e acesso aos seus dados.</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>
              Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a LGPD.
            </li>
            <li>Portabilidade para outro fornecedor de serviço, quando aplicável.</li>
            <li>Eliminação dos dados tratados com base em consentimento.</li>
            <li>
              Informação sobre entidades públicas e privadas com as quais compartilhamos dados.
            </li>
            <li>Revogação do consentimento a qualquer momento, com efeitos não retroativos.</li>
            <li>Oposição a tratamento baseado em legítimo interesse.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, use os contatos do item 1. Responderemos em até 15 dias.
          </p>

          <h2>9. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger os dados, incluindo: HTTPS obrigatório, controle
            de acesso por papéis no CRM, segredos criptografados, autenticação por sessão de curta duração, registro de
            auditoria de alterações em conteúdo, e backups gerenciados pelo provedor de banco.
          </p>

          <h2>10. Crianças e adolescentes</h2>
          <p>
            O serviço é direcionado a maiores de 18 anos. Não tratamos intencionalmente dados de crianças e
            adolescentes. Se identificar coleta indevida, fale com o Encarregado para remoção imediata.
          </p>

          <h2>11. Alterações nesta política</h2>
          <p>
            Podemos atualizar este documento. A data de &ldquo;Última atualização&rdquo; no topo indica a versão
            vigente. Mudanças relevantes serão sinalizadas no banner de cookies ou por aviso no site.
          </p>
        </article>
      </div>
    </section>
  );
}
