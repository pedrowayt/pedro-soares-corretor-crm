const API_BASE = "https://api.cloudflare.com/client/v4";

const variants = [
  {
    id: "thumb",
    options: {
      fit: "cover",
      width: 320,
      height: 220,
      metadata: "none"
    }
  },
  {
    id: "card",
    options: {
      fit: "cover",
      width: 640,
      height: 420,
      metadata: "none"
    }
  },
  {
    id: "gallery",
    options: {
      fit: "contain",
      width: 1280,
      height: 860,
      metadata: "copyright"
    }
  },
  {
    id: "hero",
    options: {
      fit: "cover",
      width: 1920,
      height: 1080,
      metadata: "copyright"
    }
  },
  {
    id: "og",
    options: {
      fit: "cover",
      width: 1200,
      height: 630,
      metadata: "none"
    }
  }
];

async function main() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !token) {
    throw new Error("Defina CLOUDFLARE_ACCOUNT_ID e CLOUDFLARE_API_TOKEN antes de executar.");
  }

  for (const variant of variants) {
    const response = await fetch(`${API_BASE}/accounts/${accountId}/images/v1/variants`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(variant)
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.errors?.[0]?.message ?? "Falha desconhecida";
      console.error(`Erro ao criar variante ${variant.id}: ${message}`);
      continue;
    }

    console.log(`Variante criada: ${variant.id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
