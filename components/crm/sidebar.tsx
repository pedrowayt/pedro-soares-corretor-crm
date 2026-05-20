import Link from "next/link";

const crmMenu = [
  { href: "/crm/dashboard", label: "Dashboard" },
  { href: "/crm/leads", label: "Leads" },
  { href: "/crm/funil", label: "Funil de vendas" },
  { href: "/crm/imoveis", label: "Imóveis" },
  { href: "/crm/empreendimentos", label: "Empreendimentos" },
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
      <p className="badge">CRM Pedro Soares</p>
      <h2 style={{ marginTop: 12, marginBottom: 14 }}>Operação comercial</h2>
      <nav style={{ display: "grid", gap: 8 }}>
        {crmMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              border: "1px solid rgba(242,194,122,.2)",
              borderRadius: 12,
              padding: "9px 11px",
              fontSize: ".92rem"
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
