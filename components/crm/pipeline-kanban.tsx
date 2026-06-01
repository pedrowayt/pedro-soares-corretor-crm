"use client";

import Link from "next/link";
import { useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { LeadScorePill } from "@/components/crm/lead-score-pill";
import { computeLeadScore } from "@/lib/crm/lead-scoring";
import { isValidStageTransition, PIPELINE_ORDER } from "@/lib/crm/pipeline";
import { formatCurrencyBRL } from "@/lib/utils";
import type { LeadStage } from "@prisma/client";

type KanbanLead = {
  id: string;
  name: string;
  stage: LeadStage;
  source: string;
  intent: string;
  createdAt: string;
  lastContactAt: string | null;
  linkedPropertyTitle: string | null;
  linkedPropertyPrice: number | null;
  budgetMax: number | null;
  visitsCount: number;
  proposalsCount: number;
  interactionsCount: number;
};

type Column = { stage: LeadStage; leads: KanbanLead[] };

type Props = {
  initialColumns: Column[];
};

const STAGE_LABEL: Record<LeadStage, string> = {
  NOVO: "Novo",
  PRIMEIRO_CONTATO: "Primeiro contato",
  QUALIFICADO: "Qualificado",
  OPCOES_ENVIADAS: "Opções enviadas",
  VISITA_AGENDADA: "Visita agendada",
  PROPOSTA_ENVIADA: "Proposta enviada",
  NEGOCIACAO: "Negociação",
  FECHADO: "Fechado",
  PERDIDO: "Perdido"
};

export function PipelineKanban({ initialColumns }: Props) {
  const router = useRouter();
  const [columns, setColumns] = useState(initialColumns);
  const [dragging, setDragging] = useState<{ leadId: string; from: LeadStage } | null>(null);
  const [dropTarget, setDropTarget] = useState<LeadStage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragStart = (lead: KanbanLead) => (event: DragEvent<HTMLElement>) => {
    setDragging({ leadId: lead.id, from: lead.stage });
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", lead.id);
  };

  const handleDragOver = (stage: LeadStage) => (event: DragEvent<HTMLElement>) => {
    if (!dragging) return;
    if (!isValidStageTransition(dragging.from, stage)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dropTarget !== stage) setDropTarget(stage);
  };

  const handleDragLeave = () => setDropTarget(null);

  const handleDrop = (stage: LeadStage) => async (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (!dragging) return;
    const { leadId, from } = dragging;
    setDragging(null);
    setDropTarget(null);
    if (from === stage) return;
    if (!isValidStageTransition(from, stage)) {
      setError(`Transição inválida: ${STAGE_LABEL[from]} → ${STAGE_LABEL[stage]}.`);
      window.setTimeout(() => setError(null), 2400);
      return;
    }

    const previous = columns;
    setColumns((current) =>
      current.map((column) => {
        if (column.stage === from) {
          return { ...column, leads: column.leads.filter((lead) => lead.id !== leadId) };
        }
        if (column.stage === stage) {
          const lead = current.find((col) => col.stage === from)?.leads.find((l) => l.id === leadId);
          if (!lead) return column;
          return { ...column, leads: [{ ...lead, stage }, ...column.leads] };
        }
        return column;
      })
    );

    try {
      const response = await fetch(`/api/crm/leads/${leadId}/stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toStage: stage })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.error?.message ?? "Falha ao mover lead");
      }
      router.refresh();
    } catch (err) {
      setColumns(previous);
      setError(err instanceof Error ? err.message : "Falha ao mover lead");
      window.setTimeout(() => setError(null), 3200);
    }
  };

  return (
    <div className="crm-kanban">
      {error ? <p className="crm-kanban__error" role="alert">{error}</p> : null}

      <div className="crm-kanban__board">
        {PIPELINE_ORDER.map((stage) => {
          const column = columns.find((entry) => entry.stage === stage) ?? { stage, leads: [] };
          const total = column.leads.reduce((sum, lead) => {
            const value = lead.linkedPropertyPrice ?? lead.budgetMax ?? 0;
            return sum + value;
          }, 0);
          const canDrop = dragging ? isValidStageTransition(dragging.from, stage) : true;
          const isTarget = dropTarget === stage;

          return (
            <section
              key={stage}
              className={`crm-kanban__column${isTarget ? " is-target" : ""}${
                dragging && !canDrop ? " is-disabled" : ""
              }`}
              onDragOver={handleDragOver(stage)}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop(stage)}
            >
              <header className="crm-kanban__col-head">
                <div>
                  <span className="crm-kanban__stage">{STAGE_LABEL[stage]}</span>
                  <strong className="crm-kanban__count">{column.leads.length}</strong>
                </div>
                {total > 0 ? (
                  <span className="crm-kanban__total">{formatCurrencyBRL(total)}</span>
                ) : null}
              </header>

              <div className="crm-kanban__cards">
                {column.leads.length === 0 ? (
                  <p className="crm-kanban__empty">Vazio</p>
                ) : (
                  column.leads.map((lead) => {
                    const score = computeLeadScore({
                      stage: lead.stage,
                      createdAt: lead.createdAt,
                      lastContactAt: lead.lastContactAt,
                      hasLinkedProperty: Boolean(lead.linkedPropertyTitle),
                      hasLinkedDevelopment: false,
                      visitsCount: lead.visitsCount,
                      proposalsCount: lead.proposalsCount,
                      interactionsCount: lead.interactionsCount,
                      budgetMin: null,
                      budgetMax: lead.budgetMax
                    });
                    const isDragging = dragging?.leadId === lead.id;
                    return (
                      <article
                        key={lead.id}
                        className={`crm-kanban__card${isDragging ? " is-dragging" : ""}`}
                        draggable
                        onDragStart={handleDragStart(lead)}
                        onDragEnd={() => {
                          setDragging(null);
                          setDropTarget(null);
                        }}
                      >
                        <Link href={`/crm/leads/${lead.id}`} className="crm-kanban__card-title">
                          {lead.name}
                        </Link>
                        <p className="crm-kanban__card-meta">
                          {lead.intent} · {lead.source}
                        </p>
                        {lead.linkedPropertyTitle ? (
                          <p className="crm-kanban__card-property" title={lead.linkedPropertyTitle}>
                            {lead.linkedPropertyTitle}
                          </p>
                        ) : null}
                        <footer className="crm-kanban__card-foot">
                          <LeadScorePill score={score} compact />
                          {lead.linkedPropertyPrice ? (
                            <span className="crm-kanban__card-price">
                              {formatCurrencyBRL(lead.linkedPropertyPrice)}
                            </span>
                          ) : lead.budgetMax ? (
                            <span className="crm-kanban__card-price is-soft">
                              ≤ {formatCurrencyBRL(lead.budgetMax)}
                            </span>
                          ) : null}
                        </footer>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
