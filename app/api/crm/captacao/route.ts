import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { createCapturedListing } from "@/lib/data/capture";
import { crmCreateCapturedListingSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = crmCreateCapturedListingSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para oportunidade de captação.", 422, parsed.error.flatten());
  }

  try {
    const listing = await createCapturedListing(parsed.data, session?.userId);
    return ok({ listing }, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao criar oportunidade de captação.", 400);
  }
}
