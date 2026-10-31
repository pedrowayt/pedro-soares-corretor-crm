import Link from "next/link";
import { ChevronLeft, UserPlus } from "lucide-react";
import { QuickLeadForm } from "@/components/crm/quick-forms";
import { listCrmDevelopments } from "@/lib/data/developments";
import { listCrmProperties } from "@/lib/data/crm-properties";

export default async function NewCrmLeadPage() {
  const [properties, developments] = await Promise.all([listCrmProperties(), listCrmDevelopments()]);

  return (
    <div className="crm-lead-create-page">
      <header className="crm-lead-create-page__header">
        <Link href="/crm/leads" className="crm-lead-create-page__back">
          <ChevronLeft size={18} aria-hidden="true" />
          Voltar para leads
        </Link>
        <div className="crm-lead-create-page__intro">
          <span className="crm-lead-create-page__icon" aria-hidden="true"><UserPlus size={22} /></span>
          <div>
            <h1 className="section-title">Novo lead</h1>
            <p className="section-subtitle">Cadastre o contato e organize o próximo acompanhamento.</p>
          </div>
        </div>
      </header>

      <QuickLeadForm
        properties={properties.map((property) => ({ id: property.id, title: property.title }))}
        developments={developments.map((development) => ({ id: development.id, title: development.title }))}
        redirectOnSuccess
      />
    </div>
  );
}
