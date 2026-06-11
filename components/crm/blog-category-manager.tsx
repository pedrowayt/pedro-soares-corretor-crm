"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Plus, Save } from "lucide-react";
import type { BlogCategoryView } from "@/lib/data/blog";

type Props = {
  initialCategories: BlogCategoryView[];
};

type CategoryFormState = {
  id?: string;
  label: string;
  slug: string;
  description: string;
  active: boolean;
  displayOrder: string;
  seoTitle: string;
  seoDescription: string;
};

const emptyForm: CategoryFormState = {
  label: "",
  slug: "",
  description: "",
  active: true,
  displayOrder: "0",
  seoTitle: "",
  seoDescription: ""
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

async function sendJson(endpoint: string, method: "POST" | "PATCH", payload: unknown) {
  const response = await fetch(endpoint, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.success) {
    throw new Error(json?.error?.message ?? "Não foi possível salvar a categoria.");
  }
  return json.data?.category as BlogCategoryView;
}

function formFromCategory(category: BlogCategoryView): CategoryFormState {
  return {
    id: category.id,
    label: category.label,
    slug: category.slug,
    description: category.description ?? "",
    active: category.active,
    displayOrder: String(category.displayOrder),
    seoTitle: category.seoTitle ?? "",
    seoDescription: category.seoDescription ?? ""
  };
}

export function BlogCategoryManager({ initialCategories }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(
    null
  );

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label)),
    [categories]
  );

  function updateField<K extends keyof CategoryFormState>(field: K, value: CategoryFormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
      slug: field === "label" && !current.slug ? slugify(String(value)) : current.slug
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    const payload = {
      label: form.label.trim(),
      slug: slugify(form.slug || form.label),
      description: form.description.trim() || null,
      active: form.active,
      displayOrder: Number.parseInt(form.displayOrder || "0", 10),
      seoTitle: form.seoTitle.trim() || null,
      seoDescription: form.seoDescription.trim() || null
    };

    try {
      const category = await sendJson(
        form.id ? `/api/crm/blog/categories/${form.id}` : "/api/crm/blog/categories",
        form.id ? "PATCH" : "POST",
        payload
      );
      setCategories((current) => {
        const exists = current.some((item) => item.id === category.id);
        return exists
          ? current.map((item) => (item.id === category.id ? category : item))
          : [...current, category];
      });
      setForm(emptyForm);
      setFeedback({ kind: "success", message: "Categoria salva." });
      router.refresh();
    } catch (error) {
      setFeedback({
        kind: "error",
        message: error instanceof Error ? error.message : "Não foi possível salvar."
      });
    } finally {
      setSaving(false);
    }
  }

  async function archiveCategory(category: BlogCategoryView) {
    if (!confirm(`Arquivar a categoria "${category.label}"? Os posts continuam preservados.`)) return;
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch(`/api/crm/blog/categories/${category.id}`, { method: "DELETE" });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) {
        throw new Error(json?.error?.message ?? "Não foi possível arquivar.");
      }
      const archived = json.data?.category as BlogCategoryView;
      setCategories((current) => current.map((item) => (item.id === archived.id ? archived : item)));
      setFeedback({ kind: "success", message: "Categoria arquivada." });
      router.refresh();
    } catch (error) {
      setFeedback({
        kind: "error",
        message: error instanceof Error ? error.message : "Não foi possível arquivar."
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <form onSubmit={handleSubmit} className="card" style={{ padding: 16, display: "grid", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap"
          }}
        >
          <div>
            <h2 className="section-title" style={{ margin: 0, fontSize: 22 }}>
              {form.id ? "Editar categoria" : "Nova categoria"}
            </h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Organize as notícias por tema principal e ajuste o SEO da página da categoria.
            </p>
          </div>
          <button type="submit" className="button button-primary" disabled={saving}>
            {form.id ? <Save size={16} strokeWidth={1.8} aria-hidden="true" /> : <Plus size={16} strokeWidth={1.8} aria-hidden="true" />}
            {saving ? "Salvando..." : form.id ? "Salvar" : "Criar"}
          </button>
        </div>

        <div className="grid-3">
          <label style={{ display: "grid", gap: 4 }}>
            Nome
            <input
              value={form.label}
              onChange={(event) => updateField("label", event.target.value)}
              placeholder="Mercado imobiliário"
              required
            />
          </label>
          <label style={{ display: "grid", gap: 4 }}>
            Slug
            <input
              value={form.slug}
              onChange={(event) => updateField("slug", slugify(event.target.value))}
              placeholder="mercado-imobiliario"
              required
            />
          </label>
          <label style={{ display: "grid", gap: 4 }}>
            Ordem
            <input
              type="number"
              min={0}
              value={form.displayOrder}
              onChange={(event) => updateField("displayOrder", event.target.value)}
            />
          </label>
        </div>

        <label style={{ display: "grid", gap: 4 }}>
          Descrição
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            rows={3}
            maxLength={280}
          />
        </label>

        <div className="grid-3">
          <label style={{ display: "grid", gap: 4 }}>
            Título SEO
            <input
              value={form.seoTitle}
              onChange={(event) => updateField("seoTitle", event.target.value.slice(0, 70))}
              maxLength={70}
            />
          </label>
          <label style={{ display: "grid", gap: 4, gridColumn: "span 2" }}>
            Descrição SEO
            <input
              value={form.seoDescription}
              onChange={(event) => updateField("seoDescription", event.target.value.slice(0, 180))}
              maxLength={180}
            />
          </label>
        </div>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) => updateField("active", event.target.checked)}
            style={{ width: 16, height: 16 }}
          />
          <span>Categoria ativa no blog público</span>
        </label>

        {feedback ? (
          <p
            className="text-card"
            style={{ margin: 0, color: feedback.kind === "success" ? "var(--success)" : "var(--danger)" }}
          >
            {feedback.message}
          </p>
        ) : null}
      </form>

      <section className="card" style={{ padding: 16, display: "grid", gap: 10 }}>
        <h2 className="section-title" style={{ margin: 0, fontSize: 22 }}>
          Categorias cadastradas
        </h2>
        <div style={{ display: "grid", gap: 10 }}>
          {sortedCategories.map((category) => (
            <article
              key={category.id}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: 12,
                alignItems: "center",
                padding: 12,
                border: "1px solid var(--border)",
                borderRadius: 10
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <strong>{category.label}</strong>
                  <span className="badge">{category.active ? "Ativa" : "Arquivada"}</span>
                  <span className="badge">/{category.slug}</span>
                </div>
                {category.description ? (
                  <p className="text-card" style={{ color: "var(--text-muted)", margin: "6px 0 0" }}>
                    {category.description}
                  </p>
                ) : null}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button type="button" className="button button-ghost" onClick={() => setForm(formFromCategory(category))}>
                  Editar
                </button>
                {category.active ? (
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => void archiveCategory(category)}
                    disabled={saving}
                  >
                    <Archive size={16} strokeWidth={1.8} aria-hidden="true" />
                    Arquivar
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
