import { ok, fail } from "@/lib/api/http";
import { getPropertyBySlug } from "@/lib/data/properties";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return fail("Imóvel não encontrado.", 404);
  }

  return ok({ property });
}
