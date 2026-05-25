"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  source: string;
  initialBackground?: "transparent" | "white";
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
};

type PointerState = {
  pointerId: number;
  startX: number;
  startY: number;
  startOffsetX: number;
  startOffsetY: number;
};

const FRAME_WIDTH = 480;
const FRAME_HEIGHT = 240;
const OUTPUT_WIDTH = 800;
const OUTPUT_HEIGHT = 400;

export function LogoCropper({ source, initialBackground = "transparent", onCancel, onConfirm }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [background, setBackground] = useState<"transparent" | "white">(initialBackground);
  const [exporting, setExporting] = useState(false);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const pointerRef = useRef<PointerState | null>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    imageRef.current = img;
    const fit = Math.min(FRAME_WIDTH / img.naturalWidth, FRAME_HEIGHT / img.naturalHeight);
    const safeFit = Number.isFinite(fit) && fit > 0 ? fit : 1;
    setBaseScale(safeFit);
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setLoaded(true);
    setLoadError(null);
  }, []);

  const handleImageError = useCallback(() => {
    setLoadError("Não foi possível carregar a imagem para edição.");
    setLoaded(false);
  }, []);

  const displayedWidth = useMemo(() => {
    if (!imageRef.current) return 0;
    return imageRef.current.naturalWidth * baseScale * scale;
  }, [baseScale, scale]);

  const displayedHeight = useMemo(() => {
    if (!imageRef.current) return 0;
    return imageRef.current.naturalHeight * baseScale * scale;
  }, [baseScale, scale]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!loaded) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = pointerRef.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    setOffset({ x: state.startOffsetX + dx, y: state.startOffsetY + dy });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerRef.current?.pointerId === event.pointerId) {
      pointerRef.current = null;
    }
  }

  function resetTransform() {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }

  async function handleConfirm() {
    const img = imageRef.current;
    if (!img) return;
    setExporting(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_WIDTH;
      canvas.height = OUTPUT_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Não foi possível preparar o canvas.");
      }

      if (background === "white") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      const effectiveScale = baseScale * scale;
      const scaleRatio = OUTPUT_WIDTH / FRAME_WIDTH;

      const drawW = img.naturalWidth * effectiveScale * scaleRatio;
      const drawH = img.naturalHeight * effectiveScale * scaleRatio;

      const cx = OUTPUT_WIDTH / 2;
      const cy = OUTPUT_HEIGHT / 2;
      const drawX = cx - drawW / 2 + offset.x * scaleRatio;
      const drawY = cy - drawH / 2 + offset.y * scaleRatio;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((result) => resolve(result), "image/png")
      );

      if (!blob) {
        throw new Error("Falha ao gerar a imagem recortada.");
      }

      onConfirm(blob);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Erro ao recortar a imagem.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="logo-cropper-backdrop" role="dialog" aria-modal="true" aria-label="Ajustar logo">
      <div className="logo-cropper-modal">
        <header className="logo-cropper-head">
          <div>
            <h3 className="title-luxury" style={{ margin: 0 }}>
              Ajustar logo
            </h3>
            <p className="text-card" style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "var(--fs-12)" }}>
              Arraste para posicionar e use o zoom. A área pontilhada é o que será salvo.
            </p>
          </div>
          <button type="button" className="button button-ghost" onClick={onCancel}>
            Fechar
          </button>
        </header>

        <div
          className="logo-cropper-stage"
          data-bg={background}
          style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={source}
            alt="Logo para recorte"
            crossOrigin="anonymous"
            onLoad={handleImageLoad}
            onError={handleImageError}
            draggable={false}
            style={{
              width: displayedWidth || undefined,
              height: displayedHeight || undefined,
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              opacity: loaded ? 1 : 0,
              pointerEvents: "none",
              userSelect: "none"
            }}
          />
          <div className="logo-cropper-frame" aria-hidden="true" />
          {!loaded && !loadError ? (
            <p className="logo-cropper-msg">Carregando imagem…</p>
          ) : null}
          {loadError ? <p className="logo-cropper-msg" data-tone="error">{loadError}</p> : null}
        </div>

        <div className="logo-cropper-controls">
          <label className="logo-cropper-slider">
            <span>Zoom</span>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.01}
              value={scale}
              onChange={(event) => setScale(Number(event.target.value))}
              disabled={!loaded}
            />
            <span className="logo-cropper-slider-value">{Math.round(scale * 100)}%</span>
          </label>

          <div className="logo-cropper-bg-toggle" role="radiogroup" aria-label="Fundo">
            <button
              type="button"
              role="radio"
              aria-checked={background === "transparent"}
              className={`button button-ghost${background === "transparent" ? " is-active" : ""}`}
              onClick={() => setBackground("transparent")}
            >
              Transparente
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={background === "white"}
              className={`button button-ghost${background === "white" ? " is-active" : ""}`}
              onClick={() => setBackground("white")}
            >
              Branco
            </button>
          </div>
        </div>

        <footer className="logo-cropper-actions">
          <button type="button" className="button button-ghost" onClick={resetTransform} disabled={!loaded}>
            Resetar
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="button button-ghost" onClick={onCancel}>
              Cancelar
            </button>
            <button
              type="button"
              className="button button-primary"
              onClick={handleConfirm}
              disabled={!loaded || exporting}
            >
              {exporting ? "Aplicando…" : "Aplicar recorte"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
