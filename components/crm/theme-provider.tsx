"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "ps-crm-theme";

function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

function resolveInitial(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Tiny script injected before hydration so dark mode is applied before paint
 * (avoids the white flash on reload).
 */
export function ThemeBootScript() {
  const code = `(function(){try{var k='${STORAGE_KEY}';var v=localStorage.getItem(k);if(!v){v=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=v;}catch(_){}})()`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(resolveInitial());
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  if (!mounted) {
    return (
      <button type="button" className="crm-theme-toggle" aria-hidden="true">
        <Sun size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
    );
  }

  const Icon = theme === "dark" ? Sun : Moon;
  const label = theme === "dark" ? "Tema claro" : "Tema escuro";

  return (
    <button
      type="button"
      className={`crm-theme-toggle${compact ? " is-compact" : ""}`}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
      {!compact ? <span>{label}</span> : null}
    </button>
  );
}
