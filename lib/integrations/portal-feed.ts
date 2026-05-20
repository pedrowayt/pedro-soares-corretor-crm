import { Property } from "@prisma/client";

function escapeXml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildPortalFeedXml(baseUrl: string, properties: Array<Property & { imageUrl?: string }>) {
  const items = properties
    .map((property) => {
      const url = `${baseUrl}/imoveis/${property.slug}`;
      return [
        "<property>",
        `<id>${escapeXml(property.id)}</id>`,
        `<title>${escapeXml(property.title)}</title>`,
        `<purpose>${property.purpose}</purpose>`,
        `<type>${property.type}</type>`,
        `<status>${property.status}</status>`,
        `<price>${property.price.toString()}</price>`,
        `<city>${escapeXml(property.city)}</city>`,
        `<district>${escapeXml(property.district)}</district>`,
        `<url>${escapeXml(url)}</url>`,
        property.imageUrl ? `<image>${escapeXml(property.imageUrl)}</image>` : "",
        "</property>"
      ].join("");
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><properties>${items}</properties>`;
}
