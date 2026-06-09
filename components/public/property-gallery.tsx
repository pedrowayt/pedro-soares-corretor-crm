"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, Maximize2, X } from "lucide-react";

export type PropertyGalleryImage = {
  id: string;
  url: string;
};

type PropertyGalleryProps = {
  images: PropertyGalleryImage[];
  propertyTitle: string;
};

function canUseNextImage(src: string) {
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return url.hostname === "images.unsplash.com" || url.hostname === "imagedelivery.net";
  } catch {
    return false;
  }
}

function GalleryVisual({
  src,
  alt,
  sizes,
  priority,
  objectFit = "cover"
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
}) {
  if (canUseNextImage(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit
      }}
    />
  );
}

export function PropertyGallery({ images, propertyTitle }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const total = images.length;
  const selectedImage = images[selectedIndex] ?? images[0];
  const heroThumbs = images.slice(1, 5);

  const normalizeIndex = useCallback(
    (index: number) => {
      if (total === 0) return 0;
      return ((index % total) + total) % total;
    },
    [total]
  );

  const openLightbox = useCallback(
    (index: number) => {
      const nextIndex = normalizeIndex(index);
      setSelectedIndex(nextIndex);
      setLightboxIndex(nextIndex);
    },
    [normalizeIndex]
  );

  const moveLightbox = useCallback(
    (delta: number) => {
      setLightboxIndex((currentIndex) => {
        if (currentIndex === null) return null;
        const nextIndex = normalizeIndex(currentIndex + delta);
        setSelectedIndex(nextIndex);
        return nextIndex;
      });
    },
    [normalizeIndex]
  );

  useEffect(() => {
    const node = stripRef.current;
    if (!node) return;

    const activeThumb = node.querySelector<HTMLElement>(`[data-gallery-index="${selectedIndex}"]`);
    if (!activeThumb) return;

    const target = activeThumb.offsetLeft - node.clientWidth / 2 + activeThumb.clientWidth / 2;
    const max = node.scrollWidth - node.clientWidth;
    node.scrollTo({ left: Math.max(0, Math.min(max, target)), behavior: "smooth" });
  }, [selectedIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") moveLightbox(1);
      if (event.key === "ArrowLeft") moveLightbox(-1);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, moveLightbox]);

  if (!selectedImage) return null;

  const lightboxImage = lightboxIndex !== null ? images[lightboxIndex] : null;
  const lightboxPosition = lightboxIndex ?? 0;

  return (
    <div className="property-gallery" aria-label="Galeria de fotos do imóvel">
      <div className="property-media-showcase">
        <button
          className="property-media-showcase__main"
          type="button"
          onClick={() => openLightbox(selectedIndex)}
          aria-label={`Ampliar foto ${selectedIndex + 1} de ${total} do imóvel`}
        >
          <GalleryVisual
            src={selectedImage.url}
            alt={`Foto principal do imóvel ${propertyTitle}`}
            sizes="(max-width: 960px) 100vw, 62vw"
            priority
          />
          <span>
            <Maximize2 size={15} strokeWidth={2.2} aria-hidden="true" />
            Ampliar foto
          </span>
        </button>

        <div className="property-media-showcase__thumbs">
          {heroThumbs.map((image, index) => {
            const imageIndex = index + 1;
            const hiddenCount = Math.max(0, total - 5);

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => openLightbox(imageIndex)}
                aria-label={`Abrir foto ${imageIndex + 1} de ${total} do imóvel`}
              >
                <GalleryVisual
                  src={image.url}
                  alt={`Foto ${imageIndex + 1} do imóvel ${propertyTitle}`}
                  sizes="(max-width: 960px) 50vw, 18vw"
                />
                {hiddenCount > 0 && index === heroThumbs.length - 1 ? (
                  <span className="property-gallery-more">
                    <Images size={15} strokeWidth={2.2} aria-hidden="true" />
                    +{hiddenCount} fotos
                  </span>
                ) : null}
              </button>
            );
          })}
          {!heroThumbs.length ? (
            <div className="property-media-showcase__empty">
              <span>Mais fotos serão adicionadas em breve.</span>
            </div>
          ) : null}
        </div>
      </div>

      {total > 1 ? (
        <div className="property-image-strip" ref={stripRef} aria-label="Miniaturas do imóvel">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              data-gallery-index={index}
              className={index === selectedIndex ? "is-active" : undefined}
              onClick={() => openLightbox(index)}
              aria-current={index === selectedIndex ? "true" : undefined}
              aria-label={`Abrir foto ${index + 1} de ${total}`}
            >
              <GalleryVisual
                src={image.url}
                alt={`Imagem ${index + 1} do imóvel ${propertyTitle}`}
                sizes="210px"
              />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxImage ? (
        <div
          className="property-gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${lightboxPosition + 1} de ${total} do imóvel ${propertyTitle}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxIndex(null);
          }}
        >
          <button
            className="property-gallery-lightbox-close"
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Fechar galeria"
          >
            <X size={24} strokeWidth={2.4} aria-hidden="true" />
          </button>

          {total > 1 ? (
            <button
              className="property-gallery-lightbox-arrow prev"
              type="button"
              onClick={() => moveLightbox(-1)}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={30} strokeWidth={2.2} aria-hidden="true" />
            </button>
          ) : null}

          <figure className="property-gallery-lightbox-figure">
            <GalleryVisual
              src={lightboxImage.url}
              alt={`Foto ampliada do imóvel ${propertyTitle}`}
              sizes="100vw"
              priority
              objectFit="contain"
            />
            <figcaption>
              <span>{propertyTitle}</span>
              <small>
                {(lightboxIndex ?? 0) + 1} / {total}
              </small>
            </figcaption>
          </figure>

          {total > 1 ? (
            <button
              className="property-gallery-lightbox-arrow next"
              type="button"
              onClick={() => moveLightbox(1)}
              aria-label="Próxima foto"
            >
              <ChevronRight size={30} strokeWidth={2.2} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
