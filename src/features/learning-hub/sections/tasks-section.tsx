import type { StudyTask, KanbanStatus, TaskFilter } from "../types";
import { KanbanColumn } from "../components/kanban-column";
import { SUBJECT_OPTIONS } from "../constants";

type TasksSectionProps = {
  taskSearch: string;
  taskFilter: TaskFilter;
  visibleTasks: StudyTask[];
  filteredTasks: StudyTask[];
  onTaskSearchChange: (value: string) => void;
  onTaskFilterChange: (value: TaskFilter) => void;
  onStartEditTask: (task: StudyTask) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask?: (taskId: string, status: KanbanStatus) => void;
  onOpenNewTask?: () => void;
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

const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "var(--lh-accent)";
  e.target.style.boxShadow = "0 0 0 3px var(--lh-accent-bg)";
};
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "var(--lh-border-strong)";
  e.target.style.boxShadow = "none";
};

export function TasksSection({
  taskSearch,
  visibleTasks,
  filteredTasks,
  onTaskSearchChange,
  onStartEditTask,
  onDeleteTask,
  onMoveTask,
  onOpenNewTask,
}: TasksSectionProps) {
  const getKanbanStatus = (task: StudyTask): KanbanStatus => {
    if (task.kanbanStatus) return task.kanbanStatus;
    return task.completed ? "done" : "pending";
  };

  const pendingTasks = filteredTasks.filter((t) => getKanbanStatus(t) === "pending");
  const inProgressTasks = filteredTasks.filter((t) => getKanbanStatus(t) === "in-progress");
  const doneTasks = filteredTasks.filter((t) => getKanbanStatus(t) === "done");

  const handleDrop = (taskId: string, status: KanbanStatus) => {
    onMoveTask?.(taskId, status);
  };

  const openCount = visibleTasks.filter((t) => !t.completed).length;

  return (
    <div style={{ padding: "28px 28px 40px", maxWidth: 1360, margin: "0 auto" }}>
      {/* ── Section header ── */}
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontFamily: "var(--lh-font-display)",
            fontSize: 28,
            fontWeight: 500,
            color: "var(--lh-ink)",
            letterSpacing: "-0.03em",
            margin: "0 0 6px",
            lineHeight: 1.15,
          }}
        >
          Tasks
        </h1>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--lh-muted)" }}>
          Drag cards between columns to update status.{" "}
          {visibleTasks.length} total · {openCount} open.
        </p>
      </div>

      {/* ── Search + subject filter ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <input
          value={taskSearch}
          onChange={(e) => onTaskSearchChange(e.target.value)}
          placeholder="Search by title or subject"
          style={{ ...inputStyle, flex: "0 0 260px" }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            onClick={() => onTaskSearchChange("")}
            style={{
              height: 30,
              padding: "0 12px",
              background: !taskSearch ? "var(--lh-ink)" : "var(--lh-surface-2)",
              color: !taskSearch ? "#fff" : "var(--lh-ink-2)",
              border: `1px solid ${!taskSearch ? "var(--lh-ink)" : "var(--lh-border)"}`,
              borderRadius: 999,
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--lh-font-sans)",
              transition: "all 0.12s",
            }}
          >
            All subjects
          </button>
          {SUBJECT_OPTIONS.map((subj) => (
            <button
              key={subj}
              onClick={() => onTaskSearchChange(taskSearch === subj ? "" : subj)}
              style={{
                height: 30,
                padding: "0 12px",
                background: taskSearch === subj ? "var(--lh-ink)" : "var(--lh-surface-2)",
                color: taskSearch === subj ? "#fff" : "var(--lh-ink-2)",
                border: `1px solid ${taskSearch === subj ? "var(--lh-ink)" : "var(--lh-border)"}`,
                borderRadius: 999,
                fontSize: 12.5,
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

      {/* ── Kanban board ── */}
      {visibleTasks.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
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
          <p style={{ margin: "6px 0 16px", fontSize: 12.5, maxWidth: 280, marginLeft: "auto", marginRight: "auto" }}>
            Click "+ New task" in the topbar to add your first study task.
          </p>
          <button
            onClick={onOpenNewTask}
            style={{
              height: 36,
              padding: "0 16px",
              background: "var(--lh-accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--lh-r-sm)",
              fontSize: 13.5,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--lh-font-sans)",
            }}
          >
            + New task
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
          className="lh-kanban-grid"
        >
          <KanbanColumn
            title="Pending"
            status="pending"
            tasks={pendingTasks}
            onEdit={onStartEditTask}
            onDelete={onDeleteTask}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="In Progress"
            status="in-progress"
            tasks={inProgressTasks}
            onEdit={onStartEditTask}
            onDelete={onDeleteTask}
            onDrop={handleDrop}
          />
          <KanbanColumn
            title="Done"
            status="done"
            tasks={doneTasks}
            onEdit={onStartEditTask}
            onDelete={onDeleteTask}
            onDrop={handleDrop}
          />
        </div>
      )}
    </div>
  );
}
