import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { slugify } from "@/lib/crm/slug";
import { prisma } from "@/lib/prisma";
import { crmCreateDevelopmentTowerSchema } from "@/lib/validation/schemas";

function optionalString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmCreateDevelopmentTowerSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para torre/bloco de empreendimento.", 422, parsed.error.flatten());
  }

  const payload = parsed.data;
  const tower = await prisma.developmentTower.create({
    data: {
      developmentId: id,
      name: payload.name.trim(),
      slug: payload.slug ? slugify(payload.slug) : slugify(payload.name),
      propertyType: payload.propertyType,
      description: optionalString(payload.description),
      floorsCount: payload.floorsCount,
      elevatorsCount: payload.elevatorsCount,
      totalUnits: payload.totalUnits,
      availableUnits: payload.availableUnits,
      deliveryDate: payload.deliveryDate ? new Date(payload.deliveryDate) : undefined,
      incorporationRegistry: optionalString(payload.incorporationRegistry),
      position: payload.position ?? 0
    }
  });

  return ok({ tower }, { status: 201 });
}

