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

  const media = await prisma.developmentMedia.create({
    data: {
      developmentId: id,
      kind: parsed.data.kind,
      url: parsed.data.url,
      title: parsed.data.title,
      position: parsed.data.position ?? 0,
      cloudflareMediaId: parsed.data.cloudflareMediaId,
      status: parsed.data.status,
      metadata: parsed.data.metadata as Prisma.InputJsonValue | undefined
    }
  });

  return ok({ media }, { status: 201 });
}
