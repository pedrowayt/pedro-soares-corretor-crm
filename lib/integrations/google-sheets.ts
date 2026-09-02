type LakeVillageLeadForSheet = {
  name: string;
  whatsapp: string;
  email?: string;
  interest?: string;
  groupConsent: boolean;
  submittedAt: Date;
  source: string;
};

type SheetSyncResult =
  | { status: "synced" }
  | { status: "not_configured" }
  | { status: "failed" };

export async function syncLakeVillageLeadToGoogleSheets(
  lead: LakeVillageLeadForSheet
): Promise<SheetSyncResult> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  const webhookToken = process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN?.trim();

  if (!webhookUrl || !webhookToken) {
    return { status: "not_configured" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: webhookToken,
        name: lead.name,
        whatsapp: lead.whatsapp,
        email: lead.email || "",
        interest: lead.interest || "Ainda vou decidir",
        groupConsent: lead.groupConsent ? "Sim" : "Não",
        submittedAt: lead.submittedAt.toISOString(),
        source: lead.source,
        status: "Novo"
      }),
      cache: "no-store"
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || result?.success !== true) {
      console.error("Google Sheets webhook returned a non-success response.");
      return { status: "failed" };
    }

    return { status: "synced" };
  } catch (error) {
    console.error("Google Sheets webhook request failed.", error instanceof Error ? error.message : "unknown error");
    return { status: "failed" };
  }
}
