import { CaptureManager } from "@/components/crm/capture-manager";
import { listCaptureAlerts, listCapturedListings } from "@/lib/data/capture";

export default async function CrmCaptacaoPage() {
  const [listings, alerts] = await Promise.all([listCapturedListings(), listCaptureAlerts()]);

  return <CaptureManager listings={listings} alerts={alerts} />;
}
