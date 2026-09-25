"use client";

import Image from "next/image";
import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const mapImage = "/brand/lake-village/atualizacao-2026-09/mapa-lotes-empreendimento.jpg";

export function LakeVillageLotMap() {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsExpanded(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  function updateScale(nextScale: number) {
    const clampedScale = Math.min(4, Math.max(1, nextScale));
    setScale(clampedScale);
    if (clampedScale === 1) setOffset({ x: 0, y: 0 });
  }

  function resetMap() {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (scale === 1) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    setOffset({
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY
    });
  }

  function stopDragging(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  }

  return (
    <div className={`lake-lot-map-block${isExpanded ? " lake-lot-map-block--expanded" : ""}`}>
      <div className="lake-lot-map-panel">
        <div className="lake-lot-map-toolbar">
          <div>
            <span className="lake-lot-map-toolbar-label">Mapa detalhado</span>
            <small>{scale === 1 ? "Visão geral" : `Zoom ${scale.toFixed(1)}x`}</small>
          </div>
          <div className="lake-lot-map-controls" aria-label="Controles do mapa">
            <button type="button" onClick={() => updateScale(scale - 0.5)} disabled={scale === 1} aria-label="Diminuir zoom"><Minus size={16} /></button>
            <button type="button" onClick={() => updateScale(scale + 0.5)} disabled={scale === 4} aria-label="Aumentar zoom"><Plus size={16} /></button>
            <button type="button" onClick={resetMap} aria-label="Restaurar mapa"><RotateCcw size={15} /></button>
            <button type="button" onClick={() => setIsExpanded((current) => !current)} aria-label={isExpanded ? "Fechar mapa ampliado" : "Ampliar mapa"}>
              {isExpanded ? <X size={17} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        <div
          className="lake-lot-map-viewport"
          onDoubleClick={() => updateScale(scale === 1 ? 2 : 1)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          role="region"
          aria-label="Mapa detalhado dos lotes do Lake Village"
        >
          <div className="lake-lot-map-canvas" style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})` }}>
            <Image
              src={mapImage}
              alt="Mapa detalhado do empreendimento Lake Village Residences com todos os lotes, vias, áreas de lazer e etapas"
              width={7654}
              height={5788}
              sizes="100vw"
              quality={100}
              unoptimized
              priority={false}
            />
          </div>
        </div>

        <p className="lake-lot-map-hint">Use os botões ou dê duplo clique para ampliar. Com zoom ativo, arraste o mapa para conferir a numeração dos lotes.</p>
      </div>

      <div className="lake-lot-map-copy">
        <p className="lake-kicker lake-kicker--dark">Escolha visualmente</p>
        <h3>Encontre a região do lote que combina com você.</h3>
        <p>O mapa apresenta 1.353 lotes, de 250 a 860 m², distribuídos em quatro etapas. Escolha uma quadra ou lote no mapa e informe essa referência no cadastro para eu confirmar a disponibilidade.</p>
        <div className="lake-lot-map-facts" aria-label="Informações do mapa">
          <span><strong>1.353</strong> lotes</span>
          <span><strong>250 a 860 m²</strong> tamanhos indicados</span>
          <span><strong>4</strong> etapas</span>
        </div>
        <a className="lake-button lake-button--deep" href="#cadastro">Quero consultar um lote</a>
      </div>
    </div>
  );
}
