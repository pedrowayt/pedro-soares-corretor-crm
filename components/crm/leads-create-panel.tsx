import Link from "next/link";
import { Plus } from "lucide-react";

export function LeadsCreatePanel() {
  return (
    <div className="crm-leads-create-panel">
      <Link href="/crm/leads/novo" className="button button-primary crm-leads-new-button">
        <Plus size={16} aria-hidden="true" />
        Novo lead
      </Link>
    </div>
  );
}
