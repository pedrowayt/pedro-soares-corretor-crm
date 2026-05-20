import { NextRequest } from "next/server";
import { PropertyPurpose, PropertyType } from "@prisma/client";
import { ok } from "@/lib/api/http";
import { listPublicProperties } from "@/lib/data/properties";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const properties = await listPublicProperties({
    city: searchParams.get("city") ?? undefined,
    district: searchParams.get("district") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    type: (searchParams.get("type") as PropertyType | null) ?? undefined,
    purpose: (searchParams.get("purpose") as PropertyPurpose | null) ?? undefined,
    bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
    minAreaM2: searchParams.get("minAreaM2") ? Number(searchParams.get("minAreaM2")) : undefined
  });

  return ok({ properties });
}
