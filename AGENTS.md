# Padrão de landing pages de imóveis

Consulte `docs/templates/NOVA_LANDING_PAGE_IMOVEL.md` sempre que o usuário pedir uma landing page para um imóvel à venda ou para locação.

## Regras obrigatórias

- Cadastre ou atualize o imóvel em `Property` e as imagens em `PropertyMedia`.
- Registre uma `LandingPage` com vínculo formal ao imóvel, slug estável e URL pública canônica.
- Use uma landing dedicada como URL canônica; faça `/imoveis/<slug>` redirecionar para ela.
- Garanta que o imóvel publicado apareça na home, em “últimos imóveis” e nos filtros públicos de `/imoveis/prontos`.
- Use o formulário `POST /api/public/leads/property-interest` com `propertySlug`, `landingPageSlug`, `sourcePage`, atribuição e consentimento LGPD.
- Registre CTA, início/envio de formulário e clique no WhatsApp sem criar rastreamento duplicado.
- Inclua metadata SEO, Open Graph, Twitter Card, dados estruturados, sitemap, alt text e URLs sem conteúdo duplicado.
- Só use preço, disponibilidade, localização, avaliações e características confirmados; mantenha “sob consulta” quando faltar fonte.
- Crie uma migration nova para cada cadastro ou alteração de dados do imóvel. Nunca edite migration já aplicada.

## Validação mínima

Execute `npm run prisma:generate`, `npx prisma validate`, `npx tsc --noEmit`, `npm run lint`, `npm run build` e `git diff --check`.

Separe no relatório o que foi validado localmente, o que foi aplicado no banco, o que foi publicado e o que foi confirmado no domínio público.
