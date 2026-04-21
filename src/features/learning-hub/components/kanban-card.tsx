import { useState } from "react";
import { CheckIcon, CalendarIcon, PencilIcon, Trash2Icon } from "lucide-react";
import type { StudyTask, TaskPriority } from "../types";

interface KanbanCardProps {
  task: StudyTask;
  onEdit: (task: StudyTask) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

const SUBJECT_COLORS: Record<string, string> = {
  React: "var(--lh-subj-react)",
  TypeScript: "var(--lh-subj-ts)",
  "UI/UX": "var(--lh-subj-ui)",
  Testing: "var(--lh-subj-test)",
  Algorithms: "var(--lh-subj-algo)",
};

const PRIORITY_CONFIG: Record<TaskPriority, { color: string; bg: string; border: string; label: string }> = {
  high: { color: "var(--lh-p-high)", bg: "var(--lh-danger-bg)", border: "#ecc9bd", label: "High" },
  medium: { color: "var(--lh-p-med)", bg: "var(--lh-warning-bg)", border: "#ecdeb0", label: "Med" },
  low: { color: "var(--lh-p-low)", bg: "#eef0ec", border: "#d4dbd3", label: "Low" },
};

function formatDueDate(dateStr: string): { label: string; isOverdue: boolean; isToday: boolean } {
  if (!dateStr) return { label: "No due date", isOverdue: false, isToday: false };
  const todayStr = new Date().toISOString().slice(0, 10);

  if (dateStr === todayStr) return { label: "Due today", isOverdue: false, isToday: true };
  if (dateStr < todayStr) return { label: `Overdue · ${dateStr}`, isOverdue: true, isToday: false };
  return { label: `Due ${dateStr}`, isOverdue: false, isToday: false };
}

export function KanbanCard({ task, onEdit, onToggle, onDelete, onDragStart }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const subjectColor = SUBJECT_COLORS[task.subject] ?? "var(--lh-muted)";
  const priority = PRIORITY_CONFIG[task.priority];
  const due = formatDueDate(task.dueDate);

  return (
    <div
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(e, task.id);
      }}
      onDragEnd={() => setIsDragging(false)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{
        background: "var(--lh-surface)",
        border: showActions ? "1px solid var(--lh-border-strong)" : "1px solid var(--lh-border)",
        borderRadius: "var(--lh-r-md)",
        padding: 12,
        boxShadow: showActions ? "var(--lh-sh-md)" : "var(--lh-sh-sm)",
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.4 : 1,
        transition: "transform 0.1s, box-shadow 0.1s, border-color 0.12s",
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Subject + priority row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: subjectColor,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: subjectColor,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {task.subject}
          </span>
        </div>

        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: priority.color,
            background: priority.bg,
            border: `1px solid ${priority.border}`,
            borderRadius: 999,
            padding: "1px 7px",
          }}
        >
          {priority.label}
        </span>
      </div>

      {/* Title */}
      <p
        style={{
          margin: "8px 0 0",
          fontSize: 13.5,
          fontWeight: 500,
          color: task.completed ? "var(--lh-muted)" : "var(--lh-ink)",
          textDecoration: task.completed ? "line-through" : "none",
          lineHeight: 1.4,
        }}
      >
        {task.title}
      </p>

      {/* Footer */}
      <div
        style={{
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11.5,
            color: due.isOverdue
              ? "var(--lh-danger)"
              : due.isToday
              ? "var(--lh-accent-ink)"
              : "var(--lh-muted)",
            fontWeight: due.isToday ? 500 : 400,
          }}
        >
          <CalendarIcon size={13} />
          {due.label}
        </span>

        {/* Action buttons (show on hover) */}
        <div
          style={{
            display: "flex",
            gap: 4,
            opacity: showActions ? 1 : 0,
            transition: "opacity 0.12s",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
            title={task.completed ? "Mark pending" : "Mark done"}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: task.completed
                ? "1px solid var(--lh-accent-border)"
                : "1px solid var(--lh-border)",
              background: task.completed
                ? "var(--lh-accent-bg)"
                : "var(--lh-surface-2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: task.completed ? "var(--lh-accent-ink)" : "var(--lh-muted)",
              padding: 0,
              transition: "background 0.12s, border-color 0.12s, color 0.12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = task.completed
                ? "var(--lh-accent-bg)"
                : "var(--lh-surface-3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = task.completed
                ? "var(--lh-accent-bg)"
                : "var(--lh-surface-2)";
            }}
          >
            <CheckIcon size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            title="Edit"
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: "1px solid var(--lh-border)",
              background: "var(--lh-surface-2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--lh-muted)",
              padding: 0,
              transition: "background 0.12s, border-color 0.12s, color 0.12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--lh-surface-3)";
              e.currentTarget.style.color = "var(--lh-ink-2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--lh-surface-2)";
              e.currentTarget.style.color = "var(--lh-muted)";
            }}
          >
            <PencilIcon size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            title="Delete"
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: "1px solid var(--lh-border)",
              background: "var(--lh-surface-2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--lh-danger)",
              padding: 0,
              transition: "background 0.12s, border-color 0.12s, color 0.12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--lh-danger-bg)";
              e.currentTarget.style.borderColor = "#ecc9bd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--lh-surface-2)";
              e.currentTarget.style.borderColor = "var(--lh-border)";
            }}
          >
            <Trash2Icon size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
