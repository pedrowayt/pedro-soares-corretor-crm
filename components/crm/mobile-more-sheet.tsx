"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  BarChart3,
  Building2,
  CalendarCheck,
  ChevronRight,
  FileSignature,
  Hammer,
  Inbox,
  ListTodo,
  LogOut,
  Newspaper,
  Search,
  Settings,
  UserCheck,
  X,
  type LucideIcon
} from "lucide-react";

type Item = { href: string; label: string; Icon: LucideIcon };

type Group = { title: string; items: Item[] };

const GROUPS: ReadonlyArray<Group> = [
  {
    title: "Operação",
    items: [
      { href: "/crm/inbox", label: "Inbox", Icon: Inbox },
      { href: "/crm/leiloes", label: "Leilões", Icon: Hammer },
      { href: "/crm/empreendimentos", label: "Empreendimentos", Icon: Building2 },
      { href: "/crm/construtoras", label: "Construtoras", Icon: Hammer },
      { href: "/crm/proprietarios", label: "Proprietários", Icon: UserCheck },
      { href: "/crm/visitas", label: "Visitas", Icon: CalendarCheck },
      { href: "/crm/propostas", label: "Propostas", Icon: FileSignature },
      { href: "/crm/tarefas", label: "Tarefas", Icon: ListTodo }
    ]
  },
  {
    title: "Conteúdo",
    items: [
      { href: "/crm/paginas-seo", label: "Páginas SEO", Icon: Search },
      { href: "/crm/blog", label: "Blog", Icon: Newspaper }
    ]
  },
  {
    title: "Análise",
    items: [{ href: "/crm/relatorios", label: "Relatórios", Icon: BarChart3 }]
  },
  {
    title: "Configurações",
    items: [{ href: "/crm/configuracoes", label: "Preferências do CRM", Icon: Settings }]
  }
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CrmMoreSheet({ open, onClose }: Props) {
  const pathname = usePathname() ?? "";

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`crm-more-backdrop${open ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`crm-more-sheet${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mais opções do CRM"
        aria-hidden={!open}
      >
        <header className="crm-more-sheet__head">
          <h2>Mais</h2>
          <button
            type="button"
            className="crm-more-sheet__close"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </header>

        <div className="crm-more-sheet__body">
          {GROUPS.map((group) => (
            <section key={group.title} className="crm-more-sheet__group">
              <h3 className="crm-more-sheet__group-title">{group.title}</h3>
              <ul className="crm-more-sheet__list">
                {group.items.map((item) => {
                  const ItemIcon = item.Icon;
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`crm-more-sheet__link${active ? " is-active" : ""}`}
                        aria-current={active ? "page" : undefined}
                      >
                        <span className="crm-more-sheet__icon" aria-hidden="true">
                          <ItemIcon size={18} strokeWidth={1.75} />
                        </span>
                        <span className="crm-more-sheet__label">{item.label}</span>
                        <ChevronRight
                          size={16}
                          strokeWidth={1.5}
                          aria-hidden="true"
                          className="crm-more-sheet__chevron"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          <form action="/admin/logout" method="post" className="crm-more-sheet__logout-form">
            <button type="submit" className="crm-more-sheet__logout">
              <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
              Sair do CRM
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
