export type TemplateVariables = {
  leadFirstName: string;
  brokerName: string;
  propertyTitle?: string;
  propertyUrl?: string;
  visitDate?: string;
  budgetRange?: string;
  targetValue?: string;
  interest?: string;
  stage?: string;
};

export type WhatsappTemplateCategory = "NORMAL" | "AUCTION";

export type WhatsappTemplate = {
  id: string;
  name: string;
  hint: string | null;
  body: string;
  category: WhatsappTemplateCategory;
  sortOrder: number;
};

export const TEMPLATE_VARIABLES = [
  { token: "leadFirstName", label: "Nome do cliente" },
  { token: "brokerName", label: "Nome do corretor" },
  { token: "propertyTitle", label: "Imóvel/empreendimento" },
  { token: "propertyUrl", label: "Link do imóvel" },
  { token: "visitDate", label: "Data da visita" },
  { token: "budgetRange", label: "Faixa de orçamento" },
  { token: "targetValue", label: "Valor-alvo" },
  { token: "interest", label: "Interesse" },
  { token: "stage", label: "Etapa do lead" }
] as const;

export const DEFAULT_WHATSAPP_TEMPLATES: ReadonlyArray<WhatsappTemplate> = [
  { id: "first-contact", name: "Primeiro contato", hint: "Apresentação rápida + pedido de retorno", category: "NORMAL", sortOrder: 10, body: "Olá {{leadFirstName}}, aqui é o {{brokerName}}, corretor de imóveis em Palmas. Recebi seu contato e gostaria de entender melhor o que você procura para te enviar opções alinhadas. Qual o melhor horário para conversarmos?" },
  { id: "options-shared", name: "Enviei opções", hint: "Confirma que mandou imóveis e pede feedback", category: "NORMAL", sortOrder: 20, body: "{{leadFirstName}}, separei algumas opções que combinam com o que você me passou. Começo por esta: {{propertyTitle}}. {{propertyUrl}}\n\nMe diz se faz sentido para irmos para a próxima ou se quer ajustar algum critério." },
  { id: "schedule-visit", name: "Agendar visita", hint: "Propõe horário para visita", category: "NORMAL", sortOrder: 30, body: "{{leadFirstName}}, consigo agendar uma visita no {{propertyTitle}} nesta semana. Você tem disponibilidade amanhã à tarde ou prefere outro dia?" },
  { id: "confirm-visit", name: "Confirmar visita", hint: "Lembrete antes da visita", category: "NORMAL", sortOrder: 40, body: "{{leadFirstName}}, passando para confirmar nossa visita no {{propertyTitle}} em {{visitDate}}. Continua de pé? Me avise para eu organizar o acesso." },
  { id: "post-visit", name: "Pós-visita", hint: "Pede a impressão após a visita", category: "NORMAL", sortOrder: 50, body: "Obrigado pela visita, {{leadFirstName}}! Qual foi sua impressão do {{propertyTitle}}? Se quiser, posso preparar uma proposta hoje mesmo ou te mostrar outras opções na mesma faixa." },
  { id: "proposal-followup", name: "Follow-up de proposta", hint: "Acompanha uma proposta enviada", category: "NORMAL", sortOrder: 60, body: "{{leadFirstName}}, tudo bem? Passando para saber sua decisão sobre a proposta que te enviei. Posso ajudar com alguma dúvida, simulação de financiamento ou ajuste no valor?" },
  { id: "warm-up", name: "Reaproximação (frio)", hint: "Reativa um lead que esfriou", category: "NORMAL", sortOrder: 70, body: "Oi {{leadFirstName}}, fazem alguns dias que não falamos. Tenho novas oportunidades na sua faixa ({{budgetRange}}) que podem te interessar. Posso te enviar?" },
  { id: "auction-first-contact", name: "Leilão: primeiro contato", hint: "Entende o perfil antes de enviar oportunidades", category: "AUCTION", sortOrder: 10, body: "Olá {{leadFirstName}}, aqui é o {{brokerName}}. Vi que você tem interesse em oportunidades de leilão. Quero entender seu perfil, faixa de investimento e região de interesse para te enviar lotes compatíveis. Podemos conversar?" },
  { id: "auction-lot-shared", name: "Leilão: enviar lote", hint: "Apresenta o imóvel e o edital", category: "AUCTION", sortOrder: 20, body: "{{leadFirstName}}, encontrei uma oportunidade de leilão que pode fazer sentido para o seu perfil: {{propertyTitle}}. {{propertyUrl}} Posso te enviar o edital e os próximos pontos para análise." },
  { id: "auction-analysis", name: "Leilão: análise", hint: "Confirma se o cliente quer analisar o lote", category: "AUCTION", sortOrder: 30, body: "{{leadFirstName}}, você conseguiu avaliar o lote {{propertyTitle}}? Se quiser, organizo com você os principais pontos do edital, ocupação, débitos e riscos antes de qualquer decisão." },
  { id: "auction-deadline", name: "Leilão: prazo", hint: "Lembra o cliente de avaliar a oportunidade", category: "AUCTION", sortOrder: 40, body: "{{leadFirstName}}, passando para lembrar da oportunidade em {{propertyTitle}}. Quer que eu confira com você a data, o lance mínimo e os documentos antes do prazo?" },
  { id: "auction-followup", name: "Leilão: follow-up", hint: "Reaproxima após envio do material", category: "AUCTION", sortOrder: 50, body: "{{leadFirstName}}, tudo bem? Você conseguiu analisar o material do leilão? Se ainda fizer sentido, posso te ajudar a comparar essa oportunidade com outras antes de avançarmos." }
];

export function renderTemplate(body: string, vars: TemplateVariables): string {
  return body.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: keyof TemplateVariables) => {
    const value = vars[key];
    return value === undefined || value === null ? "" : String(value);
  });
}

export function buildWhatsappLink(phone: string | null | undefined, message: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
