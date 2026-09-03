"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

export function Like210LeadForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const whatsapp = String(data.get("whatsapp") ?? "").trim();
    const interest = String(data.get("interest") ?? "").trim();
    const message = [
      `Olá, Pedro. Sou ${name} e tenho interesse no LIKE 210.`,
      `Meu WhatsApp: ${whatsapp}.`,
      interest ? `Quero conhecer: ${interest}.` : "Gostaria de receber a apresentação, plantas e condições."
    ].join(" ");

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="like210-lead-form" onSubmit={handleSubmit}>
      <div className="like210-form-fields">
        <label>
          Seu nome
          <input name="name" placeholder="Como posso chamar você?" required minLength={3} />
        </label>
        <label>
          WhatsApp
          <input name="whatsapp" placeholder="(63) 99999-9999" required minLength={10} inputMode="tel" />
        </label>
        <label className="like210-form-wide">
          O que você quer conhecer?
          <select name="interest" defaultValue="">
            <option value="">Selecione uma opção</option>
            <option value="um studio de 27,03 m²">Studio de 27,03 m²</option>
            <option value="um apartamento de 41,97 m²">Apartamento de 41,97 m²</option>
            <option value="uma oportunidade para investir">Uma oportunidade para investir</option>
            <option value="o projeto completo">O projeto completo</option>
          </select>
        </label>
      </div>
      <label className="like210-consent">
        <input type="checkbox" required />
        <span>Autorizo o contato sobre o LIKE 210 e concordo com a política de privacidade.</span>
      </label>
      <button className="like210-button like210-button--copper" type="submit">
        <MessageCircle size={17} /> Falar com um especialista <ArrowRight size={17} />
      </button>
    </form>
  );
}
