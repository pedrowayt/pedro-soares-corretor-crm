import { DevelopmentPublicationStatus, Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { getDevelopmentPublicationChecklist } from "@/lib/data/developments";
import { prisma } from "@/lib/prisma";
import { crmUpdateDevelopmentStatusSchema } from "@/lib/validation/schemas";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmUpdateDevelopmentStatusSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para status de empreendimento.", 422, parsed.error.flatten());
  }

  const development = await prisma.development.findUnique({
    where: { id },
    include: {
      unitTypes: true,
      media: {
        where: { kind: "HERO" }
      }
    }
  });

  if (!development) {
    return fail("Empreendimento não encontrado.", 404);
  }

  if (parsed.data.status === DevelopmentPublicationStatus.PUBLISHED) {
    const checklist = getDevelopmentPublicationChecklist({
      title: development.title,
      summary: development.summary,
      description: development.description,
      district: development.district,
      city: development.city,
      mediaCount: development.media.length,
      unitTypesCount: development.unitTypes.length,
      ctaPrimaryUrl: development.ctaPrimaryUrl
    });

    if (!checklist.ready) {
      return fail("Empreendimento incompleto para publicação.", 409, {
        missing: checklist.missing
      });
    }
  }

  const updated = await prisma.development.update({
    where: { id },
    data: {
      status: parsed.data.status,
      isPublished: parsed.data.status === DevelopmentPublicationStatus.PUBLISHED,
      publishedAt: parsed.data.status === DevelopmentPublicationStatus.PUBLISHED ? new Date() : null
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "DEVELOPMENT_STATUS_UPDATED",
      resource: "Development",
      resourceId: id,
      actorId: session?.userId,
      metadata: parsed.data as Prisma.InputJsonValue
    }
  });

  return ok({ development: updated });
}
