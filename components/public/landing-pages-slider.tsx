"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PublicLandingPage } from "@/lib/data/landing-pages";

type LandingPagesSliderProps = {
  landings: PublicLandingPage[];
};

function canOptimizeImage(src: string) {
  return src.startsWith("/") || src.startsWith("https://imagedelivery.net/") || src.startsWith("https://images.unsplash.com/");
}

export function LandingPagesSlider({ landings }: LandingPagesSliderProps) {
  const [currentPage, setCurrentPage] = useState(0);

  if (!landings.length) return null;

  const pageSize = 3;
  const pageCount = Math.ceil(landings.length / pageSize);
  const visibleLandings = landings.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  function goTo(page: number) {
    setCurrentPage(Math.max(0, Math.min(page, pageCount - 1)));
  }

  return (
    <div className="wp-launch-catalog" role="region" aria-label="Lançamentos em destaque">
      <div className="wp-launch-grid" aria-live="polite">
        {visibleLandings.map((landing, index) => (
          <Link
            key={landing.slug}
            href={landing.href}
            className={`wp-launch-card${index === 0 ? " wp-launch-card--featured" : ""}`}
            aria-label={`${landing.title}. ${landing.status}`}
          >
            <div className="wp-launch-card-media">
              <Image
                src={landing.image}
                alt=""
                fill
                sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 42vw"
                priority={currentPage === 0 && index === 0}
                unoptimized={!canOptimizeImage(landing.image)}
                className="wp-cover-image"
              />
              <span className="wp-launch-card-shade" aria-hidden="true" />
              <span className="wp-launch-card-status">{landing.status}</span>
              <span className="wp-launch-card-number" aria-hidden="true">
                {String(currentPage * pageSize + index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="wp-launch-card-body">
              <div className="wp-launch-card-meta">
                <span>{landing.category}</span>
                <span>{landing.location}</span>
              </div>
              <h3>{landing.title}</h3>
              <p>{landing.summary}</p>
              <span className="wp-launch-card-link">
                Conhecer lançamento <span aria-hidden="true">↗</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {pageCount > 1 ? (
        <div className="wp-launch-controls">
          <div className="wp-launch-arrows">
            <button type="button" onClick={() => goTo(currentPage - 1)} disabled={currentPage === 0} aria-label="Página anterior">
              ←
            </button>
            <button type="button" onClick={() => goTo(currentPage + 1)} disabled={currentPage === pageCount - 1} aria-label="Próxima página">
              →
            </button>
          </div>

          <div className="wp-launch-pages" role="tablist" aria-label="Páginas de lançamentos">
            {Array.from({ length: pageCount }, (_, page) => (
              <button
                key={page}
                type="button"
                role="tab"
                aria-selected={page === currentPage}
                aria-label={`Ir para a página ${page + 1}`}
                className={page === currentPage ? "is-active" : ""}
                onClick={() => goTo(page)}
              >
                {String(page + 1).padStart(2, "0")}
              </button>
            ))}
          </div>

          <span className="wp-launch-counter" aria-live="polite">
            Página {String(currentPage + 1).padStart(2, "0")} <span>/</span> {String(pageCount).padStart(2, "0")}
          </span>
        </div>
      ) : null}

      <div className="wp-launch-footer">
        <span>Curadoria de lançamentos em Palmas e região</span>
        <Link href="/lancamentos">Ver todos os lançamentos <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}
