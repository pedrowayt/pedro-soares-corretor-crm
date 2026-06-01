"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2,
  LayoutDashboard,
  Menu,
  Users,
  Workflow,
  type LucideIcon
} from "lucide-react";
import { CrmMoreSheet } from "@/components/crm/mobile-more-sheet";

type Tab = { href: string; label: string; Icon: LucideIcon };

const PRIMARY_TABS: ReadonlyArray<Tab> = [
  { href: "/crm/dashboard", label: "Painel", Icon: LayoutDashboard },
  { href: "/crm/leads", label: "Leads", Icon: Users },
  { href: "/crm/funil", label: "Funil", Icon: Workflow },
  { href: "/crm/imoveis", label: "Imóveis", Icon: Building2 }
];

function isOnPrimaryPath(pathname: string) {
  return PRIMARY_TABS.some((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`));
}

export function CrmBottomNav() {
  const pathname = usePathname() ?? "";
  const [sheetOpen, setSheetOpen] = useState(false);
  const moreIsActive = sheetOpen || (!isOnPrimaryPath(pathname) && pathname.startsWith("/crm"));

  return (
    <>
      <nav className="crm-bottom-nav" aria-label="Navegação principal do CRM">
        {PRIMARY_TABS.map((tab) => {
          const TabIcon = tab.Icon;
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`crm-bottom-nav__item${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <TabIcon size={20} strokeWidth={1.75} aria-hidden="true" />
              <span>{tab.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          className={`crm-bottom-nav__item${moreIsActive ? " is-active" : ""}`}
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          aria-label="Abrir mais opções"
        >
          <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
          <span>Mais</span>
        </button>
      </nav>

      <CrmMoreSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
