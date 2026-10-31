import { fail, ok } from "@/lib/api/http";
import { requireCrmAdminAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { crmCreateWhatsappTemplateSchema } from "@/lib/validation/schemas";

export async function GET() {
  const { denied } = await requireCrmAdminAccess();
  if (denied) return denied;
  const templates = await prisma.whatsappTemplate.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }] });
  return ok({ templates });
}

export async function POST(request: Request) {
  const { denied } = await requireCrmAdminAccess();
  if (denied) return denied;
  const parsed = crmCreateWhatsappTemplateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail("Preencha nome, categoria e mensagem do template.", 422, parsed.error.flatten());

  const template = await prisma.whatsappTemplate.create({ data: parsed.data });
  return ok({ template }, { status: 201 });
}
