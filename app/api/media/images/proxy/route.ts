import { fail } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

function isAllowedHttpUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host === "::1" ||
      host.endsWith(".local") ||
      host.endsWith(".internal")
    ) {
      return null;
    }
    if (/^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");
  if (!target) return fail("Parâmetro url ausente.", 400);

  const parsed = isAllowedHttpUrl(target);
  if (!parsed) return fail("URL inválida.", 400);

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PSImoveisLogoProxy/1.0)",
        Accept: "image/*"
      },
      cache: "no-store",
      redirect: "follow"
    });

    if (!upstream.ok) {
      return fail(`Falha ao buscar imagem (${upstream.status}).`, 502);
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    if (!contentType.startsWith("image/")) {
      return fail("Conteúdo retornado não é uma imagem.", 415);
    }

    const buffer = await upstream.arrayBuffer();
    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      return fail("Imagem muito grande para edição.", 413);
    }

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=60",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Erro ao obter imagem.", 502);
  }
}
