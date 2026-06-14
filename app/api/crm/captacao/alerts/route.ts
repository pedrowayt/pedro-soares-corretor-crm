import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { createCaptureAlert, listCaptureAlerts } from "@/lib/data/capture";
import { crmCreateCaptureAlertSchema } from "@/lib/validation/schemas";

export async function GET() {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const alerts = await listCaptureAlerts();
  return ok({ alerts });
}

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const parsed = crmCreateCaptureAlertSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para monitoramento de captação.", 422, parsed.error.flatten());
  }

  try {
    const alert = await createCaptureAlert(parsed.data, session?.userId);
    return ok({ alert }, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Falha ao criar monitoramento de captação.", 400);
  }
}
