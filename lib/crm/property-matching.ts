import type { PropertyPurpose, PropertyType } from "@prisma/client";

export type LeadCriteria = {
  desiredType?: PropertyType | null;
  desiredPurpose?: PropertyPurpose | null;
  desiredCity?: string | null;
  desiredDistrict?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
};

export type PropertyCandidate = {
  id: string;
  slug: string;
  title: string;
  city: string;
  district: string;
  type: PropertyType | string;
  purpose: PropertyPurpose | string;
  price: number | string | { toString(): string };
};

export type MatchResult<P extends PropertyCandidate = PropertyCandidate> = {
  property: P;
  score: number;
  hits: string[];
};

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function priceOf(value: PropertyCandidate["price"]): number {
  if (typeof value === "number") return value;
  return Number(value);
}

/**
 * Pontua cada imóvel candidato pelo quão bem ele encaixa nas preferências
 * do lead. Pesos:
 *  - Tipo (CASA/APTO/LOTE...) bate exato         → +30
 *  - Finalidade (VENDA/LOCACAO...) bate exato    → +20
 *  - Cidade bate (case/acento-insensitive)       → +15
 *  - Bairro bate                                 → +15
 *  - Preço dentro do range                       → +20
 *  - Preço próximo do range (até 15% fora)       → +8
 * Score final é 0-100, normalizado pelos critérios informados.
 */
export function matchPropertiesForLead<P extends PropertyCandidate>(
  lead: LeadCriteria,
  properties: ReadonlyArray<P>,
  options: { minScore?: number; limit?: number } = {}
): MatchResult<P>[] {
  const { minScore = 35, limit = 5 } = options;

  const totalWeight =
    (lead.desiredType ? 30 : 0) +
    (lead.desiredPurpose ? 20 : 0) +
    (lead.desiredCity ? 15 : 0) +
    (lead.desiredDistrict ? 15 : 0) +
    (lead.budgetMin || lead.budgetMax ? 20 : 0);

  if (!totalWeight) return [];

  const desiredCity = normalize(lead.desiredCity ?? "");
  const desiredDistrict = normalize(lead.desiredDistrict ?? "");

  const ranked: MatchResult<P>[] = [];

  for (const property of properties) {
    let score = 0;
    const hits: string[] = [];
    const propertyCity = normalize(property.city);
    const propertyDistrict = normalize(property.district);
    const propertyPrice = priceOf(property.price);

    if (lead.desiredType && property.type === lead.desiredType) {
      score += 30;
      hits.push("tipo");
    }

    if (lead.desiredPurpose && property.purpose === lead.desiredPurpose) {
      score += 20;
      hits.push("finalidade");
    }

    if (lead.desiredCity && propertyCity && propertyCity.includes(desiredCity)) {
      score += 15;
      hits.push("cidade");
    }

    if (lead.desiredDistrict && propertyDistrict && propertyDistrict.includes(desiredDistrict)) {
      score += 15;
      hits.push("bairro");
    }

    if (lead.budgetMin || lead.budgetMax) {
      const min = lead.budgetMin ? Number(lead.budgetMin) : 0;
      const max = lead.budgetMax ? Number(lead.budgetMax) : Number.POSITIVE_INFINITY;
      if (propertyPrice >= min && propertyPrice <= max) {
        score += 20;
        hits.push("preço");
      } else {
        const referenceMax = lead.budgetMax ?? min;
        if (referenceMax > 0) {
          const drift = Math.abs(propertyPrice - referenceMax) / referenceMax;
          if (drift <= 0.15) {
            score += 8;
            hits.push("preço próximo");
          }
        }
      }
    }

    const normalizedScore = Math.round((score / totalWeight) * 100);

    if (normalizedScore >= minScore) {
      ranked.push({ property, score: normalizedScore, hits });
    }
  }

  return ranked.sort((a, b) => b.score - a.score).slice(0, limit);
}
