"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, VolumeX } from "lucide-react";

const reels = [
  {
    id: "sky-garden-park",
    src: "/brand/palmas-lake/social/reel-01-sky-garden-park.mp4",
    label: "Sky, Garden e Park",
    detail: "Três formas de viver o mesmo horizonte.",
  },
  {
    id: "palmas-moment",
    src: "/brand/palmas-lake/social/reel-02-palmas-moment.mp4",
    label: "Um novo momento",
    detail: "Palmas vista de um novo lugar.",
  },
  {
    id: "essencia",
    src: "/brand/palmas-lake/social/reel-03-essencia-palmas-lake.mp4",
    label: "A essência do Palmas Lake",
    detail: "Arquitetura, natureza e bem-estar à beira do lago.",
  },
  {
    id: "origem",
    src: "/brand/palmas-lake/social/reel-04-origem-palmas-lake.mp4",
    label: "Um novo capítulo",
    detail: "O futuro da orla começa a ganhar forma.",
  },
] as const;

export function PalmasLakeReels() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const [trackOffset, setTrackOffset] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.35 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      video.muted = true;

      if (isInView && index === activeIndex) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeIndex, isInView]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = viewport?.querySelector<HTMLElement>(".palmas-lake-reels-track");
    const firstSlide = track?.querySelector<HTMLElement>(".palmas-lake-reels-slide");
    if (!viewport || !track || !firstSlide) return;
    const viewportElement = viewport;
    const trackElement = track;
    const firstSlideElement = firstSlide;

    function updateTrackPosition() {
      const gap = Number.parseFloat(window.getComputedStyle(trackElement).gap) || 0;
      const slideWidth = firstSlideElement.getBoundingClientRect().width;
      setTrackOffset((viewportElement.clientWidth - slideWidth) / 2 - activeIndex * (slideWidth + gap));
    }

    updateTrackPosition();
    const resizeObserver = new ResizeObserver(updateTrackPosition);
    resizeObserver.observe(viewportElement);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  useEffect(() => {
    if (!isInView || reels.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % reels.length);
    }, 8500);

    return () => window.clearInterval(timer);
  }, [isInView]);

  function goTo(index: number) {
    setActiveIndex((index + reels.length) % reels.length);
  }

  return (
    <section className="palmas-lake-reels" ref={sectionRef} aria-labelledby="palmas-lake-reels-title">
      <div className="palmas-lake-container">
        <div className="palmas-lake-reels-heading">
          <div>
            <p className="palmas-lake-kicker">Palmas Lake em movimento</p>
            <h2 id="palmas-lake-reels-title">Veja como é viver este horizonte.</h2>
          </div>
          <div className="palmas-lake-reels-heading-side">
            <p>Imagens reais do projeto, em uma experiência silenciosa e contínua para explorar no seu ritmo.</p>
            <span><VolumeX size={15} /> Reprodução automática · sem áudio</span>
          </div>
        </div>

        <div className="palmas-lake-reels-viewport" ref={viewportRef}>
          <div className="palmas-lake-reels-track" style={{ transform: `translateX(${trackOffset}px)` }}>
            {reels.map((reel, index) => (
              <article className={`palmas-lake-reels-slide${index === activeIndex ? " is-active" : ""}`} key={reel.id}>
                <div className="palmas-lake-reels-video-wrap">
                  <video
                    ref={(video) => { videoRefs.current[index] = video; }}
                    src={reel.src}
                    autoPlay={index === activeIndex}
                    muted
                    loop
                    playsInline
                    preload={index === 0 ? "auto" : "metadata"}
                    aria-label={reel.label}
                  />
                  <span className="palmas-lake-reels-muted"><VolumeX size={14} /> Sem áudio</span>
                </div>
                <div className="palmas-lake-reels-caption">
                  <span>0{index + 1}</span>
                  <div><strong>{reel.label}</strong><small>{reel.detail}</small></div>
                </div>
              </article>
            ))}
          </div>

          <button type="button" className="palmas-lake-reels-arrow palmas-lake-reels-arrow--prev" onClick={() => goTo(activeIndex - 1)} aria-label="Vídeo anterior">
            <ChevronLeft size={22} />
          </button>
          <button type="button" className="palmas-lake-reels-arrow palmas-lake-reels-arrow--next" onClick={() => goTo(activeIndex + 1)} aria-label="Próximo vídeo">
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="palmas-lake-reels-controls">
          <div className="palmas-lake-reels-dots" role="tablist" aria-label="Navegação dos vídeos">
            {reels.map((reel, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Ir para o vídeo ${index + 1}: ${reel.label}`}
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => goTo(index)}
                key={reel.id}
              />
            ))}
          </div>
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(reels.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
