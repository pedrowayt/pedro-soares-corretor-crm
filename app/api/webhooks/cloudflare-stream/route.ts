import { fail, ok } from "@/lib/api/http";
import { verifyCloudflareWebhookSignature } from "@/lib/cloudflare/client";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-cloudflare-signature") ?? request.headers.get("webhook-signature");

  if (!verifyCloudflareWebhookSignature(rawBody, signature)) {
    return fail("Assinatura inválida do webhook Cloudflare Stream.", 401);
  }

  const payload = JSON.parse(rawBody) as {
    uid?: string;
    status?: {
      state?: string;
    };
  };

  if (payload.uid) {
    await prisma.propertyMedia.updateMany({
      where: {
        cloudflareMediaId: payload.uid
      },
      data: {
        status: payload.status?.state === "ready" ? "PRONTO" : "PROCESSANDO"
      }
    });
  }

  return ok({ received: true });
}
