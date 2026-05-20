export function PageHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta?: { label: string; href: string; className?: string };
  secondaryCta?: { label: string; href: string; className?: string };
}) {
  return (
    <section className="section">
      <div className="container">
        <p className="badge text-card">{eyebrow}</p>
        <h1 className="section-title title-luxury" style={{ marginTop: 14 }}>
          {title}
        </h1>
        <p className="section-subtitle text-card">{subtitle}</p>
        {(primaryCta || secondaryCta) && (
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            {primaryCta ? (
              <a className={`button ${primaryCta.className ?? "button-primary"}`} href={primaryCta.href}>
                {primaryCta.label}
              </a>
            ) : null}
            {secondaryCta ? (
              <a className={`button ${secondaryCta.className ?? "button-ghost"}`} href={secondaryCta.href}>
                {secondaryCta.label}
              </a>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
