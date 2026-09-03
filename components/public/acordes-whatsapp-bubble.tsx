import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

export function AcordesWhatsAppBubble() {
  const whatsappUrl = buildWhatsAppUrl(
    "Olá, Pedro. Tenho interesse no Acordes Tower by Tewal e gostaria de receber a apresentação."
  );

  return (
    <a
      className="acordes-whatsapp-float"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com Pedro Soares pelo WhatsApp"
    >
      <span className="acordes-whatsapp-avatar">
        <Image src="/brand/pedro-whatsapp-avatar.png" alt="" fill sizes="54px" />
      </span>
      <span className="acordes-whatsapp-copy">
        <strong>Fale comigo</strong>
        <small>WhatsApp · (63) 98484-5101</small>
      </span>
      <MessageCircle className="acordes-whatsapp-icon" size={22} />
    </a>
  );
}
