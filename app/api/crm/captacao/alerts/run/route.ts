import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { runActiveBrowserCaptureAlerts } from "@/lib/data/capture-automation";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  try {
    const result = await runActiveBrowserCaptureAlerts({ actorId: session?.userId, maxAlerts: 5 });
    return ok(result);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao executar monitoramentos ativos.", 400);
  }
}
