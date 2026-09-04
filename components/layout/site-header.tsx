"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavLinkItem = {
  href: string;
  label: string;
};

type NavItem = NavLinkItem & {
  children?: NavLinkItem[];
};

const propertySubNav: NavLinkItem[] = [
  { href: "/imoveis", label: "Todos os imóveis" },
  { href: "/imoveis/prontos", label: "Imóveis prontos" },
  { href: "/imoveis/leilao", label: "Leilões" },
  { href: "/gestao-exclusiva", label: "Gestão Exclusiva" }
];

const mainNav: NavItem[] = [
  { href: "/imoveis", label: "Imóveis", children: propertySubNav },
  { href: "/lancamentos", label: "Lançamentos" },
  { href: "/imoveis/prontos?purpose=INVESTIMENTO", label: "Investir" },
  { href: "/sobre", label: "Sobre Pedro" },
  { href: "/blog", label: "Conteúdos" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (item: NavItem) => {
    const path = item.href.split("?")[0];
    if (path === "/imoveis") {
      return pathname === "/imoveis" || pathname.startsWith("/imoveis/leilao");
    }
    if (path === "/imoveis/prontos") {
      return pathname.startsWith("/imoveis/prontos");
    }
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="site-logo" aria-label="Pedro Soares Corretor de Imóveis">
          <Image
            src="/brand/logo-home-2026.png"
            alt="Pedro Soares Corretor de Imóveis"
            width={1920}
            height={1080}
            priority
          />
        </Link>

        <nav className="site-nav site-nav-desktop" aria-label="Menu principal">
          {mainNav.map((item) =>
            item.children ? (
              <div key={item.href} className={`site-nav-item site-nav-item-has-children${isActive(item) ? " is-active" : ""}`}>
                <Link href={item.href} className="site-nav-link" aria-current={isActive(item) ? "page" : undefined}>
                  {item.label}
                  <span className="site-nav-caret" aria-hidden>
                    ▾
                  </span>
                </Link>
                <div className="site-nav-dropdown" role="menu" aria-label={`Submenu ${item.label}`}>
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href} className="site-nav-dropdown-link" role="menuitem">
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="site-nav-link" aria-current={isActive(item) ? "page" : undefined}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="site-actions site-actions-desktop">
          <a
            className="button button-primary"
            href="https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20falar%20sobre%20im%C3%B3veis."
            target="_blank"
            rel="noreferrer"
          >
            Falar com Pedro
          </a>
        </div>

        <button
          type="button"
          className="site-menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="site-mobile-drawer"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        className={`site-mobile-backdrop ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      <aside id="site-mobile-drawer" className={`site-mobile-drawer ${isMenuOpen ? "open" : ""}`} aria-hidden={!isMenuOpen}>
        <div className="site-mobile-drawer-head">
          <Link href="/" className="site-logo" aria-label="Pedro Soares Corretor de Imóveis" onClick={() => setIsMenuOpen(false)}>
            <Image
              src="/brand/logo-home-2026.png"
              alt="Pedro Soares Corretor de Imóveis"
              width={1920}
              height={1080}
              priority
            />
          </Link>
          <button
            type="button"
            className="site-mobile-close"
            aria-label="Fechar menu"
            onClick={() => setIsMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="site-mobile-nav" aria-label="Menu mobile">
          {mainNav.map((item) =>
            item.children ? (
              <details key={item.href} className="site-mobile-group">
                <summary>
                  <span>{item.label}</span>
                  <span className="site-mobile-group-caret" aria-hidden>
                    ▾
                  </span>
                </summary>
                <div className="site-mobile-subnav">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href} onClick={() => setIsMenuOpen(false)}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="site-mobile-actions">
          <span className="site-creci">CRECI 5861-TO</span>
          <a
            className="button button-primary"
            href="https://wa.me/5563984845101?text=Ol%C3%A1%20Pedro%2C%20quero%20falar%20sobre%20im%C3%B3veis."
            target="_blank"
            rel="noreferrer"
          >
            Falar com Pedro
          </a>
        </div>
      </aside>
    </header>
  );
}
