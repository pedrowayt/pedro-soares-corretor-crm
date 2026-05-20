import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmCreateDevelopmentUnitTypeSchema } from "@/lib/validation/schemas";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmCreateDevelopmentUnitTypeSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para tipologia de empreendimento.", 422, parsed.error.flatten());
  }

  const unitType = await prisma.developmentUnitType.create({
    data: {
      developmentId: id,
      ...parsed.data
    }
  });

  return ok({ unitType }, { status: 201 });
}
