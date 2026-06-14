import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { importOlxCapturedListing } from "@/lib/integrations/olx-capture";
import { crmImportOlxCapturedListingSchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const parsed = crmImportOlxCapturedListingSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Informe uma URL valida de anuncio da OLX.", 422, parsed.error.flatten());
  }

  try {
    const listing = await importOlxCapturedListing(parsed.data.sourceUrl, session?.userId);
    return ok({ listing }, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao importar anuncio da OLX.", 400);
  }
}
