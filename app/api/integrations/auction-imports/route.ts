import { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import {
  findAuctionImportSourceByToken,
  isOriginalUrlAllowedForSource,
  recordAuctionImportSourceError,
  recordAuctionImportSourceSuccess
} from "@/lib/data/auction-import-sources";
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

  const sourceFromToken = await findAuctionImportSourceByToken(bearerToken).catch(() => null);
  const envTokenIsValid =
    Boolean(configuredToken && configuredToken.length >= 16) &&
    safeEquals(bearerToken, configuredToken ?? "");

  if (!sourceFromToken && !envTokenIsValid) {
    return fail("Token de importação inválido.", 401);
  }
  if (sourceFromToken && !sourceFromToken.active) {
    await recordAuctionImportSourceError(sourceFromToken.id, "Fonte inativa tentou enviar imóveis.");
    return fail("Fonte de importação inativa.", 403);
  }

  const body = await request.json().catch(() => null);
  const parsed = auctionImportPayloadSchema.safeParse(body);

  if (!parsed.success) {
    if (sourceFromToken) {
      await recordAuctionImportSourceError(sourceFromToken.id, "Payload inválido.");
    }
    return fail("Payload inválido para importação de leilão.", 422, parsed.error.flatten());
  }

  if (sourceFromToken && parsed.data.source !== sourceFromToken.sourceKey) {
    await recordAuctionImportSourceError(
      sourceFromToken.id,
      `Source recebido "${parsed.data.source}" não corresponde à fonte "${sourceFromToken.sourceKey}".`
    );
    return fail("Source do payload não corresponde ao token informado.", 403);
  }

  if (sourceFromToken && !isOriginalUrlAllowedForSource(sourceFromToken, parsed.data.originalUrl)) {
    await recordAuctionImportSourceError(
      sourceFromToken.id,
      `URL fora dos domínios permitidos: ${parsed.data.originalUrl}`
    );
    return fail("URL original fora dos domínios permitidos para esta fonte.", 403);
  }

  try {
    const result = await importAuctionPayload(parsed.data as AuctionImportPayload);
    if (sourceFromToken) {
      await recordAuctionImportSourceSuccess(sourceFromToken.id);
    }

    return ok(result, { status: result.created ? 201 : 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro interno ao importar leilão.";
    if (sourceFromToken) {
      await recordAuctionImportSourceError(sourceFromToken.id, message);
    }
    return fail("Não foi possível importar o leilão.", 500, { message });
  }
}
