import { fail, ok } from "@/lib/api/http";
import { resolveLandingPage } from "@/lib/data/marketing-landing-pages";
import { prisma } from "@/lib/prisma";
import { publicLandingPageEventSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = publicLandingPageEventSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para tracking da landing page.", 422, parsed.error.flatten());
  }

  const landingPage = await resolveLandingPage({
    slug: parsed.data.landingPageSlug,
    publicPath: parsed.data.sourcePage
  });

  if (!landingPage || landingPage.status !== "PUBLISHED") return ok({ tracked: false });

  try {
    await prisma.landingPageEvent.create({
      data: {
        landingPageId: landingPage.id,
        type: parsed.data.type,
        sessionId: parsed.data.sessionId,
        metadata: parsed.data.metadata
      }
    });
  } catch {
    // Analytics must never break the landing page or its conversion flow.
    return ok({ tracked: false });
  }

  return ok({ tracked: true });
}
