import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; amenityId: string }> }
) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id, amenityId } = await params;
  const result = await prisma.developmentAmenity.deleteMany({
    where: {
      id: amenityId,
      developmentId: id
    }
  });

  if (!result.count) {
    return fail("Item de lazer/diferencial não encontrado.", 404);
  }

  return ok({ deleted: true });
}
