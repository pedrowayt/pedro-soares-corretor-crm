import { DevelopmentForms } from "@/components/crm/development-forms";
import { listCrmBuilders, listCrmDevelopments } from "@/lib/data/developments";

export default async function CrmEmpreendimentosPage() {
  const [developments, builders] = await Promise.all([
    listCrmDevelopments({ includeArchived: true }),
    listCrmBuilders()
  ]);

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>
        Empreendimentos
      </h1>
      <p className="section-subtitle">
        Gestão completa de lançamentos com workflow editorial, tipologias, mídia Cloudflare, construtora, SEO e publicação.
      </p>

      <div style={{ marginTop: 16 }}>
        <DevelopmentForms
          developments={developments.map((item) => ({
            ...item,
            builderId: item.builderId ?? null,
            builderName: item.builderName ?? null,
            developerName: item.developerName ?? null,
            deliveryDate: item.deliveryDate ? new Date(item.deliveryDate).toISOString() : null,
            constructionProgressPct: item.constructionProgressPct ?? null,
            appreciationPotential: item.appreciationPotential ?? null,
            buyerProfile: item.buyerProfile ?? null,
            opportunityText: item.opportunityText ?? null,
            showInvestmentPotentialBlock: item.showInvestmentPotentialBlock ?? true,
            tagline: item.tagline ?? null,
            regionLiquidityNotes: item.regionLiquidityNotes ?? null,
            neighborhood: item.neighborhood ?? null,
            address: item.address ?? null,
            postalCode: item.postalCode ?? null,
            latitudeNumber: item.latitudeNumber,
            longitudeNumber: item.longitudeNumber,
            mapEmbedUrl: item.mapEmbedUrl ?? null,
            tablePdfUrl: item.tablePdfUrl ?? null,
            whatsappMessageTemplate: item.whatsappMessageTemplate ?? null,
            ctaPrimaryLabel: item.ctaPrimaryLabel ?? null,
            ctaPrimaryUrl: item.ctaPrimaryUrl ?? null,
            ctaSecondaryLabel: item.ctaSecondaryLabel ?? null,
            ctaSecondaryUrl: item.ctaSecondaryUrl ?? null,
            seoTitle: item.seoTitle ?? null,
            seoDescription: item.seoDescription ?? null,
            seoOgImageUrl: item.seoOgImageUrl ?? null,
            seoKeyword: item.seoKeyword ?? null,
            propertyType: item.propertyType ?? null,
            startingPriceNumber: item.startingPriceNumber,
            priceMaxNumber: item.priceMaxNumber,
            areaFromM2Number: item.areaFromM2Number,
            areaToM2Number: item.areaToM2Number,
            landAreaM2Number: item.landAreaM2Number,
            bedroomsFrom: item.bedroomsFrom ?? null,
            bedroomsTo: item.bedroomsTo ?? null,
            suitesFrom: item.suitesFrom ?? null,
            suitesTo: item.suitesTo ?? null,
            bathroomsFrom: item.bathroomsFrom ?? null,
            bathroomsTo: item.bathroomsTo ?? null,
            parkingFrom: item.parkingFrom ?? null,
            parkingTo: item.parkingTo ?? null,
            towersCount: item.towersCount ?? null,
            floorsCount: item.floorsCount ?? null,
            elevatorsCount: item.elevatorsCount ?? null,
            totalUnits: item.totalUnits ?? null,
            availableUnits: item.availableUnits ?? null,
            incorporationRegistry: item.incorporationRegistry ?? null,
            hasPatrimonyOfAffectation: item.hasPatrimonyOfAffectation ?? null,
            projectText: item.projectText ?? null,
            apartmentsText: item.apartmentsText ?? null,
            locationText: item.locationText ?? null,
            locationHighlights: item.locationHighlights ?? null,
            referencePoints: item.referencePoints,
            seoNoIndex: item.seoNoIndex,
            isFeatured: item.isFeatured,
            displayOrder: item.displayOrder,
            showPrice: item.showPrice,
            showMap: item.showMap,
            showBuilder: item.showBuilder,
            showFloorplanTable: item.showFloorplanTable,
            showWhatsappButton: item.showWhatsappButton,
            isPublished: item.isPublished,
            amenities: Array.from(item.amenities ?? []),
            differentials: Array.from(item.differentials ?? []),
            media: item.media.map((media, mediaIndex) => ({
              id: media.id,
              url: media.url,
              title: media.title ?? null,
              kind: String(media.kind),
              category: media.category ?? "OUTROS",
              position: typeof media.position === "number" ? media.position : mediaIndex
            })),
            unitTypes: item.unitTypes.map((unit) => ({
              id: unit.id,
              name: unit.name,
              unitCategory: unit.unitCategory ?? null,
              bedrooms: unit.bedrooms ?? null,
              suites: unit.suites ?? null,
              bathrooms: unit.bathrooms ?? null,
              parkingSpaces: unit.parkingSpaces ?? null,
              areaPrivateM2Number: unit.areaPrivateM2Number,
              areaTotalM2Number: unit.areaTotalM2Number,
              initialPriceNumber: unit.initialPriceNumber,
              isAvailable: unit.isAvailable
            })),
            milestones: item.milestones.map((milestone) => ({
              id: milestone.id,
              title: milestone.title,
              status: milestone.status,
              progressPct: milestone.progressPct ?? null
            })),
            faqs: item.faqs.map((faq) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer
            }))
          }))}
          builders={builders.map((builder) => ({
            id: builder.id,
            name: builder.name,
            slug: builder.slug
          }))}
        />
      </div>
    </>
  );
}
