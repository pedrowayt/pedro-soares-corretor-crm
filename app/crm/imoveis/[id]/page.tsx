import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { AuctionReviewPanel, type AuctionReviewData } from "@/components/crm/auction-review-panel";
import { PropertyShareButton } from "@/components/crm/property-share-button";
import { PropertyWizard, type WizardMedia, type WizardProperty } from "@/components/crm/property-wizard";
import { getAuctionPublicationChecklist } from "@/lib/data/auction-imports";
import { findCrmPropertyById } from "@/lib/data/crm-properties";
import { getSiteUrl } from "@/lib/site-url";
import { formatCurrencyBRL } from "@/lib/utils";

export default async function CrmImovelEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await findCrmPropertyById(id);

  if (!property) {
    notFound();
  }

  const media: WizardMedia[] = (property.media ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((item) => ({
      id: item.id,
      url: item.url,
      position: item.position
    }));

  const wizardProperty: WizardProperty = {
    id: property.id,
    title: property.title,
    slug: property.slug,
    type: property.type,
    purpose: property.purpose,
    status: property.status,
    price: Number(property.price),
    city: property.city,
    district: property.district,
    address: property.address ?? null,
    postalCode: property.postalCode ?? null,
    googleMapsUrl: property.googleMapsUrl ?? null,
    latitude: property.latitude ?? null,
    longitude: property.longitude ?? null,
    areaM2: property.areaM2 ?? null,
    landAreaM2: property.landAreaM2 ?? null,
    frontMeters: property.frontMeters ?? null,
    backMeters: property.backMeters ?? null,
    sideLeftMeters: property.sideLeftMeters ?? null,
    sideRightMeters: property.sideRightMeters ?? null,
    ceilingHeightM: property.ceilingHeightM ?? null,
    bedrooms: property.bedrooms ?? null,
    livingRooms: property.livingRooms ?? null,
    suites: property.suites ?? null,
    bathrooms: property.bathrooms ?? null,
    parkingSpaces: property.parkingSpaces ?? null,
    floorNumber: property.floorNumber ?? null,
    floorCount: property.floorCount ?? null,
    unitCount: property.unitCount ?? null,
    description: property.description,
    features: property.features ?? [],
    legalNotes: property.legalNotes ?? null,
    internalNotes: property.internalNotes ?? null,
    commissionPct: property.commissionPct ?? null,
    marketAskingValue: property.marketAskingValue ?? null,
    marketEstimatedValue: property.marketEstimatedValue ?? null,
    marketOpportunity: property.marketOpportunity ?? null,
    marketComparableLinks: property.marketComparableLinks ?? [],
    marketLiquidityNotes: property.marketLiquidityNotes ?? null,
    isInvestorHighlight: property.isInvestorHighlight ?? false,
    isAuctionOpportunity: property.isAuctionOpportunity ?? false,
    ownerName: (property.owner as { name?: string } | null)?.name ?? null,
    ownerPhone: (property.owner as { phone?: string } | null)?.phone ?? null,
    media
  };

  const owner = property.owner as { name?: string; phone?: string } | null;
  const ownerDigits = owner?.phone ? owner.phone.replace(/\D/g, "") : null;
  const whatsappText = encodeURIComponent(
    `Olá! Sou o corretor responsável pelo imóvel "${property.title}" e gostaria de falar com você.`
  );
  const propertyWithAuctionImports = property as typeof property & {
    auctionImports?: Array<{
      id: string;
      source: string;
      externalId: string;
      originalUrl: string;
      status: string;
      rawPayload: unknown;
      missingFields: string[];
      lastImportedAt: Date;
      publishedAt: Date | null;
    }>;
  };
  const auctionImport = propertyWithAuctionImports.auctionImports?.[0] ?? null;
  const showAuctionReviewPanel =
    property.purpose === "LEILAO" || Boolean(property.auctionCase) || Boolean(auctionImport);
  const checklist = showAuctionReviewPanel
    ? getAuctionPublicationChecklist({
        title: property.title,
        description: property.description,
        city: property.city,
        district: property.district,
        price: Number(property.price),
        documents: property.documents ?? null,
        media: (property.media ?? []).map((item) => ({ url: item.url })),
        auctionCase: property.auctionCase
          ? {
              auctionDate: property.auctionCase.auctionDate,
              firstAuctionDate: property.auctionCase.firstAuctionDate,
              secondAuctionDate: property.auctionCase.secondAuctionDate,
              minimumBid: property.auctionCase.minimumBid,
              editalUrl: property.auctionCase.editalUrl,
              occupancyStatus: property.auctionCase.occupancyStatus
            }
          : null,
        auctionImports: auctionImport
          ? [
              {
                source: auctionImport.source,
                externalId: auctionImport.externalId,
                originalUrl: auctionImport.originalUrl
              }
            ]
          : []
      })
    : null;
  const auctionReviewData: AuctionReviewData | null =
    showAuctionReviewPanel && checklist
      ? {
          propertyId: property.id,
          propertyStatus: property.status,
          publishedAt: property.publishedAt?.toISOString() ?? null,
          mediaCount: media.length,
          documentsJson: property.documents ? JSON.stringify(property.documents, null, 2) : null,
          checklist,
          auctionImport: auctionImport
            ? {
                id: auctionImport.id,
                source: auctionImport.source,
                externalId: auctionImport.externalId,
                originalUrl: auctionImport.originalUrl,
                status: auctionImport.status,
                lastImportedAt: auctionImport.lastImportedAt.toISOString(),
                rawPayloadJson: JSON.stringify(auctionImport.rawPayload, null, 2)
              }
            : null,
          auctionCase: property.auctionCase
            ? {
                caseNumber: property.auctionCase.caseNumber,
                courtName: property.auctionCase.courtName,
                auctionDate: property.auctionCase.auctionDate?.toISOString() ?? null,
                firstAuctionDate: property.auctionCase.firstAuctionDate?.toISOString() ?? null,
                secondAuctionDate: property.auctionCase.secondAuctionDate?.toISOString() ?? null,
                minimumBid: property.auctionCase.minimumBid ? Number(property.auctionCase.minimumBid) : null,
                appraisedValue: property.auctionCase.appraisedValue
                  ? Number(property.auctionCase.appraisedValue)
                  : null,
                estimatedCosts: property.auctionCase.estimatedCosts
                  ? Number(property.auctionCase.estimatedCosts)
                  : null,
                documentaryRisk: property.auctionCase.documentaryRisk,
                legalStatus: property.auctionCase.legalStatus,
                editalUrl: property.auctionCase.editalUrl,
                appraisalUrl: property.auctionCase.appraisalUrl,
                registryUrl: property.auctionCase.registryUrl,
                bidUrl: property.auctionCase.bidUrl,
                lotCode: property.auctionCase.lotCode,
                auctioneerName: property.auctionCase.auctioneerName,
                auctionType: property.auctionCase.auctionType,
                auctionMode: property.auctionCase.auctionMode,
                registryNumber: property.auctionCase.registryNumber,
                registryOffice: property.auctionCase.registryOffice,
                occupancyStatus: property.auctionCase.occupancyStatus,
                debtsInfo: property.auctionCase.debtsInfo,
                notes: property.auctionCase.notes
              }
            : null
        }
      : null;
  const canOpenPublicPage = property.purpose !== "LEILAO" || Boolean(property.publishedAt);

  return (
    <>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <Link href="/crm/imoveis" className="button button-ghost">← Voltar</Link>
        {canOpenPublicPage ? (
          <Link href={`/imoveis/${property.slug}`} target="_blank" className="button button-ghost">
            Ver no site
          </Link>
        ) : null}
        {ownerDigits ? (
          <a
            className="button button-ghost"
            href={`https://wa.me/${ownerDigits}?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`Falar com ${owner?.name ?? "proprietário"} no WhatsApp`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <MessageCircle size={16} strokeWidth={1.75} aria-hidden="true" />
            WhatsApp do proprietário
          </a>
        ) : null}
      </div>

      <h1 className="section-title" style={{ marginTop: 0 }}>{property.title}</h1>
      <p className="section-subtitle" style={{ marginTop: 0 }}>
        {property.city} • {property.district} • {formatCurrencyBRL(Number(property.price))}
      </p>
      {owner?.name ? (
        <p className="section-subtitle" style={{ marginTop: 4, color: "var(--text-muted)" }}>
          Proprietário (interno): <strong>{owner.name}</strong>
          {owner.phone ? <> · {owner.phone}</> : null}
        </p>
      ) : null}

      <div style={{ marginTop: 18 }}>
        <PropertyShareButton
          property={{
            title: property.title,
            slug: property.slug,
            city: property.city,
            district: property.district,
            price: Number(property.price),
            areaM2: property.areaM2 ? Number(property.areaM2) : null,
            bedrooms: property.bedrooms ?? null
          }}
          siteUrl={getSiteUrl()}
        />
      </div>

      {auctionReviewData ? <AuctionReviewPanel data={auctionReviewData} /> : null}

      <div style={{ marginTop: 18 }}>
        <PropertyWizard mode="edit" initial={wizardProperty} />
      </div>
    </>
  );
}
