import type { PropertyPurpose, PropertyType } from "@prisma/client";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

const TYPE_TO_VR: Record<string, string> = {
  CASA: "Casa",
  CASA_EM_CONDOMINIO: "Casa de Condomínio",
  CASA_GEMINADA: "Casa Geminada",
  SOBRADO: "Sobrado",
  APARTAMENTO: "Apartamento",
  AREA_PRIVATIVA: "Apartamento",
  COBERTURA: "Cobertura",
  FLAT: "Flat",
  LOTE: "Lote/Terreno",
  LOTE_EM_CONDOMINIO: "Lote/Terreno",
  CHACARA: "Chácara",
  CHACARA_EM_CONDOMINIO: "Chácara",
  FAZENDA: "Fazenda",
  RURAL: "Sítio",
  GALPAO: "Galpão",
  LOJA: "Loja",
  SALA: "Conjunto Comercial/Sala",
  COMERCIAL: "Imóvel Comercial",
  PREDIO: "Prédio Inteiro"
};

const PURPOSE_TO_VR: Record<string, string> = {
  VENDA: "For Sale",
  LOCACAO: "For Rent",
  INVESTIMENTO: "For Sale",
  LEILAO: "For Sale",
  LANCAMENTO: "For Sale"
};

type FeedProperty = {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: PropertyType | string;
  purpose: PropertyPurpose | string;
  price: number;
  city: string;
  district: string;
  address?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  areaM2?: number | null;
  landAreaM2?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  suites?: number | null;
  parkingSpaces?: number | null;
  features?: ReadonlyArray<string>;
  media: ReadonlyArray<{ url: string }>;
  updatedAt: Date | string;
};

function escapeXml(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value: string | null | undefined) {
  if (!value) return "<![CDATA[]]>";
  const safe = value.replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${safe}]]>`;
}

/**
 * VivaReal/ZAP-compatible XML feed.
 * Spec reference: https://vivareal.com.br/api/feed-xml/
 */
export function buildPortalFeedXml(properties: ReadonlyArray<FeedProperty>) {
  const now = new Date().toISOString();
  const items = properties
    .map((property) => {
      const propertyUrl = `${SITE_URL}/imoveis/${property.slug}`;
      const images = property.media
        .slice(0, 12)
        .map(
          (media) =>
            `<Image><Url>${escapeXml(media.url)}</Url><Featured>${
              property.media[0]?.url === media.url ? "true" : "false"
            }</Featured></Image>`
        )
        .join("");

      const features = (property.features ?? [])
        .map((feature) => `<Feature>${escapeXml(feature)}</Feature>`)
        .join("");

      return [
        "<Listing>",
        `<ListingID>${escapeXml(property.id)}</ListingID>`,
        `<Title>${cdata(property.title)}</Title>`,
        `<TransactionType>${escapeXml(PURPOSE_TO_VR[property.purpose] ?? "For Sale")}</TransactionType>`,
        `<PublicationDate>${new Date(property.updatedAt).toISOString()}</PublicationDate>`,
        `<DetailViewUrl>${escapeXml(propertyUrl)}</DetailViewUrl>`,
        "<Details>",
        `<PropertyType>${escapeXml(TYPE_TO_VR[String(property.type)] ?? "Imóvel")}</PropertyType>`,
        `<Description>${cdata(property.description)}</Description>`,
        property.areaM2
          ? `<LivingArea unit="square metres">${property.areaM2}</LivingArea>`
          : "",
        property.landAreaM2
          ? `<LotArea unit="square metres">${property.landAreaM2}</LotArea>`
          : "",
        property.bedrooms ? `<Bedrooms>${property.bedrooms}</Bedrooms>` : "",
        property.bathrooms ? `<Bathrooms>${property.bathrooms}</Bathrooms>` : "",
        property.suites ? `<Suites>${property.suites}</Suites>` : "",
        property.parkingSpaces ? `<Garage type="Parking">${property.parkingSpaces}</Garage>` : "",
        `<ListPrice currency="BRL">${property.price.toFixed(2)}</ListPrice>`,
        features ? `<Features>${features}</Features>` : "",
        "</Details>",
        "<Location displayAddress=\"All\">",
        "<Country abbreviation=\"BR\">Brasil</Country>",
        "<State abbreviation=\"TO\">Tocantins</State>",
        `<City>${escapeXml(property.city)}</City>`,
        `<Neighborhood>${escapeXml(property.district)}</Neighborhood>`,
        property.address ? `<Address>${escapeXml(property.address)}</Address>` : "",
        property.postalCode ? `<PostalCode>${escapeXml(property.postalCode)}</PostalCode>` : "",
        property.latitude && property.longitude
          ? `<Latitude>${property.latitude}</Latitude><Longitude>${property.longitude}</Longitude>`
          : "",
        "</Location>",
        images ? `<Media>${images}</Media>` : "",
        "</Listing>"
      ]
        .filter(Boolean)
        .join("");
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<ListingDataFeed xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.vivareal.com.br/schemas/1.0/VRSync.xsd">
<Header><Provider>Pedro Soares Corretor</Provider><Email>contato@pedrosoarescorretor.com.br</Email><ContactName>Pedro Soares</ContactName><PublishDate>${now}</PublishDate></Header>
<Listings>${items}</Listings>
</ListingDataFeed>`;
}
