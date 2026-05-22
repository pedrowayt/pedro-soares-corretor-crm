import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmCreateDevelopmentUnitTypeSchema } from "@/lib/validation/schemas";

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
  const parsed = crmCreateDevelopmentUnitTypeSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para tipologia de empreendimento.", 422, parsed.error.flatten());
  }

  if (parsed.data.towerId) {
    const tower = await prisma.developmentTower.findFirst({
      where: {
        id: parsed.data.towerId,
        developmentId: id
      },
      select: { id: true }
    });

    if (!tower) {
      return fail("Torre/bloco não encontrado para este empreendimento.", 404);
    }
  }

  const unitType = await prisma.developmentUnitType.create({
    data: {
      developmentId: id,
      ...parsed.data,
      towerId: parsed.data.towerId || undefined,
      imageUrl: parsed.data.imageUrl || undefined,
      description: optionalString(parsed.data.description)
    }
  });

  return ok({ unitType }, { status: 201 });
}
