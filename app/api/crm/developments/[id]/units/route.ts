import { DevelopmentUnitStatus } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmCreateDevelopmentUnitSchema } from "@/lib/validation/schemas";

function optionalString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmCreateDevelopmentUnitSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para unidade de empreendimento.", 422, parsed.error.flatten());
  }

  const payload = parsed.data;

  if (payload.towerId) {
    const tower = await prisma.developmentTower.findFirst({
      where: {
        id: payload.towerId,
        developmentId: id
      },
      select: { id: true }
    });

    if (!tower) {
      return fail("Torre/bloco não encontrado para este empreendimento.", 404);
    }
  }

  if (payload.unitTypeId) {
    const unitType = await prisma.developmentUnitType.findFirst({
      where: {
        id: payload.unitTypeId,
        developmentId: id
      },
      select: { id: true }
    });

    if (!unitType) {
      return fail("Tipologia não encontrada para este empreendimento.", 404);
    }
  }

  const unit = await prisma.developmentUnit.create({
    data: {
      developmentId: id,
      towerId: payload.towerId || undefined,
      unitTypeId: payload.unitTypeId || undefined,
      label: payload.label.trim(),
      unitNumber: optionalString(payload.unitNumber),
      floor: payload.floor,
      status: payload.status ?? DevelopmentUnitStatus.DISPONIVEL,
      price: payload.price,
      areaPrivateM2: payload.areaPrivateM2,
      areaTotalM2: payload.areaTotalM2,
      parkingSpaces: payload.parkingSpaces,
      orientation: optionalString(payload.orientation),
      notes: optionalString(payload.notes),
      position: payload.position ?? 0
    }
  });

  return ok({ unit }, { status: 201 });
}
