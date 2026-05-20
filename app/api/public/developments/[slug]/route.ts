import { fail, ok } from "@/lib/api/http";
import { getPublicDevelopmentBySlug } from "@/lib/data/developments";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const development = await getPublicDevelopmentBySlug(slug);

  if (!development) {
    return fail("Empreendimento não encontrado.", 404);
  }

  return ok({ development });
}
