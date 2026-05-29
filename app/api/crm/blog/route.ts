import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { createBlogPost, listCrmBlogPosts } from "@/lib/data/blog";
import { prisma } from "@/lib/prisma";
import { crmCreateBlogPostSchema } from "@/lib/validation/schemas";

export async function GET() {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const posts = await listCrmBlogPosts();
  return ok({ posts });
}

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = crmCreateBlogPostSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para criação de post.", 422, parsed.error.flatten());
  }

  try {
    const post = await createBlogPost({
      ...parsed.data,
      authorId: session?.userId ?? null
    });

    try {
      await prisma.auditLog.create({
        data: {
          action: "BLOG_POST_CREATED",
          resource: "BlogPost",
          resourceId: post.id,
          actorId: session?.userId,
          metadata: parsed.data as Prisma.InputJsonValue
        }
      });
    } catch {
      // audit log is best-effort
    }

    return ok({ post }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return fail("Já existe um post com esse slug.", 409);
    }
    return fail("Não foi possível criar o post.", 500);
  }
}
