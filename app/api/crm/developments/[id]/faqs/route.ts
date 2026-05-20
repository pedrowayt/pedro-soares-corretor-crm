import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmCreateDevelopmentFaqSchema } from "@/lib/validation/schemas";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmCreateDevelopmentFaqSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para FAQ do empreendimento.", 422, parsed.error.flatten());
  }

  const faq = await prisma.developmentFaq.create({
    data: {
      developmentId: id,
      question: parsed.data.question,
      answer: parsed.data.answer,
      position: parsed.data.position ?? 0
    }
  });

  return ok({ faq }, { status: 201 });
}
