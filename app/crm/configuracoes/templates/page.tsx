import { redirect } from "next/navigation";
import { WhatsappTemplateManager } from "@/components/crm/whatsapp-template-manager";
import { getSession } from "@/lib/auth/session";
import { listWhatsappTemplates } from "@/lib/data/whatsapp-templates";

export default async function CrmWhatsappTemplatesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login?next=/crm/configuracoes/templates");
  if (session.role !== "ADMIN") redirect("/crm/configuracoes");

  const templates = await listWhatsappTemplates();
  return (
    <div className="crm-settings-page">
      <header className="crm-settings-page__head">
        <div>
          <p className="crm-eyebrow">Configurações do CRM</p>
          <h1 className="section-title" style={{ marginTop: 0 }}>Templates de WhatsApp</h1>
          <p className="section-subtitle">Crie mensagens para leads normais ou clientes de leilão. Elas aparecem automaticamente dentro da ficha.</p>
        </div>
        <span className="crm-settings-page__role">Somente Admin</span>
      </header>
      <WhatsappTemplateManager initialTemplates={templates} />
    </div>
  );
}
