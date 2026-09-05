"use client";

import Image from "next/image";
import { MessageCircle, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

function getWhatsappMessage(pathname: string) {
  if (pathname === "/gestao-exclusiva") {
    return "Olá, Pedro. Quero conversar sobre a Gestão Exclusiva para vender meu imóvel.";
  }
  if (pathname.startsWith("/imoveis/")) {
    return "Olá, Pedro. Vi um imóvel no seu site e quero receber mais informações.";
  }
  if (pathname.startsWith("/palmas-lake")) {
    return "Olá, Pedro. Quero conhecer o Palmas Lake e receber mais informações.";
  }
  if (pathname === "/lake-village") {
    return "Olá, Pedro. Tenho interesse no Lake Village Residences e gostaria de receber mais informações.";
  }
  if (pathname === "/acordes") {
    return "Olá, Pedro. Tenho interesse no Acordes Tower by Tewal e gostaria de receber a apresentação.";
  }
  if (pathname === "/like-210") {
    return "Olá, Pedro. Quero conhecer o LIKE 210 e receber a apresentação.";
  }
  if (pathname === "/maestria") {
    return "Olá, Pedro. Quero conhecer o Maestria Urban Design e receber a apresentação.";
  }
  if (pathname === "/comodoro") {
    return "Olá, Pedro. Quero conhecer o Comodoro by Fama e receber a apresentação.";
  }
  if (pathname === "/yacht-fama") {
    return "Olá, Pedro. Quero conhecer o Yacht by Fama e receber a apresentação.";
  }
  if (pathname === "/quinta-do-lago") {
    return "Olá, Pedro. Quero conhecer o Quinta do Lago e receber mais informações.";
  }
  if (pathname === "/heritage") {
    return "Olá, Pedro. Quero conhecer o Heritage Fama e receber a apresentação.";
  }
  return "Olá, Pedro. Quero falar sobre uma oportunidade imobiliária.";
}

export function SiteWhatsAppBubble() {
  const pathname = usePathname();
  const whatsappMessage = getWhatsappMessage(pathname);
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  function trackClick() {
    void fetch("/api/public/whatsapp-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        messageTemplate: whatsappMessage,
        sourcePage: pathname
      })
    }).catch(() => undefined);
  }

  return (
    <a
      className="site-whatsapp-bubble"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      onClick={trackClick}
      aria-label="Falar com Pedro Soares pelo WhatsApp"
    >
      <span className="site-whatsapp-bubble__halo" aria-hidden="true" />
      <span className="site-whatsapp-bubble__avatar">
        <Image src="/brand/pedro-whatsapp-avatar.png" alt="Pedro Soares" fill sizes="68px" />
      </span>
      <span className="site-whatsapp-bubble__copy">
        <small><Sparkles size={11} aria-hidden="true" /> Atendimento direto</small>
        <strong>Fale comigo</strong>
        <span>WhatsApp · (63) 98484-5101</span>
      </span>
      <span className="site-whatsapp-bubble__action" aria-hidden="true">
        <MessageCircle size={21} strokeWidth={2.2} />
      </span>
    </a>
  );
}
