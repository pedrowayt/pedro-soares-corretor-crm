export type DevelopmentStageValue =
  | "PRE_LAUNCH"
  | "LAUNCH"
  | "SALES"
  | "FOUNDATION_COMPLETED"
  | "CONSTRUCTION"
  | "ADVANCED_STRUCTURE"
  | "FINISHING"
  | "READY_TO_MOVE"
  | "DELIVERED";

export type PublicDevelopmentStage = "PRE_LAUNCH" | "LAUNCH" | "CONSTRUCTION" | "DELIVERED";

export type AppreciationPotentialValue = "BAIXO" | "MEDIO" | "ALTO" | "MUITO_ALTO";

type InvestmentStageMeta = {
  label: string;
  defaultProgressPct: number;
  appreciationPotential: AppreciationPotentialValue;
  perceivedRisk: string;
  futureLiquidity: string;
  buyerProfile: string;
  opportunityText: string;
};

export const publicDevelopmentStageOrder: PublicDevelopmentStage[] = [
  "PRE_LAUNCH",
  "LAUNCH",
  "CONSTRUCTION",
  "DELIVERED"
];

export const appreciationPotentialOptions: Array<{ value: AppreciationPotentialValue; label: string }> = [
  { value: "BAIXO", label: "Baixo" },
  { value: "MEDIO", label: "Médio" },
  { value: "ALTO", label: "Alto" },
  { value: "MUITO_ALTO", label: "Muito alto" }
];

export const developmentStageLabels: Record<DevelopmentStageValue, string> = {
  PRE_LAUNCH: "Breve Lançamento",
  LAUNCH: "Lançamento",
  SALES: "Lançamento",
  FOUNDATION_COMPLETED: "Fundação Concluída",
  CONSTRUCTION: "Em Construção",
  ADVANCED_STRUCTURE: "Estrutura Avançada",
  FINISHING: "Acabamento",
  READY_TO_MOVE: "Pronto para Morar",
  DELIVERED: "Entregue"
};

const adminDevelopmentStageOrder: DevelopmentStageValue[] = [
  "PRE_LAUNCH",
  "LAUNCH",
  "SALES",
  "FOUNDATION_COMPLETED",
  "CONSTRUCTION",
  "ADVANCED_STRUCTURE",
  "FINISHING",
  "READY_TO_MOVE",
  "DELIVERED"
];

export const developmentStageOptions = adminDevelopmentStageOrder.map((value) => ({
  value,
  label: developmentStageLabels[value]
}));

export const developmentStageCompatibilityMap: Record<PublicDevelopmentStage, DevelopmentStageValue[]> = {
  PRE_LAUNCH: ["PRE_LAUNCH"],
  LAUNCH: ["LAUNCH", "SALES"],
  CONSTRUCTION: ["FOUNDATION_COMPLETED", "CONSTRUCTION", "ADVANCED_STRUCTURE", "FINISHING", "READY_TO_MOVE"],
  DELIVERED: ["DELIVERED"]
};

const investmentStageMeta: Record<DevelopmentStageValue, InvestmentStageMeta> = {
  PRE_LAUNCH: {
    label: developmentStageLabels.PRE_LAUNCH,
    defaultProgressPct: 0,
    appreciationPotential: "MUITO_ALTO",
    perceivedRisk: "Alto",
    futureLiquidity: "Boa no médio prazo",
    buyerProfile: "Investidores que buscam entrar antes da abertura oficial de vendas",
    opportunityText:
      "Nesta fase, a oportunidade de entrada tende a ser mais estratégica para quem busca potencial de valorização até a entrega, pois o projeto ainda está no início comercial e pode oferecer maior variedade de unidades. A análise deve considerar localização, histórico da construtora e condições de mercado."
  },
  LAUNCH: {
    label: developmentStageLabels.LAUNCH,
    defaultProgressPct: 10,
    appreciationPotential: "ALTO",
    perceivedRisk: "Médio",
    futureLiquidity: "Boa",
    buyerProfile: "Investidores que buscam valorização até a entrega",
    opportunityText:
      "Nesta etapa, o comprador geralmente encontra boas condições comerciais, maior variedade de unidades disponíveis e alto potencial de valorização até a entrega da obra. Para investidores, costuma ser uma fase estratégica por permitir entrada antes da valorização natural causada pelo avanço da obra, aumento da procura e redução do estoque."
  },
  SALES: {
    label: developmentStageLabels.SALES,
    defaultProgressPct: 15,
    appreciationPotential: "ALTO",
    perceivedRisk: "Médio",
    futureLiquidity: "Boa",
    buyerProfile: "Investidores que buscam valorização com vendas em fase ativa",
    opportunityText:
      "Durante a fase de vendas, ainda há boa chance de negociação e valorização até a entrega, com foco na escolha de tipologias, condição comercial e potencial de liquidez."
  },
  FOUNDATION_COMPLETED: {
    label: developmentStageLabels.FOUNDATION_COMPLETED,
    defaultProgressPct: 25,
    appreciationPotential: "ALTO",
    perceivedRisk: "Médio",
    futureLiquidity: "Boa",
    buyerProfile: "Compradores que querem potencial de valorização com obra já iniciada",
    opportunityText:
      "Com a fundação concluída, o empreendimento ganha evidência física e reduz parte da incerteza percebida. Ainda existe tendência de valorização associada ao avanço da construção, mas a oportunidade deve ser analisada junto com estoque, localização e reputação da construtora."
  },
  CONSTRUCTION: {
    label: developmentStageLabels.CONSTRUCTION,
    defaultProgressPct: 45,
    appreciationPotential: "MEDIO",
    perceivedRisk: "Médio",
    futureLiquidity: "Boa",
    buyerProfile: "Compradores que equilibram potencial de valorização e avanço visível da obra",
    opportunityText:
      "Na fase de construção, parte da valorização inicial pode já ter ocorrido, mas o avanço da obra ajuda a reduzir o risco percebido. A entrada tende a fazer sentido para quem busca equilíbrio entre potencial de valorização, previsibilidade e prazo até a entrega."
  },
  ADVANCED_STRUCTURE: {
    label: developmentStageLabels.ADVANCED_STRUCTURE,
    defaultProgressPct: 65,
    appreciationPotential: "MEDIO",
    perceivedRisk: "Médio baixo",
    futureLiquidity: "Boa a alta",
    buyerProfile: "Compradores que buscam obra avançada e prazo menor até a entrega",
    opportunityText:
      "Com a estrutura avançada, o empreendimento já apresenta maior materialidade e tende a transmitir mais segurança ao comprador. O potencial de valorização ainda pode existir, mas geralmente é menor do que nas fases iniciais e depende da procura, do estoque remanescente e das condições de mercado."
  },
  FINISHING: {
    label: developmentStageLabels.FINISHING,
    defaultProgressPct: 82,
    appreciationPotential: "MEDIO",
    perceivedRisk: "Baixo",
    futureLiquidity: "Alta",
    buyerProfile: "Compradores que priorizam menor risco percebido e uso próximo",
    opportunityText:
      "Na etapa de acabamento, a proximidade da entrega reduz o risco percebido e facilita a avaliação do produto final. O potencial de valorização tende a ser mais moderado, enquanto aumenta a possibilidade de uso, revenda ou preparação para renda com aluguel em prazo menor."
  },
  READY_TO_MOVE: {
    label: developmentStageLabels.READY_TO_MOVE,
    defaultProgressPct: 95,
    appreciationPotential: "BAIXO",
    perceivedRisk: "Baixo",
    futureLiquidity: "Alta",
    buyerProfile: "Compradores que precisam de uso imediato ou renda com aluguel em curto prazo",
    opportunityText:
      "Quando o empreendimento está pronto para morar, o risco percebido é menor e o comprador consegue avaliar o imóvel com mais clareza. A oportunidade passa a estar mais ligada à disponibilidade, negociação, localização e liquidez para uso, venda ou aluguel."
  },
  DELIVERED: {
    label: developmentStageLabels.DELIVERED,
    defaultProgressPct: 100,
    appreciationPotential: "BAIXO",
    perceivedRisk: "Baixo",
    futureLiquidity: "Alta",
    buyerProfile: "Compradores que buscam imóvel entregue, liquidez e possibilidade de renda imediata",
    opportunityText:
      "Com o empreendimento entregue, a análise deixa de depender do avanço da obra e passa a focar no produto pronto, liquidez da região, demanda por aluguel e condições de negociação. O potencial de valorização existe como tendência de mercado, mas deve ser avaliado sem promessa de retorno."
  }
};

export function normalizeDevelopmentStage(stage?: string | null): PublicDevelopmentStage {
  if (stage === "LAUNCH" || stage === "SALES") return "LAUNCH";
  if (stage === "FOUNDATION_COMPLETED" || stage === "CONSTRUCTION" || stage === "ADVANCED_STRUCTURE" || stage === "FINISHING" || stage === "READY_TO_MOVE") {
    return "CONSTRUCTION";
  }
  if (stage === "DELIVERED") return "DELIVERED";
  return "PRE_LAUNCH";
}

export function isPublicDevelopmentStage(stage?: string | null): stage is PublicDevelopmentStage {
  return publicDevelopmentStageOrder.includes(stage as PublicDevelopmentStage);
}

export function getDevelopmentStageLabel(stage?: string | null) {
  if (stage && stage in developmentStageLabels) {
    return developmentStageLabels[stage as DevelopmentStageValue];
  }
  return developmentStageLabels[normalizeDevelopmentStage(stage)];
}

export function getAppreciationPotentialLabel(value?: string | null) {
  return appreciationPotentialOptions.find((option) => option.value === value)?.label ?? null;
}

export function getInvestmentStageMeta(stage?: string | null) {
  if (stage && stage in investmentStageMeta) {
    return investmentStageMeta[stage as DevelopmentStageValue];
  }
  return investmentStageMeta[normalizeDevelopmentStage(stage)];
}

export function getInvestmentPotentialAnalysis(input: {
  stage?: string | null;
  constructionProgressPct?: number | null;
  appreciationPotential?: string | null;
  buyerProfile?: string | null;
  opportunityText?: string | null;
}) {
  const meta = getInvestmentStageMeta(input.stage);
  const customPotential = getAppreciationPotentialLabel(input.appreciationPotential);
  const progressPct =
    typeof input.constructionProgressPct === "number"
      ? Math.min(100, Math.max(0, input.constructionProgressPct))
      : meta.defaultProgressPct;

  return {
    stage: normalizeDevelopmentStage(input.stage),
    stageLabel: meta.label,
    progressPct,
    appreciationPotential: customPotential ?? getAppreciationPotentialLabel(meta.appreciationPotential) ?? "Médio",
    perceivedRisk: meta.perceivedRisk,
    futureLiquidity: meta.futureLiquidity,
    buyerProfile: input.buyerProfile?.trim() || meta.buyerProfile,
    opportunityText: input.opportunityText?.trim() || meta.opportunityText
  };
}
