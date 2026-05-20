import { LeadStage } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { createProposalSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = createProposalSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para criação de proposta.", 422, parsed.error.flatten());
  }

  const proposal = await prisma.proposal.create({
    data: {
      ...parsed.data,
      createdById: session?.userId ?? undefined
    }
  });

  await prisma.lead.update({
    where: { id: parsed.data.leadId },
    data: {
      stage: LeadStage.PROPOSTA_ENVIADA
    }
  });

  return ok({ proposal }, { status: 201 });
}
