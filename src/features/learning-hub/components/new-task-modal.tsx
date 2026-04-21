import type { FormEvent } from "react";

import { SUBJECT_OPTIONS } from "../constants";
import type { KanbanStatus, TaskPriority } from "../types";

type NewTaskModalProps = {
  editingTaskId: string | null;
  titleInput: string;
  subjectInput: string;
  priorityInput: TaskPriority;
  dueDateInput: string;
  kanbanStatusInput: KanbanStatus;
  onTitleInputChange: (value: string) => void;
  onSubjectInputChange: (value: string) => void;
  onPriorityInputChange: (value: TaskPriority) => void;
  onDueDateInputChange: (value: string) => void;
  onKanbanStatusInputChange: (value: KanbanStatus) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 38,
  padding: "0 12px",
  background: "var(--lh-surface)",
  border: "1px solid var(--lh-border-strong)",
  borderRadius: "var(--lh-r-sm)",
  fontSize: 13.5,
  color: "var(--lh-ink)",
  outline: "none",
  fontFamily: "var(--lh-font-sans)",
  transition: "border-color 0.12s, box-shadow 0.12s",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  paddingRight: 28,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2378716c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "var(--lh-muted)",
  marginBottom: 6,
  letterSpacing: "0.01em",
};

const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "var(--lh-accent)";
  e.target.style.boxShadow = "0 0 0 3px var(--lh-accent-bg)";
};
const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "var(--lh-border-strong)";
  e.target.style.boxShadow = "none";
};

export function NewTaskModal({
  editingTaskId,
  titleInput,
  subjectInput,
  priorityInput,
  dueDateInput,
  kanbanStatusInput,
  onTitleInputChange,
  onSubjectInputChange,
  onPriorityInputChange,
  onDueDateInputChange,
  onKanbanStatusInputChange,
  onSubmit,
  onClose,
}: NewTaskModalProps) {
  return (
    /* Overlay */
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26, 24, 21, 0.45)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backdropFilter: "blur(2px)",
      }}
    >
      {/* Dialog */}
      <div
        style={{
          background: "var(--lh-surface)",
          border: "1px solid var(--lh-border)",
          borderRadius: "var(--lh-r-xl)",
          boxShadow: "var(--lh-sh-lg)",
          width: "100%",
          maxWidth: 480,
          padding: 28,
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            borderRadius: "var(--lh-r-xs)",
            border: "1px solid var(--lh-border)",
            background: "var(--lh-surface-2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--lh-muted)",
            fontSize: 14,
            lineHeight: 1,
            fontFamily: "var(--lh-font-sans)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-surface-3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--lh-surface-2)"; }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              margin: "0 0 4px",
              fontFamily: "var(--lh-font-display)",
              fontSize: 20,
              fontWeight: 500,
              color: "var(--lh-ink)",
              letterSpacing: "-0.02em",
            }}
          >
            {editingTaskId ? "Edit task" : "New task"}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: "var(--lh-muted)" }}>
            {editingTaskId
              ? "Update the task details below."
              : "Add a study task. Keep the title tight and actionable."}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              placeholder="e.g. Review useEffect cleanup patterns"
              value={titleInput}
              onChange={(e) => onTitleInputChange(e.target.value)}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoFocus
            />
          </div>

          {/* Subject + Priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Subject</label>
              <select
                value={subjectInput}
                onChange={(e) => onSubjectInputChange(e.target.value)}
                style={selectStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                {SUBJECT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                value={priorityInput}
                onChange={(e) => onPriorityInputChange(e.target.value as TaskPriority)}
                style={selectStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due date + Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Due date</label>
              <input
                type="date"
                value={dueDateInput}
                onChange={(e) => onDueDateInputChange(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={kanbanStatusInput}
                onChange={(e) => onKanbanStatusInputChange(e.target.value as KanbanStatus)}
                style={selectStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 4,
              paddingTop: 16,
              borderTop: "1px solid var(--lh-border)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                height: 36,
                padding: "0 16px",
                background: "transparent",
                color: "var(--lh-muted)",
                border: "1px solid var(--lh-border-strong)",
                borderRadius: "var(--lh-r-sm)",
                fontSize: 13.5,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--lh-font-sans)",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-surface-2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                height: 36,
                padding: "0 20px",
                background: "var(--lh-accent)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--lh-r-sm)",
                fontSize: 13.5,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--lh-font-sans)",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-accent-ink)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--lh-accent)"; }}
            >
              {editingTaskId ? "Update task" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
