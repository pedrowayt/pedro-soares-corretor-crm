import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { unpublishAuctionImport } from "@/lib/data/auction-imports";
import { createPropertyAuditLog } from "@/lib/data/crm-properties";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const result = await unpublishAuctionImport(id);

  if (!result.ok) {
    return fail("Importação de leilão não encontrada.", 404);
  }

  await createPropertyAuditLog({
    action: "AUCTION_IMPORT_UNPUBLISHED",
    resourceId: result.propertyId,
    actorId: session?.userId,
    payload: {
      auctionImportId: id,
      missingFields: result.missingFields
    }
  });

  return ok({
    auctionImport: result.auctionImport,
    propertyId: result.propertyId,
    missingFields: result.missingFields
  });
}
