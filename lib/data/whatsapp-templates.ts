import { DEFAULT_WHATSAPP_TEMPLATES, type WhatsappTemplate, type WhatsappTemplateCategory } from "@/lib/crm/whatsapp-templates";
import { prisma } from "@/lib/prisma";

export async function listWhatsappTemplates(): Promise<WhatsappTemplate[]> {
  if (!process.env.DATABASE_URL) return [...DEFAULT_WHATSAPP_TEMPLATES];
  try {
    const templates = await prisma.whatsappTemplate.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }] });
    return templates;
  } catch {
    return [...DEFAULT_WHATSAPP_TEMPLATES];
  }
}

export function templateCategoryLabel(category: WhatsappTemplateCategory) {
  return category === "AUCTION" ? "Leilão" : "Normal";
}
