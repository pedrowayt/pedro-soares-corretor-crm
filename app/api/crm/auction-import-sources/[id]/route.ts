import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmAdminAccess } from "@/lib/auth/permissions";
import {
  isUniqueConstraintError,
  updateAuctionImportSource
} from "@/lib/data/auction-import-sources";
import { crmUpdateAuctionImportSourceSchema } from "@/lib/validation/schemas";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmAdminAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = crmUpdateAuctionImportSourceSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para atualização da fonte.", 422, parsed.error.flatten());
  }

  try {
    const source = await updateAuctionImportSource(id, parsed.data);
    return ok({ source });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return fail("Já existe uma fonte com esse source key.", 409);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return fail("Fonte de importação não encontrada.", 404);
    }
    return fail(error instanceof Error ? error.message : "Não foi possível atualizar a fonte.", 400);
  }
}
