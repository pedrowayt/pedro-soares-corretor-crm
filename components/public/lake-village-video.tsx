"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

type LakeVillageVideoProps = {
  embedUrl: string;
  sourceUrl: string;
};

export function LakeVillageVideoPopup({ embedUrl, sourceUrl }: LakeVillageVideoProps) {
  const [isOpen, setIsOpen] = useState(true);

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

  if (!isOpen) return null;

  return (
    <div
      className="lake-video-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lake-video-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <button
        type="button"
        className="lake-video-modal-close"
        onClick={() => setIsOpen(false)}
        aria-label="Fechar vídeo"
      >
        <X size={21} />
      </button>
      <div className="lake-video-modal-panel" onMouseDown={(event) => event.stopPropagation()}>
        <div className="lake-video-modal-frame">
          <iframe
            title="Vídeo de apresentação do Lake Village Residences"
            src={embedUrl}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="lake-video-modal-copy">
          <div>
            <p className="lake-video-modal-kicker">Lake Village Residences</p>
            <h2 id="lake-video-modal-title">Conheça o projeto em vídeo.</h2>
          </div>
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="lake-video-modal-drive-link">
            Abrir Reel completo
          </a>
        </div>
      </div>
    </div>
  );
}

export function LakeVillageVideoEmbed({ embedUrl }: Pick<LakeVillageVideoProps, "embedUrl">) {
  return (
    <div className="lake-video-frame">
      <iframe
        title="Vídeo de apresentação do Lake Village Residences"
        src={embedUrl}
        loading="lazy"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
