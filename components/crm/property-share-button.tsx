"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

type Props = {
  property: {
    title: string;
    slug: string;
    city: string;
    district: string;
    price: number;
    areaM2?: number | null;
    bedrooms?: number | null;
  };
  siteUrl: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

export function PropertyShareButton({ property, siteUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const propertyUrl = `${siteUrl}/imoveis/${property.slug}`;
  const linha1 = `🏠 ${property.title}`;
  const linha2 = `📍 ${property.district}, ${property.city}`;
  const specs: string[] = [];
  if (property.areaM2) specs.push(`${property.areaM2}m²`);
  if (property.bedrooms) specs.push(`${property.bedrooms} quartos`);
  const linha3 = specs.length ? `📐 ${specs.join(" · ")}` : null;
  const linha4 = `💰 ${formatCurrency(property.price)}`;
  const linha5 = `👉 ${propertyUrl}`;

  const message = [linha1, linha2, linha3, linha4, "", linha5]
    .filter(Boolean)
    .join("\n");

  const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      window.open(waLink, "_blank", "noopener");
      return;
    }
    try {
      await navigator.share({ title: property.title, text: message, url: propertyUrl });
    } catch {
      window.open(waLink, "_blank", "noopener");
    }
  };

  return (
    <div className="crm-property-share">
      <header>
        <Share2 size={16} strokeWidth={1.75} aria-hidden="true" />
        <h3>Compartilhar este imóvel</h3>
      </header>
      <textarea readOnly value={message} rows={6} aria-label="Mensagem pronta" />
      <div className="crm-property-share__actions">
        <button type="button" className="button button-ghost" onClick={handleCopy}>
          {copied ? (
            <Check size={14} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Copy size={14} strokeWidth={1.75} aria-hidden="true" />
          )}
          {copied ? "Copiado" : "Copiar"}
        </button>
        <button type="button" className="button button-primary" onClick={handleNativeShare}>
          <Share2 size={14} strokeWidth={1.75} aria-hidden="true" /> Compartilhar
        </button>
      </div>
    </div>
  );
}
