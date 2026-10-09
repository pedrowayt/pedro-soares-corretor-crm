"use client";

import { useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  activeFilterCount?: number;
  resultCount?: number;
};

/**
 * On mobile (≤640px) shows a "Filtros" toggle button and collapses the panel
 * by default. On wider viewports the button is hidden and the panel is always
 * visible (CSS handles the breakpoint).
 */
export function MobileFilterToggle({ children, activeFilterCount = 0, resultCount = 0 }: Props) {
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
        <span className="mobile-filter-toggle-label">
          Filtros
          {activeFilterCount > 0 ? (
            <span className="mobile-filter-toggle-count" aria-label={`${activeFilterCount} filtros ativos`}>
              {activeFilterCount}
            </span>
          ) : null}
        </span>
        <span className="mobile-filter-toggle-chevron" aria-hidden="true">
          ▾
        </span>
      </button>
      <a className="mobile-filter-results-link" href="#listing-results">
        Ver {resultCount.toLocaleString("pt-BR")} {resultCount === 1 ? "resultado" : "resultados"}
      </a>
      <div id="mobile-filter-panel" className="mobile-filter-toggle-panel">
        {children}
      </div>
    </div>
  );
}
