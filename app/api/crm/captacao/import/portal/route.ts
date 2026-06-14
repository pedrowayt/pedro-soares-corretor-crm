import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { importPortalCapturedListing } from "@/lib/integrations/olx-capture";
import { crmImportPortalCapturedListingSchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const parsed = crmImportPortalCapturedListingSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Informe uma URL válida de anúncio em portal suportado.", 422, parsed.error.flatten());
  }

  try {
    const listing = await importPortalCapturedListing(parsed.data.sourceUrl, session?.userId, parsed.data.provider);
    return ok({ listing }, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao importar anúncio do portal.", 400);
  }
}
