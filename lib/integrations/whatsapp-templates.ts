import { LeadStage } from "@prisma/client";

export const DEFAULT_TEMPLATE_BY_STAGE: Partial<Record<LeadStage, string>> = {
  PRIMEIRO_CONTATO: "primeiro_contato_lead",
  VISITA_AGENDADA: "confirmacao_visita",
  PROPOSTA_ENVIADA: "followup_proposta",
  NEGOCIACAO: "andamento_negociacao"
};
