import { CaptureManager } from "@/components/crm/capture-manager";
import { listCapturedListings } from "@/lib/data/capture";

export default async function CrmCaptacaoPage() {
  const listings = await listCapturedListings();

  return <CaptureManager listings={listings} />;
}
