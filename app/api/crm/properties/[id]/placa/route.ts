import { readFile } from "node:fs/promises";
import path from "node:path";
import { pdf } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { findCrmPropertyById } from "@/lib/data/crm-properties";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";
import { formatCurrencyBRL } from "@/lib/utils";
import { Placa, type PlacaCorretor, type PlacaProperty } from "@/lib/placa/Placa";
import { isPlacaSize, PLACA_SIZES, type PlacaSize, typeToDefaultSize } from "@/lib/placa/templates";

export const runtime = "nodejs";

const LOGO_PATH = path.join(process.cwd(), "public/brand/logo-home-2026.png");

async function fetchAsBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const arr = await res.arrayBuffer();
    return Buffer.from(arr);
  } catch {
    return null;
  }
}

function instagramHandleFrom(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  return match?.[1] ?? null;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const property = await findCrmPropertyById(id);
  if (!property) {
    return new Response("Imóvel não encontrado.", { status: 404 });
  }

  const url = new URL(request.url);
  const sizeParam = url.searchParams.get("size");
  const size: PlacaSize = isPlacaSize(sizeParam) ? sizeParam : typeToDefaultSize(property.type);
  const showPrice = url.searchParams.get("showPrice") === "1";

  const siteUrl = getSiteUrl();
  const publicUrl = `${siteUrl}/imoveis/${property.slug}`;
  const qrSrc = await QRCode.toDataURL(publicUrl, {
    margin: 1,
    errorCorrectionLevel: "M",
    width: 600
  });

  const logoBuffer = await readFile(LOGO_PATH);

  const corretorPhotoBuffer = session?.profilePhotoUrl ? await fetchAsBuffer(session.profilePhotoUrl) : null;

  const corretorExtras = session?.userId
    ? await prisma.user
        .findUnique({ where: { id: session.userId }, select: { instagramUrl: true } })
        .catch(() => null)
    : null;

  const placaProperty: PlacaProperty = {
    title: property.title,
    type: property.type,
    purpose: property.purpose,
    city: property.city,
    district: property.district,
    bedrooms: property.bedrooms,
    suites: property.suites,
    bathrooms: property.bathrooms,
    parkingSpaces: property.parkingSpaces,
    areaM2: property.areaM2 ?? null,
    landAreaM2: property.landAreaM2 ?? null,
    priceFormatted: showPrice ? formatCurrencyBRL(property.price) : null
  };

  const corretor: PlacaCorretor = {
    name: session?.name ?? "Pedro Soares",
    creci: session?.creci ?? null,
    phone: session?.phone ?? null,
    instagramHandle: instagramHandleFrom(corretorExtras?.instagramUrl),
    site: new URL(siteUrl).host
  };

  const pdfStream = await pdf(
    Placa({
      size,
      property: placaProperty,
      corretor,
      logoSrc: logoBuffer,
      corretorPhotoSrc: corretorPhotoBuffer,
      qrSrc
    })
  ).toBuffer();

  const buffer = await streamToBuffer(pdfStream);
  const body = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;

  const filename = `placa-${property.slug}-${size}.pdf`;
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Placa-Size": PLACA_SIZES[size].label
    }
  });
}

async function streamToBuffer(stream: NodeJS.ReadableStream | Buffer): Promise<Buffer> {
  if (Buffer.isBuffer(stream)) return stream;
  const chunks: Buffer[] = [];
  for await (const chunk of stream as AsyncIterable<Buffer | string>) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
