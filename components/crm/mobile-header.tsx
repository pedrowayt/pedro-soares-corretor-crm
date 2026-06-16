"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "@/components/crm/theme-provider";

/**
 * Top-level CRM routes mapped to a human title. Used by the mobile header to
 * label the current screen. Subroutes (e.g. /crm/imoveis/123) fall back to a
 * generic label + a back link to the parent collection.
 */
const PAGE_TITLES: Readonly<Record<string, string>> = {
  "/crm": "CRM",
  "/crm/dashboard": "Dashboard",
  "/crm/inbox": "Inbox",
  "/crm/leads": "Leads",
  "/crm/funil": "Funil de vendas",
  "/crm/imoveis": "Imóveis",
  "/crm/captacao": "Captação ativa",
  "/crm/leiloes": "Leilões",
  "/crm/empreendimentos": "Empreendimentos",
  "/crm/construtoras": "Construtoras",
  "/crm/proprietarios": "Proprietários",
  "/crm/visitas": "Visitas",
  "/crm/propostas": "Propostas",
  "/crm/tarefas": "Tarefas",
  "/crm/paginas-seo": "Páginas SEO",
  "/crm/blog": "Blog",
  "/crm/blog/categorias": "Categorias",
  "/crm/integracoes": "Integrações",
  "/crm/relatorios": "Relatórios",
  "/crm/configuracoes": "Configurações"
};

function resolveTitle(pathname: string): { title: string; backHref?: string } {
  if (PAGE_TITLES[pathname]) return { title: PAGE_TITLES[pathname] };

  const candidates = Object.keys(PAGE_TITLES).sort((a, b) => b.length - a.length);
  for (const candidate of candidates) {
    if (pathname.startsWith(`${candidate}/`)) {
      return { title: "Detalhe", backHref: candidate };
    }
  }
  return { title: "CRM" };
}

export function CrmMobileHeader() {
  const pathname = usePathname() ?? "";
  const { title, backHref } = resolveTitle(pathname);
  const isDashboard = pathname === "/crm/dashboard" || pathname === "/crm";

  return (
    <header className="crm-mobile-header">
      {backHref ? (
        <Link
          href={backHref}
          className="crm-mobile-header__back"
          aria-label="Voltar"
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
        </Link>
      ) : (
        <span className="crm-mobile-header__spacer" aria-hidden="true" />
      )}
      {isDashboard ? (
        <span className="crm-mobile-header__brand" aria-label="Pedro Soares">
          <Image
            src="/brand/logo-home-2026.png"
            alt="Pedro Soares — Corretor de Imóveis"
            width={180}
            height={40}
            priority
          />
        </span>
      ) : (
        <h1 className="crm-mobile-header__title">{title}</h1>
      )}
      <ThemeToggle compact />
    </header>
  );
}
