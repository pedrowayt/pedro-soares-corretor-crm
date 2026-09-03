"use client";

import { useState } from "react";
import { PROPERTY_TYPE_OPTIONS } from "@/lib/property-types";

type FormStatus = {
  type: "idle" | "success" | "error";
  message?: string;
};

async function postJson(url: string, data: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(payload?.error?.message ?? "Falha ao enviar formulário.");
  }
  return payload;
}

export function PropertyInterestForm({
  propertySlug,
  embedded = false
}: {
  propertySlug: string;
  embedded?: boolean;
}) {
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const statusColor = embedded
    ? status.type === "success"
      ? "#0a7a56"
      : "#c92a2a"
    : status.type === "success"
      ? "#8df0b9"
      : "#ffb3ad";

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
          await postJson("/api/public/leads/property-interest", {
            name: formData.get("name"),
            whatsapp: formData.get("whatsapp"),
            email: formData.get("email"),
            message: formData.get("message"),
            propertySlug,
            sourcePage: window.location.pathname,
            lgpdConsent: true
          });
          setStatus({ type: "success", message: "Recebemos seu interesse. Retorno em breve." });
          event.currentTarget.reset();
        } catch (error) {
          setStatus({
            type: "error",
            message: error instanceof Error ? error.message : "Erro ao enviar."
          });
        }
      }}
      className={embedded ? "property-contact-form" : "card"}
      style={embedded ? undefined : { padding: 16 }}
    >
      <h3 style={{ marginTop: 0 }}>Tenho interesse neste imóvel</h3>
      <div className="form-grid">
        <div>
          <label htmlFor="property-name">Nome</label>
          <input id="property-name" name="name" required />
        </div>
        <div>
          <label htmlFor="property-whatsapp">WhatsApp</label>
          <input id="property-whatsapp" name="whatsapp" required />
        </div>
        <div>
          <label htmlFor="property-email">E-mail</label>
          <input id="property-email" name="email" type="email" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="property-message">Mensagem</label>
          <textarea id="property-message" name="message" placeholder="Quero agendar visita." />
        </div>
      </div>
      <button className="button button-primary" type="submit" style={{ marginTop: 12 }}>
        Enviar Interesse
      </button>
      {status.type !== "idle" ? (
        <p style={{ marginTop: 10, color: statusColor }}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}

export function SellerCaptureForm() {
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  return (
    <form
      className="card"
      style={{ padding: 16 }}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        try {
          await postJson("/api/public/leads/seller-capture", {
            name: formData.get("name"),
            whatsapp: formData.get("whatsapp"),
            propertyType: formData.get("propertyType"),
            district: formData.get("district"),
            city: formData.get("city"),
            askingPrice: Number(formData.get("askingPrice")),
            statusDescription: formData.get("statusDescription"),
            photos: [],
            sourcePage: window.location.pathname,
            lgpdConsent: true
          });
          setStatus({ type: "success", message: "Cadastro recebido. Vamos avaliar seu imóvel." });
          event.currentTarget.reset();
        } catch (error) {
          setStatus({
            type: "error",
            message: error instanceof Error ? error.message : "Erro ao enviar."
          });
        }
      }}
    >
      <h3 style={{ marginTop: 0 }}>Cadastre seu imóvel</h3>
      <div className="form-grid">
        <div>
          <label htmlFor="seller-name">Nome</label>
          <input id="seller-name" name="name" required />
        </div>
        <div>
          <label htmlFor="seller-whatsapp">WhatsApp</label>
          <input id="seller-whatsapp" name="whatsapp" required />
        </div>
        <div>
          <label htmlFor="seller-property-type">Tipo de imóvel</label>
          <select id="seller-property-type" name="propertyType" required>
            {PROPERTY_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="seller-district">Bairro</label>
          <input id="seller-district" name="district" required />
        </div>
        <div>
          <label htmlFor="seller-city">Cidade</label>
          <input id="seller-city" name="city" defaultValue="Palmas" />
        </div>
        <div>
          <label htmlFor="seller-price">Valor pretendido</label>
          <input id="seller-price" name="askingPrice" type="number" min={0} required />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="seller-status">Situação do imóvel</label>
          <textarea id="seller-status" name="statusDescription" placeholder="Documentação, ocupação, urgência etc." />
        </div>
      </div>
      <button type="submit" className="button button-primary" style={{ marginTop: 12 }}>
        Solicitar avaliação
      </button>
      {status.type !== "idle" ? (
        <p style={{ marginTop: 10, color: status.type === "success" ? "#8df0b9" : "#ffb3ad" }}>{status.message}</p>
      ) : null}
    </form>
  );
}
