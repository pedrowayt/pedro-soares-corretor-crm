"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export type PalmasLakePhotoGalleryItem = {
  src: string;
  title: string;
  caption: string;
};

type PalmasLakePhotoGalleryProps = {
  items: PalmasLakePhotoGalleryItem[];
};

export function PalmasLakePhotoGallery({ items }: PalmasLakePhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedItem = selectedIndex === null ? null : items[selectedIndex];

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") setSelectedIndex((index) => (index === null ? null : (index + 1) % items.length));
      if (event.key === "ArrowLeft") setSelectedIndex((index) => (index === null ? null : (index - 1 + items.length) % items.length));
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items.length, selectedIndex]);

  if (items.length === 0) return null;

  return (
    <div className="palmas-loft-photo-gallery">
      <div className="palmas-loft-photo-grid">
        {items.map((item, index) => (
          <figure className="palmas-loft-photo-card" key={item.src}>
            <button
              type="button"
              className="palmas-loft-photo-button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Ampliar foto ${index + 1}: ${item.title}`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
                loading={index < 3 ? "eager" : "lazy"}
                unoptimized
              />
              <span className="palmas-loft-photo-zoom" aria-hidden="true">
                <Maximize2 size={15} />
                Ampliar
              </span>
            </button>
            <figcaption>
              <strong>{item.title}</strong>
              <span>{item.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {selectedItem ? (
        <div
          className="palmas-loft-photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada: ${selectedItem.title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedIndex(null);
          }}
        >
          <button type="button" className="palmas-loft-photo-lightbox-close" onClick={() => setSelectedIndex(null)} aria-label="Fechar imagem ampliada">
            <X size={22} />
          </button>
          <button
            type="button"
            className="palmas-loft-photo-lightbox-arrow palmas-loft-photo-lightbox-arrow--prev"
            onClick={() => setSelectedIndex((index) => (index === null ? null : (index - 1 + items.length) % items.length))}
            aria-label="Foto anterior"
          >
            <ChevronLeft size={28} />
          </button>
          <figure className="palmas-loft-photo-lightbox-frame" onMouseDown={(event) => event.stopPropagation()}>
            <Image src={selectedItem.src} alt={selectedItem.title} fill sizes="100vw" quality={100} priority unoptimized />
            <figcaption>
              <strong>{selectedItem.title}</strong>
              <span>{selectedItem.caption}</span>
              <small>{(selectedIndex ?? 0) + 1} / {items.length}</small>
            </figcaption>
          </figure>
          <button
            type="button"
            className="palmas-loft-photo-lightbox-arrow palmas-loft-photo-lightbox-arrow--next"
            onClick={() => setSelectedIndex((index) => (index === null ? null : (index + 1) % items.length))}
            aria-label="Próxima foto"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
