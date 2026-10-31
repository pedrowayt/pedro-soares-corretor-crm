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
  category?: "auction";
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
  ,{
    id: "auction-first-contact",
    label: "Leilão: primeiro contato",
    hint: "Entende o perfil antes de enviar oportunidades",
    category: "auction",
    body: ({ leadFirstName, brokerName }) =>
      `Olá ${leadFirstName}, aqui é o ${brokerName}. Vi que você tem interesse em oportunidades de leilão. ` +
      `Quero entender seu perfil, faixa de investimento e região de interesse para te enviar lotes compatíveis. ` +
      `Podemos conversar?`
  },
  {
    id: "auction-lot-shared",
    label: "Leilão: enviar lote",
    hint: "Apresenta o imóvel e o edital",
    category: "auction",
    body: ({ leadFirstName, propertyTitle, propertyUrl }) =>
      `${leadFirstName}, encontrei uma oportunidade de leilão que pode fazer sentido para o seu perfil` +
      (propertyTitle ? `: ${propertyTitle}. ` : ". ") +
      (propertyUrl ? `Você pode consultar os detalhes aqui: ${propertyUrl} ` : "") +
      `Posso te enviar o edital e os próximos pontos para análise.`
  },
  {
    id: "auction-analysis",
    label: "Leilão: análise",
    hint: "Confirma se o cliente quer analisar o lote",
    category: "auction",
    body: ({ leadFirstName, propertyTitle }) =>
      `${leadFirstName}, você conseguiu avaliar ${propertyTitle ? `o lote ${propertyTitle}` : "a oportunidade de leilão"}? ` +
      `Se quiser, organizo com você os principais pontos do edital, ocupação, débitos e riscos antes de qualquer decisão.`
  },
  {
    id: "auction-deadline",
    label: "Leilão: prazo",
    hint: "Lembra o cliente de avaliar a oportunidade",
    category: "auction",
    body: ({ leadFirstName, propertyTitle }) =>
      `${leadFirstName}, passando para lembrar da oportunidade${propertyTitle ? ` em ${propertyTitle}` : " de leilão"}. ` +
      `Quer que eu confira com você a data, o lance mínimo e os documentos antes do prazo?`
  },
  {
    id: "auction-followup",
    label: "Leilão: follow-up",
    hint: "Reaproximação após envio do material",
    category: "auction",
    body: ({ leadFirstName }) =>
      `${leadFirstName}, tudo bem? Você conseguiu analisar o material do leilão? ` +
      `Se ainda fizer sentido, posso te ajudar a comparar essa oportunidade com outras antes de avançarmos.`
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
