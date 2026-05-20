import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { sendWhatsAppTemplate } from "@/lib/integrations/whatsapp";
import { whatsappTemplateSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = whatsappTemplateSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para envio de template WhatsApp.", 422, parsed.error.flatten());
  }

  try {
    const result = await sendWhatsAppTemplate(parsed.data);
    return ok({ result }, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao enviar template.", 500);
  }
}
