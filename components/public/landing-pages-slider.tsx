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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  if (!landings.length) return null;

  function goTo(index: number) {
    setCurrentIndex((index + landings.length) % landings.length);
  }

  function handleTouchEnd(clientX: number) {
    if (touchStart === null) return;
    const distance = touchStart - clientX;
    if (Math.abs(distance) > 45) goTo(currentIndex + (distance > 0 ? 1 : -1));
    setTouchStart(null);
  }

  return (
    <div className="wp-featured-landing-slider" role="region" aria-roledescription="carrossel" aria-label="Lançamentos em destaque">
      <div
        className="wp-featured-landing-viewport"
        onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <div
          className="wp-featured-landing-track"
          style={{ transform: `translate3d(-${currentIndex * 100}%, 0, 0)` }}
        >
          {landings.map((landing, index) => (
            <Link
              key={landing.slug}
              href={landing.href}
              className="wp-featured-landing"
              aria-hidden={index !== currentIndex}
              tabIndex={index === currentIndex ? 0 : -1}
              aria-label={`${landing.title}. ${landing.status}`}
            >
              <Image
                src={landing.image}
                alt=""
                fill
                sizes="(max-width: 760px) 100vw, 1000px"
                priority={index === 0}
                unoptimized={!canOptimizeImage(landing.image)}
                className="wp-cover-image"
              />
              <span className="wp-image-shade wp-featured-landing-shade" aria-hidden="true" />
              <div className="wp-featured-landing-copy">
                <span className="badge">{landing.status}</span>
                <p className="wp-section-eyebrow">Lançamento em destaque · {landing.category}</p>
                <h2>{landing.title}</h2>
                <p>{landing.summary}</p>
                <span className="button button-primary">Conhecer lançamento</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {landings.length > 1 ? (
        <div className="wp-featured-landing-controls">
          <div className="wp-featured-landing-arrows">
            <button type="button" onClick={() => goTo(currentIndex - 1)} aria-label="Lançamento anterior">
              ←
            </button>
            <button type="button" onClick={() => goTo(currentIndex + 1)} aria-label="Próximo lançamento">
              →
            </button>
          </div>
          <div className="wp-featured-landing-dots" role="tablist" aria-label="Selecionar lançamento">
            {landings.map((landing, index) => (
              <button
                key={landing.slug}
                type="button"
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Ir para ${landing.title}`}
                className={index === currentIndex ? "is-active" : ""}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <span className="wp-featured-landing-counter" aria-live="polite">
            {String(currentIndex + 1).padStart(2, "0")} / {String(landings.length).padStart(2, "0")}
          </span>
        </div>
      ) : null}
    </div>
  );
}
