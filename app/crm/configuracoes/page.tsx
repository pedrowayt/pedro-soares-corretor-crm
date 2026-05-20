export default function CrmConfiguracoesPage() {
  const integrationFlags = [
    { label: "Cloudflare Images", key: "CLOUDFLARE_ACCOUNT_ID" },
    { label: "Cloudflare Stream", key: "CLOUDFLARE_STREAM_CUSTOMER_CODE" },
    { label: "WhatsApp API", key: "WHATSAPP_PHONE_NUMBER_ID" },
    { label: "Google Analytics", key: "NEXT_PUBLIC_GA_ID" },
    { label: "Google Tag Manager", key: "NEXT_PUBLIC_GTM_ID" },
    { label: "Meta Pixel", key: "NEXT_PUBLIC_META_PIXEL_ID" }
  ];

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Configurações</h1>
      <p className="section-subtitle">Checklist de integrações para operação completa de marketing e CRM.</p>

      <div className="grid-3" style={{ marginTop: 16 }}>
        {integrationFlags.map((item) => (
          <article key={item.key} className="card" style={{ padding: 14 }}>
            <h3 style={{ marginTop: 0 }}>{item.label}</h3>
            <p style={{ margin: "4px 0", color: "var(--text-muted)" }}>Variável: {item.key}</p>
            <p className="badge">Configurar no ambiente</p>
          </article>
        ))}
      </div>
    </>
  );
}
