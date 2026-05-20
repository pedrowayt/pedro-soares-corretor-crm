import { CrmSidebar } from "@/components/crm/sidebar";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="crm-shell container" style={{ width: "min(1360px, 96vw)", marginTop: 22 }}>
      <CrmSidebar />
      <section className="crm-main">{children}</section>
    </div>
  );
}
