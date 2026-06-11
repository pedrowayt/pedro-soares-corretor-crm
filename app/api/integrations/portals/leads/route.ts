import { InteractionChannel, InteractionType, LeadIntent, LeadSource } from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { getMarketplacePortalLabel } from "@/lib/integrations/marketplace-portals";
import { prisma } from "@/lib/prisma";
import { publicPortalLeadSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const expectedToken = process.env.PORTAL_LEAD_WEBHOOK_TOKEN;
  if (expectedToken) {
    const token =
      request.headers.get("x-portal-token") ??
      new URL(request.url).searchParams.get("token");
    if (token !== expectedToken) {
      return fail("Token de integração inválido.", 403);
    }
  }

  const body = await request.json();
  const parsed = publicPortalLeadSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Payload inválido para lead de portal.", 422, parsed.error.flatten());
  }

  const {
    portalName,
    name,
    phone,
    email,
    message,
    propertyId,
    propertySlug,
    externalLeadId,
    portalPropertyCode
  } = parsed.data;

  const portalPublication = portalPropertyCode
    ? await prisma.portalPublication.findFirst({
        where: {
          portalName,
          OR: [
            { externalId: portalPropertyCode },
            { propertyId: portalPropertyCode }
          ]
        },
        include: { property: true }
      })
    : null;

  const property = portalPublication?.property ??
    (propertyId
      ? await prisma.property.findUnique({ where: { id: propertyId } })
      : propertySlug
        ? await prisma.property.findUnique({ where: { slug: propertySlug } })
        : null);

  const portalLabel = getMarketplacePortalLabel(portalName);
  const portalNote = `Lead recebido do portal ${portalLabel}.`;
  const nextNotes = message ? `${portalNote}\n${message}` : portalNote;

  const existingLead = await prisma.lead.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" }
  });

  const lead = existingLead
    ? await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          name,
          email: email || existingLead.email,
          source: LeadSource.PORTAL,
          intent: LeadIntent.COMPRAR,
          linkedPropertyId: property?.id ?? existingLead.linkedPropertyId,
          notes: `${existingLead.notes ?? ""}\n${nextNotes}`.trim()
        }
      })
    : await prisma.lead.create({
        data: {
          name,
          phone,
          email: email || undefined,
          source: LeadSource.PORTAL,
          intent: LeadIntent.COMPRAR,
          linkedPropertyId: property?.id,
          notes: nextNotes
        }
      });

  await prisma.leadInteraction.create({
    data: {
      leadId: lead.id,
      propertyId: property?.id,
      type: InteractionType.FORM_SUBMISSION,
      channel: InteractionChannel.PORTAL,
      message: message || portalNote,
      metadata: {
        portalName,
        portalLabel,
        externalLeadId,
        portalPropertyCode,
        propertyId: property?.id ?? propertyId,
        propertySlug
      }
    }
  });

  return ok(
    {
      leadId: lead.id,
      propertyId: property?.id ?? null,
      portalName
    },
    { status: 201 }
  );
}
