import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { getCrmBuilderById } from "@/lib/data/developments";
import { slugify } from "@/lib/crm/slug";
import { prisma } from "@/lib/prisma";
import { crmUpdateBuilderSchema } from "@/lib/validation/schemas";

function optionalString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const builder = await getCrmBuilderById(id);

  if (!builder) {
    return fail("Construtora não encontrada.", 404);
  }

  return ok({ builder });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();
  const parsed = crmUpdateBuilderSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para atualização de construtora.", 422, parsed.error.flatten());
  }

  const payload = parsed.data;

  const builder = await prisma.builder.update({
    where: { id },
    data: {
      ...payload,
      slug: payload.slug ? slugify(payload.slug) : undefined,
      logoUrl: optionalString(payload.logoUrl),
      description: optionalString(payload.description),
      city: optionalString(payload.city),
      state: optionalString(payload.state),
      website: optionalString(payload.website),
      instagram: optionalString(payload.instagram),
      institutionalText: optionalString(payload.institutionalText)
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "BUILDER_UPDATED",
      resource: "Builder",
      resourceId: builder.id,
      actorId: session?.userId,
      metadata: payload as Prisma.InputJsonValue
    }
  });

  return ok({ builder });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;

  const builder = await prisma.builder.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!builder) return fail("Construtora não encontrada.", 404);

  await prisma.builder.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      action: "BUILDER_DELETED",
      resource: "Builder",
      resourceId: id,
      actorId: session?.userId,
      metadata: { name: builder.name } as Prisma.InputJsonValue
    }
  });

  return ok({ id });
}
