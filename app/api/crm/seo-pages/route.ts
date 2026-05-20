import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { createSeoLandingPageInMemory, listCrmSeoLandingPages } from "@/lib/data/seo-landing-pages";
import { prisma } from "@/lib/prisma";
import { crmCreateSeoLandingPageSchema } from "@/lib/validation/schemas";

function normalizePath(path: string) {
  const value = path.trim().toLowerCase();
  if (!value.startsWith("/")) return `/${value}`;
  return value;
}

function optionalString(input?: string | null) {
  if (!input) return null;
  const trimmed = input.trim();
  return trimmed.length ? trimmed : null;
}

export async function GET() {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  try {
    const pages = await prisma.seoLandingPage.findMany({
      orderBy: [{ updatedAt: "desc" }]
    });

    return ok({ pages });
  } catch {
    const pages = await listCrmSeoLandingPages();
    return ok({ pages });
  }
}

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = crmCreateSeoLandingPageSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para criação de página SEO.", 422, parsed.error.flatten());
  }

  const payload = parsed.data;

  try {
    const page = await prisma.seoLandingPage.create({
      data: {
        ...payload,
        path: normalizePath(payload.path),
        district: optionalString(payload.district),
        publishedAt: payload.status === "PUBLISHED" ? new Date() : null
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "SEO_PAGE_CREATED",
        resource: "SeoLandingPage",
        resourceId: page.id,
        actorId: session?.userId,
        metadata: payload as Prisma.InputJsonValue
      }
    });

    return ok({ page }, { status: 201 });
  } catch {
    const page = createSeoLandingPageInMemory({
      ...payload,
      district: optionalString(payload.district)
    });

    return ok(
      {
        page,
        warning:
          "Página criada em modo local (memória). Para persistência definitiva, aplique a migration e conecte o banco."
      },
      { status: 201 }
    );
  }
}
