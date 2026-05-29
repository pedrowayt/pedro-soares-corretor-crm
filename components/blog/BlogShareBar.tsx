"use client";

import { useState } from "react";

type Props = {
  url: string;
  title: string;
  excerpt?: string;
  compact?: boolean;
};

export function BlogShareBar({ url, title, excerpt, compact }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedExcerpt = encodeURIComponent(excerpt ?? "");

  const targets = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "#25d366"
    },
    {
      key: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "#000000"
    },
    {
      key: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "#1877f2"
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedExcerpt}`,
      color: "#0a66c2"
    },
    {
      key: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: "#229ed9"
    }
  ];

  async function copyLink() {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: excerpt, url });
        return;
      }
    } catch {
      // fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div
      className="blog-share-bar"
      role="group"
      aria-label="Compartilhar este post"
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        flexWrap: "wrap",
        ...(compact ? { fontSize: "var(--fs-14)" } : {})
      }}
    >
      {!compact ? (
        <span style={{ color: "var(--text-muted)", fontSize: "var(--fs-14)" }}>Compartilhar:</span>
      ) : null}
      {targets.map((t) => (
        <a
          key={t.key}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="blog-share-button"
          aria-label={`Compartilhar no ${t.label}`}
          title={`Compartilhar no ${t.label}`}
          style={{ background: t.color, color: "#fff" }}
        >
          {t.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="blog-share-button blog-share-copy"
        aria-label="Copiar link"
        title="Copiar link"
      >
        {copied ? "Link copiado" : "Copiar link"}
      </button>
    </div>
  );
}
