const GRAPH_BASE = "https://graph.facebook.com/v22.0";

type WhatsAppTemplatePayload = {
  to: string;
  templateName: string;
  languageCode: string;
  bodyParams: string[];
};

export async function sendWhatsAppTemplate(payload: WhatsAppTemplatePayload) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !token) {
    throw new Error("WhatsApp env vars ausentes (WHATSAPP_PHONE_NUMBER_ID/WHATSAPP_ACCESS_TOKEN)");
  }

  const response = await fetch(`${GRAPH_BASE}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: payload.to,
      type: "template",
      template: {
        name: payload.templateName,
        language: {
          code: payload.languageCode
        },
        components: payload.bodyParams.length
          ? [
              {
                type: "body",
                parameters: payload.bodyParams.map((text) => ({ type: "text", text }))
              }
            ]
          : []
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message ?? "Falha ao enviar template WhatsApp";
    throw new Error(errorMessage);
  }

  return data;
}
