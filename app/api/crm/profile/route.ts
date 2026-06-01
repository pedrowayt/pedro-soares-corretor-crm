import { Role } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { getSession, hasAnyRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { crmUpdateProfileSchema } from "@/lib/validation/schemas";

function nullable(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session || !hasAnyRole(session, [Role.ADMIN, Role.CORRETOR, Role.PARCEIRO])) {
    return fail("Sessão expirada. Faça login novamente.", 401);
  }

  const body = await request.json().catch(() => null);
  const parsed = crmUpdateProfileSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para atualizar perfil.", 422, parsed.error.flatten());
  }

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: {
      name: parsed.data.name,
      phone: nullable(parsed.data.phone),
      creci: nullable(parsed.data.creci),
      jobTitle: nullable(parsed.data.jobTitle),
      bio: nullable(parsed.data.bio),
      instagramUrl: nullable(parsed.data.instagramUrl),
      profilePhotoUrl: nullable(parsed.data.profilePhotoUrl)
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      creci: true,
      role: true,
      profilePhotoUrl: true,
      jobTitle: true,
      bio: true,
      instagramUrl: true
    }
  });

  await prisma.auditLog
    .create({
      data: {
        action: "user.profile.update",
        resource: "User",
        resourceId: updated.id,
        actorId: session.userId,
        metadata: {
          fields: ["name", "phone", "creci", "jobTitle", "bio", "instagramUrl", "profilePhotoUrl"]
        }
      }
    })
    .catch(() => null);

  return ok({ profile: updated });
}
