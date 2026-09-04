import { QuickTaskForm } from "@/components/crm/quick-forms";
import { TaskList, type TaskListItem } from "@/components/crm/task-list";
import { listTasks } from "@/lib/data/crm";

export default async function CrmTarefasPage() {
  const tasks = await listTasks();
  const taskItems: TaskListItem[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueAt: task.dueAt?.toISOString() ?? null,
    lead: task.lead ? { id: task.lead.id, name: task.lead.name } : null
  }));

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Tarefas</h1>
      <p className="section-subtitle">Lembretes e follow-up para garantir ritmo de negociação.</p>

      <div id="quick-create" className="crm-quick-form-target" style={{ marginTop: 16, marginBottom: 18 }}>
        <QuickTaskForm />
      </div>

      <TaskList initialTasks={taskItems} />
    </>
  );
}
