import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { listCrmBlogCategories, updateBlogCategory } from "@/lib/data/blog";
import { prisma } from "@/lib/prisma";
import { crmUpdateBlogCategorySchema } from "@/lib/validation/schemas";

function revalidateBlogCategoryPaths(slugs: Array<string | null | undefined>) {
  revalidatePath("/blog");
  for (const slug of slugs) {
    if (slug) revalidatePath(`/blog/categoria/${slug}`);
  }
}

async function getCategorySnapshot(id: string) {
  const categories = await listCrmBlogCategories();
  return categories.find((category) => category.id === id) ?? null;
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await ctx.params;
  const previous = await getCategorySnapshot(id);
  const body = await request.json();
  const parsed = crmUpdateBlogCategorySchema.safeParse(body);
  if (!parsed.success) {
    return fail("Payload inválido para atualização de categoria.", 422, parsed.error.flatten());
  }

  try {
    const category = await updateBlogCategory(id, parsed.data);
    if (!category) return fail("Categoria não encontrada.", 404);

    try {
      await prisma.auditLog.create({
        data: {
          action: "BLOG_CATEGORY_UPDATED",
          resource: "BlogCategory",
          resourceId: category.id,
          actorId: session?.userId,
          metadata: parsed.data as Prisma.InputJsonValue
        }
      });
    } catch {}

    revalidateBlogCategoryPaths([previous?.slug, category.slug]);
    return ok({ category });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return fail("Já existe uma categoria com esse slug.", 409);
    }
    return fail("Não foi possível atualizar a categoria.", 500);
  }
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await ctx.params;
  const previous = await getCategorySnapshot(id);
  const category = await updateBlogCategory(id, { active: false });
  if (!category) return fail("Categoria não encontrada.", 404);

  try {
    await prisma.auditLog.create({
      data: {
        action: "BLOG_CATEGORY_ARCHIVED",
        resource: "BlogCategory",
        resourceId: category.id,
        actorId: session?.userId
      }
    });
  } catch {}

  revalidateBlogCategoryPaths([previous?.slug, category.slug]);
  return ok({ category });
}
