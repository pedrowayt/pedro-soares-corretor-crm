import { InteractionChannel, InteractionType } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmRegisterContactSchema } from "@/lib/validation/schemas";

const CHANNELS: Record<string, InteractionChannel> = {
  WHATSAPP: InteractionChannel.WHATSAPP,
  PHONE: InteractionChannel.PHONE,
  EMAIL: InteractionChannel.EMAIL,
  CRM: InteractionChannel.CRM
};

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;
  const { id } = await params;
  const parsed = crmRegisterContactSchema.safeParse(await request.json());
  if (!parsed.success) return fail("Payload inválido para registro de contato.", 422, parsed.error.flatten());
  const lead = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!lead) return fail("Lead não encontrado.", 404);
  const now = new Date();
  const nextFollowUpAt = new Date(now.getTime() + 7 * 86400000);
  const [updatedLead] = await prisma.$transaction([
    prisma.lead.update({ where: { id }, data: { lastContactAt: now, nextFollowUpAt } }),
    prisma.leadInteraction.create({
      data: { leadId: id, type: InteractionType.WHATSAPP_MESSAGE, channel: CHANNELS[parsed.data.channel], message: parsed.data.message ?? "Contato registrado pelo Flow-UP.", createdById: session?.userId }
    })
  ]);
  return ok({ lead: updatedLead, nextFollowUpAt });
}
