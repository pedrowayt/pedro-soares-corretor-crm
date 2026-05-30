import { fail } from "@/lib/api/http";
import { buildPortalFeedXml } from "@/lib/integrations/portal-feed";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  try {
    const baseUrl = getSiteUrl();
    const properties = await prisma.property.findMany({
      where: {
        status: "DISPONIVEL"
      },
      include: {
        media: {
          where: { kind: "IMAGE" },
          orderBy: { position: "asc" },
          take: 1
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const xml = buildPortalFeedXml(
      baseUrl,
      properties.map((property) => ({
        ...property,
        imageUrl: property.media[0]?.url
      }))
    );

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8"
      }
    });
  } catch (error) {
    return fail(
      `Falha ao gerar feed. Verifique DATABASE_URL. ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      500
    );
  }
}
