import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { slugify } from "@/lib/crm/slug";
import { prisma } from "@/lib/prisma";
import { crmCreateDevelopmentSchema } from "@/lib/validation/schemas";

function optionalString(input?: string | null) {
  if (!input) return undefined;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : undefined;
}

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = crmCreateDevelopmentSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para criação de empreendimento.", 422, parsed.error.flatten());
  }

  const payload = parsed.data;

  const development = await prisma.development.create({
    data: {
      ...payload,
      slug: slugify(payload.slug),
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
      action: "DEVELOPMENT_CREATED",
      resource: "Development",
      resourceId: development.id,
      actorId: session?.userId,
      metadata: payload as Prisma.InputJsonValue
    }
  });

  return ok({ development }, { status: 201 });
}
