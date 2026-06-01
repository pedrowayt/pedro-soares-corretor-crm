import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { CrmBottomNav } from "@/components/crm/bottom-nav";
import { CrmMobileHeader } from "@/components/crm/mobile-header";
import { CrmSidebar } from "@/components/crm/sidebar";
import { getSession, hasAnyRole } from "@/lib/auth/session";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!hasAnyRole(session, [Role.ADMIN, Role.CORRETOR, Role.PARCEIRO])) {
    redirect("/admin/login");
  }

  return (
    <div className="crm-shell container" style={{ width: "min(1360px, 96vw)", marginTop: 22 }}>
      <CrmSidebar />
      <CrmMobileHeader />
      <section className="crm-main">{children}</section>
      <CrmBottomNav />
    </div>
  );
}
