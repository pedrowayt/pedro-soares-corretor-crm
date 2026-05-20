import { QuickTaskForm } from "@/components/crm/quick-forms";
import { listTasks } from "@/lib/data/crm";

export default async function CrmTarefasPage() {
  const tasks = await listTasks();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Tarefas</h1>
      <p className="section-subtitle">Lembretes e follow-up para garantir ritmo de negociação.</p>

      <div style={{ marginTop: 16, marginBottom: 18 }}>
        <QuickTaskForm />
      </div>

      <div className="grid-3">
        {tasks.map((task) => (
          <article className="card" key={task.id} style={{ padding: 14 }}>
            <p className="badge">{task.status}</p>
            <h3 style={{ marginBottom: 8 }}>{task.title}</h3>
            <p style={{ margin: "4px 0", color: "var(--text-muted)" }}>{task.description ?? "Sem descrição"}</p>
            <p style={{ margin: "4px 0", color: "var(--text-muted)" }}>
              Vencimento: {task.dueAt ? new Date(task.dueAt).toLocaleString("pt-BR") : "-"}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
