"use client";

import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { TEMPLATE_VARIABLES, type WhatsappTemplate, type WhatsappTemplateCategory } from "@/lib/crm/whatsapp-templates";

type FormState = {
  id?: string;
  name: string;
  hint: string;
  body: string;
  category: WhatsappTemplateCategory;
  sortOrder: string;
};

const emptyForm: FormState = { name: "", hint: "", body: "", category: "NORMAL", sortOrder: "100" };

function formFromTemplate(template: WhatsappTemplate): FormState {
  return { id: template.id, name: template.name, hint: template.hint ?? "", body: template.body, category: template.category, sortOrder: String(template.sortOrder) };
}

function categoryLabel(category: WhatsappTemplateCategory) {
  return category === "AUCTION" ? "Leilão" : "Normal";
}

export function WhatsappTemplateManager({ initialTemplates }: { initialTemplates: WhatsappTemplate[] }) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [templates, setTemplates] = useState(initialTemplates);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function insertVariable(token: string) {
    const textarea = textareaRef.current;
    const value = `{{${token}}}`;
    if (!textarea) {
      update("body", `${form.body}${value}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = `${form.body.slice(0, start)}${value}${form.body.slice(end)}`;
    update("body", next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + value.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch(form.id ? `/api/crm/whatsapp-templates/${form.id}` : "/api/crm/whatsapp-templates", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), hint: form.hint.trim() || null, body: form.body.trim(), category: form.category, sortOrder: Number(form.sortOrder) || 0 })
      });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) throw new Error(json?.error?.message ?? "Não foi possível salvar o template.");
      const saved = json.data?.template as WhatsappTemplate;
      setTemplates((current) => current.some((item) => item.id === saved.id) ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
      setForm(emptyForm);
      setFeedback("Template salvo.");
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível salvar o template.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(template: WhatsappTemplate) {
    if (!window.confirm(`Excluir definitivamente o template "${template.name}"?`)) return;
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch(`/api/crm/whatsapp-templates/${template.id}`, { method: "DELETE" });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) throw new Error(json?.error?.message ?? "Não foi possível excluir o template.");
      setTemplates((current) => current.filter((item) => item.id !== template.id));
      if (form.id === template.id) setForm(emptyForm);
      setFeedback("Template excluído.");
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível excluir o template.");
    } finally {
      setSaving(false);
    }
  }

  const grouped = {
    NORMAL: templates.filter((template) => template.category === "NORMAL").sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    AUCTION: templates.filter((template) => template.category === "AUCTION").sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
  };

  return (
    <div className="crm-template-manager">
      <form className="crm-template-editor card" onSubmit={save}>
        <header className="crm-template-editor__head">
          <div><p className="crm-eyebrow">Biblioteca de mensagens</p><h2>{form.id ? "Editar template" : "Novo template"}</h2><p>Use os botões de variáveis para personalizar a mensagem automaticamente.</p></div>
          {form.id ? <button type="button" className="button button-ghost" onClick={() => setForm(emptyForm)}><X size={15} aria-hidden="true" /> Cancelar edição</button> : null}
        </header>
        <div className="crm-template-editor__grid">
          <label>Nome<input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Ex.: Retorno após proposta" required /></label>
          <label>Categoria<select value={form.category} onChange={(event) => update("category", event.target.value as WhatsappTemplateCategory)}><option value="NORMAL">Normal</option><option value="AUCTION">Leilão</option></select></label>
          <label>Descrição curta<input value={form.hint} onChange={(event) => update("hint", event.target.value)} placeholder="Quando usar esta mensagem" /></label>
          <label>Ordem<input type="number" min="0" value={form.sortOrder} onChange={(event) => update("sortOrder", event.target.value)} /></label>
        </div>
        <label>Mensagem<textarea ref={textareaRef} value={form.body} onChange={(event) => update("body", event.target.value)} rows={7} placeholder="Escreva a mensagem e insira variáveis abaixo." required /></label>
        <div className="crm-template-variables"><span>Inserir variável:</span>{TEMPLATE_VARIABLES.map((variable) => <button type="button" key={variable.token} className="crm-template-variable" onClick={() => insertVariable(variable.token)}>{variable.label}</button>)}</div>
        <footer className="crm-template-editor__footer"><button type="submit" className="button button-primary" disabled={saving}>{form.id ? <Save size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}{saving ? "Salvando…" : form.id ? "Salvar alterações" : "Criar template"}</button>{feedback ? <span role="status">{feedback}</span> : null}</footer>
      </form>

      <div className="crm-template-lists">
        {(["NORMAL", "AUCTION"] as const).map((category) => <section className="card crm-template-list" key={category}><header><div><p className="crm-eyebrow">Categoria</p><h2>{categoryLabel(category)}</h2></div><span className="badge">{grouped[category].length} modelo{grouped[category].length === 1 ? "" : "s"}</span></header>{grouped[category].length ? <ul>{grouped[category].map((template) => <li key={template.id}><div><strong>{template.name}</strong><span>{template.hint || "Sem descrição"}</span><small>{template.body.slice(0, 120)}{template.body.length > 120 ? "…" : ""}</small></div><div className="crm-template-list__actions"><button type="button" className="button button-ghost" onClick={() => setForm(formFromTemplate(template))}><Pencil size={14} aria-hidden="true" /> Editar</button><button type="button" className="button button-ghost is-danger" onClick={() => void remove(template)} disabled={saving}><Trash2 size={14} aria-hidden="true" /> Excluir</button></div></li>)}</ul> : <p className="crm-panel__empty">Nenhum template nesta categoria.</p>}</section>)}
      </div>
    </div>
  );
}
