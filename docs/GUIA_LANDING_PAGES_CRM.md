# Guia de integração de Landing Pages com o CRM

Este documento deve ser consultado pelo Codex sempre que uma nova landing page for criada para o site Pedro Soares Corretor.

## Regra principal

As landing pages são criadas e publicadas exclusivamente pelo Codex. O CRM não é um editor visual dessas páginas.

O CRM deve funcionar como a camada operacional da landing page:

```text
Codex cria e publica a página
        ↓
Landing page é registrada no CRM
        ↓
Visitante envia o formulário ou inicia contato
        ↓
Lead é criado ou atualizado
        ↓
Lead recebe landing page, origem e contexto
        ↓
CRM cria a tarefa de primeiro contato
        ↓
Corretor conduz o lead pelo funil
```

Nunca criar uma landing page nova sem preparar também sua identificação no CRM e seu fluxo de captura.

## O que o Codex deve entregar

Toda landing page nova deve ter:

- nome comercial;
- slug estável;
- caminho público único, por exemplo `/lake-village`;
- tipo da página;
- formulário ou CTA de captação;
- integração com uma API pública existente;
- registro na tabela `LandingPage`;
- migration de banco, quando for uma página nova;
- validação local antes da publicação.

O layout, textos, imagens e animações ficam no código da landing page. O status comercial, os leads e o acompanhamento ficam no CRM.

## Card automático na home

Toda landing page pública também deve ser registrada no catálogo editorial:

```text
lib/data/landing-pages.ts
```

Esse arquivo é a fonte única dos cards da home. A home consome todos os itens de `publicLandingPages`, então não é necessário editar `app/page.tsx` para cada novo empreendimento.

Ao criar uma landing nova, adicionar um objeto com:

- `slug` único;
- `href` apontando para o caminho público;
- `title` comercial;
- `category` ou tipo do produto;
- `location` resumida;
- `summary` curta para o card;
- `image` pública e existente em `public/`;
- `status` comercial real.

Exemplo:

```ts
{
  slug: "novo-empreendimento",
  href: "/novo-empreendimento",
  title: "Nome do empreendimento",
  category: "Studios e apartamentos",
  location: "Bairro · Palmas/TO",
  summary: "Resumo objetivo do projeto para a home.",
  image: "/brand/novo-empreendimento/fachada.webp",
  status: "Lançamento"
}
```

Depois de incluir o item, conferir se o link, a imagem e o texto aparecem na home. O card não deve ser adicionado em uma lista paralela dentro de `app/page.tsx`.

## Cadastro obrigatório da página

A entidade Prisma é `LandingPage`, definida em `prisma/schema.prisma`.

Campos essenciais:

| Campo | Como usar |
|---|---|
| `name` | Nome comercial exibido no CRM |
| `slug` | Identificador estável usado pela integração, sem espaços |
| `publicPath` | Caminho público exato, incluindo `/` inicial |
| `type` | `DEVELOPMENT`, `CAMPAIGN`, `REGION` ou `CAPTURE` |
| `status` | `DRAFT`, `REVIEW`, `PUBLISHED`, `PAUSED` ou `ARCHIVED` |
| `formKey` | Tipo de formulário usado pela página |
| `linkedDevelopmentId` | Usar quando houver empreendimento cadastrado no CRM |
| `deployUrl` | URL pública alternativa, se existir |
| `deployRef` | Commit, versão ou referência do deploy |
| `publishedAt` | Data em que a página foi publicada |

### Convenção de identificação

Use o mesmo conceito em todos os lugares:

```text
Nome: Lake Village Residences
slug: lake-village
publicPath: /lake-village
type: DEVELOPMENT
formKey: development-interest
```

O `slug` da landing page não deve ser confundido automaticamente com o slug do empreendimento. Eles podem ser iguais, mas não são obrigados a ser.

Exemplo do Lake Village:

```text
landingPageSlug: lake-village
developmentSlug: lake-village-residences
sourcePage: /lake-village
```

## Como o formulário deve enviar a captura

Todo formulário deve enviar `sourcePage` com o caminho real da página:

```tsx
sourcePage: window.location.pathname
```

Quando a página for uma landing page identificada, enviar também:

```tsx
landingPageSlug: "nome-da-landing"
```

O `sourcePage` continua obrigatório mesmo quando `landingPageSlug` é enviado. Ele serve como fallback humano, auditoria e conferência de URL.

## APIs de captura disponíveis

### Landing de empreendimento

Usar:

```text
POST /api/public/leads/development-interest
```

Enviar, quando disponíveis:

```json
{
  "name": "Nome do interessado",
  "whatsapp": "639999999999",
  "email": "pessoa@email.com",
  "message": "Contexto informado no formulário",
  "developmentSlug": "empreendimento-cadastrado",
  "developmentId": "id-do-empreendimento",
  "landingPageSlug": "nome-da-landing",
  "sourcePage": "/caminho-da-landing",
  "requestTable": false,
  "lgpdConsent": true
}
```

Essa API:

- cria ou atualiza o lead pelo WhatsApp;
- define origem `SITE`;
- define intenção `COMPRAR`;
- vincula o empreendimento e a landing page;
- registra uma interação `FORM_SUBMISSION` no canal `SITE`;
- registra pedido de tabela, quando aplicável;
- cria a tarefa de primeiro contato quando a landing é identificada.

### Interesse em imóvel

Usar:

```text
POST /api/public/leads/property-interest
```

Além dos campos do imóvel, enviar `sourcePage` e, se for uma landing registrada, `landingPageSlug`.

### Captação de proprietário

Usar:

```text
POST /api/public/leads/seller-capture
```

Além dos dados de captação, enviar `sourcePage` e `landingPageSlug` quando a captação vier de uma landing específica.

### Clique em WhatsApp

Usar:

```text
POST /api/public/whatsapp-click
```

Enviar `sourcePage`, `landingPageSlug` e o contexto do clique. O clique deve ser registrado como interação; não presumir que houve uma conversa real no WhatsApp.

## Como o lead deve aparecer no CRM

O lead deve conservar os dados comerciais já existentes e receber o vínculo adicional:

```text
Lead.landingPageId → LandingPage.id
Lead.sourcePage    → caminho público original
Lead.source       → SITE, TRAFEGO_PAGO ou outro canal real
Lead.stage         → NOVO no primeiro cadastro
```

Na tela de leads, deve ser possível identificar:

- nome e contato;
- data do cadastro;
- origem;
- landing page;
- página de cadastro;
- empreendimento ou imóvel relacionado;
- etapa do funil;
- status específico do lançamento, quando houver.

Na tela de detalhe do lead, a landing page deve aparecer no perfil e a submissão deve aparecer na linha do tempo.

## Tarefa de primeiro contato

Quando um lead for captado por uma landing page identificada, criar uma tarefa pendente:

```text
Fazer primeiro contato — Nome da Landing Page
```

Regras:

- prioridade `ALTA`;
- prazo padrão de 24 horas;
- vínculo com o lead;
- não criar uma nova tarefa pendente idêntica a cada atualização do mesmo lead;
- não enviar WhatsApp automaticamente;
- o corretor deve registrar o próximo passo no CRM.

O envio de mensagens externas, publicação, agendamento ou descarte de dados precisa continuar sendo uma ação explícita e auditável.

## Migration de banco

Cada nova landing page deve ser registrada por uma migration nova. Não editar migrations já aplicadas.

A migration deve:

1. criar ou atualizar a estrutura necessária;
2. registrar a landing page com slug e caminho únicos;
3. vincular o empreendimento somente se o registro correto já existir;
4. fazer backfill apenas de atribuição, quando necessário;
5. nunca apagar leads;
6. nunca alterar estágio, notas, consentimento, telefone ou e-mail dos leads existentes.

Exemplo de backfill permitido:

```sql
UPDATE "Lead"
SET "landingPageId" = 'id-da-landing'
WHERE "sourcePage" = '/caminho-da-landing'
  AND "landingPageId" IS NULL;
```

Não criar automaticamente um empreendimento incompleto apenas para preencher o vínculo. Se o empreendimento ainda não existe no CRM, manter o vínculo com a landing e registrar a pendência para cadastro correto.

## Checklist antes de publicar

### Código

- [ ] A página tem `publicPath` único.
- [ ] O formulário usa a API correta.
- [ ] `sourcePage` usa `window.location.pathname`.
- [ ] `landingPageSlug` está correto.
- [ ] O `developmentSlug` ou `developmentId` foi conferido no CRM.
- [ ] A página não contém senha, token, chave de API ou dado sensível exposto.
- [ ] O consentimento LGPD está presente quando houver captação de dados.
- [ ] CTAs de WhatsApp não são tratados como conversa confirmada.

### Banco

- [ ] Existe migration nova para a landing.
- [ ] `slug` e `publicPath` são únicos.
- [ ] A migration não remove nem sobrescreve dados comerciais.
- [ ] O backfill, se houver, altera apenas `landingPageId`.
- [ ] O empreendimento vinculado é o correto, sem substituição por outro.

### CRM

- [ ] A landing aparece em `/crm/landing-pages`.
- [ ] A URL pública abre corretamente.
- [ ] O filtro de leads por landing funciona.
- [ ] O lead aparece com landing e `sourcePage`.
- [ ] A timeline registra o formulário ou clique.
- [ ] A tarefa de primeiro contato é criada uma única vez.

### Validação local

Executar:

```bash
npm run prisma:generate
npx prisma validate
npx tsc --noEmit
npm run lint
npm run build
```

Se o build reclamar que o Postgres local está indisponível, separar essa limitação da validação de código. Não considerar um warning de conexão como prova de falha da landing, nem declarar integração de produção validada sem banco e deploy acessíveis.

## Publicação e pós-deploy

Depois da revisão do diff:

1. aplicar a migration no ambiente correto;
2. publicar a aplicação;
3. abrir a landing pública;
4. conferir o CRM em `/crm/landing-pages`;
5. conferir a lista de leads;
6. conferir a tarefa de primeiro contato;
7. conferir o vínculo com empreendimento ou imóvel;
8. verificar os logs sem expor dados pessoais.

O teste real do formulário deve usar dados de teste autorizados. Não usar dados pessoais reais apenas para validar a integração.

## O que não fazer

- Não criar landing page visualmente complexa dentro de `Páginas SEO`.
- Não substituir `LandingPage` por texto livre em `sourcePage`.
- Não remover `sourcePage` porque existe `landingPageSlug`.
- Não associar o lead a outro empreendimento apenas porque o nome é parecido.
- Não criar tarefas duplicadas a cada clique ou reenvio.
- Não enviar mensagens automáticas sem uma decisão explícita do fluxo.
- Não publicar uma landing sem migration quando ela depender de dados novos do CRM.
- Não considerar a página publicada como integrada só porque ela abre no navegador; a captura e o registro do CRM também precisam ser conferidos.

## Arquivos de referência

- `prisma/schema.prisma`
- `prisma/migrations/20260903090000_add_marketing_landing_pages/migration.sql`
- `lib/data/marketing-landing-pages.ts`
- `app/crm/landing-pages/page.tsx`
- `app/api/public/leads/development-interest/route.ts`
- `app/api/public/leads/property-interest/route.ts`
- `app/api/public/leads/seller-capture/route.ts`
- `app/api/public/whatsapp-click/route.ts`
- `components/public/lake-village-lead-form.tsx`

Este guia deve ser atualizado pelo Codex somente quando o modelo de integração, os endpoints ou as regras operacionais do CRM forem alterados.
