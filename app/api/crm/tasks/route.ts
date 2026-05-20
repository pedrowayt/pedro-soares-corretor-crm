import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const { session, denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    return fail("Payload inválido para criação de tarefa.", 422, parsed.error.flatten());
  }

  const task = await prisma.task.create({
    data: {
      ...parsed.data,
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : undefined,
      assignedToId: parsed.data.assignedToId ?? session?.userId ?? undefined
    }
  });

  return ok({ task }, { status: 201 });
}
