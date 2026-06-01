import { QuickTaskForm } from "@/components/crm/quick-forms";
import { listTasks } from "@/lib/data/crm";

export default async function CrmTarefasPage() {
  const tasks = await listTasks();

  return (
    <>
      <h1 className="section-title" style={{ marginTop: 0 }}>Tarefas</h1>
      <p className="section-subtitle">Lembretes e follow-up para garantir ritmo de negociação.</p>

      <div id="quick-create" className="crm-quick-form-target" style={{ marginTop: 16, marginBottom: 18 }}>
        <QuickTaskForm />
      </div>

      <ul className="crm-summary-grid" aria-label="Tarefas">
        {tasks.map((task) => (
          <li className="crm-summary-card" key={task.id}>
            <header className="crm-summary-card__head">
              <strong className="crm-summary-card__title">{task.title}</strong>
              <span className="crm-summary-card__pill">{task.status}</span>
            </header>
            <dl className="crm-summary-card__fields">
              <div className="crm-summary-card__fields-wide">
                <dt>Descrição</dt>
                <dd>{task.description ?? "Sem descrição"}</dd>
              </div>
              <div className="crm-summary-card__fields-wide">
                <dt>Vencimento</dt>
                <dd>{task.dueAt ? new Date(task.dueAt).toLocaleString("pt-BR") : "—"}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
