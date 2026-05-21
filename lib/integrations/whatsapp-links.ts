const DEFAULT_WHATSAPP_NUMBER = "5563984845101";

function sanitizePhone(input?: string | null) {
  if (!input) return DEFAULT_WHATSAPP_NUMBER;
  const digits = input.replace(/\D/g, "");
  return digits || DEFAULT_WHATSAPP_NUMBER;
}

export function buildWhatsAppUrl(message: string, phone = DEFAULT_WHATSAPP_NUMBER) {
  const target = sanitizePhone(phone);
  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
}

export function buildDevelopmentMessage(developmentName: string) {
  return `Olá, Pedro. Tenho interesse no empreendimento ${developmentName}. Gostaria de receber tabela, plantas e condições.`;
}

export function buildDevelopmentUnitMessage(developmentName: string, unitTypeName: string) {
  return `Olá, Pedro. Tenho interesse no empreendimento ${developmentName}, planta ${unitTypeName}. Gostaria de receber mais informações.`;
}

export function buildDevelopmentScheduleMessage(developmentName: string) {
  return `Olá, Pedro. Gostaria de agendar uma apresentação do empreendimento ${developmentName}.`;
}

export function getDefaultWhatsAppNumber() {
  return DEFAULT_WHATSAPP_NUMBER;
}
