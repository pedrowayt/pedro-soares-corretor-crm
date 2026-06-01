export type TemplateVariables = {
  leadFirstName: string;
  brokerName: string;
  propertyTitle?: string;
  propertyUrl?: string;
  visitDate?: string;
  budgetRange?: string;
};

export type WhatsappTemplate = {
  id: string;
  label: string;
  hint: string;
  body: (vars: TemplateVariables) => string;
  requires?: Array<keyof TemplateVariables>;
};

export const WHATSAPP_TEMPLATES: ReadonlyArray<WhatsappTemplate> = [
  {
    id: "first-contact",
    label: "Primeiro contato",
    hint: "Apresentação rápida + pedido de retorno",
    body: ({ leadFirstName, brokerName }) =>
      `Olá ${leadFirstName}, aqui é o ${brokerName}, corretor de imóveis em Palmas. ` +
      `Recebi seu contato e gostaria de entender melhor o que você procura para te enviar opções alinhadas. ` +
      `Qual o melhor horário para conversarmos?`
  },
  {
    id: "options-shared",
    label: "Enviei opções",
    hint: "Confirma que mandou listings e pede feedback",
    body: ({ leadFirstName, propertyTitle, propertyUrl }) =>
      `${leadFirstName}, separei algumas opções que combinam com o que você me passou. ` +
      (propertyTitle ? `Começo por essa: ${propertyTitle}. ` : "") +
      (propertyUrl ? `Veja aqui: ${propertyUrl}\n\n` : "") +
      `Me diz se faz sentido para irmos para a próxima ou se quer ajustar algum critério.`,
    requires: ["leadFirstName"]
  },
  {
    id: "schedule-visit",
    label: "Agendar visita",
    hint: "Propõe horário pra visita",
    body: ({ leadFirstName, propertyTitle }) =>
      `${leadFirstName}, consigo agendar uma visita ${
        propertyTitle ? `no ${propertyTitle}` : "no imóvel"
      } nesta semana. ` + `Você tem disponibilidade amanhã à tarde ou prefere outro dia?`
  },
  {
    id: "confirm-visit",
    label: "Confirmar visita",
    hint: "Lembrete 24h antes",
    body: ({ leadFirstName, propertyTitle, visitDate }) =>
      `${leadFirstName}, passando para confirmar nossa visita ${
        propertyTitle ? `no ${propertyTitle}` : ""
      }${visitDate ? ` em ${visitDate}` : ""}. ` +
      `Continua de pé? Me avise para eu organizar o acesso.`
  },
  {
    id: "post-visit",
    label: "Pós-visita",
    hint: "Pede impressão após visita",
    body: ({ leadFirstName, propertyTitle }) =>
      `Obrigado pela visita, ${leadFirstName}! Qual foi sua impressão ${
        propertyTitle ? `do ${propertyTitle}` : "do imóvel"
      }? ` +
      `Se quiser, posso preparar uma proposta hoje mesmo ou te mostrar outras opções na mesma faixa.`
  },
  {
    id: "proposal-followup",
    label: "Follow-up de proposta",
    hint: "Status da proposta enviada",
    body: ({ leadFirstName }) =>
      `${leadFirstName}, tudo bem? Passando para saber sua decisão sobre a proposta que te enviei. ` +
      `Posso ajudar com alguma dúvida, simulação de financiamento ou ajuste no valor.`
  },
  {
    id: "warm-up",
    label: "Reaproximação (frio)",
    hint: "Reativa lead que esfriou",
    body: ({ leadFirstName, budgetRange }) =>
      `Oi ${leadFirstName}, fazem alguns dias que não falamos. ` +
      `Tenho novas oportunidades${budgetRange ? ` na sua faixa (${budgetRange})` : ""} que podem te interessar. ` +
      `Posso te enviar?`
  }
];

export function renderTemplate(template: WhatsappTemplate, vars: TemplateVariables): string {
  return template.body(vars);
}

export function buildWhatsappLink(phone: string | null | undefined, message: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
