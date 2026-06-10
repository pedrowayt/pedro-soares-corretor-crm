import { Prisma } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { requireCrmAdminAccess } from "@/lib/auth/permissions";
import {
  createAuctionImportSource,
  isUniqueConstraintError,
  listAuctionImportSources
} from "@/lib/data/auction-import-sources";
import { crmCreateAuctionImportSourceSchema } from "@/lib/validation/schemas";

export async function GET() {
  const { denied } = await requireCrmAdminAccess();
  if (denied) return denied;

  const sources = await listAuctionImportSources();
  return ok({ sources });
}

export async function POST(request: Request) {
  const { denied } = await requireCrmAdminAccess();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const parsed = crmCreateAuctionImportSourceSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para fonte de leilão.", 422, parsed.error.flatten());
  }

  try {
    const result = await createAuctionImportSource(parsed.data);
    return ok(
      {
        source: result.source,
        token: result.token
      },
      { status: 201 }
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return fail("Já existe uma fonte com esse source key ou token.", 409);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return fail("Não foi possível criar a fonte de leilão.", 400, { code: error.code });
    }
    return fail(error instanceof Error ? error.message : "Não foi possível criar a fonte de leilão.", 400);
  }
}
