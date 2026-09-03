"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

const whatsappMessage = "Olá, Pedro. Quero conhecer o Palmas Lake e receber mais informações.";

export function PalmasLakeWhatsAppBubble() {
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  function trackClick() {
    void fetch("/api/public/whatsapp-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        developmentSlug: "palmas-lake",
        messageTemplate: whatsappMessage,
        sourcePage: window.location.pathname,
        context: "development"
      })
    }).catch(() => undefined);
  }

  return (
    <a className="palmas-lake-whatsapp-float" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={trackClick} aria-label="Falar com Pedro Soares pelo WhatsApp">
      <span className="palmas-lake-whatsapp-avatar"><Image src="/brand/pedro-whatsapp-avatar.png" alt="" fill sizes="54px" /></span>
      <span className="palmas-lake-whatsapp-copy"><strong>Fale comigo</strong><small>WhatsApp · (63) 98484-5101</small></span>
      <MessageCircle className="palmas-lake-whatsapp-icon" size={22} />
    </a>
  );
}
