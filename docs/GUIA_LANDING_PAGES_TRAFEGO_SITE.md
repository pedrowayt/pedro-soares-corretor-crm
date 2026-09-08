# Guia obrigatório: tráfego do site em novas Landing Pages

Este documento deve ser consultado sempre que uma nova landing page pública for criada, alterada ou publicada no site Pedro Soares Corretor.

Objetivo: toda landing deve permitir responder no CRM:

- quantas páginas foram vistas;
- quantas sessões anônimas chegaram;
- quais páginas receberam mais acessos;
- de onde os acessos vieram;
- quais acessos viraram leads ou contatos.

## Regra principal

Nenhuma landing page está pronta apenas porque o layout aparece no navegador. A entrega só está completa quando a página também estiver conectada ao rastreamento, à atribuição do lead, ao consentimento e à conferência no CRM.

## Como o rastreamento funciona hoje

O rastreamento geral é automático para páginas públicas renderizadas pelo `SiteChrome`:

- `components/layout/site-chrome.tsx` monta o rastreador público;
- `components/public/site-visit-tracker.tsx` registra uma visita por rota e sessão;
- o rastreamento só começa quando o visitante concede analytics no banner de cookies;
- a sessão é anônima e fica em `sessionStorage`;
- não registrar IP, nome, telefone, e-mail ou qualquer dado pessoal no evento de pageview;
- a API é `POST /api/public/site-visits`;
- os dados ficam em `SiteVisit`, no `prisma/schema.prisma`;
- o dashboard lê os dados por `lib/data/site-traffic.ts`.

Não adicionar um segundo pageview manual para uma landing que já está dentro do `SiteChrome`. Isso duplicará as visitas.

Se a landing for renderizada fora do `SiteChrome`, ela precisa ser integrada ao mesmo mecanismo antes da publicação. Não criar um tracker paralelo com outra sessão, outro cookie ou outro endpoint.

## Checklist de implementação

### 1. Definir a rota e a identificação

- [ ] A rota pública é única e está definida, por exemplo `/nome-da-landing`.
- [ ] O `landingPageSlug` é único e não é confundido automaticamente com o slug do empreendimento.
- [ ] A página não foi colocada dentro de `/crm` ou `/admin`.
- [ ] A rota está coberta pelo `SiteChrome`; se for uma landing standalone, conferir também a lista de rotas standalone nesse componente.

### 2. Registrar no catálogo e no CRM

- [ ] Adicionar a página ao catálogo editorial correto, normalmente `lib/data/landing-pages.ts`.
- [ ] Criar uma migration nova para registrar a linha em `LandingPage` quando a página depender do catálogo de marketing.
- [ ] Conferir status `PUBLISHED`, slug, caminho público e vínculo com empreendimento quando houver vínculo real.
- [ ] Conferir se a página aparece em `/crm/landing-pages`.
- [ ] Não criar empreendimento, preço, disponibilidade ou classificação comercial sem fonte confirmada.

### 3. Preparar formulários e CTAs

Todo formulário público deve preservar, quando aplicável:

```ts
{
  sourcePage: "/nome-da-landing",
  landingPageSlug: "nome-da-landing",
  attribution: getPublicAttribution(),
  lgpdConsent: true
}
```

- [ ] `sourcePage` corresponde à URL real da página.
- [ ] `landingPageSlug` corresponde exatamente ao registro em `LandingPage`.
- [ ] O formulário exige consentimento LGPD quando houver coleta de dados.
- [ ] O lead mantém primeira atribuição e última atribuição, sem sobrescrever a origem original em contatos repetidos.
- [ ] Clique em WhatsApp informa a página e o contexto corretos.
- [ ] CTA, início de formulário e envio não bloqueiam a conversão se o endpoint de analytics estiver indisponível.
- [ ] Não tratar clique em WhatsApp como prova de conversa efetiva; registrar o evento com o contexto correto.

Para eventos específicos da landing, usar o mecanismo existente de `LandingPageEvent`/`LandingPageTracker` e seus tipos (`PAGE_VIEW`, `CTA_CLICK`, `FORM_START`, `FORM_SUBMISSION`, `WHATSAPP_CLICK` e `DOWNLOAD`). O pageview geral do site e o evento específico da landing têm objetivos diferentes e não devem ser somados como se fossem a mesma métrica.

### 4. Preparar links de campanha

Usar parâmetros UTM nas campanhas:

```text
?utm_source=instagram&utm_medium=organic&utm_campaign=nome-da-campanha&utm_content=criativo-01
```

- [ ] `utm_source` identifica o canal real.
- [ ] `utm_medium` diferencia orgânico, pago, indicação ou outro meio.
- [ ] `utm_campaign` identifica a campanha.
- [ ] `utm_content` diferencia criativos, quando necessário.
- [ ] `gclid` ou outro identificador de campanha não é copiado para campos de lead como texto livre.
- [ ] Os parâmetros não carregam nome, telefone, e-mail ou outro dado pessoal.

O tracker preserva a atribuição da sessão ao navegar entre páginas. Não remover esse comportamento nem substituir a origem por `Direto` em cada navegação interna.

## Conferência obrigatória antes de publicar

### Teste de consentimento

- [ ] Abrir a landing em janela anônima ou limpar o consentimento.
- [ ] Recusar cookies opcionais.
- [ ] Confirmar que a página funciona sem erro e que não há envio para `/api/public/site-visits`.
- [ ] Aceitar analytics.
- [ ] Confirmar um envio para `/api/public/site-visits` com `sessionId`, `path` e sem dados pessoais.

### Teste de navegação

- [ ] Navegar para outra página pública.
- [ ] Confirmar que a sessão permanece a mesma.
- [ ] Confirmar que o novo `path` é registrado uma única vez.
- [ ] Abrir a landing com UTM e navegar internamente.
- [ ] Confirmar que a origem da sessão continua associada à campanha.

### Teste de conversão

- [ ] Enviar um lead de teste somente com autorização explícita para criar esse registro.
- [ ] Confirmar `sourcePage`, `landingPageSlug`, origem, primeira atribuição e consentimento no detalhe do lead.
- [ ] Conferir o evento ou interação correspondente no CRM.
- [ ] Remover ou identificar claramente qualquer lead de teste conforme a orientação do responsável.

### Teste no CRM

- [ ] Abrir `/crm/dashboard`.
- [ ] Conferir o bloco `Tráfego do site`.
- [ ] Conferir pageviews de hoje, pageviews dos últimos 28 dias, sessões, páginas mais acessadas e origem dos acessos.
- [ ] Conferir que `Visitas agendadas` continua significando compromisso comercial, não pageview.
- [ ] Abrir `/crm/landing-pages` e conferir a métrica específica da landing.

## Validação técnica

Executar antes de entregar:

```bash
npm run prisma:generate
npx prisma validate
npx tsc --noEmit
npm run lint
npm run build
git diff --check
```

Se o build informar que o Postgres local está indisponível em `localhost:5434`, separar essa limitação da validação de código. Isso não é prova de que a landing falhou, mas também não autoriza declarar o banco de produção validado.

Quando houver alteração de banco:

- [ ] Criar uma migration nova; nunca editar migration já aplicada.
- [ ] Confirmar que o deploy executará `prisma migrate deploy`.
- [ ] Só declarar os dados reais do dashboard validados depois de conferir o ambiente publicado e o banco de produção.

## Critérios de aceite

A landing só pode ser considerada pronta quando:

1. a rota pública funciona em desktop e mobile;
2. o consentimento controla o rastreamento;
3. o pageview geral aparece em `SiteVisit` sem PII;
4. a campanha UTM preserva a origem da sessão;
5. o formulário preserva `sourcePage`, `landingPageSlug` e atribuição;
6. a landing está visível no catálogo/CRM correto;
7. o dashboard diferencia tráfego do site de visitas comerciais;
8. build, tipos, lint e migration foram conferidos;
9. a rota publicada foi aberta no domínio real após o deploy.

## Arquivos de referência

- `docs/GUIA_LANDING_PAGES_CRM.md`
- `components/layout/site-chrome.tsx`
- `components/public/site-visit-tracker.tsx`
- `components/public/landing-page-tracker.tsx`
- `lib/attribution.ts`
- `lib/data/site-traffic.ts`
- `lib/data/marketing-landing-pages.ts`
- `app/api/public/site-visits/route.ts`
- `app/api/public/landing-page-events/route.ts`
- `app/crm/dashboard/page.tsx`
- `app/crm/landing-pages/page.tsx`
- `prisma/schema.prisma`
