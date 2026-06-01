"use client";

import { usePathname } from "next/navigation";
import { Plus, type LucideIcon } from "lucide-react";

type CreateAction = {
  match: (pathname: string) => boolean;
  label: string;
  Icon?: LucideIcon;
};

const ACTIONS: ReadonlyArray<CreateAction> = [
  { match: (p) => p.startsWith("/crm/leads"), label: "Novo lead" },
  { match: (p) => p.startsWith("/crm/visitas"), label: "Nova visita" },
  { match: (p) => p.startsWith("/crm/propostas"), label: "Nova proposta" },
  { match: (p) => p.startsWith("/crm/tarefas"), label: "Nova tarefa" }
];

function flashTarget(target: HTMLElement) {
  target.classList.add("is-flash");
  window.setTimeout(() => target.classList.remove("is-flash"), 1200);
  const focusable = target.querySelector<HTMLElement>(
    "input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])"
  );
  focusable?.focus({ preventScroll: true });
}

export function CrmCreateFAB() {
  const pathname = usePathname() ?? "";
  const action = ACTIONS.find((entry) => entry.match(pathname));

  if (!action) return null;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof document === "undefined") return;
    const target = document.getElementById("quick-create");
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => flashTarget(target), 350);
  };

  return (
    <a
      href="#quick-create"
      className="crm-create-fab"
      aria-label={action.label}
      onClick={handleClick}
    >
      <Plus size={22} strokeWidth={2} aria-hidden="true" />
      <span className="crm-create-fab__label">{action.label}</span>
    </a>
  );
}
