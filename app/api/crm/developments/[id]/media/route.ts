import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmCreateDevelopmentMediaSchema } from "@/lib/validation/schemas";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmCreateDevelopmentMediaSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para mídia de empreendimento.", 422, parsed.error.flatten());
  }

  const payload = parsed.data;
  const towerId = payload.towerId?.trim() || null;
  const unitTypeId = payload.unitTypeId?.trim() || null;

  if (towerId) {
    const tower = await prisma.developmentTower.findFirst({
      where: { id: towerId, developmentId: id },
      select: { id: true }
    });

    if (!tower) {
      return fail("Torre/bloco não encontrado para esta mídia.", 404);
    }
  }

  if (unitTypeId) {
    const unitType = await prisma.developmentUnitType.findFirst({
      where: { id: unitTypeId, developmentId: id },
      select: { id: true, towerId: true }
    });

    if (!unitType) {
      return fail("Tipologia/planta não encontrada para esta mídia.", 404);
    }

    if (towerId && unitType.towerId && unitType.towerId !== towerId) {
      return fail("A tipologia selecionada pertence a outra torre/bloco.", 422);
    }
  }

  const media = await prisma.developmentMedia.create({
    data: {
      developmentId: id,
      towerId: towerId || undefined,
      unitTypeId: unitTypeId || undefined,
      kind: payload.kind,
      category: payload.category,
      url: payload.url,
      title: payload.title,
      caption: payload.caption,
      isPrimary: payload.isPrimary ?? false,
      position: payload.position ?? 0,
      cloudflareMediaId: payload.cloudflareMediaId,
      status: payload.status,
      metadata: payload.metadata as Prisma.InputJsonValue | undefined
    }
  });

  return ok({ media }, { status: 201 });
}
