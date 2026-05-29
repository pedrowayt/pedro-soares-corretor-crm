"use client";

import { useState } from "react";

type Props = {
  source?: string;
  variant?: "default" | "compact";
  heading?: string;
  lede?: string;
};

export function BlogNewsletterForm({ source, variant = "default", heading, lede }: Props) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(
    null
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setFeedback({ kind: "error", message: "Informe seu e-mail." });
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/blog/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: trimmed, source })
      });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) {
        const message = json?.error?.message ?? "Não foi possível inscrever agora.";
        setFeedback({ kind: "error", message });
        return;
      }
      setFeedback({
        kind: "success",
        message: json.data?.alreadySubscribed
          ? "Você já estava inscrito — obrigado!"
          : "Inscrito! Aguarde o próximo envio."
      });
      setEmail("");
    } catch {
      setFeedback({ kind: "error", message: "Erro de rede. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  }

  const fieldId = `newsletter-email-${variant}`;
  const titleId = `newsletter-title-${variant}`;
  const isCompact = variant === "compact";

  return (
    <aside
      className={`blog-newsletter${isCompact ? " blog-newsletter-compact" : ""}`}
      aria-labelledby={titleId}
    >
      <div className="blog-newsletter-copy">
        <p className="blog-newsletter-eyebrow">Boletim</p>
        <h2 id={titleId} className="blog-newsletter-title">
          {heading ?? "Receba lançamentos e leituras do mercado em Palmas"}
        </h2>
        <p className="blog-newsletter-lede">
          {lede ?? "Um e-mail semanal com bairros em alta, oportunidades e análises do Pedro. Sem spam."}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="blog-newsletter-form">
        <label htmlFor={fieldId} className="sr-only">
          E-mail
        </label>
        <input
          id={fieldId}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={submitting}
        />
        <button type="submit" className="button button-primary" disabled={submitting}>
          {submitting ? "Enviando..." : "Inscrever"}
        </button>
      </form>
      {feedback ? (
        <p
          className="blog-newsletter-feedback"
          role="status"
          style={{ color: feedback.kind === "success" ? "var(--success, #16a34a)" : "var(--danger, #b91c1c)" }}
        >
          {feedback.message}
        </p>
      ) : null}
    </aside>
  );
}
