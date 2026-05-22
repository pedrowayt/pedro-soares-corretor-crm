import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/crm/slug";

const prisma = new PrismaClient();

type BuilderGroup = {
  name: string;
  developmentIds: string[];
};

function normalizeBuilderName(value: string | null) {
  const trimmed = value?.trim();
  return trimmed || null;
}

async function main() {
  const developments = await prisma.development.findMany({
    where: {
      archivedAt: null,
      builderName: {
        not: null
      }
    },
    select: {
      id: true,
      builderName: true
    }
  });

  const groups = new Map<string, BuilderGroup>();

  developments.forEach((development) => {
    const name = normalizeBuilderName(development.builderName);
    if (!name) return;

    const slug = slugify(name);
    if (!slug) return;

    const existing = groups.get(slug);
    if (existing) {
      existing.developmentIds.push(development.id);
      return;
    }

    groups.set(slug, {
      name,
      developmentIds: [development.id]
    });
  });

  let createdBuilders = 0;
  let reusedBuilders = 0;
  let linkedDevelopments = 0;

  for (const [slug, group] of groups.entries()) {
    let builder = await prisma.builder.findUnique({ where: { slug } });

    if (!builder) {
      builder = await prisma.builder.create({
        data: {
          name: group.name,
          slug
        }
      });
      createdBuilders += 1;
    } else {
      reusedBuilders += 1;
    }

    const updated = await prisma.development.updateMany({
      where: {
        id: { in: group.developmentIds },
        OR: [
          { builderId: null },
          { builderId: { not: builder.id } }
        ]
      },
      data: {
        builderId: builder.id
      }
    });

    linkedDevelopments += updated.count;
  }

  console.log(
    JSON.stringify(
      {
        builderNamesFound: groups.size,
        createdBuilders,
        reusedBuilders,
        linkedDevelopments
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
