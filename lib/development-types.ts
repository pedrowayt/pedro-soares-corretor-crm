import { DevelopmentPropertyType } from "@prisma/client";

export const DEVELOPMENT_PROPERTY_TYPE_LABELS: Record<DevelopmentPropertyType, string> = {
  COMPLEXO: "Complexo",
  APARTAMENTO: "Apartamento",
  CASA: "Casa",
  LOTE: "Lote",
  LOTE_EM_CONDOMINIO: "Lote em condomínio",
  SALA_COMERCIAL: "Sala comercial",
  STUDIO: "Studio",
  COBERTURA: "Cobertura"
};

export const DEVELOPMENT_PROPERTY_TYPE_OPTIONS = Object.values(DevelopmentPropertyType).map((value) => ({
  value,
  label: DEVELOPMENT_PROPERTY_TYPE_LABELS[value]
}));

export function getDevelopmentPropertyTypeLabel(value: DevelopmentPropertyType | string | null | undefined) {
  return value && value in DEVELOPMENT_PROPERTY_TYPE_LABELS
    ? DEVELOPMENT_PROPERTY_TYPE_LABELS[value as DevelopmentPropertyType]
    : "Empreendimento";
}

export function isLandDevelopment(value: DevelopmentPropertyType | string | null | undefined) {
  return value === "LOTE" || value === "LOTE_EM_CONDOMINIO";
}
