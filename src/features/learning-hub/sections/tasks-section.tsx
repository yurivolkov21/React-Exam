import { useState } from "react";
import type { FormEvent } from "react";

import { KanbanColumn } from "../components/kanban-column";
import { SUBJECT_OPTIONS } from "../constants";
import type { KanbanStatus, StudyTask, TaskFilter, TaskPriority } from "../types";

type TasksSectionProps = {
  editingTaskId: string | null;
  titleInput: string;
  subjectInput: string;
  priorityInput: TaskPriority;
  dueDateInput: string;
  taskSearch: string;
  taskFilter: TaskFilter;
  visibleTasks: StudyTask[];
  filteredTasks: StudyTask[];
  onTitleInputChange: (value: string) => void;
  onSubjectInputChange: (value: string) => void;
  onPriorityInputChange: (value: TaskPriority) => void;
  onDueDateInputChange: (value: string) => void;
  onTaskSearchChange: (value: string) => void;
  onTaskFilterChange: (value: TaskFilter) => void;
  onSubmitTask: (event: FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
  onStartEditTask: (task: StudyTask) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask?: (taskId: string, status: KanbanStatus) => void;
};

const inputStyle: React.CSSProperties = {
  height: 36,
  padding: "0 12px",
  background: "var(--lh-surface)",
  border: "1px solid var(--lh-border-strong)",
  borderRadius: "var(--lh-r-sm)",
  fontSize: 13.5,
  color: "var(--lh-ink)",
  outline: "none",
  fontFamily: "var(--lh-font-sans)",
  transition: "border-color 0.12s, box-shadow 0.12s",
  boxSizing: "border-box" as const,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
  paddingRight: 28,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2378716c' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
};

export function TasksSection({
  editingTaskId,
  titleInput,
  subjectInput,
  priorityInput,
  dueDateInput,
  taskSearch,
  visibleTasks,
  filteredTasks,
  onTitleInputChange,
  onSubjectInputChange,
  onPriorityInputChange,
  onDueDateInputChange,
  onTaskSearchChange,
  onSubmitTask,
  onCancelEdit,
  onStartEditTask,
  onDeleteTask,
  onMoveTask,
}: TasksSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const getKanbanStatus = (task: StudyTask): KanbanStatus => {
    if (task.kanbanStatus) return task.kanbanStatus;
    return task.completed ? "done" : "pending";
  };

  const pendingTasks = filteredTasks.filter((t) => getKanbanStatus(t) === "pending");
  const inProgressTasks = filteredTasks.filter((t) => getKanbanStatus(t) === "in-progress");
  const doneTasks = filteredTasks.filter((t) => getKanbanStatus(t) === "done");

  const handleDrop = (taskId: string, status: KanbanStatus) => {
    if (onMoveTask) {
      onMoveTask(taskId, status);
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    onSubmitTask(e);
    setShowForm(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "var(--lh-accent)";
    e.target.style.boxShadow = "0 0 0 3px var(--lh-accent-bg)";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "var(--lh-border-strong)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={{ padding: "24px 28px 40px", maxWidth: 1360, margin: "0 auto" }}>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--lh-font-display)",
              fontSize: 22,
              fontWeight: 500,
              color: "var(--lh-ink)",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Task Board
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--lh-muted)" }}>
            {visibleTasks.length} total tasks · {visibleTasks.filter((t) => !t.completed).length} pending
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            height: 36,
            padding: "0 14px",
            background: showForm ? "var(--lh-ink-2)" : "var(--lh-ink)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--lh-r-sm)",
            fontSize: 13.5,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--lh-font-sans)",
            transition: "background 0.12s",
          }}
        >
          {editingTaskId ? "✎ Editing task" : showForm ? "✕ Cancel" : "+ New Task"}
        </button>
      </div>

      {/* Task form (collapsible) */}
      {(showForm || editingTaskId) && (
        <div
          style={{
            background: "var(--lh-surface)",
            border: "1px solid var(--lh-border)",
            borderRadius: "var(--lh-r-lg)",
            padding: 20,
            marginBottom: 20,
            boxShadow: "var(--lh-sh-sm)",
          }}
        >
          <h2
            style={{
              margin: "0 0 16px",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--lh-ink)",
            }}
          >
            {editingTaskId ? "Edit Task" : "New Task"}
          </h2>
          <form
            onSubmit={handleFormSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <input
              placeholder="Task title"
              value={titleInput}
              onChange={(e) => onTitleInputChange(e.target.value)}
              style={{ ...inputStyle, gridColumn: "1 / -1" }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
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
            <select
              value={priorityInput}
              onChange={(e) => onPriorityInputChange(e.target.value as TaskPriority)}
              style={selectStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <input
              type="date"
              value={dueDateInput}
              onChange={(e) => onDueDateInputChange(e.target.value)}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                style={{
                  height: 36,
                  padding: "0 14px",
                  background: "var(--lh-ink)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--lh-r-sm)",
                  fontSize: 13.5,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "var(--lh-font-sans)",
                }}
              >
                {editingTaskId ? "Update" : "Add Task"}
              </button>
              {editingTaskId && (
                <button
                  type="button"
                  onClick={() => { onCancelEdit(); setShowForm(false); }}
                  style={{
                    height: 36,
                    padding: "0 14px",
                    background: "transparent",
                    color: "var(--lh-muted)",
                    border: "1px solid var(--lh-border-strong)",
                    borderRadius: "var(--lh-r-sm)",
                    fontSize: 13.5,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--lh-font-sans)",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <input
          value={taskSearch}
          onChange={(e) => onTaskSearchChange(e.target.value)}
          placeholder="Search tasks..."
          style={{
            ...inputStyle,
            flex: 1,
            maxWidth: 320,
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SUBJECT_OPTIONS.map((subj) => (
            <button
              key={subj}
              onClick={() => onTaskSearchChange(taskSearch === subj ? "" : subj)}
              style={{
                height: 26,
                padding: "0 10px",
                background: taskSearch === subj ? "var(--lh-ink)" : "var(--lh-surface-2)",
                color: taskSearch === subj ? "#fff" : "var(--lh-ink-2)",
                border: `1px solid ${taskSearch === subj ? "var(--lh-ink)" : "var(--lh-border)"}`,
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "var(--lh-font-sans)",
                transition: "all 0.12s",
              }}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        <KanbanColumn
          title="Pending"
          status="pending"
          tasks={pendingTasks}
          onEdit={(task) => { onStartEditTask(task); setShowForm(true); }}
          onDelete={onDeleteTask}
          onDrop={handleDrop}
        />
        <KanbanColumn
          title="In Progress"
          status="in-progress"
          tasks={inProgressTasks}
          onEdit={(task) => { onStartEditTask(task); setShowForm(true); }}
          onDelete={onDeleteTask}
          onDrop={handleDrop}
        />
        <KanbanColumn
          title="Done"
          status="done"
          tasks={doneTasks}
          onEdit={(task) => { onStartEditTask(task); setShowForm(true); }}
          onDelete={onDeleteTask}
          onDrop={handleDrop}
        />
      </div>

      {visibleTasks.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            color: "var(--lh-muted-2)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              background: "var(--lh-surface-2)",
              border: "1px solid var(--lh-border)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 22,
            }}
          >
            ☑
          </div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--lh-ink)" }}>
            No tasks yet
          </p>
          <p style={{ margin: "6px 0 0", fontSize: 12.5, maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>
            Click "New Task" to add your first study task.
          </p>
        </div>
      )}
    </div>
  );
}
