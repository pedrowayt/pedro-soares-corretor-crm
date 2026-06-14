import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { runCaptureAlert } from "@/lib/data/capture-automation";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await context.params;

  try {
    const result = await runCaptureAlert(id, session?.userId);
    return ok(result);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao executar monitoramento.", 400);
  }
}
