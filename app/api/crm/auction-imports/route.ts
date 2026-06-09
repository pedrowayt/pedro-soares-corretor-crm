import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { listAuctionImports } from "@/lib/data/auction-imports";

export async function GET() {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const imports = await listAuctionImports();

  return ok({
    imports: imports.map((item) => ({
      id: item.id,
      source: item.source,
      externalId: item.externalId,
      originalUrl: item.originalUrl,
      status: item.status,
      missingFields: item.missingFields,
      lastImportedAt: item.lastImportedAt,
      publishedAt: item.publishedAt,
      property: item.property
        ? {
            id: item.property.id,
            title: item.property.title,
            slug: item.property.slug,
            city: item.property.city,
            district: item.property.district,
            price: Number(item.property.price),
            status: item.property.status,
            thumbnailUrl: item.property.media[0]?.url ?? null,
            auctionCase: item.property.auctionCase
              ? {
                  minimumBid: item.property.auctionCase.minimumBid
                    ? Number(item.property.auctionCase.minimumBid)
                    : null,
                  auctionDate: item.property.auctionCase.auctionDate,
                  firstAuctionDate: item.property.auctionCase.firstAuctionDate,
                  secondAuctionDate: item.property.auctionCase.secondAuctionDate
                }
              : null
          }
        : null
    }))
  });
}
