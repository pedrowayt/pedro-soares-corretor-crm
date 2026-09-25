"use client";

import { Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";

const mapPdf = "/brand/lake-village/atualizacao-2026-09/mapa-lotes-pagina-2.pdf";

export function LakeVillageLotMap() {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <div className={`lake-lot-map-block${isExpanded ? " lake-lot-map-block--expanded" : ""}`}>
      <div className="lake-lot-map-panel">
        <div className="lake-lot-map-toolbar">
          <div>
            <span className="lake-lot-map-toolbar-label">Mapa em PDF original</span>
            <small>Segunda página · implantação completa e detalhes dos lotes</small>
          </div>
          <div className="lake-lot-map-controls" aria-label="Controles do mapa">
            <a className="lake-lot-map-pdf-link" href={mapPdf} target="_blank" rel="noreferrer">
              Abrir mapa em nova aba
            </a>
            <button type="button" onClick={() => setIsExpanded((current) => !current)} aria-label={isExpanded ? "Fechar mapa ampliado" : "Ampliar mapa"}>
              {isExpanded ? <X size={17} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        <div className="lake-lot-map-viewport" role="region" aria-label="Mapa em PDF dos lotes do Lake Village">
          <iframe
            className="lake-lot-map-pdf"
            src={mapPdf}
            title="PDF original do mapa de lotes do Lake Village Residences"
            loading="lazy"
          />
        </div>

        <p className="lake-lot-map-hint">Este bloco mostra somente a segunda página do PDF, com o mapa de lotes. Use os controles de zoom do visualizador ou abra o mapa em uma nova aba para conferir uma área com mais precisão.</p>
      </div>

      <div className="lake-lot-map-copy">
        <p className="lake-kicker lake-kicker--dark">Escolha visualmente</p>
        <h3>Encontre a região do lote que combina com você.</h3>
        <p>O mapa apresenta 1.353 lotes, de 250 a 860 m², distribuídos em quatro etapas. Escolha uma quadra ou lote no PDF e informe essa referência no cadastro para eu confirmar a disponibilidade.</p>
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
