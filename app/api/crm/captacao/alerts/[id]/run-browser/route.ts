import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { runBrowserCaptureAlert } from "@/lib/data/capture-automation";

export const runtime = "nodejs";
export const maxDuration = 180;

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await context.params;

  try {
    const result = await runBrowserCaptureAlert(id, session?.userId);
    return ok(result);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao executar monitoramento com navegador.", 400);
  }
}
