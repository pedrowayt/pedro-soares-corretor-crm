import {
  DevelopmentLeadStatus,
  InteractionChannel,
  InteractionType,
  LeadIntent,
  LeadSource,
  PropertyPurpose
} from "@prisma/client";
import { fail, ok } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const development = await prisma.development.findUnique({
    where: { slug }
  });

  if (!development || !development.tablePdfUrl) {
    return fail("Tabela não disponível para este empreendimento.", 404);
  }

  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    whatsapp?: string;
    email?: string;
    unitTypeId?: string;
    unitTypeName?: string;
  };

  const unitType = body.unitTypeId
    ? await prisma.developmentUnitType.findFirst({
        where: {
          id: body.unitTypeId,
          developmentId: development.id
        }
      })
    : null;

  let leadId: string | null = null;

  if (body.whatsapp) {
    const existingLead = await prisma.lead.findFirst({
      where: {
        phone: body.whatsapp
      },
      orderBy: { createdAt: "desc" }
    });

    const lead = existingLead
      ? await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            name: body.name ?? existingLead.name,
            email: body.email ?? existingLead.email,
            source: LeadSource.SITE,
            intent: LeadIntent.COMPRAR,
            desiredPurpose: PropertyPurpose.LANCAMENTO,
            linkedDevelopmentId: development.id,
            linkedDevelopmentUnitTypeId: unitType?.id ?? existingLead.linkedDevelopmentUnitTypeId,
            developmentLeadStatus: DevelopmentLeadStatus.RECEBEU_TABELA
          }
        })
      : await prisma.lead.create({
          data: {
            name: body.name ?? "Lead tabela empreendimento",
            phone: body.whatsapp,
            email: body.email,
            source: LeadSource.SITE,
            intent: LeadIntent.COMPRAR,
            desiredPurpose: PropertyPurpose.LANCAMENTO,
            linkedDevelopmentId: development.id,
            linkedDevelopmentUnitTypeId: unitType?.id,
            developmentLeadStatus: DevelopmentLeadStatus.RECEBEU_TABELA
          }
        });

    leadId = lead.id;

    await prisma.leadInteraction.create({
      data: {
        leadId: lead.id,
        developmentId: development.id,
        unitTypeId: unitType?.id,
        type: InteractionType.TABLE_DOWNLOAD,
        channel: InteractionChannel.SITE,
        message: "Solicitou tabela PDF",
        metadata: {
          developmentId: development.id,
          tablePdfUrl: development.tablePdfUrl,
          unitTypeId: unitType?.id,
          unitTypeName: unitType?.name ?? body.unitTypeName
        }
      }
    });
  }

  return ok({
    downloadUrl: development.tablePdfUrl,
    leadId,
    unitTypeId: unitType?.id ?? null
  });
}
