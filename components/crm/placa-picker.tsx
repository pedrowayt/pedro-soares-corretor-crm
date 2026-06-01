"use client";

import { useEffect, useState } from "react";
import { PLACA_SIZES, type PlacaSize, typeToDefaultSize } from "@/lib/placa/templates";

type PickerProperty = {
  id: string;
  title: string;
  type: string;
};

type Props = {
  property: PickerProperty;
  onClose: () => void;
};

export function PlacaPicker({ property, onClose }: Props) {
  const [size, setSize] = useState<PlacaSize>(typeToDefaultSize(property.type));
  const [showPrice, setShowPrice] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleGenerate() {
    const params = new URLSearchParams({ size });
    if (showPrice) params.set("showPrice", "1");
    window.open(`/api/crm/properties/${property.id}/placa?${params.toString()}`, "_blank", "noopener");
    onClose();
  }

  return (
    <div className="placa-picker-backdrop" role="dialog" aria-modal="true" aria-label="Gerar placa em PDF">
      <div className="placa-picker">
        <header className="placa-picker__head">
          <div>
            <h2 className="placa-picker__title">Gerar placa</h2>
            <p className="placa-picker__subtitle">{property.title}</p>
          </div>
          <button type="button" className="placa-picker__close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </header>

        <fieldset className="placa-picker__group">
          <legend>Tamanho</legend>
          {(Object.keys(PLACA_SIZES) as PlacaSize[]).map((key) => (
            <label key={key} className={`placa-picker__option ${size === key ? "is-active" : ""}`}>
              <input
                type="radio"
                name="placa-size"
                value={key}
                checked={size === key}
                onChange={() => setSize(key)}
              />
              <span>{PLACA_SIZES[key].label}</span>
            </label>
          ))}
        </fieldset>

        <label className="placa-picker__toggle">
          <input type="checkbox" checked={showPrice} onChange={(event) => setShowPrice(event.target.checked)} />
          <span>Exibir preço (default: "Consulte valor")</span>
        </label>

        <footer className="placa-picker__foot">
          <button type="button" className="button button-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="button button-primary" onClick={handleGenerate}>
            Gerar PDF
          </button>
        </footer>
      </div>
    </div>
  );
}
