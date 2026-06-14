import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { captureListing } from "@/lib/data/capture";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await context.params;

  try {
    const listing = await captureListing(id, session?.userId);
    return ok({ listing });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao captar oportunidade.", 400);
  }
}
