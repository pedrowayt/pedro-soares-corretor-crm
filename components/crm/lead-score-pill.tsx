import type { LeadScore } from "@/lib/crm/lead-scoring";

type Props = {
  score: LeadScore;
  compact?: boolean;
};

export function LeadScorePill({ score, compact }: Props) {
  return (
    <span
      className={`crm-score-pill is-${score.tier}${compact ? " is-compact" : ""}`}
      title={score.reasons.join(" · ")}
    >
      <span className="crm-score-pill__value">{score.value}</span>
      <span className="crm-score-pill__label">{score.label}</span>
    </span>
  );
}
