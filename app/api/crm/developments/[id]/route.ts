import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { slugify } from "@/lib/crm/slug";
import { prisma } from "@/lib/prisma";
import { crmUpdateDevelopmentSchema } from "@/lib/validation/schemas";

function optionalString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmUpdateDevelopmentSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para atualização de empreendimento.", 422, parsed.error.flatten());
  }

  const payload = parsed.data;

  const development = await prisma.development.update({
    where: { id },
    data: {
      ...payload,
      slug: payload.slug ? slugify(payload.slug) : undefined,
      mapEmbedUrl: optionalString(payload.mapEmbedUrl),
      tablePdfUrl: optionalString(payload.tablePdfUrl),
      ctaPrimaryUrl: optionalString(payload.ctaPrimaryUrl),
      ctaSecondaryUrl: optionalString(payload.ctaSecondaryUrl),
      seoOgImageUrl: optionalString(payload.seoOgImageUrl),
      deliveryDate: payload.deliveryDate ? new Date(payload.deliveryDate) : undefined,
      latitude: payload.latitude,
      longitude: payload.longitude,
      publishedAt: payload.status === "PUBLISHED" ? new Date() : undefined
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "DEVELOPMENT_UPDATED",
      resource: "Development",
      resourceId: development.id,
      actorId: session?.userId,
      metadata: payload as Prisma.InputJsonValue
    }
  });

  return ok({ development });
}
