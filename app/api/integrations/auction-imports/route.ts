import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { importAuctionPayload, type AuctionImportPayload } from "@/lib/data/auction-imports";
import { auctionImportPayloadSchema } from "@/lib/validation/schemas";

function readBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(/\s+/, 2);
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

function safeEquals(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function POST(request: NextRequest) {
  const configuredToken = process.env.AUCTION_IMPORT_API_TOKEN;
  const bearerToken = readBearerToken(request);

  if (!bearerToken) {
    return fail("Token de importação ausente.", 401);
  }
  if (!configuredToken || configuredToken.length < 16) {
    return fail("AUCTION_IMPORT_API_TOKEN não está configurado no servidor.", 503);
  }
  if (!safeEquals(bearerToken, configuredToken)) {
    return fail("Token de importação inválido.", 401);
  }

  const body = await request.json().catch(() => null);
  const parsed = auctionImportPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para importação de leilão.", 422, parsed.error.flatten());
  }

  const result = await importAuctionPayload(parsed.data as AuctionImportPayload);

  return ok(result, { status: result.created ? 201 : 200 });
}
