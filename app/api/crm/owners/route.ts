import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmCreateOwnerSchema } from "@/lib/validation/schemas";

function optionalString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeOwnerPayload(payload: {
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  district?: string | null;
  address?: string | null;
  notes?: string | null;
}) {
  return {
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: optionalString(payload.email),
    city: optionalString(payload.city),
    district: optionalString(payload.district),
    address: optionalString(payload.address),
    notes: optionalString(payload.notes)
  };
}

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = crmCreateOwnerSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para proprietário.", 422, parsed.error.flatten());
  }

  const payload = normalizeOwnerPayload(parsed.data);
  const owner = await prisma.owner.create({
    data: payload,
    include: {
      properties: {
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          purpose: true,
          status: true,
          price: true,
          city: true,
          district: true,
          updatedAt: true
        }
      },
      leads: { select: { id: true } }
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "OWNER_CREATED",
      resource: "Owner",
      resourceId: owner.id,
      actorId: session?.userId,
      metadata: payload as Prisma.InputJsonValue
    }
  });

  return ok({ owner }, { status: 201 });
}
