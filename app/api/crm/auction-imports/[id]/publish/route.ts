import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { publishAuctionImport } from "@/lib/data/auction-imports";
import { createPropertyAuditLog } from "@/lib/data/crm-properties";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const result = await publishAuctionImport(id);

  if (!result.ok) {
    if (result.reason === "not_found") {
      return fail("Importação de leilão não encontrada.", 404);
    }
    return fail("Leilão incompleto para publicação.", 409, {
      missingFields: result.missingFields
    });
  }

  await createPropertyAuditLog({
    action: "AUCTION_IMPORT_PUBLISHED",
    resourceId: result.propertyId,
    actorId: session?.userId,
    payload: { auctionImportId: id }
  });

  return ok({
    auctionImport: result.auctionImport,
    propertyId: result.propertyId
  });
}
