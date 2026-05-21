import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { listCrmDevelopments } from "@/lib/data/developments";
import { slugify } from "@/lib/crm/slug";
import { prisma } from "@/lib/prisma";
import { crmCreateDevelopmentSchema } from "@/lib/validation/schemas";

function optionalString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

function optionalArray(input?: string[] | null) {
  if (!input) return [] as string[];
  return input.map((item) => item.trim()).filter(Boolean);
}

function parseReferencePoints(input?: Array<{ name: string; distance?: string; type?: string }> | null) {
  if (!input?.length) return undefined;

  const points = input
    .map((item) => ({
      name: item.name.trim(),
      distance: item.distance?.trim() || null,
      type: item.type?.trim() || null
    }))
    .filter((item) => item.name.length >= 2);

  return points.length ? (points as Prisma.InputJsonValue) : undefined;
}

export async function GET() {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const developments = await listCrmDevelopments({ includeArchived: true });
  return ok({ developments });
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
  const normalizedSlug = slugify(payload.slug);

  const development = await prisma.development.create({
    data: {
      ...payload,
      slug: normalizedSlug,
      amenities: optionalArray(payload.amenities),
      differentials: optionalArray(payload.differentials),
      tagline: optionalString(payload.tagline),
      neighborhood: optionalString(payload.neighborhood),
      address: optionalString(payload.address),
      postalCode: optionalString(payload.postalCode),
      developerName: optionalString(payload.developerName),
      builderName: optionalString(payload.builderName),
      builderId: payload.builderId || undefined,
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
      deliveryDate: payload.deliveryDate ? new Date(payload.deliveryDate) : undefined,
      referencePoints: parseReferencePoints(payload.referencePoints),
      isPublished: payload.isPublished ?? payload.status === "PUBLISHED",
      publishedAt: payload.status === "PUBLISHED" ? new Date() : undefined,
      archivedAt: null
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
