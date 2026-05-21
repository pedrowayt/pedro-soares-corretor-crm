"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HeroSlide = {
  id: string;
  url: string;
  alt: string;
  caption?: string | null;
};

type DevelopmentHeroSliderProps = {
  slides: HeroSlide[];
  intervalMs?: number;
};

export function DevelopmentHeroSlider({ slides, intervalMs = 5000 }: DevelopmentHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [slides.length, intervalMs]);

  if (!slides.length) {
    return (
      <div className="development-hero-slider-empty">
        <p className="text-card">Sem imagem de destaque no momento.</p>
      </div>
    );
  }

  const activeSlide = slides[Math.min(currentIndex, slides.length - 1)];

  function goTo(index: number) {
    const normalized = (index + slides.length) % slides.length;
    setCurrentIndex(normalized);
  }

  return (
    <div className="development-hero-slider">
      <div className="development-hero-slider-media">
        {slides.map((slide, index) => (
          <figure
            key={slide.id}
            className={`development-hero-slider-item${index === currentIndex ? " is-active" : ""}`}
            aria-hidden={index === currentIndex ? "false" : "true"}
          >
            <Image
              src={slide.url}
              alt={slide.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 94vw, 1180px"
              loading={index === 0 ? "eager" : "lazy"}
              style={{ objectFit: "cover" }}
            />
          </figure>
        ))}

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              className="development-hero-slider-arrow prev"
              onClick={() => goTo(currentIndex - 1)}
              aria-label="Imagem anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="development-hero-slider-arrow next"
              onClick={() => goTo(currentIndex + 1)}
              aria-label="Próxima imagem"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="development-hero-slider-dots" role="tablist" aria-label="Navegação de imagens do empreendimento">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Ir para imagem ${index + 1}`}
              className={`development-hero-slider-dot${index === currentIndex ? " is-active" : ""}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : null}

      {activeSlide?.caption ? (
        <p className="development-hero-slider-caption text-card">{activeSlide.caption}</p>
      ) : null}
    </div>
  );
}
