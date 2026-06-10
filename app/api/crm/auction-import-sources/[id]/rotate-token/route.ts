import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmAdminAccess } from "@/lib/auth/permissions";
import { rotateAuctionImportSourceToken } from "@/lib/data/auction-import-sources";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmAdminAccess();
  if (denied) return denied;

  const { id } = await params;

  try {
    const result = await rotateAuctionImportSourceToken(id);
    return ok({
      source: result.source,
      token: result.token
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return fail("Fonte de importação não encontrada.", 404);
    }
    return fail("Não foi possível gerar novo token.", 400);
  }
}
