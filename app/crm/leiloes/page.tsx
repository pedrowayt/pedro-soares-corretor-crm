import { AuctionImportList, type AuctionImportListItem } from "@/components/crm/auction-import-list";
import { listAuctionImports } from "@/lib/data/auction-imports";

export default async function CrmLeiloesPage() {
  const imports = await listAuctionImports();

  const items: AuctionImportListItem[] = imports.map((item) => ({
    id: item.id,
    source: item.source,
    externalId: item.externalId,
    originalUrl: item.originalUrl,
    status: item.status,
    missingFields: item.missingFields,
    lastImportedAt: item.lastImportedAt.toISOString(),
    publishedAt: item.publishedAt?.toISOString() ?? null,
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
                auctionDate: item.property.auctionCase.auctionDate?.toISOString() ?? null,
                firstAuctionDate: item.property.auctionCase.firstAuctionDate?.toISOString() ?? null,
                secondAuctionDate: item.property.auctionCase.secondAuctionDate?.toISOString() ?? null
              }
            : null
        }
      : null
  }));

  return (
    <div className="crm-property-manager">
      <div className="crm-property-manager__head">
        <div>
          <h1 className="section-title" style={{ marginTop: 0 }}>Leilões</h1>
          <p className="section-subtitle">
            Imóveis recebidos por API, aguardando revisão e publicação manual.
          </p>
        </div>
      </div>

      <AuctionImportList imports={items} />
    </div>
  );
}
