"use client";

import { SeoListingMode, SeoPageStatus } from "@prisma/client";
import { useMemo, useState } from "react";

type Status = { type: "idle" | "success" | "error"; message?: string };

type SeoPageItem = {
  id: string;
  name: string;
  path: string;
  city: string;
  district: string | null;
  listingMode: SeoListingMode;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: Array<{ question: string; answer: string }>;
  status: SeoPageStatus;
};

async function sendJson(url: string, payload: unknown, method: "POST" | "PATCH" = "POST") {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result?.error?.message ?? "Erro ao salvar página SEO.");
  }

  return result;
}

function parseKeywords(input: string) {
  return input
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function parseFaqs(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question, ...answerParts] = line.split("::");
      const answer = answerParts.join("::").trim();
      return {
        question: (question ?? "").trim(),
        answer
      };
    })
    .filter((item) => item.question.length > 3 && item.answer.length > 5);
}

function faqsToText(faqs: Array<{ question: string; answer: string }>) {
  return faqs.map((item) => `${item.question} :: ${item.answer}`).join("\n");
}

export function SeoPagesForms({ pages }: { pages: SeoPageItem[] }) {
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [selectedId, setSelectedId] = useState<string>(pages[0]?.id ?? "");

  const selectedPage = useMemo(
    () => pages.find((item) => item.id === selectedId) ?? null,
    [pages, selectedId]
  );

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <article className="card" style={{ padding: 16 }}>
        <h3 className="title-luxury" style={{ marginTop: 0 }}>
          Nova página SEO
        </h3>
        <p className="section-subtitle text-card" style={{ marginBottom: 14 }}>
          Exemplo de FAQ: `Pergunta :: Resposta` (uma por linha).
        </p>

        <form
          className="form-grid"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            try {
              await sendJson("/api/crm/seo-pages", {
                name: formData.get("name"),
                path: formData.get("path"),
                city: formData.get("city"),
                district: formData.get("district"),
                listingMode: formData.get("listingMode"),
                status: formData.get("status"),
                title: formData.get("title"),
                description: formData.get("description"),
                h1: formData.get("h1"),
                intro: formData.get("intro"),
                keywords: parseKeywords(String(formData.get("keywords") ?? "")),
                faqs: parseFaqs(String(formData.get("faqs") ?? ""))
              });

              setStatus({ type: "success", message: "Página SEO criada. Atualize a tela para ver na lista." });
              event.currentTarget.reset();
            } catch (error) {
              setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro ao criar." });
            }
          }}
        >
          <div>
            <label>Nome interno</label>
            <input name="name" required />
          </div>
          <div>
            <label>Path amigável</label>
            <input name="path" placeholder="/palmas-to/imoveis-prontos" required />
          </div>
          <div>
            <label>Cidade</label>
            <input name="city" defaultValue="Palmas" required />
          </div>
          <div>
            <label>Bairro (opcional)</label>
            <input name="district" placeholder="Plano Diretor Sul" />
          </div>
          <div>
            <label>Modo de listagem</label>
            <select name="listingMode" defaultValue={SeoListingMode.TODOS}>
              <option value={SeoListingMode.TODOS}>Todos</option>
              <option value={SeoListingMode.PRONTOS}>Imóveis prontos</option>
              <option value={SeoListingMode.LEILAO}>Imóveis leilão</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select name="status" defaultValue={SeoPageStatus.DRAFT}>
              <option value={SeoPageStatus.DRAFT}>Rascunho</option>
              <option value={SeoPageStatus.PUBLISHED}>Publicado</option>
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Título SEO</label>
            <input name="title" required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Descrição SEO</label>
            <input name="description" required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>H1</label>
            <input name="h1" required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Texto introdutório</label>
            <textarea name="intro" required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Palavras-chave (separadas por vírgula)</label>
            <input name="keywords" placeholder="imoveis em palmas, imoveis na planta palmas, ..." />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>FAQ (Pergunta :: Resposta por linha)</label>
            <textarea name="faqs" placeholder="Como agendar visita? :: Fale comigo no WhatsApp." />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="button button-primary">
              Criar página SEO
            </button>
          </div>
        </form>
      </article>

      <article className="card" style={{ padding: 16 }}>
        <h3 className="title-luxury" style={{ marginTop: 0 }}>
          Editar página SEO
        </h3>
        <div className="form-grid" style={{ marginBottom: 12 }}>
          <div>
            <label>Selecione uma página</label>
            <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name} ({page.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedPage ? (
          <form
            key={selectedPage.id}
            className="form-grid"
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              try {
                await sendJson(
                  `/api/crm/seo-pages/${selectedPage.id}`,
                  {
                    name: formData.get("name"),
                    path: formData.get("path"),
                    city: formData.get("city"),
                    district: formData.get("district"),
                    listingMode: formData.get("listingMode"),
                    status: formData.get("status"),
                    title: formData.get("title"),
                    description: formData.get("description"),
                    h1: formData.get("h1"),
                    intro: formData.get("intro"),
                    keywords: parseKeywords(String(formData.get("keywords") ?? "")),
                    faqs: parseFaqs(String(formData.get("faqs") ?? ""))
                  },
                  "PATCH"
                );
                setStatus({ type: "success", message: "Página SEO atualizada. Atualize a tela para ver os dados." });
              } catch (error) {
                setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro ao atualizar." });
              }
            }}
          >
            <div>
              <label>Nome interno</label>
              <input name="name" defaultValue={selectedPage.name} required />
            </div>
            <div>
              <label>Path amigável</label>
              <input name="path" defaultValue={selectedPage.path} required />
            </div>
            <div>
              <label>Cidade</label>
              <input name="city" defaultValue={selectedPage.city} required />
            </div>
            <div>
              <label>Bairro</label>
              <input name="district" defaultValue={selectedPage.district ?? ""} />
            </div>
            <div>
              <label>Modo de listagem</label>
              <select name="listingMode" defaultValue={selectedPage.listingMode}>
                <option value={SeoListingMode.TODOS}>Todos</option>
                <option value={SeoListingMode.PRONTOS}>Imóveis prontos</option>
                <option value={SeoListingMode.LEILAO}>Imóveis leilão</option>
              </select>
            </div>
            <div>
              <label>Status</label>
              <select name="status" defaultValue={selectedPage.status}>
                <option value={SeoPageStatus.DRAFT}>Rascunho</option>
                <option value={SeoPageStatus.PUBLISHED}>Publicado</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Título SEO</label>
              <input name="title" defaultValue={selectedPage.title} required />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Descrição SEO</label>
              <input name="description" defaultValue={selectedPage.description} required />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>H1</label>
              <input name="h1" defaultValue={selectedPage.h1} required />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Texto introdutório</label>
              <textarea name="intro" defaultValue={selectedPage.intro} required />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Palavras-chave (separadas por vírgula)</label>
              <input name="keywords" defaultValue={selectedPage.keywords.join(", ")} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>FAQ (Pergunta :: Resposta por linha)</label>
              <textarea name="faqs" defaultValue={faqsToText(selectedPage.faqs)} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <button type="submit" className="button button-primary">
                Salvar alterações
              </button>
            </div>
          </form>
        ) : null}
      </article>

      {status.type !== "idle" ? (
        <p style={{ margin: 0, color: status.type === "success" ? "#0f8f53" : "#b42318" }}>{status.message}</p>
      ) : null}
    </div>
  );
}
