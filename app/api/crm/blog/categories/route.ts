import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { createBlogCategory, listCrmBlogCategories } from "@/lib/data/blog";
import { prisma } from "@/lib/prisma";
import { crmCreateBlogCategorySchema } from "@/lib/validation/schemas";

function revalidateBlogCategoryPaths(slug?: string | null) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/categoria/${slug}`);
}

export async function GET() {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const categories = await listCrmBlogCategories();
  return ok({ categories });
}

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = crmCreateBlogCategorySchema.safeParse(body);
  if (!parsed.success) {
    return fail("Payload inválido para criação de categoria.", 422, parsed.error.flatten());
  }

  try {
    const category = await createBlogCategory(parsed.data);

    try {
      await prisma.auditLog.create({
        data: {
          action: "BLOG_CATEGORY_CREATED",
          resource: "BlogCategory",
          resourceId: category.id,
          actorId: session?.userId,
          metadata: parsed.data as Prisma.InputJsonValue
        }
      });
    } catch {}

    revalidateBlogCategoryPaths(category.slug);
    return ok({ category }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return fail("Já existe uma categoria com esse slug.", 409);
    }
    return fail("Não foi possível criar a categoria.", 500);
  }
}
