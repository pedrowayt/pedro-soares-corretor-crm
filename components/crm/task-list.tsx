"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type TaskListItem = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  dueAt: string | null;
  lead: { id: string; name: string } | null;
};

type Props = {
  initialTasks: TaskListItem[];
};

function taskDueLabel(value: string | null, status: string) {
  if (!value) return "—";
  const date = new Date(value);
  const label = date.toLocaleString("pt-BR", { timeZone: "America/Araguaina" });
  return status === "PENDENTE" && date.getTime() < Date.now() ? `${label} · Vencida` : label;
}

export function TaskList({ initialTasks }: Props) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(task: TaskListItem, status: "PENDENTE" | "CONCLUIDA" | "CANCELADA") {
    setPendingId(task.id);
    setError(null);
    try {
      const response = await fetch(`/api/crm/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) throw new Error(data?.error?.message ?? "Falha ao atualizar tarefa.");
      setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, status } : item)));
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha ao atualizar tarefa.");
    } finally {
      setPendingId(null);
    }
  }

  if (tasks.length === 0) return <p className="crm-panel__empty">Nenhuma tarefa cadastrada.</p>;

  return (
    <>
      {error ? <p className="crm-kanban__error" role="alert">{error}</p> : null}
      <ul className="crm-summary-grid" aria-label="Tarefas">
        {tasks.map((task) => {
          const busy = pendingId === task.id;
          return (
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
                  <dd>{taskDueLabel(task.dueAt, task.status)}</dd>
                </div>
                <div className="crm-summary-card__fields-wide">
                  <dt>Lead</dt>
                  <dd>{task.lead ? <a href={`/crm/leads/${task.lead.id}`}>{task.lead.name}</a> : "Sem lead vinculado"}</dd>
                </div>
              </dl>
              <footer style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                {task.status === "PENDENTE" ? (
                  <>
                    <button type="button" className="button button-primary" disabled={busy} onClick={() => void updateStatus(task, "CONCLUIDA")}>
                      {busy ? "Atualizando..." : "Concluir"}
                    </button>
                    <button type="button" className="button button-ghost" disabled={busy} onClick={() => void updateStatus(task, "CANCELADA")}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button type="button" className="button button-ghost" disabled={busy} onClick={() => void updateStatus(task, "PENDENTE")}>
                    Reabrir tarefa
                  </button>
                )}
              </footer>
            </li>
          );
        })}
      </ul>
    </>
  );
}
