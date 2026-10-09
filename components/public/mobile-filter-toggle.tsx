"use client";

import { useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  activeFilterCount?: number;
  resultCount?: number;
  formId?: string;
  clearHref?: string;
};

/**
 * On mobile (≤640px) keeps filters and the result action together in a
 * persistent action bar, opening the panel on demand. On wider viewports the
 * action bar is hidden and the panel remains visible (CSS handles the breakpoint).
 */
export function MobileFilterToggle({
  children,
  activeFilterCount = 0,
  resultCount = 0,
  formId,
  clearHref = "/imoveis/prontos",
}: Props) {
  const [open, setOpen] = useState(false);
  const resultLabel = `Ver ${resultCount.toLocaleString("pt-BR")} ${resultCount === 1 ? "resultado" : "resultados"}`;

  return (
    <div className={`mobile-filter-toggle${open ? " is-open" : ""}`}>
      <div className="mobile-filter-action-bar">
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
        {open && formId ? (
          <button type="submit" form={formId} className="mobile-filter-apply-button">
            {resultLabel}
          </button>
        ) : (
          <a className="mobile-filter-apply-button" href="#listing-results">
            {resultLabel}
          </a>
        )}
      </div>
      <div id="mobile-filter-panel" className="mobile-filter-toggle-panel">
        <div className="mobile-filter-panel-head">
          <strong>Refine sua busca</strong>
          <a href={clearHref}>Limpar filtros</a>
        </div>
        {children}
      </div>
    </div>
  );
}
