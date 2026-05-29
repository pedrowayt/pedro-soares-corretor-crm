import { fail, ok } from "@/lib/api/http";
import { generateBlogDraft } from "@/lib/ai/blog-draft";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 60;

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const bearer = header.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : null;
  if (bearer && bearer === secret) return true;

  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token");
  return Boolean(queryToken && queryToken === secret);
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return fail("Cron não autorizado.", 401);
  }

  try {
    const result = await generateBlogDraft();

    try {
      await prisma.auditLog.create({
        data: {
          action: "BLOG_DRAFT_GENERATED",
          resource: "BlogPost",
          resourceId: result.postId,
          metadata: { topic: result.topic, slug: result.slug }
        }
      });
    } catch {}

    return ok({ draft: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha na geração.";
    return fail(message, 500);
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
