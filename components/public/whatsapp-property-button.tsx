"use client";

import { useState } from "react";

type Props = {
  propertyId?: string;
  propertySlug?: string;
  message: string;
  className?: string;
  label?: string;
};

export function WhatsAppPropertyButton({
  propertyId,
  propertySlug,
  message,
  className = "button button-whatsapp",
  label = "Chamar no WhatsApp"
}: Props) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      await fetch("/api/public/whatsapp-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          propertyId,
          propertySlug,
          messageTemplate: message,
          sourcePage: window.location.pathname
        })
      });
    } finally {
      window.location.href = `https://wa.me/5563984845101?text=${encodeURIComponent(message)}`;
    }
  }

  return (
    <button className={className} type="button" onClick={handleClick} disabled={busy}>
      {busy ? "Abrindo..." : label}
    </button>
  );
}
