"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const photos = [
  { src: "/heritage/spa.png", alt: "Spa do Heritage Fama", title: "Um spa completo dentro de casa.", text: "Bem-estar com atmosfera intimista." },
  { src: "/heritage/gym.png", alt: "Academia do Heritage Fama", title: "Estrutura equipada com o que há de melhor.", text: "Performance, saúde e qualidade em cada detalhe." }
];

export function HeritageGallery() {
  const [selected, setSelected] = useState<(typeof photos)[number] | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <>
      <div className="heritage-gallery-grid">
        {photos.map((photo) => (
          <button type="button" className="heritage-gallery-item" key={photo.src} onClick={() => setSelected(photo)} aria-label={`Ampliar imagem: ${photo.title}`}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 88vw, 42vw" />
            <span className="heritage-gallery-expand">Ampliar</span>
            <span className="heritage-gallery-caption"><strong>{photo.title}</strong><small>{photo.text}</small></span>
          </button>
        ))}
      </div>
      {selected ? (
        <div className="heritage-lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
          <button type="button" className="heritage-lightbox-close" aria-label="Fechar imagem ampliada" onClick={() => setSelected(null)}><X size={22} /></button>
          <div className="heritage-lightbox-frame" onClick={(event) => event.stopPropagation()}>
            <Image src={selected.src} alt={selected.alt} fill sizes="90vw" />
            <p>{selected.title}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
