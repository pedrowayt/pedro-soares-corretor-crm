import Link from "next/link";
import { ThemeToggle } from "@/components/crm/theme-provider";

type SidebarItem = { href: string; label: string };
type SidebarSection = { title: string; items: SidebarItem[] };

const SIDEBAR_SECTIONS: ReadonlyArray<SidebarSection> = [
  {
    title: "Hoje",
    items: [
      { href: "/crm/dashboard", label: "Dashboard" },
      { href: "/crm/inbox", label: "Inbox" },
      { href: "/crm/leads", label: "Leads" },
      { href: "/crm/funil", label: "Funil de vendas" },
      { href: "/crm/visitas", label: "Visitas" },
      { href: "/crm/tarefas", label: "Tarefas" }
    ]
  },
  {
    title: "Estoque",
    items: [
      { href: "/crm/imoveis", label: "Imóveis" },
      { href: "/crm/leiloes", label: "Leilões" },
      { href: "/crm/empreendimentos", label: "Empreendimentos" },
      { href: "/crm/construtoras", label: "Construtoras" },
      { href: "/crm/proprietarios", label: "Proprietários" },
      { href: "/crm/propostas", label: "Propostas" }
    ]
  },
  {
    title: "Conteúdo",
    items: [
      { href: "/crm/paginas-seo", label: "Páginas SEO" },
      { href: "/crm/blog", label: "Blog" }
    ]
  },
  {
    title: "Análise & Config",
    items: [
      { href: "/crm/relatorios", label: "Relatórios" },
      { href: "/crm/configuracoes", label: "Configurações" }
    ]
  }
];

export function CrmSidebar() {
  return (
    <aside className="crm-sidebar">
      <div>
        <p className="badge">CRM Pedro Soares</p>
        <h2>Operação comercial</h2>
        <p className="crm-sidebar-shortcut" aria-hidden="true">
          Pressione <kbd>⌘</kbd>+<kbd>K</kbd> para buscar
        </p>
      </div>

      <nav className="crm-sidebar-nav" aria-label="Menu do CRM">
        {SIDEBAR_SECTIONS.map((section) => (
          <section key={section.title} className="crm-sidebar-section">
            <p className="crm-sidebar-section__title">{section.title}</p>
            <div className="crm-sidebar-section__items">
              {section.items.map((item) => (
                <Link key={item.href} href={item.href} className="crm-sidebar-link">
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </nav>

      <div className="crm-sidebar-foot">
        <ThemeToggle />
        <form action="/admin/logout" method="post" className="crm-sidebar-logout-form">
          <button type="submit" className="crm-sidebar-logout">
            Sair do CRM
          </button>
        </form>
      </div>
    </aside>
  );
}
