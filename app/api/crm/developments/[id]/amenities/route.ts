import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmCreateDevelopmentAmenitySchema } from "@/lib/validation/schemas";

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
  const parsed = crmCreateDevelopmentAmenitySchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para lazer/diferencial do empreendimento.", 422, parsed.error.flatten());
  }

  const payload = parsed.data;
  let towerName: string | null = null;

  if (payload.towerId) {
    const tower = await prisma.developmentTower.findFirst({
      where: { id: payload.towerId, developmentId: id },
      select: { id: true, name: true }
    });

    if (!tower) {
      return fail("Torre/bloco não pertence a este empreendimento.", 422);
    }

    towerName = tower.name;
  }

  const amenity = await prisma.developmentAmenity.create({
    data: {
      developmentId: id,
      towerId: payload.towerId || undefined,
      type: payload.type,
      label: payload.label.trim(),
      description: optionalString(payload.description),
      icon: optionalString(payload.icon),
      isHighlighted: payload.isHighlighted ?? true,
      position: payload.position ?? 0
    }
  });

  return ok({ amenity: { ...amenity, towerName } }, { status: 201 });
}
