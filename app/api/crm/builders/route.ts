import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { slugify } from "@/lib/crm/slug";
import { listCrmBuilders } from "@/lib/data/developments";
import { prisma } from "@/lib/prisma";
import { crmCreateBuilderSchema } from "@/lib/validation/schemas";

function optionalString(input?: string | null) {
  if (input === undefined) return undefined;
  if (input === null) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

export async function GET() {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const builders = await listCrmBuilders({ includeArchived: true });
  return ok({ builders });
}

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = crmCreateBuilderSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para construtora.", 422, parsed.error.flatten());
  }

  const payload = parsed.data;

  const builder = await prisma.builder.create({
    data: {
      ...payload,
      slug: slugify(payload.slug),
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
      action: "BUILDER_CREATED",
      resource: "Builder",
      resourceId: builder.id,
      actorId: session?.userId,
      metadata: payload as Prisma.InputJsonValue
    }
  });

  return ok({ builder }, { status: 201 });
}
