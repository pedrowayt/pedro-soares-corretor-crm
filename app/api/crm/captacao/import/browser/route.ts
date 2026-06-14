import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { importBrowserCapturedListings } from "@/lib/integrations/browser-capture";
import { crmImportBrowserCapturedListingsSchema } from "@/lib/validation/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const parsed = crmImportBrowserCapturedListingsSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Informe uma captura válida do navegador.", 422, parsed.error.flatten());
  }

  try {
    const result = await importBrowserCapturedListings(parsed.data, session?.userId);
    return ok(result, { status: result.importedCount > 0 ? 201 : 200 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao importar captura do navegador.", 400);
  }
}
