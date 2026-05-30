"use client";

import { useState, type ReactNode } from "react";

/**
 * On mobile (≤640px) shows a "Filtros" toggle button and collapses the panel
 * by default. On wider viewports the button is hidden and the panel is always
 * visible (CSS handles the breakpoint).
 */
export function MobileFilterToggle({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`mobile-filter-toggle${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="mobile-filter-toggle-button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-filter-panel"
      >
        <span>Filtros</span>
        <span className="mobile-filter-toggle-chevron" aria-hidden="true">
          ▾
        </span>
      </button>
      <div id="mobile-filter-panel" className="mobile-filter-toggle-panel">
        {children}
      </div>
    </div>
  );
}
