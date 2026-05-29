import { PropertyType } from "@prisma/client";

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTAMENTO: "Apartamento",
  AREA_PRIVATIVA: "Área privativa",
  CASA: "Casa",
  CASA_EM_CONDOMINIO: "Casa em condomínio",
  CASA_GEMINADA: "Casa geminada",
  CHACARA: "Chácara",
  CHACARA_EM_CONDOMINIO: "Chácara em condomínio",
  COBERTURA: "Cobertura",
  COMERCIAL: "Comercial",
  FAZENDA: "Fazenda",
  FLAT: "Flat",
  GALPAO: "Galpão",
  LOJA: "Loja",
  LOTE: "Lote",
  LOTE_EM_CONDOMINIO: "Lote em condomínio",
  PREDIO: "Prédio",
  RURAL: "Rural",
  SALA: "Sala",
  SOBRADO: "Sobrado"
};

export const PROPERTY_TYPE_ORDER: PropertyType[] = [
  "APARTAMENTO",
  "AREA_PRIVATIVA",
  "CASA",
  "CASA_EM_CONDOMINIO",
  "CASA_GEMINADA",
  "CHACARA",
  "CHACARA_EM_CONDOMINIO",
  "COBERTURA",
  "FAZENDA",
  "FLAT",
  "GALPAO",
  "LOJA",
  "LOTE",
  "LOTE_EM_CONDOMINIO",
  "PREDIO",
  "SALA",
  "SOBRADO",
  "COMERCIAL",
  "RURAL"
];

export const PROPERTY_TYPE_OPTIONS = PROPERTY_TYPE_ORDER.map((value) => ({
  value,
  label: PROPERTY_TYPE_LABELS[value]
}));
