import { fail, ok } from "@/lib/api/http";
import { runActiveBrowserCaptureAlerts } from "@/lib/data/capture-automation";

export const runtime = "nodejs";
export const maxDuration = 300;

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization") ?? "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : null;
  if (bearer && bearer === secret) return true;

  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token");
  return Boolean(queryToken && queryToken === secret);
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return fail("Cron não autorizado.", 401);
  }

  const url = new URL(request.url);
  const requestedMaxAlerts = Number(url.searchParams.get("maxAlerts") ?? 5);
  const maxAlerts = Number.isFinite(requestedMaxAlerts) ? requestedMaxAlerts : 5;

  try {
    const result = await runActiveBrowserCaptureAlerts({ maxAlerts });
    return ok(result);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha na captação automática com navegador.", 500);
  }
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
