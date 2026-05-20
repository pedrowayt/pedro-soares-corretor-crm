import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmCreateDevelopmentMilestoneSchema } from "@/lib/validation/schemas";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmCreateDevelopmentMilestoneSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para marco de obra.", 422, parsed.error.flatten());
  }

  const milestone = await prisma.developmentMilestone.create({
    data: {
      developmentId: id,
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status,
      progressPct: parsed.data.progressPct,
      position: parsed.data.position ?? 0,
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : undefined,
      actualDate: parsed.data.actualDate ? new Date(parsed.data.actualDate) : undefined
    }
  });

  return ok({ milestone }, { status: 201 });
}
