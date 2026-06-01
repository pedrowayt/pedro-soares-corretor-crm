"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarCheck,
  CornerDownLeft,
  FileSignature,
  Hammer,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Newspaper,
  Plus,
  Search,
  Settings,
  UserCheck,
  Users,
  Workflow,
  type LucideIcon
} from "lucide-react";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  href: string;
  Icon: LucideIcon;
  group: "Navegação" | "Criar" | "Leads" | "Imóveis";
  keywords?: string;
};

type Props = {
  leads: Array<{ id: string; name: string; phone?: string | null; stage?: string | null }>;
  properties: Array<{ id: string; slug: string; title: string; city?: string | null; district?: string | null }>;
};

const NAV_ITEMS: ReadonlyArray<CommandItem> = [
  { id: "nav-dashboard", label: "Dashboard", href: "/crm/dashboard", Icon: LayoutDashboard, group: "Navegação" },
  { id: "nav-inbox", label: "Inbox", href: "/crm/inbox", Icon: Inbox, group: "Navegação" },
  { id: "nav-leads", label: "Leads", href: "/crm/leads", Icon: Users, group: "Navegação" },
  { id: "nav-funil", label: "Funil de vendas", href: "/crm/funil", Icon: Workflow, group: "Navegação" },
  { id: "nav-imoveis", label: "Imóveis", href: "/crm/imoveis", Icon: Building2, group: "Navegação" },
  { id: "nav-empreendimentos", label: "Empreendimentos", href: "/crm/empreendimentos", Icon: Building2, group: "Navegação" },
  { id: "nav-construtoras", label: "Construtoras", href: "/crm/construtoras", Icon: Hammer, group: "Navegação" },
  { id: "nav-proprietarios", label: "Proprietários", href: "/crm/proprietarios", Icon: UserCheck, group: "Navegação" },
  { id: "nav-visitas", label: "Visitas", href: "/crm/visitas", Icon: CalendarCheck, group: "Navegação" },
  { id: "nav-propostas", label: "Propostas", href: "/crm/propostas", Icon: FileSignature, group: "Navegação" },
  { id: "nav-tarefas", label: "Tarefas", href: "/crm/tarefas", Icon: ListTodo, group: "Navegação" },
  { id: "nav-relatorios", label: "Relatórios", href: "/crm/relatorios", Icon: BarChart3, group: "Navegação" },
  { id: "nav-blog", label: "Blog", href: "/crm/blog", Icon: Newspaper, group: "Navegação" },
  { id: "nav-config", label: "Configurações", href: "/crm/configuracoes", Icon: Settings, group: "Navegação" }
];

const CREATE_ITEMS: ReadonlyArray<CommandItem> = [
  { id: "new-lead", label: "Novo lead", hint: "Captura rápida", href: "/crm/leads#quick-create", Icon: Plus, group: "Criar" },
  { id: "new-visit", label: "Nova visita", hint: "Agendamento", href: "/crm/visitas#quick-create", Icon: Plus, group: "Criar" },
  { id: "new-proposal", label: "Nova proposta", hint: "Iniciar negociação", href: "/crm/propostas#quick-create", Icon: Plus, group: "Criar" },
  { id: "new-task", label: "Nova tarefa", hint: "Follow-up", href: "/crm/tarefas#quick-create", Icon: Plus, group: "Criar" },
  { id: "new-property", label: "Novo imóvel", hint: "Wizard de cadastro", href: "/crm/imoveis", Icon: Plus, group: "Criar" }
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function CommandPalette({ leads, properties }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const items = useMemo<CommandItem[]>(() => {
    const leadItems: CommandItem[] = leads.slice(0, 50).map((lead) => ({
      id: `lead-${lead.id}`,
      label: lead.name,
      hint: [lead.stage, lead.phone].filter(Boolean).join(" · "),
      href: `/crm/leads/${lead.id}`,
      Icon: Users,
      group: "Leads",
      keywords: `${lead.name} ${lead.phone ?? ""}`
    }));

    const propertyItems: CommandItem[] = properties.slice(0, 50).map((property) => ({
      id: `property-${property.id}`,
      label: property.title,
      hint: [property.district, property.city].filter(Boolean).join(", "),
      href: `/crm/imoveis/${property.id}`,
      Icon: Building2,
      group: "Imóveis",
      keywords: `${property.title} ${property.city ?? ""} ${property.district ?? ""}`
    }));

    return [...NAV_ITEMS, ...CREATE_ITEMS, ...leadItems, ...propertyItems];
  }, [leads, properties]);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return items.filter((item) => item.group === "Navegação" || item.group === "Criar");
    }
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      const haystack = normalize(`${item.label} ${item.hint ?? ""} ${item.keywords ?? ""} ${item.group}`);
      return tokens.every((token) => haystack.includes(token));
    });
  }, [items, query]);

  const grouped = useMemo(() => {
    const buckets = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const list = buckets.get(item.group) ?? [];
      list.push(item);
      buckets.set(item.group, list);
    });
    return Array.from(buckets.entries());
  }, [filtered]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const trigger = isMac ? event.metaKey : event.ctrlKey;
      if (trigger && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    setQuery("");
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(filtered.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter") {
      const target = filtered[activeIndex];
      if (target) {
        event.preventDefault();
        router.push(target.href);
        setOpen(false);
      }
    }
  };

  const flatIndexMap = new Map<string, number>();
  let counter = 0;
  grouped.forEach(([, list]) => {
    list.forEach((item) => {
      flatIndexMap.set(item.id, counter++);
    });
  });

  return (
    <>
      {open ? (
        <div
          className="crm-cmdk-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <div
        className={`crm-cmdk-panel${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Busca rápida"
        aria-hidden={!open}
      >
        <div className="crm-cmdk-search">
          <Search size={18} strokeWidth={1.75} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar leads, imóveis, navegar… (⌘K)"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>esc</kbd>
        </div>

        <div className="crm-cmdk-list" role="listbox">
          {grouped.length === 0 ? (
            <p className="crm-cmdk-empty">Nenhum resultado para “{query}”.</p>
          ) : (
            grouped.map(([groupName, list]) => (
              <section key={groupName} className="crm-cmdk-group">
                <h4>{groupName}</h4>
                <ul>
                  {list.map((item) => {
                    const ItemIcon = item.Icon;
                    const flatIndex = flatIndexMap.get(item.id) ?? -1;
                    const isActive = flatIndex === activeIndex;
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className={`crm-cmdk-item${isActive ? " is-active" : ""}`}
                          onClick={() => setOpen(false)}
                          onMouseEnter={() => setActiveIndex(flatIndex)}
                          role="option"
                          aria-selected={isActive}
                        >
                          <span className="crm-cmdk-item__icon" aria-hidden="true">
                            <ItemIcon size={16} strokeWidth={1.75} />
                          </span>
                          <span className="crm-cmdk-item__copy">
                            <span className="crm-cmdk-item__label">{item.label}</span>
                            {item.hint ? (
                              <span className="crm-cmdk-item__hint">{item.hint}</span>
                            ) : null}
                          </span>
                          {isActive ? (
                            <CornerDownLeft size={14} strokeWidth={1.5} aria-hidden="true" />
                          ) : (
                            <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>

        <footer className="crm-cmdk-footer">
          <span>↑↓ navegar</span>
          <span>↵ abrir</span>
          <span>esc fechar</span>
        </footer>
      </div>
    </>
  );
}
