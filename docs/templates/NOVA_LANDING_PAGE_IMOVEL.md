# Nova landing page de imóvel

Use este arquivo sempre que for criada uma landing dedicada para um imóvel à venda ou para locação. Preencha os dados antes de implementar a página e mantenha a fonte comercial confirmada.

## Regra para o comando “cadastra imóvel”

Sempre que o usuário disser “cadastra imóvel”, “cadastre este imóvel” ou enviar os dados de um imóvel com esse objetivo, o resultado esperado é o pacote completo abaixo — não apenas um registro em `Property`:

- cadastrar ou atualizar `Property` e `PropertyMedia`;
- criar a rota e o componente visual da landing dedicada;
- registrar uma `LandingPage` publicada, com `formKey: property-interest` e `linkedPropertyId`;
- fazer `/imoveis/<slug>` redirecionar para a landing;
- conectar galeria, hero, descrição, SEO, mapa, CTA de WhatsApp, formulário LGPD e rastreamento ao CRM;
- verificar home, “últimos imóveis”, filtros públicos, CRM e sitemap;
- validar localmente, aplicar migration no banco de desenvolvimento e separar claramente o que ainda depende de deploy/cache/domínio.

Se faltarem dados comerciais, não invente: use “sob consulta” ou localização aproximada e registre os campos pendentes para confirmação.

## Brief comercial

```yaml
title: Nome comercial do imóvel
slug: slug-estavel-do-imovel
publicPath: /rota-canonica-da-landing
redirectFrom: /imoveis/slug-estavel-do-imovel
purpose: VENDA # VENDA, LOCACAO ou ambos conforme o cadastro
status: DISPONIVEL # DISPONIVEL ou RESERVADO para publicação
salePrice: null
rentPrice: null
# `price` continua sendo o valor principal legado do cadastro; preencha os dois
# campos acima quando o mesmo imóvel estiver disponível para venda e locação.
city: Palmas
district: Bairro ou quadra
address: null # não expor endereço completo sem autorização
postalCode: null
googleMapsUrl: null
areaM2: null
bedrooms: null
bathrooms: null
parkingSpaces: null
floorNumber: null
buildingHasElevator: null
condominiumFee: null
propertyTax: null
heroImage: /brand/imovel/hero.webp
gallery:
  - /brand/imovel/foto-01.webp
features: []
condominiumAmenities: []
nearbyPoints: []
description: Texto comercial baseado somente nos dados confirmados.
landingPageSlug: slug-estavel-da-landing
formKey: property-interest
```

## Estrutura obrigatória da página

- [ ] Hero com imagem principal, título, localização, preço e CTA.
- [ ] Galeria de fotos reais com legenda e alt text.
- [ ] Descrição do imóvel logo após a abertura/galeria.
- [ ] Resumo técnico: área, quartos, banheiros, vagas, andar e finalidade.
- [ ] Características do imóvel e estrutura do condomínio, quando houver.
- [ ] Mapa, localização, pontos de referência e serviços do entorno.
- [ ] Bloco de venda, locação ou ambas, sem misturar valores não confirmados.
- [ ] Quando houver venda e locação, os dois valores estão cadastrados em `Property.salePrice` e `Property.rentPrice` e os filtros públicos usam o valor correto.
- [ ] CTA de WhatsApp rastreado.
- [ ] Formulário de contato antes do rodapé, com consentimento LGPD.
- [ ] Layout responsivo e navegação acessível em celular.

## CRM, catálogo e banco

- [ ] `Property` foi criado ou atualizado com status e `publishedAt` corretos.
- [ ] `PropertyMedia` contém a hero e a galeria na ordem desejada.
- [ ] `LandingPage` usa slug e `publicPath` únicos e está vinculada ao `Property`.
- [ ] A landing aparece em `/crm/landing-pages` com o imóvel relacionado.
- [ ] O card aparece automaticamente na home, em “últimos imóveis” e nos filtros públicos.
- [ ] `/imoveis/<slug>` redireciona para `publicPath`.
- [ ] O formulário envia `propertySlug`, `landingPageSlug`, `sourcePage`, atribuição e `lgpdConsent`.
- [ ] O lead fica vinculado ao imóvel e à landing, com interação e tarefa de primeiro contato.
- [ ] Foi criada uma migration nova; migrations aplicadas não foram editadas.

## SEO e rastreamento

- [ ] `title`, `description`, keywords e canonical foram criados para a URL dedicada.
- [ ] Open Graph e Twitter Card usam a hero correta.
- [ ] Dados estruturados representam o imóvel e a oferta real.
- [ ] `BreadcrumbList` e FAQ só aparecem quando o conteúdo está visível na página.
- [ ] A URL canônica está no sitemap; a rota de redirect não é uma segunda página indexável.
- [ ] O rastreamento geral do `SiteChrome` não foi duplicado.
- [ ] Eventos específicos usam `LandingPageEvent`: CTA, formulário e WhatsApp.
- [ ] UTM e atribuição permanecem associadas à sessão e ao lead.

## Aceite técnico

```bash
npm run prisma:generate
npx prisma validate
npx tsc --noEmit
npm run lint
npm run build
git diff --check
```

Confirme separadamente: código local, migration aplicada, deploy, cache e comportamento no domínio público.
