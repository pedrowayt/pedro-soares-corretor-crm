import { ok } from "@/lib/api/http";
import { incrementBlogPostViews } from "@/lib/data/blog";

export const runtime = "nodejs";

export async function POST(_request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (slug) {
    // fire-and-forget; do not fail the response if the slug doesn't exist
    await incrementBlogPostViews(slug);
  }
  return ok({ recorded: true });
}
