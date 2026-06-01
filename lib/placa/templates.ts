/**
 * Sign ("placa") template metadata. Sizes are in millimetres and converted to
 * PostScript points (1pt = 1/72 inch) for @react-pdf/renderer.
 */

export type PlacaSize = "residencial" | "terreno" | "premium";

export const PLACA_SIZES: Record<PlacaSize, { label: string; widthMm: number; heightMm: number }> = {
  residencial: { label: "Residencial 60×40 cm", widthMm: 600, heightMm: 400 },
  terreno: { label: "Terreno 100×70 cm", widthMm: 1000, heightMm: 700 },
  premium: { label: "Premium 120×90 cm", widthMm: 1200, heightMm: 900 }
};

export function mmToPt(mm: number) {
  return (mm / 25.4) * 72;
}

export function isPlacaSize(value: string | null | undefined): value is PlacaSize {
  return value === "residencial" || value === "terreno" || value === "premium";
}

export function purposeToCTA(purpose: string): string {
  switch (purpose) {
    case "LOCACAO":
      return "ALUGUE";
    case "LEILAO":
      return "ARREMATE";
    case "LANCAMENTO":
      return "INVISTA";
    case "INVESTIMENTO":
      return "INVISTA";
    case "VENDA":
    default:
      return "COMPRE";
  }
}

const LAND_TYPES = new Set(["LOTE", "LOTE_EM_CONDOMINIO", "RURAL", "FAZENDA", "CHACARA", "CHACARA_EM_CONDOMINIO"]);

export function typeToDefaultSize(propertyType: string): PlacaSize {
  if (LAND_TYPES.has(propertyType)) return "terreno";
  return "residencial";
}
