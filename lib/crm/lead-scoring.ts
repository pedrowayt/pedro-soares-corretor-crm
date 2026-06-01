import { LeadStage } from "@prisma/client";

export type ScoreSignals = {
  stage: LeadStage;
  createdAt: Date | string | null | undefined;
  lastContactAt: Date | string | null | undefined;
  hasLinkedProperty: boolean;
  hasLinkedDevelopment: boolean;
  visitsCount: number;
  proposalsCount: number;
  interactionsCount: number;
  budgetMin: number | null | undefined;
  budgetMax: number | null | undefined;
};

export type ScoreTier = "cold" | "warm" | "hot" | "won" | "lost";

export type LeadScore = {
  value: number;
  tier: ScoreTier;
  label: string;
  reasons: string[];
};

const STAGE_BASE: Record<LeadStage, number> = {
  NOVO: 45,
  PRIMEIRO_CONTATO: 50,
  QUALIFICADO: 60,
  OPCOES_ENVIADAS: 65,
  VISITA_AGENDADA: 75,
  PROPOSTA_ENVIADA: 85,
  NEGOCIACAO: 90,
  FECHADO: 100,
  PERDIDO: 0
};

function daysBetween(a: Date, b: Date) {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

function tierFor(value: number, stage: LeadStage): ScoreTier {
  if (stage === "FECHADO") return "won";
  if (stage === "PERDIDO") return "lost";
  if (value >= 75) return "hot";
  if (value >= 50) return "warm";
  return "cold";
}

const TIER_LABEL: Record<ScoreTier, string> = {
  cold: "Frio",
  warm: "Morno",
  hot: "Quente",
  won: "Ganho",
  lost: "Perdido"
};

/**
 * Calcula um score 0-100 baseado em sinais comportamentais. A pontuação
 * começa pelo estágio do funil e ajusta com base em engajamento recente,
 * atividade (visitas, propostas, interações), e tempo desde o último
 * contato.
 */
export function computeLeadScore(signals: ScoreSignals): LeadScore {
  const today = new Date();
  const reasons: string[] = [];
  let value = STAGE_BASE[signals.stage];

  // Atividade real do lead
  if (signals.proposalsCount > 0) {
    value += 8;
    reasons.push(`${signals.proposalsCount} proposta${signals.proposalsCount > 1 ? "s" : ""}`);
  }
  if (signals.visitsCount > 0) {
    value += 6;
    reasons.push(`${signals.visitsCount} visita${signals.visitsCount > 1 ? "s" : ""}`);
  }
  if (signals.interactionsCount >= 3) {
    value += 4;
    reasons.push("alta interação");
  }
  if (signals.hasLinkedProperty || signals.hasLinkedDevelopment) {
    value += 3;
    reasons.push("imóvel/empreendimento vinculado");
  }
  if (signals.budgetMax && signals.budgetMax > 0) {
    value += 2;
    reasons.push("orçamento informado");
  }

  // Penalidade por inatividade
  const lastContact = signals.lastContactAt ? new Date(signals.lastContactAt) : null;
  const ref = lastContact ?? (signals.createdAt ? new Date(signals.createdAt) : today);
  const idleDays = daysBetween(today, ref);
  if (signals.stage !== "FECHADO" && signals.stage !== "PERDIDO") {
    if (idleDays >= 14) {
      value -= 25;
      reasons.push(`${idleDays} dias sem contato`);
    } else if (idleDays >= 7) {
      value -= 12;
      reasons.push(`${idleDays} dias sem contato`);
    } else if (idleDays >= 3) {
      value -= 5;
      reasons.push(`${idleDays} dias sem contato`);
    } else if (idleDays <= 1) {
      value += 4;
      reasons.push("contato recente");
    }
  }

  // Bonus por estar engajado em estágio avançado
  if (signals.stage === "PROPOSTA_ENVIADA" || signals.stage === "NEGOCIACAO") {
    if (idleDays <= 3) {
      value += 5;
      reasons.push("negociação ativa");
    }
  }

  value = Math.max(0, Math.min(100, Math.round(value)));
  const tier = tierFor(value, signals.stage);

  return {
    value,
    tier,
    label: TIER_LABEL[tier],
    reasons
  };
}
