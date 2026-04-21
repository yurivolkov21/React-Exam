import { useState } from "react";
import type { StudyTask, TaskPriority } from "../types";

interface KanbanCardProps {
  task: StudyTask;
  onEdit: (task: StudyTask) => void;
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
  const due = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = due.getTime() - today.getTime();
  const days = Math.round(diff / 86400000);

  if (days < 0) return { label: `${Math.abs(days)}d overdue`, isOverdue: true, isToday: false };
  if (days === 0) return { label: "Due today", isOverdue: false, isToday: true };
  if (days === 1) return { label: "Due tomorrow", isOverdue: false, isToday: false };
  return { label: `Due in ${days}d`, isOverdue: false, isToday: false };
}

export function KanbanCard({ task, onEdit, onDelete, onDragStart }: KanbanCardProps) {
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
        onDragStart(e, task.id);
      }}
      onDragEnd={() => setIsDragging(false)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{
        background: "var(--lh-surface)",
        border: "1px solid var(--lh-border)",
        borderRadius: "var(--lh-r-md)",
        padding: 12,
        boxShadow: "var(--lh-sh-sm)",
        cursor: "grab",
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
          color: "var(--lh-ink)",
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
        }}
      >
        <span
          style={{
            fontSize: 11.5,
            color: due.isOverdue
              ? "var(--lh-danger)"
              : due.isToday
              ? "var(--lh-accent-ink)"
              : "var(--lh-muted)",
            fontWeight: due.isToday ? 500 : 400,
          }}
        >
          {due.label}
        </span>

        {/* Action buttons (show on hover) */}
        <div
          style={{
            display: "flex",
            gap: 2,
            opacity: showActions ? 1 : 0,
            transition: "opacity 0.12s",
          }}
        >
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
              fontSize: 12,
            }}
          >
            ✎
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
              fontSize: 12,
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
