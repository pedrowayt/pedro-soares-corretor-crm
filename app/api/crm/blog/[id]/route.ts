import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { deleteBlogPost, getCrmBlogPostById, updateBlogPost } from "@/lib/data/blog";
import { prisma } from "@/lib/prisma";
import { crmUpdateBlogPostSchema } from "@/lib/validation/schemas";

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

  return ok({ removed: true });
}
