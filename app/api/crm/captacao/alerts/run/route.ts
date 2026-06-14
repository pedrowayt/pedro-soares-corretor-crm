import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { runActiveCaptureAlerts } from "@/lib/data/capture-automation";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST() {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  try {
    const result = await runActiveCaptureAlerts({ actorId: session?.userId, maxAlerts: 5 });
    return ok(result);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao executar monitoramentos ativos.", 400);
  }
}
