# Pedro Soares Imóveis + CRM

Plataforma fullstack para captação, qualificação e fechamento de leads imobiliários, com foco em operação comercial para corretor e equipe pequena.

## Stack

- `Next.js 16` (App Router)
- `TypeScript`
- `Prisma + PostgreSQL`
- `Cloudflare Images + Cloudflare Stream`
- `WhatsApp Cloud API`
- `Redis` (previsto para fila/alertas em produção)

## Módulos implementados

### Site público
- Início (`/`)
- Comprar com filtros (`/comprar`)
- Imóvel individual (`/imoveis/[slug]`)
- Investidores (`/investidores`)
- Lançamentos (`/lancamentos`)
- Leilões e oportunidades (`/leiloes-oportunidades`)
- Venda seu imóvel (`/venda-seu-imovel`)
- Sobre (`/sobre`)
- Contato (`/contato`)

### CRM
- Dashboard (`/crm/dashboard`)
- Leads (`/crm/leads`)
- Funil (`/crm/funil`)
- Imóveis (`/crm/imoveis`)
- Proprietários (`/crm/proprietarios`)
- Visitas (`/crm/visitas`)
- Propostas (`/crm/propostas`)
- Tarefas (`/crm/tarefas`)
- Relatórios (`/crm/relatorios`)
- Configurações (`/crm/configuracoes`)

## API

### Público
- `GET /api/public/properties`
- `GET /api/public/properties/:slug`
- `POST /api/public/leads/property-interest`
- `POST /api/public/leads/seller-capture`
- `POST /api/public/whatsapp-click`

### CRM
- `POST /api/crm/leads`
- `PATCH /api/crm/leads/:id/stage`
- `POST /api/crm/tasks`
- `POST /api/crm/visits`
- `POST /api/crm/proposals`

### Mídia / Integrações
- `POST /api/media/images/direct-upload`
- `POST /api/media/videos/direct-upload`
- `POST /api/webhooks/cloudflare-images`
- `POST /api/webhooks/cloudflare-stream`
- `GET|POST /api/integrations/whatsapp/webhook`
- `POST /api/integrations/whatsapp/send-template`
- `GET /api/integrations/portals/feed.xml`

## Banco de dados

Todos os modelos centrais estão no `prisma/schema.prisma`:
- `User`, `Lead`, `LeadInteraction`, `PipelineStageHistory`
- `Property`, `PropertyMedia`, `Owner`
- `Visit`, `Proposal`, `Task`
- `InvestorOpportunity`, `AuctionCase`, `PortalPublication`
- `AuditLog`

## Setup local

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
```

3. Subir Postgres local:
```bash
docker compose up -d postgres
```

4. Gerar client Prisma e migrar:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Popular dados iniciais:
```bash
npm run db:seed
```

6. Rodar aplicação:
```bash
npm run dev
```

## Cloudflare

### Variantes de imagem
Cria variantes `thumb`, `card`, `gallery`, `hero`, `og`:
```bash
npm run cloudflare:setup:variants
```

### Variáveis necessárias
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_IMAGES_ACCOUNT_HASH` (usado para montar `https://imagedelivery.net/<hash>/<image_id>/<variant>`)
- `CLOUDFLARE_STREAM_CUSTOMER_CODE`
- `CLOUDFLARE_WEBHOOK_SECRET`

O upload direto de imagens retorna uma URL pública com a variante `public` quando `CLOUDFLARE_IMAGES_ACCOUNT_HASH` está configurado. A aplicação também permite imagens remotas de `imagedelivery.net` no `next.config.ts`.

## Segurança e governança

- RBAC básico em endpoints CRM (`ADMIN`/`CORRETOR`)
- Middleware para proteger `/crm` e `/api/crm` em produção
- Logs de auditoria em ações de lead
- Campos de consentimento LGPD em formulários públicos

## Deploy (Railway + Cloudflare)

- Aplicação Next.js e banco Postgres no Railway
- Imagens/vídeos no Cloudflare
- Webhooks do WhatsApp e Cloudflare apontando para domínio de produção
- `NEXT_PUBLIC_APP_URL` configurada com URL final
