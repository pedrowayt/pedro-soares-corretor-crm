import { redirect } from "next/navigation";
import { AuctionImportSourcesSettings, type AuctionImportSourceSettingsItem } from "@/components/crm/auction-import-sources-settings";
import { ProfileSettingsForm } from "@/components/crm/profile-settings-form";
import { getSession } from "@/lib/auth/session";
import { listAuctionImportSources } from "@/lib/data/auction-import-sources";
import { getSiteUrl } from "@/lib/site-url";
import { prisma } from "@/lib/prisma";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  CORRETOR: "Corretor",
  PARCEIRO: "Parceiro"
};

export default async function CrmConfiguracoesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login?next=/crm/configuracoes");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      email: true,
      phone: true,
      creci: true,
      role: true,
      profilePhotoUrl: true,
      jobTitle: true,
      bio: true,
      instagramUrl: true
    }
  });

  if (!user) {
    redirect("/admin/login?next=/crm/configuracoes");
  }

  const integrationFlags = [
    { label: "Imagens", key: "CLOUDFLARE_ACCOUNT_ID", configured: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID) },
    { label: "Vídeos", key: "CLOUDFLARE_STREAM_CUSTOMER_CODE", configured: Boolean(process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE) },
    { label: "WhatsApp API", key: "WHATSAPP_PHONE_NUMBER_ID", configured: Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID) },
    { label: "Google Analytics", key: "NEXT_PUBLIC_GA_ID", configured: Boolean(process.env.NEXT_PUBLIC_GA_ID) },
    { label: "Google Tag Manager", key: "NEXT_PUBLIC_GTM_ID", configured: Boolean(process.env.NEXT_PUBLIC_GTM_ID) },
    { label: "Meta Pixel", key: "NEXT_PUBLIC_META_PIXEL_ID", configured: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID) }
  ];
  const auctionImportSources: AuctionImportSourceSettingsItem[] =
    user.role === "ADMIN"
      ? await listAuctionImportSources()
          .then((sources) =>
            sources.map((source) => ({
              id: source.id,
              name: source.name,
              sourceKey: source.sourceKey,
              tokenPreview: source.tokenPreview,
              active: source.active,
              allowedDomains: source.allowedDomains,
              notes: source.notes,
              lastImportAt: source.lastImportAt?.toISOString() ?? null,
              lastError: source.lastError,
              createdAt: source.createdAt.toISOString(),
              updatedAt: source.updatedAt.toISOString(),
              counts: source.counts
            }))
          )
          .catch(() => [])
      : [];

  return (
    <div className="crm-settings-page">
      <header className="crm-settings-page__head">
        <div>
          <h1 className="section-title" style={{ marginTop: 0 }}>Configurações</h1>
          <p className="section-subtitle">
            Perfil do usuário, foto e status das integrações da operação.
          </p>
        </div>
        <span className="crm-settings-page__role">{ROLE_LABELS[String(user.role)] ?? user.role}</span>
      </header>

      <ProfileSettingsForm
        initial={{
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
          creci: user.creci ?? "",
          role: String(user.role),
          profilePhotoUrl: user.profilePhotoUrl ?? "",
          jobTitle: user.jobTitle ?? "",
          bio: user.bio ?? "",
          instagramUrl: user.instagramUrl ?? ""
        }}
      />

      <section className="crm-settings-integrations" aria-labelledby="integrations-heading">
        <header>
          <h2 id="integrations-heading">Integrações</h2>
          <p>Checklist das variáveis necessárias para mídia, automação e mensuração.</p>
        </header>

        <div className="grid-3">
          {integrationFlags.map((item) => (
            <article key={item.key} className="card crm-settings-integration-card">
              <h3>{item.label}</h3>
              <p>Variável: {item.key}</p>
              <span className={`badge ${item.configured ? "is-success" : ""}`}>
                {item.configured ? "Configurado" : "Configurar no ambiente"}
              </span>
            </article>
          ))}
        </div>
      </section>

      {user.role === "ADMIN" ? (
        <AuctionImportSourcesSettings
          initialSources={auctionImportSources}
          importEndpoint={`${getSiteUrl()}/api/integrations/auction-imports`}
        />
      ) : (
        <section className="crm-settings-integrations" aria-labelledby="auction-sources-heading">
          <header>
            <h2 id="auction-sources-heading">Integrações de leilão</h2>
            <p>Somente administradores podem gerenciar tokens de API.</p>
          </header>
        </section>
      )}
    </div>
  );
}
