import { InteractionChannel, InteractionType, Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { verifyCloudflareWebhookSignature } from "@/lib/cloudflare/client";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-cloudflare-signature") ?? request.headers.get("webhook-signature");

  if (!verifyCloudflareWebhookSignature(rawBody, signature)) {
    return fail("Assinatura inválida do webhook Cloudflare Images.", 401);
  }

  const payload = JSON.parse(rawBody) as {
    notification_type?: string;
    id?: string;
    metadata?: Record<string, unknown>;
  };

  const propertyId = payload.metadata?.propertyId;

  if (typeof propertyId === "string" && payload.id) {
    await prisma.propertyMedia.updateMany({
      where: {
        propertyId,
        cloudflareMediaId: payload.id
      },
      data: {
        status: payload.notification_type === "upload.complete" ? "PRONTO" : "PROCESSANDO"
      }
    });

    if (typeof payload.metadata?.leadId === "string") {
      await prisma.leadInteraction.create({
        data: {
          leadId: payload.metadata.leadId,
          propertyId,
          type: InteractionType.NOTE,
          channel: InteractionChannel.CRM,
          message: `Webhook Cloudflare Images: ${payload.notification_type ?? "evento"}`,
          metadata: payload as Prisma.InputJsonValue
        }
      });
    }
  }

  return ok({ received: true });
}
