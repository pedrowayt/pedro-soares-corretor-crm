import { fail, ok } from "@/lib/api/http";
import { requireCrmWriteAccess } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validation/schemas";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { denied } = await requireCrmWriteAccess();
  if (denied) return denied;

  const { id } = await params;
  const parsed = updateTaskSchema.safeParse(await request.json());
  if (!parsed.success) return fail("Payload inválido para atualização de tarefa.", 422, parsed.error.flatten());

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return fail("Tarefa não encontrada.", 404);

  const status = parsed.data.status ?? task.status;
  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      status,
      dueAt: parsed.data.dueAt === undefined ? undefined : parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
      completedAt: status === "CONCLUIDA" ? new Date() : status === "PENDENTE" ? null : task.completedAt
    }
  });

  return ok({ task: updatedTask });
}
