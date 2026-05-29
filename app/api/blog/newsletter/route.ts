import { z } from "zod";
import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { subscribeBlogNewsletter } from "@/lib/data/blog";

export const runtime = "nodejs";

const subscribeSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  source: z.string().max(80).optional()
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail("Payload inválido.", 400);
  }

  const parsed = subscribeSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("E-mail inválido.", 422, parsed.error.flatten());
  }

  try {
    const subscriber = await subscribeBlogNewsletter(parsed.data.email, parsed.data.source);
    return ok({ subscriber: { email: subscriber.email } }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      // already subscribed — treat as success
      return ok({ subscriber: { email: parsed.data.email }, alreadySubscribed: true });
    }
    return fail("Não foi possível inscrever no momento. Tente novamente.", 500);
  }
}
