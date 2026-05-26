import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;

  const builder = await prisma.builder.findUnique({ where: { id }, select: { id: true } });
  if (!builder) return fail("Construtora não encontrada.", 404);

  const updated = await prisma.builder.update({
    where: { id },
    data: {
      archivedAt: null
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "BUILDER_UNARCHIVED",
      resource: "Builder",
      resourceId: id,
      actorId: session?.userId
    }
  });

  return ok({ builder: updated });
}
