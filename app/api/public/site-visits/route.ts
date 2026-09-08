import { ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { publicSiteVisitSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = publicSiteVisitSchema.safeParse(body);

  if (!parsed.success) return ok({ tracked: false });

  const { path } = parsed.data;
  if (path.startsWith("/api") || path.startsWith("/admin") || path.startsWith("/crm")) {
    return ok({ tracked: false });
  }

  try {
    await prisma.siteVisit.create({ data: parsed.data });
    return ok({ tracked: true });
  } catch {
    // Analytics must never break the public site.
    return ok({ tracked: false });
  }
}
