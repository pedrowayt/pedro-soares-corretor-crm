"use client";

import { useMemo, useState } from "react";

type Status = { type: "idle" | "success" | "error"; message?: string };

type DevelopmentItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
};

async function postJson(url: string, payload: unknown, method: "POST" | "PATCH" = "POST") {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": "dev-user",
      "x-user-role": "ADMIN"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data?.error?.message ?? "Falha na operação.");
  }

  return data;
}

export function DevelopmentForms({ developments }: { developments: DevelopmentItem[] }) {
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [selectedDevelopmentId, setSelectedDevelopmentId] = useState<string>(developments[0]?.id ?? "");

  const selectedDevelopment = useMemo(
    () => developments.find((item) => item.id === selectedDevelopmentId),
    [developments, selectedDevelopmentId]
  );

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <article className="card" style={{ padding: 16 }}>
        <h3 className="title-luxury" style={{ marginTop: 0 }}>Novo empreendimento</h3>
        <form
          className="form-grid"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            try {
              await postJson("/api/crm/developments", {
                title: formData.get("title"),
                slug: formData.get("slug"),
                tagline: formData.get("tagline"),
                summary: formData.get("summary"),
                description: formData.get("description"),
                district: formData.get("district"),
                city: formData.get("city"),
                neighborhood: formData.get("neighborhood"),
                developerName: formData.get("developerName"),
                builderName: formData.get("builderName"),
                stage: formData.get("stage"),
                startingPrice: Number(formData.get("startingPrice") || 0),
                areaFromM2: Number(formData.get("areaFromM2") || 0),
                areaToM2: Number(formData.get("areaToM2") || 0),
                bedroomsFrom: Number(formData.get("bedroomsFrom") || 0),
                bedroomsTo: Number(formData.get("bedroomsTo") || 0),
                parkingFrom: Number(formData.get("parkingFrom") || 0),
                parkingTo: Number(formData.get("parkingTo") || 0),
                amenities: String(formData.get("amenities") || "")
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
                differentials: String(formData.get("differentials") || "")
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
                ctaPrimaryLabel: formData.get("ctaPrimaryLabel"),
                ctaPrimaryUrl: formData.get("ctaPrimaryUrl"),
                seoTitle: formData.get("seoTitle"),
                seoDescription: formData.get("seoDescription")
              });
              setStatus({ type: "success", message: "Empreendimento criado. Atualize a página para listar." });
              event.currentTarget.reset();
            } catch (error) {
              setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro na criação." });
            }
          }}
        >
          <div>
            <label>Título</label>
            <input name="title" required />
          </div>
          <div>
            <label>Slug</label>
            <input name="slug" placeholder="acqua-design-residence" required />
          </div>
          <div>
            <label>Tagline</label>
            <input name="tagline" />
          </div>
          <div>
            <label>Resumo curto</label>
            <input name="summary" required />
          </div>
          <div>
            <label>Cidade</label>
            <input name="city" defaultValue="Palmas" required />
          </div>
          <div>
            <label>Bairro</label>
            <input name="district" required />
          </div>
          <div>
            <label>Setor/Quadra</label>
            <input name="neighborhood" />
          </div>
          <div>
            <label>Estágio</label>
            <select name="stage" defaultValue="PRE_LAUNCH">
              <option value="PRE_LAUNCH">Pré-lançamento</option>
              <option value="LAUNCH">Lançamento</option>
              <option value="SALES">Vendas</option>
              <option value="CONSTRUCTION">Obra</option>
              <option value="DELIVERED">Entregue</option>
            </select>
          </div>
          <div>
            <label>Preço inicial</label>
            <input name="startingPrice" type="number" min={0} />
          </div>
          <div>
            <label>Área inicial (m²)</label>
            <input name="areaFromM2" type="number" min={0} step="0.01" />
          </div>
          <div>
            <label>Área final (m²)</label>
            <input name="areaToM2" type="number" min={0} step="0.01" />
          </div>
          <div>
            <label>Quartos de</label>
            <input name="bedroomsFrom" type="number" min={0} />
          </div>
          <div>
            <label>Quartos até</label>
            <input name="bedroomsTo" type="number" min={0} />
          </div>
          <div>
            <label>Vagas de</label>
            <input name="parkingFrom" type="number" min={0} />
          </div>
          <div>
            <label>Vagas até</label>
            <input name="parkingTo" type="number" min={0} />
          </div>
          <div>
            <label>Incorporadora</label>
            <input name="developerName" />
          </div>
          <div>
            <label>Construtora</label>
            <input name="builderName" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Descrição completa</label>
            <textarea name="description" required />
          </div>
          <div>
            <label>Amenities (1 por linha)</label>
            <textarea name="amenities" />
          </div>
          <div>
            <label>Diferenciais (1 por linha)</label>
            <textarea name="differentials" />
          </div>
          <div>
            <label>CTA principal</label>
            <input name="ctaPrimaryLabel" placeholder="Falar com especialista" />
          </div>
          <div>
            <label>URL CTA principal</label>
            <input name="ctaPrimaryUrl" placeholder="https://wa.me/5563..." />
          </div>
          <div>
            <label>SEO title</label>
            <input name="seoTitle" />
          </div>
          <div>
            <label>SEO description</label>
            <input name="seoDescription" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button className="button button-primary" type="submit">
              Criar empreendimento
            </button>
          </div>
        </form>
      </article>

      <article className="card" style={{ padding: 16 }}>
        <h3 className="title-luxury" style={{ marginTop: 0 }}>Operações em empreendimento existente</h3>
        <div className="form-grid">
          <div>
            <label>Empreendimento</label>
            <select value={selectedDevelopmentId} onChange={(event) => setSelectedDevelopmentId(event.target.value)}>
              {developments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} ({item.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          <form
            className="form-grid"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!selectedDevelopmentId) return;
              const formData = new FormData(event.currentTarget);
              try {
                await postJson(
                  `/api/crm/developments/${selectedDevelopmentId}/status`,
                  { status: formData.get("status") },
                  "PATCH"
                );
                setStatus({ type: "success", message: "Status atualizado." });
              } catch (error) {
                setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro no status." });
              }
            }}
          >
            <div>
              <label>Status editorial</label>
              <select name="status" defaultValue={selectedDevelopment?.status ?? "DRAFT"}>
                <option value="DRAFT">Rascunho</option>
                <option value="REVIEW">Revisão</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="ARCHIVED">Arquivado</option>
              </select>
            </div>
            <div style={{ alignSelf: "end" }}>
              <button className="button button-primary" type="submit">Atualizar status</button>
            </div>
          </form>

          <form
            className="form-grid"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!selectedDevelopmentId) return;
              const formData = new FormData(event.currentTarget);
              try {
                await postJson(`/api/crm/developments/${selectedDevelopmentId}/unit-types`, {
                  name: formData.get("name"),
                  bedrooms: Number(formData.get("bedrooms") || 0),
                  suites: Number(formData.get("suites") || 0),
                  bathrooms: Number(formData.get("bathrooms") || 0),
                  parkingSpaces: Number(formData.get("parkingSpaces") || 0),
                  areaFromM2: Number(formData.get("areaFromM2") || 0),
                  areaToM2: Number(formData.get("areaToM2") || 0),
                  priceFrom: Number(formData.get("priceFrom") || 0),
                  priceTo: Number(formData.get("priceTo") || 0),
                  availableUnits: Number(formData.get("availableUnits") || 0),
                  totalUnits: Number(formData.get("totalUnits") || 0),
                  description: formData.get("description")
                });
                setStatus({ type: "success", message: "Tipologia cadastrada." });
                event.currentTarget.reset();
              } catch (error) {
                setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro tipologia." });
              }
            }}
          >
            <div><label>Tipologia</label><input name="name" required /></div>
            <div><label>Quartos</label><input name="bedrooms" type="number" min={0} /></div>
            <div><label>Suítes</label><input name="suites" type="number" min={0} /></div>
            <div><label>Banheiros</label><input name="bathrooms" type="number" min={0} /></div>
            <div><label>Vagas</label><input name="parkingSpaces" type="number" min={0} /></div>
            <div><label>Área de</label><input name="areaFromM2" type="number" step="0.01" min={0} /></div>
            <div><label>Área até</label><input name="areaToM2" type="number" step="0.01" min={0} /></div>
            <div><label>Preço de</label><input name="priceFrom" type="number" min={0} /></div>
            <div><label>Preço até</label><input name="priceTo" type="number" min={0} /></div>
            <div><label>Disponíveis</label><input name="availableUnits" type="number" min={0} /></div>
            <div><label>Total</label><input name="totalUnits" type="number" min={0} /></div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label>Descrição da tipologia</label>
              <textarea name="description" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <button className="button button-primary" type="submit">Adicionar tipologia</button>
            </div>
          </form>

          <form
            className="form-grid"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!selectedDevelopmentId) return;
              const formData = new FormData(event.currentTarget);
              try {
                await postJson(`/api/crm/developments/${selectedDevelopmentId}/media`, {
                  kind: formData.get("kind"),
                  url: formData.get("url"),
                  title: formData.get("title"),
                  position: Number(formData.get("position") || 0)
                });
                setStatus({ type: "success", message: "Mídia adicionada." });
                event.currentTarget.reset();
              } catch (error) {
                setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro mídia." });
              }
            }}
          >
            <div><label>Tipo mídia</label><select name="kind"><option value="HERO">Hero</option><option value="GALLERY">Galeria</option><option value="FLOORPLAN">Planta</option><option value="VIDEO">Vídeo</option><option value="PDF">PDF</option></select></div>
            <div><label>URL mídia</label><input name="url" required /></div>
            <div><label>Título</label><input name="title" /></div>
            <div><label>Posição</label><input name="position" type="number" min={0} /></div>
            <div style={{ gridColumn: "1 / -1" }}><button className="button button-primary" type="submit">Adicionar mídia</button></div>
          </form>

          <form
            className="form-grid"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!selectedDevelopmentId) return;
              const formData = new FormData(event.currentTarget);
              try {
                await postJson(`/api/crm/developments/${selectedDevelopmentId}/milestones`, {
                  title: formData.get("title"),
                  description: formData.get("description"),
                  status: formData.get("status"),
                  progressPct: Number(formData.get("progressPct") || 0),
                  targetDate: formData.get("targetDate")
                    ? new Date(String(formData.get("targetDate"))).toISOString()
                    : undefined
                });
                setStatus({ type: "success", message: "Marco cadastrado." });
                event.currentTarget.reset();
              } catch (error) {
                setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro marco." });
              }
            }}
          >
            <div><label>Título marco</label><input name="title" required /></div>
            <div><label>Status</label><select name="status"><option value="NOT_STARTED">Não iniciado</option><option value="IN_PROGRESS">Em andamento</option><option value="COMPLETED">Concluído</option></select></div>
            <div><label>Progresso (%)</label><input name="progressPct" type="number" min={0} max={100} /></div>
            <div><label>Data alvo</label><input name="targetDate" type="datetime-local" /></div>
            <div style={{ gridColumn: "1 / -1" }}><label>Descrição</label><textarea name="description" /></div>
            <div style={{ gridColumn: "1 / -1" }}><button className="button button-primary" type="submit">Adicionar marco</button></div>
          </form>

          <form
            className="form-grid"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!selectedDevelopmentId) return;
              const formData = new FormData(event.currentTarget);
              try {
                await postJson(`/api/crm/developments/${selectedDevelopmentId}/faqs`, {
                  question: formData.get("question"),
                  answer: formData.get("answer")
                });
                setStatus({ type: "success", message: "FAQ adicionado." });
                event.currentTarget.reset();
              } catch (error) {
                setStatus({ type: "error", message: error instanceof Error ? error.message : "Erro FAQ." });
              }
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}><label>Pergunta</label><input name="question" required /></div>
            <div style={{ gridColumn: "1 / -1" }}><label>Resposta</label><textarea name="answer" required /></div>
            <div style={{ gridColumn: "1 / -1" }}><button className="button button-primary" type="submit">Adicionar FAQ</button></div>
          </form>
        </div>
      </article>

      {status.type !== "idle" ? (
        <p style={{ margin: 0, color: status.type === "success" ? "#9fe9ba" : "#ffb3ad" }}>{status.message}</p>
      ) : null}
    </div>
  );
}
