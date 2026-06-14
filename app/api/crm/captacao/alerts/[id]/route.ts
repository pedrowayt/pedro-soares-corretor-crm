import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { deleteCaptureAlert } from "@/lib/data/capture";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await context.params;

  try {
    const deleted = await deleteCaptureAlert(id, session?.userId);
    if (!deleted) return fail("Monitoramento de captação não encontrado.", 404);
    return ok({ deleted: true, id });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao excluir monitoramento.", 400);
  }
}
