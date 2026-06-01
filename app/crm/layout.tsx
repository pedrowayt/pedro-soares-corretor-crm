import { LeadStage, Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { CrmBottomNav } from "@/components/crm/bottom-nav";
import { CommandPalette } from "@/components/crm/command-palette";
import { CrmCreateFAB } from "@/components/crm/create-fab";
import { CrmMobileHeader } from "@/components/crm/mobile-header";
import { ThemeBootScript } from "@/components/crm/theme-provider";
import { CrmTopbar } from "@/components/crm/topbar";
import { getSession, hasAnyRole } from "@/lib/auth/session";
import { listLeads, listProperties } from "@/lib/data/crm";

const ACTIVE_LEAD_STAGES = new Set<LeadStage>([
  LeadStage.NOVO,
  LeadStage.PRIMEIRO_CONTATO,
  LeadStage.QUALIFICADO,
  LeadStage.OPCOES_ENVIADAS,
  LeadStage.VISITA_AGENDADA,
  LeadStage.PROPOSTA_ENVIADA,
  LeadStage.NEGOCIACAO
]);

function daysAgo(days: number) {
  const next = new Date();
  next.setDate(next.getDate() - days);
  return next;
}

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
  const staleThreshold = daysAgo(3);
  const notificationCount = leads.filter((lead) => {
    if (!ACTIVE_LEAD_STAGES.has(lead.stage)) return false;
    const lastSignal = lead.lastContactAt ?? lead.createdAt;
    return lastSignal <= staleThreshold;
  }).length;

  return (
    <div className="crm-shell container" style={{ width: "min(1480px, 96vw)", marginTop: 18 }}>
      <ThemeBootScript />
      <CrmTopbar
        user={{
          name: session?.name ?? "Pedro Soares",
          role: session?.role ?? Role.CORRETOR
        }}
        notificationCount={notificationCount}
      />
      <CrmMobileHeader />
      <section className="crm-main">{children}</section>
      <CrmCreateFAB />
      <CrmBottomNav />
      <CommandPalette leads={cmdLeads} properties={cmdProperties} />
    </div>
  );
}
