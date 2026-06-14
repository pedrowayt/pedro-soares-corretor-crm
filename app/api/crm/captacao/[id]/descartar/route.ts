import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { discardCapturedListing } from "@/lib/data/capture";
import { crmDiscardCapturedListingSchema } from "@/lib/validation/schemas";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const parsed = crmDiscardCapturedListingSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para descarte.", 422, parsed.error.flatten());
  }

  try {
    const listing = await discardCapturedListing(id, parsed.data.reason, session?.userId);
    return ok({ listing });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao descartar oportunidade.", 400);
  }
}
