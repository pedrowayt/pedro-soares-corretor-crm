import Link from "next/link";

const crmMenu = [
  { href: "/crm/dashboard", label: "Dashboard" },
  { href: "/crm/leads", label: "Leads" },
  { href: "/crm/funil", label: "Funil de vendas" },
  { href: "/crm/imoveis", label: "Imóveis" },
  { href: "/crm/empreendimentos", label: "Empreendimentos" },
  { href: "/crm/construtoras", label: "Construtoras" },
  { href: "/crm/proprietarios", label: "Proprietários" },
  { href: "/crm/visitas", label: "Visitas" },
  { href: "/crm/propostas", label: "Propostas" },
  { href: "/crm/tarefas", label: "Tarefas" },
  { href: "/crm/paginas-seo", label: "Páginas SEO" },
  { href: "/crm/relatorios", label: "Relatórios" },
  { href: "/crm/configuracoes", label: "Configurações" }
];

export function CrmSidebar() {
  return (
    <aside className="crm-sidebar">
      <div>
        <p className="badge">CRM Pedro Soares</p>
        <h2>Operação comercial</h2>
      </div>

      <nav className="crm-sidebar-nav" aria-label="Menu do CRM">
        {crmMenu.map((item) => (
          <Link key={item.href} href={item.href} className="crm-sidebar-link">
            {item.label}
          </Link>
        ))}
      </nav>

      <Link href="/admin/logout" className="crm-sidebar-logout">
        Sair do CRM
      </Link>
    </aside>
  );
}
