import { LeadStage, TaskPriority } from "@prisma/client";

export const PIPELINE_ORDER: LeadStage[] = [
  LeadStage.NOVO,
  LeadStage.PRIMEIRO_CONTATO,
  LeadStage.QUALIFICADO,
  LeadStage.OPCOES_ENVIADAS,
  LeadStage.VISITA_AGENDADA,
  LeadStage.PROPOSTA_ENVIADA,
  LeadStage.NEGOCIACAO,
  LeadStage.FECHADO,
  LeadStage.PERDIDO
];

const ALLOWED_TRANSITIONS: Record<LeadStage, LeadStage[]> = {
  NOVO: [LeadStage.PRIMEIRO_CONTATO, LeadStage.PERDIDO],
  PRIMEIRO_CONTATO: [LeadStage.QUALIFICADO, LeadStage.PERDIDO],
  QUALIFICADO: [LeadStage.OPCOES_ENVIADAS, LeadStage.PERDIDO],
  OPCOES_ENVIADAS: [LeadStage.VISITA_AGENDADA, LeadStage.PERDIDO],
  VISITA_AGENDADA: [LeadStage.PROPOSTA_ENVIADA, LeadStage.PERDIDO],
  PROPOSTA_ENVIADA: [LeadStage.NEGOCIACAO, LeadStage.PERDIDO],
  NEGOCIACAO: [LeadStage.FECHADO, LeadStage.PERDIDO],
  FECHADO: [],
  PERDIDO: []
};

export function isValidStageTransition(from: LeadStage, to: LeadStage) {
  if (from === to) return true;
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getDefaultTaskByStage(stage: LeadStage) {
  switch (stage) {
    case LeadStage.PRIMEIRO_CONTATO:
      return { title: "Realizar primeiro contato", priority: TaskPriority.ALTA };
    case LeadStage.QUALIFICADO:
      return { title: "Enviar opções de imóveis", priority: TaskPriority.ALTA };
    case LeadStage.VISITA_AGENDADA:
      return { title: "Confirmar visita", priority: TaskPriority.ALTA };
    case LeadStage.PROPOSTA_ENVIADA:
      return { title: "Follow-up da proposta", priority: TaskPriority.URGENTE };
    default:
      return null;
  }
}
