"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type DevelopmentGalleryItem = {
  id: string;
  url: string;
  title: string | null;
  caption: string | null;
};

type DevelopmentGalleryProps = {
  items: DevelopmentGalleryItem[];
  developmentTitle: string;
  autoplayMs?: number;
};

export function DevelopmentGallery({ items, developmentTitle, autoplayMs = 4500 }: DevelopmentGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  const total = items.length;
  const lightboxOpen = lightboxIndex !== null;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setCurrentIndex(((index % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    if (total <= 1 || isPaused || lightboxOpen) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, autoplayMs);
    return () => window.clearInterval(timer);
  }, [total, autoplayMs, isPaused, lightboxOpen]);

  useEffect(() => {
    const node = thumbsRef.current;
    if (!node) return;
    const activeThumb = node.querySelector<HTMLElement>(`[data-thumb-index="${currentIndex}"]`);
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") setLightboxIndex((idx) => (idx === null ? null : (idx + 1) % total));
      if (event.key === "ArrowLeft") setLightboxIndex((idx) => (idx === null ? null : (idx - 1 + total) % total));
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, total]);

  if (total === 0) return null;

  const activeItem = items[currentIndex];
  const lightboxItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <div className="development-gallery">
      <div
        className="development-gallery-stage"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {items.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={`development-gallery-slide${index === currentIndex ? " is-active" : ""}`}
            aria-hidden={index === currentIndex ? "false" : "true"}
            tabIndex={index === currentIndex ? 0 : -1}
            onClick={() => setLightboxIndex(index)}
            aria-label={`Abrir imagem ${index + 1} de ${total}`}
          >
            <Image
              src={item.url}
              alt={item.title || developmentTitle}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1100px"
              loading={index === 0 ? "eager" : "lazy"}
              style={{ objectFit: "cover" }}
            />
            <span className="development-gallery-zoom" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              Ampliar
            </span>
          </button>
        ))}

        {total > 1 ? (
          <>
            <button
              type="button"
              className="development-gallery-arrow prev"
              onClick={prev}
              aria-label="Imagem anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="development-gallery-arrow next"
              onClick={next}
              aria-label="Próxima imagem"
            >
              ›
            </button>
            <div className="development-gallery-counter" aria-live="polite">
              {currentIndex + 1} / {total}
            </div>
          </>
        ) : null}

        {activeItem.caption || activeItem.title ? (
          <div className="development-gallery-caption">
            {activeItem.title ? <strong>{activeItem.title}</strong> : null}
            {activeItem.caption ? <span>{activeItem.caption}</span> : null}
          </div>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="development-gallery-thumbs" ref={thumbsRef}>
          {items.map((item, index) => (
            <button
              type="button"
              key={item.id}
              data-thumb-index={index}
              className={`development-gallery-thumb${index === currentIndex ? " is-active" : ""}`}
              onClick={() => goTo(index)}
              aria-label={`Ir para imagem ${index + 1}`}
            >
              <Image
                src={item.url}
                alt={item.title || developmentTitle}
                fill
                sizes="120px"
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxItem ? (
        <div
          className="development-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title || developmentTitle}
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxIndex(null);
          }}
        >
          <button
            type="button"
            className="development-gallery-lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Fechar"
          >
            ×
          </button>

          {total > 1 ? (
            <button
              type="button"
              className="development-gallery-lightbox-arrow prev"
              onClick={() => setLightboxIndex((idx) => (idx === null ? null : (idx - 1 + total) % total))}
              aria-label="Imagem anterior"
            >
              ‹
            </button>
          ) : null}

          <figure className="development-gallery-lightbox-figure">
            <Image
              src={lightboxItem.url}
              alt={lightboxItem.title || developmentTitle}
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "contain" }}
            />
            {lightboxItem.title || lightboxItem.caption ? (
              <figcaption>
                {lightboxItem.title ? <strong>{lightboxItem.title}</strong> : null}
                {lightboxItem.caption ? <span>{lightboxItem.caption}</span> : null}
                <small>
                  {(lightboxIndex ?? 0) + 1} / {total}
                </small>
              </figcaption>
            ) : (
              <figcaption>
                <small>
                  {(lightboxIndex ?? 0) + 1} / {total}
                </small>
              </figcaption>
            )}
          </figure>

          {total > 1 ? (
            <button
              type="button"
              className="development-gallery-lightbox-arrow next"
              onClick={() => setLightboxIndex((idx) => (idx === null ? null : (idx + 1) % total))}
              aria-label="Próxima imagem"
            >
              ›
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
