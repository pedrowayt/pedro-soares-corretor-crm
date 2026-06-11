import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmUpdateOwnerSchema } from "@/lib/validation/schemas";

function optionalString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeOwnerPayload(payload: {
  name?: string;
  phone?: string;
  email?: string | null;
  city?: string | null;
  district?: string | null;
  address?: string | null;
  notes?: string | null;
}) {
  return {
    name: payload.name?.trim(),
    phone: payload.phone?.trim(),
    email: optionalString(payload.email),
    city: optionalString(payload.city),
    district: optionalString(payload.district),
    address: optionalString(payload.address),
    notes: optionalString(payload.notes)
  };
}

const ownerInclude = {
  properties: {
    orderBy: { updatedAt: "desc" as const },
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
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmUpdateOwnerSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para atualização de proprietário.", 422, parsed.error.flatten());
  }

  const current = await prisma.owner.findUnique({ where: { id }, select: { id: true } });
  if (!current) {
    return fail("Proprietário não encontrado.", 404);
  }

  const payload = normalizeOwnerPayload(parsed.data);
  const owner = await prisma.owner.update({
    where: { id },
    data: payload,
    include: ownerInclude
  });

  await prisma.auditLog.create({
    data: {
      action: "OWNER_UPDATED",
      resource: "Owner",
      resourceId: owner.id,
      actorId: session?.userId,
      metadata: payload as Prisma.InputJsonValue
    }
  });

  return ok({ owner });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const owner = await prisma.owner.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      _count: {
        select: {
          properties: true,
          leads: true
        }
      }
    }
  });

  if (!owner) return fail("Proprietário não encontrado.", 404);

  await prisma.$transaction([
    prisma.owner.delete({ where: { id } }),
    prisma.auditLog.create({
      data: {
        action: "OWNER_DELETED",
        resource: "Owner",
        resourceId: id,
        actorId: session?.userId,
        metadata: {
          name: owner.name,
          phone: owner.phone,
          linkedProperties: owner._count.properties,
          linkedLeads: owner._count.leads
        }
      }
    })
  ]);

  return ok({ id });
}
