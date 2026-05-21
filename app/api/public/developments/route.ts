import { NextRequest } from "next/server";
import { DevelopmentPropertyType } from "@prisma/client";
import { ok } from "@/lib/api/http";
import { listPublicDevelopments, type PublicDevelopmentStage } from "@/lib/data/developments";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const parsedBedrooms = searchParams.get("bedrooms");
  const parsedMinPrice = searchParams.get("minPrice") ?? searchParams.get("priceMin");
  const parsedMaxPrice = searchParams.get("maxPrice") ?? searchParams.get("priceMax");
  const parsedMinArea = searchParams.get("minArea");
  const propertyTypeParam = searchParams.get("propertyType");
  const propertyType = Object.values(DevelopmentPropertyType).includes(
    propertyTypeParam as DevelopmentPropertyType
  )
    ? (propertyTypeParam as DevelopmentPropertyType)
    : undefined;

  const developments = await listPublicDevelopments({
    q: searchParams.get("q") ?? undefined,
    city: searchParams.get("city") ?? undefined,
    district: searchParams.get("district") ?? undefined,
    builder: searchParams.get("builder") ?? undefined,
    publicStage: (searchParams.get("publicStage") as PublicDevelopmentStage | null) ?? undefined,
    stage: (searchParams.get("stage") as
      | "PRE_LAUNCH"
      | "LAUNCH"
      | "SALES"
      | "FOUNDATION_COMPLETED"
      | "CONSTRUCTION"
      | "ADVANCED_STRUCTURE"
      | "FINISHING"
      | "READY_TO_MOVE"
      | "DELIVERED"
      | null) ?? undefined,
    propertyType,
    minPrice: parsedMinPrice ? Number(parsedMinPrice) : undefined,
    maxPrice: parsedMaxPrice ? Number(parsedMaxPrice) : undefined,
    bedrooms: parsedBedrooms ? Number(parsedBedrooms) : undefined,
    minArea: parsedMinArea ? Number(parsedMinArea) : undefined,
    feature: searchParams.get("feature") ?? undefined
  });

  return ok({ developments });
}
