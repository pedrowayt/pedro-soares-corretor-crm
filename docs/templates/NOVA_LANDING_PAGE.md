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
- [ ] A imagem principal está em `public/` ou em uma URL pública validada.
- [ ] O registro `LandingPage` usa o mesmo conceito de slug e `publicPath`.
- [ ] `LandingPage.linkedDevelopmentId` aponta para o empreendimento correto.
- [ ] O formulário usa `development-interest` ou outro fluxo aprovado.
- [ ] O `landingPageSlug` e `sourcePage` correspondem à rota real.
- [ ] A página só foi marcada como `PUBLISHED` depois da revisão comercial.
- [ ] O card aparece em `/lancamentos` e na busca de `/imoveis/prontos`.
- [ ] Os filtros por cidade, tipo, quartos, área e preço foram conferidos.

## Regra de publicação

Landing pages de serviço, conteúdo ou captação de proprietários não entram no catálogo de lançamentos. Para aparecer na busca, a página precisa representar um empreendimento ou uma oportunidade imobiliária publicada.

Quando preço ou disponibilidade não estiverem confirmados, manter o campo vazio e exibir `Sob consulta`. Não preencher valores estimados apenas para fazer o card aparecer.
