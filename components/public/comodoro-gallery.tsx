"use client";

import Image from "next/image";
import { ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";

type ComodoroGalleryItem = {
  src: string;
  label: string;
  caption: string;
  kind?: "plans";
};

type ComodoroGalleryProps = {
  items: readonly ComodoroGalleryItem[];
};

export function ComodoroGallery({ items }: ComodoroGalleryProps) {
  const [selected, setSelected] = useState<ComodoroGalleryItem | null>(null);

  useEffect(() => {
    if (!selected) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);

  return (
    <>
      <div className="comodoro-gallery-grid comodoro-gallery-grid--complete">
        {items.map((item, index) => (
          <figure className={`comodoro-gallery-card ${index === 0 ? "comodoro-gallery-card--featured" : ""} ${item.kind === "plans" ? "comodoro-gallery-card--plans" : ""}`} key={item.src}>
            <button className="comodoro-gallery-image-button" type="button" onClick={() => setSelected(item)} aria-label={`Ampliar imagem: ${item.label}`}>
              <Image src={item.src} alt={item.label} fill sizes="(max-width: 620px) 92vw, (max-width: 900px) 44vw, 25vw" />
              <span className="comodoro-gallery-zoom-hint">Ver em alta qualidade</span>
            </button>
            <figcaption><span>{item.label}</span><strong>{item.caption}</strong></figcaption>
          </figure>
        ))}
      </div>

      {selected ? (
        <div className="comodoro-lightbox" role="dialog" aria-modal="true" aria-label={`Imagem ampliada: ${selected.label}`} onMouseDown={() => setSelected(null)}>
          <button className="comodoro-lightbox-close" type="button" onClick={() => setSelected(null)} aria-label="Fechar imagem ampliada"><X size={21} /></button>
          <div className="comodoro-lightbox-panel" onMouseDown={(event) => event.stopPropagation()}>
            <div className={`comodoro-lightbox-image ${selected.kind === "plans" ? "comodoro-lightbox-image--plans" : ""}`}>
              <Image src={selected.src} alt={selected.label} fill sizes="100vw" quality={100} priority className="comodoro-lightbox-image-content" />
            </div>
            <div className="comodoro-lightbox-copy">
              <div><span>{selected.label}</span><strong>{selected.caption}</strong></div>
              <a href={selected.src} target="_blank" rel="noreferrer">Abrir arquivo original <ExternalLink size={14} /></a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
