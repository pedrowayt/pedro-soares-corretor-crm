import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

export function LakeVillageWhatsAppBubble() {
  const whatsappUrl = buildWhatsAppUrl(
    "Olá, Pedro. Tenho interesse no Lake Village Residences e gostaria de receber mais informações."
  );

  return (
    <a
      className="lake-whatsapp-float"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com Pedro Soares pelo WhatsApp no número (63) 98484-5101"
    >
      <span className="lake-whatsapp-avatar">
        <Image src="/brand/pedro-whatsapp-avatar.png" alt="" fill sizes="58px" />
      </span>
      <span className="lake-whatsapp-copy">
        <strong>Fale comigo</strong>
        <small>WhatsApp · (63) 98484-5101</small>
      </span>
      <MessageCircle className="lake-whatsapp-icon" size={22} />
    </a>
  );
}
