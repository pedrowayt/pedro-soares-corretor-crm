import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { getCrmDevelopmentById } from "@/lib/data/developments";
import { slugify } from "@/lib/crm/slug";
import { prisma } from "@/lib/prisma";
import { crmUpdateDevelopmentSchema } from "@/lib/validation/schemas";

function optionalString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

function optionalArray(input?: string[] | null) {
  if (input === undefined) return undefined;
  if (input === null) return [];
  return input.map((item) => item.trim()).filter(Boolean);
}

function parseReferencePoints(input?: Array<{ name: string; distance?: string; type?: string }> | null) {
  if (input === undefined) return undefined;
  if (!input?.length) return Prisma.JsonNull;

  const points = input
    .map((item) => ({
      name: item.name.trim(),
      distance: item.distance?.trim() || null,
      type: item.type?.trim() || null
    }))
    .filter((item) => item.name.length >= 2);

  return points.length ? (points as Prisma.InputJsonValue) : Prisma.JsonNull;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const development = await getCrmDevelopmentById(id);

  if (!development) {
    return fail("Empreendimento não encontrado.", 404);
  }

  return ok({ development });
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
      amenities: optionalArray(payload.amenities),
      differentials: optionalArray(payload.differentials),
      tagline: optionalString(payload.tagline),
      neighborhood: optionalString(payload.neighborhood),
      address: optionalString(payload.address),
      postalCode: optionalString(payload.postalCode),
      developerName: optionalString(payload.developerName),
      builderName: optionalString(payload.builderName),
      builderId: payload.builderId === null ? null : payload.builderId || undefined,
      mapEmbedUrl: optionalString(payload.mapEmbedUrl),
      tablePdfUrl: optionalString(payload.tablePdfUrl),
      whatsappMessageTemplate: optionalString(payload.whatsappMessageTemplate),
      ctaPrimaryLabel: optionalString(payload.ctaPrimaryLabel),
      ctaPrimaryUrl: optionalString(payload.ctaPrimaryUrl),
      ctaSecondaryLabel: optionalString(payload.ctaSecondaryLabel),
      ctaSecondaryUrl: optionalString(payload.ctaSecondaryUrl),
      seoTitle: optionalString(payload.seoTitle),
      seoDescription: optionalString(payload.seoDescription),
      seoOgImageUrl: optionalString(payload.seoOgImageUrl),
      seoKeyword: optionalString(payload.seoKeyword),
      incorporationRegistry: optionalString(payload.incorporationRegistry),
      projectText: optionalString(payload.projectText),
      apartmentsText: optionalString(payload.apartmentsText),
      locationText: optionalString(payload.locationText),
      locationHighlights: optionalString(payload.locationHighlights),
      regionLiquidityNotes: optionalString(payload.regionLiquidityNotes),
      appreciationPotential: optionalString(payload.appreciationPotential),
      buyerProfile: optionalString(payload.buyerProfile),
      opportunityText: optionalString(payload.opportunityText),
      deliveryDate:
        payload.deliveryDate === undefined
          ? undefined
          : payload.deliveryDate
            ? new Date(payload.deliveryDate)
            : null,
      referencePoints: parseReferencePoints(payload.referencePoints),
      isPublished:
        payload.isPublished === undefined
          ? payload.status === "PUBLISHED"
            ? true
            : undefined
          : payload.isPublished,
      publishedAt:
        payload.status === "PUBLISHED"
          ? new Date()
          : payload.status === undefined
            ? undefined
            : null
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
