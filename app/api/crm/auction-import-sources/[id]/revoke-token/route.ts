import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmAdminAccess } from "@/lib/auth/permissions";
import { revokeAuctionImportSourceToken } from "@/lib/data/auction-import-sources";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmAdminAccess();
  if (denied) return denied;

  const { id } = await params;

  try {
    const source = await revokeAuctionImportSourceToken(id);
    return ok({ source });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return fail("Fonte de importação não encontrada.", 404);
    }
    return fail("Não foi possível revogar o token.", 400);
  }
}
