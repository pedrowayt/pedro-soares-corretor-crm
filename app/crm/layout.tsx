import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { CrmBottomNav } from "@/components/crm/bottom-nav";
import { CommandPalette } from "@/components/crm/command-palette";
import { CrmCreateFAB } from "@/components/crm/create-fab";
import { CrmMobileHeader } from "@/components/crm/mobile-header";
import { CrmSidebar } from "@/components/crm/sidebar";
import { ThemeBootScript } from "@/components/crm/theme-provider";
import { getSession, hasAnyRole } from "@/lib/auth/session";
import { listLeads, listProperties } from "@/lib/data/crm";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!hasAnyRole(session, [Role.ADMIN, Role.CORRETOR, Role.PARCEIRO])) {
    redirect("/admin/login");
  }

  const [leads, properties] = await Promise.all([listLeads(), listProperties()]);

  const cmdLeads = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    stage: lead.stage
  }));

  const cmdProperties = properties.map((property) => ({
    id: property.id,
    slug: property.slug,
    title: property.title,
    city: property.city,
    district: property.district
  }));

  return (
    <div className="crm-shell container" style={{ width: "min(1360px, 96vw)", marginTop: 22 }}>
      <ThemeBootScript />
      <CrmSidebar />
      <CrmMobileHeader />
      <section className="crm-main">{children}</section>
      <CrmCreateFAB />
      <CrmBottomNav />
      <CommandPalette leads={cmdLeads} properties={cmdProperties} />
    </div>
  );
}
