"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

type LakeVillagePhotoLightboxProps = {
  src: string;
  alt: string;
  label?: string;
  caption?: string;
  children: ReactNode;
};

export function LakeVillagePhotoLightbox({ src, alt, label, caption, children }: LakeVillagePhotoLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const title = label || alt;

  return (
    <>
      <button
        type="button"
        className="lake-photo-trigger"
        onClick={() => setIsOpen(true)}
        aria-label={`Ampliar imagem: ${title}`}
      >
        {children}
        <span className="lake-photo-trigger-badge" aria-hidden="true">
          <Maximize2 size={15} />
          <span>Ampliar</span>
        </span>
      </button>

      {isOpen ? (
        <div
          className="lake-photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada: ${title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <button
            type="button"
            className="lake-photo-lightbox-close"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar imagem ampliada"
          >
            <X size={22} />
          </button>
          <div className="lake-photo-lightbox-panel" onMouseDown={(event) => event.stopPropagation()}>
            <div className="lake-photo-lightbox-image-wrap">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="94vw"
                quality={100}
                priority
                className="lake-photo-lightbox-image"
              />
            </div>
            <div className="lake-photo-lightbox-copy">
              <strong>{title}</strong>
              {caption ? <span>{caption}</span> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
