import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      stage: true,
      source: true,
      intent: true
    }
  });

  if (!lead) return fail("Lead não encontrado.", 404);

  await prisma.$transaction([
    prisma.lead.delete({ where: { id } }),
    prisma.auditLog.create({
      data: {
        action: "LEAD_DELETED",
        resource: "Lead",
        resourceId: id,
        actorId: session?.userId,
        metadata: {
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          stage: lead.stage,
          source: lead.source,
          intent: lead.intent
        }
      }
    })
  ]);

  return ok({ id });
}
