/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  ChevronDown,
  Hammer,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  UserCheck,
  Users,
  Workflow,
  type LucideIcon
} from "lucide-react";
import { ThemeToggle } from "@/components/crm/theme-provider";

type TopbarLink = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

type Props = {
  user: {
    name: string;
    role: string;
    profilePhotoUrl?: string | null;
    jobTitle?: string | null;
  };
  notificationCount: number;
};

const PRIMARY_NAV: ReadonlyArray<TopbarLink> = [
  { href: "/crm/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/crm/leads", label: "Leads", Icon: Users },
  { href: "/crm/funil", label: "Funil", Icon: Workflow },
  { href: "/crm/imoveis", label: "Imóveis", Icon: Building2 },
  { href: "/crm/leiloes", label: "Leilões", Icon: Hammer },
  { href: "/crm/empreendimentos", label: "Empreendimentos", Icon: Building2 },
  { href: "/crm/propostas", label: "Propostas", Icon: UserCheck }
];

const SECONDARY_NAV: ReadonlyArray<TopbarLink> = [
  { href: "/crm/inbox", label: "Inbox", Icon: Bell },
  { href: "/crm/visitas", label: "Visitas", Icon: UserCheck },
  { href: "/crm/tarefas", label: "Tarefas", Icon: Workflow },
  { href: "/crm/proprietarios", label: "Proprietários", Icon: UserCheck },
  { href: "/crm/construtoras", label: "Construtoras", Icon: Building2 },
  { href: "/crm/paginas-seo", label: "Páginas SEO", Icon: Search },
  { href: "/crm/blog", label: "Blog", Icon: LayoutDashboard },
  { href: "/crm/relatorios", label: "Relatórios", Icon: LayoutDashboard },
  { href: "/crm/configuracoes", label: "Configurações", Icon: Settings }
];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  CORRETOR: "Corretor",
  PARCEIRO: "Parceiro"
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PS";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function openCommandPalette() {
  window.dispatchEvent(new Event("crm:open-command-palette"));
}

export function CrmTopbar({ user, notificationCount }: Props) {
  const pathname = usePathname() ?? "";
  const moreActive = SECONDARY_NAV.some((item) => isActive(pathname, item.href));

  return (
    <header className="crm-topbar">
      <Link href="/crm/dashboard" className="crm-topbar__brand" aria-label="Dashboard CRM imobiliário">
        <span className="crm-topbar__mark" aria-hidden="true">
          <Building2 size={19} strokeWidth={2} />
        </span>
        <span className="crm-topbar__brand-copy">
          <strong>CRM</strong>
          <small>Imobiliário</small>
        </span>
      </Link>

      <nav className="crm-topbar__nav" aria-label="Navegação principal do CRM">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.Icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`crm-topbar__nav-link${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <details className={`crm-topbar__more${moreActive ? " is-active" : ""}`}>
          <summary>
            <span>Mais</span>
            <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
          </summary>
          <div className="crm-topbar__more-menu">
            {SECONDARY_NAV.map((item) => {
              const Icon = item.Icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`crm-topbar__more-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </details>
      </nav>

      <div className="crm-topbar__actions">
        <button
          type="button"
          className="crm-topbar__search"
          onClick={openCommandPalette}
          aria-label="Buscar no CRM"
          title="Buscar no CRM"
        >
          <Search size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>

        <ThemeToggle compact />

        <Link href="/crm/inbox" className="crm-topbar__icon" aria-label="Notificações">
          <Bell size={17} strokeWidth={1.8} aria-hidden="true" />
          {notificationCount > 0 ? <span>{Math.min(notificationCount, 99)}</span> : null}
        </Link>

        <Link
          href="/crm/configuracoes"
          className={`crm-topbar__profile${isActive(pathname, "/crm/configuracoes") ? " is-active" : ""}`}
          aria-label="Abrir perfil e configurações"
          title="Perfil e configurações"
        >
          <span className="crm-topbar__avatar" aria-hidden="true">
            {user.profilePhotoUrl ? <img src={user.profilePhotoUrl} alt="" /> : initials(user.name)}
          </span>
          <span className="crm-topbar__profile-copy">
            <strong>{user.name}</strong>
            <small>{user.jobTitle || ROLE_LABELS[user.role] || user.role}</small>
          </span>
        </Link>

        <form action="/admin/logout" method="post" className="crm-topbar__logout-form">
          <button type="submit" className="crm-topbar__icon" aria-label="Sair do CRM">
            <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </form>
      </div>
    </header>
  );
}
