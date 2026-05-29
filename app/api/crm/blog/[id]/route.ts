import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { deleteBlogPost, getCrmBlogPostById, updateBlogPost } from "@/lib/data/blog";
import { prisma } from "@/lib/prisma";
import { crmUpdateBlogPostSchema } from "@/lib/validation/schemas";

function revalidateBlogPaths(slugs: (string | null | undefined)[]) {
  revalidatePath("/");
  revalidatePath("/blog");
  for (const slug of slugs) {
    if (slug) revalidatePath(`/blog/${slug}`);
  }
}

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await ctx.params;
  const post = await getCrmBlogPostById(id);
  if (!post) return fail("Post não encontrado.", 404);
  return ok({ post });
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await ctx.params;
  const body = await request.json();
  const parsed = crmUpdateBlogPostSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Payload inválido para atualização.", 422, parsed.error.flatten());
  }

  const previous = await getCrmBlogPostById(id);

  try {
    const post = await updateBlogPost(id, parsed.data);
    if (!post) return fail("Post não encontrado.", 404);

    try {
      await prisma.auditLog.create({
        data: {
          action: "BLOG_POST_UPDATED",
          resource: "BlogPost",
          resourceId: id,
          actorId: session?.userId,
          metadata: parsed.data as Prisma.InputJsonValue
        }
      });
    } catch {}

    revalidateBlogPaths([post.slug, previous?.slug]);

    return ok({ post });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return fail("Já existe um post com esse slug.", 409);
    }
    return fail("Não foi possível atualizar o post.", 500);
  }
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await ctx.params;
  const previous = await getCrmBlogPostById(id);
  const removed = await deleteBlogPost(id);
  if (!removed) return fail("Post não encontrado.", 404);

  try {
    await prisma.auditLog.create({
      data: {
        action: "BLOG_POST_DELETED",
        resource: "BlogPost",
        resourceId: id,
        actorId: session?.userId
      }
    });
  } catch {}

  revalidateBlogPaths([previous?.slug]);

  return ok({ removed: true });
}
