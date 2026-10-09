# Nova landing page de lançamento

Use este arquivo como checklist antes de criar ou publicar uma landing page de empreendimento.

O filtro público não lê arquivos Markdown em tempo de execução. A entrada automática no catálogo acontece quando o empreendimento está cadastrado em `Development`, a página está registrada em `LandingPage`, ambas estão vinculadas e o empreendimento está publicado. Este documento garante que o cadastro seja criado com os dados necessários.

## Identificação do catálogo

```yaml
name: Nome comercial do empreendimento
slug: slug-estavel-do-empreendimento
publicPath: /rota-publica-da-landing
type: DEVELOPMENT
status: DRAFT
propertyType: APARTAMENTO
# Para casa de rua, use CASA. Para casa em condomínio, use CASA_EM_CONDOMINIO.
catalogPropertyTypes: [APARTAMENTO]
category: Apartamentos na planta
city: Palmas
district: Orla 14
image: /brand/empreendimento/fachada.webp
startingPrice: null
areaFromM2: null
bedroomsFrom: null
```

## Checklist de criação

- [ ] A rota pública é única e está coberta pelo `SiteChrome`.
- [ ] O empreendimento foi cadastrado em `Development`.
- [ ] `propertyType`, cidade, bairro e resumo foram preenchidos.
- [ ] A categoria pública foi definida; para casas em condomínio, usar `CASA_EM_CONDOMINIO`.
- [ ] A imagem principal está em `public/` ou em uma URL pública validada.
- [ ] O registro `LandingPage` usa o mesmo conceito de slug e `publicPath`.
- [ ] `LandingPage.linkedDevelopmentId` aponta para o empreendimento correto.
- [ ] O formulário usa `development-interest` ou outro fluxo aprovado.
- [ ] O `landingPageSlug` e `sourcePage` correspondem à rota real.
- [ ] A página só foi marcada como `PUBLISHED` depois da revisão comercial.
- [ ] O card aparece em `/lancamentos` e na busca de `/imoveis/prontos`.
- [ ] Os filtros por cidade, tipo, quartos, área e preço foram conferidos.

## Categoria de casas em condomínio

Quando a landing page representar uma casa ou sobrado dentro de condomínio fechado, classifique o empreendimento como `CASA_EM_CONDOMINIO` no cadastro do CRM. Para casa ou sobrado de rua, use `CASA`. Se a página ainda estiver no catálogo editorial legado, informe `propertyTypes: ["CASA_EM_CONDOMINIO"]` ou `propertyTypes: ["CASA"]` no objeto de `lib/data/landing-pages.ts`.

Depois de publicada, ela aparecerá automaticamente ao selecionar **Casa em condomínio** ou **Casa de rua** no filtro de tipo de imóvel.

## Regra de publicação

Landing pages de serviço, conteúdo ou captação de proprietários não entram no catálogo de lançamentos. Para aparecer na busca, a página precisa representar um empreendimento ou uma oportunidade imobiliária publicada.

Quando preço ou disponibilidade não estiverem confirmados, manter o campo vazio e exibir `Sob consulta`. Não preencher valores estimados apenas para fazer o card aparecer.
