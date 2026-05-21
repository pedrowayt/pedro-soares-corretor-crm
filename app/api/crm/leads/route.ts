import { DevelopmentLeadStatus } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmCreateLeadSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = crmCreateLeadSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para criação de lead.", 422, parsed.error.flatten());
  }

  const lead = await prisma.lead.create({
    data: {
      ...parsed.data,
      developmentLeadStatus:
        parsed.data.developmentLeadStatus ??
        (parsed.data.linkedDevelopmentId ? DevelopmentLeadStatus.NOVO : undefined),
      ownerUserId: parsed.data.ownerUserId ?? session?.userId ?? undefined
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "LEAD_CREATED",
      resource: "Lead",
      resourceId: lead.id,
      actorId: session?.userId,
      metadata: parsed.data
    }
  });

  return ok({ lead }, { status: 201 });
}
