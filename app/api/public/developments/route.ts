import { DevelopmentStage } from "@prisma/client";
import { NextRequest } from "next/server";
import { ok } from "@/lib/api/http";
import { listPublicDevelopments } from "@/lib/data/developments";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const developments = await listPublicDevelopments({
    district: searchParams.get("district") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    stage: (searchParams.get("stage") as DevelopmentStage | null) ?? undefined,
    bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined
  });

  return ok({ developments });
}
