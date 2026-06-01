/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Save, Trash2, Upload } from "lucide-react";

type ProfileFormState = {
  name: string;
  email: string;
  phone: string;
  creci: string;
  role: string;
  profilePhotoUrl: string;
  jobTitle: string;
  bio: string;
  instagramUrl: string;
};

type Props = {
  initial: ProfileFormState;
};

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    ADMIN: "Admin",
    CORRETOR: "Corretor",
    PARCEIRO: "Parceiro"
  };
  return labels[role] ?? role;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PS";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

async function parseJson(response: Response) {
  return response.json().catch(() => null) as Promise<{
    success?: boolean;
    data?: Record<string, unknown>;
    error?: { message?: string };
  } | null>;
}

export function ProfileSettingsForm({ initial }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  function update<K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveProfile(nextForm = form, successMessage = "Perfil atualizado.") {
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/crm/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: nextForm.name,
          phone: nextForm.phone,
          creci: nextForm.creci,
          jobTitle: nextForm.jobTitle,
          bio: nextForm.bio,
          instagramUrl: nextForm.instagramUrl,
          profilePhotoUrl: nextForm.profilePhotoUrl
        })
      });
      const json = await parseJson(response);

      if (!response.ok || !json?.success) {
        setFeedback({ tone: "error", message: json?.error?.message ?? "Não foi possível salvar o perfil." });
        return false;
      }

      setFeedback({ tone: "success", message: successMessage });
      router.refresh();
      return true;
    } catch {
      setFeedback({ tone: "error", message: "Erro de rede ao salvar o perfil." });
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function uploadPhoto(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFeedback({ tone: "error", message: "Envie uma imagem JPG, PNG ou WEBP." });
      return;
    }

    if (file.size > MAX_PHOTO_BYTES) {
      setFeedback({ tone: "error", message: "A foto deve ter até 5 MB." });
      return;
    }

    setUploading(true);
    setFeedback(null);
    try {
      const directResponse = await fetch("/api/media/images/direct-upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ metadata: { module: "profile" } })
      });
      const directJson = await parseJson(directResponse);

      if (!directResponse.ok || !directJson?.success) {
        setFeedback({
          tone: "error",
          message: directJson?.error?.message ?? "Não foi possível iniciar o upload."
        });
        return;
      }

      const directData = directJson.data as {
        directUpload?: { uploadURL?: string };
        imageDeliveryUrl?: string | null;
      } | undefined;
      const uploadUrl = directData?.directUpload?.uploadURL;
      if (!uploadUrl) {
        setFeedback({ tone: "error", message: "URL de upload não retornada." });
        return;
      }

      const body = new FormData();
      body.append("file", file);
      const uploadResponse = await fetch(uploadUrl, { method: "POST", body });
      const uploadJson = await uploadResponse.json().catch(() => null);

      if (!uploadResponse.ok || !uploadJson?.success) {
        setFeedback({
          tone: "error",
          message: uploadJson?.errors?.[0]?.message ?? `Falha no upload (HTTP ${uploadResponse.status}).`
        });
        return;
      }

      const variants = uploadJson?.result?.variants as string[] | undefined;
      const finalUrl = directData?.imageDeliveryUrl ?? variants?.[0] ?? "";

      if (!finalUrl) {
        setFeedback({ tone: "error", message: "Upload concluído, mas a URL pública não veio." });
        return;
      }

      const nextForm = { ...form, profilePhotoUrl: finalUrl };
      setForm(nextForm);
      await saveProfile(nextForm, "Foto de perfil atualizada.");
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setFeedback({ tone: "error", message: "Erro de rede ao enviar a foto." });
    } finally {
      setUploading(false);
    }
  }

  async function removePhoto() {
    const nextForm = { ...form, profilePhotoUrl: "" };
    setForm(nextForm);
    await saveProfile(nextForm, "Foto removida.");
  }

  return (
    <section className="crm-profile-settings">
      <article className="crm-profile-settings__photo card">
        <div className="crm-profile-settings__avatar">
          {form.profilePhotoUrl ? (
            <img src={form.profilePhotoUrl} alt={`Foto de ${form.name}`} />
          ) : (
            <span>{initials(form.name)}</span>
          )}
        </div>
        <div className="crm-profile-settings__photo-copy">
          <h2>Foto do perfil</h2>
          <p>Usada no topo do CRM e no resumo do dashboard.</p>
        </div>
        <div className="crm-profile-settings__photo-actions">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadPhoto(file);
            }}
          />
          <button
            type="button"
            className="button button-primary"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || saving}
          >
            {uploading ? (
              <>
                <Upload size={16} strokeWidth={2} aria-hidden="true" /> Enviando...
              </>
            ) : (
              <>
                <Camera size={16} strokeWidth={2} aria-hidden="true" /> Enviar foto
              </>
            )}
          </button>
          {form.profilePhotoUrl ? (
            <button
              type="button"
              className="button button-ghost"
              onClick={() => void removePhoto()}
              disabled={uploading || saving}
            >
              <Trash2 size={16} strokeWidth={2} aria-hidden="true" /> Remover
            </button>
          ) : null}
        </div>
      </article>

      <form
        className="crm-profile-settings__form card"
        onSubmit={(event) => {
          event.preventDefault();
          void saveProfile();
        }}
      >
        <header>
          <h2>Dados do perfil</h2>
          <p>Essas informações aparecem na experiência interna do CRM.</p>
        </header>

        <div className="crm-profile-settings__grid">
          <label>
            Nome
            <input value={form.name} onChange={(event) => update("name", event.target.value)} required />
          </label>
          <label>
            E-mail
            <input value={form.email} disabled />
          </label>
          <label>
            WhatsApp
            <input value={form.phone} onChange={(event) => update("phone", event.target.value)} placeholder="(63) 99999-9999" />
          </label>
          <label>
            CRECI
            <input value={form.creci} onChange={(event) => update("creci", event.target.value)} placeholder="CRECI 5861-TO" />
          </label>
          <label>
            Cargo
            <input value={form.jobTitle} onChange={(event) => update("jobTitle", event.target.value)} placeholder="Corretor de imóveis" />
          </label>
          <label>
            Perfil de acesso
            <input value={roleLabel(form.role)} disabled />
          </label>
          <label className="crm-profile-settings__wide">
            Instagram
            <input value={form.instagramUrl} onChange={(event) => update("instagramUrl", event.target.value)} placeholder="https://instagram.com/seuperfil" />
          </label>
          <label className="crm-profile-settings__wide">
            Bio curta
            <textarea
              value={form.bio}
              onChange={(event) => update("bio", event.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Resumo curto para identificação interna e futuras áreas públicas."
            />
          </label>
        </div>

        <footer>
          {feedback ? (
            <p className="crm-profile-settings__feedback" data-tone={feedback.tone}>
              {feedback.message}
            </p>
          ) : (
            <p className="crm-profile-settings__hint">JPG, PNG ou WEBP até 5 MB para foto do perfil.</p>
          )}
          <button type="submit" className="button button-primary" disabled={saving || uploading}>
            <Save size={16} strokeWidth={2} aria-hidden="true" /> {saving ? "Salvando..." : "Salvar perfil"}
          </button>
        </footer>
      </form>
    </section>
  );
}
