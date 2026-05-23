import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, MessageCircle } from "lucide-react";
import { listPublicBuilders } from "@/lib/data/developments";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp-links";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Construtoras em Palmas TO | Pedro Soares",
  description:
    "Conheça construtoras parceiras, histórico, regiões de atuação e empreendimentos publicados em Palmas TO.",
  alternates: {
    canonical: `${baseUrl}/construtoras`
  },
  openGraph: {
    title: "Construtoras em Palmas TO | Pedro Soares",
    description:
      "Perfis de construtoras com histórico, empreendimentos e atendimento especializado para compra ou investimento.",
    type: "website",
    url: `${baseUrl}/construtoras`
  }
};

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function formatLocation(city: string | null, state: string | null) {
  if (city && state) return `${city}, ${state}`;
  return city ?? state ?? "Atuação regional";
}

function formatCount(value: number | null | undefined, fallback = "—") {
  return typeof value === "number" ? value.toLocaleString("pt-BR") : fallback;
}

export default async function BuildersIndexPage() {
  const builders = await listPublicBuilders();
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Construtoras em Palmas TO",
    description: "Perfis de construtoras com empreendimentos publicados por Pedro Soares.",
    url: `${baseUrl}/construtoras`,
    inLanguage: "pt-BR",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: builders.map((builder, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: builder.name,
        url: `${baseUrl}/construtoras/${builder.slug}`
      }))
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="section builder-directory-hero">
        <div className="container">
          <p className="wp-hero-eyebrow" style={{ marginBottom: 12 }}>
            Pedro Soares • Construtoras
          </p>
          <h1 className="section-title" style={{ marginTop: 0 }}>
            Construtoras com empreendimentos em Palmas - TO
          </h1>
          <p className="section-subtitle text-card">
            Compare construtoras, conheça o histórico disponível no CRM e veja os empreendimentos publicados para compra ou investimento.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {builders.length ? (
            <div className="builder-directory-grid">
              {builders.map((builder) => {
                const activeProjects = builder.activeProjectsCount ?? builder.developments.length;
                const summary =
                  builder.description ||
                  `Conheça os empreendimentos publicados da ${builder.name} e fale com Pedro Soares para receber tabela e plantas.`;

                return (
                  <article key={builder.id} className="card builder-directory-card">
                    <div className="builder-directory-card-logo">
                      {builder.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={builder.logoUrl}
                          alt={`Logo da construtora ${builder.name}`}
                          className="builder-directory-card-logo-img"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="builder-directory-card-logo-fallback"
                          role="img"
                          aria-label={`Iniciais da construtora ${builder.name}`}
                        >
                          {getInitials(builder.name)}
                        </div>
                      )}
                    </div>

                    <div className="builder-directory-card-body">
                      <p className="builder-card-kicker">
                        <MapPin size={12} aria-hidden /> {formatLocation(builder.city, builder.state)}
                      </p>
                      <h2 className="title-luxury builder-card-title">{builder.name}</h2>
                      <p className="text-card builder-card-summary">{summary}</p>
                    </div>

                    <div className="builder-mini-stats">
                      <p>
                        <span>No site</span>
                        <strong>{formatCount(builder.developments.length)}</strong>
                      </p>
                      <p>
                        <span>Ativas</span>
                        <strong>{formatCount(activeProjects)}</strong>
                      </p>
                      <p>
                        <span>Entregues</span>
                        <strong>{formatCount(builder.deliveredDevelopmentsCount)}</strong>
                      </p>
                    </div>

                    <div className="builder-card-actions">
                      <Link className="button button-primary" href={`/construtoras/${builder.slug}`}>
                        Ver perfil <ArrowRight size={16} />
                      </Link>
                      <a
                        className="button button-whatsapp"
                        href={buildWhatsAppUrl(`Olá, Pedro. Quero conhecer os empreendimentos da construtora ${builder.name}.`)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp <MessageCircle size={16} />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <article className="card builder-empty-card">
              <Building2 size={24} />
              <p className="text-card">
                Nenhuma construtora ativa cadastrada no CRM no momento.
              </p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
