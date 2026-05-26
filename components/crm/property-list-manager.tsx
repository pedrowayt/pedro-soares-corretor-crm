"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PropertyStatusActions } from "@/components/crm/property-status-actions";
import { PropertyWizard } from "@/components/crm/property-wizard";
import { formatCurrencyBRL } from "@/lib/utils";

export type PropertyListItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  purpose: string;
  type: string;
  price: number;
  city: string;
  district: string;
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  ownerName: string | null;
  ownerPhone: string | null;
  thumbnailUrl: string | null;
};

function buildWhatsappLink(phone: string, propertyTitle: string) {
  const digits = phone.replace(/\D/g, "");
  const text = encodeURIComponent(
    `Olá! Sou o corretor responsável pelo imóvel "${propertyTitle}" e gostaria de falar com você.`
  );
  return `https://wa.me/${digits}?text=${text}`;
}

const PURPOSE_LABELS: Record<string, string> = {
  VENDA: "Venda",
  LOCACAO: "Locação",
  INVESTIMENTO: "Investimento",
  LEILAO: "Leilão",
  LANCAMENTO: "Lançamento"
};

const TYPE_LABELS: Record<string, string> = {
  CASA: "Casa",
  APARTAMENTO: "Apartamento",
  LOTE: "Lote",
  COMERCIAL: "Comercial",
  RURAL: "Rural"
};

function formatSpecs(property: PropertyListItem) {
  const specs = [
    property.bedrooms !== null ? `${property.bedrooms} qtos` : null,
    property.suites !== null ? `${property.suites} suítes` : null,
    property.bathrooms !== null ? `${property.bathrooms} banh.` : null,
    property.parkingSpaces !== null ? `${property.parkingSpaces} vagas` : null
  ].filter(Boolean);

  return specs.length ? specs.join(" • ") : "Sem métricas";
}

export function PropertyListManager({ properties }: { properties: PropertyListItem[] }) {
  const router = useRouter();
  const [showWizard, setShowWizard] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const wizardRef = useRef<HTMLDivElement | null>(null);

  function openWizard() {
    setShowWizard(true);
    window.requestAnimationFrame(() => {
      wizardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function handleResponse(response: Response) {
    if (response.status === 401) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.assign(`/admin/login?next=${next}`);
      throw new Error("Sessão expirada. Redirecionando para o login...");
    }
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.success) {
      throw new Error(data?.error?.message ?? "Falha na operação.");
    }
    return data;
  }

  async function unpublishProperty(property: PropertyListItem) {
    if (property.status === "EM_ANALISE") {
      setActionError("Imóvel já está oculto do site.");
      return;
    }
    if (!window.confirm(`Tirar "${property.title}" da página pública? O imóvel continua no CRM como "Em análise".`)) return;

    setActionError(null);
    setPendingId(property.id);
    try {
      const response = await fetch(`/api/crm/properties/${property.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "EM_ANALISE" })
      });
      await handleResponse(response);
      router.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Erro ao ocultar imóvel.");
    } finally {
      setPendingId(null);
    }
  }

  async function deleteProperty(property: PropertyListItem) {
    if (!window.confirm(`Excluir definitivamente "${property.title}"? Esta ação não pode ser desfeita.`)) return;

    setActionError(null);
    setPendingId(property.id);
    try {
      const response = await fetch(`/api/crm/properties/${property.id}`, {
        method: "DELETE"
      });
      await handleResponse(response);
      router.refresh();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Erro ao excluir imóvel.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="crm-property-manager">
      <div className="crm-property-manager__head">
        <div>
          <h1 className="section-title" style={{ marginTop: 0 }}>Imóveis</h1>
          <p className="section-subtitle">Gestão de carteira, status comercial e avaliação mercadológica simplificada.</p>
        </div>
        <button type="button" className="button button-primary" onClick={openWizard}>
          Adicionar imóvel
        </button>
      </div>

      {showWizard ? (
        <section ref={wizardRef} className="crm-property-manager__wizard" aria-label="Adicionar imóvel">
          <div className="crm-property-manager__wizard-head">
            <div>
              <h2 className="title-luxury">Novo imóvel</h2>
              <p className="section-subtitle">Preencha em etapas e salve um rascunho antes de adicionar fotos.</p>
            </div>
            <button type="button" className="button button-ghost" onClick={() => setShowWizard(false)}>
              Fechar
            </button>
          </div>
          <PropertyWizard mode="create" />
        </section>
      ) : null}

      <section className="crm-property-list" aria-label="Lista de imóveis">
        <div className="crm-property-list__toolbar">
          <strong>{properties.length} {properties.length === 1 ? "imóvel" : "imóveis"}</strong>
          <span>Ordenados pelos mais recentes</span>
        </div>

        {actionError ? (
          <p className="crm-property-list__error" role="alert">{actionError}</p>
        ) : null}

        {properties.length ? (
          <div className="crm-property-table-wrap">
            <table className="crm-property-table">
              <thead>
                <tr>
                  <th>Imóvel</th>
                  <th>Localização</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td>
                      <div className="crm-property-row-main">
                        <div
                          className={`crm-property-thumb ${property.thumbnailUrl ? "" : "is-empty"}`}
                          style={
                            property.thumbnailUrl
                              ? { backgroundImage: `url(${property.thumbnailUrl})` }
                              : undefined
                          }
                          aria-hidden="true"
                        >
                          {!property.thumbnailUrl ? <span>Sem foto</span> : null}
                        </div>
                        <div className="crm-property-row-copy">
                          <Link href={`/crm/imoveis/${property.id}`} className="crm-property-title">
                            {property.title}
                          </Link>
                          <span className="crm-property-meta">
                            {TYPE_LABELS[property.type] ?? property.type} • {PURPOSE_LABELS[property.purpose] ?? property.purpose}
                          </span>
                          <span className="crm-property-meta">{formatSpecs(property)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="crm-property-location">{property.city}</span>
                      <span className="crm-property-meta">{property.district}</span>
                      <span className="crm-property-meta">
                        Proprietário: {property.ownerName ?? "Não vinculado"}
                      </span>
                      {property.ownerPhone ? (
                        <a
                          className="crm-property-owner-whatsapp"
                          href={buildWhatsappLink(property.ownerPhone, property.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Falar com ${property.ownerName ?? "proprietário"} no WhatsApp`}
                        >
                          <span aria-hidden="true">💬</span> {property.ownerPhone}
                        </a>
                      ) : null}
                    </td>
                    <td>
                      <strong className="crm-property-price">{formatCurrencyBRL(property.price)}</strong>
                    </td>
                    <td>
                      <PropertyStatusActions
                        propertyId={property.id}
                        currentStatus={property.status}
                        compact
                      />
                    </td>
                    <td>
                      <div className="crm-property-actions">
                        <Link className="button button-primary" href={`/crm/imoveis/${property.id}`}>
                          Editar
                        </Link>
                        <Link className="button button-ghost" href={`/imoveis/${property.slug}`} target="_blank">
                          Ver no site
                        </Link>
                        <button
                          type="button"
                          className="button button-ghost"
                          onClick={() => unpublishProperty(property)}
                          disabled={pendingId === property.id}
                        >
                          Tirar da página
                        </button>
                        <button
                          type="button"
                          className="button button-ghost crm-property-actions__delete"
                          onClick={() => deleteProperty(property)}
                          disabled={pendingId === property.id}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="crm-property-empty">
            <p>Nenhum imóvel cadastrado ainda.</p>
            <button type="button" className="button button-primary" onClick={openWizard}>
              Adicionar primeiro imóvel
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
