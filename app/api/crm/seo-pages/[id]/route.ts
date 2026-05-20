import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { updateSeoLandingPageInMemory } from "@/lib/data/seo-landing-pages";
import { prisma } from "@/lib/prisma";
import { crmUpdateSeoLandingPageSchema } from "@/lib/validation/schemas";

function normalizePath(path?: string) {
  if (!path) return undefined;
  const value = path.trim().toLowerCase();
  if (!value.length) return undefined;
  if (!value.startsWith("/")) return `/${value}`;
  return value;
}

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
  const parsed = crmUpdateSeoLandingPageSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para atualização da página SEO.", 422, parsed.error.flatten());
  }

  const payload = parsed.data;

  try {
    const page = await prisma.seoLandingPage.update({
      where: { id },
      data: {
        ...payload,
        path: normalizePath(payload.path),
        district: optionalString(payload.district),
        publishedAt: payload.status === "PUBLISHED" ? new Date() : undefined
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "SEO_PAGE_UPDATED",
        resource: "SeoLandingPage",
        resourceId: page.id,
        actorId: session?.userId,
        metadata: payload as Prisma.InputJsonValue
      }
    });

    return ok({ page });
  } catch {
    const page = updateSeoLandingPageInMemory(id, {
      ...payload,
      district: payload.district !== undefined ? optionalString(payload.district) : undefined
    });

    if (!page) {
      return fail("Página SEO não encontrada para atualização local.", 404);
    }

    return ok({
      page,
      warning:
        "Página atualizada em modo local (memória). Para persistência definitiva, aplique a migration e conecte o banco."
    });
  }
}
