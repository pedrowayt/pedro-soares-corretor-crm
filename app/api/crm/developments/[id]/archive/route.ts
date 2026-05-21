import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;

  const exists = await prisma.development.findUnique({ where: { id }, select: { id: true } });
  if (!exists) {
    return fail("Empreendimento não encontrado.", 404);
  }

  const development = await prisma.development.update({
    where: { id },
    data: {
      archivedAt: new Date(),
      status: "ARCHIVED",
      isPublished: false,
      publishedAt: null
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "DEVELOPMENT_ARCHIVED",
      resource: "Development",
      resourceId: id,
      actorId: session?.userId
    }
  });

  return ok({ development });
}
