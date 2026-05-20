import { InteractionChannel, InteractionType, LeadIntent, LeadSource } from "@prisma/client";
import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return fail("Token de verificação inválido.", 403);
}

export async function POST(request: Request) {
  const payload = await request.json();

  const message = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const profile = payload?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile;

  if (!message?.from) {
    return ok({ received: true });
  }

  const leadPhone = message.from;

  const existingLead = await prisma.lead.findFirst({
    where: { phone: leadPhone },
    orderBy: { createdAt: "desc" }
  });

  const lead = existingLead
    ? existingLead
    : await prisma.lead.create({
        data: {
          name: profile?.name ?? "Lead WhatsApp",
          phone: leadPhone,
          source: LeadSource.WHATSAPP,
          intent: LeadIntent.COMPRAR,
          notes: "Lead criado por mensagem inbound de WhatsApp."
        }
      });

  await prisma.leadInteraction.create({
    data: {
      leadId: lead.id,
      type: InteractionType.WHATSAPP_MESSAGE,
      channel: InteractionChannel.WHATSAPP,
      message: message?.text?.body ?? "Mensagem sem texto",
      metadata: payload
    }
  });

  return ok({ received: true });
}
