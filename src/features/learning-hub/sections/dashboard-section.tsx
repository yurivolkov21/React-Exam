import { useMemo } from "react";
import { MomentumChart } from "../components/momentum-chart";
import { ProgressRing } from "../components/progress-ring";
import { StreakCard } from "../components/streak-card";
import type { StudyTask } from "../types";

type DashboardSectionProps = {
  taskStats: {
    total: number;
    completed: number;
    pending: number;
    progress: number;
    dueToday: number;
  };
  visibleTasks: StudyTask[];
  currentUserName?: string;
  onNavigateToTasks?: () => void;
};

const CARD_STYLE: React.CSSProperties = {
  background: "var(--lh-surface)",
  border: "1px solid var(--lh-border)",
  borderRadius: "var(--lh-r-lg)",
  boxShadow: "var(--lh-sh-sm)",
};

const SECTION_TITLE_STYLE: React.CSSProperties = {
  fontFamily: "var(--lh-font-display)",
  fontSize: 22,
  fontWeight: 500,
  color: "var(--lh-ink)",
  letterSpacing: "-0.02em",
  margin: 0,
};

export function DashboardSection({
  taskStats,
  visibleTasks,
  currentUserName,
  onNavigateToTasks,
}: DashboardSectionProps) {
  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return visibleTasks.filter((t) => t.dueDate === today || !t.completed).slice(0, 6);
  }, [visibleTasks]);

  const weekData = useMemo(() => {
    const today = new Date();
    const days: { label: string; count: number; isToday: boolean }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en", { weekday: "short" }).slice(0, 2);
      const count = visibleTasks.filter(
        (t) => t.completed && t.updatedAt?.slice(0, 10) === dayStr,
      ).length;
      days.push({ label, count, isToday: i === 0 });
    }

    return days;
  }, [visibleTasks]);

  const streakDays = useMemo(() => {
    const today = new Date();
    const todayIdx = today.getDay() === 0 ? 6 : today.getDay() - 1;
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      const diff = i - todayIdx;
      d.setDate(today.getDate() + diff);
      const dayStr = d.toISOString().slice(0, 10);
      return visibleTasks.some(
        (t) => t.completed && t.updatedAt?.slice(0, 10) === dayStr,
      );
    });
  }, [visibleTasks]);

  const streak = useMemo(() => {
    const today = new Date();
    let count = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const hadActivity = visibleTasks.some(
        (t) => t.completed && t.updatedAt?.slice(0, 10) === dayStr,
      );
      if (hadActivity) {
        count++;
      } else if (i > 0) {
        break;
      }
    }
    return count;
  }, [visibleTasks]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div style={{ padding: "24px 28px 40px", maxWidth: 1360, margin: "0 auto" }}>
      {/* Section head */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={SECTION_TITLE_STYLE}>
            {greeting}{currentUserName ? `, ${currentUserName}` : ""}.
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "var(--lh-muted)",
            }}
          >
            {taskStats.pending > 0
              ? `You have ${taskStats.pending} pending task${taskStats.pending !== 1 ? "s" : ""} today.`
              : "All tasks are done. Great work!"}
          </p>
        </div>

        <button
          onClick={onNavigateToTasks}
          style={{
            height: 36,
            padding: "0 14px",
            background: "var(--lh-accent)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--lh-r-sm)",
            fontSize: 13.5,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--lh-font-sans)",
            transition: "background 0.12s",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-accent-ink)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--lh-accent)"; }}
        >
          + New Task
        </button>
      </div>

      {/* Main 2-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.35fr 1fr",
          gap: 20,
        }}
        className="lh-dash-grid"
      >
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Progress card */}
          <div style={{ ...CARD_STYLE, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--lh-ink)",
                  }}
                >
                  Learning Progress
                </h2>
                <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--lh-muted)" }}>
                  {taskStats.completed} of {taskStats.total} tasks completed
                </p>
              </div>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: "var(--lh-accent-ink)",
                  background: "var(--lh-accent-bg)",
                  border: "1px solid var(--lh-accent-border)",
                  borderRadius: 999,
                  padding: "3px 10px",
                }}
              >
                {taskStats.dueToday} due today
              </span>
            </div>

            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <ProgressRing percent={taskStats.progress} size={160} label="Complete" />

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Total Tasks", value: taskStats.total, color: "var(--lh-ink)" },
                  { label: "Completed", value: taskStats.completed, color: "var(--lh-success)" },
                  { label: "Pending", value: taskStats.pending, color: "var(--lh-accent)" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontSize: 12, color: "var(--lh-muted)", fontWeight: 500 }}>
                        {label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--lh-font-display)",
                          fontSize: 18,
                          fontWeight: 500,
                          color,
                        }}
                      >
                        {value}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: "var(--lh-surface-3)",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${taskStats.total ? (value / taskStats.total) * 100 : 0}%`,
                          background: color,
                          borderRadius: 999,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Momentum chart */}
          <div style={{ ...CARD_STYLE, padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--lh-ink)" }}>
                Weekly Momentum
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--lh-muted)" }}>
                Tasks completed each day this week
              </p>
            </div>
            <MomentumChart data={weekData} />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Streak card */}
          <StreakCard streak={streak} weekDays={streakDays} />

          {/* Today's tasks */}
          <div style={{ ...CARD_STYLE, overflow: "hidden" }}>
            <div
              style={{
                padding: "18px 20px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--lh-border)",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--lh-ink)" }}>
                  Up Next
                </h2>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--lh-muted)" }}>
                  Your pending tasks
                </p>
              </div>
              <button
                onClick={onNavigateToTasks}
                style={{
                  height: 28,
                  padding: "0 10px",
                  background: "transparent",
                  border: "1px solid var(--lh-border-strong)",
                  borderRadius: "var(--lh-r-xs)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--lh-ink-2)",
                  cursor: "pointer",
                  fontFamily: "var(--lh-font-sans)",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--lh-surface-2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                View all
              </button>
            </div>

            <div style={{ padding: "8px 20px 20px" }}>
              {todayTasks.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0", color: "var(--lh-muted-2)" }}>
                  <p style={{ margin: 0, fontSize: 13 }}>No pending tasks.</p>
                  <p style={{ margin: "4px 0 0", fontSize: 11.5 }}>
                    Add tasks to see them here.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8 }}>
                  {todayTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "9px 0",
                        borderBottom: "1px solid var(--lh-border)",
                      }}
                    >
                      {/* Completion indicator */}
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          border: task.completed
                            ? "none"
                            : "1.5px solid var(--lh-border-strong)",
                          background: task.completed ? "var(--lh-accent)" : "transparent",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {task.completed && (
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path
                              d="M1 3.5L3.5 6L8 1"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 500,
                            color: task.completed ? "var(--lh-muted)" : "var(--lh-ink)",
                            textDecoration: task.completed ? "line-through" : "none",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {task.title}
                        </p>
                        <p style={{ margin: 0, fontSize: 11.5, color: "var(--lh-muted-2)" }}>
                          {task.subject}
                        </p>
                      </div>

                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color:
                            task.priority === "high"
                              ? "var(--lh-p-high)"
                              : task.priority === "medium"
                              ? "var(--lh-p-med)"
                              : "var(--lh-p-low)",
                          background:
                            task.priority === "high"
                              ? "var(--lh-danger-bg)"
                              : task.priority === "medium"
                              ? "var(--lh-warning-bg)"
                              : "#eef0ec",
                          borderRadius: 999,
                          padding: "2px 7px",
                          flexShrink: 0,
                        }}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
