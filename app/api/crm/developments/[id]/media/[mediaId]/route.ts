import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id, mediaId } = await params;

  const media = await prisma.developmentMedia.findUnique({
    where: { id: mediaId },
    select: { id: true, developmentId: true }
  });

  if (!media || media.developmentId !== id) {
    return fail("Mídia não encontrada para este empreendimento.", 404);
  }

  await prisma.developmentMedia.delete({ where: { id: mediaId } });

  await prisma.auditLog.create({
    data: {
      action: "DEVELOPMENT_MEDIA_DELETED",
      resource: "DevelopmentMedia",
      resourceId: mediaId,
      actorId: session?.userId,
      metadata: { developmentId: id }
    }
  });

  return ok({ id: mediaId });
}
