import { useState } from "react";
import type { StudyTask } from "../types";
import { KanbanCard } from "./kanban-card";

interface KanbanColumnProps {
  title: string;
  status: "pending" | "in-progress" | "done";
  tasks: StudyTask[];
  onEdit: (task: StudyTask) => void;
  onDelete: (id: string) => void;
  onDrop: (taskId: string, newStatus: "pending" | "in-progress" | "done") => void;
}

const STATUS_DOT: Record<string, string> = {
  pending: "var(--lh-muted-2)",
  "in-progress": "var(--lh-accent)",
  done: "var(--lh-success)",
};

export function KanbanColumn({ title, status, tasks, onEdit, onDelete, onDrop }: KanbanColumnProps) {
  const [isDropZone, setIsDropZone] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZone(true);
  };

  const handleDragLeave = () => setIsDropZone(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZone(false);
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) onDrop(taskId, status);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    setDraggingId(taskId);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        background: isDropZone ? "var(--lh-accent-bg)" : "var(--lh-surface-2)",
        border: isDropZone
          ? "1.5px dashed var(--lh-accent)"
          : "1px solid var(--lh-border)",
        borderRadius: "var(--lh-r-lg)",
        padding: 12,
        minHeight: 400,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        transition: "background 0.12s, border-color 0.12s",
      }}
    >
      {/* Column header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          padding: "2px 4px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: STATUS_DOT[status],
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--lh-ink)",
            }}
          >
            {title}
          </span>
        </div>
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 500,
            color: "var(--lh-muted)",
            background: "var(--lh-surface-3)",
            border: "1px solid var(--lh-border)",
            borderRadius: 999,
            padding: "1px 8px",
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {tasks.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "24px 12px",
              color: "var(--lh-muted-2)",
              fontSize: 12,
              border: "1.5px dashed var(--lh-border-strong)",
              borderRadius: 8,
            }}
          >
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              style={{
                boxShadow: draggingId === task.id ? "none" : undefined,
              }}
            >
              <KanbanCard
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onDragStart={handleDragStart}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
